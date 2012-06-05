var pwiCore = {
	JSON_RPC: '/jsonrpc',
	playerid: -1,
	playertime: '',
	init: function() {
		setInterval("pwiCore.getActivePlayer()", 500);
	},
	setPlayerId: function(id) {
		pwiCore.playerid = id;
	},
	getActivePlayer: function() {
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetActivePlayer',
			data: '{"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1}',
			success: jQuery.proxy(function(data) {
				if(data && data.result && data.result[0]) {
					pwiCore.setPlayerId(data.result[0].playerid);
					pwiCore.getCurrentlyPlaying();
					pwiCore.getPlayerProperties();
				} else {
					$('#home-list').children('[data-current-media="divider"]').hide();
					$('#home-list').children('[data-current-media="info"]').hide();
					
					try {
						$("#home-list").listview('refresh');
					} catch(ex) {}
				}
			}, this),
			dataType: 'json'
		});
	},
	getPlayerProperties: function() {
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetPlayerProperties',
			data: '{"jsonrpc": "2.0", "method": "Player.GetProperties", "params" : {"playerid": ' + pwiCore.playerid + ', "properties": ["time", "totaltime"]}, "id": 1}',
			success: jQuery.proxy(function(data) {
				if(data && data.result && data.result) {					
					pwiCore.playertime = '';
				
					if(data.result.time.hours > 0) {
						pwiCore.playertime += data.result.time.hours + ':';
					}
					
					pwiCore.playertime += data.result.time.minutes + ':' + pwiUtils.leadingZero(data.result.time.seconds) + ' / ';
					
					if(data.result.totaltime.hours > 0) {
						pwiCore.playertime += data.result.totaltime.hours + ':';
					}
					
					pwiCore.playertime += data.result.totaltime.minutes + ':' + pwiUtils.leadingZero(data.result.totaltime.seconds);
				} 
			}, this),
			dataType: 'json'
		});
	},
	getCurrentlyPlaying: function() {
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetCurrentlyPlaying',
			data: '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "playerid": ' + pwiCore.playerid + ', "properties": ["title", "showtitle", "artist", "thumbnail"] }, "id": 1}',
			success: jQuery.proxy(function(data) {
				if(!$('#home-list li[data-current-media="info"]').is(':visible')) {
					$('#home-list li[data-current-media="info"]').show();
					$('#home-list li[data-current-media="divider"]').show();
				}
				
				$('[data-current-media="title"]').text(data.result.item.title);
				$('[data-current-media="artist"]').text(data.result.item.artist);
				$('[data-current-media="player-time"]').text(pwiCore.playertime);
				$('[data-current-media="thumbnail"]').attr('src', '/vfs/' + data.result.item.thumbnail);
				
				$('[data-currentlyplaying="info"]').each(function () {
					
				
					if(data.result.item) {
						if(pwiCore.playerid == 0) {
							$(this).html('' + data.result.item.title + '<br /><span class="smallfont">' + data.result.item.artist + '</span><br /><span class="smallerfont">' + pwiCore.playertime + '</span>');
						} else if(pwiCore.playerid == 1) {
							if(data.result.item.showtitle) {
								$(this).html('<span class="smallfont">' + data.result.item.showtitle + '</span><br />' + data.result.item.title + '<br /><span class="smallerfont">' + pwiCore.playertime + '</span>');
							} else {
								$(this).html(data.result.item.title + '<br /><span class="smallerfont">' + pwiCore.playertime + '</span>');
							}
						}
					}
					
					try {
						$("#homelist").listview('refresh');
					} catch(e) {}
				});
			}, this),
		dataType: 'json'});
	},
	scan: function(library) {
		var data = '';
		
		if(library == 'video') {
			data = '{"jsonrpc": "2.0", "method": "AudioLibrary.Scan", "id": 1}';
		} else if(library == 'video') {
			data = '{"jsonrpc": "2.0", "method": "VideoLibrary.Scan", "id": 1}';
		}
		
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?Scan',
			data: data,
			success: jQuery.proxy(function(data) {
				// do nothing
			}, this),
			dataType: 'json'});
	}
}

