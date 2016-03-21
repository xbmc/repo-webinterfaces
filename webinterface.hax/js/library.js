var xbmcLibraryFactory = (function ($) {
	"use strict";

	var LAZYLOAD_OPTIONS = { },
	  pub = {},
	  cache = {},
	  DEBUG = window.DEBUG || true;
	  
	var minutes2string = function (t) {
		var hours = Math.floor(t/60),
		    mins  = Math.floor(t%60),
		    out = [];
		if (hours > 0) out.push(hours + ' hour' + (hours > 1 ? 's' : ''));
		if (mins > 0) out.push(mins + ' minute' + (mins > 1 ? 's' : ''));
		return out.join(' ');
	};

	var seconds2string = function (t) {
		return minutes2string(Math.round(t/60));
	};

	var seconds2shortstring = function (t) {
		var str = function (n) {
			return (n < 10 && n > -10 ? '0' : '')+Math.floor(n);
		};
		if (t > 3600) return str(t/3600) +':'+ str((t%3600)/60) +':'+ str(t%60);
		else return str(t/60) +':'+ str(t%60);
	};

	var ymd2string = function (ymd) {
		var x = ymd.split(' ')[0].split('-');
		return [
			['January','February','March','April','May','June','July','August','September','October','November','December'][x[1]-1], 
			+x[2]+((/1[1-3]$/).test(x[2]) ? 'th' : (/1$/).test(x[2]) ? 'st' : (/2$/).test(x[2]) ? 'nd' : (/3$/).test(x[2]) ? 'rd' : 'th')+',',
			x[0]
		].join(' ');
	};

	var pages = {};

	pages['Home'] = {
		'view': 'list',
		'data': function (callback) {
			var items = [
				{ 'label': 'Videos', 'link': '#page=Menu&media=Videos', 'thumbnail': 'img/icons/home/videos.png' },
				{ 'label': 'Music', 'link': '#page=Menu&media=Music', 'thumbnail': 'img/icons/home/music.png' },
				{ 'label': 'Pictures', 'link': '#page=Menu&media=Pictures', 'thumbnail': 'img/icons/home/pictures.png' },
				{ 'label': 'Live', 'link': '#page=Live', 'thumbnail':'img/icons/home/live.png' },
				{ 'label': 'Playlists', 'link': '#page=Playlists', 'thumbnail':'img/icons/home/playlists.png' }
			];
			callback({ 'items': items, 'hideNavigation': true });
		}
	};

	pages['Menu'] = {
		'view': 'list',
		'data': function (callback) {
			var q = Q(), media = getHash('media'),
			m = ({'Videos':'video','Music':'music','Pictures':'pictures'})[media],
			x = ({'Videos':'video','Music':'audio','Pictures':'picture'})[media],

			page = {
				'title': media || 'Menu',
				'items': ({
					'Videos': [
						{ 'label': 'Movies', 'items': [
							{ 'label': 'By Year', 'link': '#page=Movies', 'thumbnail': 'img/icons/default/DefaultMusicYears.png' },
							{ 'label': 'By Title', 'link': '#page=Movies&group=alpha', 'thumbnail': 'img/icons/default/DefaultMovies.png' },
							{ 'label': 'By Genre', 'link': '#page=Genres&type=Movies', 'thumbnail': 'img/icons/default/DefaultMusicGenres.png' }
						] },
						{ 'label': 'TV Shows', 'items': [
							{ 'label': 'By Title', 'link': '#page=TV Shows', 'thumbnail': 'img/icons/default/DefaultTVShows.png' },
							{ 'label': 'By Genre', 'link': '#page=Genres&type=TV Shows', 'thumbnail': 'img/icons/default/DefaultMusicGenres.png' }
						] },
						{ 'label': 'Music Videos', 'items': [
							{ 'label': 'By Artist', 'link': '#page=Music Videos', 'thumbnail': 'img/icons/default/DefaultMusicArtists.png' }
						] }
					],
					'Music': [
						{ 'label': 'Artists', 'items': [
							{ 'label': 'By Name', 'link': '#page=Artists', 'thumbnail': 'img/icons/default/DefaultMusicArtists.png' },
							{ 'label': 'By Genre', 'link': '#page=Artists&group=genre', 'thumbnail': 'img/icons/default/DefaultMusicGenres.png' }
						] },
						{ 'label': 'Music Videos', 'items': [
							{ 'label': 'By Artist', 'link': '#page=Music Videos', 'thumbnail': 'img/icons/default/DefaultMusicArtists.png' }
						] }
					],
					'Pictures': [ ]
				})[media]
			};

			q.add(function (c) { //get files
				xbmc.GetSources({ 'media': m }, function (d) {
					page.items.push({ 'label': 'Files', 'items': (d.sources || []).map(function (source) {
						source.link = '#page=Directory&directory='+encodeURIComponent(source.file)+'&media='+m;
						source.thumbnail = 'img/icons/default/DefaultFolder.png';
						source.thumbnailWidth = '50px';
						return source;
					})});
					c();
				});
			});

			/*q.add(function (c) { //get playlists
				pages.Playlists.data(function (playlistPage) {
					page.items = page.items.concat(playlistPage.items.filter(function (item) { return item.type == x; }));
					c();
				})
			});*/

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Genres'] = {
		'view': 'list',
		'data': function (callback) {
			var page = {}, q = Q();

			q.add(function (c) {
				var type = getHash('type'),
				t = type == 'Movies' ? 'movie' :
					type == 'TV Shows' ? 'tvshow' :
					type == 'Music Videos' ? 'musicvideo' : '',
				getGenres = type === 'Artists' ? xbmc.GetAudioGenres : function (x) { xbmc.GetVideoGenres({ 'type': t }, x) };
				page.title = type;
				page.subtitle = 'by genre';
				getGenres(function (d) {
					page.items = d.genres instanceof Array ? d.genres.map(function (genre) {
						return { 'label': genre.label, 'link': '#page='+type+'&genre='+genre.label }
					}) : [];
					c();
				});
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Movies'] = {
		'view': 'list',
		'groupby': 'year',
		'data': function (callback) {
			var page = { title: 'Movies' }, q = Q();

			q.add(function (c) { //get movies
				var year = getHash('year'),
					genre = getHash('genre'),
				filter = year ? function (movie) { if (year == movie.year) return true; } :
					genre ? function (movie) { if (movie.genre.indexOf(genre) >= 0) return true; } :
					function () { return true; };
				xbmc.GetMovies(function (d) {
					page.items = d.movies instanceof Array ? d.movies.filter(filter) : [];
					c();
				});
			});

			q.add(function (c) { //format movies
				$.each(page.items, function (i, movie) {
					movie.link = '#page=Movie&movieid='+movie.movieid;
					movie.alpha = movie.label[0].toUpperCase();
					if (movie.movieid) {
						movie.play = function () {
							xbmc.Play({ 'movieid': movie.movieid }, 1);
						};
					}
					movie.thumbnail = movie.thumbnail ? xbmc.vfs2uri(movie.thumbnail) : 'img/icons/default/DefaultVideo.png';
					movie.thumbnailWidth = '34px';
				});
				c();
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Movie'] = {
		'view': 'list',
		'parent': 'Movies',
		'data': function (callback) {
			var page = {}, q = Q();
			var movieid = +getHash('movieid');

			q.add(function (c) { //get movie details

				xbmc.GetMovieDetails({ 'movieid': movieid }, function (d) {
					page = d.moviedetails || {};
					c();
				});

			});

			q.add(function (c) { //format movie details
				if (page.year) page.title += ' ('+page.year+')';
				if (page.tagline) page.subtitle = page.tagline;
				if (page.runtime) page.runtime = seconds2string(page.runtime);
				if (page.thumbnail) page.thumbnail = xbmc.vfs2uri(page.thumbnail);
				if (page.fanart) page.fanart = xbmc.vfs2uri(page.fanart);

				if (page.trailer) page.trailer = function () {
					xbmc.Play(page.trailer, 1);
				};

				if (page.movieid) {

					page.play = function () {
						xbmc.Play({ 'movieid': page.movieid }, 1);
					};

					page.add = function () {
						xbmc.AddToPlaylist({ 'playlistid': 1, 'item': { 'movieid': page.movieid } });
					};

				}

				c();
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['TV Shows'] = {
		'view': 'list',
		'groupby': 'alpha',
		'data': function (callback) {
			var page = { title: 'TV Shows' }, q = Q();

			q.add(function (c) { //get tv shows
				var year = getHash('year'),
					genre = getHash('genre'),
					filter = year ? function (show) { if (year == show.year) return true; } :
							genre ? function (show) { if (show.genre.indexOf(genre) >= 0) return true; } :
							function () { return true; };

				xbmc.GetTVShows(function (d) {
					page.items = d.tvshows instanceof Array ? d.tvshows.filter(filter) : [];
					c();
				});

			});

			q.add(function (c) { //format tv shows
				$.each(page.items, function (i, tvshow) {
					tvshow.link = '#page=TV Show&tvshowid='+tvshow.tvshowid;
					if (tvshow.thumbnail) tvshow.thumbnail = xbmc.vfs2uri(tvshow.thumbnail);
					//if (tvshow.art && tvshow.art.banner) tvshow.thumbnail = xbmc.vfs2uri(tvshow.art.banner);
					tvshow.alpha = tvshow.label[0].toUpperCase();
				});

				c();
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['TV Show'] = {
		'view': 'list',
		'parent': 'TV Shows',
		'groupby': 'season',
		'sortgroup': 'season',
		'data': function (callback) {
			var page = {},
			tvshowid = +getHash('tvshowid'),
			q = Q();

			q.add(function (c) { //get show details
				xbmc.GetTVShowDetails({ 'tvshowid': tvshowid }, function (d) {
					page = d.tvshowdetails || {};
					c();
				});
			});

			q.add(function (c) { //format show details
				//if (page.fanart) page.fanart = xbmc.vfs2uri(page.fanart);
				if (page.art) page.banner = xbmc.vfs2uri(page.art.banner);
				delete page.thumbnail;
				c();
			});

			q.add(function (c) { //get episodes
				xbmc.GetTVEpisodes({ 'tvshowid': tvshowid }, function (d) {
					page.items = d.episodes || {};
					c();
				});
			});

			q.add(function (c) { //format episodes

				$.each(page.items, function (i, episode) {

					episode.link = '#page=Episode&episodeid='+episode.episodeid+'&tvshowid='+tvshowid;
					episode.label = episode.title || '';
					episode.thumbnail = episode.thumbnail ? xbmc.vfs2uri(episode.thumbnail) : 'img/icons/default/DefaultVideo.png';
					episode.season = 'Season '+episode.season;
					episode.thumbnailWidth = '89px';
					episode.details = [];

					if (episode.episode) episode.number = episode.episode;
					if (episode.lastplayed) episode.details.push( 'Last played '+ymd2string(episode.lastplayed) );

					episode.play = function () {
						xbmc.Play({ 'episodeid': episode.episodeid }, 1);
					};

				});

				c();
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Episode'] = {
		'view': 'list',
		'parent': 'TV Shows',
		'data': function (callback) {
			var page = {},
				tvshowid = +getHash('tvshowid'),
				episodeid = +getHash('episodeid'),
				q = Q();

			q.add(function (c) { //get episode details

				xbmc.GetEpisodeDetails({ 'episodeid': episodeid }, function (d) {
					page = d.episodedetails || {};
					c();
				});

			});

			q.add(function (c) { //format episode details

				page.subtitle = (page.season>0 && page.episode>0 ? page.season+'x'+(page.episode<10 ? '0' : '')+page.episode+' ' : '')+(page.title || page.showtitle || '');
				if (tvshowid) page.link = '#page=TV Show&tvshowid='+tvshowid;
				if (page.showtitle) page.title = page.showtitle;
				if (page.thumbnail) page.thumbnail = xbmc.vfs2uri(page.thumbnail);
				if (page.fanart) page.fanart = xbmc.vfs2uri(page.fanart);
				if (page.runtime) page.runtime = seconds2string(page.runtime);

				if (episodeid !== undefined) {

					page.play = function () {
						xbmc.Play({ 'episodeid': episodeid }, 1);
					};

					page.add = function () {
						xbmc.AddToPlaylist({ 'playlistid': 1, 'item': { 'episodeid': episodeid } });
					};

				}

				c();
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Music Videos'] = {
		'view': 'list',
		'groupby': 'artist',
		'data': function (callback) {
			var page = { title: 'Music Videos' },
				q = Q();
			
			q.add(function (c) { //get music videos

				xbmc.GetMusicVideos(function (d) {
					page.items = d.musicvideos || [];
					c();
				});

			});

			q.add(function (c) { //format music videos

			  	$.each(page.items, function (i, mv) {
			  		mv.artist = mv.artist.join(', ');
			  		mv.label = mv.title;
			  		mv.details = (mv.album ? mv.album+(mv.year ? ' ('+mv.year+')' : '') : '');
					if (mv.thumbnail) mv.thumbnail = xbmc.vfs2uri(mv.thumbnail);
					mv.play = function () {
						xbmc.Open({ 'item': { 'file': xbmc.vfs2uri(mv.file) } });
					};
				});

				c();
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Addons'] = {
		'view': 'list',
		'groupby': 'type',
		'data': function (callback) {
			var page = { title: 'Add-ons', items: [] },
				q = Q();

			q.add(function (c) {
				xbmc.GetAddons({ 'type': 'xbmc.python.script' }, function (d) {
					page.items = d.addons;
					c();
				});
			});

			q.add(function (c) {
				var p = Q();

				$.each(page.items, function (i, addon) {

					p.add(function (C) {
						xbmc.GetAddonDetails({ 'addonid': addon.addonid }, function (d) {

							console.dir(d.addon)
							page.items[i] = {
								'label': d.addon.name+' '+d.addon.version,
								'thumbnail': xbmc.vfs2uri(d.addon.thumbnail),
								'details': d.addon.summary,
								'type': d.addon.type
							};
							C();

						});
					});

				});

				p.onfinish(function () {
					c();
				});

				p.start();
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Live'] = {
		'view': 'list',
		'data': function (callback) {
			var page = { title: 'Live', items: [] },
				q = Q();

			$.each(['TV', 'Radio'], function (i, type) {
				q.add(function (c) { //get groups

					xbmc.GetChannelGroups({ 'channeltype': type.toLowerCase() }, function (d) {
						page.items.push({
							'label': type,
							'items': (d.channelgroups||[]).map(function (g) {
								g.link = '#page=Channels&id='+g.channelgroupid;
								return g;
							})
						})
						c();
					});

				});
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Channels'] = {
		'view': 'list',
		'data': function (callback) {
			var page = { },
				q = Q(),
				groupid = +getHash('id');

			q.add(function (c) { //get groups
				xbmc.GetChannelGroupDetails({ 'channelgroupid': groupid }, function (d) {
					page.title = d.channelgroupdetails.label || '';
					c();
				});
			});

			q.add(function (c) { //get groups

				xbmc.GetChannels({ 'channelgroupid': groupid }, function (d) {

					page.items = (d.channels||[]).map(function (c) {
						//c.link = '#page=Channel&id='+c.channelid;
						c.thumbnail = xbmc.vfs2uri(c.thumbnail);
						c.play = function () {
							xbmc.Open({ 'item': { 'channelid': c.channelid }});
						};
						return c;
					});

					c();
				});

			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Artists'] = {
		'view': 'list',
		'groupby': 'alpha',
		'data': function (callback) {
			var page = { title: 'Artists' }, q = Q(),
				genre = getHash('genre'),
				alpha = getHash('alpha');

			q.add(function (c) { //get artists

				xbmc.GetArtists(function (d) {
					page.items = d.artists/*.filter(filter)*/ || [];
					c();
				});

			});

			q.add(function (c) { //format artists

			  	$.each(page.items, function (i, artist) {
			  		artist.alpha = artist.label[0].toUpperCase();
					artist.link = '#page=Artist&artistid='+artist.artistid;
					artist.thumbnail = artist.thumbnail ? xbmc.vfs2uri(artist.thumbnail) : 'img/icons/default/DefaultArtist.png';
					artist.thumbnailWidth = '50px';
					if (artist.genre instanceof Array) artist.genre.map(function (genre) { return genre.charAt(0).toUpperCase()+genre.charAt(0).toUpperCase()+genre.substr(1) });
				});

				c();
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};
	
	pages['Artist'] = {
		'view': 'list',
		'groupby': 'year',
		'data': function (callback) {
			var page = {},
				artistid = +getHash('artistid'),
				q = Q();

			q.add(function (c) { //get artist details
				xbmc.GetArtistDetails({ 'artistid': artistid }, function (d) {
					page = d.artistdetails || {};
					c();
				});
			});

			q.add(function (c) { //format artist details
				if (page.thumbnail) page.thumbnail = xbmc.vfs2uri(page.thumbnail);
				page.title = page.label || 'Artist '+artistid;
				c();
			});

			q.add(function (c) { //get albums
				xbmc.GetAlbums({ 'filter': { 'artistid': artistid } }, function (d) {
					page.items = d.albums || [];
					c();
				});
			});

			q.add(function (c) { //format albums
				$.each(page.items, function (i, album) {
					album.link = '#page=Album&albumid='+album.albumid;
					album.thumbnail = album.thumbnail ? xbmc.vfs2uri(album.thumbnail) : 'img/icons/default/DefaultAudio.png';
					album.thumbnailWidth = '50px';

					album.play = function () {
						xbmc.Play({ 'albumid': album.albumid }, 0);
					};

				});

				c();
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Album'] = {
		'view': 'list',
		'parent': 'Music',
		'data': function (callback) {
			var page = {},
				albumid = +getHash('albumid'),
				q = Q();

			q.add(function (c) { //get album details
				xbmc.GetAlbumDetails({ 'albumid': albumid }, function (d) {
					page = d.albumdetails || {};
					c();
				});
			});

			q.add(function (c) { //format album details
				if (page.thumbnail) page.thumbnail = xbmc.vfs2uri(page.thumbnail);
				if (page.fanart) page.fanart = xbmc.vfs2uri(page.fanart);
				page.title = page.artist.join(', ') || '';
				page.link = '#page=Artist&artistid='+page.artistid;
				page.subtitle = page.label || '';
				page.play = function () {
					xbmc.Play({ 'albumid': albumid }, 0);
				};
				c();
			});

			q.add(function (c) { //get songs
				xbmc.GetSongs({ 'filter': { 'albumid': albumid } }, function (d) {
					page.items = d.songs || [];
					c();
				});
			});

			q.add(function (c) { //format songs

				$.each(page.items, function (i, song) {
					song.thumbnail = undefined;
					song.thumbnailWidth = '50px';
					if (song.track <= 10000) song.number = song.track;
					if (song.duration) song.details = seconds2shortstring(song.duration);

					if (song.file) {
						song.play = function () {
							xbmc.Play({ 'albumid': albumid }, 0, song.track-1);
						};
					}
				});

				c();
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Files'] = {
		'view': 'list',
		'data': function (callback) {
			var q = Q(),
				media = getHash('media'),
				page = { 'title': 'Files', 'items': [
					{ 'media': 'video', 'label': 'Video' },
					{ 'media': 'music', 'label': 'Music' },
					{ 'media': 'pictures', 'label': 'Pictures' },
					{ 'media': 'files', 'label': 'Files' }
				] };
			
			if (media) page.items = page.items.filter(function (item) { return item.label == media; });

			$.each(page.items, function (i, item) {

				q.add(function (c) { //get sources
					xbmc.GetSources({ 'media': item.media }, function (d) {
						item.items = d.sources || [];
						c();
					});
				});

				q.add(function (c) { //format sources
					$.each(item.items, function (i, source) {
						source.link = '#page=Directory&directory='+encodeURIComponent(source.file)+'&media='+item.media;
						source.thumbnail = 'img/icons/default/DefaultFolder.png';
						source.thumbnailWidth = '50px';
					});
				
					c();
				});

			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Directory'] = {
		'view': 'list',
		'parent': 'Files',
		'data': function (callback) {
			var directory = getHash('directory'),
				page = {},
				media = getHash('media') || '',
				q = Q();

			var pathSplit = function (path) {
				return path.split(new RegExp('[\\/]'));
			};

			
			q.add(function (c) { //get files
				xbmc.GetDirectory({ 'directory': directory, 'media': media }, function (d) {
					page.subtitle = directory.substring(0,12) === 'multipath://' ? decodeURIComponent(directory.substring(12, directory.length-1)) : directory;
					var directoryArray = pathSplit(page.subtitle);
					page.title = directoryArray[directoryArray.length-2];
					page.items = d.files || [];
					c();
				});
			});
			
			q.add(function (c) { //format files
				$.each(page.items, function (i, file) {
					var f = pathSplit(file.file),
					  filename = f.pop();
					if (file.filetype === 'directory') {
						file.link = '#page=Directory&directory='+encodeURIComponent(file.file)+'&media='+getHash('media');
						file.thumbnail = file.thumbnail ? xbmc.vfs2uri(file.thumbnail) : 'img/icons/default/DefaultFolder.png';
					}
					else {
						var playlistid = file.type === 'audio' ? 0 : file.type === 'video' ? 1 : 2;
						file.play = function () {
							if (file.type === 'unknown' || !file.type) file.type = getHash('media');
							xbmc.Open({ 'item': { 'file': xbmc.vfs2uri(file.file) } });
						};
						file.thumbnail = file.thumbnail ? xbmc.vfs2uri(file.thumbnail) : 'img/icons/default/DefaultFile.png';
					}
					if (!filename) filename = f.pop();
					file.label = filename;
					file.thumbnailWidth = '50px';
				});
				c();
			});

			q.add(function (c) { //add back button
				var path = pathSplit(directory),
					   back = '';
				if (!path.pop()) path.pop(); //remove the last part of the current directory
				back = path.join('/');					
				if (path.length > 2) page.items.unshift({
					'link': '#page=Directory&directory='+back+'&media='+getHash('media'),
					'label': ' . . ',
					'thumbnail': 'img/icons/default/DefaultFolderBack.png',
					'thumbnailWidth': '50px'
				});
				c();
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Playlists'] = {
		'view': 'list',
		'data': function (callback) {
			var page = { 'title': 'Playlists' },
				player,
				q = Q();
			
			q.add(function (c) { //get playlists
				xbmc.GetPlaylists(function (d) {
					page.items = d || [];
					c();
				});
			});

			q.add(function (c) {
				var q = Q();
	  			$.each(page.items, function (i, item) { //for each playlist
	  				item.label = item.type || 'Playlist';

	  				q.add(function(cb) { //get playlist items
		  				xbmc.GetPlaylistItems({ 'playlistid': item.playlistid }, function (d) {
		  					item.items = d.items || [];
		  					cb();
		  				});
		  			});

				});
				q.onfinish(function () {
					c();
				});
				q.start();
			});

			q.add(function (c) { //get active player
				xbmc.GetActivePlayerProperties(function (d) {
					player = d || {};
					c();
				});
			});

			q.add(function (c) { //format playlist items
	  			$.each(page.items, function (i, item) {
	  				var playlistid = item.playlistid || 0;

		  			$.each(item.items, function (i, item) {
						item.details = '';
						if (item.file) item.label = item.file.split('/')[--item.file.split('/').length];
						if (player.playlistid === playlistid && player.position === i) item.playing = true;
						if (item.thumbnail) item.thumbnail = xbmc.vfs2uri(item.thumbnail);
						if (item.runtime) item.details = minutes2string(item.runtime);
						if (item.duration) item.details = seconds2string(item.duration);

						if (!item.playing) {

							item.play = function () {
								xbmc.Open({ 'item': { 'playlistid': playlistid, 'position': i } });
								renderPage(); //refresh the playlist
							};

							item.remove = function () {
								xbmc.RemoveFromPlaylist({ 'playlistid': playlistid, 'position': i });
								renderPage(); //refresh the playlist
							};

						}
					});

				});
				c();
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	};

	pages['Addons'] = {
		'view': 'list',
		'groupby': 'type',
		'data': function (callback) {
			var page = { title: 'Add-ons', items: [] },
				q = Q();

			q.add(function (c) {
				xbmc.GetAddons({}, function (d) {
					page.items = d.addons;
					c();
				});
			});

			q.add(function (c) {
				var p = Q();
				
				page.items = page.items || [];

				$.each(page.items, function (i, addon) {
					p.add(function (C) {

						xbmc.GetAddonDetails({ 'addonid': addon.addonid }, function (d) {

							page.items[i] = {
								'label': d.addon.name+' '+d.addon.version,
								'thumbnail': xbmc.vfs2uri(d.addon.thumbnail),
								'details': d.addon.summary,
								'type': d.addon.type
							};

							C();
						});

					});
				});

				p.onfinish(function () {
					c();
				});

				p.start();
			});

			q.onfinish(function () {
				callback(page);
			});

			q.start();
		}
	}

	var groupItems = function (items, groupby) {
		var o = [], temp = {};
		if (!(items[0] && items[0][groupby])) return items;
		$.each(items, function (i, item) {
			var s = item[groupby];
			if (item instanceof Object) {
				if (!temp[s]) temp[s] = [];
				temp[s].push(item);
			}
		});
		$.each(temp, function (label, items) {
			o.unshift({
				'label': label,
				'items': items
			});
		});
		return o;
	};

	var sortItems = function (items, sortby) {
		if (!(items[0] && items[0][sortby])) return items;
		return items.sort(function (a, b) {
			var x = a[sortby], y = b[sortby];
			if (x < y) return -1;
			if (x > y) return +1;
			return 0;
		});
	};

	var renderPage = function (title) {
		var data,
			page,
			defaultPage = 'Home',
			hash = document.location.hash.replace(/\W/g,'');
		
		//find the page to render
		if (!title) title = getHash('page') || defaultPage;
		title = title.replace('%20',' '); //some browsers replace spaces with %20
		page = pages[title];
		if (!page) page = pages[defaultPage];
		
		if (DEBUG) console.log('Library: Fetching data: '+title);
		
		//if the data isn't a function, turn it into one
		if (!page.data) data = function (callback) { callback({}) };
		else if (!(page.data instanceof Function)) data = function (callback) { callback(page.data) };
		else data = page.data;

		//get the page data
		data(function (data) {
			var groupby = getHash('group') || page.groupby;

			if (DEBUG) console.log('Library: Rendering page: '+title, data);
			
			//sort and group the data
			if (getHash('sort') || page.sortby) data.items = sortItems(data.items, getHash('sort') || page.sortby)

			if (groupby) {
				var size = data.items.length;
				data.groupby = groupby;
				data.items = sortItems(groupItems(data.items, groupby), 'label');

				if (getHash(groupby)) data.items = data.items.filter(function (x) {
					return x.label === getHash(groupby);
				});

				else if (size > 100) {
					data.collapsed = true;
					data.items = data.items.map(function (x) {
						return {
							'label': x.label,
							'link': document.location.hash+'&'+groupby+'='+x.label
						}
					});
				}
			}

			data.id = title;
			document.title = 'Hax//'+(data.title || 'Kodi');
			
			//render the data to the DOM via the template
			var p = $('<div class="page" data-page="'+title+'"></div>'),
			v = $(template[getHash('view') || page.view].bind(data)).appendTo(p);
			$('#content').empty().append(p);
			if (page.then instanceof Function) page.then(p.get(0));
			
			$('body').scrollTop(0); //scroll to the top of the page
			$('#loading').stop(true).hide();
			v.find('img').filter('[data-original]').lazyload(LAZYLOAD_OPTIONS); //initialize the lazyload plugin
		});
	};
	
	return function () {

		//render the page
		renderPage(getHash('page') || undefined);
		
		//render the page every time the hash changes
		$(window).hashchange(function () {
			$('#loading').show();
			renderPage(getHash('page'));
		});
		
		return pub;
	};

})(jQuery);
