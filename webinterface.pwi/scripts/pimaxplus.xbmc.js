var JSON_RPC = '/jsonrpc';
var playerid = -1;
var playertime = '';

$(document).bind('pageinit', function() {
	setInterval("getActivePlayer()", 500);
});

function setPlayerId(id) {
	playerid = id;
}

function getActivePlayer() {
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetActivePlayer',
		data: '{"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1}',
		success: jQuery.proxy(function(data) {
			if(data && data.result && data.result[0]) {
				setPlayerId(data.result[0].playerid);
				getCurrentlyPlaying();
				getPlayerProperties();
			} else {
				$('[data-currentlyplaying]').each(function () {
					$(this).remove();
				});
				
				try {
					$("#homelist").listview('refresh');
				} catch(ex) {}
			}
		}, this),
		dataType: 'json'
	});
}

function getPlayerProperties() {
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetPlayerProperties',
		data: '{"jsonrpc": "2.0", "method": "Player.GetProperties", "params" : {"playerid": ' + playerid + ', "properties": ["time", "totaltime"]}, "id": 1}',
		success: jQuery.proxy(function(data) {
			if(data && data.result && data.result) {
				playertime = data.result.time.minutes + ':' + leadingZero(data.result.time.seconds) + ' / ' + data.result.totaltime.minutes + ':' + leadingZero(data.result.totaltime.seconds);
			} 
		}, this),
		dataType: 'json'
	});
}

function getCurrentlyPlaying() {
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetCurrentlyPlaying',
		data: '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "playerid": ' + playerid + ', "properties": ["title", "showtitle", "artist", "thumbnail"] }, "id": 1}',
		success: jQuery.proxy(function(data) {
			if(!$('#homelist li[data-currentlyplaying]').is('*')) {
				$('#homelist').prepend('<li data-currentlyplaying="info" data-theme="b"></li>');
				$('#homelist').prepend('<li data-currentlyplaying="divider" data-theme="b" data-role="list-divider">Currently playing</li>');
			}
		
			$('[data-currentlyplaying="info"]').each(function () {
				$(this).show();
			
				if(data.result.item) {
					if(playerid == 0) {
						$(this).html('' + data.result.item.title + '<br /><span class="smallfont">' + data.result.item.artist + '</span><br /><span class="smallerfont">' + playertime + '</span>');
					} else if(playerid == 1) {
						if(data.result.item.showtitle) {
							$(this).html('<span class="smallfont">' + data.result.item.showtitle + '</span><br />' + data.result.item.title + '<br /><span class="smallerfont">' + playertime + '</span>');
						} else {
							$(this).html(data.result.item.title + '<br /><span class="smallerfont">' + playertime + '</span>');
						}
					}
				}
				
				$("#homelist").listview('refresh');
			});
		}, this),
		dataType: 'json'});
}

function remotePressed(action, params) {
	if(params == null) {
		data = '{"jsonrpc": "2.0", "method": "' + action + '", "id": 1}';
	} else if(params == '') {
		data = '{"jsonrpc": "2.0", "method": "' + action + '", "params": { "playerid": ' + playerid + '}}';
	} else {
		data = '{"jsonrpc": "2.0", "method": "' + action + '", "params": { "playerid": ' + playerid + ', ' + params + '}}';
	}

	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?SendRemoteKey',
		data: data,
		success: jQuery.proxy(function(data) {}, this),
		dataType: 'json'
	});
}

function toggleMute() {
	data = '{"jsonrpc": "2.0", "method": "Application.SetMute", "params": {"mute": "toggle"}, "id": 1}';

	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?SendRemoteKey',
		data: data,
		success: jQuery.proxy(function(data) {}, this),
		dataType: 'json'
	});
}

function changeVolume(volume) {
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?SendRemoteKey',
		data: '{"jsonrpc": "2.0", "method": "Application.GetProperties", "params": { "properties": [ "volume" ] }, "id": 1}',
		success: jQuery.proxy(function(data) {			
			jQuery.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: JSON_RPC + '?SendRemoteKey',
			data: '{"jsonrpc": "2.0", "method": "Application.SetVolume", "params": { "volume": ' + volume + ' }, "id": 1}',
			success: jQuery.proxy(function(data) {}, this),
			dataType: 'json'});
		}, this),
		dataType: 'json'});
}