var pwiRemote = {
	isInitialized: false,
	init: function() {
		if(pwiRemote.isInitialized) return;

		pwiRemote.getVolume();
		
		$('[data-remote-action]').on('click', function() {
			pwiRemote.remotePressed($(this).attr('data-remote-action'), $(this).attr('data-remote-params'));
		});
		
		pwiRemote.isInitialized = true;
	},
	remotePressed: function(action, params) {
		if(params == '') {
			data = '{"jsonrpc": "2.0", "method": "' + action + '", "id": 1}';
		} else if(params == 'player') {
			data = '{"jsonrpc": "2.0", "method": "' + action + '", "params": { "playerid": ' + pwiCore.playerid + '}}';
		} else {
			params = params.split("'").join('"');
			data = '{"jsonrpc": "2.0", "method": "' + action + '", "params": { "playerid": ' + pwiCore.playerid + ', ' + params + '}}';
		}

		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?SendRemoteKey',
			data: data,
			success: jQuery.proxy(function(data) {
				// do nothing
			}, this),
			dataType: 'json'
		});
	},
	getVolume: function() {	
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?SendRemoteKey',
			data: '{"jsonrpc": "2.0", "method": "Application.GetProperties", "params": { "properties": [ "volume" ] }, "id": 1}',
			success: jQuery.proxy(function(data) {
				if($.mobile.activePage.attr('id') == 'remote')
					$('#volumeslider').val(data.result.volume).slider('refresh');
					
					$('#volumeslider').on('change', function() {
						pwiRemote.changeVolume($(this).val());
					});
			}, this),
			dataType: 'json'});
	},
	changeVolume: function(volume) {
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?SendRemoteKey',
			data: '{"jsonrpc": "2.0", "method": "Application.GetProperties", "params": { "properties": [ "volume" ] }, "id": 1}',
			success: jQuery.proxy(function(data) {			
				jQuery.ajax({
				type: 'POST',
				contentType: 'application/json',
				url: pwiCore.JSON_RPC + '?SendRemoteKey',
				data: '{"jsonrpc": "2.0", "method": "Application.SetVolume", "params": { "volume": ' + volume + ' }, "id": 1}',
				success: jQuery.proxy(function(data) {
					// do nothing
				}, this),
				dataType: 'json'});
			}, this),
			dataType: 'json'});
	}
}

