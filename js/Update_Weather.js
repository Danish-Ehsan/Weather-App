//(function() {

	var apiKey = '349cbe8893d77f12aa04e0b66eefb9b9';
	var gpsButton = document.getElementById('gpsButton');
	var weatherIcon = document.getElementsByClassName('weatherIcon');
	var errors = document.getElementById('errors');
	var forecast = document.getElementsByClassName('forecast');
	var city = document.getElementsByClassName('city');
	var temp = document.getElementsByClassName('temp');
	var srchList = document.getElementById('searchList');
	var srchButton = document.getElementById('submitButton');
	var celsiusMode = true;
	var celsius, fahrenheit;

	//moreInfo variables
	var sunriseDisplay = document.getElementsByClassName('srTime');
	var sunsetDisplay = document.getElementsByClassName('ssTime');
	var windArrow = document.getElementById('arrow');
	var windSpeedDisplay = document.getElementsByClassName('windSpeed');
	var cloudPercentDisplay = document.getElementsByClassName('cldPercent');
	var humidityPercentDisplay = document.getElementsByClassName('humPercent');

	var moreInfoButton = document.getElementById('moreInfoButton');
	var moreInfoPanels = document.getElementsByClassName('moreInfo');
	var moreInfoExtended = false;

	//generate location
	function getLocation() {
		srchButton.src = 'images/loading_apple.gif';
		errors.innerText = '';
		errors.style.display = 'none';

		navigator.geolocation.getCurrentPosition(success, fail);

		function success(position) {
			var lng = position.coords.longitude;
			var lat = position.coords.latitude;

			getWeather(lng, lat);
			updateClock(undefined, true);
			srchButton.src = 'images/Submit.png';
		}

		function fail() {
			console.log('Failed to retrieve location');
			errors.innerText = 'Failed to retrieve your location.';
			errors.style.display = 'block';
			srchButton.src = 'images/Submit.png';
		}
	}

	function tempMode() {
		celsiusMode = !celsiusMode;
		celsiusMode ? animate(temp, celsius) : animate(temp, fahrenheit);
	}

	gpsButton.addEventListener('click', getLocation);


	//Ajax request
	function getWeather(lng, lat, location, utcOffset) {
		var xhr = new XMLHttpRequest();

		xhr.onload = function() {
			if(xhr.status === 200) {
				var responseString = xhr.responseText;
				responseObject = JSON.parse(responseString);

				var cityName = responseObject.name + ', ' + responseObject.sys.country;
				var outlook = responseObject.weather[0].description;
				var kelvin = responseObject.main.temp;
				var iconCode = responseObject.weather[0].icon;
				var imageLink = 'http://openweathermap.org/img/w/' + iconCode + '.png';
				fahrenheit = Math.round(kelvin * (9/5) - 459.67) + '°' + 'F';
				celsius = Math.round(kelvin - 273.15) + '°' + 'C';

				//moreInfo
				var sunriseUTC = formatUnixTime(responseObject.sys.sunrise);
				var sunsetUTC = formatUnixTime(responseObject.sys.sunset);

				var formatSunrise = formatTime(utcOffset, sunriseUTC.hours, sunriseUTC.minutes);
				var sunriseTime = formatSunrise.hours + ':' + formatSunrise.minutes;
				var formatSunset = formatTime(utcOffset, sunsetUTC.hours, sunsetUTC.minutes);
				var sunsetTime = formatSunset.hours + ':' + formatSunset.minutes;

				var windDeg = Math.floor(responseObject.wind.deg);
				var windSpeed = Math.floor(responseObject.wind.speed * 2.23694) + " MPH";
				var cloudPercent = responseObject.clouds.all + '%';
				var humidityPercent = responseObject.main.humidity + '%';

				animate(forecast, outlook);
				animate(weatherIcon, imageLink);
				celsiusMode ? animate(temp, celsius) : animate(temp, fahrenheit);
				location ? animate(city, location) : animate(city, cityName);

				//moreInfo
				if (moreInfoExtended) {
					animate(sunriseDisplay, sunriseTime);
					animate(sunsetDisplay, sunsetTime);
					windArrow.style.transform = 'rotate(' + windDeg + 'deg)';
					animate(windSpeedDisplay, windSpeed);
					animate(cloudPercentDisplay, cloudPercent);
					animate(humidityPercentDisplay, humidityPercent);
				} else {
					sunriseDisplay[0].innerText = sunriseTime;
					sunsetDisplay[0].innerText = sunsetTime;
					windArrow.style.transform = 'rotate(' + windDeg + 'deg)';
					windSpeedDisplay[0].innerText = windSpeed;
					cloudPercentDisplay[0].innerText = cloudPercent;
					humidityPercentDisplay[0].innerText = humidityPercent;
				}

			} else {
				console.log('There was an error retrieving JSON data');
			}
		}

		var requestLink = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&APPID=' + apiKey;

		xhr.open('GET', requestLink, true);
		xhr.send(null);

		//closes search list if autocomplete list is still loading after enter is pressed
		//srchList.style.display = 'none';
		//api.openweathermap.org/data/2.5/weather?lat=43.4733459&lon=-79.6969802&APPID=349cbe8893d77f12aa04e0b66eefb9b9
	}


	function animate(element, content) {
		var cloneElem = element[0].cloneNode(false);
		var delay = (Math.random() * 2).toFixed(2) * 100;	//offset animations

		if (element === weatherIcon) {
			cloneElem.src = content;
		} else {
			cloneElem.innerText ? cloneElem.innerText = content : cloneElem.textContent = content;
		}

		if (element === temp) {
			//debugger;
			var newColorClass = getTempColor(celsius);
			cloneElem.className = 'content temp ' + newColorClass;
			var tempArrow = document.createElement('span');
			tempArrow.innerHTML = '&#8227;';
			cloneElem.appendChild(tempArrow);
			cloneElem.addEventListener('click', tempMode);
		}

		cloneElem.setAttribute('style', 'top: 0; transform: translate(-50%, -100%); opacity: 0.2;');
		element[0].parentElement.appendChild(cloneElem);
		
		setTimeout(function() {
			//following lines use .length for index to account for multiple clicks while still animating
			element[(element.length - 2)].setAttribute('style', 'top: 100%; transform: translate(-50%, 0); opacity: 0.2;');
			element[(element.length - 1)].setAttribute('style', 'top: 50%; transform: translate(-50%, -50%); opacity: 1;');
			setTimeout(function() {
				element[0].parentElement.removeChild(element[0]);
			}, 1200); //delay by length of CSS transition
		}, delay);
	}


	//generate temperature color class
	function getTempColor(temp) {
		var tempNum = parseInt(temp);
		switch(true) {
			case tempNum > 28:
				return 'tempWarmest';
				break;
			case tempNum > 17:
				return 'tempWarmer';
				break;
			case tempNum > 12:
				return 'tempWarm';
				break;
			case tempNum > 4:
				return 'tempNeutral';
				break;
			case tempNum > -8:
				return 'tempCold';
				break;
			case tempNum > -18:
				return 'tempColder';
				break;
			case tempNum < -20:
				return 'tempColdest';
				break;
		}
	}


	moreInfoButton.addEventListener('click', moreInfoToggle);

	function formatUnixTime(UnixTimestamp) {
		var newDate = new Date(UnixTimestamp * 1000);
		var hours = newDate.getUTCHours();
		var minutes = newDate.getUTCMinutes();

		return {
			hours: hours,
			minutes: minutes
		}
	}

	function moreInfoToggle() {
		moreInfoExtended = !moreInfoExtended;
		if (moreInfoExtended) {
			moreInfoButton.innerHTML = '<span class="open">&#8227;</span>show less info<span class="open">&#8227;</span>';
		} else {
			moreInfoButton.innerHTML = '<span>&#8227;</span>show more info<span>&#8227;</span>';
		}
		for (var i = 0; i < moreInfoPanels.length; i++) {
			moreInfoPanels[i].classList.toggle('collapsed');
		}
	}



//}());