function showRemote() {
	$.mobile.changePage("#remote");
	
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?SendRemoteKey',
		data: '{"jsonrpc": "2.0", "method": "Application.GetProperties", "params": { "properties": [ "volume" ] }, "id": 1}',
		success: jQuery.proxy(function(data) {
			$('#volumeslider').val(data.result.volume).slider('refresh');
		}, this),
		dataType: 'json'});
}

function showMoviesMain() {
	$.mobile.changePage("#moviemain");

	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetMovies',
		data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { "limits": { "start": 0}, "properties": ["title"], "sort": {"method": "sorttitle", "ignorearticle": true}}, "id": 1}',
		success: jQuery.proxy(function(data) {
			dividing = "-1";
			$('#moviemainlist').html("");
			
			$.each($(data.result.movies), jQuery.proxy(function(i, item) {
				startsWith = item.title.indexOf("The ") == 0 ? item.title.substr(4, 1) : item.title.substr(0, 1);
				
				if(64 < startsWith.charCodeAt(0) && startsWith.charCodeAt(0) < 91) {
					if(startsWith != dividing) {
						$('#moviemainlist')
							.append('<li><a href="#" onclick="showMovies(\'' + startsWith + '\');"> ' + startsWith + '<p class="ui-li-count" data-startswith="' + startsWith + '">1</p></a></li>')
							.trigger('create');
							
						dividing = startsWith;
					} else {
						$('[data-startswith="' + startsWith + '"]').text($('[data-startswith="' + startsWith + '"]').text() - -1);
					}
				} else if(dividing == "-1") {
					$('#moviemainlist')
						.append('<li><a href="#" onclick="showMovies(\'#\');">#</a><p class="ui-li-count" data-startswith="#">1</p></li>')
						
					dividing = startsWith;
				} else {
					$('[data-startswith="#"]').text($('[data-startswith="#"]').text() - -1);
				}
			}));
			
			try {
				$('#moviemainlist').listview('refresh');
			} catch(ex) {}
		}, this),
		dataType: 'json'
	});
}

function showMovies(s) {
	$.mobile.changePage("#movies");
	
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetMovies',
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
						.append('<li><a href="javascript:void(0);" onclick="showMovieDetails(' + item.movieid + ');"><img src="/vfs/' + item.thumbnail + '" alt="Thumnail" />' + item.title + '<br />' + stars + '<br /><span class="smallfont">' + item.tagline + '</span></a></li>')
						.trigger('create');
				} else if(startsWith.toUpperCase() == s) {
					$('#movielist')
						.append('<li><a href="javascript:void(0);" onclick="showMovieDetails(' + item.movieid + ');"><img src="/vfs/' + item.thumbnail + '" alt="Thumnail" />' + item.title + '<br />' + stars + '<br /><span class="smallfont">' + item.tagline + '</span></a></li>')
						.trigger('create');
				}
			}));
			
			try {
				$('#movielist').listview('refresh');
			} catch(ex) {}
		}, this),
		dataType: 'json'
	});
}

function showMovieDetails(id) {
	$.mobile.changePage("#moviedetails");
	
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetMovies',
		data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovieDetails", "params": { "movieid": ' + id + ', "properties": [ "genre", "director", "cast", "tagline", "plot", "title", "lastplayed", "runtime", "year", "playcount", "rating", "thumbnail" ]}, "id": 1}',
		success: jQuery.proxy(function(data) {
			startsWith = data.result.moviedetails.title.indexOf("The ") == 0 ? data.result.moviedetails.title.substr(4, 1) : data.result.moviedetails.title.substr(0, 1);
			
			if(isNaN(startsWith)) {
				$("#moviedetailsback").attr("onclick", "showMovies('" + startsWith + "')");
			} else {
				$("#moviedetailsback").attr("onclick", "showMovies('#')");
			}
			
			$('#movie-details').html('');
			$('#movie-details').append('<li data-role="list-divider" id="movie-plot">Plot</li>');
			$('#movie-details').append('<li data-role="list-divider" id="movie-genres">Genres</li>');
			$('#movie-details').append('<li data-role="list-divider" id="movie-cast">Cast</li>');
			$('#movie-details').append('<li data-role="list-divider" id="movie-crew">Director</li>');
			$('#movie-details').append('<li data-role="list-divider" id="movie-info">More info</li>');
			$('#movie-details').append('<li data-role="list-divider" id="movie-actions">Actions</li>');
			
			$("#movie-title").text(data.result.moviedetails.title);
			$("#movie-plot").after('<li>' + data.result.moviedetails.plot + '</li>');
			$("#movie-genres").after(splitText(data.result.moviedetails.genre));
			
			for(i = 0; i < data.result.moviedetails.cast.length; i++) {
				img = data.result.moviedetails.cast[i].thumbnail ? '/vfs/' + data.result.moviedetails.cast[i].thumbnail : 'images/unknown-actor.gif';
				
			
				$("#movie-cast").after('<li><img src="' + img + '" alt="Actor" />' + data.result.moviedetails.cast[i].name + '<br /><span class="smallfont">' + data.result.moviedetails.cast[i].role + '</span></li>');
			}
			
			$("#movie-crew").after(splitText(data.result.moviedetails.director));
			$("#movie-info").after('<li>Released in ' + data.result.moviedetails.year + '</li>');
			$("#movie-info").after('<li>Duration: ' + data.result.moviedetails.runtime + ' minutes</li>');
			$("#movie-actions").after('<li><span data-role="button" onclick="playMovie(' + id + ');">Play movie</span></li>');
			
			$('#movie-details').listview('refresh');
			$('[data-role=button]').button();
		}, this),
		dataType: 'json'
	});
}