var pwiMovies = {
	showMain: function() {
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetMovies',
			data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { "limits": { "start": 0}, "properties": ["title"], "sort": {"method": "sorttitle", "ignorearticle": true}}, "id": 1}',
			success: jQuery.proxy(function(data) {
				dividing = "-1";
				$('#moviemainlist').html("");
				
				$.each($(data.result.movies), jQuery.proxy(function(i, item) {
					startsWith = item.title.indexOf("The ") == 0 ? item.title.substr(4, 1) : item.title.substr(0, 1);
					
					if(64 < startsWith.charCodeAt(0) && startsWith.charCodeAt(0) < 91) {
						if(startsWith != dividing) {
							$('#moviemainlist')
								.append('<li><a href="#movies-overview" data-movie-starts-with="'+ startsWith + '"> ' + startsWith + '<p class="ui-li-count" data-movie-starts-with-count="' + startsWith + '">1</p></a></li>')
								.trigger('create');
								
							dividing = startsWith;
						} else {
							$('[data-movie-starts-with-count="' + startsWith + '"]').text($('[data-movie-starts-with-count="' + startsWith + '"]').text() - -1);
						}
					} else if(dividing == "-1") {
						$('#moviemainlist')
							.append('<li><a href="#movies-overview" data-movie-starts-with="#">#</a><p class="ui-li-count" data-movie-starts-with-count="#">1</p></li>')
							
						dividing = startsWith;
					} else {
						$('[data-movie-starts-with-count="#"]').text($('[data-movie-starts-with-count="#"]').text() - -1);
					}
				}));
				
				try {
					$('#moviemainlist').listview('refresh');
				} catch(ex) {}
				
				$('[data-movie-starts-with]').on('click', function() {
					localStorage.setItem('movie-starts-with', $(this).attr('data-movie-starts-with'));
				});
			}, this),
			dataType: 'json'
		});
	},
	showOverview: function() {
		var s = localStorage.getItem('movie-starts-with');
	
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetMovies',
			data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { "limits": { "start": 0}, "properties": ["thumbnail", "tagline", "title", "rating"], "sort": {"method": "sorttitle", "ignorearticle": true}}, "id": 1}',
			success: jQuery.proxy(function(data) {
				dividing = "-1";
				$('#movielist').html("");
				$('#moviemainlist').html("");
				
				$.each($(data.result.movies), jQuery.proxy(function(i, item) {
					startsWith = item.title.indexOf("The ") == 0 ? item.title.substr(4, 1) : item.title.substr(0, 1);
					stars = '';
					
					for(i = 0; i < 10; i = i + 2) {
						if(i < Math.round(item.rating)) {
							stars += '<img src="images/star.png" alt="Star" />';
						} else {
							stars += '<img src="images/star-gray.png" alt="Star" />';
						}
					}
					
					if(s == '#' && !isNaN(startsWith)) {
						$('#movielist')
							.append('<li><a href="#movies-details" data-movie-id="' + item.movieid + '"><img src="/vfs/' + item.thumbnail + '" alt="Thumnail" />' + item.title + '<br />' + stars + '<br /><span class="smallfont">' + item.tagline + '</span></a></li>')
							.trigger('create');
					} else if(startsWith.toUpperCase() == s) {
						$('#movielist')
							.append('<li><a href="#movies-details" data-movie-id="' + item.movieid + '"><img src="/vfs/' + item.thumbnail + '" alt="Thumnail" />' + item.title + '<br />' + stars + '<br /><span class="smallfont">' + item.tagline + '</span></a></li>')
							.trigger('create');
					}
				}));
				
				try {
					$('#movielist').listview('refresh');
				} catch(ex) {}
				
				$('[data-movie-id]').on('click', function() {
					localStorage.setItem('movie-id', $(this).attr('data-movie-id'));
				});
			}, this),
			dataType: 'json'
		});
	},
	showDetails: function() {
		var id = localStorage.getItem('movie-id');
		
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetMovies',
			data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovieDetails", "params": { "movieid": ' + id + ', "properties": [ "genre", "director", "cast", "tagline", "plot", "title", "lastplayed", "runtime", "year", "playcount", "rating", "thumbnail" ]}, "id": 1}',
			success: jQuery.proxy(function(data) {
				startsWith = data.result.moviedetails.title.indexOf("The ") == 0 ? data.result.moviedetails.title.substr(4, 1) : data.result.moviedetails.title.substr(0, 1);
				
				$('#movie-details').html('');
				$('#movie-details').append('<li data-role="list-divider" id="movie-plot">Plot</li>');
				$('#movie-details').append('<li data-role="list-divider" id="movie-genres">Genres</li>');
				$('#movie-details').append('<li data-role="list-divider" id="movie-cast">Cast</li>');
				$('#movie-details').append('<li data-role="list-divider" id="movie-crew">Director</li>');
				$('#movie-details').append('<li data-role="list-divider" id="movie-info">More info</li>');
				$('#movie-details').append('<li data-role="list-divider" id="movie-actions">Actions</li>');
				
				$("#movie-title").text(data.result.moviedetails.title);
				$("#movie-plot").after('<li>' + data.result.moviedetails.plot + '</li>');
				$("#movie-genres").after(pwiUtils.split(data.result.moviedetails.genre));
				
				for(i = 0; i < data.result.moviedetails.cast.length; i++) {
					img = data.result.moviedetails.cast[i].thumbnail ? '/vfs/' + data.result.moviedetails.cast[i].thumbnail : 'images/unknown-actor.gif';
					
				
					$("#movie-cast").after('<li><img src="' + img + '" alt="Actor" />' + data.result.moviedetails.cast[i].name + '<br /><span class="smallfont">' + data.result.moviedetails.cast[i].role + '</span></li>');
				}
				
				$("#movie-crew").after(pwiUtils.split(data.result.moviedetails.director));
				$("#movie-info").after('<li>Released in ' + data.result.moviedetails.year + '</li>');
				$("#movie-info").after('<li>Duration: ' + data.result.moviedetails.runtime + ' minutes</li>');
				$("#movie-actions").after('<li><span data-role="button" onclick="pwiMovies.playMovie();">Play movie</span></li>');
				
				$('#movie-details').listview('refresh');
				$('[data-role=button]').button();
			}, this),
			dataType: 'json'
		});
	},
	playMovie: function() {
		var id = localStorage.getItem('movie-id');
	
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?PlayMovie',
			data: '{"jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "movieid": ' + id + ' } }, "id": 1}',
			success: jQuery.proxy(function(data) {
				// do nothing
			}, this),
		dataType: 'json'});
	}
}

