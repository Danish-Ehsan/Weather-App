(function() {

	var clockDisplay = document.getElementById('time');
	var dateDisplay = document.getElementById('date');

	function updateClock() {
		var today = new Date();
		var hours = formatHours();
		var minutes = formatMinutes();
		var date = today.getDate();
		var month = formatMonth();
		var year = today.getFullYear();

		function formatHours() {
			//convert to 12hr clock
			var hours = today.getHours();
			if (hours > 12) {
				hours -= 12;
			} else if (hours == 0) {
				hours = 12;
			}

			if (hours < 10 || (hours > 12 && hours < 21)) {
				hours = '0' + hours;
			}
			return hours;
		};

		function formatMinutes() {
			var minutes = today.getMinutes();
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			return minutes;
		};

		function formatMonth() {
				var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
				var thisMonth = months[today.getMonth()];
				return thisMonth;
			};

		//console.log('Date: ' + month + ' ' + date + ', ' + year);
		//console.log('Time: ' + hours + ':' + minutes);

		clockDisplay.textContent = hours + ':' + minutes;
		dateDisplay.textContent = month + ' ' + date + ', ' + year;

	};

	updateClock();

	setInterval(function() {
		updateClock();
		//console.log('Clock updated!');
	}, 30000);

}());