function playMovie(id) {
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?PlayMovie',
		data: '{"jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "movieid": ' + id + ' } }, "id": 1}',
		success: jQuery.proxy(function(data) {}, this),
	dataType: 'json'});
}

function showTvShowsMain() {
	$.mobile.changePage("#tvshowsmain");

	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetTVShows',
		data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": { "limits": { "start": 0}, "properties": ["title"], "sort": {"method": "sorttitle", "ignorearticle": true}}, "id": 1}',
		success: jQuery.proxy(function(data) {
			dividing = "-1";
			$('#tvshowmainlist').html("");
			
			$.each($(data.result.tvshows), jQuery.proxy(function(i, item) {
				startsWith = item.title.indexOf("The ") == 0 ? item.title.substr(4, 1) : item.title.substr(0, 1);
				
				if(64 < startsWith.charCodeAt(0) && startsWith.charCodeAt(0) < 91) {
					if(startsWith != dividing) {
						$('#tvshowmainlist')
							.append('<li><a href="#" onclick="showTvShows(\'' + startsWith + '\');"> ' + startsWith + '<p class="ui-li-count" data-tvstartswith="' + startsWith + '">1</p></a></li>')
							.trigger('create');
							
						dividing = startsWith;
					} else {
						$('[data-tvstartswith="' + startsWith + '"]').text($('[data-tvstartswith="' + startsWith + '"]').text() - -1);
					}
				} else if(dividing == "-1") {
					$('#tvshowmainlist')
						.append('<li><a href="#" onclick="showTvShows(\'#\');">#<p class="ui-li-count" data-tvstartswith="#">1</p></a></li>')
						
					dividing = startsWith;
				} else {
					$('[data-tvstartswith="#"]').text($('[data-tvstartswith="#"]').text() - -1);
				}
			}));
			
			try {
				$('#tvshowmainlist').listview('refresh');
			} catch(ex) {}
		}, this),
		dataType: 'json'
	});
}

function showTvShows(s) {
	$.mobile.changePage("#tvshows");
	
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetTVShows',
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
						.append('<li><a href="javascript:void(0);" onclick="showTvShowSeasons(' + item.tvshowid + ');"><img src="/vfs/' + item.thumbnail + '" alt="Thumnail" />' + item.title + '<br />' + stars + '</li>')
						.trigger('create');
				} else if(startsWith.toUpperCase() == s) {
					$('#tvshowlist')
						.append('<li><a href="javascript:void(0);" onclick="showTvShowSeasons(' + item.tvshowid + ');"><img src="/vfs/' + item.thumbnail +  '" alt="Thumnail" />' + item.title + '<br />' + stars + '</li>')
						.trigger('create');
				}
			}));
			
			try {
				$('#tvshowlist').listview('refresh');
			} catch(ex) {}
		}, this),
		dataType: 'json'
	});
}