var pwiTvShows = {
	showMain: function() {

		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetTVShows',
			data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": { "limits": { "start": 0}, "properties": ["title"], "sort": {"method": "sorttitle", "ignorearticle": true}}, "id": 1}',
			success: jQuery.proxy(function(data) {
				dividing = "-1";
				$('#tvshowmainlist').html("");
				
				$.each($(data.result.tvshows), jQuery.proxy(function(i, item) {
					startsWith = item.title.indexOf("The ") == 0 ? item.title.substr(4, 1) : item.title.substr(0, 1);
					
					if(64 < startsWith.charCodeAt(0) && startsWith.charCodeAt(0) < 91) {
						if(startsWith != dividing) {
							$('#tvshowmainlist')
								.append('<li><a href="#tvshows-overview" data-tvshow-starts-with="' + startsWith + '"> ' + startsWith + '<p class="ui-li-count" data-tvshow-starts-with-count="' + startsWith + '">1</p></a></li>')
								.trigger('create');
								
							dividing = startsWith;
						} else {
							$('[data-tvshow-starts-with-count="' + startsWith + '"]').text($('[data-tvshow-starts-with-count="' + startsWith + '"]').text() - -1);
						}
					} else if(dividing == "-1") {
						$('#tvshowmainlist')
							.append('<li><a href="#tvshows-overview" data-tvshow-starts-with="#">#<p class="ui-li-count" data-tvshow-starts-with-count="#">1</p></a></li>')
							
						dividing = startsWith;
					} else {
						$('[data-tvshow-starts-with-count="#"]').text($('[data-tvshow-starts-with-count="#"]').text() - -1);
					}
				}));
				
				try {
					$('#tvshowmainlist').listview('refresh');
				} catch(ex) {}
				
				$('[data-tvshow-starts-with]').on('click', function() {
					localStorage.setItem('tvshow-starts-with', $(this).attr('data-tvshow-starts-with'));
				});
			}, this),
			dataType: 'json'
		});
	},
	showOverview: function() {
		var s = localStorage.getItem('tvshow-starts-with');
		
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetTVShows',
			data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": { "limits": { "start": 0}, "properties": ["thumbnail", "title", "rating"], "sort": {"method": "sorttitle", "ignorearticle": true}}, "id": 1}',
			success: jQuery.proxy(function(data) {
				dividing = "-1";
				$('#tvshowlist').html("");
				
				$.each($(data.result.tvshows), jQuery.proxy(function(i, item) {
					startsWith = item.title.indexOf("The ") == 0 ? item.title.substr(4, 1) : item.title.substr(0, 1);
					
					var stars = '';
					for(i = 0; i < 10; i = i + 2) {
						if(i < Math.round(item.rating)) {
							stars += '<img src="images/star.png" alt="Star" />';
						} else {
							stars += '<img src="images/star-gray.png" alt="Star" />';
						}
					}
					
					if(s == '#' && (65 > startsWith.charCodeAt(0) || startsWith.charCodeAt(0) > 91)) {
						$('#tvshowlist')
							.append('<li><a href="#tvshows-seasons" data-tvshow-id="' + item.tvshowid + '"><img src="/vfs/' + item.thumbnail + '" alt="Thumnail" />' + item.title + '<br />' + stars + '</li>')
							.trigger('create');
					} else if(startsWith.toUpperCase() == s) {
						$('#tvshowlist')
							.append('<li><a href="#tvshows-seasons" data-tvshow-id="' + item.tvshowid + '"><img src="/vfs/' + item.thumbnail +  '" alt="Thumnail" />' + item.title + '<br />' + stars + '</li>')
							.trigger('create');
					}
				}));
				
				try {
					$('#tvshowlist').listview('refresh');
				} catch(ex) {}
				
				$('[data-tvshow-id]').on('click', function() {
					localStorage.setItem('tvshow-id', $(this).attr('data-tvshow-id'));
				});
			}, this),
			dataType: 'json'
		});
	},
	showSeasons: function() {
		var id = localStorage.getItem('tvshow-id');
		
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetSeasons',
			data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetSeasons", "params": { "properties": [ "season", "showtitle"], "sort" : {"method": "sorttitle"}, "tvshowid" : ' + id + ' }, "id": 1}',
			success: jQuery.proxy(function(data) {
				$('#tvshowseasonslist').html("");
				
				$.each($(data.result.seasons), jQuery.proxy(function(i, item) {
					$("#tvshowseasons-title").text(item.showtitle);
					startsWith = item.showtitle.indexOf("The ") == 0 ? item.showtitle.substr(4, 1) : item.showtitle.substr(0, 1);
					
					$('#tvshowseasonslist')
						.append('<li><a href="#tvshows-episodes" data-tvshow-season="'+ item.season + '">' + item.label + '</li>')
						.trigger('create');
				}));
				
				try {
					$('#tvshowseasonslist').listview('refresh');
				} catch(ex) {}
				
				$('[data-tvshow-season]').on('click', function() {
					localStorage.setItem('tvshow-season', $(this).attr('data-tvshow-season'));
				});
			}, this),
			dataType: 'json'
		});
	},
	showEpisodes: function() {
		var id = localStorage.getItem('tvshow-id');
		var season = localStorage.getItem('tvshow-season');
		
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetEpisodes',
			data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": { "properties": [ "title", "episode", "thumbnail", "playcount"], "sort" : {"method": "episode"}, "tvshowid" : ' + id + ', "season" : ' + season + ' }, "id": 1}',
			success: jQuery.proxy(function(data) {
				$('#tvshowepisodeslist').html("");
				
				$.each($(data.result.episodes), jQuery.proxy(function(i, item) {
					$("#tvshowepisodes-title").text('Season ' + season);
					seen = item.playcount > 0 ? 'Watched' : '';
				
					$('#tvshowepisodeslist')
						.append('<li><a href="#tvshows-episodes-details" data-tvshow-episode="' + item.episodeid + '"><img src="/vfs/' + item.thumbnail +  '" alt="Thumnail" />' + item.episode + ' - ' + item.title + '<br /><span class="smallerfont">' + seen + '</span></li>')
						.trigger('create');
				}));
				
				try {
					$('#tvshowepisodeslist').listview('refresh');
				} catch(ex) {}
				
				$('[data-tvshow-episode]').on('click', function() {
					localStorage.setItem('tvshow-episode', $(this).attr('data-tvshow-episode'));
				});
			}, this),
			dataType: 'json'
		});
	},
	showEpisodeDetails: function() {
		var episode = localStorage.getItem('tvshow-episode');
		
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetEpisodeDetails',
			data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodeDetails", "params": { "episodeid": ' + episode + ', "properties": [ "director", "cast", "plot", "title", "lastplayed", "runtime", "firstaired", "playcount", "rating", "thumbnail" ]}, "id": 1}',
			success: jQuery.proxy(function(data) {				
				$('#episode-details').html('');
				$('#episode-details').append('<li data-role="list-divider" id="episode-plot">Plot</li>');
				$('#episode-details').append('<li data-role="list-divider" id="episode-cast">Cast</li>');
				$('#episode-details').append('<li data-role="list-divider" id="episode-crew">Director</li>');
				$('#episode-details').append('<li data-role="list-divider" id="episode-info">More info</li>');
				$('#episode-details').append('<li data-role="list-divider" id="episode-actions">Actions</li>');
				
				$("#episode-title").text(data.result.episodedetails.title);			
				$("#episode-plot").after('<li>' + data.result.episodedetails.plot + '</li>');
				
				for(i = 0; i < data.result.episodedetails.cast.length; i++) {
					img = data.result.episodedetails.cast[i].thumbnail ? '/vfs/' + data.result.episodedetails.cast[i].thumbnail : 'images/unknown-actor.gif';
					
					$("#episode-cast").after('<li><img src="' + img + '" alt="Actor" />' + data.result.episodedetails.cast[i].name + '<br /><span class="smallfont">' + data.result.episodedetails.cast[i].role + '</span></li>');
				}
				
				$("#episode-crew").after(pwiUtils.split(data.result.episodedetails.director));
				$("#episode-info").after('<li>First aired on ' + data.result.episodedetails.firstaired + '</li>');
				$("#episode-info").after('<li>Duration: ' + data.result.episodedetails.runtime + ' minutes</li>');
				$("#episode-actions").after('<li><span data-role="button" onclick="pwiTvShows.playEpisode(' + episode + ');">Play episode</span></li>');
				
				$('#episode-details').listview('refresh');
				$('[data-role=button]').button();
			}, this),
			dataType: 'json'
		});
	},
	playEpisode: function(id) {
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?AddTvShowToPlaylist',
			data: '{"jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "episodeid": ' + id + ' } }, "id": 1}',
			success: jQuery.proxy(function(data) {}, this),
			dataType: 'json'});
	}
}

