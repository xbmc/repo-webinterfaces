xbmcPlayerFactory = (function ($) {
	"use strict";

	//constants
	var REFRESH = 1e3, //ajax polling interval in ms
	  pub = {},
	  DEBUG = window.DEBUG || false;
	
	var progress;

	var timeObjToSeconds = function (o) {
		return ((((o.hours*60) + o.minutes)*60) + o.seconds)+(o.milliseconds/1e3);
	};
	var seconds2string = function (t) {
		var str = function (n) {
			return (n < 10 && n > -10 ? '0' : '')+Math.floor(n);
		};
		if (t > 3600) return str(t/3600) +':'+ str((t%3600)/60) +':'+ str(t%60);
		else return str(t/60) +':'+ str(t%60);
	};

	var renderPlayer = function (player) {
		var slider, volume, data;
		
		//construct data
		data = {
			'buttons': [
                { 'text': 'Previous', 'class':'GoPrevious', 'onclick':function () { xbmc.GoPrevious(); } },
	            { 'text': 'Play / Pause', 'class': 'PlayPause', 'onclick': function () { xbmc.PlayPause(); } },
                { 'text': 'Stop', 'class':'Stop', 'onclick':function () { xbmc.Stop(); } },
                { 'text': 'Next', 'class':'GoNext', 'onclick':function () { xbmc.GoNext(); } },
                { 'text': 'Up', 'class':'up', 'onclick':function () { xbmc.Up(); } },
                { 'text': 'Down', 'class':'down', 'onclick':function () { xbmc.Down(); } },
                { 'text': 'Left', 'class':'left', 'onclick':function () { xbmc.Left(); } },
                { 'text': 'Right', 'class':'right', 'onclick':function () { xbmc.Right(); } },
                { 'text': 'Select', 'class':'select', 'onclick':function () { xbmc.Select(); } },
                { 'text': 'Back', 'class':'back', 'onclick':function () { xbmc.Back(); } },
                { 'text': 'Information', 'class':'info', 'onclick':function () { xbmc.Info(); } },
                { 'text': 'Menu', 'class':'menu', 'onclick':function () { xbmc.ContextMenu(); } },
                { 'text': 'Home', 'class':'home', 'onclick':function () { xbmc.Home(); } }
			],
			'hideNavigation': true
		};
		
		//render the data to the DOM via the player template
		player.
		  html(''). //remove child elements
		  append(template.player.bind(data));
		
		//make the progress bar work
		var oldString,
		progressElem = document.getElementById('progress'),
		$progressElem = $(progressElem),
		$statusElem = $progressElem.children('.status'),
		statusElem = $statusElem.get(0),
		$timeElem = $progressElem.children('.time'),
		timeElem = $timeElem.get(0),
		$barElem = $progressElem.children('.bar');;
		progress = Progress(function (position, time, duration) {
			var value = Math.round(position*10000);
			var string = seconds2string(time)+'/'+seconds2string(duration);
			if (string !== oldString) {
				timeElem.innerHTML = string;
				$barElem.css('width', (value/100)+'%');
			}
			oldString = string;
		});
		progressElem.addEventListener('mouseup', function (e) { //enable seeking
			var value = (e.pageX - $progressElem.offset().left - 10) / ($progressElem.width());
			if (value > 1) value = 1;
			if (value < 0) value = 0;
			value = Math.round(value*100);
			if (xbmc.transport() === 'ajax') { progress.updateFraction(value/100); }
			xbmc.GetActivePlayer(function (player) {
 				if (player) xbmc.Seek({ 'playerid': player.playerid, 'value': value });
			});
		});

		player.find('.show').on('click', function () {
			player.toggleClass('visible');
		});

	};

	
	var on = function () {
		var body = $('body');
		return {
			'Player.OnPlay': function (data) {
				body.attr('data-status','playing');
				xbmc.GetPlayerProperties({ 'playerid': data.data.player.playerid }, function (player) {
					progress.start(timeObjToSeconds(player.totaltime), timeObjToSeconds(player.time));
				});
			},
			'Player.OnPause': function (data) {
				body.attr('data-status','paused');
				progress.pause();
			},
			'Player.OnStop': function (data) {
				body.attr('data-status','stopped');
				progress.stop();
			},
			'Player.OnSeek': function (data) {
				xbmc.GetPlayerProperties({ 'playerid': data.data.player.playerid }, function (player) {
					progress.update(timeObjToSeconds(player.totaltime), timeObjToSeconds(data.data.player.time));
				});
			}
		};
	};
	
	var startTimer = function () {
		var body = $('body'),
		progressElem = document.getElementById('progress'),
		$progressElem = $(progressElem),
		$statusElem = $progressElem.children('.status'),
		statusElem = $statusElem.get(0),
		player = {},
		sleep  = function (callback) {
			window.setTimeout(callback, REFRESH);
		},
		q = Q();
		q.add(function (c) {
			var cancel = false;
			xbmc.GetActivePlayerProperties(function (p) {
				if (cancel) return;
				//console.log('GetActivePlayerProperties', p)
				player = p;
				if (player) {
					progress.update(timeObjToSeconds(player.totaltime), timeObjToSeconds(player.time));
					if (player.speed > 0) {
						progress.unpause();
						body.attr('data-status','playing');
					} else if (player.speed === 0) {
						progress.pause();
						body.attr('data-status','paused');
					}
				} else {
					body.attr('data-status','stopped');
					statusElem.innerHTML = '';
					progress.stop();
				}
				sleep(c);
			});
			return { 'timeout':1e3, 'ontimeout': function (c) {  } };
		});
		q.add(function (c) {
			var cancel = false;
			if (player && player.playlistid !== undefined && player.position !== undefined) {
				if (!player.playlistid) player.playlistid = 0;
				xbmc.GetPlaylistItems({ 'playlistid': player.playlistid }, function (playlist) {
					if (!playlist.items) return;
					var item = playlist.items[player.position];
					//console.log('Current Playlist Item: ', item)
					if (item) statusElem.innerHTML = ''+
						(item.showtitle ? item.showtitle+' ' : '')+
						(item.season>=0 && item.episode>=0 ? item.season+'x'+item.episode+' ' : '')+
						(item.artist && item.artist.length ? item.artist.join(', ')+' - ' : '')+
						(item.title||item.label);
					else statusElem.innerHTML = '';
					sleep(c);
				});
			} else {
				c();
			}
			return { 'timeout':1e3, 'ontimeout': function (c) {  } };
		});
		q.onfinish(q.start); //re-start the queue when it finishes
		q.start(); //start the queue
	};
	
	return function () {
		//render the player
		renderPlayer($('#player'));
		
		//start polling
		startTimer();
		
		//bind event handlers to the xbmc websocket api
		$.each(on(), xbmc.onNotification);
		
		return pub;
	};
	
})(jQuery);