function showTvShowSeasons(id) {
	$.mobile.changePage("#tvshowseasons");
	
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetSeasons',
		data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetSeasons", "params": { "properties": [ "season", "showtitle"], "sort" : {"method": "sorttitle"}, "tvshowid" : ' + id + ' }, "id": 1}',
		success: jQuery.proxy(function(data) {
			$('#tvshowseasonslist').html("");
			
			$.each($(data.result.seasons), jQuery.proxy(function(i, item) {
				$("#tvshowseasons-title").text(item.showtitle);
				startsWith = item.showtitle.indexOf("The ") == 0 ? item.showtitle.substr(4, 1) : item.showtitle.substr(0, 1);
			
				if(64 < startsWith.charCodeAt(0) && startsWith.charCodeAt(0) < 91) {
					$("#tvshowseasonsback").attr("onclick", "showTvShows('" + startsWith + "')");
				} else {
					$("#tvshowseasonsback").attr("onclick", "showTvShows('#')");
				}
				
				$('#tvshowseasonslist')
					.append('<li><a href="javascript:void(0);" onclick="showTvShowEpisodes('+ id + ', ' + item.season + ');">' + item.label + '</li>')
					.trigger('create');
			}));
			
			try {
				$('#tvshowseasonslist').listview('refresh');
			} catch(ex) {}
		}, this),
		dataType: 'json'
	});
}

function showTvShowEpisodes(id, season) {
	$.mobile.changePage("#tvshowepisodes");
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetEpisodes',
		data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": { "properties": [ "title", "episode", "thumbnail", "playcount"], "sort" : {"method": "episode"}, "tvshowid" : ' + id + ', "season" : ' + season + ' }, "id": 1}',
		success: jQuery.proxy(function(data) {
			$('#tvshowepisodeslist').html("");
			$("#tvshowepisodesback").attr("onclick", "showTvShowSeasons('" + id + "')");
			
			$.each($(data.result.episodes), jQuery.proxy(function(i, item) {
				$("#tvshowepisodes-title").text('Season ' + season);
				seen = item.playcount > 0 ? 'Watched' : '';
			
				$('#tvshowepisodeslist')
					.append('<li><a href="javascript:void(0);" onclick="showTvShowEpisodeDetails(' + item.episodeid + ', ' + id + ', ' + season + ');"><img src="/vfs/' + item.thumbnail +  '" alt="Thumnail" />' + item.episode + ' - ' + item.title + '<br /><span class="smallerfont">' + seen + '</span></li>')
					.trigger('create');
			}));
			
			try {
				$('#tvshowepisodeslist').listview('refresh');
			} catch(ex) {}
		}, this),
		dataType: 'json'
	});
}

function showTvShowEpisodeDetails(episodeid, tvshowid, season) {
	$.mobile.changePage("#tvshowepisodedetails");
	
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetEpisodeDetails',
		data: '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodeDetails", "params": { "episodeid": ' + episodeid + ', "properties": [ "director", "cast", "plot", "title", "lastplayed", "runtime", "firstaired", "playcount", "rating", "thumbnail" ]}, "id": 1}',
		success: jQuery.proxy(function(data) {
			$("#tvshowepisodedetailsback").attr("onclick", "showTvShowEpisodes(" + tvshowid + ', ' + season + ")");
			
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
			
			$("#episode-crew").after(splitText(data.result.episodedetails.director));
			$("#episode-info").after('<li>First aired on ' + data.result.episodedetails.firstaired + '</li>');
			$("#episode-info").after('<li>Duration: ' + data.result.episodedetails.runtime + ' minutes</li>');
			$("#episode-actions").after('<li><span data-role="button" onclick="playEpisode(' + episodeid + ');">Play episode</span></li>');
			
			$('#episode-details').listview('refresh');
			$('[data-role=button]').button();
		}, this),
		dataType: 'json'
	});
}

function playEpisode(id) {
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?AddTvShowToPlaylist',
		data: '{"jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "episodeid": ' + id + ' } }, "id": 1}',
		success: jQuery.proxy(function(data) {}, this),
		dataType: 'json'});
}

function showMusicMain() {
	$.mobile.changePage("#musicmain");

	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetArtists',
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
							.append('<li><a href="#" onclick="showArtists(\'' + startsWith + '\');"> ' + startsWith + '<p class="ui-li-count" data-artiststartswith="' + startsWith + '">1</p></a></li>')
							.trigger('create');
							
						dividing = startsWith;
					} else {
						$('[data-artiststartswith="' + startsWith + '"]').text($('[data-artiststartswith="' + startsWith + '"]').text() - -1);
					}
				} else if(dividing == "-1") {
					$('#musicmainlist')
						.append('<li><a href="#" onclick="showArtists(\'#\');">#<p class="ui-li-count" data-artiststartswith="#">1</p></a></li>')
						
					dividing = startsWith;
				} else {
					$('[data-artiststartswith="#"]').text($('[data-artiststartswith="#"]').text() - -1);
				}
			}));
			
			try {
				$('#musicmainlist').listview('refresh');
			} catch(ex) {}
		}, this),
		dataType: 'json'
	});
}