var pwiMusic = {
	showMain: function() {
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetArtists',
			data: '{"jsonrpc": "2.0", "method": "AudioLibrary.GetArtists", "params": { "limits": { "start": 0}, "properties": [], "sort": {"method": "label", "ignorearticle": true}}, "id": 1}',
			success: jQuery.proxy(function(data) {
				dividing = "-1";
				$('#musicmainlist').html("");
				
				$.each($(data.result.artists), jQuery.proxy(function(i, item) {
					startsWith = item.label.indexOf("The ") == 0 ? item.label.substr(4, 1) : item.label.indexOf("De ") == 0 ? item.label.substr(3, 1) : item.label.substr(0, 1);
					startsWith = startsWith.toUpperCase();
					
					if(64 < startsWith.charCodeAt(0) && startsWith.charCodeAt(0) < 91) {
						if(startsWith != dividing) {
							$('#musicmainlist')
								.append('<li><a href="#music-artists" data-artists-start-with="' + startsWith + '"> ' + startsWith + '<p class="ui-li-count" data-artists-start-with-count="' + startsWith + '">1</p></a></li>')
								.trigger('create');
								
							dividing = startsWith;
						} else {
							$('[data-artists-start-with-count="' + startsWith + '"]').text($('[data-artists-start-with-count="' + startsWith + '"]').text() - -1);
						}
					} else if(dividing == "-1") {
						$('#musicmainlist')
							.append('<li><a href="#music-artists" data-artists-start-with="#">#<p class="ui-li-count" data-artists-start-with-count="#">1</p></a></li>')
							
						dividing = startsWith;
					} else {
						$('[data-artists-start-with-count="#"]').text($('[data-artists-start-with-count="#"]').text() - -1);
					}
				}));
				
				try {
					$('#musicmainlist').listview('refresh');
				} catch(ex) {}
				
				$('[data-artists-start-with]').on('click', function() {
					localStorage.setItem('music-artists-start-with', $(this).attr('data-artists-start-with'));
				});
			}, this),
			dataType: 'json'
		});
	},
	showArtists: function() {
		var s = localStorage.getItem('music-artists-start-with');
		localStorage.removeItem('music-album');

		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetArtists',
			data: '{"jsonrpc": "2.0", "method": "AudioLibrary.GetArtists", "params": { "limits": { "start": 0}, "properties": [], "sort": {"method": "label", "ignorearticle": true}}, "id": 1}',
			success: jQuery.proxy(function(data) {
				$('#artistlist').html("");
				
				$.each($(data.result.artists), jQuery.proxy(function(i, item) {
					startsWith = item.label.indexOf("The ") == 0 ? item.label.substr(4, 1) : item.label.indexOf("De ") == 0 ? item.label.substr(3, 1) : item.label.substr(0, 1);
					startsWith = startsWith.toUpperCase();
					
					if((s == '#' && (65 > startsWith.charCodeAt(0) || startsWith.charCodeAt(0) > 91)) || startsWith.toUpperCase() == s) {
						$('#artistlist')
							.append('<li><a href="#music-artists-songs" data-music-artist="' + item.artistid + '">' + item.label + '</a><a href="#music-artists-albums" data-music-artist="' + item.artistid + '">Albums</a></li>')
							.trigger('create');
					}
				}));
				
				try {
					$('#artistlist').listview('refresh');
				} catch(ex) {}
				
				$('[data-music-artist]').on('click', function() {
					localStorage.setItem('music-artist', $(this).attr('data-music-artist'));
				});
			}, this),
			dataType: 'json'
		});
	},
	showArtistAlbums: function() {
		var artistid = localStorage.getItem('music-artist');

		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetArtists',
			data: '{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": { "artistid": ' + artistid + ', "limits": { "start": 0}, "properties": ["title", "artist", "thumbnail"], "sort": {"method": "title", "ignorearticle": true}}, "id": 1}',
			success: jQuery.proxy(function(data) {
				$('#albumlist').html("");
				
				$.each($(data.result.albums), jQuery.proxy(function(i, item) {
					$("#albums-title").text(item.artist);
					$('#albumlist')
						.append('<li><a href="#music-artists-songs" data-music-album="' + item.albumid + '"><img src="/vfs/' + item.thumbnail + '" alt="Thumbnail" />' + item.title + '</li>')
						.trigger('create');
				}));
				
				try {
					$('#albumlist').listview('refresh');
				} catch(ex) {}
				
				$('[data-music-album]').on('click', function() {
					localStorage.setItem('music-album', $(this).attr('data-music-album'));
				});
			}, this),
			dataType: 'json'
		});
	},
	showArtistSongs: function() {
		var artist = localStorage.getItem('music-artist');
		var lookup = localStorage.getItem('music-album') == null ? '"artistid": ' + artist : '"albumid": ' + localStorage.getItem('music-album');
		var back = localStorage.getItem('music-album') == null ? '#music-artists' : '#music-artists-albums';

		$('#music-artists-songs a[data-icon="back"]').attr('href', back);
		
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?GetArtists',
			data: '{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": { ' + lookup + ', "limits": { "start": 0}, "properties": ["artist", "title", "album", "duration", "thumbnail"], "sort": {"method": "title", "ignorearticle": true}}, "id": 1}',
			success: jQuery.proxy(function(data) {
				$('#songlist').html("");
				
				$.each($(data.result.songs), jQuery.proxy(function(i, item) {
					$("#songs-title").text(item.artist);
					startsWith = item.artist.indexOf("The ") == 0 ? item.artist.substr(4, 1) : item.artist.indexOf("De ") == 0 ? item.artist.substr(3, 1) : item.artist.substr(0, 1);
					
					$('#songlist')
						.append('<li><a href="javascript:pwiMusic.playSong();" data-music-song="' + item.songid + '"><img src="/vfs/' + item.thumbnail + '" alt="Thubnail" />' + item.title + '<br /><span class="smallfont">' + item.album + '</span></li>')
						.trigger('create');
				}));
				
				try {
					$('#songlist').listview('refresh');
				} catch(ex) {}
				
				$('[data-music-song]').on('click', function() {
					localStorage.setItem('music-song', $(this).attr('data-music-song'));
				});
			}, this),
			dataType: 'json'
		});
	},
	playSong: function() {
		var song = localStorage.getItem('music-song');
	
		jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: pwiCore.JSON_RPC + '?AddSongToPlaylist',
			data: '{"jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "songid": ' + song + ' } }, "id": 1}',
			success: jQuery.proxy(function(data) {}, this),
			dataType: 'json'});
	}
}

