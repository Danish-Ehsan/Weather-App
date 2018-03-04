(function() {

	var clockDisplay = document.getElementById('time');
	var dateDisplay = document.getElementById('date');
	var monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
	var syncStart;

	function updateClock() {
		var today = new Date();
		var secs = today.getSeconds();
		var hours = today.getHours();
		var ampm = 'am';
		var minutes = today.getMinutes();
		var date = today.getDate();
		var month = today.getMonth();
		var year = today.getFullYear();

		(function formatTime() {
			//convert to 12hr clock
			if (hours > 12) {
				hours -= 12;
				ampm = 'pm';
			} 

			hours = hours ? hours : 12;		//change 0 hour to 12
			hours = hours < 10 ? '0' + hours : hours;

			minutes = minutes < 10 ? '0' + minutes : minutes;
			
			month = monthNames[month];

		}());

		syncStart = (60 - secs) * 1000;


	};
	updateClock();

	var	syncClock = setTimeout(function() {
			console.log('syncing clock...');
			startClock();
		}, syncStart);

	function startClock() {
		updateClock();
		setInterval(function() {
			updateClock();
			//console.log('Clock updated!');
		}, 60000);
	}

}());