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
		artistsGenresPage: null,
		albumsPage: null,
		MusicPlaylistsPage: null,
		musicVideosPage: null,
		albumsRecentPage: null,
		musicFilesPage: null,
		musicPlaylistPage: null,
		musicScanPage: null,

		moviesPage: null,
		movieSetsPage: null,
		moviesRecentPage: null,
		VideoPlaylistsPage: null,
		tvShowsPage: null,
		tvShowsRecentlyAddedPage: null,
		videoFilesPage: null,
		videoPlaylistPage: null,
		videoScanPage: null,

		// --- Page Content ---
		$musicContent: null,
		$artistsContent: null,
		$artistsGenresContent: null,
		$MusicPlaylistsContent: null,
		$albumsContent: null,
		$albumsRecentContent: null,
		$musicVideosContent: null,
		$musicFilesContent: null,
		$musicPlaylistContent: null,
		$musicScanContent: null,

		$videosContent: null,
		$moviesContent: null,
		$VideoPlaylistsContent: null,
		$moviesRecentContent: null,
		$tvShowsContent: null,
		$tvShowsRecentlyAddedContent: null,
		$videoFilesContent: null,
		$videoPlaylistContent: null,
		$videoScanContent: null,



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
		 *     - Artists		  *
		 *	   - Genres			  *
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
			//var listview = mkf.cookieSettings.get('listview', 'no')=='yes'? true : false;
			
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

			// Artists
			this.$artistsContent = $('<div class="pageContentWrapper"></div>');
			var artistsContextMenu = $.extend(true, [], standardMusicContextMenu);
			artistsContextMenu.push({
				'id':'findArtistsButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findArtistsButton').offset();
						awxUI.$artistsContent
							.defaultFindBox({id:'artistsFindBox', searchItems: xbmc.getSearchTerm('artists'), top: pos.top, left: pos.left});
						return false;
					}
			});
			artistsContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$artistsContent.empty();
						awxUI.onArtistsShow();

						return false;
					}
			});
			
			this.artistsPage = musicPage.addPage({
				title: mkf.lang.get('page_title_artist'),
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_artist'),
				content: this.$artistsContent,
				contextMenu: artistsContextMenu,
				onShow: $.proxy(this, "onArtistsShow"),
				className: 'artists'
			});
			
			// Music Genres
			this.$artistsGenresContent = $('<div class="pageContentWrapper"></div>');
			var artistsGenresContextMenu = $.extend(true, [], standardMusicContextMenu);
			artistsGenresContextMenu.push({
				'id':'findArtistsGenresButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findArtistsGenresButton').offset();
						awxUI.$artistsGenresContent
							.defaultFindBox({id:'artistsGenresFindBox', searchItems: xbmc.getSearchTerm('agenres'), top: pos.top, left: pos.left});
						return false;
					}
			});
			artistsGenresContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$artistsGenresContent.empty();
						awxUI.onArtistsGenresShow();

						return false;
					}
			});	
			
			this.artistsGenresPage = musicPage.addPage({
				title: mkf.lang.get('page_title_genres'),
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_genre'),
				content: this.$artistsGenresContent,
				contextMenu: artistsGenresContextMenu,
				onShow: $.proxy(this, "onArtistsGenresShow"),
				className: 'artistsGenres'
			});

			//playlists m3u smart etc.
			this.$MusicPlaylistsContent = $('<div class="pageContentWrapper"></div>');
			var MusicPlaylistsContextMenu = $.extend(true, [], standardMusicContextMenu);
			/*MusicPlaylistsContextMenu.push({
				'id':'findArtistsButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findArtistsButton').offset();
						awxUI.$MusicPlaylistsContent
							.defaultFindBox({id:'artistsFindBox', searchItems:'a', top: pos.top, left: pos.left});
						return false;
					}
			});*/
			MusicPlaylistsContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$MusicPlaylistsContent.empty();
						awxUI.onMusicPlaylistsShow();

						return false;
					}
			});	
			
			this.MusicPlaylistsPage = musicPage.addPage({
				title: mkf.lang.get('page_title_music_playlists'),
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_music_playlists'),
				content: this.$MusicPlaylistsContent,
				contextMenu: MusicPlaylistsContextMenu,
				onShow: $.proxy(this, "onMusicPlaylistsShow"),
				className: 'MusicPlaylists'
			});
			
			// Albums
			this.$albumsContent = $('<div class="pageContentWrapper"></div>');
			var musicAlbumsContextMenu = $.extend(true, [], standardMusicContextMenu);
			musicAlbumsContextMenu.push({
				'id':'findAlbumButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findAlbumButton').offset();
						awxUI.$albumsContent
							.defaultFindBox({id:'albumsFindBox', searchItems: xbmc.getSearchTerm('albums'), top: pos.top, left: pos.left});
						return false;
					}
			});
			musicAlbumsContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$albumsContent.empty();
						awxUI.onAlbumsShow();

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

			//recent albums
			this.$albumsRecentContent = $('<div class="pageContentWrapper"></div>');
			var musicAlbumsRecentContextMenu = $.extend(true, [], standardMusicContextMenu);
			musicAlbumsRecentContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$albumsRecentContent.empty();
						awxUI.onAlbumsRecentShow();

						return false;
					}
			});

			this.albumsRecentPage = musicPage.addPage({
				title: mkf.lang.get('page_title_album_recent'),
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_album_recent'),
				content: this.$albumsRecentContent,
				contextMenu: musicAlbumsRecentContextMenu,
				onShow: $.proxy(this, "onAlbumsRecentShow"),
				className: 'recentAlbums'
			});
			//end recent albums
			
			//Music Files
			this.$musicFilesContent = $('<div class="pageContentWrapper"></div>');
			var musicFilesContextMenu = $.extend(true, [], standardMusicContextMenu);
			/*musicFilesContextMenu.push({
				'id':'findFilesButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findFilesButton').offset();
						awxUI.$musicFilesContent
							.defaultFindBox({id:'filesFindBox', searchItems:'.folderLinkWrapper', top: pos.top, left: pos.left});
						return false;
					}
			});
			musicFilesContextMenu.push({
				// Doesn't work because of subPages.
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						console.log(awxUI.$musicFilesContent);
						awxUI.$musicFilesContent.empty();
						console.log(awxUI.$musicFilesContent);
						awxUI.onMusicFilesShow();

						return false;
					}
			});*/
			
			this.musicFilesPage = musicPage.addPage({
				title: mkf.lang.get('page_title_music_files'),
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_music_files'),
				content: this.$musicFilesContent,
				contextMenu: musicFilesContextMenu,
				onShow: $.proxy(this, "onMusicFilesShow"),
				className: 'audiofiles'
			});
			
			//Playlist
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
			musicPlaylistContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$musicPlaylistContent.empty();
						awxUI.onMusicPlaylistShow();
						return false;
					}
			});
			musicPlaylistContextMenu.push({
				'id':'findPlaylistButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findPlaylistButton').offset();
						awxUI.$musicPlaylistContent
							.defaultFindBox({id:'playlistFindBox', searchItems: xbmc.getSearchTerm('aplaylist'), top: pos.top, left: pos.left});
						return false;
					}
			});
			this.musicPlaylistPage = musicPage.addPage({
				title: mkf.lang.get('page_title_music_playlist'),
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_music_playlist'),
				content: this.$musicPlaylistContent,
				contextMenu: musicPlaylistContextMenu,
				onShow: $.proxy(this, "onMusicPlaylistShow"),
				className: 'musicPlaylist'
			});

			//Music Scan
			this.$musicScanContent = $('<div class="pageContentWrapper"></div>');
			var musicScanContextMenu = $.extend(true, [], standardMusicContextMenu);
			
			this.musicScanPage = musicPage.addPage({
				title: mkf.lang.get('page_title_music_scan'),
				content: this.$musicScanContent,
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_music_scan'),
				contextMenu: musicScanContextMenu,
				onShow: $.proxy(this, "onMusicScanShow"),
				className: 'scanMusic'
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

			//Movies
			this.$moviesContent = $('<div class="pageContentWrapper"></div>');
			var videoMoviesContextMenu = $.extend(true, [], standardVideosContextMenu);
			videoMoviesContextMenu.push({
				'id':'findMovieButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findMovieButton').offset();
						awxUI.$moviesContent
							.defaultFindBox({id:'moviesFindBox', searchItems: xbmc.getSearchTerm('movies'), top: pos.top, left: pos.left});
						return false;
					}
			});
			videoMoviesContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$moviesContent.empty();
						awxUI.onMoviesShow();

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
			

			//Movie sets
			this.$movieSetsContent = $('<div class="pageContentWrapper"></div>');
			var videoMovieSetsContextMenu = $.extend(true, [], standardVideosContextMenu);
			videoMovieSetsContextMenu.push({
				'id':'findMovieSetsButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findMovieSetsButton').offset();
						awxUI.$movieSetsContent
							.defaultFindBox({id:'moviesetsFindBox', searchItems: xbmc.getSearchTerm('moviesets'), top: pos.top, left: pos.left});
						return false;
					}
			});
			videoMovieSetsContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$movieSetsContent.empty();
						awxUI.onMovieSetsShow();

						return false;
					}
			});
			
			this.movieSetsPage = videosPage.addPage({
				title: mkf.lang.get('page_title_moviesets'),
				content: this.$movieSetsContent,
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_moviesets'),
				contextMenu: videoMovieSetsContextMenu,
				onShow: $.proxy(this, "onMovieSetsShow"),
				className: 'moviesets'
			});
			
			
			//playlists video smart etc.
			this.$VideoPlaylistsContent = $('<div class="pageContentWrapper"></div>');
			var VideoPlaylistsContextMenu = $.extend(true, [], standardVideosContextMenu);
			/*VideoPlaylistsContextMenu.push({
				'id':'findvplaylistButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findvplaylistButton').offset();
						awxUI.$moviesContent
							.defaultFindBox({id:'vplaylistFindBox', searchItems: xbmc.getSearchTerm('vplaylist'), top: pos.top, left: pos.left});
						return false;
					}
			});*/
			VideoPlaylistsContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$VideoPlaylistsContent.empty();
						awxUI.onVideoPlaylistsShow();

						return false;
					}
			});	
			
			this.VideoPlaylistsPage = videosPage.addPage({
				title: mkf.lang.get('page_title_video_playlists'),
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_video_playlists'),
				content: this.$VideoPlaylistsContent,
				contextMenu: VideoPlaylistsContextMenu,
				onShow: $.proxy(this, "onVideoPlaylistsShow"),
				className: 'videoPlaylists'
			});

			
			//Recent movies
			this.$moviesRecentContent = $('<div class="pageContentWrapper"></div>');
			var videoMoviesRecentContextMenu = $.extend(true, [], standardVideosContextMenu);
			videoMoviesRecentContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$moviesRecentContent.empty();
						awxUI.onMoviesRecentShow();

						return false;
					}
			});

			this.moviesRecentPage = videosPage.addPage({
				title: mkf.lang.get('page_title_movies_recentlyadded'),
				content: this.$moviesRecentContent,
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_movies_recentlyadded'),
				contextMenu: videoMoviesRecentContextMenu,
				onShow: $.proxy(this, "onMoviesRecentShow"),
				className: 'recentMovies'
			});
			//end recent movies
			
			//TV Shows
			this.$tvShowsContent = $('<div class="pageContentWrapper"></div>');
			var videoTvShowsContextMenu = $.extend(true, [], standardVideosContextMenu);
			videoTvShowsContextMenu.push({
				'id':'findTVShowButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findTVShowButton').offset();
						awxUI.$tvShowsContent
							.defaultFindBox({id:'tvShowFindBox', searchItems: xbmc.getSearchTerm('tvshows'), top: pos.top, left: pos.left});
						return false;
					}
			});
			videoTvShowsContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$tvShowsContent.empty();
						awxUI.onTvShowsShow();

						return false;
					}
			});
			
			this.tvShowsPage = videosPage.addPage({
				title: mkf.lang.get('page_title_tvshows'),
				content: this.$tvShowsContent,
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_tvshows'),
				contextMenu: videoTvShowsContextMenu,
				onShow: $.proxy(this, "onTvShowsShow"),
				className: 'tv'
			});

			//For recently added eps
			this.$tvShowsRecentlyAddedContent = $('<div class="pageContentWrapper"></div>');
			var videoTvShowsRecentlyAddedContextMenu = $.extend(true, [], standardVideosContextMenu);
			videoTvShowsRecentlyAddedContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$tvShowsRecentlyAddedContent.empty();
						awxUI.onTvShowsRecentlyAddedShow();

						return false;
					}
			});
			/*videoTvShowsRecentlyAddedContextMenu.push({
				'id':'findTVShowButton', 'icon':'find', 'title':mkf.lang.get('ctxt_btn_find'), 'shortcut':'Ctrl+2', 'onClick':
					function(){
						var pos = $('#findTVShowButton').offset();
						awxUI.$tvShowsRecentlyAddedContent
							.defaultFindBox({id:'tvShowFindBox', searchItems:'.thumbWrapper', top: pos.top, left: pos.left});
						return false;
					}
			});*/
			
			this.tvShowsRecentlyAddedPage = videosPage.addPage({
				title: mkf.lang.get('page_title_tv_recentlyadded'),
				content: this.$tvShowsRecentlyAddedContent,
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_tv_recentlyadded'),
				contextMenu: videoTvShowsRecentlyAddedContextMenu,
				onShow: $.proxy(this, "onTvShowsRecentlyAddedShow"),
				className: 'recentTV'
			});
			// end recently added eps
			
			//Music Videos
			this.$musicVideosContent = $('<div class="pageContentWrapper"></div>');
			var musicVideosContextMenu = $.extend(true, [], standardVideosContextMenu);
			musicVideosContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$musicVideosContent.empty();
						awxUI.onMusicVideosShow();

						return false;
					}
			});

			this.musicVideosPage = videosPage.addPage({
				title: mkf.lang.get('page_title_musicvideos'),
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_musicvideos'),
				content: this.$musicVideosContent,
				contextMenu: musicVideosContextMenu,
				onShow: $.proxy(this, "onMusicVideosShow"),
				className: 'musicVideos'
			});
			//end Music Videos
			
			//Video Files
			this.$videoFilesContent = $('<div class="pageContentWrapper"></div>');
			this.videoFilesPage = videosPage.addPage({
				title: mkf.lang.get('page_title_video_files'),
				content: this.$videoFilesContent,
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_video_files'),
				contextMenu: standardVideosContextMenu,
				onShow: $.proxy(this, "onVideoFilesShow"),
				className: 'videofiles'
			});

			//Video Playlist
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
			videoPlaylistContextMenu.push({
				'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
					function(){
						awxUI.$videoPlaylistContent.empty();
						awxUI.onVideoPlaylistShow();

						return false;
					}
			});
			
			this.videoPlaylistPage = videosPage.addPage({
				title: mkf.lang.get('page_title_video_playlist'),
				content: this.$videoPlaylistContent,
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_video_playlist'),
				contextMenu: videoPlaylistContextMenu,
				onShow: $.proxy(this, "onVideoPlaylistShow"),
				className: 'videoPlaylist'
			});
			
			//Video Scan
			this.$videoScanContent = $('<div class="pageContentWrapper"></div>');
			var videoScanContextMenu = $.extend(true, [], standardVideosContextMenu);
			
			this.videoScanPage = videosPage.addPage({
				title: mkf.lang.get('page_title_video_scan'),
				content: this.$videoScanContent,
				menuButtonText: '&raquo; ' + mkf.lang.get('page_buttontext_video_scan'),
				contextMenu: videoScanContextMenu,
				onShow: $.proxy(this, "onVideoScanShow"),
				className: 'videoscan'
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
								'<img src="images/loading_thumb.gif" alt="Preload 1/8" />' +
								'<img src="images/loading_thumbBanner.gif" alt="Preload 2/8" />' +
								'<img src="images/loading_thumbPoster.gif" alt="Preload 3/8" />' +
								'<img src="images/thumbBanner.png" alt="Preload 4/8" />' +
								'<img src="images/thumbPoster.png" alt="Preload 5/8" />' +
								'<img src="images/thumb.png" alt="Preload 6/8" />' +
								'<img src="ui.light/images/messagelog.png" alt="Preload 7/8" />' +
								'<img src="ui.light/images/loading.gif" alt="Preload 8/8" />' +
							'</div>' +
							'<div id="header">' +
								'<div id="controls">' +
									'<div class="mute unmuted"></div><div id="volumeSlider"></div>' +
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
			
			$('.' + mkf.cookieSettings.get('startPage', 'recentTV') + ' a').click();
			//$('#navigation ul.mkfMenu > li > a, ul.systemMenu > li > a').click(function(){ $('#navigation ul.mkfMenu ul, ul.systemMenu ul').hide(); });
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
		 * Called when Genres Artists-Page is shown. *
		 **************************************/
		onArtistsGenresShow: function() {
			if (this.$artistsGenresContent.html() == '') {
				var artistsGenresPage = this.artistsGenresPage;
				var $contentBox = this.$artistsGenresContent;
				$contentBox.addClass('loading');

				xbmc.getAudioGenres({
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed_artist_list'), mkf.messageLog.status.error, 5000);
						$contentBox.removeClass('loading');
					},

					onSuccess: function(result) {
						$contentBox.defaultArtistsGenresViewer(result, artistsGenresPage);
						$contentBox.removeClass('loading');
					}
				});
			}
		},
		
		/**************************************
		 * Called when Music playlists-Page is shown. *
		 **************************************/
		onMusicPlaylistsShow: function() {
			if (this.$MusicPlaylistsContent.html() == '') {
				var MusicPlaylistsPage = this.MusicPlaylistsPage;
				var $contentBox = this.$MusicPlaylistsContent;
				$contentBox.addClass('loading');

				xbmc.getMusicPlaylists({
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
						$contentBox.removeClass('loading');
					},

					onSuccess: function(result) {
						$contentBox.defaultMusicPlaylistsViewer(result, MusicPlaylistsPage);
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

		
		/**************************************
		 * Called when Albums Recent -Page is shown. *
		 **************************************/
		onAlbumsRecentShow: function() {
			if (this.$albumsRecentContent.html() == '') {
				var albumsPage = this.albumsRecentPage;
				var $contentBox = this.$albumsRecentContent;
				$contentBox.addClass('loading');

				xbmc.getRecentlyAddedAlbums({
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed_album_list'), mkf.messageLog.status.error, 5000);
						$contentBox.removeClass('loading');
					},

					onSuccess: function(result) {
						$contentBox.defaultAlbumRecentViewer(result, albumsPage);
						$contentBox.removeClass('loading');
					}
				});
			}
		},
		
		/**************************************
		 * Called when Music Videos -Page is shown. *
		 **************************************/
		onMusicVideosShow: function() {
			if (this.$musicVideosContent.html() == '') {
				var musicVideosPage = this.musicVideosPage;
				var $contentBox = this.$musicVideosContent;
				$contentBox.addClass('loading');

				xbmc.getMusicVideos({
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed_musicvideo_list'), mkf.messageLog.status.error, 5000);
						$contentBox.removeClass('loading');
					},

					onSuccess: function(result) {
						$contentBox.defaultMusicVideosViewer(result, musicVideosPage);
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


		/*********************************************
		 * Called when Movie sets-Page is shown.          *
		 *********************************************/
		onMovieSetsShow: function() {

			if (this.$movieSetsContent.html() == '') {
				var movieSetsPage = this.movieSetsPage;
				var $contentBox = this.$movieSetsContent;
				$contentBox.addClass('loading');

				xbmc.getMovieSets({
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed_movie_list'), mkf.messageLog.status.error, 5000);
						$contentBox.removeClass('loading');
					},

					onSuccess: function(result) {
						$contentBox.defaultMovieSetsViewer(result, movieSetsPage);
						$contentBox.removeClass('loading');
					}
				});
			}
		},

		/**************************************
		 * Called when Video playlists-Page is shown. *
		 **************************************/
		onVideoPlaylistsShow: function() {
			if (this.$VideoPlaylistsContent.html() == '') {
				var VideoPlaylistsPage = this.VideoPlaylistsPage;
				var $contentBox = this.$VideoPlaylistsContent;
				$contentBox.addClass('loading');

				xbmc.getVideoPlaylists({
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
						$contentBox.removeClass('loading');
					},

					onSuccess: function(result) {
						$contentBox.defaultVideoPlaylistsViewer(result, VideoPlaylistsPage);
						$contentBox.removeClass('loading');
					}
				});
			}
		},
		
		/*********************************************
		 * Called when Recent Movie-Page is shown.          *
		 *********************************************/
		onMoviesRecentShow: function() {
			if (this.$moviesRecentContent.html() == '') {
				var $contentBox = this.$moviesRecentContent;
				$contentBox.addClass('loading');

				xbmc.getRecentlyAddedMovies({
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed_movie_list'), mkf.messageLog.status.error, 5000);
						$contentBox.removeClass('loading');
					},

					onSuccess: function(result) {
						$contentBox.defaultMovieRecentViewer(result);
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

		/***************************************
		 * Called when Tv-RecentlyAdded-Page is shown. *
		 ***************************************/
		onTvShowsRecentlyAddedShow: function() {
			if (this.$tvShowsRecentlyAddedContent.html() == '') {
				var tvShowsRecentlyAddedPage = this.tvShowsRecentlyAddedPage;
				var $contentBox = this.$tvShowsRecentlyAddedContent;
				$contentBox.addClass('loading');

				xbmc.getRecentlyAddedEpisodes({
					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed_tvshow_list'), mkf.messageLog.status.error, 5000);
						$contentBox.removeClass('loading');
					},

					onSuccess: function(result) {
						$contentBox.defaultRecentlyAddedEpisodesViewer(result, tvShowsRecentlyAddedPage);
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
		},
		
		/*********************************************
		 * Called when Video-Scan-Page is shown. *
		 *********************************************/
		onVideoScanShow: function() {
			var $contentBox = this.$videoScanContent;
			$contentBox.empty();
			$contentBox.defaultVideoScanViewer('Video');
		},
		
		/*********************************************
		 * Called when Music-Scan-Page is shown. *
		 *********************************************/
		onMusicScanShow: function() {
			var $contentBox = this.$musicScanContent;
			$contentBox.empty();
			$contentBox.defaultMusicScanViewer('Music');
		}




	}); // END awxUI


})(jQuery);