var pwiUtils = {
	split: function(text) {
		var pieces = text.split(" / ");
		var retval = "";
		
		for(i = 0; i < pieces.length; i++) {
			retval += "<li>" + pieces[i] + "</li>";
		}
		
		return retval;
	},
	leadingZero: function(number) {
		var s = "0" + number;
		return s.substr(s.length - 2);
	}
}

$(document).delegate(document, 'pageshow', pwiCore.init);
$(document).delegate(document, 'pageshow', pwiRemote.init);
$(document).delegate('#movies-main', 'pageshow', pwiMovies.showMain);
$(document).delegate('#movies-overview', 'pageshow', pwiMovies.showOverview);
$(document).delegate('#movies-details', 'pageshow', pwiMovies.showDetails);
$(document).delegate('#tvshows-main', 'pageshow', pwiTvShows.showMain);
$(document).delegate('#tvshows-overview', 'pageshow', pwiTvShows.showOverview);
$(document).delegate('#tvshows-seasons', 'pageshow', pwiTvShows.showSeasons);
$(document).delegate('#tvshows-episodes', 'pageshow', pwiTvShows.showEpisodes);
$(document).delegate('#tvshows-episodes-details', 'pageshow', pwiTvShows.showEpisodeDetails);
$(document).delegate('#music-main', 'pageshow', pwiMusic.showMain);
$(document).delegate('#music-artists', 'pageshow', pwiMusic.showArtists);
$(document).delegate('#music-artists-albums', 'pageshow', pwiMusic.showArtistAlbums);
$(document).delegate('#music-artists-songs', 'pageshow', pwiMusic.showArtistSongs);