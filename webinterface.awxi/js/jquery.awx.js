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
	 |  Input-Controls
	\* ########################### */
	$.fn.inputControls = function() {
		$controls = $('<a class="button up" href=""></a><a class="button down" href=""></a><a class="button left" href=""></a><a class="button right" href=""></a><a class="button select" href=""></a><a class="button home" href=""></a><a class="button back" href=""></a>');
		
		$controls.filter('.up').click(function() {
			xbmc.input({type: 'Up'}); return false;
		});
		
		$controls.filter('.down').click(function() {
			xbmc.input({type: 'Down'}); return false;
		});
		
		$controls.filter('.left').click(function() {
			xbmc.input({type: 'Left'}); return false;
		});
		
		$controls.filter('.right').click(function() {
			xbmc.input({type: 'Right'}); return false;
		});
		
		$controls.filter('.select').click(function() {
			xbmc.input({type: 'Select'}); return false;
		});
		
		$controls.filter('.home').click(function() {
			xbmc.input({type: 'Home'}); return false;
		});
		
		$controls.filter('.back').click(function() {
			xbmc.input({type: 'Back'}); return false;
		});

		this.each (function() {
			$(this).append($controls.clone(true));
		});
	}; // END inputControls
	
	/* ########################### *\
	 |  XBMC-Controls
	\* ########################### */
	$.fn.defaultControls = function() {
		$controls = $('<a class="button play" href=""></a><a class="button stop" href=""></a><a class="button next" href=""></a><a class="button prev" href=""></a><a class="button shuffle" href="" title="' + mkf.lang.get('label_shuffle') + '"></a><a class="button repeat" href="" title="' + mkf.lang.get('label_repeat') + '"></a>');
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
		$('.mute').click(function() {
			xbmc.setMute(); return false;
		});
		var shuffle = function(event) {
			xbmc.control({type: (event.data.shuffle? 'shuffle': 'unshuffle')}); return false;
		};

		$controls.filter('.shuffle').bind('click', {"shuffle": true}, shuffle);

		var repeat = function(event) {
			if (event.data.repeat == 'all' && xbmc.periodicUpdater.repeatStatus == 'off') {
				type = 'all';
			} else if (event.data.repeat == 'one' && xbmc.periodicUpdater.repeatStatus == 'all') {
				type = 'one';
			} else if (event.data.repeat == 'off' && xbmc.periodicUpdater.repeatStatus == 'one') {
				type = 'off'; 
			};
			xbmc.controlRepeat(type);
			return false;
		};
		
		$controls.filter('.repeat').bind('click', {"repeat": 'all' }, repeat);

		xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
			var $muteBtn = $('.mute');
			if (status == 'muteOn') {
				//$shuffleBtn.unbind('click');
				//$shuffleBtn.bind('click', {"shuffle": false}, shuffle);
				$muteBtn.removeClass('unmuted');
				$muteBtn.addClass('muted');
				$muteBtn.attr('title', mkf.lang.get('label_mute'));

			} else if (status == 'muteOff') {
				//$shuffleBtn.unbind('click');
				//$shuffleBtn.bind('click', {"shuffle": true}, shuffle);
				$muteBtn.removeClass('muted');
				$muteBtn.addClass('unmuted');
				$muteBtn.attr('title', mkf.lang.get('label_mute'));
			}
		});
		
		xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
			var $shuffleBtn = $('.button.shuffle');
			if (status == 'shuffleOn') {
				$shuffleBtn.unbind('click');
				$shuffleBtn.bind('click', {"shuffle": false}, shuffle);
				$shuffleBtn.addClass('unshuffle');
				$shuffleBtn.attr('title', mkf.lang.get('label_unshuffle'));

			} else if (status == 'shuffleOff') {
				$shuffleBtn.unbind('click');
				$shuffleBtn.bind('click', {"shuffle": true}, shuffle);
				$shuffleBtn.removeClass('unshuffle');
				$shuffleBtn.attr('title', mkf.lang.get('label_shuffle'));
			}
			//No idea if we're in Audio or Video playlist; refresh both..
			awxUI.onMusicPlaylistShow();
			awxUI.onVideoPlaylistShow();
		});

		xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
			var $repeatBtn = $('.button.repeat');
			if (status == 'off') {
				$repeatBtn.unbind('click');
				$repeatBtn.bind('click', {"repeat": 'all'}, repeat);
				$repeatBtn.removeClass('repeatOff');
				$repeatBtn.addClass('repeat');
				$repeatBtn.attr('title', mkf.lang.get('label_repeat'));
			} else if (status == 'all') {
				$repeatBtn.unbind('click');
				$repeatBtn.bind('click', {"repeat": 'one'}, repeat);
				$repeatBtn.addClass('repeat1');
				$repeatBtn.attr('title', mkf.lang.get('label_repeat1'));
			} else if (status == 'one') {
				$repeatBtn.unbind('click');
				$repeatBtn.removeClass('repeat1');
				$repeatBtn.bind('click', {"repeat": 'off'}, repeat);			
				$repeatBtn.addClass('repeatOff');
				$repeatBtn.attr('title', mkf.lang.get('label_repeatoff'));
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
				'<div class="input_big"><div><a href="" class="bigHome" title="' + mkf.lang.get('btn_home') + '"></a>' +
				'<a href="" class="bigUp" title="' + mkf.lang.get('btn_up') + '"></a>' +
				'<a href="" class="bigBack" title="' + mkf.lang.get('btn_back') + '"></a></div>' +
				'<div><a href="" class="bigLeft" title="' + mkf.lang.get('btn_left') + '"></a>' +
				'<a href="" class="bigSelect" title="' + mkf.lang.get('btn_select') + '"></a>' +
				'<a href="" class="bigRight" title="' + mkf.lang.get('btn_right') + '"></a></div>' +
				
				'<div><a href="" class="bigDown" title="' + mkf.lang.get('btn_down') + '"></a></div>' +
				'</div>' +
				
				'<div class="input_big_av"><div><a href="" class="bigSubPrev" title="' + mkf.lang.get('btn_subsPrev') + '"></a>' +
				'<a href="" class="bigSubOnOff" title="' + mkf.lang.get('btn_subsCycleOnOff') + '"></a>' +
				'<a href="" class="bigSubNext" title="' + mkf.lang.get('btn_subsNext') + '"></a></div>' +
				
				'<div><a href="" class="bigAudioPrev" title="' + mkf.lang.get('btn_audioStreamPrev') + '"></a>' +
				'<a href="" class="bigAudioNext" title="' + mkf.lang.get('btn_audioStreamNext') + '"></a></div>' +
				'</div>' +
				
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
			$('.bigLeft').click(function() {
				xbmc.input({type: 'Left', onError: failed}); return false;
			});
			$('.bigRight').click(function() {
				xbmc.input({type: 'Right', onError: failed}); return false;
			});
			$('.bigUp').click(function() {
				xbmc.input({type: 'Up', onError: failed}); return false;
			});
			$('.bigDown').click(function() {
				xbmc.input({type: 'Down', onError: failed}); return false;
			});
			$('.bigBack').click(function() {
				xbmc.input({type: 'Back', onError: failed}); return false;
			});
			$('.bigHome').click(function() {
				xbmc.input({type: 'Home', onError: failed}); return false;
			});
			$('.bigSelect').click(function() {
				xbmc.input({type: 'Select', onError: failed}); return false;
			});
			$('.bigSubOnOff').click(function() {
				xbmc.setSubtitles({command: (xbmc.periodicUpdater.subsenabled? 'off' : 'on'), onError: failed}); return false;
			});			
			$('.bigSubNext').click(function() {
				xbmc.setSubtitles({command: 'next', onError: failed}); return false;
			});
			$('.bigSubPrev').click(function() {
				xbmc.setSubtitles({command: 'previous', onError: failed}); return false;
			});
			$('.bigAudioNext').click(function() {
				xbmc.setAudioStream({command: 'next', onError: failed}); return false;
			});
			$('.bigAudioPrev').click(function() {
				xbmc.setAudioStream({command: 'previous', onError: failed}); return false;
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
			var watched = mkf.cookieSettings.get('watched', 'no');
			var hidewatchedmark = mkf.cookieSettings.get('hidewatchedmark', 'no');
			var listview = mkf.cookieSettings.get('listview', 'no');
			var usefanart = mkf.cookieSettings.get('usefanart', 'no');
			var filmSort = mkf.cookieSettings.get('filmSort', 'label');
			var mdesc = mkf.cookieSettings.get('mdesc', 'no');

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
				'<input type="radio" id="defaultUI" name="userinterface" value="default" ' + (ui=='default'? 'checked="checked"' : '') + '><label for="defaultUI">' + mkf.lang.get('label_default_ui') +'</label>' +
				'<input type="radio" id="lightUI" name="userinterface" value="light" ' + (ui=='light'? 'checked="checked"' : '') + '><label for="lightUI">Light UI</label>' +
				'<input type="radio" id="lightDarkUI" name="userinterface" value="lightDark" ' + (ui=='lightDark'? 'checked="checked"' : '') + '><label for="lightDarkUI">LightDark UI</label>' +
				'</fieldset>' +
				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_language') + '</legend>' +
				'<select name="lang" size="1">' + languages + '</select>' +
				'</fieldset>' +
				'<fieldset class="ui_albums">' +
				'<legend>' + mkf.lang.get('group_albums') + '</legend>' +
				'<input type="radio" id="orderByAlbum" name="albumOrder" value="album" ' + (order=='album'? 'checked="checked"' : '') + '><label for="orderByAlbum">' + mkf.lang.get('label_order_by_title') +'</label>' +
				'<input type="radio" id="orderByArtist" name="albumOrder" value="artist" ' + (order=='artist'? 'checked="checked"' : '') + '><label for="orderByArtist">' + mkf.lang.get('label_order_by_artist') +'</label>' +
				'</fieldset>' +
				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_film_sort') + '</legend>' +
				'' + mkf.lang.get('settings_select_film_sort') +'<select name="filmSort"><option value="label" ' + (filmSort=='label'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_label') +
				'</option><option value="sorttitle" ' + (filmSort=='sorttitle'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_sorttitle') +
				'</option><option value="year" ' + (filmSort=='year'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_year') +'</option><option value="genre "' + (filmSort=='genre'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_genre') +'</option>' +
				'<option value="none" ' + (filmSort=='none'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_none') +'</option><option value="videorating" ' + (filmSort=='videorating'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_videorating') +
				'</option><option value="studio">' + mkf.lang.get('label_film_sort_studio') +'</option></select>' +
				'<input type="checkbox" id="mdesc" name="mdesc" ' + (mdesc=='descending'? 'checked="checked"' : '') + '><label for="mdesc">' + mkf.lang.get('label_filter_mdesc') + '</label>' +
				'</fieldset>' +
				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_expert') + '</legend>' +
				'<a href="" class="formButton expertHelp" title="' + mkf.lang.get('btn_title_help') + '">' + mkf.lang.get('btn_text_help') + '</a>' + 
				'<input type="checkbox" id="lazyload" name="lazyload" ' + (lazyload=='yes'? 'checked="checked"' : '') + '><label for="lazyload">' + mkf.lang.get('label_use_lazyload') + '</label><br />' +
				'<label for="timeout">' + mkf.lang.get('label_timeout') + '</label><input type="text" id="timeout" name="timeout" value="' + timeout + '" maxlength="3" style="width: 30px; margin-top: 10px;"> ' + mkf.lang.get('label_seconds') +
				'</fieldset>' +
				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_view') + '</legend>' +
				'<input type="checkbox" id="listview" name="listview" ' + (listview=='yes'? 'checked="checked"' : '') + '><label for="listview">' + mkf.lang.get('label_filter_listview') + '</label>' +
				'<input type="checkbox" id="usefanart" name="usefanart" ' + (usefanart=='yes'? 'checked="checked"' : '') + '><label for="usefanart">' + mkf.lang.get('label_use_fanart') + '</label><br />' +
				'<input type="checkbox" id="watched" name="watched" ' + (watched=='yes'? 'checked="checked"' : '') + '><label for="watched">' + mkf.lang.get('label_filter_watched') + '</label>' +
				'<input type="checkbox" id="hidewatchedmark" name="hidewatchedmark" ' + (hidewatchedmark=='yes'? 'checked="checked"' : '') + '><label for="hidewatchedmark">' + mkf.lang.get('label_filter_showwatched') + '</label>' +
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
					if (document.settingsForm.userinterface[1].checked == true) {
						ui = 'light';
					} else if ( document.settingsForm.userinterface[0].checked == true) {
						ui = 'default';
					} else if ( document.settingsForm.userinterface[2].checked == true) {
						ui = 'lightDark';
					} else {
						ui = 'lightDark';
					}
				mkf.cookieSettings.add('ui', ui);

				mkf.cookieSettings.add(
					'albumOrder',
					document.settingsForm.albumOrder[0].checked? 'album' : 'artist'
				);
				
				mkf.cookieSettings.add(
					'filmSort',
					document.settingsForm.filmSort.value
				);
				
				mkf.cookieSettings.add(
					'mdesc',
					document.settingsForm.mdesc.checked? 'descending' : 'ascending'
				);
				
				mkf.cookieSettings.add(
					'lazyload',
					document.settingsForm.lazyload.checked? 'yes' : 'no'
				);
				
				mkf.cookieSettings.add(
					'usefanart',
					document.settingsForm.usefanart.checked? 'yes' : 'no'
				);
				
				mkf.cookieSettings.add(
					'watched',
					document.settingsForm.watched.checked? 'yes' : 'no'
				);
				
				mkf.cookieSettings.add(
					'hidewatchedmark',
					document.settingsForm.hidewatchedmark.checked? 'yes' : 'no'
				);
				
				mkf.cookieSettings.add(
					'listview',
					document.settingsForm.listview.checked? 'yes' : 'no'
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
		}; // END onArtistClick


		// no artists?
		if (!artistResult || !artistResult.artists) {
			return;
		}

		this.each (function() {
			var artistList = $('<ul class="fileList"></ul>').appendTo($(this));

			if (artistResult.limits.total > 0) {
				$.each(artistResult.artists, function(i, artist)  {
					artistList.append('<li' + (i%2==0? ' class="even"': '') + '><a href="" class="artist' +
										artist.artistid + '">' +
										artist.label + '<div class="findKeywords">' + artist.label.toLowerCase() + '</div>' +
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
	 |  Show audio genres.
	 |
	 |  @param genreResult		Result of AudioLibrary.GetGenres.
	 |  @param parentPage		Page which is used as parent for new sub pages.
	\* ########################### */
	$.fn.defaultArtistsGenresViewer = function(artistGenresResult, parentPage) {
			var onArtistGenresClick = function(e) {
				// open new page to show artist's albums
				var $artistContent = $('<div class="pageContentWrapper"></div>');
				var artistPage = mkf.pages.createTempPage(parentPage, {
					title: e.data.strGenre,
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

				// show artist's
				$artistContent.addClass('loading');
				xbmc.getArtistsGenres({
					genreid: e.data.idGenre,

					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed_artists_list'), mkf.messageLog.status.error, 5000);
						$artistGenresContent.removeClass('loading');
					},

					onSuccess: function(result) {
						$artistContent.defaultArtistsViewer(result, artistPage);
						$artistContent.removeClass('loading');
					}
				});

				return false;
			}; // END onArtistGenresClick

		var onAllGenresAlbumsClick = function(e) {
			// open new page to show artist's albums
			var $artistsGenresContent = $('<div class="pageContentWrapper"></div>');
			var artistPage = mkf.pages.createTempPage(parentPage, {
				title: e.data.strGenre,
				content: $artistsGenresContent
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

			// show artist's
			$artistsGenresContent.addClass('loading');
			xbmc.getGenresAlbums({
				genreid: e.data.idGenre,

				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed_album_list'), mkf.messageLog.status.error, 5000);
					$artistsGenresContent.removeClass('loading');
				},

				onSuccess: function(result) {
					$artistsGenresContent.defaultAlbumViewer(result, artistPage);
					$artistsGenresContent.removeClass('loading');
				}
			});

			return false;
		}; // END onArtistGenresClick
		
		
		// no genres?
		if (!artistGenresResult || !artistGenresResult.genres) {
			return;
		}
		
		this.each (function() {
			var artistGenresList = $('<ul class="fileList"></ul>').appendTo($(this));

			if (artistGenresResult.limits.total > 0) {
				//Add option to show all albums in genre - getGenresAlbums
				//artistGenresList.append('<li><a href="" class="allgenrealbums">All albums from genre</a></li>');
				$.each(artistGenresResult.genres, function(i, artistGenres)  {
					if (artistGenres.genreid == 0) { return };
					artistGenresList.append('<li' + (i%2==0? ' class="even"': '') + 
										//'><a href="" class="allgenre' + artistGenres.genreid + '">All - </a><a href="" class="genre' + 
										'><div class="folderLinkWrapper"><a href="" class="button allgenre' + artistGenres.genreid + '" title="' + mkf.lang.get('btn_all') + '"><span class="miniIcon all" /></a><a href="" class="genre' + 
										artistGenres.genreid + '">' +
										artistGenres.label + '<div class="findKeywords">' + artistGenres.label.toLowerCase() + '</div>' +
										'</a></div></li>');
					artistGenresList.find('.allgenre' + artistGenres.genreid).on('click', {idGenre: artistGenres.genreid, strGenre: artistGenres.label}, onAllGenresAlbumsClick);
					artistGenresList.find('.genre' + artistGenres.genreid)
						.bind('click',
							{
								idGenre: artistGenres.genreid,
								strGenre: artistGenres.label
							},
							onArtistGenresClick);
				});
			}
		});
	}; // END defaultArtistsGenresViewer
	

	/* ########################### *\
	 |  Show music playlists.
	 |
	 |  @param MusicPlaylistsResult		Result of Files.GetDirectory.
	 |  @param parentPage		Page which is used as parent for new sub pages.
	\* ########################### */
	$.fn.defaultMusicPlaylistsViewer = function(MusicPlaylistsResult, parentPage) {
		var onMusicPlaylistsClick = function(e) {
		
			if (e.data.strType !='song') {
				// open new page to show playlist or album
				var $MusicPlaylistsContent = $('<div class="pageContentWrapper"></div>');
				var MusicPlaylistsPage = mkf.pages.createTempPage(parentPage, {
					title: e.data.strLabel,
					content: $MusicPlaylistsContent
				});
				MusicPlaylistsPage.setContextMenu(
					[
						{
							'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_album_list'), 'shortcut':'Ctrl+1', 'onClick':
							function() {
								mkf.pages.closeTempPage(MusicPlaylistsPage);
								return false;
							}
						}
					]
				);
				mkf.pages.showTempPage(MusicPlaylistsPage);

				
				// list playlist or album
				$MusicPlaylistsContent.addClass('loading');
				xbmc.getDirectory({
					directory: e.data.strFile,
					isPlaylist: true,

					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
						$MusicPlaylistsContent.removeClass('loading');
					},

					onSuccess: function(result) {
						$MusicPlaylistsContent.defaultMusicPlaylistsViewer(result, MusicPlaylistsPage);
						$MusicPlaylistsContent.removeClass('loading');
					}
				});
			};
			
			if (e.data.strType == 'song') {
				var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_song'));
				xbmc.playSong({
					songid: e.data.id,
					onSuccess: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					},
					onError: function(errorText) {
						mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
					}
				});			
			};
			return false;
		}; // END onMusicPlaylistsClick
		
		var onPlaylistsPlayClick = function(e) {
			//console.log(e.data);
			xbmc.clearAudioPlaylist({
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
					//$MusicPlaylistsContent.removeClass('loading');
				},
				onSuccess: function() {
					//console.log(e.data.playlistinfo);
					onAddPlaylistToPlaylistClick(e);
					xbmc.playAudio({
						onError: function() {
							mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
							//$MusicPlaylistsContent.removeClass('loading');
						},
						onSuccess: function() {
							mkf.messageLog.show(mkf.lang.get('message_playing_item'), mkf.messageLog.status.success, 2000);
						}
					});
				}
			});
			return false;
		};
		
		var onAddPlaylistToPlaylistClick = function(e) {
			//console.log(e.data.playlistinfo);
			var isSmart = false;
			if (e.data.playlistinfo.file.search(/\.xsp/i) !=-1) { isSmart = true; };
			//console.log(e.data.playlistinfo.file.search(/\.xsp/i));
			//console.log(isSmart);
			if (e.data.playlistinfo.type == 'unknown' && isSmart == true) {
				//unknown and .xsp so should be a smart playlist
				xbmc.getDirectory({
					directory: e.data.playlistinfo.file,
					isPlaylist: true,
					
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
						$MusicPlaylistsContent.removeClass('loading');
					},

					onSuccess: function(result) {
						//parse playlist
						//console.log(result);
						Sn = 1;
						An = 1;
						$.each(result.files, function(i, file) {
							if (file.type == 'album') {
								//add to playlist by albumid, returned as id
								if (An == 1) { var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_album_to_playlist')); };
								An ++;
								xbmc.addAlbumToPlaylist({
									albumid: file.id,
									async: true,
									
									onSuccess: function() {
										mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
									},
									onError: function(errorText) {
										mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
									}
								});
							} else if (file.type == 'song') {
								//add to playlist by songid, returned as id
								
								//console.log(n);
								if (Sn == 1) { var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_song_to_playlist')); };
								Sn ++;
								xbmc.addSongToPlaylist({
									songid: file.id,
									// async required to add in playlist order
									async: true,
									
									onSuccess: function() {
										mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
									},
									onError: function(errorText) {
										mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
									}
								});
							} else {
								//it's not any of those, error
								mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
							};
						});
					}
				});
			};
			
			//should be normal playlist. m3u only? Can use playlist.add directory addAudioFolderToPlaylist
			if (!isSmart && e.data.playlistinfo.type == 'unknown') {
				var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_album_to_playlist'));
				xbmc.addAudioFolderToPlaylist({
					folder: e.data.playlistinfo.file,
					
					onSuccess: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					},
					onError: function(errorText) {
						mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
					}
				});
			};
			
			if (!isSmart && e.data.playlistinfo.type == 'album') {
				var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_album_to_playlist'));
				xbmc.addAlbumToPlaylist({
					albumid: e.data.playlistinfo.id,
					onSuccess: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					},
					onError: function(errorText) {
						mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
					}
				});
			};
			
			if (!isSmart && e.data.playlistinfo.type == 'song') {
				var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_song_to_playlist'));
				xbmc.addSongToPlaylist({
					songid: e.data.playlistinfo.id,
					async: true,
					
					onSuccess: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					},
					onError: function(errorText) {
						mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
					}
				});			
			};
			//is an album? Throw to addAlbumToPlaylist
				/*if (e.data.playlistinfo.type == 'album') {
					var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_album_to_playlist'));
					xbmc.addAlbumToPlaylist({
						albumid: e.data.playlistinfo.id,
						onSuccess: function() {
							mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
						},
						onError: function(errorText) {
							mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
						}
					});
				};
				
				if (e.data.playlistinfo.type == 'song') {
					//add to playlist by songid, returned as id
					var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_song_to_playlist'));
					xbmc.addSongToPlaylist({
						songid: e.data.playlistinfo.id,
						async: true,
						
						onSuccess: function() {
							mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
						},
						onError: function(errorText) {
							mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
						}
					});
				};*/
			
			/*var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_album_to_playlist'));
			xbmc.addAlbumToPlaylist({
				albumid: event.data.idAlbum,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});*/
			return false;
		};
		
		// no artists?
		if (!MusicPlaylistsResult || !MusicPlaylistsResult.files) {
			return;
		};

		//console.log(MusicPlaylistsResult);
		this.each (function() {
			var MusicPlaylistsList = $('<ul class="fileList"></ul>').appendTo($(this));

			if (MusicPlaylistsResult.limits.total > 0) {
				$.each(MusicPlaylistsResult.files, function(i, playlist)  {
					MusicPlaylistsList.append('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' +
										'<a href="" class="button playlistinfo' + i +'" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' +
										'<a href="" class="button play' + i + '" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' +
										'<a href="" class="playlist' + i + '">' + playlist.label + ' - Type: ' + 
										(playlist.type == 'unknown' ? 'Playlist' : playlist.type) + '<div class="findKeywords">' + playlist.label.toLowerCase() + '</div>' +
										'</a></div></li>');
					MusicPlaylistsList.find('.playlist' + i)
						.bind('click',
							{
								id: playlist.id,
								strFile: playlist.file,
								strLabel: playlist.label,
								strType: playlist.type
							},
							onMusicPlaylistsClick);
					MusicPlaylistsList.find('.playlistinfo' + i).bind('click', {playlistinfo: playlist}, onAddPlaylistToPlaylistClick);
					MusicPlaylistsList.find('.play' + i).bind('click', {playlistinfo: playlist}, onPlaylistsPlayClick);
				});
			}
		});
	}; // END defaultMusicPlaylistsViewer

	
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
		}; // END onSonglistClick


		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
		var listview = mkf.cookieSettings.get('listview', 'no')=='yes'? true : false;


		this.each (function() {
			var $albumViewerElement = $(this);
			
			if (albumResult.limits.total > 0 && listview == true) {
				var albums = albumResult.albums;

				//list view
				var $albumList = $('<ul class="fileList"></ul>').appendTo($(this));
					$.each(albums, function(i, album)  {
						$album = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' + 
							'<a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' +
							'<a href="" class="button play" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' +
							'<a href="" class="album' + album.albumid + '">' + album.label + ' - ' + album.artist + '<div class="findKeywords">' + album.label.toLowerCase() + ' ' + album.artist.toLowerCase() + '</div>' +
							'</a></div></li>').appendTo($albumList);

						$album.find('.album'+ album.albumid).bind('click', {idAlbum: album.albumid, strAlbum: album.label}, onSonglistClick);
						$album.find('.playlist').bind('click', {idAlbum: album.albumid}, onAddAlbumToPlaylistClick);
						$album.find('.play').bind('click', {idAlbum: album.albumid, strAlbum: album.label}, onAlbumPlayClick);
					});
			}
			
			if (albumResult.limits.total > 0 && listview == false) {
				var albums = albumResult.albums;
				
				//Thumbnail view
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
							'<div class="albumName">' + album.label + '' +
							'<div class="albumArtist">' + album.artist + '</div></div>' +
							'<div class="findKeywords">' + album.label.toLowerCase() + ' ' + album.artist.toLowerCase() + '</div>' +
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
	 |  Show the Recent albums.
	 |
	 |  @param albumResult		Result of AudioLibrary.GetAlbums.
	 |  @param parentPage		Page which is used as parent for new sub pages.
	\* ########################### */
	$.fn.defaultAlbumRecentViewer = function(albumResult, parentPage) {
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
		}; // END onSonglistClick


		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;


		this.each (function() {
			var $albumViewerElement = $(this);

			if (albumResult.limits.total > 0) {
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
							'<div class="albumName">' + album.label + '' +
							'<div class="albumArtist">' + album.artist + '</div></div>' +
							'<div class="findKeywords">' + album.label.toLowerCase() + ' ' + album.artist.toLowerCase() + '</div>' +
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
	}; // END defaultRecentAlbumViewer
	
	
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

			if (songResult.limits.total > 0) {
				$.each(songResult.songs, function(i, song)  {
					var $song = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper song' + song.songid + '"> <a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a> <a href="" class="song play">' + song.track + '. ' + song.artist + ' - ' + song.label + '</a></div></li>').appendTo($songList);
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
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_removing_item'));
			var fn;
			
			if (playlist == 'Audio') {
				fn = xbmc.removeAudioPlaylistItem;
			} else {
				fn = xbmc.removeVideoPlaylistItem;
			}
			
			fn({
				item: event.data.itemNum,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					awxUI.onMusicPlaylistShow();
					awxUI.onVideoPlaylistShow();
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});

			
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
		
		//lets do one of these for audio and video
		//audio
		if (playlist == 'Audio') {
			this.each(function() {
				var $itemList = $('<ul class="fileList" id="sortable"></ul>').appendTo($(this));
				var runtime = 0;
				//console.log(playlistResult.items);
				if (playlistResult.limits.total > 0) {
					$.each(playlistResult.items, function(i, item)  {
						// for files added via file function
						if (item.type != 'unknown') {
							var artist = (item.artist? item.artist : mkf.lang.get('label_not_available'));
							var album = (item.album? item.album : mkf.lang.get('label_not_available'));
							var label = (item.label? item.label : mkf.lang.get('label_not_available'));
							var title = (item.title? item.title : label);
							//var duration = (item.duration? item.duration : '');
						} else {
							var label = (item.label? item.label : mkf.lang.get('label_not_available'));
						};
						var duration = (item.duration? item.duration : '');
						var playlistItemClass = '';
						if (i%2==0) {
							playlistItemClass = 'even';
						}
						// what to about runtime and added files? console.log(runtime);
						runtime += duration;
						playlistItemCur = 'playlistItem';
						//Change background colour of currently playing item.
						/*if (i == xbmc.periodicUpdater.curPlaylistNum && xbmc.periodicUpdater.playerStatus != 'stopped') {
							playlistItemClass = 'current';
						}*/
						
						if (i == xbmc.periodicUpdater.curPlaylistNum && xbmc.periodicUpdater.playerStatus != 'stopped') {
							playlistItemCur = 'playlistItemCur';
						} else {
							playlistItemCur = 'playlistItem';
						}
						
						$item = $('<li class="' + playlistItemClass + '" id="apli' + i + '"><div class="folderLinkWrapper playlistItem' + i + '">' + 
							'<a class="button remove" href="" title="' + mkf.lang.get('btn_remove') +  '"><span class="miniIcon remove" /></a><span class="miniIcon playlistmove" title="' + mkf.lang.get('btn_swap') +  '" />' +
							'<a class="' + playlistItemCur + ' apli' + i + ' play" href="">' + (i+1) + '. ' +
							(artist? artist + ' - ' : '') + (album? album + ' - ' : '') + (title? title : label) + '&nbsp;&nbsp;&nbsp;&nbsp;' + (duration? xbmc.formatTime(duration) : '') +
							'<div class="findKeywords">' + artist.toLowerCase() + ' ' + album.toLowerCase() + ' ' + label.toLowerCase() + '</div>' +
							'</a></div></li>').appendTo($itemList);

						$item.find('a.play').bind('click', {itemNum: i}, onItemPlayClick);
						$item.find('a.remove').bind('click', {itemNum: i}, onItemRemoveClick);
					});
				}
				if (runtime > 0) {
						$itemList = $('<p>' + mkf.lang.get('label_total_runtime') + xbmc.formatTime(runtime) + '</p>').appendTo($(this));
				}
				$( "#sortable" ).sortable({
					helper: 'clone',
					handle : '.playlistmove',
					update: function(event, ui) {
						var messageHandle = mkf.messageLog.show(mkf.lang.get('message_swap_playlist'));
						xbmc.swapAudioPlaylist({
							plFrom: ui.item.attr("id").replace(/[^\d]+/g, ''),
							plTo: ui.item.prevAll().length,
							onSuccess: function() {
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
								// update playlist - $each classRemove classAdd new IDs?
								awxUI.onMusicPlaylistShow();
							},
							onError: function(errorText) {
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 8000, mkf.messageLog.status.error);
							}
						});
					}
				});
			});
		}
		
		//video
		if (playlist == 'Video') {
			this.each(function() {
				var $itemList = $('<ul class="fileList" id="sortable"></ul>').appendTo($(this));
				var runtime = 0;
				if (playlistResult.limits.total > 0) {
					$.each(playlistResult.items, function(i, item)  {
						var showtitle = (item.showtitle? item.showtitle : mkf.lang.get('label_not_available'));
						var title = (item.label? item.label : mkf.lang.get('label_not_available'));
						var season = (item.season? item.season : mkf.lang.get('label_not_available'));
						var duration  = (item.runtime? item.runtime : 0);
						if (duration != 0) {
							duration = duration * 60;
							runtime += duration;
						};
						var playlistItemClass = '';
						if (i%2==0) {
							playlistItemClass = 'even';
						};
						//runtime += duration;
						//Change background colour of currently playing item.
						/*if (i == xbmc.periodicUpdater.curPlaylistNum && xbmc.periodicUpdater.playerStatus != 'stopped') {
							playlistItemClass = 'current';
						}*/
						//initial marking of currently playing item. After periodic sets.
						if (i == xbmc.periodicUpdater.curPlaylistNum && xbmc.periodicUpdater.playerStatus != 'stopped') {
							playlistItemCur = 'playlistItemCur';
						} else {
							playlistItemCur = 'playlistItem';
						};						
						$item = $('<li class="' + playlistItemClass + '" id="vpli' + i + '"><div class="folderLinkWrapper playlistItem' + i + '">' + 
							'<a class="button remove" href="" title="' + mkf.lang.get('btn_remove') +  '"><span class="miniIcon remove" /></a><span class="miniIcon playlistmove" title="' + mkf.lang.get('btn_swap') +  '"/>' +
							'<a class="' + playlistItemCur  + ' vpli' + i + ' play" href="">' + (i+1) + '. ' +
							(item.type=='episode'? showtitle + ' - Season ' + season + ' - ' + title : title) + '&nbsp;&nbsp;&nbsp;&nbsp;' + xbmc.formatTime(duration) +
							'</a></div></li>').appendTo($itemList);

						$item.find('a.play').bind('click', {itemNum: i}, onItemPlayClick);
						$item.find('a.remove').bind('click', {itemNum: i}, onItemRemoveClick);
					});
				}
				if (runtime > 0) {
					$itemList = $('<p>' + mkf.lang.get('label_total_runtime') + xbmc.formatTime(runtime) + '</p>').appendTo($(this));
				}
				$( "#sortable" ).sortable({
					helper: 'clone',
					handle : '.playlistmove',
					update: function(event, ui) {
						var messageHandle = mkf.messageLog.show(mkf.lang.get('message_swap_playlist'));
						xbmc.swapVideoPlaylist({
							plFrom: ui.item.attr("id").replace(/[^\d]+/g, ''),
							plTo: ui.item.prevAll().length,
							onSuccess: function() {
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
								// update playlist - $each classRemove classAdd new IDs?
								awxUI.onVideoPlaylistShow();
							},
							onError: function(errorText) {
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 8000, mkf.messageLog.status.error);
							}
						});
					}
				});
			});
		}
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
			var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;

			xbmc.getMovieInfo({
				movieid: event.data.idMovie,
				onSuccess: function(movie) {
					//var dialogContent = '';
					var fileDownload = '';
					
					xbmc.getPrepDownload({
						path: movie.file,
						onSuccess: function(result) {
							fileDownload = xbmc.getUrl(result.details.path);
							// no better way?
							$('.filelink').find('a').attr('href',fileDownload);
						},
						onError: function(errorText) {
							$('.filelink').find('a').replaceWith(movie.file);
						},
					});
					
					
					var streamdetails = {
						vFormat: 'SD',
						vCodec: 'Unknown',
						aCodec: 'Unknown',
						channels: 0,
						aStreams: 0,
						hasSubs: false,
						aLang: '',
						aspect: 0,
						vwidth: 0
					};
					
					if ( useFanart ) {
						$('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(movie.fanart) + '")');
					};
					
					if (movie.streamdetails) {
						if (movie.streamdetails.subtitle) { streamdetails.hasSubs = true };
						if (movie.streamdetails.audio) {
							streamdetails.channels = movie.streamdetails.audio[0].channels;
							streamdetails.aStreams = movie.streamdetails.audio.length;
							$.each(movie.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
							if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('label_not_available') };
						};
					streamdetails.aspect = xbmc.getAspect(movie.streamdetails.video[0].aspect);
					//Get video standard
					streamdetails.vFormat = xbmc.getvFormat(movie.streamdetails.video[0].width);
					//Get video codec
					streamdetails.vCodec = xbmc.getVcodec(movie.streamdetails.video[0].codec);
					//Set audio icon
					streamdetails.aCodec = xbmc.getAcodec(movie.streamdetails.audio[0].codec);
					};
					
					var thumb = (movie.thumbnail? xbmc.getThumbUrl(movie.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
					//dialogContent += '<img src="' + thumb + '" class="thumb thumb' + xbmc.getMovieThumbType() + ' dialogThumb" />' + //Won't this always be poster?!
					var dialogContent = $('<div><img src="' + thumb + '" class="thumb thumbPosterLarge dialogThumb" /></div>' +
						'<div><h1 class="underline">' + movie.title + '</h1></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_original_title') + '</span><span class="value">' + (movie.originaltitle? movie.originaltitle : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_runtime') + '</span><span class="value">' + (movie.runtime? movie.runtime : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_genre') + '</span><span class="value">' + (movie.genre? movie.genre : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="value"><div class="smallRating' + Math.round(movie.rating) + '"></div></span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_votes') + '</span><span class="value">' + (movie.votes? movie.votes : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_year') + '</span><span class="value">' + (movie.year? movie.year : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_director') + '</span><span class="value">' + (movie.director? movie.director : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_writer') + '</span><span class="value">' + (movie.writer? movie.writer : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_studio') + '</span><span class="value">' + (movie.studio? movie.studio : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_tagline') + '</span><span class="value">' + (movie.tagline? movie.tagline : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_set') + '</span><span class="value">' + (movie.set[0]? movie.set : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_lastplayed') + '</span><span class="value">' + (movie.lastplayed? movie.lastplayed : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_playcount') + '</span><span class="value">' + (movie.playcount? movie.playcount : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_audioStreams') + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('label_not_available')) + '</span></div>' +
						(movie.imdbnumber? '<div class="movieinfo"><span class="label">IMDB:</span><span class="value">' + '<a href="http://www.imdb.com/title/' + movie.imdbnumber + '">IMDB</a>' + '</span></div></div>' : '') +
						'<div class="movieinfo filelink"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + movie.file + '</a>' + '</span></div></div>' +
						'<p class="plot">' + movie.plot + '</p>' +
						'<div class="movietags"><span class="infoqueue" title="' + mkf.lang.get('btn_enqueue') + '" /><span class="infoplay" title="' + mkf.lang.get('btn_play') + '" /></div>');

					if (movie.streamdetails) {
						dialogContent.filter('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
						'<div class="aspect' + streamdetails.aspect + '" />' +
						'<div class="vCodec' + streamdetails.vCodec + '" />' +
						'<div class="aCodec' + streamdetails.aCodec + '" />' +
						'<div class="channels' + streamdetails.channels + '" />' +
						(streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
					};

					$(dialogContent).find('.infoplay').on('click', {idMovie: movie.movieid, strMovie: movie.label}, onMoviePlayClick);
					$(dialogContent).find('.infoqueue').on('click', {idMovie: movie.movieid, strMovie: movie.label}, onAddMovieToPlaylistClick);
					mkf.dialog.setContent(dialogHandle, dialogContent);
					return false;
				},
				onError: function() {
					mkf.messageLog.show('Failed to load movie information!', mkf.messageLog.status.error, 5000);
					mkf.dialog.close(dialogHandle);
				}
			});
			return false;
		};


		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
		var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
		var listview = mkf.cookieSettings.get('listview', 'no')=='yes'? true : false;
		var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
		
		
		this.each(function() {
			//var $movieContainer = $(this);

			if (movieResult.limits.total > 0 && listview == true) {
				var $movieList = $('<ul class="fileList"></ul>').appendTo($(this));
				var classEven = -1;
					$.each(movieResult.movies, function(i, movie) {
						//var movies = movieResult.movies;
						var watched = false;
							if (typeof movie.movieid === 'undefined') {
								return;
							}
							if (movie.playcount > 0 && !filterShowWatched) {
								watched = true;
							}
							
							if (filterWatched && watched) {
								return;
							}
							
						classEven += 1
						//list view
							$movie = $('<li' + (classEven%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' + 
								'<a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' +
								'<a href="" class="button play" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' +
								'<a href="" class="movieName' + movie.movieid + '">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
								'</a></div></li>').appendTo($movieList);

							$movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, onMoviePlayClick);
							$movie.find('.playlist').bind('click', {idMovie: movie.movieid}, onAddMovieToPlaylistClick);
							$movie.find('.movieName' + movie.movieid).bind('click', {idMovie: movie.movieid}, onMovieInformationClick);
					});
			};
			
			
			if (movieResult.limits.total > 0 && listview == false) {
			var $movieContainer = $(this);
				$.each(movieResult.movies, function(i, movie) {
					
					var watched = false;
			
					// if movie has no id (e.g. movie sets), ignore it
					if (typeof movie.movieid === 'undefined') {
						return;
					}
					
					if (movie.playcount > 0) {
						watched = true;
					}
					
					if (filterWatched && watched) {
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
							'<div class="movieName">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
							'<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
						'</div>').appendTo($movieContainer);
					$movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, onMoviePlayClick);
					$movie.find('.playlist').bind('click', {idMovie: movie.movieid}, onAddMovieToPlaylistClick);
					$movie.find('.info').bind('click', {idMovie: movie.movieid}, onMovieInformationClick);
				});

				if (useLazyLoad) {
					function loadThumbs(i) {
						$movieContainer.find('img.thumb').lazyload(
							{
								queuedLoad: true,
								container: ($('#main').length? $('#main'): $('#content')),	// TODO remove fixed #main
								errorImage: 'images/thumb' + xbmc.getMovieThumbType() + '.png'
								//errorImage: 'images/thumbBanner.png'
							}
						);
					};
					setTimeout(loadThumbs, 100);
				}
			}

		});
	}; // END defaultMovieViewer

	/* ########################### *\
	 |  Show Recent movies.
	 |
	 |  @param movieRecentResult	Result of VideoLibrary.GetMovies.
	\* ########################### */
	$.fn.defaultMovieRecentViewer = function(movieResult) {
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
			//var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
			
			xbmc.getMovieInfo({
				movieid: event.data.idMovie,
				onSuccess: function(movie) {
					//var dialogContent = '';
					var fileDownload = '';
					
					xbmc.getPrepDownload({
						path: movie.file,
						onSuccess: function(result) {
							fileDownload = xbmc.getUrl(result.details.path);
							// no better way?
							$('.filelink').find('a').attr('href',fileDownload);
						},
						onError: function(errorText) {
							$('.filelink').find('a').replaceWith(movie.file);
						},
					});
					
					
					var streamdetails = {
						vFormat: 'SD',
						vCodec: 'Unknown',
						aCodec: 'Unknown',
						channels: 0,
						aStreams: 0,
						hasSubs: false,
						aLang: '',
						aspect: 0,
						vwidth: 0
					};
					
					if ( useFanart ) {
						$('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(movie.fanart) + '")');
					};
					
					if (movie.streamdetails) {
						if (movie.streamdetails.subtitle) { streamdetails.hasSubs = true };
						if (movie.streamdetails.audio) {
							streamdetails.channels = movie.streamdetails.audio[0].channels;
							streamdetails.aStreams = movie.streamdetails.audio.length;
							$.each(movie.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
							if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('label_not_available') };
						};
					streamdetails.aspect = xbmc.getAspect(movie.streamdetails.video[0].aspect);
					//Get video standard
					streamdetails.vFormat = xbmc.getvFormat(movie.streamdetails.video[0].width);
					//Get video codec
					streamdetails.vCodec = xbmc.getVcodec(movie.streamdetails.video[0].codec);
					//Set audio icon
					streamdetails.aCodec = xbmc.getAcodec(movie.streamdetails.audio[0].codec);
					};
					
					var thumb = (movie.thumbnail? xbmc.getThumbUrl(movie.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
					//dialogContent += '<img src="' + thumb + '" class="thumb thumb' + xbmc.getMovieThumbType() + ' dialogThumb" />' + //Won't this always be poster?!
					var dialogContent = $('<div><img src="' + thumb + '" class="thumb thumbPosterLarge dialogThumb" /></div>' +
						'<div><h1 class="underline">' + movie.title + '</h1></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_original_title') + '</span><span class="value">' + (movie.originaltitle? movie.originaltitle : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_runtime') + '</span><span class="value">' + (movie.runtime? movie.runtime : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_genre') + '</span><span class="value">' + (movie.genre? movie.genre : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="value"><div class="smallRating' + Math.round(movie.rating) + '"></div></span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_votes') + '</span><span class="value">' + (movie.votes? movie.votes : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_year') + '</span><span class="value">' + (movie.year? movie.year : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_director') + '</span><span class="value">' + (movie.director? movie.director : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_writer') + '</span><span class="value">' + (movie.writer? movie.writer : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_studio') + '</span><span class="value">' + (movie.studio? movie.studio : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_tagline') + '</span><span class="value">' + (movie.tagline? movie.tagline : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_set') + '</span><span class="value">' + (movie.set[0]? movie.set : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_lastplayed') + '</span><span class="value">' + (movie.lastplayed? movie.lastplayed : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_playcount') + '</span><span class="value">' + (movie.playcount? movie.playcount : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_audioStreams') + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('label_not_available')) + '</span></div>' +
						(movie.imdbnumber? '<div class="movieinfo"><span class="label">IMDB:</span><span class="value">' + '<a href="http://www.imdb.com/title/' + movie.imdbnumber + '">IMDB</a>' + '</span></div></div>' : '') +
						'<div class="movieinfo filelink"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + movie.file + '</a>' + '</span></div></div>' +
						'<p class="plot">' + movie.plot + '</p>' +
						'<div class="movietags"><span class="infoqueue" title="' + mkf.lang.get('btn_enqueue') + '" /><span class="infoplay" title="' + mkf.lang.get('btn_play') + '" /></div>');

					if (movie.streamdetails) {
						dialogContent.filter('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
						'<div class="aspect' + streamdetails.aspect + '" />' +
						'<div class="vCodec' + streamdetails.vCodec + '" />' +
						'<div class="aCodec' + streamdetails.aCodec + '" />' +
						'<div class="channels' + streamdetails.channels + '" />' +
						(streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
					};

					$(dialogContent).find('.infoplay').on('click', {idMovie: movie.movieid, strMovie: movie.label}, onMoviePlayClick);
					$(dialogContent).find('.infoqueue').on('click', {idMovie: movie.movieid, strMovie: movie.label}, onAddMovieToPlaylistClick);
					mkf.dialog.setContent(dialogHandle, dialogContent);
					return false;
				},
				onError: function() {
					mkf.messageLog.show('Failed to load movie information!', mkf.messageLog.status.error, 5000);
					mkf.dialog.close(dialogHandle);
				}
			});
			return false;
		};

		var ui = mkf.cookieSettings.get('ui');
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
		var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
		var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
		var listview = mkf.cookieSettings.get('listview', 'no')=='yes'? true : false;
		var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
		
		this.each(function() {
			var $movieContainer = $(this);

			if (movieResult.limits.total > 0 && listview == true) {
				//<img src="images/thumb.png" width="100" alt="Currently Playing" class="currentThumb" />
				var $movieList = $('<div id="accordion"></div>').appendTo($(this));
				var classEven = -1;
					$.each(movieResult.movies, function(i, movie) {
						//var movies = movieResult.movies;
						var watched = false;
							if (typeof movie.movieid === 'undefined') {
								return;
							}
							if (movie.playcount > 0 && !filterShowWatched) {
								watched = true;
							}
							
						classEven += 1
						//list view
							$movie = $('<h3 id="movieName' + movie.movieid + '"><a href="#">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</a></h3><div>' + 
								//'<a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' +
								//'<a href="" class="button play" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' +
								//'<a href="" class="movieName' + movie.movieid + '">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
								'' +
								'</div>').appendTo($movieList);

							//$movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, onMoviePlayClick);
							//$movie.find('.playlist').bind('click', {idMovie: movie.movieid}, onAddMovieToPlaylistClick);
							//$movie.find('.movieName' + movie.movieid).bind('click', {idMovie: movie.movieid}, onMovieInformationClick);
							//$( '#accordion' ).accordion();

					});
				$("#accordion").accordion({
                active:false,
                change:function(event, ui) {
					//console.log(ui.newContent.html());
					if(ui.newContent.html()!=""){
						//console.log('clear');
						ui.newContent.empty();
						//console.log(ui.newContent.html());
					}
                    if(ui.newContent.html()==""){
						//console.log($(ui.newHeader).attr('id'));
						var movieID = $(ui.newHeader).attr('id').replace(/[^\d]+/g, '');
						//console.log(ui.newContent);
						ui.newContent.addClass('loading');
									xbmc.getMovieInfo({
										movieid: movieID,
										onSuccess: function(movie) {
											var fileDownload = '';
											
											
											xbmc.getPrepDownload({
												path: movie.file,
												onSuccess: function(result) {
													fileDownload = xbmc.getUrl(result.details.path);
													// no better way?
													$('.filelink').find('a').attr('href',fileDownload);
												},
												onError: function(errorText) {
													$('.filelink').find('a').replaceWith(movie.file);
												},
											});
											
											
											var streamdetails = {
												vFormat: 'SD',
												vCodec: 'Unknown',
												aCodec: 'Unknown',
												channels: 0,
												aStreams: 0,
												hasSubs: false,
												aLang: '',
												aspect: 0,
												vwidth: 0
											};
											
											/*if ( useFanart ) {
												$('#accordion').css('background-image', 'url("' + xbmc.getThumbUrl(movie.fanart) + '")');
											};*/
											
											if (movie.streamdetails) {
												if (movie.streamdetails.subtitle) { streamdetails.hasSubs = true };
												if (movie.streamdetails.audio) {
													streamdetails.channels = movie.streamdetails.audio[0].channels;
													streamdetails.aStreams = movie.streamdetails.audio.length;
													$.each(movie.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
													if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('label_not_available') };
												};
											streamdetails.aspect = xbmc.getAspect(movie.streamdetails.video[0].aspect);
											//Get video standard
											streamdetails.vFormat = xbmc.getvFormat(movie.streamdetails.video[0].width);
											//Get video codec
											streamdetails.vCodec = xbmc.getVcodec(movie.streamdetails.video[0].codec);
											//Set audio icon
											streamdetails.aCodec = xbmc.getAcodec(movie.streamdetails.audio[0].codec);
											};
											
											var thumb = (movie.thumbnail? xbmc.getThumbUrl(movie.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
											//$('.thumbPosterLargeRec').attr('src', thumb);
											var dialogContent = $('<div style="float: left; margin-right: 5px;"><img src="' + thumb + '" class="thumb thumbPosterLarge dialogThumb" /></div>' +
											//'<div><h1 class="underline">' + movie.title + '</h1></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_original_title') + '</span><span class="value">' + (movie.originaltitle? movie.originaltitle : mkf.lang.get('label_not_available')) + '</span></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_runtime') + '</span><span class="value">' + (movie.runtime? movie.runtime : mkf.lang.get('label_not_available')) + '</span></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_genre') + '</span><span class="value">' + (movie.genre? movie.genre : mkf.lang.get('label_not_available')) + '</span></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="value"><div class="smallRating' + Math.round(movie.rating) + '"></div></span></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_votes') + '</span><span class="value">' + (movie.votes? movie.votes : mkf.lang.get('label_not_available')) + '</span></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_year') + '</span><span class="value">' + (movie.year? movie.year : mkf.lang.get('label_not_available')) + '</span></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_director') + '</span><span class="value">' + (movie.director? movie.director : mkf.lang.get('label_not_available')) + '</span></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_writer') + '</span><span class="value">' + (movie.writer? movie.writer : mkf.lang.get('label_not_available')) + '</span></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_studio') + '</span><span class="value">' + (movie.studio? movie.studio : mkf.lang.get('label_not_available')) + '</span></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_tagline') + '</span><span class="value">' + (movie.tagline? movie.tagline : mkf.lang.get('label_not_available')) + '</span></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_set') + '</span><span class="value">' + (movie.set[0]? movie.set : mkf.lang.get('label_not_available')) + '</span></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_lastplayed') + '</span><span class="value">' + (movie.lastplayed? movie.lastplayed : mkf.lang.get('label_not_available')) + '</span></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_playcount') + '</span><span class="value">' + (movie.playcount? movie.playcount : mkf.lang.get('label_not_available')) + '</span></div>' +
											'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_audioStreams') + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('label_not_available')) + '</span></div>' +
											(movie.imdbnumber? '<div class="movieinfo"><span class="label">IMDB:</span><span class="value">' + '<a href="http://www.imdb.com/title/' + movie.imdbnumber + '">IMDB</a>' + '</span></div></div>' : '') +
											'<div class="movieinfo filelink"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + movie.file + '</a>' + '</span></div></div>' +
											'<p class="plot" style="display: block; clear: left">' + movie.plot + '</p>' +
											'<div class="movietags" style="display: inline-block; width: auto"><span class="infoqueue" title="' + mkf.lang.get('btn_enqueue') + '" /><span class="infoplay" title="' + mkf.lang.get('btn_play') + '" /></div>');

										if (movie.streamdetails) {
											dialogContent.filter('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
											'<div class="aspect' + streamdetails.aspect + '" />' +
											'<div class="vCodec' + streamdetails.vCodec + '" />' +
											'<div class="aCodec' + streamdetails.aCodec + '" />' +
											'<div class="channels' + streamdetails.channels + '" />' +
											(streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
										};
											ui.newContent.removeClass('loading');
											ui.newContent.append(dialogContent);
											//$('#accordion').accordion('resize');
											$(dialogContent).find('.infoplay').on('click', {idMovie: movie.movieid, strMovie: movie.label}, onMoviePlayClick);
											$(dialogContent).find('.infoqueue').on('click', {idMovie: movie.movieid, strMovie: movie.label}, onAddMovieToPlaylistClick);
											
										},
										onError: function() {
											mkf.messageLog.show('Failed to load movie information!', mkf.messageLog.status.error, 5000);
											mkf.dialog.close(dialogHandle);
										}
									});
                        //ui.newContent.append('Hello!');
						//ui.newContent.removeClass('loading');
                    };
                },
                autoHeight: false,
				clearStyle: true,
				fillSpace: true,
				collapsible: true
            });
				/*$( '#accordion' ).accordion();
				$('.ui-accordion').bind('accordionchange', function(event, ui) {
					console.log($(ui.newHeader).attr('id'));
					ui.newContent.load($(ui.newHeader).attr('id').toString);
				});*/
			}
			
			else {
				$.each(movieResult.movies, function(i, movie) {
					
					var watched = false;
			
					// if movie has no id (e.g. movie sets), ignore it
					if (typeof movie.movieid === 'undefined') {
						return;
					}
					
					if (movie.playcount > 0 && !filterShowWatched) {
						watched = true;
					}
					
					/*if (filterWatched && watched) {
						return;
					}*/
					
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
							'<div class="movieName">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
							'<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
						'</div>').appendTo($movieContainer);
					$movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, onMoviePlayClick);
					$movie.find('.playlist').bind('click', {idMovie: movie.movieid}, onAddMovieToPlaylistClick);
					$movie.find('.info').bind('click', {idMovie: movie.movieid}, onMovieInformationClick);
				});
				
				if (useLazyLoad) {
					function loadThumbs(i) {
						$movieContainer.find('img.thumb').lazyload(
							{
								queuedLoad: true,
								container: ($('#main').length? $('#main'): $('#content')),	// TODO remove fixed #main
								errorImage: 'images/thumb' + xbmc.getMovieThumbType() + '.png'
								//errorImage: 'images/thumbBanner.png'
							}
						);
					};
					setTimeout(loadThumbs, 100);
				}
			}

		});
	}; // END defaultMovieRecentViewer
	

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
			var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;

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
				plot: NA
			};
			$.extend(tvshow, event.data.tvshow);
			var dialogContent = '';
			
			if ( useFanart ) {
				$('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(tvshow.fanart) + '")');
			};
			
			var thumb = (tvshow.thumbnail? xbmc.getThumbUrl(tvshow.thumbnail) : 'images/thumb' + xbmc.getTvShowThumbType() + '.png');
			var valueClass = 'value' + xbmc.getTvShowThumbType();
			dialogContent += '<img src="' + thumb + '" class="thumb thumb' + xbmc.getTvShowThumbType() + ' dialogThumb' + xbmc.getTvShowThumbType() + '" />' +
				'<h1 class="underline">' + tvshow.title + '</h1>' +
				//'<div class="test"><img src="' + tvshow.file + 'logo.png' + '" /></div>' +
				//'<div class="test"><span class="label">' + mkf.lang.get('label_runtime') + '</span><span class="'+valueClass+'">' + tvshow.runtime + '</span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_genre') + '</span><span class="'+valueClass+'">' + (tvshow.genre? tvshow.genre : mkf.lang.get('label_not_available')) + '</span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="'+valueClass+'"><div class="smallRating' + Math.round(tvshow.rating) + '"></div></span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_year') + '</span><span class="'+valueClass+'">' + (tvshow.year? tvshow.year : mkf.lang.get('label_not_available')) + '</span></div>' +
				//'<div class="test"><span class="label">' + mkf.lang.get('label_director') + '</span><span class="'+valueClass+'">' + tvshow.director + '</span></div>' +
				'<div class="test"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="'+valueClass+'">' + tvshow.file + '</span></div>' +
				'<p class="plot">' + tvshow.plot + '</p>';
			mkf.dialog.setContent(dialogHandle, dialogContent);

			return false;
		}; // END onTVShowInformationClick

		
		var onUnwatchedClick = function(e) {
			// open new page to show tv show's Unwatched
			var $unwatchedEpsContent = $('<div class="pageContentWrapper"></div>');
			var unwatchedEpsPage = mkf.pages.createTempPage(parentPage, {
				title: e.data.strTvShow,
				content: $unwatchedEpsContent
			});
			unwatchedEpsPage.setContextMenu(
				[
					{
						'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_season_list'), 'shortcut':'Ctrl+1', 'onClick':
						function() {
							mkf.pages.closeTempPage(unwatchedEpsPage);
							return false;
						}
					}
				]
			);
			mkf.pages.showTempPage(unwatchedEpsPage);

			// show tv show's Unwatched
			$unwatchedEpsContent.addClass('loading');
			//var isEmpty = true;
			xbmc.getunwatchedEps({
				tvshowid: e.data.idTvShow,

				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
					$unwatchedEpsContent.removeClass('loading');
				},

				onSuccess: function(result) {
					if (result.length == 0) {
					mkf.messageLog.show(mkf.lang.get('message_nounwatched'), mkf.messageLog.status.error, 5000);
					mkf.pages.closeTempPage(unwatchedEpsPage);
					return false;
					};
					$unwatchedEpsContent.defaultunwatchedEpsViewer(result, e.data.idTvShow, unwatchedEpsPage);
					$unwatchedEpsContent.removeClass('loading');

				}
			});

			return false;
		}; // END onUnwatchedClick
		
		
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
		var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
		var listview = mkf.cookieSettings.get('listview', 'no')=='yes'? true : false;
		var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;

		this.each(function() {
			var $tvshowContainer = $(this);
			if (listview) { var $tvShowList = $('<ul class="fileList"></ul>').appendTo($(this)); };
			var classEven = -1;

			if (tvShowResult.limits.total > 0) {
				$.each(tvShowResult.tvshows, function(i, tvshow) {
					var watched = false;
					
					if (tvshow.playcount > 0 && !filterShowWatched) {
						watched = true;
					}
					
					if (filterWatched && watched) {
						return;
					}
					
					//list view
					if (listview == true) {
						
								classEven += 1
								//list view
									$tvshow = $('<li' + (classEven%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' + 
										//'<a href="" class="season">' + mkf.lang.get('btn_seasons') + '</a>' +
										//'<a href="" class="info">' + mkf.lang.get('btn_information') + '</a>' +
										'<a href="" class="button info" title="' + mkf.lang.get('btn_information') + '"><span class="miniIcon information" /></a>' +
										'<a href="" class="button unwatched" title="' + mkf.lang.get('btn_unwatched') + '"><span class="miniIcon unwatched" /></a>' +
										'<a href="" class="tvshowName season">' + tvshow.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '<div class="findKeywords">' + tvshow.label.toLowerCase() + '</div>' +
										'</a></div></li>').appendTo($tvShowList);

							$tvshow.find('.season').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label}, onSeasonsClick);
							$tvshow.find('.info').bind('click', {'tvshow': tvshow}, onTVShowInformationClick);
							$tvshow.find('.unwatched').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label}, onUnwatchedClick);
					}	
			
					// end list view
					//banner view
					if (listview == false) {
						var thumb = (tvshow.thumbnail? xbmc.getThumbUrl(tvshow.thumbnail) : 'images/thumb' + xbmc.getTvShowThumbType() + '.png');
						var $tvshow = $('<div class="tvshow'+tvshow.tvshowid+' thumbWrapper thumb' + xbmc.getTvShowThumbType() + 'Wrapper">' +
								'<div class="linkTVWrapper">' + 
									'<a href="" class="season">' + mkf.lang.get('btn_seasons') + '</a>' +
									'<a href="" class="info">' + mkf.lang.get('btn_information') + '</a>' +
									'<a href="" class="unwatched">' + mkf.lang.get('btn_unwatched') + '</a>' +
								'</div>' +
								(useLazyLoad?
									'<img src="images/loading_thumb' + xbmc.getTvShowThumbType() + '.gif" alt="' + tvshow.label + '" class="thumb thumb' + xbmc.getTvShowThumbType() + '" original="' + thumb + '" />':
									'<img src="' + thumb + '" alt="' + tvshow.label + '" class="thumb thumb' + xbmc.getTvShowThumbType() + '" />'
								) +
								'<div class="tvshowName">' + tvshow.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
								'<div class="findKeywords">' + tvshow.label.toLowerCase() + '</div>' +
							'</div>')
							.appendTo($tvshowContainer);
						$tvshow.find('.season').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label}, onSeasonsClick);
						$tvshow.find('.info').bind('click', {'tvshow': tvshow}, onTVShowInformationClick);
						$tvshow.find('.unwatched').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label}, onUnwatchedClick);
					}
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

			//console.log(tvShowResult.tvshows.sort(function(a, b) {return b.year - a.year}));
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

			if (seasonsResult.limits.total > 0) {
				$.each(seasonsResult.seasons, function(i, season)  {
					var watched = false;
					var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
					var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
					
					if (season.playcount > 0 && !filterShowWatched) {
						watched = true;
					}
					
					if (filterWatched && watched) {
						return;
					}
					
					var $season = $('<li' + (i%2==0? ' class="even"': '') + '><div class="linkWrapper"> <a href="" class="season' + i + '">' + season.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</a></div></li>')
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
	 |  Video Scan
	 |
	 |  @param episodesResult
	\* ########################### */
	$.fn.defaultVideoScanViewer = function() {
		var onScanVideo = function() {
			xbmc.scanVideoLibrary({
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
				},

				onSuccess: function() {
					mkf.messageLog.show(mkf.lang.get('message_video_scan'), mkf.messageLog.status.success, 5000);
				}
			});
		};
		
		var onCleanVideo = function() {
			xbmc.cleanVideoLibrary({
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
				},

				onSuccess: function() {
					mkf.messageLog.show(mkf.lang.get('message_video_clean'), mkf.messageLog.status.success, 5000);
				}
			});
		};
		
		var onExportVideo = function() {
			xbmc.exportAudioLibrary({
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
				},

				onSuccess: function() {
					mkf.messageLog.show(mkf.lang.get('message_video_export'), mkf.messageLog.status.success, 5000);
				}
			});
		};
		
		var $scanVideoList = $('<div class="tools"><span class="tools toolsscan" title="' + mkf.lang.get('btn_scan') +
		'" /><span class="tools toolsclean" title="' + mkf.lang.get('btn_clean') +
		'" /><span class="tools toolsexport" title="' + mkf.lang.get('btn_export') +'" /></div><br />').appendTo($(this));
		$scanVideoList.find('.toolsscan').bind('click', onScanVideo);
		$scanVideoList.find('.toolsclean').bind('click', onCleanVideo);
		$scanVideoList.find('.toolsexport').bind('click', onExportVideo);
		
	}; // END defaultScanViewer
	
	/* ########################### *\
	 |  Music Scan
	 |
	 |  @param episodesResult
	\* ########################### */
	$.fn.defaultMusicScanViewer = function() {
		var onScanMusic = function() {
			xbmc.scanAudioLibrary({
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
				},

				onSuccess: function() {
					mkf.messageLog.show(mkf.lang.get('message_music_scan'), mkf.messageLog.status.success, 5000);
				}
			});
		};
		
		var onCleanMusic = function() {
			xbmc.cleanAudioLibrary({
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
				},

				onSuccess: function() {
					mkf.messageLog.show(mkf.lang.get('message_music_clean'), mkf.messageLog.status.success, 5000);
				}
			});
		};
		
		var onExportMusic = function() {
			xbmc.exportAudioLibrary({
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
				},

				onSuccess: function() {
					mkf.messageLog.show(mkf.lang.get('message_music_export'), mkf.messageLog.status.success, 5000);
				}
			});
		};
		
		var $scanMusicList = $('<div class="tools"><span class="tools toolsscan" title="' + mkf.lang.get('btn_scan') +
		'" /><span class="tools toolsclean" title="' + mkf.lang.get('btn_clean') +
		'" /><span class="tools toolsexport" title="' + mkf.lang.get('btn_export') +'" /></div><br />').appendTo($(this));
		$scanMusicList.find('.toolsscan').bind('click', onScanMusic);
		$scanMusicList.find('.toolsclean').bind('click', onCleanMusic);
		$scanMusicList.find('.toolsexport').bind('click', onExportMusic);
		
	}; // END defaultScanViewer
	
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

		var onEpisodeInfoClick = function(event) {
			var dialogHandle = mkf.dialog.show();
			var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;

			xbmc.getEpisodeDetails({
				episodeid: event.data.idEpisode,
				onSuccess: function(ep) {
					var dialogContent = '';
					
					var fileDownload = '';
					xbmc.getPrepDownload({
						path: ep.file,
						onSuccess: function(result) {
							fileDownload = xbmc.getUrl(result.details.path);
							// no better way?
							$('.movieinfo').find('a').attr('href',fileDownload);
						},
						onError: function(errorText) {
							$('.movieinfo').find('a').replaceWith(ep.file);
						},
					});

					var streamdetails = {
						vFormat: 'SD',
						vCodec: 'Unknown',
						aCodec: 'Unknown',
						channels: 0,
						aStreams: 0,
						hasSubs: false,
						aLang: '',
						aspect: 0,
						vwidth: 0
					};

					if (ep.streamdetails) {
						if (ep.streamdetails.subtitle) { streamdetails.hasSubs = true };
						if (ep.streamdetails.audio) {
							streamdetails.channels = ep.streamdetails.audio[0].channels;
							streamdetails.aStreams = ep.streamdetails.audio.length;
							$.each(ep.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
							if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('label_not_available') };
						};
					streamdetails.aspect = xbmc.getAspect(ep.streamdetails.video[0].aspect);
					//Get video standard
					streamdetails.vFormat = xbmc.getvFormat(ep.streamdetails.video[0].width);
					//Get video codec
					streamdetails.vCodec = xbmc.getVcodec(ep.streamdetails.video[0].codec);
					//Set audio icon
					streamdetails.aCodec = xbmc.getAcodec(ep.streamdetails.audio[0].codec);
					};
					
					if ( useFanart ) {
						$('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(ep.fanart) + '")');
					};	
					
					var thumb = (ep.thumbnail? xbmc.getThumbUrl(ep.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
					//dialogContent += '<img src="' + thumb + '" class="thumb thumb' + xbmc.getMovieThumbType() + ' dialogThumb" />' + //Won't this always be poster?!
					var dialogContent = $('<div><img src="' + thumb + '" class="thumbFanart dialogThumb" /></div>' +
						'<div><h1 class="underline">' + ep.title + '</h1></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_episode') + '</span><span class="value">' + (ep.episode? ep.episode : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_season') + '</span><span class="value">' + (ep.season? ep.season : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_runtime') + '</span><span class="value">' + (ep.runtime? ep.runtime : mkf.lang.get('label_not_available')) + '</span></div>' +						
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="value"><div class="smallRating' + Math.round(ep.rating) + '"></div></span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_votes') + '</span><span class="value">' + (ep.votes? ep.votes : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_firstaired') + '</span><span class="value">' + (ep.firstaired? ep.firstaired : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_lastplayed') + '</span><span class="value">' + (ep.lastplayed? ep.lastplayed : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_playcount') + '</span><span class="value">' + (ep.playcount? ep.playcount : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_audioStreams') + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + ep.file + '</a>' + '</span></div></div>' +
						'<p class="plot">' + ep.plot + '</p>' +
						'<div class="movietags"><span class="infoqueue" title="' + mkf.lang.get('btn_enqueue') + '" /><span class="infoplay" title="' + mkf.lang.get('btn_play') + '" /></div>');

					if (ep.streamdetails) {
						dialogContent.filter('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
						'<div class="aspect' + streamdetails.aspect + '" />' +
						'<div class="vCodec' + streamdetails.vCodec + '" />' +
						'<div class="aCodec' + streamdetails.aCodec + '" />' +
						'<div class="channels' + streamdetails.channels + '" />' +
						(streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
					};

					$(dialogContent).find('.infoplay').on('click', {idEpisode: ep.episodeid, strMovie: ep.label}, onEpisodePlayClick);
					$(dialogContent).find('.infoqueue').on('click', {idEpisode: ep.episodeid, strMovie: ep.label}, onAddEpisodeToPlaylistClick);
					mkf.dialog.setContent(dialogHandle, dialogContent);
					return false;
				},
				onError: function() {
					mkf.messageLog.show('Failed to load episode information!', mkf.messageLog.status.error, 5000);
					mkf.dialog.close(dialogHandle);
				}
			});
			return false;
		};
		
		
		this.each(function() {
			var $episodeList = $('<ul class="fileList"></ul>').appendTo($(this));

			if (episodesResult.limits.total > 0) {	
				$.each(episodesResult.episodes, function(i, episode)  {
					var watched = false;
					var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
					var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
					
					if (episode.playcount > 0 && !filterShowWatched) {
						watched = true;
					}
					
					if (filterWatched && watched) {
						return;
					}
					
					
					var $episode = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper episode' + episode.episodeid + '"> <a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a><a href="" class="button info" title="' + mkf.lang.get('btn_information') + '"><span class="miniIcon information" /></a><a href="" class="episode play">' + episode.episode + '. ' + episode.label + '' + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</a></div></li>').appendTo($episodeList);

					$episode.find('.play').bind('click', {idEpisode: episode.episodeid}, onEpisodePlayClick);
					$episode.find('.playlist').bind('click', {idEpisode: episode.episodeid}, onAddEpisodeToPlaylistClick);
					$episode.find('.information').bind('click', {idEpisode: episode.episodeid}, onEpisodeInfoClick);
				});
			}
		});
	}; // END defaultEpisodesViewer

	/* ########################### *\
	 |  Show unwatched episodes.
	 |
	 |  @param episodesResult
	\* ########################### */
	$.fn.defaultunwatchedEpsViewer = function(episodesResult) {
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

		var onEpisodeInfoClick = function(event) {
			var dialogHandle = mkf.dialog.show();
			var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;

			xbmc.getEpisodeDetails({
				episodeid: event.data.idEpisode,
				onSuccess: function(ep) {
					var dialogContent = '';
					
					var fileDownload = '';
					xbmc.getPrepDownload({
						path: ep.file,
						onSuccess: function(result) {
							fileDownload = xbmc.getUrl(result.details.path);
							// no better way?
							$('.movieinfo').find('a').attr('href',fileDownload);
						},
						onError: function(errorText) {
							$('.movieinfo').find('a').replaceWith(ep.file);
						},
					});

					var streamdetails = {
						vFormat: 'SD',
						vCodec: 'Unknown',
						aCodec: 'Unknown',
						channels: 0,
						aStreams: 0,
						hasSubs: false,
						aLang: '',
						aspect: 0,
						vwidth: 0
					};

					if (ep.streamdetails) {
						if (ep.streamdetails.subtitle) { streamdetails.hasSubs = true };
						if (ep.streamdetails.audio) {
							streamdetails.channels = ep.streamdetails.audio[0].channels;
							streamdetails.aStreams = ep.streamdetails.audio.length;
							$.each(ep.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
							if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('label_not_available') };
						};
					streamdetails.aspect = xbmc.getAspect(ep.streamdetails.video[0].aspect);
					//Get video standard
					streamdetails.vFormat = xbmc.getvFormat(ep.streamdetails.video[0].width);
					//Get video codec
					streamdetails.vCodec = xbmc.getVcodec(ep.streamdetails.video[0].codec);
					//Set audio icon
					streamdetails.aCodec = xbmc.getAcodec(ep.streamdetails.audio[0].codec);
					};
					
					if ( useFanart ) {
						$('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(ep.fanart) + '")');
					};	
					
					var thumb = (ep.thumbnail? xbmc.getThumbUrl(ep.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
					//dialogContent += '<img src="' + thumb + '" class="thumb thumb' + xbmc.getMovieThumbType() + ' dialogThumb" />' + //Won't this always be poster?!
					var dialogContent = $('<div><img src="' + thumb + '" class="thumbFanart dialogThumb" /></div>' +
						'<div><h1 class="underline">' + ep.title + '</h1></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_episode') + '</span><span class="value">' + (ep.episode? ep.episode : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_season') + '</span><span class="value">' + (ep.season? ep.season : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_runtime') + '</span><span class="value">' + (ep.runtime? ep.runtime : mkf.lang.get('label_not_available')) + '</span></div>' +						
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="value"><div class="smallRating' + Math.round(ep.rating) + '"></div></span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_votes') + '</span><span class="value">' + (ep.votes? ep.votes : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_firstaired') + '</span><span class="value">' + (ep.firstaired? ep.firstaired : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_lastplayed') + '</span><span class="value">' + (ep.lastplayed? ep.lastplayed : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_playcount') + '</span><span class="value">' + (ep.playcount? ep.playcount : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_audioStreams') + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + ep.file + '</a>' + '</span></div></div>' +
						'<p class="plot">' + ep.plot + '</p>' +
						'<div class="movietags"><span class="infoqueue" title="' + mkf.lang.get('btn_enqueue') + '" /><span class="infoplay" title="' + mkf.lang.get('btn_play') + '" /></div>');

					if (ep.streamdetails) {
						dialogContent.filter('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
						'<div class="aspect' + streamdetails.aspect + '" />' +
						'<div class="vCodec' + streamdetails.vCodec + '" />' +
						'<div class="aCodec' + streamdetails.aCodec + '" />' +
						'<div class="channels' + streamdetails.channels + '" />' +
						(streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
					};

					$(dialogContent).find('.infoplay').on('click', {idEpisode: ep.episodeid, strMovie: ep.label}, onEpisodePlayClick);
					$(dialogContent).find('.infoqueue').on('click', {idEpisode: ep.episodeid, strMovie: ep.label}, onAddEpisodeToPlaylistClick);
					mkf.dialog.setContent(dialogHandle, dialogContent);
					return false;
				},
				onError: function() {
					mkf.messageLog.show('Failed to load episode information!', mkf.messageLog.status.error, 5000);
					mkf.dialog.close(dialogHandle);
				}
			});
			return false;
		};
		
		//isEmpty = true;
		
		this.each(function() {
			var $episodeList = $('<ul class="fileList"></ul>').appendTo($(this));
				$.each(episodesResult, function(i, episode)  {
					var $episode = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper episode' + episode.episodeid + '"> <a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + 
					'"><span class="miniIcon enqueue" /></a><a href="" class="button info" title="' + mkf.lang.get('btn_information') + '"><span class="miniIcon information" /></a><a href="" class="episode play">' +
					//var $episode = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper episode' + episode.episodeid + '">' +
					//'<span class="miniIcon information"><a href="" class="button info" title="' + mkf.lang.get('btn_information') + '"></a></span><a href="" class="episode play">' + 
					'S' + episode.season + 'E' + episode.episode + '. ' + episode.label + '</a></div></li>').appendTo($episodeList);

					$episode.find('.play').bind('click', {idEpisode: episode.episodeid}, onEpisodePlayClick);
					$episode.find('.playlist').bind('click', {idEpisode: episode.episodeid}, onAddEpisodeToPlaylistClick);
					$episode.find('.information').bind('click', {idEpisode: episode.episodeid}, onEpisodeInfoClick);
				});

		});

	}; // END defaultunwatchedEpsViewer
	
	
	/* ########################### *\
	 |  Show Recently Added episodes.
	 |
	 |  @param episodesResult
	\* ########################### */
	$.fn.defaultRecentlyAddedEpisodesViewer = function(episodesResult, parentPage) {
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

		var onShowClick = function(e) {
			// open new page to show tv show's seasons
			var $unwatchedEpsContent = $('<div class="pageContentWrapper"></div>');
			var unwatchedEpsPage = mkf.pages.createTempPage(parentPage, {
				title: e.data.strTvShow,
				content: $unwatchedEpsContent
			});
			unwatchedEpsPage.setContextMenu(
				[
					{
						'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_season_list'), 'shortcut':'Ctrl+1', 'onClick':
						function() {
							mkf.pages.closeTempPage(unwatchedEpsPage);
							return false;
						}
					}
				]
			);
			mkf.pages.showTempPage(unwatchedEpsPage);

			// show tv show's seasons
			$unwatchedEpsContent.addClass('loading');
			xbmc.getunwatchedEps({
				tvshowid: e.data.idTvShow,

				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
					$unwatchedEpsContent.removeClass('loading');
				},

				onSuccess: function(result) {
					if (result.length == 0) {
					mkf.messageLog.show(mkf.lang.get('message_nounwatched'), mkf.messageLog.status.error, 5000);
					mkf.pages.closeTempPage(unwatchedEpsPage);
					return false;
					};
					$unwatchedEpsContent.defaultunwatchedEpsViewer(result, e.data.idTvShow, unwatchedEpsPage);
					$unwatchedEpsContent.removeClass('loading');
				}
			});

			return false;
		}; // END onSeasonsClick
		
		this.each(function() {
			var $episodeList = $('<ul class="RecentfileList"></ul>').appendTo($(this));
			if (episodesResult.limits.total > 0) {	
				$.each(episodesResult.episodes, function(i, episode)  {
					var watched = false;
					//var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
					var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
					
					if (episode.playcount > 0 && !filterShowWatched) {
						watched = true;
					}
					
					var thumb = (episode.thumbnail? xbmc.getThumbUrl(episode.thumbnail) : 'images/thumb.png');
					/*if (filterWatched && watched) {
						return;
					}*/
					
					//var $episode = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper episode' + episode.episodeid + '"> <a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a><a href="" class="episode play"><table><tr><td width="500">' + episode.episode + '. ' + episode.label + '</td><td>' + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</td></tr></table></a></div></li>').appendTo($episodeList);
					/*var $episode = $('<li' + '><table><tr><td>' + 
					'<div class="recentTVenq episode' + episode.episodeid + '"> <a href="" class="button playlist recentTVplay" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a></div>' + 
					'</td><td><div class="recentTVthumb"><img src="' + thumb + '" alt="' + episode.label + '" class="thumbFanart episode play" /></div>' + 
					'</td><td class="recentTVshow"><div class="recentTVshow">' + episode.showtitle + (watched? '<img src="images/OverlayWatched_Small.png" class="epWatched" />' : '') + '</div><div style="font-size: 120%;">Season: ' + episode.season + ' - Episode: ' +episode.episode + '</div><div class="recentTVtitle">' + episode.label + '</div><div>' + episode.plot + '</div></td></tr></table></li>').appendTo($episodeList);
*/
					var $episode = $('<li><div class="recentTVshow">' + 
					'<div class="recentTVenq episode' + episode.episodeid + '"> <a href="" class="button playlist recentTVplay" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a></div>' + 
					'<div class="recentTVthumb"><img src="' + thumb + '" alt="' + episode.label + '" class="thumbFanart episode play" /></div>' + 
					'<div class="recentTVshowName unwatchedEps" title="' + mkf.lang.get('btn_unwatched') + '">' + episode.showtitle + (watched? '<img src="images/OverlayWatched_Small.png" class="epWatched" />' : '') + 
					'</div><div class="recentTVshowSE">Season: ' + episode.season + ' - Episode: ' +episode.episode + 
					'</div><div class="recentTVtitle">' + episode.label + '</div><div class="recentTVplot">' + episode.plot + '</div></div></li>').appendTo($episodeList);
					
					$episode.find('.play').bind('click', {idEpisode: episode.episodeid}, onEpisodePlayClick);
					$episode.find('.playlist').bind('click', {idEpisode: episode.episodeid}, onAddEpisodeToPlaylistClick);
					$episode.find('.unwatchedEps').bind('click', {idTvShow: episode.tvshowid, strTvShow: episode.showtitle}, onShowClick);
				});
			}
		});
	}; // END defaultRecentlyAddedEpisodesViewer
	
	/* ########################### *\
	 |  Show video playlists.
	 |
	 |  @param MusicPlaylistsResult		Result of Files.GetDirectory.
	 |  @param parentPage		Page which is used as parent for new sub pages.
	\* ########################### */
	$.fn.defaultVideoPlaylistsViewer = function(VideoPlaylistsResult, parentPage) {
		var onVideoPlaylistsClick = function(e) {
		
			if (e.data.strType =='episode') {
				var dialogHandle = mkf.dialog.show();
				var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;

				xbmc.getEpisodeDetails({
					episodeid: e.data.id,
					onSuccess: function(ep) {
						var dialogContent = '';
						
						var fileDownload = '';
						xbmc.getPrepDownload({
							path: ep.file,
							onSuccess: function(result) {
								fileDownload = xbmc.getUrl(result.details.path);
								// no better way?
								$('.movieinfo').find('a').attr('href',fileDownload);
							},
							onError: function(errorText) {
								$('.movieinfo').find('a').replaceWith(ep.file);
							},
						});

						var streamdetails = {
							vFormat: 'SD',
							vCodec: 'Unknown',
							aCodec: 'Unknown',
							channels: 0,
							aStreams: 0,
							hasSubs: false,
							aLang: '',
							aspect: 0,
							vwidth: 0
						};

						if (ep.streamdetails) {
							if (ep.streamdetails.subtitle) { streamdetails.hasSubs = true };
							if (ep.streamdetails.audio) {
								streamdetails.channels = ep.streamdetails.audio[0].channels;
								streamdetails.aStreams = ep.streamdetails.audio.length;
								$.each(ep.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
								if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('label_not_available') };
							};
						streamdetails.aspect = xbmc.getAspect(ep.streamdetails.video[0].aspect);
						//Get video standard
						streamdetails.vFormat = xbmc.getvFormat(ep.streamdetails.video[0].width);
						//Get video codec
						streamdetails.vCodec = xbmc.getVcodec(ep.streamdetails.video[0].codec);
						//Set audio icon
						streamdetails.aCodec = xbmc.getAcodec(ep.streamdetails.audio[0].codec);
						};
						
						if ( useFanart ) {
							$('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(ep.fanart) + '")');
						};	
						
						var thumb = (ep.thumbnail? xbmc.getThumbUrl(ep.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
						//dialogContent += '<img src="' + thumb + '" class="thumb thumb' + xbmc.getMovieThumbType() + ' dialogThumb" />' + //Won't this always be poster?!
						var dialogContent = $('<div><img src="' + thumb + '" class="thumbFanart dialogThumb" /></div>' +
							'<div><h1 class="underline">' + ep.title + '</h1></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_episode') + '</span><span class="value">' + (ep.episode? ep.episode : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_season') + '</span><span class="value">' + (ep.season? ep.season : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_runtime') + '</span><span class="value">' + (ep.runtime? ep.runtime : mkf.lang.get('label_not_available')) + '</span></div>' +						
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="value"><div class="smallRating' + Math.round(ep.rating) + '"></div></span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_votes') + '</span><span class="value">' + (ep.votes? ep.votes : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_firstaired') + '</span><span class="value">' + (ep.firstaired? ep.firstaired : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_lastplayed') + '</span><span class="value">' + (ep.lastplayed? ep.lastplayed : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_playcount') + '</span><span class="value">' + (ep.playcount? ep.playcount : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_audioStreams') + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + ep.file + '</a>' + '</span></div></div>' +
							'<p class="plot">' + ep.plot + '</p>' +
							'<div class="movietags"></div>');

						if (ep.streamdetails) {
							dialogContent.filter('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
							'<div class="aspect' + streamdetails.aspect + '" />' +
							'<div class="vCodec' + streamdetails.vCodec + '" />' +
							'<div class="aCodec' + streamdetails.aCodec + '" />' +
							'<div class="channels' + streamdetails.channels + '" />' +
							(streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
						};

						//$(dialogContent).find('.infoplay').on('click', {idEpisode: ep.episodeid, strMovie: ep.label}, onEpisodePlayClick);
						//$(dialogContent).find('.infoqueue').on('click', {idEpisode: ep.episodeid, strMovie: ep.label}, onAddEpisodeToPlaylistClick);
						mkf.dialog.setContent(dialogHandle, dialogContent);
						return false;
					},
					onError: function() {
						mkf.messageLog.show('Failed to load episode information!', mkf.messageLog.status.error, 5000);
						mkf.dialog.close(dialogHandle);
					}
				});
				return false;
			} else if (e.data.strType == 'movie') {
				var dialogHandle = mkf.dialog.show();
				var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
				
				xbmc.getMovieInfo({
					movieid: e.data.id,
					onSuccess: function(movie) {
						//var dialogContent = '';
						var fileDownload = '';
						
						xbmc.getPrepDownload({
							path: movie.file,
							onSuccess: function(result) {
								fileDownload = xbmc.getUrl(result.details.path);
								// no better way?
								$('.movieinfo').find('a').attr('href',fileDownload);
							},
							onError: function(errorText) {
								$('.movieinfo').find('a').replaceWith(movie.file);
							},
						});
						
						var streamdetails = {
							vFormat: 'SD',
							vCodec: 'Unknown',
							aCodec: 'Unknown',
							channels: 0,
							aStreams: 0,
							hasSubs: false,
							aLang: '',
							aspect: 0,
							vwidth: 0
						};
						
						if ( useFanart ) {
							$('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(movie.fanart) + '")');
						};
						
						if (movie.streamdetails) {
							if (movie.streamdetails.subtitle) { streamdetails.hasSubs = true };
							if (movie.streamdetails.audio) {
								streamdetails.channels = movie.streamdetails.audio[0].channels;
								streamdetails.aStreams = movie.streamdetails.audio.length;
								$.each(movie.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
								if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('label_not_available') };
							};
						streamdetails.aspect = xbmc.getAspect(movie.streamdetails.video[0].aspect);
						//Get video standard
						streamdetails.vFormat = xbmc.getvFormat(movie.streamdetails.video[0].width);
						//Get video codec
						streamdetails.vCodec = xbmc.getVcodec(movie.streamdetails.video[0].codec);
						//Set audio icon
						streamdetails.aCodec = xbmc.getAcodec(movie.streamdetails.audio[0].codec);
						};
						
						var thumb = (movie.thumbnail? xbmc.getThumbUrl(movie.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
						//dialogContent += '<img src="' + thumb + '" class="thumb thumb' + xbmc.getMovieThumbType() + ' dialogThumb" />' + //Won't this always be poster?!
						var dialogContent = $('<div><img src="' + thumb + '" class="thumb thumbPosterLarge dialogThumb" /></div>' +
							'<div><h1 class="underline">' + movie.title + '</h1></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_original_title') + '</span><span class="value">' + (movie.originaltitle? movie.originaltitle : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_runtime') + '</span><span class="value">' + (movie.runtime? movie.runtime : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_genre') + '</span><span class="value">' + (movie.genre? movie.genre : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="value"><div class="smallRating' + Math.round(movie.rating) + '"></div></span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_votes') + '</span><span class="value">' + (movie.votes? movie.votes : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_year') + '</span><span class="value">' + (movie.year? movie.year : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_director') + '</span><span class="value">' + (movie.director? movie.director : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_writer') + '</span><span class="value">' + (movie.writer? movie.writer : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_studio') + '</span><span class="value">' + (movie.studio? movie.studio : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_tagline') + '</span><span class="value">' + (movie.tagline? movie.tagline : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_set') + '</span><span class="value">' + (movie.set[0]? movie.set : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_lastplayed') + '</span><span class="value">' + (movie.lastplayed? movie.lastplayed : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_playcount') + '</span><span class="value">' + (movie.playcount? movie.playcount : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_audioStreams') + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('label_not_available')) + '</span></div>' +
							'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + movie.file + '</a>' + '</span></div></div>' +
							'<p class="plot">' + movie.plot + '</p>' +
							'<div class="movietags"></div>');

						if (movie.streamdetails) {
							dialogContent.filter('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
							'<div class="aspect' + streamdetails.aspect + '" />' +
							'<div class="vCodec' + streamdetails.vCodec + '" />' +
							'<div class="aCodec' + streamdetails.aCodec + '" />' +
							'<div class="channels' + streamdetails.channels + '" />' +
							(streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
						};

						//$(dialogContent).find('.infoplay').on('click', {idMovie: movie.movieid, strMovie: movie.label}, onMoviePlayClick);
						//$(dialogContent).find('.infoqueue').on('click', {idMovie: movie.movieid, strMovie: movie.label}, onAddMovieToPlaylistClick);
						mkf.dialog.setContent(dialogHandle, dialogContent);
						return false;
					},
					onError: function() {
						mkf.messageLog.show('Failed to load movie information!', mkf.messageLog.status.error, 5000);
						mkf.dialog.close(dialogHandle);
					}
				});
				return false;
			} else {
				// open new page to show playlist item
				var $VideoPlaylistsContent = $('<div class="pageContentWrapper"></div>');
				var VideoPlaylistsPage = mkf.pages.createTempPage(parentPage, {
					title: e.data.strLabel,
					content: $VideoPlaylistsContent
				});
				VideoPlaylistsPage.setContextMenu(
					[
						{
							'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_album_list'), 'shortcut':'Ctrl+1', 'onClick':
							function() {
								mkf.pages.closeTempPage(VideoPlaylistsPage);
								return false;
							}
						}
					]
				);
				mkf.pages.showTempPage(VideoPlaylistsPage);

				
				// list playlist or album
				$VideoPlaylistsContent.addClass('loading');
				xbmc.getDirectory({
					directory: e.data.strFile,
					isPlaylist: true,
					media: 'video',

					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
						$VideoPlaylistsContent.removeClass('loading');
					},

					onSuccess: function(result) {
						$VideoPlaylistsContent.defaultVideoPlaylistsViewer(result, VideoPlaylistsPage);
						$VideoPlaylistsContent.removeClass('loading');
					}
				});
			};
			return false;
		}; // END onVideoPlaylistsClick
		
		var onPlaylistsPlayClick = function(e) {
			//console.log(e.data);
			xbmc.clearVideoPlaylist({
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
					//$VideoPlaylistsContent.removeClass('loading');
				},
				onSuccess: function() {
					//console.log(e.data.playlistinfo);
					onAddPlaylistToPlaylistClick(e);
					xbmc.playVideo({
						onError: function() {
							mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
							//$MusicPlaylistsContent.removeClass('loading');
						},
						onSuccess: function() {
							mkf.messageLog.show(mkf.lang.get('message_playing_item'), mkf.messageLog.status.success, 2000);
						}
					});
				}
			});
			return false;
		};
		
		var onAddPlaylistToPlaylistClick = function(e) {
			//console.log(e.data.playlistinfo);
			var isSmart = false;
			if (e.data.playlistinfo.file.search(/\.xsp/i) !=-1) { isSmart = true; };
			//console.log(e.data.playlistinfo.file.search(/\.xsp/i));
			//console.log(isSmart);
			if (e.data.playlistinfo.type == 'unknown' && isSmart == true) {
				//unknown and .xsp so should be a smart playlist
				xbmc.getDirectory({
					directory: e.data.playlistinfo.file,
					isPlaylist: true,
					media: 'video',
					
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
						$VideoPlaylistsContent.removeClass('loading');
					},

					onSuccess: function(result) {
						//parse playlist
						//console.log('in smart');
						Sn = 1;
						An = 1;
						Mn = 1;
						Tn = 1;
						$.each(result.files, function(i, file) {
							//console.log(file);
							if (file.type == 'album') {
								//add to playlist by albumid, returned as id
								if (An == 1) { var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_album_to_playlist')); };
								An ++;
								xbmc.addAlbumToPlaylist({
									albumid: file.id,
									async: true,
									
									onSuccess: function() {
										mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
									},
									onError: function(errorText) {
										mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
									}
								});
							} else if (file.type == 'song') {
								//add to playlist by songid, returned as id
								
								//console.log(n);
								if (Sn == 1) { var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_song_to_playlist')); };
								Sn ++;
								xbmc.addSongToPlaylist({
									songid: file.id,
									// async false required to add in playlist order
									async: true,
									
									onSuccess: function() {
										mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
									},
									onError: function(errorText) {
										mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
									}
								});
							} else if (file.type == 'movie') {
								//add to playlist by movieid, returned as id
								if (Mn == 1) { var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_movie_to_playlist')); };
								Mn ++;
								xbmc.addMovieToPlaylist({
									movieid: file.id,
									async: true,
									
									onSuccess: function() {
										mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
									},
									onError: function(errorText) {
										mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
									}
								});
							} else if (file.type == 'episode') {
								//add to playlist by movieid, returned as id
								if (Tn == 1) { var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_episode_to_playlist')); };
								Tn ++;
								xbmc.addEpisodeToPlaylist({
									episodeid: file.id,
									async: true,
									
									onSuccess: function() {
										mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
									},
									onError: function(errorText) {
										mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
									}
								});
							} else if (file.filetype == 'directory') {
								//assume TV show and descend to add episodes
								// async false required to add in playlist order
								if (Tn == 1) { var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_episode_to_playlist')); };
								Tn ++;
								xbmc.getDirectory({
									directory: file.file,
									isPlaylist: true,
									media: 'video',
									
									onError: function() {
										mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
										$VideoPlaylistsContent.removeClass('loading');
									},

									onSuccess: function(result) {
										//var Dn = 1;
										$.each(result.files, function(i, dirfile) {
											if (dirfile.type != 'episode') { return; };
											xbmc.addEpisodeToPlaylist({
												episodeid: dirfile.id,
												async: false,
												
												onSuccess: function() {
													/*console.log(Dn);
													if (Dn == 1) {
														mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
														Dn ++;
													}*/
												},
												onError: function(errorText) {
													mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
												}
											});
										});									
									}
								});
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
							} else {
								//it's not any of those, error
								//console.log('else error: ' + file.filetype);
								mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
							};
						});
					}
				});
			};
			
			/*if (file.type == 'directory') {
				//assume TV show and descend to add episodes
				console.log('isDir');
				if (Tn == 1) { var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_episode_to_playlist')); };
				Tn ++;
				xbmc.getDirectory({
					directory: file.directory,
					isPlaylist: true,
					media: 'video',
					
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
						$VideoPlaylistsContent.removeClass('loading');
					},

					onSuccess: function(result) {
						console.log(result);
						xbmc.addEpisodeToPlaylist({
							episodeid: result.,
							async: false,
							
							onSuccess: function() {
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
							},
							onError: function(errorText) {
								mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
							}
						});
					}
				});
			};*/
			
			//should be normal playlist. m3u only? Can use playlist.add directory addAudioFolderToPlaylist
			if (!isSmart && e.data.playlistinfo.type == 'unknown') {
				var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_album_to_playlist'));
				xbmc.addVideoFolderToPlaylist({
					folder: e.data.playlistinfo.file,
					
					onSuccess: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					},
					onError: function(errorText) {
						mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
					}
				});
			};
			
			if (!isSmart && e.data.playlistinfo.type == 'album') {
				var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_album_to_playlist'));
				xbmc.addAlbumToPlaylist({
					albumid: e.data.playlistinfo.id,
					onSuccess: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					},
					onError: function(errorText) {
						mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
					}
				});
			};
			
			if (!isSmart && e.data.playlistinfo.type == 'song') {
				var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_song_to_playlist'));
				xbmc.addSongToPlaylist({
					songid: e.data.playlistinfo.id,
					async: true,
					
					onSuccess: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					},
					onError: function(errorText) {
						mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
					}
				});			
			};
			
			if (!isSmart && e.data.playlistinfo.type == 'movie') {
				//add to playlist by movieid, returned as id
				var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_movie_to_playlist'));
				xbmc.addMovieToPlaylist({
					movieid: e.data.playlistinfo.id,
					async: true,
					
					onSuccess: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					},
					onError: function(errorText) {
						mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
					}
				});
			};
			
			if (!isSmart && e.data.playlistinfo.type == 'episode') {
				//add to playlist by episodeid, returned as id
				var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_episode_to_playlist'));
				xbmc.addEpisodeToPlaylist({
					episodeid: e.data.playlistinfo.id,
					async: true,
					
					onSuccess: function() {
						mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					},
					onError: function(errorText) {
						mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
					}
				});
			};
			//is an album? Throw to addAlbumToPlaylist
				/*if (e.data.playlistinfo.type == 'video') {
					var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_album_to_playlist'));
					xbmc.addAVideoToPlaylist({
						videoid: e.data.playlistinfo.id,
						onSuccess: function() {
							mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
						},
						onError: function(errorText) {
							mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
						}
					});
				};
				
				if (e.data.playlistinfo.type == 'song') {
					//add to playlist by songid, returned as id
					var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_song_to_playlist'));
					xbmc.addSongToPlaylist({
						songid: e.data.playlistinfo.id,
						async: true,
						
						onSuccess: function() {
							mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
						},
						onError: function(errorText) {
							mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
						}
					});
				};*/
			
			/*var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_album_to_playlist'));
			xbmc.addAlbumToPlaylist({
				albumid: event.data.idAlbum,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});*/
			return false;
		};
		
		// no artists?
		if (!VideoPlaylistsResult || !VideoPlaylistsResult.files) {
			return;
		};

		//console.log(MusicPlaylistsResult);
		this.each (function() {
			var VideoPlaylistsList = $('<ul class="fileList"></ul>').appendTo($(this));

			if (VideoPlaylistsResult.limits.total > 0) {
				$.each(VideoPlaylistsResult.files, function(i, playlist)  {
					if (playlist.label.search('extrafanart') != -1) { return; };
					VideoPlaylistsList.append('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' +
										'<a href="" class="button playlistinfo' + i +'" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' +
										'<a href="" class="button play' + i + '" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' +
										'<a href="" class="playlist' + i + '">' + playlist.label + ' - Type: ' + 
										(playlist.type == 'unknown' ? 'Playlist' : playlist.type) + '<div class="findKeywords">' + playlist.label.toLowerCase() + '</div>' +
										'</a></div></li>');
					VideoPlaylistsList.find('.playlist' + i)
						.bind('click',
							{
								id: playlist.id,
								strFile: playlist.file,
								strLabel: playlist.label,
								strType: playlist.type
							},
							onVideoPlaylistsClick);
					VideoPlaylistsList.find('.playlistinfo' + i).bind('click', {playlistinfo: playlist}, onAddPlaylistToPlaylistClick);
					VideoPlaylistsList.find('.play' + i).bind('click', {playlistinfo: playlist}, onPlaylistsPlayClick);
				});
			}
		});
	}; // END defaultVideoPlaylistsViewer

	
	/* ########################### *\
	 |  Show filesystem.
	 |
	 |  @param mediaType	Media-Type to show. (Either 'Audio' or 'Video')
	\* ########################### */
	$.fn.defaultFilesystemViewer = function(mediaType, parentPage, folder) {
		var media = 'music';
		if (mediaType === 'Video') {
			media = 'video';
		}

		var onFilePlayClick = function(event) {
			var isFolder = false;

			if (event.data.isFolder)
				isFolder = true;

			if (isFolder) {
				var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_folder'));

				var fn = 'playVideoFolder';
				if (media == 'music') {
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
				if (media == 'music') {
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
				if (media == 'music') {
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
				if (media == 'music') {
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
						//var folders = result.directories;
						var folders = result.files;
						var files = result.files;

						if (folders) {
							$.each(folders, function(i, folder)  {
								if (!folder.file.startsWith('addons://') && folder.filetype == "directory") {
									var $folder = $('<li' + (globalI%2==0? ' class="even"': '') + '>' + 
										'<div class="folderLinkWrapper folder' + i + '">' + 
										'<a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' + 
										'<a href="" class="button play" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' + 
										'<a href="" class="folder cd">' + folder.label + '/</a>' + '<div class="findKeywords">' + folder.label.toLowerCase() + '</div>' +
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
								if (!file.file.startsWith('addons://') && file.filetype == "file") {
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
						if (!result.sources) {
							return;
						}
						$.each(result.sources, function(i, share)  {
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
					//directory: '/mnt/media/music/',

					onSuccess: function(result) {
						var $file = $('<li' + (globalI%2==0? ' class="even"': '') + '><a href="" class="fileMedia"> /media</a></li>').appendTo($filelist);
						$file.bind('click', {folder: {name:'media', path:'/media/'}}, onFolderClick);
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
					
				} else if (status == 'off') {
					$currentlyPlayingBox.find('.statusRepeat1').remove();
					$currentlyPlayingBox.find('.statusRepeat').remove();
					
				} else if (status == 'all') {
					$currentlyPlayingBox.append('<span title="' + mkf.lang.get('label_repeat') + '" class="statusRepeat"></span>');
					
				} else if (status == 'one') {
					$currentlyPlayingBox.append('<span title="' + mkf.lang.get('label_repeat1') + '" class="statusRepeat1"></span>');
					$currentlyPlayingBox.find('.statusRepeat').remove();
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
					if (currentFile.showtitle) {
						thumbElement.removeAttr('width');
						thumbElement.attr('height', '100px');
					};
					//console.log(currentFile.thumbnail);
					//console.log(xbmc.getThumbUrl(currentFile.thumbnail.height()));
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
		/*if ($box.length) {
			// Box was already created
			$box.show();
			$box.find('input').focus();

		} else {*/
			// Box not yet created
			var $div = $('<div id="' + settings.id + '" class="findBox"><input type="text" /></div>')
				.appendTo($('body'))
				.css({'left': settings.left, 'top': settings.top});

			if ($div.width() + $div.position().left > $(window).width()) {
				$div.css({'left': settings.left-$div.width()});
			}
			var input = $div.find('input');

			function onInputContentChanged() {
				$(self).find('.findBoxTitle').remove();
				if (input.val()) {
					$(self).prepend('<h1 class="findBoxTitle">' + mkf.lang.get('label_search_results', [input.val()]) + '</h1>');
				}
				if (settings.searchItems == '.folderLinkWrapper' || settings.searchItems == 'a' ){
				$searchItems.parent().removeAttr("style");
				} else {
				$searchItems.removeAttr("style");
				}
				if (settings.searchItems == '.folderLinkWrapper' || settings.searchItems == 'a' ){
				$searchItems.not(":contains('" + input.val().toLowerCase() + "')").parent().hide();
				} else {
				$searchItems.not(":contains('" + input.val().toLowerCase() + "')").hide();
				}
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
		//}

		return false;
	}; // END defaultFindBox
})(jQuery);
