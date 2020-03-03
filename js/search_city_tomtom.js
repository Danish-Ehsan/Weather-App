(function() {

	var srchButton = document.getElementById('submitButton');
	var srchBox = document.getElementById('searchInput');
	var srchList = document.getElementById('searchList');
	var contents = document.getElementsByClassName('content');
	var errors = document.getElementById('errors');                    
	var srchInput;

	var lat, lng, placeId, location;

	var autoCompleteTimer;
	var iSrchList = 0;

	(function init() {
		//srchBox.focus();

		searchCity('Toronto');
	}());


	srchButton.addEventListener('click', function(e) {
		if (srchBox.value.length) {
			searchCity(srchBox.value);
			srchList.style.display = 'none';
		}
	});


	srchBox.addEventListener('keyup', function(e) {
		var key = e.keyCode || e.which;
		if (key == 13) {	//Press enter to search
			clearTimeout(autoCompleteTimer);
			searchCity(srchBox.value);
			srchList.style.display = 'none';
		} else if (key == 40) {
			clearTimeout(autoCompleteTimer);
			iSrchList = 0;
			srchList.children[0].children[0].focus();
		} else if (key == 27) { 
			srchList.style.display = 'none';
		} else {
			clearTimeout(autoCompleteTimer);
			autoCompleteTimer = setTimeout(function() {
				autoComplete();
			}, 350);
		}
	});


	srchList.addEventListener('click', function(e) {
		e.preventDefault();
		var target = e.target;
		getWeather(parseFloat(target.getAttribute('data-lon')), parseFloat(target.getAttribute('data-lat')), target.textContent );
		srchList.innerHTML = '';
		srchList.style.display = 'none';
	});


	//enable arrow scrolling through search list
	srchList.addEventListener('keyup', function(e) {
		var key = e.keyCode || e.which;
		//console.log('srchList.length= ' + srchList.children.length);

		if (key == 40 && iSrchList < srchList.children.length - 1) {
			iSrchList++;
			//console.log('i= ' + iSrchList);
			srchList.children[iSrchList].children[0].focus();
		} else if (key == 38 && iSrchList > 0) {
			iSrchList--;
			//console.log('i= ' + iSrchList);
			srchList.children[iSrchList].children[0].focus();
		} else if (key == 38 && iSrchList === 0) {
			srchBox.focus();
		} else if (key == 27) {
			srchBox.focus();
			srchList.style.display = 'none';
		}
	});


	function autoComplete() {
		var userInput = srchBox.value;
		//console.log('userInput Length = ' + userInput.length);
		if (userInput.length > 1) {
			var xhr = new XMLHttpRequest();

			xhr.onload = function() {
				srchButton.src = 'images/Submit.png';
				srchList.style.display = 'none';
				if (xhr.status === 200) {
					var responseString = xhr.responseText;
					var responseObject = JSON.parse(responseString);
					//console.log('responseString: ' + responseString);

					if (responseObject.results.length) {
						srchList.innerHTML = '';
						srchList.style.display = 'block';
						for (var i = 0; i < 5; i++) {		//show the first 5 results from the list
							if (responseObject.results[i]) {
								var node = document.createElement('li');
								var linkNode = document.createElement('a');
								//linkNode.href = '#';
								var textNode = document.createTextNode(responseObject.results[i].address.freeformAddress + ', ' + responseObject.results[i].address.country);
								linkNode.appendChild(textNode);
								linkNode.setAttribute('href', '#');
								linkNode.setAttribute('data-lat', responseObject.results[i].position.lat);
								linkNode.setAttribute('data-lon', responseObject.results[i].position.lon);
								//linkNode.href = predictions[i].place_id;
								node.appendChild(linkNode);
								//console.log(node.data);
								srchList.appendChild(node);
							}
						}
					}
				} else {
					console.log('There was an error retrieving JSON data');
					errors.innerText = 'There was an error retrieving search data';
					errors.style.display = 'block';
				}
			}

			var requestLink = 'https://api.tomtom.com/search/2/search/' + userInput + '.json?limit=5&key=1psTVOFfJuX2l30e9QyUWdZ6uqGhT3EI&typeahead=true';
			xhr.open('GET', requestLink, true);
			xhr.send(null);
		} else {
			srchList.innerHTML = '';
		}
	}
	

	function searchCity(srchInput) {
		//e.preventDefault;
		srchButton.src = 'images/loading_apple.gif';
		//srchInput = srchBox.value;
		//console.log('searchInput = ' + srchInput);

		errors.innerText = '';
		errors.style.display = 'none';
		

		var xhr = new XMLHttpRequest();

		xhr.onload = function() {
			srchButton.src = 'images/Submit.png';
			srchList.style.display = 'none';
			if (xhr.status === 200) {
				var responseString = xhr.responseText;
				var responseObject = JSON.parse(responseString);

				if (responseObject.results.length) {
					var results = responseObject.results[0];
					lat = results.position.lat;
					lng = results.position.lon;
					location = results.address.freeformAddress + ', ' + results.address.country;
					getWeather(lng, lat, location);
				} else {
					errors.innerText = 'Your search returned no results.';
					errors.style.display = 'block';
				}
			} else {
				console.log('There was an error retrieving JSON data');
				errors.innerText = 'There was an error retrieving search data';
				errors.style.display = 'block';
			}
		}

		var requestLink = 'https://api.tomtom.com/search/2/search/' + srchInput + '.json?limit=1&key=1psTVOFfJuX2l30e9QyUWdZ6uqGhT3EI';

		xhr.open('GET', requestLink, true);
		xhr.send(null);
	}

}());