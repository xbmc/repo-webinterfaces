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
	$.fn.simcontrols = function() {
		$simpleControls = $('<a class="button play" href=""></a><a class="button stop" href=""></a>');
		$simpleControls.filter('.play').click(function() {
			xbmc.control({type: 'play'}); return false;
		});
		$simpleControls.filter('.stop').click(function() {
			xbmc.control({type: 'stop'}); return false;
		});
		
		this.each (function() {
			$(this).append($simpleControls.clone(true));
		});
	};
	
	$.fn.extraControls = function() {
		$controls = $('<div id="quick"><div id="quick_row1"><a class="button home" href="" title="' + mkf.lang.get('btn_home') + '"></a><a class="button up" href="" title="' + mkf.lang.get('btn_up') + '"></a><a class="button back" href="" title="' + mkf.lang.get('btn_back') + '"></a></div>' +
		'<div id="quick_row2"><a class="button left" href="" title="' + mkf.lang.get('btn_left') + '"></a><a class="button select" href="" title="' + mkf.lang.get('btn_select') + '"></a><a class="button right" href="" title="' + mkf.lang.get('btn_right') + '"></a></div>' +
		'<div id="quick_row3"><a class="button down" href="" title="' + mkf.lang.get('btn_down') + '"></a></div></div>' +
		'<div id="quick_con"><a class="button prev" href=""></a><a class="button next" href=""></a><a class="button shuffle" href="" title="' + mkf.lang.get('label_shuffle') + '"></a><a class="button repeat" href="" title="' + mkf.lang.get('label_repeat') + '"></a><a class="button mute" href="" title="' + mkf.lang.get('label_mute') + '"></a></div>');
		//'<a class="button volup" href="" title="' + mkf.lang.get('label_volup') + '"></a><a class="button voldown" href="" title="' + mkf.lang.get('label_voldown') + '"></a><a class="button mute" href="" title="' + mkf.lang.get('label_mute') + '"></a>');
		$controls.find('.left').click(function() {
			xbmc.input({type: 'Left', onError: 'failed'}); return false;
		});
		$controls.find('.right').click(function() {
			xbmc.input({type: 'Right', onError: 'failed'}); return false;
		});
		$controls.find('.up').click(function() {
			xbmc.input({type: 'Up', onError: 'failed'}); return false;
		});
		$controls.find('.down').click(function() {
			xbmc.input({type: 'Down', onError: 'failed'}); return false;
		});
		$controls.find('.back').click(function() {
			xbmc.input({type: 'Back', onError: 'failed'}); return false;
		});
		$controls.find('.home').click(function() {
			xbmc.input({type: 'Home', onError: 'failed'}); return false;
		});
		$controls.find('.select').click(function() {
			xbmc.input({type: 'Select', onError: 'failed'}); return false;
		});
		
		$controls.find('.play').click(function() {
			xbmc.control({type: 'play'}); return false;
		});
		$controls.find('.stop').click(function() {
			xbmc.control({type: 'stop'}); return false;
		});
		$controls.find('.next').click(function() {
			xbmc.control({type: 'next'}); return false;
		});
		$controls.find('.prev').click(function() {
			xbmc.control({type: 'prev'}); return false;
		});
		$controls.find('.mute').click(function() {
			xbmc.setMute(); return false;
		});
		var shuffle = function(event) {
			xbmc.control({type: (event.data.shuffle? 'shuffle': 'unshuffle')}); return false;
		};

		$controls.find('.shuffle').bind('click', {"shuffle": true}, shuffle);

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
		
		$controls.find('.repeat').bind('click', {"repeat": 'all' }, repeat);
		
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
	}; // END extraControls
	
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
			var timeout = mkf.cookieSettings.get('timeout', 20);
			var ui = mkf.cookieSettings.get('ui', 'uni');
			var oldui = mkf.cookieSettings.get('ui');
			var lang = mkf.cookieSettings.get('lang', 'en');
			var watched = mkf.cookieSettings.get('watched', 'no');
			var hidewatchedmark = mkf.cookieSettings.get('hidewatchedmark', 'no');
			var cinex = mkf.cookieSettings.get('cinex', 'no');
			var hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no');
			//var listview = mkf.cookieSettings.get('listview', 'no');
			var artistsView = mkf.cookieSettings.get('artistsView', 'list');
			var artistsPath = mkf.cookieSettings.get('artistsPath');
			var albumsView = mkf.cookieSettings.get('albumsView', 'cover');
			var albumsViewRec = mkf.cookieSettings.get('albumsViewRec', 'cover');
			var filmView = mkf.cookieSettings.get('filmView', 'poster');
			var filmViewRec = mkf.cookieSettings.get('filmViewRec', 'poster');
			var filmViewSets = mkf.cookieSettings.get('filmViewSets', 'poster');
			var TVView = mkf.cookieSettings.get('TVView', 'banner');
			var TVViewRec = mkf.cookieSettings.get('TVViewRec', 'infolist');
			var EpView = mkf.cookieSettings.get('EpView', 'listover');
			var usefanart = mkf.cookieSettings.get('usefanart', 'no');
			var filmSort = mkf.cookieSettings.get('filmSort', 'label');
			var TVSort = mkf.cookieSettings.get('TVSort', 'label');
			var EpSort = mkf.cookieSettings.get('EpSort', 'episode');
			var albumSort = mkf.cookieSettings.get('albumSort', 'album');
			var mdesc = mkf.cookieSettings.get('mdesc', 'no');
			var tvdesc = mkf.cookieSettings.get('tvdesc', 'no');
			var epdesc = mkf.cookieSettings.get('epdesc', 'no');
			var adesc = mkf.cookieSettings.get('adesc', 'no');
			var startPage = mkf.cookieSettings.get('startPage', 'recentTV');
			var showTags = mkf.cookieSettings.get('showTags', 'yes');

			var languages = '';
			$.each(mkf.lang.getLanguages(), function(key, val) {
				languages += '<option value="' + key + '"' + (lang==key? ' selected="selected"': '') + '>' + val.language + ' (by ' + val.author + ')</option>';
			});

			var dialogHandle = mkf.dialog.show(
				{
				content :
				'<h1 id="systemControlTitle" class="title">' + mkf.lang.get('title_settings') + '</h1>' +
				'<div class="tabs"><div id="tabs">' +
				'<ul><li><a href="#tabs-1">' + mkf.lang.get('group_tab_general') +'</a></li>' +
					'<li><a href="#tabs-2">' + mkf.lang.get('group_tab_views') +'</a></li>' +
					'<li><a href="#tabs-3">' + mkf.lang.get('group_tab_sort') +'</a></li></ul>' +
				'<div id="tabs-1">' +
				'<form name="settingsForm">' +
				'<fieldset class="ui_settings">' +
				'<legend>' + mkf.lang.get('group_ui') + '</legend>' +
				'<input type="radio" id="defaultUI" name="userinterface" value="default" ' + (ui=='default'? 'checked="checked"' : '') + '><label for="defaultUI">' + mkf.lang.get('label_default_ui') +'</label>' +
				'<input type="radio" id="lightUI" name="userinterface" value="light" ' + (ui=='light'? 'checked="checked"' : '') + '><label for="lightUI">Light UI</label>' +
				'<input type="radio" id="lightDarkUI" name="userinterface" value="lightDark" ' + (ui=='lightDark'? 'checked="checked"' : '') + '><label for="lightDarkUI">LightDark UI</label>' +
				'<input type="radio" id="uni" name="userinterface" value="uni" ' + (ui=='uni'? 'checked="checked"' : '') + '><label for="uni">Uni UI</label>' +
				'</fieldset>' +
				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_language') + '</legend>' +
				'<select name="lang" size="1">' + languages + '</select>' +
				'</fieldset>' +
				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_start_page') + '</legend>' +
				'<select id="startPage" name="startPage">' +
				'<option value="recentAlbums" ' + (startPage=='recentAlbums'? 'selected' : '') + '>' + mkf.lang.get('page_title_album_recent') + '</option>' +
				'<option value="recentTV" ' + (startPage=='recentTV'? 'selected' : '') + '>' + mkf.lang.get('page_title_tv_recentlyadded') + '</option>' +
				'<option value="recentMovies" ' + (startPage=='recentMovies'? 'selected' : '') + '>' + mkf.lang.get('page_title_movies_recentlyadded') + '</option>' +
				'<option value="movies"' + (startPage=='movies'? 'selected' : '') + '>' + mkf.lang.get('page_title_movies') + '</option>' +
				'<option value="tv"' + (startPage=='tv'? 'selected' : '') + '>' + mkf.lang.get('page_title_tvshows') + '</option>' +
				'<option value="albums"' + (startPage=='albums'? 'selected' : '') + '>' + mkf.lang.get('page_title_albums') + '</option>' +
				'<option value="artists"' + (startPage=='artists'? 'selected' : '') + '>' + mkf.lang.get('page_title_artist') + '</option>' +
				'<option value="musicPlaylist"' + (startPage=='musicPlaylist'? 'selected' : '') + '>' + mkf.lang.get('page_title_music') + ' ' + mkf.lang.get('page_title_music_playlist') + '</option>' +
				//'<option value="videoPlaylist"' + (startPage=='videoPlaylist'? 'selected' : '') + '>' + mkf.lang.get('label_view_singlelogo') + '</option>' +
				'</select>' +
				'</fieldset>' +
				

				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_expert') + '</legend>' +
				'<a href="" class="formButton expertHelp" title="' + mkf.lang.get('btn_title_help') + '">' + mkf.lang.get('btn_text_help') + '</a>' + 
				'<input type="checkbox" id="lazyload" name="lazyload" ' + (lazyload=='yes'? 'checked="checked"' : '') + '><label for="lazyload">' + mkf.lang.get('label_use_lazyload') + '</label>' +
				'<input type="checkbox" id="showTags" name="showTags" ' + (showTags=='yes'? 'checked="checked"' : '') + '><label for="showTags">' + mkf.lang.get('label_showTags') + '</label><br />' +
				'<label for="timeout">' + mkf.lang.get('label_timeout') + '</label><input type="text" id="timeout" name="timeout" value="' + timeout + '" maxlength="3" style="width: 30px; margin-top: 10px;"> ' + mkf.lang.get('label_seconds') +
				'</fieldset>' +
				'</form>' +
				'</div>' +
				'<div id="tabs-2">' +
				'<form name="settingsViews">' +
				
				//Artists
				'<fieldset>' +
				'<legend>' + mkf.lang.get('page_buttontext_artist') + '</legend>' +
				'<select id="artists" name="artistsView"><option value="cover" ' + (artistsView=='cover'? 'selected' : '') + '>' + mkf.lang.get('label_view_album_cover') +
				'</option><option value="list" ' + (artistsView=='list'? 'selected' : '') + '>' + mkf.lang.get('label_view_album_list') +
				'</option><option value="logo" ' + (artistsView=='logo'? 'selected' : '') + '>' + mkf.lang.get('label_view_logo') + '</option>' +
				'<option value="logosingle"' + (artistsView=='logosingle'? 'selected' : '') + '>' + mkf.lang.get('label_view_singlelogo') + '</option>' +
				//'<option value="none" ' + (filmView=='none'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_none') +'</option><option value="videorating" ' + (filmView=='videorating'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_videorating') +
				//'</option><option value="studio">' + mkf.lang.get('label_film_sort_studio') +'</option>
				'</select>' +
				'<input type="text" name="artists_path" id="artists_path" style="display: ' + (artistsView == 'logo' || artistsView == 'logosingle'? 'block' : 'none') + ';" />' +
				'</fieldset>' +
				
				'<fieldset class="ui_views">' +
				'<legend>' + mkf.lang.get('group_albums') + '</legend>' +
				'<select name="albumsView"><option value="cover" ' + (albumsView=='cover'? 'selected' : '') + '>' + mkf.lang.get('label_view_album_cover') +
				'</option><option value="list" ' + (albumsView=='list'? 'selected' : '') + '>' + mkf.lang.get('label_view_album_list') +
				'</option><option value="listin" ' + (albumsView=='listin'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_list_inline') + '</option>' +
				//'<option value="accordion"' + (albumsView=='accordion'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_accordion') + '</option>' +
				//'<option value="none" ' + (filmView=='none'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_none') +'</option><option value="videorating" ' + (filmView=='videorating'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_videorating') +
				//'</option><option value="studio">' + mkf.lang.get('label_film_sort_studio') +'</option>
				'</select>' +
				'</fieldset>' +
				
				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_albums_recent') + '</legend>' +
				'<select name="albumsViewRec"><option value="cover" ' + (albumsViewRec=='cover'? 'selected' : '') + '>' + mkf.lang.get('label_view_album_cover') +
				'</option><option value="list" ' + (albumsViewRec=='list'? 'selected' : '') + '>' + mkf.lang.get('label_view_album_list') +
				'</option><option value="listin" ' + (albumsViewRec=='listin'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_list_inline') + '</option>' +
				//'<option value="accordion"' + (albumsViewRec=='accordion'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_accordion') + '</option>' +
				//'<option value="none" ' + (filmView=='none'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_none') +'</option><option value="videorating" ' + (filmView=='videorating'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_videorating') +
				//'</option><option value="studio">' + mkf.lang.get('label_film_sort_studio') +'</option>
				'</select>' +
				'</fieldset>' +
				
				'<fieldset class="ui_views">' +
				'<legend>' + mkf.lang.get('group_film_sort') + '</legend>' +
				'<select name="filmView"><option value="poster" ' + (filmView=='poster'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_poster') +
				'</option><option value="listover" ' + (filmView=='listover'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_list_overlay') +
				'</option><option value="listin" ' + (filmView=='listin'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_list_inline') +'</option><option value="accordion"' + (filmView=='accordion'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_accordion') + '</option>' +
				'<option value="singlePoster" ' + (filmView=='singlePoster'? 'selected' : '') + '>' + mkf.lang.get('label_single_poster') +'</option>' +
				//'<option value="videorating" ' + (filmView=='videorating'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_videorating') +
				//'</option><option value="studio">' + mkf.lang.get('label_film_sort_studio') +'</option>
				'</select>' +
				'</fieldset>' +
				
				'<fieldset>' +
				'<legend>' + mkf.lang.get('page_title_moviesets') + '</legend>' +
				'<select name="filmViewSets"><option value="poster" ' + (filmViewSets=='poster'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_poster') +
				'</option><option value="listover" ' + (filmViewSets=='listover'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_list_overlay') + '</option>' +
				//'<option value="listin" ' + (filmViewSets=='listin'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_list_inline') +'</option><option value="accordion"' + (filmViewSets=='accordion'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_accordion') + '</option>' +
				//'<option value="none" ' + (filmViewSets=='none'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_none') +'</option><option value="videorating" ' + (filmViewRec=='videorating'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_videorating') +
				//'</option><option value="studio">' + mkf.lang.get('label_film_sort_studio') +'</option>
				'</select>' +
				'</fieldset>' +
				
				'<fieldset class="ui_views">' +
				'<legend>' + mkf.lang.get('group_film_recent') + '</legend>' +
				'<select name="filmViewRec"><option value="poster" ' + (filmViewRec=='poster'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_poster') +
				'</option><option value="listover" ' + (filmViewRec=='listover'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_list_overlay') +
				'</option><option value="listin" ' + (filmViewRec=='listin'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_list_inline') +
				'</option><option value="accordion"' + (filmViewRec=='accordion'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_accordion') + '</option>' +
				'<option value="singlePoster" ' + (filmViewRec=='singlePoster'? 'selected' : '') + '>' + mkf.lang.get('label_single_poster') +'</option>' +
				'</select>' +
				'</fieldset>' +
				
				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_tv') + '</legend>' +
				'<select name="TVView"><option value="banner" ' + (TVView=='banner'? 'selected' : '') + '>' + mkf.lang.get('label_view_tv_banner') +
				'</option><option value="listover" ' + (TVView=='listover'? 'selected' : '') + '>' + mkf.lang.get('label_view_tv_list_overlay') +
				'</option><option value="logo" ' + (TVView=='logo'? 'selected' : '') + '>' + mkf.lang.get('label_view_logo') + '</option>' +
				//<option value="accordion"' + (TVView=='accordion'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_accordion') + '</option>' +
				//'<option value="none" ' + (filmView=='none'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_none') +'</option><option value="videorating" ' + (filmView=='videorating'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_videorating') +
				//'</option><option value="studio">' + mkf.lang.get('label_film_sort_studio') +'</option>
				'</select>' +
				'</fieldset>' +
				
				'<fieldset class="ui_views">' +
				'<legend>' + mkf.lang.get('group_tv_recent') + '</legend>' +
				'<select name="TVViewRec"><option value="infolist" ' + (TVViewRec=='infolist'? 'selected' : '') + '>' + mkf.lang.get('label_view_tv_infolist') + '</option>' +
				//'<option value="listover" ' + (TVViewRec=='listover'? 'selected' : '') + '>' + mkf.lang.get('label_view_tv_list_overlay') +
				//'</option><option value="listin" ' + (TVViewRec=='listin'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_list_inline') +'</option><option value="accordion"' + (TVViewRec=='accordion'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_accordion') + '</option>' +
				//'<option value="none" ' + (filmView=='none'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_none') +'</option><option value="videorating" ' + (filmView=='videorating'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_videorating') +
				//'</option><option value="studio">' + mkf.lang.get('label_film_sort_studio') +'</option>
				'</select>' +
				'</fieldset>' +

				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_episodes') + '</legend>' +
				'<select name="EpView"><option value="listover" ' + (EpView=='listover'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_list_overlay') + '</option>' +
				'<option value="thumbnail" ' + (EpView=='thumbnail'? 'selected' : '') + '>' + mkf.lang.get('label_view_thumbnail') + '</option>' +
				//'<option value="listin" ' + (EpView=='listin'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_list_inline') +'</option><option value="accordion"' + (EpView=='accordion'? 'selected' : '') + '>' + mkf.lang.get('label_view_film_accordion') + '</option>' +
				//'<option value="none" ' + (EpView=='none'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_none') +'</option><option value="videorating" ' + (EpView=='videorating'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_videorating') +
				//'</option><option value="studio">' + mkf.lang.get('label_film_sort_studio') +'</option>
				'</select>' +
				'</fieldset>' +
				
				'<fieldset style="clear: left">' +
				'<legend>' + mkf.lang.get('group_view') + '</legend>' +
				//'<input type="checkbox" id="listview" name="listview" ' + (listview=='yes'? 'checked="checked"' : '') + '><label for="listview">' + mkf.lang.get('label_filter_listview') + '</label>' +
				'<input type="checkbox" id="usefanart" name="usefanart" ' + (usefanart=='yes'? 'checked="checked"' : '') + '><label for="usefanart">' + mkf.lang.get('label_use_fanart') + '</label>' +
				'<input type="checkbox" id="watched" name="watched" ' + (watched=='yes'? 'checked="checked"' : '') + '><label for="watched">' + mkf.lang.get('label_filter_watched') + '</label>' +
				'<input type="checkbox" id="hidewatchedmark" name="hidewatchedmark" ' + (hidewatchedmark=='yes'? 'checked="checked"' : '') + '><label for="hidewatchedmark">' + mkf.lang.get('label_filter_showwatched') + '</label>' +
				'<br /><input type="checkbox" id="hoverOrClick" name="hoverOrClick" ' + (hoverOrClick=='yes'? 'checked="checked"' : '') + '><label for="hoverOrClick">' + mkf.lang.get('label_hoverOrClick') + '</label>' +
				'<input type="checkbox" id="cinex" name="cinex" ' + (cinex=='yes'? 'checked="checked"' : '') + '><label for="cinex">' + mkf.lang.get('label_cinex') + '</label>' +
				'</fieldset>' +
				'<div class="formHint">' + mkf.lang.get('label_settings_warning') + '</div>' +
				'</form>' +
				'</div>' +
				/*---- Sorting ----*/
				'<div id="tabs-3">' +
				'<form name="settingsSorting">' +
				'<fieldset class="ui_albums">' +
				'<legend>' + mkf.lang.get('group_albums') + '</legend>' +
				'' + mkf.lang.get('settings_select_film_sort') +'<select name="albumSort"><option value="album" ' + (albumSort=='album'? 'selected' : '') + '>' + mkf.lang.get('label_album_sort_album') +
				'</option><option value="artist" ' + (albumSort=='artist'? 'selected' : '') + '>' + mkf.lang.get('label_album_sort_artist') +
				'</option><option value="year" ' + (albumSort=='year'? 'selected' : '') + '>' + mkf.lang.get('label_album_sort_year') +'</option><option value="genre"' + (albumSort=='genre'? 'selected' : '') + '>' + mkf.lang.get('label_album_sort_genre') +'</option>' +
				'<option value="none" ' + (albumSort=='none'? 'selected' : '') + '>' + mkf.lang.get('label_album_sort_none') +
				'</select>' +
				'<input type="checkbox" id="adesc" name="adesc" ' + (adesc=='descending'? 'checked="checked"' : '') + '><label for="adesc">' + mkf.lang.get('label_filter_mdesc') + '</label>' +
				'</fieldset>' +
				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_film_sort') + '</legend>' +
				'' + mkf.lang.get('settings_select_film_sort') +'<select name="filmSort"><option value="label" ' + (filmSort=='label'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_label') +
				'</option><option value="sorttitle" ' + (filmSort=='sorttitle'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_sorttitle') +
				'</option><option value="year" ' + (filmSort=='year'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_year') +'</option><option value="genre"' + (filmSort=='genre'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_genre') +'</option>' +
				'<option value="none" ' + (filmSort=='none'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_none') +'</option><option value="videorating" ' + (filmSort=='videorating'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_videorating') +
				'</option><option value="studio" ' + (filmSort=='studio'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_studio') +'</option></select>' +
				'<input type="checkbox" id="mdesc" name="mdesc" ' + (mdesc=='descending'? 'checked="checked"' : '') + '><label for="mdesc">' + mkf.lang.get('label_filter_mdesc') + '</label>' +
				'</fieldset>' +
				
				'<fieldset class="ui_views">' +
				'<legend>' + mkf.lang.get('group_tv') + '</legend>' +
				'' + mkf.lang.get('settings_select_film_sort') +'<select name="TVSort"><option value="label" ' + (TVSort=='label'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_label') +
				'</option>' +
				'</option><option value="year" ' + (TVSort=='year'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_year') +
				'</option><option value="genre"' + (TVSort=='genre'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_genre') +'</option>' +
				//'<option value="none" ' + (TVSort=='none'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_none') + '</option>'  +
				'<option value="videorating" ' + (TVSort=='videorating'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_videorating') +
				'</option><option value="episode" ' + (TVSort=='episode'? 'selected' : '') + '>' + mkf.lang.get('group_episodes') +'</option></select>' +
				'<input type="checkbox" id="tvdesc" name="tvdesc" ' + (tvdesc=='descending'? 'checked="checked"' : '') + '><label for="mdesc">' + mkf.lang.get('label_filter_mdesc') + '</label>' +
				'</fieldset>' +
				'<fieldset>' +
				'<legend>' + mkf.lang.get('group_episodes') + '</legend>' +
				'' + mkf.lang.get('settings_select_film_sort') +'<select name="EpSort"><option value="label" ' + (EpSort=='label'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_label') +
				'</option>' +
				//'</option><option value="year" ' + (EpSort=='year'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_year') +
				//'</option><option value="genre"' + (EpSort=='genre'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_genre') +'</option>' +
				'<option value="none" ' + (EpSort=='none'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_none') + '</option>'  +
				'<option value="videorating" ' + (EpSort=='videorating'? 'selected' : '') + '>' + mkf.lang.get('label_film_sort_videorating') +
				'</option><option value="episode" ' + (EpSort=='episode'? 'selected' : '') + '>' + mkf.lang.get('group_episodes') +'</option></select>' +
				'<input type="checkbox" id="epdesc" name="epdesc" ' + (epdesc=='descending'? 'checked="checked"' : '') + '><label for="mdesc">' + mkf.lang.get('label_filter_mdesc') + '</label>' +
				'</fieldset>' +
				
				'</form>' +
				'</div>' +
				'</div>' +
				'<a href="" class="formButton save">' + mkf.lang.get('btn_save') + '</a>' + 
				'<div class="formHint">' + mkf.lang.get('label_settings_hint') + '</div>' +
				'</div>'
				}
			);

			$('#artists').change(function() {
				$('#artists_path').css('display', ($(this).val() == 'logo' || $(this).val() == 'logosingle') ? 'block' : 'none');
			});
			
			
			if (artistsPath) { $('input#artists_path').val(artistsPath) };
			
			$( "#tabs" ).tabs({ selected: 0 });
			
			$('.expertHelp').click(function() {
				alert(mkf.lang.get('settings_help'));
				return false;
			});

			$('.save').click(function() {
				//Check artistsPath ends with a /
				if (document.settingsViews.artists_path.value.lastIndexOf("/") + 1 != document.settingsViews.artists_path.value.length) { document.settingsViews.artists_path.value += '/'; };
				// Checks require artist logo location as skins.
				if (document.settingsViews.artistsView.value == 'logo' && !document.settingsViews.artists_path.value || document.settingsViews.artistsView.value == 'logosingle' && !document.settingsViews.artists_path.value) {
					alert(mkf.lang.get('settings_select_artists_path'));
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
					} else if ( document.settingsForm.userinterface[3].checked == true) {
						ui = 'uni';
					} else {
						ui = 'uni';
					}
				mkf.cookieSettings.add('ui', ui);
				
				mkf.cookieSettings.add(
					'startPage',
					document.settingsForm.startPage.value
				);
				
				mkf.cookieSettings.add(
					'albumSort',
					document.settingsSorting.albumSort.value
				);	
				
				mkf.cookieSettings.add(
					'adesc',
					document.settingsSorting.adesc.checked? 'descending' : 'ascending'
				);
				
				mkf.cookieSettings.add(
					'artistsView',
					document.settingsViews.artistsView.value
				);
				
				mkf.cookieSettings.add(
					'artistsPath',
					document.settingsViews.artists_path.value
				);
				
				mkf.cookieSettings.add(
					'albumsView',
					document.settingsViews.albumsView.value
				);
				
				mkf.cookieSettings.add(
					'albumsViewRec',
					document.settingsViews.albumsViewRec.value
				);
				
				mkf.cookieSettings.add(
					'tvdesc',
					document.settingsSorting.tvdesc.checked? 'descending' : 'ascending'
				);
				
				mkf.cookieSettings.add(
					'TVSort',
					document.settingsSorting.TVSort.value
				);
				
				mkf.cookieSettings.add(
					'EpSort',
					document.settingsSorting.EpSort.value
				);
				
				mkf.cookieSettings.add(
					'epdesc',
					document.settingsSorting.epdesc.checked? 'descending' : 'ascending'
				);
				
				mkf.cookieSettings.add(
					'filmSort',
					document.settingsSorting.filmSort.value
				);
				
				mkf.cookieSettings.add(
					'mdesc',
					document.settingsSorting.mdesc.checked? 'descending' : 'ascending'
				);
				
				mkf.cookieSettings.add(
					'filmView',
					document.settingsViews.filmView.value
				);
				
				mkf.cookieSettings.add(
					'filmViewRec',
					document.settingsViews.filmViewRec.value
				);
				
				mkf.cookieSettings.add(
					'filmViewSets',
					document.settingsViews.filmViewSets.value
				);
				
				mkf.cookieSettings.add(
					'TVView',
					document.settingsViews.TVView.value
				);
				
				mkf.cookieSettings.add(
					'TVViewRec',
					document.settingsViews.TVViewRec.value
				);
				
				mkf.cookieSettings.add(
					'EpView',
					document.settingsViews.EpView.value
				);
				
				mkf.cookieSettings.add(
					'lazyload',
					document.settingsForm.lazyload.checked? 'yes' : 'no'
				);
				
				mkf.cookieSettings.add(
					'showTags',
					document.settingsForm.showTags.checked? 'yes' : 'no'
				);
								
				mkf.cookieSettings.add(
					'usefanart',
					document.settingsViews.usefanart.checked? 'yes' : 'no'
				);
				
				mkf.cookieSettings.add(
					'watched',
					document.settingsViews.watched.checked? 'yes' : 'no'
				);
				
				mkf.cookieSettings.add(
					'hidewatchedmark',
					document.settingsViews.hidewatchedmark.checked? 'yes' : 'no'
				);
				
				mkf.cookieSettings.add(
					'cinex',
					document.settingsViews.cinex.checked? 'yes' : 'no'
				);
				
				mkf.cookieSettings.add(
					'hoverOrClick',
					document.settingsViews.hoverOrClick.checked? 'yes' : 'no'
				);
				
				mkf.cookieSettings.add(
					'lang',
					document.settingsForm.lang.options[document.settingsForm.lang.selectedIndex].value
				);

				mkf.cookieSettings.add('timeout', timeout);

				if (oldui != ui) alert(mkf.lang.get('settings_need_to_reload_awx'));
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
	 |  Incrimental Volume Control
	\* ########################### */
	$.fn.incVolumeControl = function(options) {
		/*this.each (function() {
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
		});*/
	}; // END incVolumeControl
	

	/* ########################### *\
	 |  Show artists.
	 |
	 |  @param artistResult		Result of AudioLibrary.GetArtists.
	 |  @param parentPage		Page which is used as parent for new sub pages.
	\* ########################### */
	$.fn.defaultArtistsViewer = function(artistResult, parentPage) {

		if (!artistResult.limits.total > 0) { return };
		
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
		var view = mkf.cookieSettings.get('artistsView', 'list');
		var $artistsViewerElement = $(this);

		switch (view) {
			case 'list':
				uiviews.ArtistViewList(artistResult, parentPage).appendTo($artistsViewerElement);
				break;
			case 'cover':
				uiviews.ArtistViewThumbnails(artistResult, parentPage).appendTo($artistsViewerElement);
				break;
			case 'logo':
				uiviews.ArtistViewLogos(artistResult, parentPage).appendTo($artistsViewerElement);
				break;
			case 'logosingle':
				uiviews.ArtistViewSingleLogos(artistResult, parentPage).appendTo($artistsViewerElement);
				break;
		};
		
		if (useLazyLoad) {
			function loadThumbs(i) {
				$artistsViewerElement.find('img.thumb').lazyload(
					{
						queuedLoad: true,
						container: ($('#main').length? $('#main'): $('#content')),	// TODO remove fixed #main
						errorImage: 'images/thumb.png'
					}
				);
			};
			setTimeout(loadThumbs, 100);
		}
		
	}; // END defaultArtistsViewer


	/* ########################### *\
	 |  Show audio genres.
	 |
	 |  @param genreResult		Result of AudioLibrary.GetGenres.
	 |  @param parentPage		Page which is used as parent for new sub pages.
	\* ########################### */
	$.fn.defaultArtistsGenresViewer = function(artistGenresResult, parentPage) {
		
		// no genres?
		if (!artistGenresResult.limits.total > 0) { return };
		
		uiviews.AudioGenresViewList(artistGenresResult, parentPage).appendTo($(this));
		
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
					isPlaylist: e.data.isPlaylist,

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
			xbmc.clearAudioPlaylist({
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
				},
				onSuccess: function() {
					onAddPlaylistToPlaylistClick(e);
					xbmc.playAudio({
						onError: function() {
							mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
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
			var isSmart = false;
			if (e.data.playlistinfo.file.search(/\.xsp/i) !=-1) { isSmart = true; };
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
			if (!isSmart && e.data.playlistinfo.type == 'unknown' && e.data.playlistinfo.filetype == 'directory') {
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
			
			//Might be a stream playlist or other type Files.GetDirectory can't handle.
			if (!isSmart && e.data.playlistinfo.type == 'unknown' && e.data.playlistinfo.filetype == 'file') {
				var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_file_to_playlist'));
				xbmc.addAudioFileToPlaylist({
					file: e.data.playlistinfo.file,
					
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
					//is it a playlist or a directory? .pls .m3u m3u8 .cue .xsp .strm
					var playlistExt = playlist.file.split('.').pop().toLowerCase();
					var isPlaylist = false;
					if (playlistExt == 'pls' || playlistExt == 'm3u' || playlistExt == 'm3u8' || playlistExt == 'cue' || playlistExt == 'xsp' || playlistExt == 'strm') {
						isPlaylist = true;
						if (playlistExt == 'xsp') { playlist.realtype = 'Smart Playlist'; };
						if (playlistExt == 'cue') { playlist.realtype = 'Cue Sheet'; playlist.label = playlist.label.substring(0, playlist.label.lastIndexOf(".")); };
						if (playlistExt == 'strm') { playlist.realtype = 'Internet stream'; playlist.label = playlist.label.substring(0, playlist.label.lastIndexOf(".")); };
						if (playlistExt == 'pls' || playlistExt == 'm3u' || playlistExt == 'm3u8') { playlist.label = playlist.label.substring(0, playlist.label.lastIndexOf(".")); };
					} else if (playlist.filetype == 'directory' && playlist.type == 'unknown') {
						playlist.type = 'Directory';
					};
					MusicPlaylistsList.append('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' +
										(playlist.type != 'Directory'? '<a href="" class="button playlistinfo' + i +'" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' : '' ) +
										(playlist.type != 'Directory'? '<a href="" class="button play' + i + '" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' : '' ) +
										'<a href="" class="playlist' + i + '">' + playlist.label +
										(playlist.artist? ' - Artist: ' + playlist.artist : '') +
										(playlist.album && playlist.label != playlist.album? ' - Album: ' + playlist.album : '') +
										' - Type: ' + 
										(!isPlaylist? playlist.type : (!playlist.realtype && isPlaylist? 'Playlist' : playlist.realtype)) + '<div class="findKeywords">' + playlist.label.toLowerCase() + '</div>' +
										'</a></div></li>');

					if (playlist.type != 'Directory') {					
						MusicPlaylistsList.find('.playlistinfo' + i).bind('click', {playlistinfo: playlist}, onAddPlaylistToPlaylistClick);
						MusicPlaylistsList.find('.play' + i).bind('click', {playlistinfo: playlist}, onPlaylistsPlayClick);
					};
					MusicPlaylistsList.find('.playlist' + i).on('click',{id: playlist.id,strFile: playlist.file,strLabel: playlist.label,strType: playlist.type,isPlaylist: isPlaylist}, onMusicPlaylistsClick);
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

		if (!albumResult.limits.total > 0) { return };
		
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'yes')=='yes'? true : false;
		var view = mkf.cookieSettings.get('albumsView', 'cover');
		
		var $albumViewerElement = $(this);
		
		switch (view) {
			case 'list':
				uiviews.AlbumsViewList(albumResult, parentPage).appendTo($albumViewerElement);				
				break;
			case 'cover':
				uiviews.AlbumsViewThumbnails(albumResult, parentPage).appendTo($albumViewerElement);
				break;
			case 'listin':
				uiviews.AlbumsViewListInline(albumResult).appendTo($albumViewerElement);
				break;
		};

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

	}; // END defaultAlbumViewer


	/* ########################### *\
	 |  Show the Recent albums.
	 |
	 |  @param albumResult		Result of AudioLibrary.GetAlbums.
	 |  @param parentPage		Page which is used as parent for new sub pages.
	\* ########################### */
	$.fn.defaultAlbumRecentViewer = function(albumResult, parentPage) {

		if (!albumResult.limits.total > 0) { return };
		
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'yes')=='yes'? true : false;
		var view = mkf.cookieSettings.get('albumsViewRec', 'cover');
		
		var $albumViewerElement = $(this);
		
		switch (view) {
			case 'list':
				uiviews.AlbumsViewList(albumResult, parentPage).appendTo($albumViewerElement);
				break;
			case 'cover':
				uiviews.AlbumsViewThumbnails(albumResult, parentPage).appendTo($albumViewerElement);
				break;
			case 'listin':
				uiviews.AlbumsViewListInline(albumResult).appendTo($albumViewerElement);
				break;
		};

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

	}; // END defaultRecentAlbumViewer
	
	
	/* ########################### *\
	 |  Show the songlist.
	 |
	 |  @param songResult		Result of AudioLibrary.GetSongs.
	\* ########################### */
	$.fn.defaultSonglistViewer = function(songResult) {
		
		if (!songResult.limits.total > 0) { return };
		
		uiviews.SongViewList(songResult).appendTo($(this));
		
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
		
		if (!playlistResult.limits.total > 0) { return };
		
		//lets do one of these for audio and video
		//audio
		if (playlist == 'Audio') {
			uiviews.PlaylistAudioViewList(playlistResult).appendTo($(this));
			//console.log($('#content').find('ul').children().length);
			//if (($('#content').find('ul').children().length)) {
			//console.log($('#content').scrollTop($('.playlistItemCur').position().top));
			//console.log($('#content').find('ul').children().length);
			//}
		}
		
		//video
		if (playlist == 'Video') {
			uiviews.PlaylistVideoViewList(playlistResult).appendTo($(this));
		}
		
	}; // END defaultPlaylistViewer



	/* ########################### *\
	 |  Show movies.
	 |
	 |  @param movieResult	Result of VideoLibrary.GetMovies.
	\* ########################### */
	$.fn.defaultMovieViewer = function(movieResult) {

		if (!movieResult.limits.total > 0) { return };
		
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'yes')=='yes'? true : false;
		//var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
		//var listview = mkf.cookieSettings.get('listview', 'no')=='yes'? true : false;
		//var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
		var view = mkf.cookieSettings.get('filmView', 'poster');
		var options;
		var $movieContainer = $(this);

		switch (view) {
			case 'poster':
				uiviews.MovieViewThumbnails(movieResult, options).appendTo($movieContainer);				
				break;
			case 'listover':
				uiviews.MovieViewList(movieResult, options).appendTo($movieContainer);
				break;
			case 'listin':
				uiviews.MovieViewListInline(movieResult, options).appendTo($movieContainer);
				break;
			case 'accordion':
				uiviews.MovieViewAccordion(movieResult, options).appendTo($movieContainer);
				break;
			case 'singlePoster':
				uiviews.MovieViewSingle(movieResult, options).appendTo($movieContainer);
				break;
		};
		
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

	}; // END defaultMovieViewer

	
	/* ########################### *\
	 |  Show movie sets.
	 |
	 |  @param movieResult	Result of VideoLibrary.GetMovieSets.
	\* ########################### */
	$.fn.defaultMovieSetsViewer = function(movieResult, parentPage) {

		if (!movieResult.limits.total > 0) { return };
		
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'yes')=='yes'? true : false;
		//var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
		//var listview = mkf.cookieSettings.get('listview', 'no')=='yes'? true : false;
		//var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
		var view = mkf.cookieSettings.get('filmViewSets', 'poster');
		var options;
		var $movieContainer = $(this);

		switch (view) {
			case 'poster':
				uiviews.MovieSetsViewThumbnails(movieResult, parentPage, options).appendTo($movieContainer);
				break;
			case 'listover':
				uiviews.MovieSetsViewList(movieResult, parentPage, options).appendTo($movieContainer);
				break;
		};
		
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

	}; // END defaultMovieSetsViewer
	
	/* ########################### *\
	 |  Show Recent movies.
	 |
	 |  @param movieRecentResult	Result of VideoLibrary.GetMovies.
	\* ########################### */
	$.fn.defaultMovieRecentViewer = function(movieResult) {

		if (!movieResult.limits.total > 0) { return };
		
		var ui = mkf.cookieSettings.get('ui');
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'yes')=='yes'? true : false;
		var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
		var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
		var view = mkf.cookieSettings.get('filmViewRec', 'poster');
		//var listview = mkf.cookieSettings.get('listview', 'no')=='yes'? true : false;
		var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
		
		//Override display options. Example: Show all new films for recently added page.
		var options = {
			filterWatched: false,
			filterShowWatched: true
		}
		

		var $movieContainer = $(this);
		
		switch (view) {
			case 'poster':
				uiviews.MovieViewThumbnails(movieResult, options).appendTo($movieContainer);
				break;
			case 'listover':
				uiviews.MovieViewList(movieResult, options).appendTo($movieContainer);
				break;
			case 'listin':
				uiviews.MovieViewListInline(movieResult, options).appendTo($movieContainer);
				break;
			case 'accordion':
				uiviews.MovieViewAccordion(movieResult, options).appendTo($movieContainer);
				break;
			case 'singlePoster':
				uiviews.MovieViewSingle(movieResult, options).appendTo($movieContainer);
				break;
		};
		
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

	}; // END defaultMovieRecentViewer
	

	/* ########################### *\
	 |  Show TV Shows.
	 |
	 |  @param tvShowResult		Result of VideoLibrary.GetTVShows.
	\* ########################### */
	$.fn.defaultTvShowViewer = function(tvShowResult, parentPage) {
		
		if (!tvShowResult.limits.total > 0) { return };
		
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'yes')=='yes'? true : false;
		var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
		//var listview = mkf.cookieSettings.get('listview', 'no')=='yes'? true : false;
		var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
		var view = mkf.cookieSettings.get('TVView', 'banner');	
		
		var $tvshowContainer = $(this);

		switch (view) {
			case 'banner':
				uiviews.TVViewBanner(tvShowResult, parentPage).appendTo($tvshowContainer);
				break;
			case 'listover':
				uiviews.TVViewList(tvShowResult, parentPage).appendTo($tvshowContainer);
				break;
			case 'logo':
				uiviews.TVViewLogoWall(tvShowResult, parentPage).appendTo($tvshowContainer);
				break;
		};

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

	}; // END defaultTvShowViewer



	/* ########################### *\
	 |  Show TV Show's seasons.
	 |
	 |  @param seasonsResult
	\* ########################### */
	$.fn.defaultSeasonsViewer = function(seasonsResult, idTvShow, parentPage) {

		if (!seasonsResult.limits.total > 0) { return };
		
		uiviews.TVSeasonsViewList(seasonsResult, idTvShow, parentPage).appendTo($(this));
		
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
			xbmc.exportVideoLibrary({
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
				},

				onSuccess: function() {
					mkf.messageLog.show(mkf.lang.get('message_video_export'), mkf.messageLog.status.success, 5000);
				}
			});
		};
		
		var $scanVideoList = $('<div class="tools"><span class="tools toolsscan" title="' + mkf.lang.get('btn_scan') +
		'">' + mkf.lang.get('btn_scan') + '</span><span class="tools toolsclean" title="' + mkf.lang.get('btn_clean') +
		'">' + mkf.lang.get('btn_clean') + '</span><span class="tools toolsexport" title="' + mkf.lang.get('btn_export') +'">' + mkf.lang.get('btn_export') +'</span></div><br />').appendTo($(this));
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
		'">' + mkf.lang.get('btn_scan') + '</span><span class="tools toolsclean" title="' + mkf.lang.get('btn_clean') +
		'">' + mkf.lang.get('btn_clean') + '</span><span class="tools toolsexport" title="' + mkf.lang.get('btn_export') +'">' + mkf.lang.get('btn_export') +'</span></div><br />').appendTo($(this));
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
		
		if (!episodesResult.limits.total > 0) { return };
		
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'yes')=='yes'? true : false;
		var view = mkf.cookieSettings.get('EpView', 'listover');
		var epsContainer = $(this);
		
		switch (view) {
			case 'thumbnail':
				uiviews.TVEpThumbnailList(episodesResult).appendTo(epsContainer);
				break;
			case 'listover':
				uiviews.TVEpisodesViewList(episodesResult).appendTo(epsContainer);
				break;
		};
		
		if (useLazyLoad) {
			function loadThumbs(i) {
				epsContainer.find('img.thumb').lazyload(
					{
						queuedLoad: true,
						container: ($('#main').length? $('#main'): $('#content')),	// TODO remove fixed #main
						errorImage: 'images/thumb' + xbmc.getTvShowThumbType() + '.png'
					}
				);
			};
			setTimeout(loadThumbs, 100);
		}
		
	}; // END defaultEpisodesViewer

	/* ########################### *\
	 |  Show unwatched episodes.
	 |
	 |  @param episodesResult
	\* ########################### */
	$.fn.defaultunwatchedEpsViewer = function(episodesResult) {
	
		if (!episodesResult > 0) { return };
		
		//uiviews.TVUnwatchedEpsViewList(episodesResult).appendTo($(this));
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'yes')=='yes'? true : false;
		var view = mkf.cookieSettings.get('EpView', 'listover');
		var unwatched = true;
		var epsContainer = $(this);
		
		switch (view) {
			case 'thumbnail':
				uiviews.TVEpThumbnailList(episodesResult, unwatched).appendTo(epsContainer);
				break;
			case 'listover':
				uiviews.TVEpisodesViewList(episodesResult, unwatched).appendTo(epsContainer);
				break;
		};
		
		if (useLazyLoad) {
			function loadThumbs(i) {
				epsContainer.find('img.thumb').lazyload(
					{
						queuedLoad: true,
						container: ($('#main').length? $('#main'): $('#content')),	// TODO remove fixed #main
						errorImage: 'images/thumb' + xbmc.getTvShowThumbType() + '.png'
					}
				);
			};
			setTimeout(loadThumbs, 100);
		}

	}; // END defaultunwatchedEpsViewer
	
	
	/* ########################### *\
	 |  Show Recently Added episodes.
	 |
	 |  @param episodesResult
	\* ########################### */
	$.fn.defaultRecentlyAddedEpisodesViewer = function(episodesResult, parentPage) {
	
		if (!episodesResult.limits.total > 0) { return };
		
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'yes')=='yes'? true : false;
		var view = mkf.cookieSettings.get('TVViewRec', 'infolist');	
		
		var epsContainer = $(this);
		var options = {
			filterWatched: false,
			filterShowWatched: true
		}
		
		switch (view) {
			case 'infolist':
				uiviews.TVRecentViewInfoList(episodesResult, parentPage, options).appendTo(epsContainer);
				break;
		};
		
		if (useLazyLoad) {
			function loadThumbs(i) {
				epsContainer.find('img.thumb').lazyload(
					{
						queuedLoad: true,
						container: ($('#main').length? $('#main'): $('#content')),	// TODO remove fixed #main
						errorImage: 'images/thumb' + xbmc.getTvShowThumbType() + '.png'
					}
				);
			};
			setTimeout(loadThumbs, 100);
		}
		
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
			
				uiviews.MovieInfoOverlay(e.data.id);

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
			xbmc.clearVideoPlaylist({
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
					//$VideoPlaylistsContent.removeClass('loading');
				},
				onSuccess: function() {
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
			var isSmart = false;
			if (e.data.playlistinfo.file.search(/\.xsp/i) !=-1) { isSmart = true; };
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
						Sn = 1;
						An = 1;
						Mn = 1;
						Tn = 1;
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
		
		// Empty?
		if (!VideoPlaylistsResult || !VideoPlaylistsResult.files) {
			return;
		};

		this.each (function() {
			var VideoPlaylistsList = $('<ul class="fileList"></ul>').appendTo($(this));

			if (VideoPlaylistsResult.limits.total > 0) {
				$.each(VideoPlaylistsResult.files, function(i, playlist)  {
					if (playlist.label.search('extrafanart') != -1) { return; };
					VideoPlaylistsList.append('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' +
										'<a href="" class="button playlistinfo' + i +'" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' +
										'<a href="" class="button play' + i + '" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' +
										'<a href="" class="playlist' + i + '">' + playlist.label +
										(playlist.showtitle && playlist.showtitle != playlist.label? ' - Show: ' + playlist.showtitle : '') + ' ' +
										(playlist.season != -1 && playlist.season? ' - Season: ' + playlist.season : '') +
										(playlist.episode != -1 && playlist.episode? ' - Episode: ' + playlist.episode : '') + ' - Type: ' + 
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
									var $file = $('<li' + (globalI%2==0? ' class="even"': '') + '><div class="folderLinkWrapper file' + i + '"> <a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a> <a href="" class="file play">' + file.file.replace(/\\/g, "\\\\").substring(file.file.lastIndexOf("/")+1) + '</a></div></li>').appendTo($filelist);
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

					async: true
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
	 |  "Currently Playing footer
	\* ########################### */
	$.fn.uniFooterStatus = function(options) {
		var settings = {
			effect: 'fade'
		};
		$.extend(settings, options);

		this.each (function() {
			var $footerNowBox = $(this);
			var $footerStatusBox = $('#footer #statPlayerContainer');

			var content = '<div id="now_next"><div id="now">' + mkf.lang.get('label_now') + '<span class="label" /><span class="nowTitle" /></div><div id="next">' + mkf.lang.get('label_next') + '<span class="nextTitle" /></div></div>';
			//content += '<div id="statPlayerContainer"><div id="statusPlayer"><div id="statusPlayerRow"><div id="paused"></div><div id="shuffled"></div></div><div id="statusPlayerRow"><div id="repeating"></div><div id="muted"></div></div></div><div id="remainPlayer"><div id="remaining">' + mkf.lang.get('label_remaining') + '<span class="timeRemain">00:00</span></div><div id="plTotal">' + mkf.lang.get('label_total') + '<span class="timeRemainTotal">00:00</span></div></div>';
			//content += '<div id="controller"></div>';
			
			$footerNowBox.html(content);
			

			var titleElement = '';

			var artistElement = '';
			var albumElement = '';

			var tvshowElement = '';
			var seasonElement = '';
			var episodeElement = '';
			
			var thumbElement = $('#content #displayoverlay #artwork img');
			
			var nowLabelElement = $footerNowBox.find('span.label');
			var nowElement = $footerNowBox.find('span.nowTitle');
			var nextElement = $footerNowBox.find('span.nextTitle');
			var timeCurRemain = $footerStatusBox.find('span.timeRemain');
			var timeCurRemainTotal = $footerStatusBox.find('span.timeRemainTotal');
			var sliderElement = $('#content #displayoverlay .playingSlider');
			
			sliderElement.slider({
				range: 'min',
				value: 0,
				stop: function(event, ui) {
					xbmc.seekPercentage({percentage: ui.value});
				}
			});

			xbmc.periodicUpdater.addCurrentlyPlayingChangedListener(function(currentFile) {
				// ALL: AUDIO, VIDEO, PICTURE
				if (currentFile.title) { titleElement=currentFile.title; } else { titleElement = (currentFile.label? currentFile.label : mkf.lang.get('label_not_available')) ; }

				if (currentFile.xbmcMediaType == 'audio') {
					// AUDIO
					if (currentFile.artist) { artistElement = currentFile.artist; } else { artistElement = mkf.lang.get('label_not_available'); }
					if (currentFile.album) { albumElement = currentFile.album; } else { albumElement = mkf.lang.get('label_not_available'); }
					
					nowLabelElement.text(titleElement);
					nowElement.text(' - ' + artistElement + ' - ' + albumElement);
				} else {
					// VIDEO

					if (currentFile.season &&
						currentFile.episode &&
						currentFile.showtitle) {

						tvshowElement = currentFile.showtitle;
						seasonElement = currentFile.season;
						episodeElement = currentFile.episode;
						
						nowLabelElement.text(titleElement);
						nowElement.text(' - ' + tvshowElement + ' - S' + seasonElement + 'E' + episodeElement);

					} else {
						nowLabelElement.text(titleElement);
					}
				}
				
				thumbElement.attr('src', 'images/thumbPoster.png');
				if (currentFile.thumbnail) {
					thumbElement.attr('src', xbmc.getThumbUrl(currentFile.thumbnail));
					if (currentFile.showtitle) {
						thumbElement.css('margin-top', '165px');
						thumbElement.css('width', '200px');
						thumbElement.css('height', '115px');					
					} else if (currentFile.xbmcMediaType == 'audio') {
						thumbElement.css('margin-top', '85px');
						thumbElement.css('height', '195px');
						thumbElement.css('width', '195px');
					} else { //movie
						thumbElement.css('margin-top', '0px');
						thumbElement.css('height', '280px');
						thumbElement.css('width', '195px');						
					}

				}
			});
			
			xbmc.periodicUpdater.addNextPlayingChangedListener(function(nextFile) {
				// ALL: AUDIO, VIDEO, PICTURE
				if (nextFile.title) { titleElement=nextFile.title; } else { titleElement = (nextFile.label? nextFile.label : '') ; }

				if (nextFile.xbmcMediaType == 'audio') {
					// AUDIO
					if (nextFile.artist) { artistElement = nextFile.artist; } else { artistElement = mkf.lang.get('label_not_available'); }
					if (nextFile.album) { albumElement = nextFile.album; } else { albumElement = mkf.lang.get('label_not_available'); }
					
					nextElement.text(titleElement + ' - ' + artistElement + ' - ' + albumElement);
					//nowElement.text(' - ' + artistElement + ' - ' + albumElement);
				} else {
					// VIDEO

					if (nextFile.season &&
						nextFile.episode &&
						nextFile.showtitle) {

						tvshowElement = nextFile.showtitle;
						seasonElement = nextFile.season;
						episodeElement = nextFile.episode;
						
						nextElement.text(titleElement + ' - ' + tvshowElement + ' - S' + seasonElement + 'E' + episodeElement);
						//nowElement.text(' - ' + tvshowElement + ' - S' + seasonElement + 'E' + episodeElement);

					} else {
						nextElement.text(titleElement);
					}
				}
			});
				
			xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
				if (status == 'stopped') {
					nowLabelElement.text('');
					nowElement.text('');
					timeCurRemain.text('00:00');
					timeCurRemainTotal.text('00:00');
					thumbElement.css('height', '280px');
					thumbElement.css('width', '195px');
					thumbElement.attr('src', 'images/thumbPoster.png');
					thumbElement.css('margin-top', '0px');
					//$footerStatusBox.find('#statusPlayer').hide();
				
				} else if (status == 'playing') {
					$footerStatusBox.find('#statusPlayer #statusPlayerRow #paused').hide();

				} else if (status == 'paused') {
					//$footerStatusBox.find('#statusPlayer').css('display', 'inline-table');
					$footerStatusBox.find('#statusPlayer #statusPlayerRow #paused').css('display', 'table-cell');

				} else if (status == 'shuffleOn') {
					//$footerStatusBox.find('#statusPlayer').css('display', 'inline-table');
					$footerStatusBox.find('#statusPlayer #statusPlayerRow #shuffled').css('display', 'table-cell');

				} else if (status == 'shuffleOff') {
					$footerStatusBox.find('#statusPlayer #statusPlayerRow #shuffled').hide();
					
				} else if (status == 'off') {
					//$footerStatusBox.find('#statusPlayer').css('display', 'inline-table');
					$footerStatusBox.find('#statusPlayer #statusPlayerRow #repeating').hide();
					
				} else if (status == 'all') {
					//$footerStatusBox.find('#statusPlayer').css('display', 'inline-table');
					$footerStatusBox.find('#statusPlayer #statusPlayerRow #repeating').css('background-position', '-96px 0px');
					$footerStatusBox.find('#statusPlayer #statusPlayerRow #repeating').css('display', 'table-cell');
					
				} else if (status == 'one') {
					//$footerStatusBox.find('#statusPlayer').css('display', 'inline-table');
					$footerStatusBox.find('#statusPlayer #statusPlayerRow #repeating').css('background-position', '-144px 0px');
					$footerStatusBox.find('#statusPlayer #statusPlayerRow #repeating').css('display', 'table-cell');
				
				} else if (status == 'muteOn') {
					//$footerStatusBox.find('#statusPlayer').css('display', 'inline-table');
					$footerStatusBox.find('#statusPlayer #statusPlayerRow #muted').css('display', 'table-cell');

				} else if (status == 'muteOff') {
					$footerStatusBox.find('#statusPlayer #statusPlayerRow #muted').hide();
					
				}
			});
			
			xbmc.periodicUpdater.addProgressChangedListener(function(progress) {
				timeCurRemain.text(xbmc.formatTime(xbmc.getSeconds(progress.total) - xbmc.getSeconds(progress.time)));
				timeCurRemainTotal.text(xbmc.formatTime(xbmc.getSeconds(progress.total)));
				//durationElement.text(progress.total);
				sliderElement.slider("option", "value", 100 * xbmc.getSeconds(progress.time) / xbmc.getSeconds(progress.total));
			});

		});
	}; // END uniFooterStatus
	

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
				if (currentFile.title) { titleElement.text(currentFile.title); } else { titleElement.text( (currentFile.label? currentFile.label : mkf.lang.get('label_not_available')) ); }

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
					} else {
						thumbElement.removeAttr('height');
						thumbElement.attr('width', '100px');
					}

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
