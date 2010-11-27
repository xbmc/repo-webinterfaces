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
					url: './jsonrpc?awx',
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
						if (onComplete) { onComplete(); }
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
			return './vfs/' + encodeURI(url);
		},



		detectThumbTypes: function(initContainer, callback) {
			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "id": 1}',

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



		setVolume: function(options) {
			var settings = {
				volume: 50,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "XBMC.SetVolume", "params": ' + settings.volume + ', "id": 1}',
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

			var commands = {shutdown: 'System.Shutdown', quit: 'XBMC.Quit', suspend: 'System.Suspend', reboot: 'System.Reboot'};

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

			var commands = {play: 'PlayPause', stop: 'Stop', prev: 'SkipPrevious', next: 'SkipNext', shuffle: 'Shuffle', unshuffle: 'Unshuffle'};

			if (commands[settings.type]) {
				xbmc.sendCommand(
					'{"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1}',

					function (response) {
						var playerResult = response.result;
						var currentPlayer = '';

						if (playerResult.audio) 		currentPlayer = 'Audio';
						else if (playerResult.video)	currentPlayer = 'Video';
						else if (playerResult.picture)	currentPlayer = 'Picture';

						if (currentPlayer != '') {
							var tmp = (settings.type=='shuffle' || settings.type=='unshuffle'?
										'Playlist': 'Player');
							xbmc.sendCommand(
								'{"jsonrpc": "2.0", "method": "' + currentPlayer + tmp + '.' + commands[settings.type] + '", "id": 1}',
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

					if (playerResult.audio) {
						player = 'Audio';

					} else if (playerResult.video) {
						player = 'Video';

					} else {
						// No player is active
						return;
					}

					xbmc.sendCommand(
						'{"jsonrpc": "2.0", "method": "' + player + 'Player.SeekPercentage", "params": ' + settings.percentage + ', "id": 1}',

						settings.onSuccess,
						settings.onError
					);
				},

				settings.onError
			);
		},



		getArtists: function(options) {
			var settings = {
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetArtists", "params": { "start": 0, "sort": { "order": "ascending", "method": "artist" } }, "id": 1}',

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
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": { "artistid" : ' + settings.artistid + ', "start": 0, "fields": ["album_artist", "album_genre", "album_rating"] }, "id": 1}',

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
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": { "start": 0, "fields": ["album_artist", "album_genre", "album_rating"], "sort": { "order": "ascending", "method": "' + order + '" } }, "id": 1}',

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
				'{"jsonrpc": "2.0", "method": "AudioPlaylist.Add", "params": {"songid": ' + settings.songid + '}, "id": 1}',
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
				'{"jsonrpc": "2.0", "method": "AudioPlaylist.Add", "params": { "file": "' + settings.file.replace(/\\/g, "\\\\") + '" }, "id": 1}',
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

			xbmc.getDirectory({
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
			});
		},



		addAlbumToPlaylist: function(options) {
			var settings = {
				albumid: 0,
				onSuccess: null,
				onError: null
			};
			$.extend(settings, options);

			// Comparator to sort albums by tracknumber ASC
			var songComparator = function(a, b) {
				return a.tracknumber - b.tracknumber;
			}

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": {"albumid": ' + settings.albumid + ', "fields": ["tracknumber"]}, "id": 1}',

				function(response) {
					if (!response.result || !response.result.songs) {
						settings.onError(mkf.lang.get('message_album_not_found'));
						return;
					}

					var songs = response.result.songs;
					songs.sort(songComparator); // sort by tracknumber ASC
					var errors = 0;

					// add each song of the album to the playlist
					$.each(songs, function(i, song)  {
						// add Song to playlist ... max. 2 retries if add failed
						xbmc.addSongToPlaylist({songid: song.songid, async: false, onError: function() {
							xbmc.addSongToPlaylist({songid: song.songid, async: false, onError: function() {
								xbmc.addSongToPlaylist({songid: song.songid, async: false, onError: function() {
									errors += 1;
								}});
							}});
						}});
					});

					if (errors != 0) {
						settings.onError(mkf.lang.get('message_failed_add_songs_to_playlist', [errors]));
					} else {
						settings.onSuccess();
					}
				},

				function(response) {
					settings.onError(mkf.lang.get('message_failed_albums_songs'));
				}
			);
		},



		clearAudioPlaylist: function(options) {
			var settings = {
				onSuccess: null,
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "AudioPlaylist.Clear", "id": 1}',
				settings.onSuccess,
				settings.onError
			);
		},



		playAudio: function(options) {
			var settings = {
				item: 0,
				onSuccess: null,
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "AudioPlaylist.Play", "params": ' + settings.item + ', "id": 1}',
				settings.onSuccess,
				function(response) {
					settings.onError(mkf.lang.get('message_failed_play'));
				}
			);
		},



		playAlbum: function(options) {
			var settings = {
				albumid: 0,
				onSuccess: null,
				onError: null,
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
				onError: null,
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
				onError: null,
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
				onError: null,
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
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": { "albumid": ' + settings.albumid + ', "fields": ["artist", "tracknumber"] }, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},



		getAudioPlaylist: function(options) {
			var settings = {
				onSuccess: null,
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "AudioPlaylist.GetItems", "params": { "fields": ["title", "album", "artist", "duration"] }, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},



		clearVideoPlaylist: function(options) {
			var settings = {
				onSuccess: null,
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoPlaylist.Clear", "id": 1}',
				settings.onSuccess,
				settings.onError
			);
		},



		playVideo: function(options) {
			var settings = {
				item: 0,
				onSuccess: null,
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoPlaylist.Play", "params": ' + settings.item + ', "id": 1}',
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
				'{"jsonrpc": "2.0", "method": "VideoPlaylist.Add", "params": { "file": "' + settings.file.replace(/\\/g, "\\\\") + '" }, "id": 1}',
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


			xbmc.getDirectory({
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
			});
		},



		addMovieToPlaylist: function(options) {
			var settings = {
				movieid: 0,
				onSuccess: null,
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoPlaylist.Add", "params": {"movieid": ' + settings.movieid + '}, "id": 1}',
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
				onError: null,
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
				onError: null,
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
				onError: null,
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



		/*getMovieInfo: function(options) {
			var settings = {
				movieid: 0,
				onSuccess: null,
				onError: null,
			};
			$.extend(settings, options);

			// TODO better: do not get all movies
			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { "fields" : ["genre", "director", "plot", "title", "originaltitle", "runtime", "year", "rating"] }, "id": 1}',

				function (response) {
					var movies = response.result.movies;
					var result = null;

					if (response.result.total > 0) {
						$.each(movies, function(i, movie)  {
							if (movie.movieid == settings.movieid) {
								result = movie;
								return false;
							}
						});
					}

					settings.onSuccess(result);
				},

				settings.onError
			);
		},*/



		getMovies: function(options) {
			var settings = {
				onSuccess: null,
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { "start": 0, "fields" : ["genre", "director", "plot", "title", "originaltitle", "runtime", "year", "rating"], "sort": { "order": "ascending", "method": "label" } }, "id": 1}',
				function(response) {
					settings.onSuccess(response.result);
				},
				settings.onError
			);
		},



		addEpisodeToPlaylist: function(options) {
			var settings = {
				episodeid: 0,
				onSuccess: null,
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoPlaylist.Add", "params": {"episodeid": ' + settings.episodeid + '}, "id": 1}',
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
				onError: null,
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
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": { "start": 0, "fields": ["genre", "director", "plot", "title", "originaltitle", "runtime", "year", "rating"] }, "id": 1}',
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
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetSeasons", "params": { "tvshowid": ' + settings.tvshowid + ', "fields": ["season"]}, "id": 1}',
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
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": { "tvshowid": ' + settings.tvshowid + ', "season" : ' + settings.season + ', "fields": ["episode"], "sort": { "order": "ascending", "method": "episode" } }, "id": 1}',
				function(response) {
					settings.onSuccess(response.result);
				},
				settings.onError
			);
		},



		getVideoPlaylist: function(options) {
			var settings = {
				onSuccess: null,
				onError: null,
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "VideoPlaylist.GetItems", "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError
			);
		},



		getSources: function(options) {
			var settings = {
				media: 'Audio',
				onSuccess: null,
				onError: null,
				async: true
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Files.GetSources", "params" : { "media" : "' + (settings.media=='Audio'? 'music' : 'video') + '" }, "id": 1}',

				function(response) {
					settings.onSuccess(response.result);
				},

				settings.onError,
				null,
				settings.async
			);
		},



		getDirectory: function(options) {
			var settings = {
				media: 'Audio',
				directory: '',
				onSuccess: null,
				onError: null,
				async: true
			};
			$.extend(settings, options);

			xbmc.sendCommand(
				'{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params" : { "directory" : "' + settings.directory.replace(/\\/g, "\\\\") + '", "media" : "' + (settings.media=='Audio'? 'music' : 'video') +'", "sort": { "order": "ascending", "method": "file" } }, "id": 1}',

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

			lastVolume: -1,
			currentlyPlayingFile: null,
			progress: '',
			playerStatus: 'stopped',
			shuffleStatus: false,

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

				var curPlayData = {};
				var shuffle = false;
				var time = '';
				var file = '';
				var volume = 0;

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
						'{"jsonrpc": "2.0", "method": "System.GetInfoLabels", "params" : ["MusicPlayer.Title", "MusicPlayer.Album", "MusicPlayer.Artist", "Player.Time", "Player.Duration", "Player.Volume", "Playlist.Random", "VideoPlayer.Title", "VideoPlayer.TVShowTitle", "Player.Filenameandpath"], "id": 1}',

						function (response) {
							var infoResult = response.result;

							shuffle = (infoResult['Playlist.Random']=="Random"? true: false);
							time = infoResult['Player.Time'];
							file = infoResult['Player.Filenameandpath'];

							var tmp = parseFloat(infoResult['Player.Volume']);
							volume = (isNaN(tmp)? 0: (tmp+60)/60*100); // -60 dB to 0 dB (--> 0% to 100%)

							curPlayData.duration = infoResult['Player.Duration'];
							curPlayData.file = infoResult['Player.Filenameandpath'];

							if (infoResult['MusicPlayer.Title'] != "") {
								activePlayer = 'audio';
								curPlayData.title = infoResult['MusicPlayer.Title'];
								curPlayData.album = infoResult['MusicPlayer.Album'];
								curPlayData.artist = infoResult['MusicPlayer.Artist'];

							} else if (infoResult['VideoPlayer.Title'] != "") {
								activePlayer = 'video';
								curPlayData.title = infoResult['VideoPlayer.Title'];
								curPlayData.showtitle = infoResult['VideoPlayer.TVShowTitle'];

							} else {
								activePlayer = 'none';
							}
						},

						function(response) {
							activePlayer = 'none'; // ERROR
						},

						null, false // not async
					);

					// has volume changed?
					if (volume != xbmc.periodicUpdater.lastVolume) {
						$.each(xbmc.periodicUpdater.volumeChangedListener, function(i, listener)  {
							listener(volume);
						});
					}

					if (activePlayer == 'none' &&
						this.playerStatus != 'stopped') {

						this.playerStatus = 'stopped';
						this.firePlayerStatusChanged('stopped');
					}

					// shuffle status changed?
					if (this.shuffleStatus != shuffle) {
						this.shuffleStatus = shuffle;
						this.firePlayerStatusChanged(shuffle? 'shuffleOn': 'shuffleOff');
					}

					// is playing
					if (activePlayer != 'none') {
						var request = '';

						if (activePlayer == 'audio') {
							request = '{"jsonrpc": "2.0", "method": "AudioPlaylist.GetItems", "params": { "fields": ["title", "album", "artist", "duration"] }, "id": 1}';

						} else if (activePlayer == 'video') {
							request = '{"jsonrpc": "2.0", "method": "VideoPlaylist.GetItems", "params": { "fields": ["title", "season", "episode", "duration", "showtitle"] }, "id": 1}';
						}

						xbmc.sendCommand(
							request,

							function (response) {
								var currentPlayer = response.result;
								var currentItem;

								// playlist may be cleared. Use data retrieved by GetInfoLabels
								if (!currentPlayer.items || !currentPlayer.items[currentPlayer.current]) {
									currentItem = curPlayData;

								} else {
									currentItem = currentPlayer.items[currentPlayer.current];
									$.extend(currentItem, curPlayData);
								}


								if (!currentPlayer.playing) {
									// not playing
									if (xbmc.periodicUpdater.playerStatus != 'stopped') {
										xbmc.periodicUpdater.playerStatus = 'stopped';
										xbmc.periodicUpdater.firePlayerStatusChanged('stopped');
									}

								} else if (currentPlayer.paused && xbmc.periodicUpdater.playerStatus != 'paused') {
									xbmc.periodicUpdater.playerStatus = 'paused';
									xbmc.periodicUpdater.firePlayerStatusChanged('paused');

								} else if (!currentPlayer.paused && xbmc.periodicUpdater.playerStatus != 'playing') {
									xbmc.periodicUpdater.playerStatus = 'playing';
									xbmc.periodicUpdater.firePlayerStatusChanged('playing');
								}

								// has current file changed?
								if (xbmc.periodicUpdater.currentlyPlayingFile != currentItem.file) {
									xbmc.periodicUpdater.currentlyPlayingFile = currentItem.file;
									$.extend(currentItem, {
										xbmcMediaType: activePlayer
									});
									xbmc.periodicUpdater.fireCurrentlyPlayingChanged(currentItem);
								}

								// current time
								if (xbmc.periodicUpdater.progress != time) {
									xbmc.periodicUpdater.fireProgressChanged({"time": time, total: currentItem.duration});
									xbmc.periodicUpdater.progress = time;
								}
							},

							null, null, false // not async
						);
					}

				}

				setTimeout($.proxy(this, "periodicStep"), 5000);
			}
		} // END xbmc.periodicUpdater
	}); // END xbmc

})(jQuery);
