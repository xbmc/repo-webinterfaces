
(function () {
	"use strict";
	
	window.time = {
		'now': function () {
			var date = new Date;
			return {
				'hours': date.getHours(),
				'minutes': date.getMinutes(),
				'seconds': date.getSeconds()
			};
		},
		'tostring': function (time) {
			var string = '';
			if (time.hours) string += time.hours + ':';
			string += (time.minutes < 10 ? '0'+time.minutes : time.minutes);
			string += ':';
			string += (time.seconds < 10 ? '0'+time.seconds : time.seconds);
			return string;
		},
		'tomilliseconds': function (time) {
			var t = (time.seconds || 0) * 1000;
			t += (time.hours || 0) * 3600000;
			t += (time.minutes || 0) * 60000;
			t += (time.milliseconds || 0);
			return t;
		},
		'toseconds': function (time) {
			return time.tomilliseconds / 1000;
		}
	};
	
	

})();
