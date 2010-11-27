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

/********************************
 * Requires:                    *
 * ---------------------------- *
 *  lib.xbmc.js                 *
 *  jquery.mkf.js               *
 *  jquery-ui-1.8.custom.min.js *
 ********************************/


(function($) {
	/* ########################### *\
	 |  XBMC-Controls
	\* ########################### */
	$.fn.defaultControls = function() {
		$controls = $('<a class="button play" href=""></a><a class="button stop" href=""></a><a class="button next" href=""></a><a class="button prev" href=""></a><a class="button shuffle" href=""></a>');
		$controls.filter('.play').click(function() {
			xbmc.control({type: 'play'}); return false;
		});
		$controls.filter('.stop').click(function() {
			xbmc.control({type: 'stop'}); return false;
		});
		$controls.filter('.next').click(function() {
			xbmc.control({type: 'next'}); return false;
		});
		$controls.filter('.prev').click(function() {
			xbmc.control({type: 'prev'}); return false;
		});

		var shuffle = function(event) {
			xbmc.control({type: (event.data.shuffle? 'shuffle': 'unshuffle')}); return false;
		};

		$controls.filter('.shuffle').bind('click', {"shuffle": true}, shuffle);

		xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
			var $shuffleBtn = $('.button.shuffle');
			if (status == 'shuffleOn') {
				$shuffleBtn.unbind('click');
				$shuffleBtn.bind('click', {"shuffle": false}, shuffle);
				$shuffleBtn.addClass('unshuffle');
				$shuffleBtn.attr('title', 'Unshuffle');

			} else if (status == 'shuffleOff') {
				$shuffleBtn.unbind('click');
				$shuffleBtn.bind('click', {"shuffle": true}, shuffle);
				$shuffleBtn.removeClass('unshuffle');
				$shuffleBtn.attr('title', 'Shuffle');
			}
		});

		this.each (function() {
			$(this).append($controls.clone(true));
		});
	}; // END defaultControls



	/* ########################### *\
	 |  System-Buttons
	\* ########################### */
	$.fn.defaultSystemButtons = function() {
		var $exitButton = $('<a href="" class="exit"></a>');
		$exitButton.click(function() {
			var dialogHandle = mkf.dialog.show(
				{
				content :
				'<h1 id="systemControlTitle" class="title">' + mkf.lang.get('title_system_control') + '</h1>' +
				'<div class="systemControls">' +
				'<a href="" class="exitXBMC" title="' + mkf.lang.get('btn_exit') + '"></a>' +
				'<a href="" class="shutdown" title="' + mkf.lang.get('btn_shutdown') + '"></a>' +
				'<a href="" class="suspend" title="' + mkf.lang.get('btn_suspend') + '"></a>' +
				'<a href="" class="reboot" title="' + mkf.lang.get('btn_reboot') + '"></a>' + 
				'</div>'
				}
			);
			mkf.dialog.addClass(dialogHandle, 'dialogSystemControl');

			var showQuitMessage = function () {
				$('body').empty();
				mkf.dialog.show({content:'<h1>' + mkf.lang.get('message_xbmc_has_quit') + '</h1>', closeButton: false});
			};

			var failed = function() {
				mkf.messageLog.show(mkf.lang.get('message_failed_send_command'), mkf.messageLog.status.error, 5000);
			};

			$('.exitXBMC').click(function() {
				xbmc.shutdown({type: 'quit', onSuccess: showQuitMessage, onError: failed}); return false;
			});
			$('.shutdown').click(function() {
				xbmc.shutdown({type: 'shutdown', onSuccess: showQuitMessage, onError: failed}); return false;
			});
			$('.suspend').click(function() {
				xbmc.shutdown({type: 'suspend', onSuccess: showQuitMessage, onError: failed}); return false;
			});
			$('.reboot').click(function() {
				xbmc.shutdown({type: 'reboot', onSuccess: showQuitMessage, onError: failed}); return false;
			});

			return false;
		});

		// -----------------

		var $settingsButton = $('<a href="" class="settings"></a>');
		$settingsButton.click(function() {
			var order = mkf.cookieSettings.get('albumOrder', 'artist');
			var lazyload = mkf.cookieSettings.get('lazyload', 'no');
			var timeout = mkf.cookieSettings.get('timeout', 10);
			var ui = mkf.cookieSettings.get('ui');
			var lang = mkf.cookieSettings.get('lang', 'en');

			var languages = '';
			$.each(mkf.lang.getLanguages(), function(key, val) {
				languages += '<option value="' + key + '"' + (lang==key? ' selected="selected"': '') + '>' + val.language + ' (by ' + val.author + ')</option>';
			});

			var dialogHandle = mkf.dialog.show(
				{
				content :
				'<h1 id="systemControlTitle" class="title">' + mkf.lang.get('title_settings') + '</h1>' +
				'<form name="settingsForm">' +
				'<fieldset class="ui_settings">' +
				'<legend>' + mkf.lang.get('group_ui') + '</legend>' +
				'<input type="radio" id="defaultUI" name="userinterface" value="default" ' + (ui!='light'? 'checked="checked"' : '') + '><label for="defaultUI">' + mkf.lang.get('label_default_ui') +'</label>' +
				'<input type="radio" id="lightUI" name="userinterface" value="light" ' + (ui=='light'? 'checked="checked"' : '') + '><label for="lightUI">Light UI</label>' +
				'</fieldset>' +
				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_language') + '</legend>' +
				'<select name="lang" size="1">' + languages + '</select>' +
				'</fieldset>' +
				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_albums') + '</legend>' +
				'<input type="radio" id="orderByAlbum" name="albumOrder" value="album" ' + (order=='album'? 'checked="checked"' : '') + '><label for="orderByAlbum">' + mkf.lang.get('label_order_by_title') +'</label>' +
				'<input type="radio" id="orderByArtist" name="albumOrder" value="artist" ' + (order=='artist'? 'checked="checked"' : '') + '><label for="orderByArtist">' + mkf.lang.get('label_order_by_artist') +'</label>' +
				'</fieldset>' +
				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_expert') + '</legend>' +
				'<a href="" class="formButton expertHelp" title="' + mkf.lang.get('btn_title_help') + '">' + mkf.lang.get('btn_text_help') + '</a>' + 
				'<input type="checkbox" id="lazyload" name="lazyload" ' + (lazyload=='yes'? 'checked="checked"' : '') + '><label for="lazyload">' + mkf.lang.get('label_use_lazyload') + '</label><br />' +
				'<label for="timeout">' + mkf.lang.get('label_timeout') + '</label><input type="text" id="timeout" name="timeout" value="' + timeout + '" maxlength="3" style="width: 30px; margin-top: 10px;"> ' + mkf.lang.get('label_seconds') +
				'</fieldset>' +
				'<a href="" class="formButton save">' + mkf.lang.get('btn_save') + '</a>' + 
				'<div class="formHint">' + mkf.lang.get('label_settings_hint') + '</div>' +
				'</form>'
				}
			);

			$('.expertHelp').click(function() {
				alert(mkf.lang.get('settings_help'));
				return false;
			});

			$('.save').click(function() {
				// Checks
				if (!document.settingsForm.albumOrder[0].checked &&
					!document.settingsForm.albumOrder[1].checked) {
					alert(mkf.lang.get('settings_select_album_order'));
					return false;
				}

				var timeout = parseInt(document.settingsForm.timeout.value);
				if (isNaN(timeout) || timeout < 5 || timeout > 120) {
					alert(mkf.lang.get('settings_enter_timeout_number'));
					return false;
				}

				if (document.settingsForm.lang.selectedIndex < 0) {
					alert(mkf.lang.get('settings_select_language'));
					return false;
				}

				// set new settings
				mkf.cookieSettings.add(
					'ui',
					document.settingsForm.userinterface[1].checked? 'light' : 'default'
				);

				mkf.cookieSettings.add(
					'albumOrder',
					document.settingsForm.albumOrder[0].checked? 'album' : 'artist'
				);

				mkf.cookieSettings.add(
					'lazyload',
					document.settingsForm.lazyload.checked? 'yes' : 'no'
				);

				mkf.cookieSettings.add(
					'lang',
					document.settingsForm.lang.options[document.settingsForm.lang.selectedIndex].value
				);

				mkf.cookieSettings.add('timeout', timeout);

				alert(mkf.lang.get('settings_need_to_reload_awx'));
				mkf.dialog.close(dialogHandle);

				return false;
			});

			return false;
		});	

		this.each (function() {
			$(this).append($settingsButton.clone(true));
			$(this).append($exitButton.clone(true));
		});
	}; // END defaultSystemButtons



	/* ########################### *\
	 |  Volume Control
	\* ########################### */
	$.fn.defaultVolumeControl = function(options) {
		this.each (function() {
			var $sliderElement = $(this);

			// Slider
			$sliderElement.slider({
				range: 'min',
				value: 0,
				orientation: (options && options.horizontal? 'horizontal': 'vertical'),
				stop: function(event, ui) {
					xbmc.setVolume({
						volume: ui.value,
						onError: function (response) {
							mkf.messageLog.show(mkf.lang.get('message_failed_set_volume'),
											mkf.messageLog.status.error, 5000);
						}
					});
				}
			});

			xbmc.periodicUpdater.addVolumeChangedListener(function(vol) {
				$sliderElement.slider("option", "value", vol);
			});
		});
	}; // END defaultVolumeControl



	/* ########################### *\
	 |  Show artists.
	 |
	 |  @param artistResult		Result of AudioLibrary.GetArtists.
	 |  @param parentPage		Page which is used as parent for new sub pages.
	\* ########################### */
	$.fn.defaultArtistsViewer = function(artistResult, parentPage) {
		var onArtistClick = function(e) {
			// open new page to show artist's albums
			var $artistContent = $('<div class="pageContentWrapper"></div>');
			var artistPage = mkf.pages.createTempPage(parentPage, {
				title: e.data.strArtist,
				content: $artistContent
			});
			artistPage.setContextMenu(
				[
					{
						'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_album_list'), 'shortcut':'Ctrl+1', 'onClick':
						function() {
							mkf.pages.closeTempPage(artistPage);
							return false;
						}
					}
				]
			);
			mkf.pages.showTempPage(artistPage);

			// show artist's albums
			$artistContent.addClass('loading');
			xbmc.getArtistsAlbums({
				artistid: e.data.idArtist,

				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed_artists_albums'), mkf.messageLog.status.error, 5000);
					$artistContent.removeClass('loading');
				},

				onSuccess: function(result) {
					$artistContent.defaultAlbumViewer(result, artistPage);
					$artistContent.removeClass('loading');
				}
			});

			return false;
		} // END onArtistClick


		// no artists?
		if (!artistResult || !artistResult.artists) {
			return;
		}

		this.each (function() {
			var artistList = $('<ul class="fileList"></ul>').appendTo($(this));

			if (artistResult.total > 0) {
				$.each(artistResult.artists, function(i, artist)  {
					artistList.append('<li' + (i%2==0? ' class="even"': '') + '><a href="" class="artist' +
										artist.artistid + '">' +
										(i+1) + '. ' + artist.label +
										'</a></li>');
					artistList.find('.artist' + artist.artistid)
						.bind('click',
							{
								idArtist: artist.artistid,
								strArtist: artist.label
							},
							onArtistClick);
				});
			}
		});
	}; // END defaultArtistsViewer



	/* ########################### *\
	 |  Show the albums.
	 |
	 |  @param albumResult		Result of AudioLibrary.GetAlbums.
	 |  @param parentPage		Page which is used as parent for new sub pages.
	\* ########################### */
	$.fn.defaultAlbumViewer = function(albumResult, parentPage) {
		var onAlbumPlayClick = function(event) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_album'));
			xbmc.playAlbum({
				albumid: event.data.idAlbum,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});
			return false;
		};

		var onAddAlbumToPlaylistClick = function(event) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_album_to_playlist'));
			xbmc.addAlbumToPlaylist({
				albumid: event.data.idAlbum,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});
			return false;
		};

		var onSonglistClick = function(e) {
			// open new page to show album's songs
			var $songlistContent = $('<div class="pageContentWrapper"></div>');
			var songlistPage = mkf.pages.createTempPage(parentPage, {
				title: e.data.strAlbum,
				content: $songlistContent
			});
			songlistPage.setContextMenu(
				[
					{
						'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_song_list'), 'shortcut':'Ctrl+1', 'onClick':
						function() {
							mkf.pages.closeTempPage(songlistPage);
							return false;
						}
					}
				]
			);
			mkf.pages.showTempPage(songlistPage);

			// show album's songs
			$songlistContent.addClass('loading');
			xbmc.getAlbumsSongs({
				albumid: e.data.idAlbum,

				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed_albums_songs'), mkf.messageLog.status.error, 5000);
					$songlistContent.removeClass('loading');
				},

				onSuccess: function(result) {
					$songlistContent.defaultSonglistViewer(result);
					$songlistContent.removeClass('loading');
				}
			});

			return false;
		} // END onSonglistClick


		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;


		this.each (function() {
			var $albumViewerElement = $(this);

			if (albumResult.total > 0) {
				var albums = albumResult.albums;

				$.each(albums, function(i, album) {
					var thumb = (album.thumbnail? xbmc.getThumbUrl(album.thumbnail) : 'images/thumb.png');
					var $album = $('<div class="album'+album.albumid+' thumbWrapper">' +
							'<div class="linkWrapper">' + 
								'<a href="" class="play">' + mkf.lang.get('btn_play') + '</a><a href="" class="songs">' + mkf.lang.get('btn_songs') + '</a><a href="" class="playlist">' + mkf.lang.get('btn_enqueue') + '</a>' +
							'</div>' +
							(useLazyLoad?
								'<img src="images/loading_thumb.gif" alt="' + album.label + '" class="thumb" original="' + thumb + '" />':
								'<img src="' + thumb + '" alt="' + album.label + '" class="thumb" />'
							) +
							'<div class="albumName">' + album.label + '</div>' +
							'<div class="albumArtist">' + album.album_artist + '</div>' +
							'<div class="findKeywords">' + album.label.toLowerCase() + ' ' + album.album_artist.toLowerCase() + '</div>' +
						'</div>');

					$albumViewerElement.append($album);
					$album.find('.play').bind('click', {idAlbum: album.albumid, strAlbum: album.label}, onAlbumPlayClick);
					$album.find('.songs').bind('click', {idAlbum: album.albumid, strAlbum: album.label }, onSonglistClick);
					$album.find('.playlist').bind('click', {idAlbum: album.albumid}, onAddAlbumToPlaylistClick);
				});

				if (useLazyLoad) {
					function loadThumbs(i) {
						$albumViewerElement.find('img.thumb').lazyload(
							{
								queuedLoad: true,
								container: ($('#main').length? $('#main'): $('#content')),	// TODO remove fixed #main
								errorImage: 'images/thumb.png'
							}
						);
					};
					setTimeout(loadThumbs, 100);
				}
			}

		});
	}; // END defaultAlbumViewer



	/* ########################### *\
	 |  Show the songlist.
	 |
	 |  @param songResult		Result of AudioLibrary.GetSongs.
	\* ########################### */
	$.fn.defaultSonglistViewer = function(songResult) {
		var onSongPlayClick = function(event) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_song'));
			xbmc.playSong({
				songid: event.data.idSong,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});
			return false;
		};

		var onAddSongToPlaylistClick = function(event) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_song_to_playlist'));
			xbmc.addSongToPlaylist({
				songid: event.data.idSong,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 8000, mkf.messageLog.status.error);
				}
			});
			return false;
		};


		this.each(function() {
			var $songList = $('<ul class="fileList"></ul>').appendTo($(this));

			if (songResult.total > 0) {
				$.each(songResult.songs, function(i, song)  {
					var $song = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper song' + song.songid + '"> <a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a> <a href="" class="song play">' + song.tracknumber + '. ' + song.artist + ' - ' + song.label + '</a></div></li>').appendTo($songList);
					$song.find('.playlist').bind('click', {idSong: song.songid}, onAddSongToPlaylistClick);
					$song.find('.play').bind('click', {idSong: song.songid}, onSongPlayClick);
				});
			}

		});
	}; // END defaultSonglistViewer



	/* ########################### *\
	 |  Show playlist (Audio or Video).
	 |
	 |  @param playlistResult	Result of XyzPlaylist.GetItems.
	 |  @param plst				Playlist-Type. Either 'Audio' (default) or 'Video'.
	\* ########################### */
	$.fn.defaultPlaylistViewer = function(playlistResult, plst) {
		var playlist = 'Audio';
		if (plst === 'Video') {
			playlist = 'Video';
		}

		var onItemRemoveClick = function(event) {
			alert(mkf.lang.get('message_currently_not_supported'));
			// TODO implement for new JSON-API
			return false;
		};

		var onItemPlayClick = function(event) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_item'));
			var fn;

			if (playlist == 'Audio') {
				fn = xbmc.playAudio;
			} else {
				fn = xbmc.playVideo;
			}

			fn({
				item: event.data.itemNum,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});

			return false;
		};


		this.each(function() {
			var $itemList = $('<ul class="fileList"></ul>').appendTo($(this));

			if (playlistResult.total > 0) {
				$.each(playlistResult.items, function(i, item)  {
					var artist = (item.artist? item.artist : mkf.lang.get('label_not_available'));
					var title = (item.title? item.title : mkf.lang.get('label_not_available'));
					var label = (item.label? item.label : mkf.lang.get('label_not_available'));

					$item = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper playlistItem' + i + '">' + 
						'<a class="button remove" href="" title="' + mkf.lang.get('btn_remove') +  '"><span class="miniIcon remove" /></a>' +
						'<a class="playlistItem play" href="">' + (i+1) + '. ' +
						(playlist=='Audio'? artist + ' - ' + title : label) +
						'</a></div></li>').appendTo($itemList);

					$item.find('a.play').bind('click', {itemNum: i}, onItemPlayClick);
					$item.find('a.remove').bind('click', {itemNum: i}, onItemRemoveClick);
				});
			}

		});
	}; // END defaultPlaylistViewer



	/* ########################### *\
	 |  Show movies.
	 |
	 |  @param movieResult	Result of VideoLibrary.GetMovies.
	\* ########################### */
	$.fn.defaultMovieViewer = function(movieResult) {
		var onMoviePlayClick = function(event) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_movie'));

			xbmc.playMovie({
				movieid: event.data.idMovie,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});

			return false;
		};

		var onAddMovieToPlaylistClick = function(event) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_movie_to_playlist'));

			xbmc.addMovieToPlaylist({
				movieid: event.data.idMovie,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 8000, mkf.messageLog.status.error);
				}
			});

			return false;
		};

		var onMovieInformationClick = function(event) {
			var dialogHandle = mkf.dialog.show();

			/*xbmc.getMovieInfo({
				movieid: event.data.idMovie,
				onSuccess: function(movie) {
				},
				onError: function() {
					mkf.messageLog.show('Failed to load movie information!', mkf.messageLog.status.error, 5000);
					mkf.dialog.close(dialogHandle);
				}
			});*/

			var movie = event.data.movie;
			var dialogContent = '';
			var thumb = (movie.thumbnail? xbmc.getThumbUrl(movie.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
			dialogContent += '<img src="' + thumb + '" class="thumb thumb' + xbmc.getMovieThumbType() + ' dialogThumb" />' +
				'<h1 class="underline">' + movie.title + '</h1>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_original_title') + '</span><span class="value">' + movie.originaltitle + '</span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_runtime') + '</span><span class="value">' + movie.runtime + '</span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_genre') + '</span><span class="value">' + movie.genre + '</span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="value"><div class="smallRating' + Math.round(movie.rating) + '"></div></span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_year') + '</span><span class="value">' + movie.year + '</span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_director') + '</span><span class="value">' + movie.director + '</span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="value">' + movie.file + '</span></div>' +
				'<p class="plot">' + movie.plot + '</p>';
			mkf.dialog.setContent(dialogHandle, dialogContent);

			return false;
		};


		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;


		this.each(function() {
			var $movieContainer = $(this);

			if (movieResult.total > 0) {
				$.each(movieResult.movies, function(i, movie) {

					// if movie has no id (e.g. movie sets), ignore it
					if (typeof movie.movieid === 'undefined') {
						return;
					}

					var thumb = (movie.thumbnail? xbmc.getThumbUrl(movie.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
					var $movie = $(
						'<div class="movie'+movie.movieid+' thumbWrapper thumb' + xbmc.getMovieThumbType() + 'Wrapper">' +
							'<div class="linkWrapper">' + 
								'<a href="" class="play">' + mkf.lang.get('btn_play') + '</a><a href="" class="playlist">' + mkf.lang.get('btn_enqueue') + '</a><a href="" class="info">' + mkf.lang.get('btn_information') + '</a>' +
								'<div class="movieRating' + Math.round(movie.rating) + '"></div>' +
							'</div>' +
							(useLazyLoad?
								'<img src="images/loading_thumb' + xbmc.getMovieThumbType() + '.gif" alt="' + movie.label + '" class="thumb thumb' + xbmc.getMovieThumbType() + '" original="' + thumb + '" />':
								'<img src="' + thumb + '" alt="' + movie.label + '" class="thumb thumb' + xbmc.getMovieThumbType() + '" />'
							) +
							'<div class="movieName">' + movie.label + '</div>' +
							'<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
						'</div>').appendTo($movieContainer);
					$movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, onMoviePlayClick);
					$movie.find('.playlist').bind('click', {idMovie: movie.movieid}, onAddMovieToPlaylistClick);
					$movie.find('.info').bind('click', {'movie': movie}, onMovieInformationClick);
				});

				if (useLazyLoad) {
					function loadThumbs(i) {
						$movieContainer.find('img.thumb').lazyload(
							{
								queuedLoad: true,
								container: ($('#main').length? $('#main'): $('#content')),	// TODO remove fixed #main
								errorImage: 'images/thumb' + xbmc.getMovieThumbType() + '.png'
							}
						);
					};
					setTimeout(loadThumbs, 100);
				}
			}

		});
	}; // END defaultMovieViewer



	/* ########################### *\
	 |  Show TV Shows.
	 |
	 |  @param tvShowResult		Result of VideoLibrary.GetTVShows.
	\* ########################### */
	$.fn.defaultTvShowViewer = function(tvShowResult, parentPage) {
		var onSeasonsClick = function(e) {
			// open new page to show tv show's seasons
			var $seasonsContent = $('<div class="pageContentWrapper"></div>');
			var seasonsPage = mkf.pages.createTempPage(parentPage, {
				title: e.data.strTvShow,
				content: $seasonsContent
			});
			seasonsPage.setContextMenu(
				[
					{
						'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_season_list'), 'shortcut':'Ctrl+1', 'onClick':
						function() {
							mkf.pages.closeTempPage(seasonsPage);
							return false;
						}
					}
				]
			);
			mkf.pages.showTempPage(seasonsPage);

			// show tv show's seasons
			$seasonsContent.addClass('loading');
			xbmc.getSeasons({
				tvshowid: e.data.idTvShow,

				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed_tvshows_seasons'), mkf.messageLog.status.error, 5000);
					$seasonsContent.removeClass('loading');
				},

				onSuccess: function(result) {
					$seasonsContent.defaultSeasonsViewer(result, e.data.idTvShow, seasonsPage);
					$seasonsContent.removeClass('loading');
				}
			});

			return false;
		}; // END onSeasonsClick

		var onTVShowInformationClick = function(event) {
			var dialogHandle = mkf.dialog.show();

			var NA = mkf.lang.get('label_not_available');
			var tvshow = {
				title: NA,
				originaltitle: NA,
				runtime: NA,
				genre: NA,
				rating: 0,
				year: NA,
				director: NA,
				file: NA,
				plot: NA,
			};
			$.extend(tvshow, event.data.tvshow);
			var dialogContent = '';
			var thumb = (tvshow.thumbnail? xbmc.getThumbUrl(tvshow.thumbnail) : 'images/thumb' + xbmc.getTvShowThumbType() + '.png');
			var valueClass = 'value' + xbmc.getTvShowThumbType();
			dialogContent += '<img src="' + thumb + '" class="thumb thumb' + xbmc.getTvShowThumbType() + ' dialogThumb' + xbmc.getTvShowThumbType() + '" />' +
				'<h1 class="underline">' + tvshow.title + '</h1>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_original_title') + '</span><span class="'+valueClass+'">' + tvshow.originaltitle + '</span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_runtime') + '</span><span class="'+valueClass+'">' + tvshow.runtime + '</span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_genre') + '</span><span class="'+valueClass+'">' + tvshow.genre + '</span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="'+valueClass+'"><div class="smallRating' + Math.round(tvshow.rating) + '"></div></span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_year') + '</span><span class="'+valueClass+'">' + tvshow.year + '</span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_director') + '</span><span class="'+valueClass+'">' + tvshow.director + '</span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="'+valueClass+'">' + tvshow.file + '</span></div>' +
				'<p class="plot">' + tvshow.plot + '</p>';
			mkf.dialog.setContent(dialogHandle, dialogContent);

			return false;
		}; // END onTVShowInformationClick

		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;


		this.each(function() {
			var $tvshowContainer = $(this);

			if (tvShowResult.total > 0) {
				$.each(tvShowResult.tvshows, function(i, tvshow) {
					var thumb = (tvshow.thumbnail? xbmc.getThumbUrl(tvshow.thumbnail) : 'images/thumb' + xbmc.getTvShowThumbType() + '.png');
					var $tvshow = $('<div class="tvshow'+tvshow.tvshowid+' thumbWrapper thumb' + xbmc.getTvShowThumbType() + 'Wrapper">' +
							'<div class="linkWrapper">' + 
								'<a href="" class="season">' + mkf.lang.get('btn_seasons') + '</a>' +
								'<a href="" class="info">' + mkf.lang.get('btn_information') + '</a>' +
							'</div>' +
							(useLazyLoad?
								'<img src="images/loading_thumb' + xbmc.getTvShowThumbType() + '.gif" alt="' + tvshow.label + '" class="thumb thumb' + xbmc.getTvShowThumbType() + '" original="' + thumb + '" />':
								'<img src="' + thumb + '" alt="' + tvshow.label + '" class="thumb thumb' + xbmc.getTvShowThumbType() + '" />'
							) +
							'<div class="tvshowName">' + tvshow.label + '</div>' +
							'<div class="findKeywords">' + tvshow.label.toLowerCase() + '</div>' +
						'</div>')
						.appendTo($tvshowContainer);
					$tvshow.find('.season').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label}, onSeasonsClick);
					$tvshow.find('.info').bind('click', {'tvshow': tvshow}, onTVShowInformationClick);
				});

				if (useLazyLoad) {
					function loadThumbs(i) {
						$tvshowContainer.find('img.thumb').lazyload(
							{
								queuedLoad: true,
								container: ($('#main').length? $('#main'): $('#content')),	// TODO remove fixed #main
								errorImage: 'images/thumb' + xbmc.getTvShowThumbType() + '.png'
							}
						);
					};
					setTimeout(loadThumbs, 100);
				}
			}
		});
	}; // END defaultTvShowViewer



	/* ########################### *\
	 |  Show TV Show's seasons.
	 |
	 |  @param seasonsResult
	\* ########################### */
	$.fn.defaultSeasonsViewer = function(seasonsResult, idTvShow, parentPage) {
		var onSeasonClick = function(e) {
			// open new page to show season's episodes
			var $episodesContent = $('<div class="pageContentWrapper"></div>');
			var episodesPage = mkf.pages.createTempPage(parentPage, {
				title: e.data.strSeason,
				content: $episodesContent
			});
			episodesPage.setContextMenu(
				[
					{
						'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_episode_list'), 'shortcut':'Ctrl+1', 'onClick':
						function() {
							mkf.pages.closeTempPage(episodesPage);
							return false;
						}
					}
				]
			);
			mkf.pages.showTempPage(episodesPage);

			// show season's episodes
			$episodesContent.addClass('loading');
			xbmc.getEpisodes({
				tvshowid: e.data.idTvShow,
				season: e.data.seasonNum,

				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed_seasons_episodes'), mkf.messageLog.status.error, 5000);
					$episodesContent.removeClass('loading');
				},

				onSuccess: function(result) {
					$episodesContent.defaultEpisodesViewer(result);
					$episodesContent.removeClass('loading');
				}
			});

			return false;
		}; // END onSeasonClick


		this.each(function() {
			var $seasonsList = $('<ul class="fileList"></ul>').appendTo($(this));

			if (seasonsResult.total > 0) {
				$.each(seasonsResult.seasons, function(i, season)  {
					var $season = $('<li' + (i%2==0? ' class="even"': '') + '><div class="linkWrapper"> <a href="" class="season' + i + '">' + season.label + '</a> </div></li>')
						.appendTo($seasonsList);
					$season.find('a').bind(
						'click',
						{
							idTvShow: idTvShow,
							seasonNum: season.season,
							strSeason: season.label
						},
						onSeasonClick
					);
				});
			}
		});
	}; // END defaultSeasonsViewer



	/* ########################### *\
	 |  Show Seasons's episodes.
	 |
	 |  @param episodesResult
	\* ########################### */
	$.fn.defaultEpisodesViewer = function(episodesResult) {
		var onEpisodePlayClick = function(event) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_episode'));

			xbmc.playEpisode({
				episodeid: event.data.idEpisode,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});

			return false;
		};

		var onAddEpisodeToPlaylistClick = function(event) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_episode_to_playlist'));

			xbmc.addEpisodeToPlaylist({
				episodeid: event.data.idEpisode,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 8000, mkf.messageLog.status.error);
				}
			});

			return false;
		};


		this.each(function() {
			var $episodeList = $('<ul class="fileList"></ul>').appendTo($(this));

			if (episodesResult.total > 0) {	
				$.each(episodesResult.episodes, function(i, episode)  {
					var $episode = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper episode' + episode.episodeid + '"> <a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a> <a href="" class="episode play">' + episode.episode + '. ' + episode.label + '</a></div></li>').appendTo($episodeList);

					$episode.find('.play').bind('click', {idEpisode: episode.episodeid}, onEpisodePlayClick);
					$episode.find('.playlist').bind('click', {idEpisode: episode.episodeid}, onAddEpisodeToPlaylistClick);
				});
			}
		});
	}; // END defaultEpisodesViewer



	/* ########################### *\
	 |  Show filesystem.
	 |
	 |  @param mediaType	Media-Type to show. (Either 'Audio' or 'Video')
	\* ########################### */
	$.fn.defaultFilesystemViewer = function(mediaType, parentPage, folder) {
		var media = 'Audio';
		if (mediaType === 'Video') {
			media = 'Video';
		}

		var onFilePlayClick = function(event) {
			var isFolder = false;

			if (event.data.isFolder)
				isFolder = true;

			if (isFolder) {
				var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_folder'));

				var fn = 'playVideoFolder';
				if (media == 'Audio') {
					fn = 'playAudioFolder';
				}

				$.proxy(xbmc, fn)({
					folder: event.data.file,
					onSuccess: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					},
					onError: function(errorText) {
						mkf.messageLog.appendTextAndHide(messageHandle, errorText, 5000, mkf.messageLog.status.error);
					}
				});

			} else {
				var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_file'));

				var fn = 'playVideoFile';
				if (media == 'Audio') {
					fn = 'playAudioFile';
				}

				$.proxy(xbmc, fn)({
					file: event.data.file,
					onSuccess: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					},
					onError: function(errorText) {
						mkf.messageLog.appendTextAndHide(messageHandle, errorText, 5000, mkf.messageLog.status.error);
					}
				});
			}
			return false;
		};

		var onAddFileToPlaylistClick = function(event) {
			var isFolder = false;

			if (event.data.isFolder)
				isFolder = true;

			if (isFolder) {
				var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_folder_to_playlist'));

				var fn = xbmc.addVideoFolderToPlaylist;
				if (media == 'Audio') {
					fn = xbmc.addAudioFolderToPlaylist;
				}

				fn({
					folder: event.data.file,
					onSuccess: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					},
					onError: function(errorText) {
						mkf.messageLog.appendTextAndHide(messageHandle, errorText, 5000, mkf.messageLog.status.error);
					}
				});

			} else {

				var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_file_to_playlist'));

				var fn = xbmc.addVideoFileToPlaylist;
				if (media == 'Audio') {
					fn = xbmc.addAudioFileToPlaylist;
				}

				fn({
					file: event.data.file,
					onSuccess: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					},
					onError: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 5000, mkf.messageLog.status.error);
					}
				});
			}
			return false;
		};

		// -------------------


		var onFolderClick = function(e) {
			// open new page to show the subfolder
			var $folderContent = $('<div class="pageContentWrapper"></div>');
			var folderPage = mkf.pages.createTempPage(parentPage, {
				title: e.data.folder.name,
				content: $folderContent
			});
			folderPage.setContextMenu(parentPage.getContextMenu());
			mkf.pages.showTempPage(folderPage);

			// show the subfolder
			$folderContent.defaultFilesystemViewer(mediaType, folderPage, e.data.folder.path);

			return false;
		};


		this.each(function() {
			var $fileContainer = $(this);
			var $filelist = $('<ul class="fileList"></ul>').appendTo($fileContainer);

			$fileContainer.addClass('loading');

			/*****************
			 * If the root should be displayed:
			 *		Show the /media-folder if it exist and all Shares.
			 * If folder-content should be shown:
			 *		Show all sub-folders and audio/video-files.
			 *****************/
			var globalI = 0;
			if (folder) {
				// NO ROOT: Show folder content
				// show containing folders + music/video-files
				xbmc.getDirectory({
					'media': media,
					directory: folder,

					onSuccess: function(result) {
						var folders = result.directories;
						var files = result.files;

						if (folders) {
							$.each(folders, function(i, folder)  {
								if (!folder.file.startsWith('addons://')) {
									var $folder = $('<li' + (globalI%2==0? ' class="even"': '') + '>' + 
										'<div class="folderLinkWrapper folder' + i + '">' + 
										'<a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' + 
										'<a href="" class="button play" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' + 
										'<a href="" class="folder cd">' + folder.label + '/</a>' + 
										'</div></li>').appendTo($filelist);
									$folder.find('.cd').bind('click', {folder: {name:folder.label, path:folder.file}}, onFolderClick);
									$folder.find('.play').bind('click', {file: folder.file, isFolder: true}, onFilePlayClick);
									$folder.find('.playlist').bind('click', {file: folder.file, isFolder: true}, onAddFileToPlaylistClick);
									++globalI;
								}
							});
						}

						if (files) {
							$.each(files, function(i, file)  {
								if (!file.file.startsWith('addons://')) {
									var $file = $('<li' + (globalI%2==0? ' class="even"': '') + '><div class="folderLinkWrapper file' + i + '"> <a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a> <a href="" class="file play">' + file.label + '</a></div></li>').appendTo($filelist);
									$file.find('.play').bind('click', {file: file.file}, onFilePlayClick);
									$file.find('.playlist').bind('click', {file: file.file}, onAddFileToPlaylistClick);
									++globalI;
								}
							});
						}
					},

					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed_directory'), mkf.messageLog.status.error, 5000);
					},

					async: false
				});

			} else {
				// ROOT:
				// Get Shares
				xbmc.getSources({
					'media': media,
					onSuccess: function(result) {
						if (!result.shares) {
							return;
						}
						$.each(result.shares, function(i, share)  {
							if (!share.file.startsWith('addons://')) {
								var $file = $('<li' + (globalI%2==0? ' class="even"': '') + '><a href="" class="file' + i + '"> [SRC] ' + share.label + '</a></li>').appendTo($filelist);
								$file.find('a').bind('click', {folder: {name: '[SRC] ' + share.label, path: share.file}}, onFolderClick);
								++globalI;
							}
						});
					},
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed_sources'), mkf.messageLog.status.error, 5000);
					},
					async: false
				});


				// TODO support Windows/OSX-Folders
				// /media - Folder may exist (access to usb-sticks etc.)
				xbmc.getDirectory({
					directory: '/media',

					onSuccess: function(result) {
						var $file = $('<li' + (globalI%2==0? ' class="even"': '') + '><a href="" class="fileMedia"> /media</a></li>').appendTo($filelist);
						$file.bind('click', {folder: {name:'media', path:'/media'}}, onFolderClick);
					},

					async: false
				});
			}

			$fileContainer.removeClass('loading');
		});
	}; // END defaultFilesystemViewer



	/* ########################### *\
	 |  "Currently Playing"-Box
	\* ########################### */
	$.fn.defaultCurrentlyPlaying = function(options) {
		var settings = {
			effect: 'slide'
		};
		$.extend(settings, options);

		this.each (function() {
			var $currentlyPlayingBox = $(this);
			$currentlyPlayingBox.hide();

			var content = '<div class="currentlyPlayingThumbWrapper"><img src="images/thumb.png" width="100" alt="Currently Playing" class="currentThumb" /></div>';
			content += '<div class="currentlyPlayingInfo">';
			content += '<span class="currentlyPlaying">' + mkf.lang.get('label_currently_playing') + '</span>';
			content += '<span class="musicData"><span class="artist">Artist</span> - <span class="album">Album</span></span>';
			content += '<span class="tvshowData"><span class="tvshow">TV Show</span> - Season <span class="season">n/a</span> - Episode <span class="episode">n/a</span></span>';
			content += '<span class="title">Title</span>';
			content += '<div class="playingSliderWrapper">';
			content += '<div class="playingSlider"></div>';
			content += '</div>';
			content += '<span class="time"></span>';
			content += '<span class="duration"></span>';
			content += '</div>';
			$currentlyPlayingBox.html(content);

			var thumbElement = $currentlyPlayingBox.find('.currentThumb');
			var titleElement = $currentlyPlayingBox.find('.title');
			var sliderElement = $currentlyPlayingBox.find('.playingSlider');
			var timeElement = $currentlyPlayingBox.find('.time');
			var durationElement = $currentlyPlayingBox.find('.duration');

			var musicDataElement = $currentlyPlayingBox.find('.musicData');
			var artistElement = $currentlyPlayingBox.find('.artist');
			var albumElement = $currentlyPlayingBox.find('.album');

			var tvshowDataElement = $currentlyPlayingBox.find('.tvshowData');
			var tvshowElement = $currentlyPlayingBox.find('.tvshow');
			var seasonElement = $currentlyPlayingBox.find('.season');
			var episodeElement = $currentlyPlayingBox.find('.episode');

			sliderElement.slider({
				range: 'min',
				value: 0,
				stop: function(event, ui) {
					xbmc.seekPercentage({percentage: ui.value});
				}
			});

			function onBoxVisibilityChanged() {
				$(window).trigger('resize'); // autom. resize #main
			};
			// Helper-functions
			function showBox(box) {
				if (box.is(":hidden") && !box.is(":animated")) {
					if (settings.effect == 'fade')
						box.fadeIn('fast', onBoxVisibilityChanged);
					else
						box.show('slide', {direction: 'down'}, 'fast', onBoxVisibilityChanged);
				}
			};

			function hideBox(box) {
				if (box.is(":visible") && !box.is(":animated")) {
					if (settings.effect == 'fade')
						box.fadeOut('fast', onBoxVisibilityChanged);
					else
						box.hide('slide', {direction: 'down'}, 'fast', onBoxVisibilityChanged);
				}
			};


			xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
				if (status == 'stopped') {
					hideBox($currentlyPlayingBox);

				} else if (status == 'playing') {
					showBox($currentlyPlayingBox);
					$currentlyPlayingBox.find('.statusPaused').remove();

				} else if (status == 'paused') {
					showBox($currentlyPlayingBox);
					$currentlyPlayingBox.append('<span title="' + mkf.lang.get('label_paused') + '" class="statusPaused"></span>');

				} else if (status == 'shuffleOn') {
					$currentlyPlayingBox.append('<span title="' + mkf.lang.get('label_shuffle') + '" class="statusShuffle"></span>');

				} else if (status == 'shuffleOff') {
					$currentlyPlayingBox.find('.statusShuffle').remove();
				}
			});


			xbmc.periodicUpdater.addCurrentlyPlayingChangedListener(function(currentFile) {
				// ALL: AUDIO, VIDEO, PICTURE
				if (currentFile.title) { titleElement.text(currentFile.title); } else { titleElement.text( mkf.lang.get('label_not_available') ); }

				if (currentFile.xbmcMediaType == 'audio') {
					// AUDIO
					musicDataElement.show();
					tvshowDataElement.hide();
					if (currentFile.artist) { artistElement.text(currentFile.artist); } else { artistElement.text(mkf.lang.get('label_not_available')); }
					if (currentFile.album) { albumElement.text(currentFile.album); } else { albumElement.text(mkf.lang.get('label_not_available')); }

				} else {
					// VIDEO
					musicDataElement.hide();

					if (currentFile.season &&
						currentFile.episode &&
						currentFile.showtitle) {

						tvshowElement.text(currentFile.showtitle);
						seasonElement.text(currentFile.season);
						episodeElement.text(currentFile.episode);
						tvshowDataElement.show();

					} else {
						tvshowDataElement.hide();
					}
				}

				thumbElement.attr('src', 'images/thumb.png');
				if (currentFile.thumbnail) {
					thumbElement.attr('src', xbmc.getThumbUrl(currentFile.thumbnail));
				}
			});


			xbmc.periodicUpdater.addProgressChangedListener(function(progress) {
				timeElement.text(progress.time);
				durationElement.text(progress.total);
				sliderElement.slider("option", "value", 100 * xbmc.getSeconds(progress.time) / xbmc.getSeconds(progress.total));
			});
		});
	}; // END defaultCurrentlyPlaying



	/* ########################### *\
	 |  FindBox
	\* ########################### */
	$.fn.defaultFindBox = function(options) {
		var settings = {
			id: 'defaultFindBox',
			searchItems: '.findable',
			top: 0,
			left: 0/*,
			delay: 500*/
		};

		if(options) {
			$.extend(settings, options);
		}

		var self = this;
		//var timeout;
		var $searchItems = $(self).find(settings.searchItems);
		var $box = $('#' + settings.id);

		var fixPosition = function($e, left) {
			if ($e.width() + $e.position().left > $(window).width()) {
				$e.css({'left': left-$e.width()});
			}
		};

		if ($box.length) {
			// Box was already created
			$box.show();
			fixPosition($box, settings.left);
			$box.find('input').focus();

		} else {
			// Box not yet created
			var $div = $('<div id="' + settings.id + '" class="findBox"><input type="text" /></div>')
				.appendTo($('body'))
				.css({'left': settings.left, 'top': settings.top});

			fixPosition($div, settings.left);
			var input = $div.find('input');

			function onInputContentChanged() {
				$(self).find('.findBoxTitle').remove();
				if (input.val()) {
					$(self).prepend('<h1 class="findBoxTitle">' + mkf.lang.get('label_search_results', [input.val()]) + '</h1>');
				}
				$searchItems.show();
				$searchItems.not(":contains('" + input.val().toLowerCase() + "')").hide();
				$(window).trigger('resize'); // ugly but best performance: trigger 'resize' because lazy-load-images may be visible now and should be loaded.
			};

			input
				.blur(function() {
					$(this).parent().hide();
				})
				.keydown(function(event) {
					if (event.keyCode == 0x0D) {
						onInputContentChanged();
					}
					if (event.keyCode == 0x1B || event.keyCode == 0x0D) {
						$(this).parent().hide();
					}
				})
				/*.keyup(function() {
					if (timeout) {
						clearTimeout(timeout);
					}
					timeout = setTimeout(onInputContentChanged, settings.delay);
				})*/
				.focus(function() {
					this.select();
				})
				.focus();
		}

		return false;
	}; // END defaultFindBox
})(jQuery);
