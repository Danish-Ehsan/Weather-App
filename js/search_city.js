(function() {

	var srchButton = document.getElementById('submitButton');
	var srchBox = document.getElementById('searchInput');
	var srchList = document.getElementById('searchList');
	var contents = document.getElementsByClassName('content');
	var errors = document.getElementById('errors');                    
	var srchInput;

	var apiKey = 'AIzaSyC4GfWG44DvPY3RWl3omZnLGk9aVU7On4U';
	var map = new google.maps.Map(document.createElement('div'));
	var service = new google.maps.places.PlacesService(map);
	var serviceAC = new google.maps.places.AutocompleteService();

	var lat, lng, placeId, location;


	(function init() {
		//srchBox.focus();

		var request = {
			query: 'Oakville, Ontario, Canada'
		}
		service.textSearch(request, callback);
	}());


	srchButton.addEventListener('click', function(e) {
		if (srchBox.value.length) {
			searchCity(e);
			srchList.style.display = 'none';
		}
	});


	srchBox.addEventListener('keyup', function(e) {
		var key = e.keyCode || e.which;

		if (key == 13) {	//Press enter to search
			searchCity(e);
			srchList.style.display = 'none';
		} else if (key == 40) {
			iSrchList = 0;
			srchList.children[0].children[0].focus();
		} else {
			autoComplete();
		}
	});


	srchList.addEventListener('click', function(e) {
		e.preventDefault();
		var target = e.target;
		//console.log(target.href);

		var request = {
			placeId: target.getAttribute('href')
		};

		service.getDetails(request, callback);
		srchList.style.display = 'none';
	});

	var iSrchList = 0;

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
		}
	});


	function autoComplete() {
		var userInput = srchBox.value;
		//console.log('userInput Length = ' + userInput.length);
		if (userInput.length > 1) {
			var updateList = function(predictions, status) {
				if (status == 'OK') {
					//console.log(predictions);
					srchList.innerHTML = '';
					srchList.style.display = 'block';
					for (var i = 0; i < 5; i++) {		//show the first 5 results from the list
						if (predictions[i]) {
							var node = document.createElement('li');
							var linkNode = document.createElement('a');
							//linkNode.href = '#';
							var textNode = document.createTextNode(predictions[i].description);
							linkNode.appendChild(textNode);
							linkNode.href = predictions[i].place_id;
							node.appendChild(linkNode);
							//console.log(node.data);
							srchList.appendChild(node);
						}
					}
				} else {
					console.log(status);
				}
			}
			serviceAC.getPlacePredictions({input: userInput}, updateList);
		} else {
			srchList.innerHTML = '';
		}
	}


	function searchCity(e) {
		e.preventDefault;
		srchButton.src = 'images/loading_apple.gif';
		srchInput = srchBox.value;
		//console.log('searchInput = ' + srchInput);

		var request = {
			query: srchInput
		}

		errors.innerText = '';
		errors.style.display = 'none';
		service.textSearch(request, callback);
	}


	function callback(results, status) {
		errors.innerText = '';
		errors.style.display = 'none';
		if (status == 'OK') {
			if (results.length) {
				results = results[0];
			}
			//console.log(results);
			//console.log('results length = ' + results.length);
			//console.log('formatted address = ' + results.formatted_address);
			//console.log(results.geometry.location.lat());

			lat = results.geometry.location.lat();
			lng = results.geometry.location.lng();
			placeId = results.place_id;

			/*Search results no longer includes the city name in the 'formatted_address' while details search dles
			Only details search results include 'address_components' therefore it's used to check which way address
			should be formatted
			*/
			if (results.address_components) { 
				location = results.formatted_address;
			} else {
				location = results.name + ', ' + results.formatted_address;
			}

			var request = {
				placeId: placeId
			};

			service.getDetails(request, updateInfo);

			srchBox.value = '';
			//document.getElementsByClassName('city')[0].textContent = results.formatted_address;
		} else if (status == 'ZERO_RESULTS') {
			console.log(status);
			errors.innerText = 'Your search returned no results.';
			errors.style.display = 'block';
		} else {
			console.log(status);
			errors.innerText = 'There was an error with the search. Please try again.';
			errors.style.display = 'block';
		}
		srchButton.src = 'images/Submit.png';
		srchList.style.display = 'none';
	}


	//callback to get timezone and trigger weather and clock update
	function updateInfo(results, status) {
		if (status == 'OK') {
			var utcOffset = results.utc_offset;
			updateClock(utcOffset, true);
			getWeather(lng, lat, location, utcOffset);
		} else {
			console.log('There was an error getting the UTC offset for this location')
		}
	}

}());