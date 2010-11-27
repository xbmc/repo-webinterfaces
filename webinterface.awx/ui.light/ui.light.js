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


var awxUI = {};


(function($) {

	$.extend(awxUI, {
		// --- Pages ---
		artistsPage: null,
		albumsPage: null,
		musicFilesPage: null,
		musicPlaylistPage: null,

		moviesPage: null,
		tvShowsPage: null,
		videoFilesPage: null,
		videoPlaylistPage: null,

		// --- Page Content ---
		$musicContent: null,
		$artistsContent: null,
		$albumsContent: null,
		$musicFilesContent: null,
		$musicPlaylistContent: null,

		$videosContent: null,
		$moviesContent: null,
		$tvShowsContent: null,
		$videoFilesContent: null,
		$videoPlaylistContent: null,



		/*******************************
		 * Initialize the UI:          *
		 *  - define pages             *
		 *  - build the user interface *
		 *******************************/
		init: function() {
			this.setupPages();
			this.buildUI();
		},



		/**************************
		 * Set up page structure: *
		 *  - Music               *
		 *     - Artists          *
		 *     - Albums           *
		 *     - Files            *
		 *     - Playlist         *
		 *  - Videos              *
		 *     - Movies           *
		 *     - TV Shows         *
		 *     - Files            *
		 *     - Playlist         *
		 **************************/
		setupPages: function() {
			// --- MUSIC ---
			this.$musicContent = $('<div class="pageContentWrapper"></div>');
			var musicPage = mkf.pages.addPage({
				title: mkf.lang.get('page_title_music'),
				menuButtonText: '<span class="icon music"></span>' + mkf.lang.get('page_buttontext_music'),
				content: this.$musicContent,
				className: 'music'
			});

			var standardMusicContextMenu = [{
						'icon':'back', 'title':mkf.lang.get('ctxt_btn_back_to_music'), 'shortcut':'Ctrl+1', 'onClick':
						function(){
							mkf.pages.showPage(musicPage);
							return false;
						}
					}];

			this.$artistsContent = $('<div class="pageContentWrapper"></div>');
			this.artistsPage = musicPage.addPage({
				title: mkf.lang.get('page_title_artist'),
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_artist'),
				content: this.$artistsContent,
				contextMenu: standardMusicContextMenu,
				onShow: $.proxy(this, "onArtistsShow"),
				className: 'artists'
			});

			this.$albumsContent = $('<div class="pageContentWrapper"></div>');
			var musicAlbumsContextMenu = $.extend(true, [], standardMusicContextMenu);
			musicAlbumsContextMenu.push({
				'id':'findAlbumButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findAlbumButton').offset();
						awxUI.$albumsContent
							.defaultFindBox({id:'albumsFindBox', searchItems:'.thumbWrapper', top: pos.top, left: pos.left});
						return false;
					}
			});

			this.albumsPage = musicPage.addPage({
				title: mkf.lang.get('page_title_albums'),
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_albums'),
				content: this.$albumsContent,
				contextMenu: musicAlbumsContextMenu,
				onShow: $.proxy(this, "onAlbumsShow"),
				className: 'albums'
			});

			this.$musicFilesContent = $('<div class="pageContentWrapper"></div>');
			this.musicFilesPage = musicPage.addPage({
				title: mkf.lang.get('page_title_music_files'),
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_music_files'),
				content: this.$musicFilesContent,
				contextMenu: standardMusicContextMenu,
				onShow: $.proxy(this, "onMusicFilesShow"),
				className: 'audiofiles'
			});

			this.$musicPlaylistContent = $('<div class="pageContentWrapper"></div>');
			var musicPlaylistContextMenu = $.extend(true, [], standardMusicContextMenu);
			musicPlaylistContextMenu.push({
				'icon':'clear', 'title':mkf.lang.get('ctxt_btn_clear playlist'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var messageHandle = mkf.messageLog.show(mkf.lang.get('message_clear_audio_playlist'));

						xbmc.clearAudioPlaylist({
							onSuccess: function () {
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 5000, mkf.messageLog.status.success);
								// reload playlist
								awxUI.onMusicPlaylistShow();
							},

							onError: function () {
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 5000, mkf.messageLog.status.error);
							}
						});

						return false;
					}
			});

			this.musicPlaylistPage = musicPage.addPage({
				title: mkf.lang.get('page_title_music_playlist'),
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_music_playlist'),
				content: this.$musicPlaylistContent,
				contextMenu: musicPlaylistContextMenu,
				onShow: $.proxy(this, "onMusicPlaylistShow"),
				className: 'playlist'
			});


			// --- VIDEOS ---
			this.$videosContent = $('<div class="pageContentWrapper"></div>');
			var videosPage = mkf.pages.addPage({
				title: mkf.lang.get('page_title_videos'),
				menuButtonText: '<span class="icon videos"></span>' + mkf.lang.get('page_buttontext_videos'),
				content: this.$videosContent,
				className: 'videos'
			});

			var standardVideosContextMenu = [{
						'icon':'back', 'title':mkf.lang.get('ctxt_btn_back_to_videos'), 'shortcut':'Ctrl+1', 'onClick':
						function(){
							mkf.pages.showPage(videosPage);
							return false;
						}
					}];

			this.$moviesContent = $('<div class="pageContentWrapper"></div>');
			var videoMoviesContextMenu = $.extend(true, [], standardVideosContextMenu);
			videoMoviesContextMenu.push({
				'id':'findMovieButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findMovieButton').offset();
						awxUI.$moviesContent
							.defaultFindBox({id:'moviesFindBox', searchItems:'.thumbWrapper', top: pos.top, left: pos.left});
						return false;
					}
			});

			this.moviesPage = videosPage.addPage({
				title: mkf.lang.get('page_title_movies'),
				content: this.$moviesContent,
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_movies'),
				contextMenu: videoMoviesContextMenu,
				onShow: $.proxy(this, "onMoviesShow"),
				className: 'movies'
			});

			this.$tvShowsContent = $('<div class="pageContentWrapper"></div>');
			var videoTvShowsContextMenu = $.extend(true, [], standardVideosContextMenu);
			videoTvShowsContextMenu.push({
				'id':'findTVShowButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findTVShowButton').offset();
						awxUI.$tvShowsContent
							.defaultFindBox({id:'tvShowFindBox', searchItems:'.thumbWrapper', top: pos.top, left: pos.left});
						return false;
					}
			});

			this.tvShowsPage = videosPage.addPage({
				title: mkf.lang.get('page_title_tvshows'),
				content: this.$tvShowsContent,
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_tvshows'),
				contextMenu: videoTvShowsContextMenu,
				onShow: $.proxy(this, "onTvShowsShow"),
				className: 'movies'
			});

			this.$videoFilesContent = $('<div class="pageContentWrapper"></div>');
			this.videoFilesPage = videosPage.addPage({
				title: mkf.lang.get('page_title_video_files'),
				content: this.$videoFilesContent,
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_video_files'),
				contextMenu: standardVideosContextMenu,
				onShow: $.proxy(this, "onVideoFilesShow"),
				className: 'videofiles'
			});

			this.$videoPlaylistContent = $('<div class="pageContentWrapper"></div>');
			var videoPlaylistContextMenu = $.extend(true, [], standardVideosContextMenu);
			videoPlaylistContextMenu.push({
				'icon':'clear', 'title':mkf.lang.get('ctxt_btn_clear playlist'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var messageHandle = mkf.messageLog.show(mkf.lang.get('message_clear_video_playlist'));

						xbmc.clearVideoPlaylist({
							onSuccess: function () {
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 5000, mkf.messageLog.status.success);
								// reload playlist
								awxUI.onVideoPlaylistShow();
							},

							onError: function () {
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 5000, mkf.messageLog.status.error);
							}
						});

						return false;
					}
			});

			this.videoPlaylistPage = videosPage.addPage({
				title: mkf.lang.get('page_title_video_playlist'),
				content: this.$videoPlaylistContent,
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_video_playlist'),
				contextMenu: videoPlaylistContextMenu,
				onShow: $.proxy(this, "onVideoPlaylistShow"),
				className: 'playlist'
			});

			/*
			 * Page Content
			 */
			this.$musicContent.mkfMenu({root: musicPage, levels: 1});
			this.$videosContent.mkfMenu({root: videosPage, levels: 1});
		},



		/*****************************
		 * Build the user interface. *
		 *****************************/
		buildUI: function() {
			$('body').append('<div id="preload">' +
								'<img src="loading_thumb.gif" alt="Preload 1/8" />' +
								'<img src="loading_thumbBanner.gif" alt="Preload 2/8" />' +
								'<img src="loading_thumbPoster.gif" alt="Preload 3/8" />' +
								'<img src="thumbBanner.png" alt="Preload 4/8" />' +
								'<img src="thumbPoster.png" alt="Preload 5/8" />' +
								'<img src="thumb.png" alt="Preload 6/8" />' +
								'<img src="ui.light/images/messagelog.png" alt="Preload 7/8" />' +
								'<img src="ui.light/images/loading.gif" alt="Preload 8/8" />' +
							'</div>' +
							'<div id="header">' +
								'<div id="controls">' +
									'<div id="volumeSlider"></div>' +
								'</div>' +
								'<div id="currentlyPlaying"></div>' +
							'</div>' + 
							'<div id="navigation"></div>'+
							'<div id="statusLine"><div id="location"></div><div id="contextMenu"></div></div>' +
							'<div id="content"></div>' +
							'<div id="messageLog"></div>'
							);


			var $stylesheet = $('<link rel="stylesheet" type="text/css" />').appendTo('head');
			$stylesheet.attr('href', 'ui.light/css/layout.css');
			// does not work in IE 8
			// $('<link rel="stylesheet" type="text/css" href="ui.light/css/layout.css" />').appendTo('head');

			$('#messageLog').mkfMessageLog();
			$('#location').mkfLocationBar({clickable: true, autoKill: true, prepend: '&raquo; '});
			$('#navigation').mkfMenu();
			$('#content').mkfPages();
			$('#contextMenu').mkfPageContextMenu();

			$('#controls').defaultControls();
			$('#currentlyPlaying').defaultCurrentlyPlaying({effect:'fade'});
			$('#volumeSlider').defaultVolumeControl({horizontal: true});

			var $sysMenu = $('<ul class="systemMenu">').appendTo($('#navigation'));
			$sysMenu.defaultSystemButtons();
			$sysMenu.find('a').wrap('<li>');
			$sysMenu.find('a.settings').prepend('<span class="icon settings"></span>' + mkf.lang.get('btn_settings'));
			$sysMenu.find('a.exit').prepend('<span class="icon exit"></span>' + mkf.lang.get('btn_exitmenu'));


			// Hide all submenus
			$('#navigation ul.mkfMenu ul, ul.systemMenu ul').hide();

			// Hover for menus
			$('#navigation ul.mkfMenu > li, ul.systemMenu > li').hover(function() {
				// Mouse in
				var submenu = $(this).find('ul');
				submenu.stop(true, true);
				$(this).addClass('mouseover');
				submenu.slideDown('fast');

			}, function() {
				// Mouse out
				var submenu = $(this).find('ul');
				if (submenu.length == 0) // no submenu
					$(this).removeClass('mouseover');
				else
					submenu.slideUp('fast', function() {
						$(this).parent().removeClass('mouseover');
					});
			});
		},



		/**************************************
		 * Called when Artists-Page is shown. *
		 **************************************/
		onArtistsShow: function() {
			if (this.$artistsContent.html() == '') {
				var artistsPage = this.artistsPage;
				var $contentBox = this.$artistsContent;
				$contentBox.addClass('loading');

				xbmc.getArtists({
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed_artist_list'), mkf.messageLog.status.error, 5000);
						$contentBox.removeClass('loading');
					},

					onSuccess: function(result) {
						$contentBox.defaultArtistsViewer(result, artistsPage);
						$contentBox.removeClass('loading');
					}
				});
			}
		},



		/**************************************
		 * Called when Albums-Page is shown. *
		 **************************************/
		onAlbumsShow: function() {
			if (this.$albumsContent.html() == '') {
				var albumsPage = this.albumsPage;
				var $contentBox = this.$albumsContent;
				$contentBox.addClass('loading');

				xbmc.getAlbums({
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed_album_list'), mkf.messageLog.status.error, 5000);
						$contentBox.removeClass('loading');
					},

					onSuccess: function(result) {
						$contentBox.defaultAlbumViewer(result, albumsPage);
						$contentBox.removeClass('loading');
					}
				});
			}
		},



		/*********************************************
		 * Called when Music-Files-Page is shown. *
		 *********************************************/
		onMusicFilesShow: function() {
			if (this.$musicFilesContent.html() == '') {
				this.$musicFilesContent.defaultFilesystemViewer('Audio', this.musicFilesPage);
			}
		},



		/*********************************************
		 * Called when Music-Playlist-Page is shown. *
		 *********************************************/
		onMusicPlaylistShow: function() {
			var $contentBox = this.$musicPlaylistContent;
			$contentBox.empty();
			$contentBox.addClass('loading');

			xbmc.getAudioPlaylist({
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed_audio_playlist'), mkf.messageLog.status.error, 5000);
					$contentBox.removeClass('loading');
				},

				onSuccess: function(result) {
					$contentBox.defaultPlaylistViewer(result, 'Audio');
					$contentBox.removeClass('loading');
				}
			});
		},



		/*********************************************
		 * Called when Movie-Page is shown.          *
		 *********************************************/
		onMoviesShow: function() {
			if (this.$moviesContent.html() == '') {
				var $contentBox = this.$moviesContent;
				$contentBox.addClass('loading');

				xbmc.getMovies({
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed_movie_list'), mkf.messageLog.status.error, 5000);
						$contentBox.removeClass('loading');
					},

					onSuccess: function(result) {
						$contentBox.defaultMovieViewer(result);
						$contentBox.removeClass('loading');
					}
				});
			}
		},



		/***************************************
		 * Called when Tv-Shows-Page is shown. *
		 ***************************************/
		onTvShowsShow: function() {
			if (this.$tvShowsContent.html() == '') {
				var tvShowsPage = this.tvShowsPage;
				var $contentBox = this.$tvShowsContent;
				$contentBox.addClass('loading');

				xbmc.getTvShows({
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed_tvshow_list'), mkf.messageLog.status.error, 5000);
						$contentBox.removeClass('loading');
					},

					onSuccess: function(result) {
						$contentBox.defaultTvShowViewer(result, tvShowsPage);
						$contentBox.removeClass('loading');
					}
				});
			}
		},



		/*********************************************
		 * Called when Video-Files-Page is shown.    *
		 *********************************************/
		onVideoFilesShow: function() {
			if (this.$videoFilesContent.html() == '') {
				this.$videoFilesContent.defaultFilesystemViewer('Video', this.videoFilesPage);
			}
		},



		/*********************************************
		 * Called when Video-Playlist-Page is shown. *
		 *********************************************/
		onVideoPlaylistShow: function() {
			var $contentBox = this.$videoPlaylistContent;
			$contentBox.empty();
			$contentBox.addClass('loading');

			xbmc.getVideoPlaylist({
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed_video_playlist'), mkf.messageLog.status.error, 5000);
					$contentBox.removeClass('loading');
				},

				onSuccess: function(result) {
					$contentBox.defaultPlaylistViewer(result, 'Video');
					$contentBox.removeClass('loading');
				}
			});
		}


	}); // END awxUI


})(jQuery);
