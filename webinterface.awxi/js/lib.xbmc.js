/*
 *  AWX - Ajax based Webinterface for XBMC
 *  Copyright (C) 2010  MKay
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>
 */


// TODO remove debug function
function objToStr(obj, indent) {
	var out = '';
	for (var e in obj) {
		if (typeof obj[e] == 'object') {
			out += indent + e + ":\n" + objToStr(obj[e], indent+'     ') + "\n";

		} else {
			out += indent + e + ": " + obj[e] + "\n";
		}
	}
	return out;
};



var xbmc = {};



(function($) {

	/* ########################### *\
	 |  xbmc-lib
	 |
	\* ########################### */
	$.extend(xbmc, {

		movieThumbType: 'Poster',
		tvshowThumbType: 'Banner',

		xbmcHasQuit: false,
		timeout: 10000,

		input: function(options) {
			var settings = {
				type: 'Select',
				onSuccess: null,
				onError: null
			};
			
			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Input.' + options.type + '", "id": 1}',
				settings.onSuccess,
				settings.onError
			);

			return true;
		},

		init: function(initContainer, callback) {
			xbmc.periodicUpdater.start();
			var timeout = parseInt(mkf.cookieSettings.get('timeout'));
			this.timeout = (isNaN(timeout) || timeout < 5 || timeout > 120)? 10000: timeout*1000;
			this.detectThumbTypes(initContainer, callback);
		},



		sendCommand: function(command, onSuccess, onError, onComplete, asyncRequest) {
			if (typeof asyncRequest === 'undefined')
				asyncRequest = true;

			if (!this.xbmcHasQuit) {
				$.ajax({
					async: asyncRequest,
					type: 'POST',
					url: '/jsonrpc?awx',
					data: command,
					dataType: 'json',
					cache: false,
					timeout: this.timeout,
					success: function(result, textStatus, XMLHttpRequest) {

						// its possible to get here on timeouts. --> error
						if (XMLHttpRequest.readyState==4 && XMLHttpRequest.status==0) {
							if (onError) {
								onError({"error" : { "ajaxFailed" : true, "xhr" : XMLHttpRequest, "status" : textStatus }});
							}
							return;
						}

						// Example Error-Response: { "error" : { "code" : -32601, "message" : "Method not found." } }
						if (result.error) {
							if (onError) { onError(result); }
							return;
						}

						if (onSuccess) { onSuccess(result); }
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						if (onError) {
							onError({"error" : { "ajaxFailed" : true, "xhr" : XMLHttpRequest, "status" : textStatus, "errorThrown" : errorThrown }});
						}
					},
					complete: function(XMLHttpRequest, textStatus) {
						//console.log(onComplete);
						//if (onComplete) { onComplete(); }
					}
				});
			}
		},



		getMovieThumbType: function() {
			return this.movieThumbType;
		},



		getTvShowThumbType: function() {
			return this.tvshowThumbType;
		},



		hasQuit: function() {
			return this.xbmcHasQuit;
		},



		setHasQuit: function() {
			this.xbmcHasQuit = true;
		},



		formatTime: function (seconds) {
			var hh = Math.floor(seconds / 3600);
			var mm = Math.floor((seconds - hh*3600) / 60);
			var ss = seconds - hh*3600 - mm*60;
			var result = '';
			if (hh > 0)
				result = (hh<10 ? '0' : '') + hh + ':';
			return  result + (mm<10 ? '0' : '') + mm + ':' + (ss<10 ? '0' : '') + ss ;
		},



		getSeconds: function (time) {
			var seconds = 0;
			var i = 0;
			while (time.length > 0) {
				var next = time.substr(time.length-2);
				seconds += Math.pow(60, i) * parseInt(next); // works for hours, minutes, seconds
				if (time.length > 0) {
					time = time.substr(0, time.length-3);
				}
				++i;
			}

			return seconds;
		},

		getThumbUrl: function(url) {
			return '/vfs/' + encodeURI(url);
		},
		
		getUrl: function(url) {
			return location.protocol + '//' + location.host + '/' + encodeURI(url);
		},

		getLogo: function(filepath) {
			//need to figure out callback!
			var path = filepath.substring(0, filepath.lastIndexOf("/"));
			
			path += '/logo.png';
			//console.log(path);
			
			var logo = xbmc.getPrepDownload({
					path: path,
					onSuccess: function(result) {
						return xbmc.getUrl(result.details.path);
						//console.log(logo);
					},
					onError: function(errorText) {
						return '';
						console.log('No logo found');
					},
				});
			console.log(logo);
			return path;
		},
		
		detectThumbTypes: function(initContainer, callback) {
			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": {"properties" : ["thumbnail"]}, "id": 1}',

				function (response) {
					if (response.result.tvshows) {
						var $img = $('<img />').appendTo(initContainer);
						$.each(response.result.tvshows, function(i, tvshow) {
							if (tvshow.thumbnail) {
								$img
									.bind('load', function() {
										if (this.width/this.height < 5) {
											xbmc.tvshowThumbType = 'Poster';
										} // else 'Banner'
										callback();
									})
									.bind('error', function() {
										// use default: 'Banner'
										callback(mkf.lang.get('message_failed_detect_thumb_type'));
									})
									.attr('src', xbmc.getThumbUrl(tvshow.thumbnail));

								return false;
							}
						});
					} else {
						// no tv shows
						callback();
					}
				},

				function (response) {
					callback(mkf.lang.get('message_failed_detect_thumb_type'));
				},

				null,
				false // not async
			);
		},

		scanVideoLibrary: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.Scan"}',
				settings.onSuccess,
				settings.onError
			);
		},
		
		cleanVideoLibrary: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.Clean"}',
				settings.onSuccess,
				settings.onError
			);
		},
		
		exportVideoLibrary: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.Export"}',
				settings.onSuccess,
				settings.onError
			);
		},	
		
		scanAudioLibrary: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.Scan"}',
				settings.onSuccess,
				settings.onError
			);
		},
		
		cleanAudioLibrary: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc":"2.0","id":2,"method":"AudioLibrary.Clean"}',
				settings.onSuccess,
				settings.onError
			);
		},
		
		exportAudioLibrary: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc":"2.0","id":2,"method":"AudioLibrary.Export"}',
				settings.onSuccess,
				settings.onError
			);
		},
		
		setVolume: function(options) {
			var settings = {
				volume: 50,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Application.SetVolume", "params": { "volume": ' + settings.volume + '}, "id": 1}',
				settings.onSuccess,
				settings.onError
			);
		},

		setMute: function() {
			var settings = {
				onSuccess: null,
				onError: null
			};
			//$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Application.SetMute", "params": { "mute": "toggle" }, "id": 1}',
				settings.onSuccess,
				settings.onError
			);
		},
		

		shutdown: function(options) {
			var settings = {
				type: 'shutdown',
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			var commands = {shutdown: 'System.Shutdown', quit: 'Application.Quit', suspend: 'System.Suspend', reboot: 'System.Reboot'};

			if (commands[settings.type]) {
				xbmc.sendCommand(
					'{"jsonrpc": "2.0", "method": "' + commands[settings.type] + '", "id": 1}',
					function () {
						xbmc.setHasQuit();
						settings.onSuccess();
					},
					settings.onError
				);
				return true;
			}

			return false;
		},



		control: function(options) {
			var settings = {
				type: 'play',
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			var commands = {play: 'PlayPause', stop: 'Stop', prev: 'GoPrevious', next: 'GoNext', shuffle: 'Shuffle', unshuffle: 'Unshuffle'};

			if (commands[settings.type]) {
				xbmc.sendCommand(
					'{"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1}',

					function (response) {

						if (response.result[0]) {
							xbmc.sendCommand(
								'{"jsonrpc": "2.0", "method": "Player.' + commands[settings.type] + '", "params": { "playerid": ' + response.result[0].playerid + ' }, "id": 1}',
								settings.onSuccess,
								settings.onError
							);
						}
					},
					settings.onError
				);
				return true;
			}
			return false;
		},


		controlRepeat: function(options) {
			var settings = {
				type: options,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			//var commands = {repeat: 'all', repeat1: 'one', unrepeat: 'off'};

			if (settings.type) {
				xbmc.sendCommand(
					'{"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1}',

					function (response) {
						if (response.result[0]) {
							xbmc.sendCommand(
								'{"jsonrpc": "2.0", "method": "Player.Repeat", "params": { "playerid": ' + response.result[0].playerid + ', "state": "' + settings.type + '" }, "id": 1}',
								settings.onSuccess,
								settings.onError
							);
						}
					},
					settings.onError
				);
				return true;
			}
			return false;
		},
		
		setSubtitles:  function(options) {
			var settings = {
				command: 'off',
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Player.SetSubtitle", "params": { "playerid": 1, "subtitle": "' + settings.command +'"}, "id": 1}',
					settings.onSuccess,
					settings.onError
			);
		},
		
		setAudioStream:  function(options) {
			var settings = {
				command: 'next',
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Player.SetAudioStream", "params": { "playerid": 1, "stream": "' + settings.command +'"}, "id": 1}',
					settings.onSuccess,
					settings.onError
			);
		},
		
		
		seekPercentage: function(options) {
			var settings = {
				percentage: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1}',

				function (response) {
					var playerResult = response.result;
					var player = '';

					if (playerResult[0].type == 'audio') {
						player = 'Audio';

					} else if (playerResult[0].type == 'video') {
						player = 'Video';

					} else {
						// No player is active
						return;
					}

					xbmc.sendCommand(
						//'{"jsonrpc": "2.0", "method": "' + player + 'Player.SeekPercentage", "params": ' + settings.percentage + ', "id": 1}',
						'{"jsonrpc": "2.0", "method": "Player.Seek", "params": {"value": ' + settings.percentage + ', "playerid": ' + playerResult[0].playerid + '}, "id": 1}',

						settings.onSuccess,
						settings.onError
					);
				},

				settings.onError
			);
		},

		getAspect: function(aspect) {
			if (aspect == 0)
				return 0;
			if (aspect >= 1.30 && aspect <= 1.39)
				return '133';
			else if (aspect < 1.7)
				return '166';
			else if (aspect < 1.79)
				return '178';
			else if (aspect >= 1.80 && aspect <= 1.95 )
				return '185';
			else if (aspect < 2.34)
				return '220';
			else
				return '235';
		},

		getvFormat: function(width) {
			if (width == 1920) { 
				return 'HD1080';
			} else if (width == 1280 ) { 
				return 'HD720';
			} else {
				return 'SD';
			};
		},
		
		getVcodec: function(vcodec) {
			switch (vcodec) {
			case 'h264':
				return 'H264';
				break;
			case 'xvid':
				return 'XVID';
				break;
			case 'div3':
				//div3 dx50
				return 'DivX3';
				break;
			case 'dx50':
				return 'DivX5';
				break;
			case 'avc1':
				return 'AVC1';
				break;
			case 'vp8':
				return 'VP8';
				break;
			case 'mpeg1':
				return 'MPEG1';
				break;
			case 'mpeg2':
				return 'MPEG2';
				break;
			case 'dvd':
				return 'DVD';
				break;
			case 'bluray':
				return 'BluRay';
				break;
			case 'vc-1':
				return 'VC1';
				break;
			case 'wvc1':
				return 'VC1';
				break;
			case 'flv':
				return 'FLV';
				break;
			};
			return 'Unknown';
		},
		

		getAcodec: function (acodec) {
			switch (acodec) {
			case 'aac':
				return 'AAC';
				break;
			case 'ac3':
				return 'AC3';
				break;
			case 'aif':
				return 'AIF';
				break;
			case 'aifc':
				return 'AIFC';
				break;
			case 'ape':
				return 'APE';
				break;
			case 'avc':
				return 'AVC';
				break;
			case 'cdda':
				return 'CDDA';
				break;
			case 'dca':
				return 'DCA';
				break;
			case 'dts':
				return 'DTS';
				break;
			case 'dtshd_hra':
				return 'DTSHD';
				break;
			case 'dtshd_ma':
				return 'DTSMA';
				break;
			case 'eac3':
				return 'EAC3';
				break;
			case 'flac':
				return 'FLAC';
				break;
			case 'mp1':
				return 'MP1';
				break;
			case 'mp2':
				return 'MP2';
				break;
			case 'mp3':
				return 'MP3';
				break;
			case 'ogg':
				return 'OGG';
				break;
			case 'vorbis':
				return 'OGG';
				break;
			case 'truehd':
				return 'DDTrueHD';
				break;
			case 'wav':
				return 'wav';
				break;
			case 'wavpack':
				return 'wavpack';
				break;
			case 'wma':
				return 'WMA';
				break;
			case 'wmapro':
				return 'WMAPro';
				break;
			case 'wma2':
				return 'WMA2';
				break;
			case 'pcm_bluray':
				return 'PCM';
				break;
			case 'alac':
				return 'ALAC';
				break;
			};		
		},
		
		
		getAudioGenres: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetGenres", "params": {"sort": { "order": "ascending", "method": "label" } }, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},
		
		getArtists: function(options) {
			var settings = {
				genreid: -1,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetArtists", "params": {"sort": { "order": "ascending", "method": "artist" } }, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},

		
		getArtistsGenres: function(options) {
			var settings = {
				genreid: -1,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetArtists", "params": {"genreid": ' + settings.genreid + ', "sort": { "order": "ascending", "method": "artist" } }, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},


		getGenresAlbums: function(options) {
			var settings = {
				genreid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);
			
			var order = mkf.cookieSettings.get('albumOrder')=='album'? 'label' : 'artist';

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": { "genreid" : ' + settings.genreid + ', "properties": ["artist", "genre", "rating", "thumbnail"], "sort": { "order": "ascending", "method": "' + order + '" } }, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},
		
		
		getArtistsAlbums: function(options) {
			var settings = {
				artistid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": { "artistid" : ' + settings.artistid + ', "properties": ["artist", "genre", "rating", "thumbnail"] }, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},



		getAlbums: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			var order = mkf.cookieSettings.get('albumOrder')=='album'? 'label' : 'artist';

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": {"properties": ["artist", "genre", "rating", "thumbnail"], "sort": { "order": "ascending", "method": "' + order + '" } }, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},


		getMusicPlaylists: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params": {"directory": "special://profile/playlists/music/", "media": "music"}, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},
		
		getVideoPlaylists: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params": {"directory": "special://profile/playlists/video/", "media": "video"}, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},
		
		
		addSongToPlaylist: function(options) {
			var settings = {
				songid: 0,
				onSuccess: null,
				onError: null,
				async: true
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": {"item": {"songid": ' + settings.songid + '}, "playlistid": 0}, "id": 1}',
				settings.onSuccess,
				settings.onError,
				null,
				settings.async
			);
		},



		addAudioFileToPlaylist: function(options) {
			var settings = {
				file: '',
				onSuccess: null,
				onError: null,
				async: true
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item": {"file": "' + settings.file.replace(/\\/g, "\\\\") + '"}, "playlistid": 0 }, "id": 1}',
				settings.onSuccess,
				settings.onError,
				null,
				settings.async
			);
		},




		addAudioFolderToPlaylist: function(options) {
			var settings = {
				folder: '',
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			//Will not recurse
			//console.log(settings.folder);
			var containsfiles = false;
			var recurseDir = [];
			
			xbmc.getDirectory({
				media: 'music',
				directory: settings.folder,
				
				onSuccess: function(result) {
					//console.log(result);
					var n = 0;
					$.each(result.files, function(i, file) {
						if (file.filetype == 'file') {
							//console.log( i + '.audio file!');
							containsfiles = true;
						};
						if (file.filetype == 'directory') {
							//console.log( n + '.dir');
							recurseDir[n] = file.file;
							n ++;
						};
						//if (file.filetype == 'file') { if (file.file.search(/\.mp3|\.flac|\.wav|\.aac/i)) { console.log( i + '.audio file!') }; };
					});
				},
				onError: function() {
					settings.onError(mkf.lang.get('message_failed_folders_content'));
				}
			});
			//console.log(recurseDir);
			//console.log(containsfiles);
			if (containsfiles) {
				//console.log('send dir to playlist');
				xbmc.sendCommand(
					'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": {"item": {"directory": "' + settings.folder + '"}, "playlistid": 0}, "id": 1}',
					
					function(response) {
						settings.onSuccess()
					},
					
					function(response) {
						settings.onError(mkf.lang.get('message_failed_add_files_to_playlist'));
					}
				);	
			};
			if (recurseDir.length > 0) {
				//console.log('send dir to playlist');
				$.each(recurseDir, function(i, dir) {
					//console.log('adding dir: ' + dir);
					xbmc.sendCommand(
						'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": {"item": {"directory": "' + recurseDir[i] + '"}, "playlistid": 0}, "id": 1}',
						
						function(response) {
							settings.onSuccess()
						},
						
						function(response) {
							settings.onError(mkf.lang.get('message_failed_add_files_to_playlist'));
						}
					);	
				});
			};
			if (!containsfiles && recurseDir.length == 0) { settings.onError(mkf.lang.get('message_failed_add_files_to_playlist')); };
			/*xbmc.getDirectory({
				media: 'Audio',
				directory: settings.folder.replace(/\\/g, "\\\\"),

				onSuccess: function(result) {
					var error = false;
					var files = result.files;
					if (files) {
						files.sort(function(a, b) {
							if (a.file < b.file) return -1;
							if (a.file > b.file) return 1;
							return 0;
						});
						$.each(files, function(i, file)  {
							xbmc.addAudioFileToPlaylist({
								'file': file.file,
								onError: function() {
									error = true;
								},
								async: false
							});
						});
					}
					if (error) {
						settings.onError(mkf.lang.get('message_failed_add_files_to_playlist'));
					} else {
						settings.onSuccess();
					}
				},

				onError: function() {
					settings.onError(mkf.lang.get('message_failed_folders_content'));
				}
			});*/
		},

		
		addAlbumToPlaylist: function(options) {
			var settings = {
				albumid: 0,
				onSuccess: null,
				onError: null,
				async: false
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": {"item": {"albumid": ' + settings.albumid + '}, "playlistid": 0}, "id": 1}',
				
				function(response) {
					settings.onSuccess()
				},
				
				function(response) {
					settings.onError(mkf.lang.get('message_failed_albums_songs'));
				}
			);			
		},


		clearAudioPlaylist: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.Clear", "params": { "playlistid": 0 }, "id": 1}',
				settings.onSuccess,
				settings.onError
			);
		},


		swapAudioPlaylist: function(options) {
			var settings = {
				plFrom: '0',
				plTo: '0',
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.Swap", "params": { "playlistid": 0, "position1": ' + settings.plFrom + ', "position2": '+ settings.plTo +' }, "id": 1}',
				settings.onSuccess,
				settings.onError
			);
		},
		
		
		swapVideoPlaylist: function(options) {
			var settings = {
				plFrom: '0',
				plTo: '0',
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.Swap", "params": { "playlistid": 1, "position1": ' + settings.plFrom + ', "position2": '+ settings.plTo +' }, "id": 1}',
				settings.onSuccess,
				settings.onError
			);
		},

		
		playAudio: function(options) {
			var settings = {
				item: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Player.Open", "params" : { "item" : { "playlistid" : 0, "position": ' + settings.item + ' } }, "id": 1}',
				settings.onSuccess,
				function(response) {
					settings.onError(mkf.lang.get('message_failed_play' + 'settings.item'));
				}
			);
		},

		removeAudioPlaylistItem: function(options) {
			var settings = {
				item: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.Remove", "params" : { "playlistid" : 0, "position": ' + settings.item + ' }, "id": 1}',
				settings.onSuccess,
				function(response) {
					settings.onError(mkf.lang.get('message_failed_remove' + 'settings.item'));
				}
			);
		},
		
		removeVideoPlaylistItem: function(options) {
			var settings = {
				item: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.Remove", "params" : { "playlistid" : 1, "position" : ' + settings.item + ' }, "id": 1}',
				settings.onSuccess,
				function(response) {
					settings.onError(mkf.lang.get('message_failed_remove' + 'settings.item'));
				}
			);
		},


		playAlbum: function(options) {
			var settings = {
				albumid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			this.clearAudioPlaylist({
				onSuccess: function() {
					xbmc.addAlbumToPlaylist({
						albumid: settings.albumid,

						onSuccess: function() {
							xbmc.playAudio({
								onSuccess: settings.onSuccess,
								onError: function(errorText) {
									settings.onError(errorText);
								}
							});
						},

						onError: function(errorText) {
							settings.onError(errorText);
						}
					});
				},

				onError: function() {
					settings.onError(mkf.lang.get('message_failed_clear_playlist'));
				}
			});
		},



		playSong: function(options) {
			var settings = {
				songid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			this.clearAudioPlaylist({
				onSuccess: function() {
					xbmc.addSongToPlaylist({
						songid: settings.songid,

						onSuccess: function() {
							xbmc.playAudio({
								onSuccess: settings.onSuccess,
								onError: function(errorText) {
									settings.onError(errorText);
								}
							});
						},

						onError: function() {
							settings.onError(mkf.lang.get('message_failed_add_song_to_playlist'));
						}
					});
				},

				onError: function() {
					settings.onError(mkf.lang.get('message_failed_clear_playlist'));
				}
			});
		},



		playAudioFile: function(options) {
			var settings = {
				file: '',
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			this.clearAudioPlaylist({
				onSuccess: function() {
					xbmc.addAudioFileToPlaylist({
						file: settings.file,

						onSuccess: function() {
							xbmc.playAudio({
								onSuccess: settings.onSuccess,
								onError: function(errorText) {
									settings.onError(errorText);
								}
							});
						},

						onError: function() {
							settings.onError(mkf.lang.get('message_failed_add_file_to_playlist'));
						}
					});
				},

				onError: function() {
					settings.onError(mkf.lang.get('message_failed_clear_playlist'));
				}
			});
		},



		playAudioFolder: function(options) {
			var settings = {
				folder: '',
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			this.clearAudioPlaylist({
				onSuccess: function() {
					xbmc.addAudioFolderToPlaylist({
						folder: settings.folder,

						onSuccess: function() {
							xbmc.playAudio({
								onSuccess: settings.onSuccess,
								onError: function(errorText) {
									settings.onError(errorText);
								}
							});
						},

						onError: function(errorText) {
							settings.onError(errorText);
						}
					});
				},

				onError: function() {
					settings.onError(mkf.lang.get('message_failed_clear_playlist'));
				}
			});
		},



		getAlbumsSongs: function(options) {
			var settings = {
				albumid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": { "albumid": ' + settings.albumid + ', "properties": ["artist", "track"] }, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},



		getAudioPlaylist: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.GetItems", "params": { "properties": ["title", "album", "artist", "duration"], "playlistid": 0 }, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},



		clearVideoPlaylist: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.Clear", "params": { "playlistid": 1 }, "id": 1}',
				settings.onSuccess,
				settings.onError
			);
		},



		playVideo: function(options) {
			var settings = {
				item: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Player.Open", "params" : { "item" : { "playlistid" : 1, "position": ' + settings.item + ' } }, "id": 1}',
				settings.onSuccess,
				function(response) {
					settings.onError(mkf.lang.get('message_failed_play'));
				}
			);
		},



		addVideoFileToPlaylist: function(options) {
			var settings = {
				file: '',
				onSuccess: null,
				onError: null,
				async: true
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item" : { "file": "' + settings.file.replace(/\\/g, "\\\\") + '"}, "playlistid": 1 }, "id": 1}',
				settings.onSuccess,
				settings.onError,
				null,
				settings.async
			);
		},



		addVideoFolderToPlaylist: function(options) {
			var settings = {
				folder: '',
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item" : { "directory": "' + settings.folder.replace(/\\/g, "\\\\") + '"}, "playlistid": 1 }, "id": 1}',
				settings.onSuccess,
				settings.onError,
				null,
				settings.async
			);
			
			/*xbmc.getDirectory({
				media: 'Video',
				directory: settings.folder.replace(/\\/g, "\\\\"),

				onSuccess: function(result) {
					var error = false;
					var files = result.files;
					if (files) {
						files.sort(function(a, b) {
							if (a.file < b.file) return -1;
							if (a.file > b.file) return 1;
							return 0;
						});
						alert(objToStr(files,''));
						$.each(files, function(i, file)  {
							xbmc.addVideoFileToPlaylist({
								'file': file.file,
								onError: function() {
									error = true;
								},
								async: false
							});
						});
					}
					if (error) {
						settings.onError(mkf.lang.get('message_failed_add_files_to_playlist'));
					} else {
						settings.onSuccess();
					}
				},

				onError: function() {
					settings.onError(mkf.lang.get('message_failed_folders_content'));
				}
			});*/
		},



		addMovieToPlaylist: function(options) {
			var settings = {
				movieid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": {"item": {"movieid": ' + settings.movieid + '}, "playlistid": 1}, "id": 1}',
				settings.onSuccess,
				settings.onError,
				null,
				settings.async
			);
		},



		playMovie: function(options) {
			var settings = {
				movieid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			this.clearVideoPlaylist({
				onSuccess: function() {
					xbmc.addMovieToPlaylist({
						movieid: settings.movieid,

						onSuccess: function() {
							xbmc.playVideo({
								onSuccess: settings.onSuccess,
								onError: function(errorText) {
									settings.onError(errorText);
								}
							});
						},

						onError: function() {
							settings.onError(mkf.lang.get('message_failed_add_movie_to_playlist'));
						}
					});
				},

				onError: function() {
					settings.onError(mkf.lang.get('message_failed_clear_playlist'));
				}
			});
		},



		playVideoFile: function(options) {
			var settings = {
				file: '',
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			this.clearVideoPlaylist({
				onSuccess: function() {
					xbmc.addVideoFileToPlaylist({
						file: settings.file,

						onSuccess: function() {
							xbmc.playVideo({
								onSuccess: settings.onSuccess,
								onError: function(errorText) {
									settings.onError(errorText);
								}
							});
						},

						onError: function() {
							settings.onError(mkf.lang.get('message_failed_add_file_to_playlist'));
						}
					});
				},

				onError: function() {
					settings.onError(mkf.lang.get('message_failed_clear_playlist'));
				}
			});
		},



		playVideoFolder: function(options) {
			var settings = {
				folder: '',
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			this.clearVideoPlaylist({
				onSuccess: function() {
					xbmc.addVideoFolderToPlaylist({
						folder: settings.folder,

						onSuccess: function() {
							xbmc.playVideo({
								onSuccess: settings.onSuccess,
								onError: function(errorText) {
									settings.onError(errorText);
								}
							});
						},

						onError: function(errorText) {
							settings.onError(errorText);
						}
					});
				},

				onError: function() {
					settings.onError(mkf.lang.get('message_failed_clear_playlist'));
				}
			});
		},

		
		getMovies: function(options) {
			var settings = {
				sortby: 'label',
				order: 'ascending',
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			settings.sortby = mkf.cookieSettings.get('filmSort', 'label');
			settings.order = mkf.cookieSettings.get('mdesc', 'ascending');

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": {"properties" : ["rating", "thumbnail", "playcount"], "sort": { "order": "' + settings.order +'", "method": "' + settings.sortby + '", "ignorearticle": true } }, "id": 1}',
				//'{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": {"properties" : ["genre", "director", "plot", "title", "originaltitle", "runtime", "year", "rating", "thumbnail", "playcount", "file", "tagline", "set"], "sort": { "order": "ascending", "method": "label" } }, "id": 1}',
				function(response) {
					if (settings.order == 'descending' && settings.sortby == 'none') {
					var mresult = $.makeArray(response.result.movies).reverse();
					delete response.result.movies;
					response.result.movies = mresult;
					settings.onSuccess(response.result);
					} else {
					settings.onSuccess(response.result);
					};
				},
				settings.onError
			);
		},


		getMovieInfo: function(options) {
			var settings = {
				movieid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovieDetails", "params": { "movieid": ' + settings.movieid + ', "properties": ["genre", "director", "plot", "title", "originaltitle", "runtime", "year", "rating", "thumbnail", "playcount", "file", "tagline", "set", "lastplayed", "studio", "mpaa", "votes", "streamdetails", "writer", "fanart", "imdbnumber"] },  "id": 2}',
				function(response) {
					settings.onSuccess(response.result.moviedetails);
				},
				settings.onError
			);
		},
		
		

		addEpisodeToPlaylist: function(options) {
			var settings = {
				episodeid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.Add", "params": {"item": {"episodeid": ' + settings.episodeid + '}, "playlistid": 1}, "id": 1}',
				settings.onSuccess,
				settings.onError,
				null,
				settings.async
			);
		},



		playEpisode: function(options) {
			var settings = {
				episodeid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			this.clearVideoPlaylist({
				onSuccess: function() {
					xbmc.addEpisodeToPlaylist({
						episodeid: settings.episodeid,

						onSuccess: function() {
							xbmc.playVideo({
								onSuccess: settings.onSuccess,
								onError: function(errorText) {
									settings.onError(errorText);
								}
							});
						},

						onError: function() {
							settings.onError(mkf.lang.get('message_failed_add_episode_to_playlist'));
						}
					});
				},

				onError: function() {
					settings.onError(mkf.lang.get('message_failed_clear_playlist'));
				}
			});
		},



		getTvShows: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": { "properties": ["genre", "plot", "title", "originaltitle", "year", "rating", "thumbnail", "playcount", "file", "fanart"] }, "id": 1}',
				function(response) {
					settings.onSuccess(response.result);
				},
				settings.onError
			);
		},



		getSeasons: function(options) {
			var settings = {
				tvshowid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetSeasons", "params": { "tvshowid": ' + settings.tvshowid + ', "properties": ["season", "playcount"]}, "id": 1}',
				function(response) {
					settings.onSuccess(response.result);
				},
				settings.onError
			);
		},



		getEpisodes: function(options) {
			var settings = {
				tvshowid: 0,
				season: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": { "tvshowid": ' + settings.tvshowid + ', "season" : ' + settings.season + ', "properties": ["episode", "playcount", "fanart"], "sort": { "order": "ascending", "method": "episode" } }, "id": 1}',
				function(response) {
					settings.onSuccess(response.result);
				},
				settings.onError
			);
		},


		getEpisodeDetails: function(options) {
			var settings = {
				episodeid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodeDetails", "params": { "episodeid": ' + settings.episodeid + ', "properties": ["season", "episode", "firstaired", "plot", "title", "runtime", "rating", "thumbnail", "playcount", "file", "fanart", "streamdetails"] }, "id": 2}',
				function(response) {
					settings.onSuccess(response.result.episodedetails);
				},
				settings.onError
			);
		},
		
		
		getVideoPlaylist: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Playlist.GetItems", "params": { "properties": [ "runtime", "showtitle", "season", "title" ], "playlistid": 1}, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},



		getSources: function(options) {
			var settings = {
				media: 'music',
				onSuccess: null,
				onError: null,
				async: true
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Files.GetSources", "params" : { "media" : "' + settings.media + '" }, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError,
				null,
				settings.async
			);
		},

		
		getRecentlyAddedEpisodes: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.GetRecentlyAddedEpisodes","params":{ "limits": {"end": 25},"properties":["title","runtime","season","episode","showtitle","thumbnail","file","plot","playcount","tvshowid"]}} ',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},

		getunwatchedEps: function(options) {
			var settings = {
				tvshowid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			var eps = [];
			
			xbmc.sendCommand(
				'{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.GetEpisodes","params":{ "tvshowid": ' + settings.tvshowid + ', "properties":["season","playcount","episode"]}}',

				function(response) {
					var n = 0;
					$.each(response.result.episodes, function (i, episode) {
						if (episode.playcount == 0) {
							eps.splice(n,0,response.result.episodes[i]);
							n += 1;
						}
					});
					settings.onSuccess(eps);
				},

				settings.onError
			);
		},
		
		getRecentlyAddedMovies: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.GetRecentlyAddedMovies","params":{ "limits": {"end": 25},"properties":["title","originaltitle","runtime","thumbnail","file","year","plot","tagline","playcount","rating","genre","director"]}}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},
		
		getRecentlyAddedAlbums: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc":"2.0","id":2,"method":"AudioLibrary.GetRecentlyAddedAlbums","params":{ "limits": {"end": 25},"properties":["thumbnail","genre","artist","rating"]}}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},

		getPrepDownload: function(options) {
			var settings = {
				path: '',
				onSuccess: null,
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Files.PrepareDownload", "params": { "path": "' + settings.path + '"}, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},

		
		getDirectory: function(options) {
			var settings = {
				media: 'music',
				isPlaylist: false,
				directory: '',
				onSuccess: null,
				onError: null,
				async: false
			};
			$.extend(settings, options);

			var command;
			
			if (settings.isPlaylist) {
				command = '{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params" : { "directory" : "' + settings.directory.replace(/\\/g, "\\\\") + '", "media" : "' + settings.media +'" }, "id": 1}'
				} else {
				command = '{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params" : { "directory" : "' + settings.directory.replace(/\\/g, "\\\\") + '", "media" : "' + settings.media +'", "sort": { "order": "ascending", "method": "file" } }, "id": 1}'
				};
			xbmc.sendCommand(
				command,

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError,
				null,
				settings.async
			);
		}



	}); // END xbmc



	$.extend(xbmc, {
		periodicUpdater: {
			volumeChangedListener: [],
			currentlyPlayingChangedListener: [],
			playerStatusChangedListener: [],
			progressChangedListener: [],
			
			addVolumeChangedListener: function(fn) {
				this.volumeChangedListener.push(fn);
			},

			addCurrentlyPlayingChangedListener: function(fn) {
				this.currentlyPlayingChangedListener.push(fn);
			},

			addPlayerStatusChangedListener: function(fn) {
				this.playerStatusChangedListener.push(fn);
			},

			addProgressChangedListener: function(fn) {
				this.progressChangedListener.push(fn);
			},

			firePlayerStatusChanged: function(status) {
				$.each(xbmc.periodicUpdater.playerStatusChangedListener, function(i, listener)  {
					listener(status);
				});
			},

			fireCurrentlyPlayingChanged: function(file) {
				$.each(xbmc.periodicUpdater.currentlyPlayingChangedListener, function(i, listener)  {
					listener(file);
				});
			},

			fireProgressChanged: function(progress) {
				$.each(xbmc.periodicUpdater.progressChangedListener, function(i, listener)  {
					listener(progress);
				});
			},

			start: function() {
				setTimeout($.proxy(this, "periodicStep"), 10);
			},

			periodicStep: function() {
				
				//Stop changed status firering by only setting vars once!
				if (typeof xbmc.periodicUpdater.lastVolume === 'undefined') {
					$.extend(xbmc.periodicUpdater, {
						lastVolume: -1
					});
				}
				if (typeof xbmc.periodicUpdater.shuffleStatus === 'undefined') {
					$.extend(xbmc.periodicUpdater, {
						shuffleStatus: false
					});
				}
				if (typeof xbmc.periodicUpdater.currentlyPlayingFile === 'undefined') {
					$.extend(xbmc.periodicUpdater, {
						currentlyPlayingFile: null
					});
				}				
				if (typeof xbmc.periodicUpdater.progress === 'undefined') {
					$.extend(xbmc.periodicUpdater, {
						progress: ''
					});
				}
				if (typeof xbmc.periodicUpdater.playerStatus === 'undefined') {
					$.extend(xbmc.periodicUpdater, {
						playerStatus: 'stopped'
					});
				}
				//For highlighting current item in playlist
				if (typeof xbmc.periodicUpdater.curPlaylistNum === 'undefined') {
					$.extend(xbmc.periodicUpdater, {
						curPlaylistNum: 0
					});
				}
				if (typeof xbmc.periodicUpdater.repeatStatus === 'undefined') {
					$.extend(xbmc.periodicUpdater, {
						repeatStatus: 'off'
					});
				}
				if (typeof xbmc.periodicUpdater.muteStatus === 'undefined') {
					$.extend(xbmc.periodicUpdater, {
						muteStatus: 'off'
					});
				}
				if (typeof $backgroundFanart === 'undefined') {
					$backgroundFanart = '';
				}
				if (typeof xbmc.periodicUpdater.subsenabled === 'undefined') {
					xbmc.periodicUpdater.subsenabled = false;
				}
				var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
				var ui = mkf.cookieSettings.get('ui');
				
				// ---------------------------------
				// ---      Volume Changes       ---
				// ---------------------------------
				// --- Currently Playing Changes ---
				// ---------------------------------
				if ((this.volumeChangedListener &&
					this.volumeChangedListener.length) ||
					(this.currentlyPlayingChangedListener &&
					this.currentlyPlayingChangedListener.length) ||
					(this.playerStatusChangedListener &&
					this.playerStatusChangedListener.length) ||
					(this.progressChangedListener &&
					this.progressChangedListener.length)) {

					var activePlayer = '';

					xbmc.sendCommand(
						//'{"jsonrpc": "2.0", "method": "XBMC.GetInfoLabels", "params" : {"labels": ["MusicPlayer.Title", "MusicPlayer.Album", "MusicPlayer.Artist", "Player.Time", "Player.Duration", "Player.Volume", "Playlist.Random", "VideoPlayer.Title", "VideoPlayer.TVShowTitle", "Player.Filenameandpath"]}, "id": 1}',
						'{"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1}',

						function (response) {
							var playerActive = response.result;
							//need to cover slideshow
							if (playerActive == '') {
								activePlayer = 'none';
							} else {
								activePlayer = playerActive[0].type;
								activePlayerid = playerActive[0].playerid;
							}
						},
						
						function(response) {
							activePlayer = 'none'; // ERROR
						},

						null, false // not async
					);

					// has volume changed? Or first start?
					//if (activePlayer != 'none' || xbmc.periodicUpdater.lastVolume == -1) {
						xbmc.sendCommand(
							'{"jsonrpc": "2.0", "method": "Application.GetProperties", "params": { "properties": [ "volume", "muted" ] }, "id": 1}',

							function (response) {
								var volume = response.result.volume;
								var muted = response.result.muted;
								if (volume != xbmc.periodicUpdater.lastVolume) {
									xbmc.periodicUpdater.lastVolume = volume;
										$.each(xbmc.periodicUpdater.volumeChangedListener, function(i, listener)  {
									listener(volume);
									});
								};
								if (muted != xbmc.periodicUpdater.muteStatus) {
									xbmc.periodicUpdater.muteStatus = muted;
									if (muted) {
										xbmc.periodicUpdater.firePlayerStatusChanged('muteOn');
									} else {
										xbmc.periodicUpdater.firePlayerStatusChanged('muteOff');
									};
								};
							},

							null, true // IS async // not async
						);
					//}

					// playing state					
					// We reached the end my friend... (of the playlist)
					if ( xbmc.periodicUpdater.playerStatus != 'stopped' && activePlayer == 'none') {
						xbmc.periodicUpdater.playerStatus = 'stopped';
						if ( $backgroundFanart != '' && useFanart ) {
							$backgroundFanart = '';
							if ( ui == 'default') {
								$('#main').css('background-image', 'url("")');
							} else {
								$('#content').css('background-image', 'url("")');
							}
						};
						xbmc.periodicUpdater.firePlayerStatusChanged('stopped');
					}

					if (activePlayer != 'none') {
						var request = '';

						if (activePlayer == 'audio' || activePlayer == 'video' ) {
							request = '{"jsonrpc":"2.0","id":2,"method":"Player.GetProperties","params":{ "playerid":' + activePlayerid + ',"properties":["speed", "shuffled", "repeat", "subtitleenabled"] } }'

						}/* else if (activePlayer == 'video') {
							request = '{"jsonrpc":"2.0","id":4,"method":"Player.GetProperties","params":{ "playerid":1,"properties":["speed", "shuffled", "repeat"] } }'
						}*/

						xbmc.sendCommand(
							request,

							function (response) {
								var currentPlayer = response.result;
								
								if (currentPlayer.speed != 0 && currentPlayer.speed != 1 ) {
									// not playing
									if (xbmc.periodicUpdater.playerStatus != 'stopped') {
										xbmc.periodicUpdater.playerStatus = 'stopped';
										xbmc.periodicUpdater.firePlayerStatusChanged('stopped');
									}

								} else if (currentPlayer.speed == 0 && xbmc.periodicUpdater.playerStatus != 'paused') {
									xbmc.periodicUpdater.playerStatus = 'paused';
									xbmc.periodicUpdater.firePlayerStatusChanged('paused');

								} else if (currentPlayer.speed == 1 && xbmc.periodicUpdater.playerStatus != 'playing') {
									xbmc.periodicUpdater.playerStatus = 'playing';
									xbmc.periodicUpdater.firePlayerStatusChanged('playing');
								}
								
								//shuffle status changed?
								shuffle = currentPlayer.shuffled;
								if (xbmc.periodicUpdater.shuffleStatus != shuffle) {
									xbmc.periodicUpdater.shuffleStatus = shuffle;
									xbmc.periodicUpdater.firePlayerStatusChanged(shuffle? 'shuffleOn': 'shuffleOff');
								}
								
								//repeat none, one, all
								repeat = currentPlayer.repeat;
								if (xbmc.periodicUpdater.repeatStatus != repeat) {
									xbmc.periodicUpdater.repeatStatus = repeat;
									xbmc.periodicUpdater.firePlayerStatusChanged(repeat);
								}
								
								//subs enabled
								subs = currentPlayer.subtitleenabled;
								if (xbmc.periodicUpdater.subsenabled != subs) {
									xbmc.periodicUpdater.subsenabled = subs;
								}								
							},

							null, null, true // IS async // not async
						);
					}
						// Get current item
					if (activePlayer != 'none') {
						var request = '';

						if (activePlayer == 'audio') {
							request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "duration", "thumbnail", "file", "fanart"], "playerid": 0 }, "id": 1}';
							//requeststate = '{"jsonrpc":"2.0","id":2,"method":"Player.GetProperties","params":{ "playerid":0,"properties":["playlistid","position","percentage","totaltime","time","type","speed"] } }'

						} else if (activePlayer == 'video') {
							request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "season", "episode", "duration", "showtitle", "thumbnail", "file", "fanart"], "playerid": 1 }, "id": 1}';
							//requeststate = '{"jsonrpc":"2.0","id":4,"method":"Player.GetProperties","params":{ "playerid":1,"properties":["playlistid","position","percentage","totaltime","time","type","speed"] } }'
						}
					
						// Current file changed?
						xbmc.sendCommand(
							request,

							function (response) {
								var currentItem = response.result.item;
								//console.log(ui);
								// $('#content').css('background-image', 'url("' +  + '")')
								if ( $backgroundFanart != xbmc.getThumbUrl(currentItem.fanart) && useFanart ) {
									$backgroundFanart = xbmc.getThumbUrl(currentItem.fanart);
									if ( ui == 'default') {
										$('#main').css('background-image', 'url("' + $backgroundFanart + '")');
									} else {
										$('#content').css('background-image', 'url("' + $backgroundFanart + '")');
									}
								};
								if (xbmc.periodicUpdater.currentlyPlayingFile != currentItem.file) {
									xbmc.periodicUpdater.currentlyPlayingFile = currentItem.file;
									$.extend(currentItem, {
										xbmcMediaType: activePlayer
									});
									xbmc.periodicUpdater.fireCurrentlyPlayingChanged(currentItem);
								}
							},

							null, null, true // IS async // not async
						);
						
						xbmc.sendCommand(
							'{"jsonrpc": "2.0", "method": "Player.GetProperties", "params": { "properties": ["time", "totaltime", "position"], "playerid": ' + activePlayerid + ' }, "id": 1}',
							function (response) {
								var currentTimes = response.result;
								var curtime;
								var curruntime;
								var curPlayItemNum = currentTimes.position;
								
								//Get the number of the currently playing item in the playlist
								if (xbmc.periodicUpdater.curPlaylistNum != curPlayItemNum) {
									//Change highlights rather than reload playlist
									if (activePlayer == 'audio') {
										$("div.folderLinkWrapper a.playlistItemCur").removeClass("playlistItemCur");
										$(".apli"+curPlayItemNum).addClass("playlistItemCur");
										xbmc.periodicUpdater.curPlaylistNum = curPlayItemNum;
										//awxUI.onMusicPlaylistShow();
									} else if (activePlayer == 'video') {
										$("#vpli"+xbmc.periodicUpdater.curPlaylistNum).attr("class","playlistItem");
										$("#vpli"+curPlayItemNum).attr("class","playlistItemCur");
										xbmc.periodicUpdater.curPlaylistNum = curPlayItemNum;
										//awxUI.onVideoPlaylistShow();
									}
										
								}
								
								curtime = (currentTimes.time.hours * 3600) + (currentTimes.time.minutes * 60) + currentTimes.time.seconds;
								curruntime = (currentTimes.totaltime.hours * 3600) + (currentTimes.totaltime.minutes * 60) + currentTimes.totaltime.seconds;
								curtimeFormat = xbmc.formatTime(curtime);
								curruntimeFormat = xbmc.formatTime(curruntime);
								time = curtimeFormat;
								if (xbmc.periodicUpdater.progress != time) {
									xbmc.periodicUpdater.fireProgressChanged({"time": time, total: curruntimeFormat});
									xbmc.periodicUpdater.progress = time;
								}
							},

							null, null, true // IS async // not async
						);
					}

				}

				setTimeout($.proxy(this, "periodicStep"), 5000);
			}
		} // END xbmc.periodicUpdater
	}); // END xbmc

})(jQuery);

