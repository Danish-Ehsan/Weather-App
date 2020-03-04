//(function() {

	var clockDisplay = document.getElementsByClassName('digitCont');
	var dateDisplay = document.getElementsByClassName('date');
	var ampmDisplay = document.getElementsByClassName('ampm');
	var monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
	var syncTimer, clockTimer, currentOffset;

	function updateClock(utcOffset, shouldSync) {
		var today = new Date();
		var secs = today.getSeconds();
		var hours = utcOffset == undefined ? today.getHours() : today.getUTCHours();	//still get UTC hours if offset is defined but = 0
		var minutes = utcOffset == undefined ? today.getMinutes() : today.getUTCMinutes();
		var date = utcOffset == undefined ? today.getDate() : today.getUTCDate();
		var month = utcOffset == undefined ? today.getMonth() : today.getUTCMonth();
		var year = utcOffset == undefined ? today.getFullYear() : today.getUTCFullYear();

		currentOffset = utcOffset;

		var formattedTime = formatTime(utcOffset, hours, minutes, date, month, year, true);

		var time = formattedTime.hours.toString() + formattedTime.minutes.toString();

		if (dateDisplay[0].innerText.toLowerCase() != formattedTime.fullDate.toLowerCase()) {
			animate(dateDisplay, formattedTime.fullDate);
		}

		//ampmDisplay index uses .length-1 to account for syncing before animation has finished
		if (ampmDisplay[(ampmDisplay.length - 1)].innerText.toLowerCase() != formattedTime.ampm.toLowerCase()) {
			animate(ampmDisplay, formattedTime.ampm);
		}

		for (var i = 0; i < clockDisplay.length; i++) {
				//clockDisplay[i].innerText = time[i];
				animateClock(clockDisplay[i], time[i]);
		}

		//cloneElem.innerText ? cloneElem.innerText = content : cloneElem.textContent = content;
		var syncStart = (60 - secs) * 1000;
		if (shouldSync) { syncClock(syncStart); }	//sync if not called by startClock()
	};

	function formatTime(utcOffset, hours, minutes, date, month, year, twelveHour) {

		var ampm = 'am';
		var fullDate;

		if (utcOffset) {
			var offsetHrs = Math.floor(utcOffset / 60);
			var offsetMins = utcOffset % 60;

			hours += offsetHrs;
			minutes += offsetMins;

			if (hours < 0) {
				hours += 24;
				if (date) {
					if (date === 1) {	//change to previous month and check number of days prev month
						newMonth = month - 1;		
						var dayTotal = daysInMonth(month, year);
						date = dayTotal;
						month === 0 ? month = 11 : month -= 1;
					} else {
						date -= 1;
					}
				}
			} else if (hours >= 24) {
				hours -= 24;
				if (date) {
					if (date > 27) {	//check if month should change
						var dayTotal = daysInMonth((month + 1), year);

						if ((date + 1) > dayTotal) {
							date = 1;
							month === 11 ? month = 0 : month += 1;
						} else {
							date += 1;
						}
					} else {
						date += 1;
					}
				}
			}

			if (minutes < 0) {
				minutes += 60;
			} else if (minutes > 60) {
				minutes -= 60;
			}
		}


		(function formatclock() {
			if (twelveHour) {
				ampm = hours >= 12 ? 'pm' : 'am';
				
				//convert to 12hr clock
				if (hours > 12) {
					hours -= 12;
				} 

				hours = hours ? hours : 12;		//change 0 hour to 12
			}

			hours = hours < 10 ? '0' + hours : hours;
			minutes = minutes < 10 ? '0' + minutes : minutes;

			if (month) {
				month = monthNames[month];
				fullDate = month + ' ' + date + ', ' + year;
			}
		}());

		return {
			hours: hours,
			minutes: minutes,
			ampm: ampm ? ampm : undefined,
			fullDate: fullDate ? fullDate : undefined
		}
	}


	function daysInMonth(month, year) {
		return new Date(year, month, 0).getDate();
	}


	//updateClock();

	function syncClock(syncStart) {
		//console.log('syncTimer= ' + syncTimer);
		//console.log('clockTimer= ' + clockTimer);
		if (syncTimer) { clearTimeout(syncTimer); }
		if (clearInterval) { clearInterval(clockTimer); }

		syncTimer = setTimeout(function() {
				console.log('syncing clock...');
				startClock();
			}, syncStart);
	}


	//start clock runs another time everytime the update clock is called
	function startClock() {
		updateClock(currentOffset);
		clockTimer = setInterval(function() {
			updateClock(currentOffset);
			//console.log('Clock updated!');
		}, 60000);
	}


	function animateClock(element, content) {
		//index uses .length-1 to account for clock syncing before animation has finished
		if (element.children[(element.children.length - 1)].innerText != content) {
			var delay = (Math.random() * 5).toFixed(2) * 100;	//offset animations
			var cloneElem = element.children[0].cloneNode(true);
			cloneElem.innerText ? cloneElem.innerText = content : cloneElem.textContent = content;

			cloneElem.setAttribute('style', 'top: 0; transform: translate(-50%, -100%); opacity: 0.2;');
			element.appendChild(cloneElem);
			
			setTimeout(function() {
				//following lines use .length for index to account for multiple searches while still animating
				element.children[(element.children.length - 2)].setAttribute('style', 'top: 100%; transform: translate(-50%, 0); opacity: 0.2;');
				element.children[(element.children.length - 1)].setAttribute('style', 'top: 50%; transform: translate(-50%, -40%); opacity: 1;');
				setTimeout(function() {
					//debugger;
					element.removeChild(element.children[0]);
				}, 1200); //delay by length of CSS transition
			}, delay);
		}
	}

//}());













