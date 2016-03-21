var Progress = function (update) {

	var requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(c){ window.setTimeout(c, 100); },

	start,
	end,
	paused,
	duration,

	position = function () {
		var now = (new Date()).getTime();
		return !start || !end || !duration ? 0 :
			paused ? (paused-start)/duration : 
			now <= end ? (now-start)/duration : 0;
	},    

	timer = function () {
		var pos = position(),
		d = duration/1e3 || 0;
		update(pos, Math.floor(pos*d), Math.floor(d));
		requestAnimationFrame(timer);
	},

	pub = {
		start: function (totaltime, time) {
			if (totaltime) pub.update(totaltime, time);
			else unpause();
		},
		pause: function () {
			if (!paused) {
				var now = (new Date()).getTime();
				if (now < end) paused = now;
			}
		},
		unpause: function () {
			if (paused) {
				var now = (new Date()).getTime();
				start += now-paused;
				end += now-paused;
				paused = undefined;
			}
		},
		stop: function () {
			//var now = (new Date()).getTime();
			start = undefined;
			end = undefined;
			paused = undefined;
			duration = undefined;
		},
		update: function (totaltime, time) {
			var now = (new Date()).getTime();
			var pause = paused-start;
			if (totaltime > 0) duration = (totaltime*1e3);
			if (now >= end || totaltime > 0) {
				start = now - ((time||0)*1e3);
				end = start + duration;
				paused = start + pause;
			}
			//if (totaltime !== duration/1e3) pub.unpause();
		},
		updateFraction: function (fraction) {
			var d = duration/1e3;
			pub.update(d, d*fraction);
		},
		offset: function (d) {
			var diff = d*1e3;
			start += diff;
			end += diff;
		}
	};

	timer();
	return pub;
};
