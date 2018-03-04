(function() {

	var apiKey = '349cbe8893d77f12aa04e0b66eefb9b9';
	var lng, lat;

	//generate location
	navigator.geolocation.getCurrentPosition(success, fail);

	function success(position) {
		lng = position.coords.longitude;
		lat = position.coords.latitude;

		console.log('long: ' + lng);
		console.log('lat: ' + lat);

		var requestLink = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&APPID=' + apiKey + '&callback=ajaxReq';
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = requestLink;

		console.log(requestLink);
		console.log(script);
		document.body.appendChild(script);

	}

	function fail() {
		console.log('Failed to retrieve location');
	}

	console.log('long: ' + lng);
	console.log('lat: ' + lat);

}());


	//Ajax request

	function getWeather(data) {

		var location = data.name;
		var outlook = data.weather[0].description;
		var temp = data.main.temp;
		var celsius = Math.round(temp - 273.15) + '°' + 'C';

		document.getElementById('forecast').textContent = outlook;
		document.getElementById('city').textContent = location;
		document.getElementById('temp').textContent = celsius;

		console.log('Location: ' + location);
		console.log('Weather: ' + outlook);
		console.log('Temp: ' + temp);
		console.log('Celsius: ' + celsius);
	}

//Google places API key: AIzaSyD9prxTT2Iqf-Hyk3jTThRWnwH_AZOTycM