function showArtists(s) {
	$.mobile.changePage("#artists");

	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetArtists',
		data: '{"jsonrpc": "2.0", "method": "AudioLibrary.GetArtists", "params": { "limits": { "start": 0}, "properties": [], "sort": {"method": "label", "ignorearticle": true}}, "id": 1}',
		success: jQuery.proxy(function(data) {
			$('#artistlist').html("");
			
			$.each($(data.result.artists), jQuery.proxy(function(i, item) {
				startsWith = item.label.indexOf("The ") == 0 ? item.label.substr(4, 1) : item.label.indexOf("De ") == 0 ? item.label.substr(3, 1) : item.label.substr(0, 1);
				startsWith = startsWith.toUpperCase();
				
				if(s == '#' && (65 > startsWith.charCodeAt(0) || startsWith.charCodeAt(0) > 91)) {
					$('#artistlist')
						.append('<li><a href="javascript:void(0);" onclick="showSongs(' + item.artistid + ');">' + item.label + '</li>')
						.trigger('create');
				} else if(startsWith.toUpperCase() == s) {
					$('#artistlist')
						.append('<li><a href="javascript:void(0);" onclick="showSongs(' + item.artistid + ');">' + item.label + '</li>')
						.trigger('create');
				}
			}));
			
			try {
				$('#artistlist').listview('refresh');
			} catch(ex) {}
		}, this),
		dataType: 'json'
	});
}

function showSongs(artistid) {
	$.mobile.changePage("#songs");

	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?GetArtists',
		data: '{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": { "artistid": ' + artistid + ', "limits": { "start": 0}, "properties": ["artist", "title", "album", "duration", "thumbnail"], "sort": {"method": "title", "ignorearticle": true}}, "id": 1}',
		success: jQuery.proxy(function(data) {
			$('#songlist').html("");
			
			$.each($(data.result.songs), jQuery.proxy(function(i, item) {
				$("#songs-title").text(item.artist);
				startsWith = item.artist.indexOf("The ") == 0 ? item.artist.substr(4, 1) : item.artist.indexOf("De ") == 0 ? item.artist.substr(3, 1) : item.artist.substr(0, 1);
				
				if(64 < startsWith.charCodeAt(0) && startsWith.charCodeAt(0) < 91) {
					$("#songsback").attr("onclick", "showArtists('" + startsWith + "')");
				} else {
					$("#songsback").attr("onclick", "showArtists('#')");
				}
				
				$('#songlist')
					.append('<li><a href="javascript:void(0);" onclick="playSong(' + item.songid + ');"><img src="/vfs/' + item.thumbnail + '" alt="Thubnail" />' + item.title + '<br /><span class="smallfont">' + item.album + '</span></li>')
					.trigger('create');
			}));
			
			try {
				$('#songlist').listview('refresh');
			} catch(ex) {}
		}, this),
		dataType: 'json'
	});
}

function playSong(id) {
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?AddSongToPlaylist',
		data: '{"jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "songid": ' + id + ' } }, "id": 1}',
		success: jQuery.proxy(function(data) {}, this),
		dataType: 'json'});
}

function scan(library) {
	var data = '';
	
	if(library == 'video') {
		data = '{"jsonrpc": "2.0", "method": "AudioLibrary.Scan", "id": 1}';
	} else if(library == 'video') {
		data = '{"jsonrpc": "2.0", "method": "VideoLibrary.Scan", "id": 1}';
	}
	
	jQuery.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: JSON_RPC + '?Scan',
		data: data,
		success: jQuery.proxy(function(data) {console.log(data);}, this),
		dataType: 'json'});
}

function splitText(text) {
	var pieces = text.split(" / ");
	var retval = "";
	
	for(i = 0; i < pieces.length; i++) {
		retval += "<li>" + pieces[i] + "</li>";
	}
	
	return retval;
}

function leadingZero(number) {
	var s = "0" + number;
    return s.substr(s.length - 2);
}