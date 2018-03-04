(function() {

	var srchButton = document.getElementById('submit');
	var srchBox = document.getElementById('searchBox');
	var srchInput;
	var apiKey = 'AIzaSyD9prxTT2Iqf-Hyk3jTThRWnwH_AZOTycM';

	console.log('search city test');

	srchButton.addEventListener('click', function(e) {
		search(e);
	});

	function search(e) {
		e.preventDefault;
		srchInput = srchBox.value;
		console.log(srchInput);

		var requestLink = 'https://maps.googleapis.com/maps/api/place/textsearch/json?&query=' + srchInput + '&key=' + apiKey + '&type=region';
		console.log(requestLink);

		var xhr = new XMLHttpRequest();

		xhr.onload = function() {
			if (xhr.status === 200) {
				var responseString = xhr.responseText
				var responseObject = JSON.parse(responseString);
				console.log(responseObject);
			}
		}

		xhr.open('GET', requestLink, true);
		xhr.send(null);
	}

}());