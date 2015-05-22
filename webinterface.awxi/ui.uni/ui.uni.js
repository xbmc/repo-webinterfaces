/*
 *  AWX - Ajax based Webinterface for XBMC
 *  Copyright (C) 2012  MKay, mizaki
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

//var awxUI = {};

(function($) {

  $.extend(awxUI, {
    // --- Pages ---
    artistsPage: null,
    artistsGenresPage: null,
    albumsPage: null,
    musicVideosPage: null,
    MusicPlaylistsPage: null,
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
    videoGenres: null,
    videoFilesPage: null,
    videoPlaylistPage: null,
    videoScanPage: null,
    videoAddonsPage: null,
    videoAdFilterPage: null,

    // --- Page Content ---
    $musicContent: null,
    $artistsContent: null,
    $artistsGenresContent: null,
    $MusicPlaylistsContent: null,
    $albumsContent: null,
    $musicVideosContent: null,
    $albumsRecentContent: null,
    $musicFilesContent: null,
    $musicPlaylistContent: null,
    $musicScanContent: null,
    $musicAddonsContent: null,

    $videosContent: null,
    $moviesContent: null,
    $VideoPlaylistsContent: null,
    $moviesRecentContent: null,
    $videoGenresContent: null,
    $tvShowsContent: null,
    $tvShowsRecentlyAddedContent: null,
    $videoFilesContent: null,
    $videoPlaylistContent: null,
    $videoScanContent: null,
    $videoAdFilterContent: null,



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
     *     - Artists      *
     *     - Genres        *
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
        title: mkf.lang.get('Music', 'Page and menu'),
        menuButtonText: '<span class="icon music"></span>',
        content: this.$musicContent,
        className: 'music'
      });

      var standardMusicContextMenu = [{
            'icon':'back', 'title':mkf.lang.get('Back', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function(){
              mkf.pages.showPage(musicPage);
              return false;
            }
          }];
          
      // Artists root
      this.$artistsContent = $('<div class="pageContentWrapper"></div>');
      var artistsContextMenu = $.extend(true, [], standardMusicContextMenu);
      
      this.artistsPage = musicPage.addPage({
        title: mkf.lang.get('Artists', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Artists', 'Page and menu'),
        content: this.$artistsContent,
        contextMenu: artistsContextMenu,
        onShow: $.proxy(this, "onArtistsShow"),
        className: 'artists'
      });
      
      //Enable it to be passed to mkf.pages.showPage
      var artistsPage = this.artistsPage;
      
      // Artists Title
      this.$artistsTitleContent = $('<div class="pageContentWrapper"></div>');
      var artistsTitleContextMenu = $.extend(true, [], standardMusicContextMenu);
      artistsTitleContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(artistsPage);
            return false;
          }
      });
      artistsTitleContextMenu.push({
        'id':'findArtistsTitleButton', 'icon':'find', 'title':mkf.lang.get('Find', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var pos = $('#findArtistsTitleButton').offset();
            //awxUI.$artistsTitleContent
              //.defaultFindBox({id:'artistsTitleFindBox', searchItems: xbmc.getSearchTerm('artists'), top: pos.top +50, left: pos.left});
            $.fn.defaultFindBox({id:'artistsTitleFindBox', searchItems: xbmc.getSearchTerm('artists'), top: pos.top +50, left: pos.left}, {searchType: 'artists', library: 'audio', field: 'artist'}, awxUI.artistsTitlePage);
            return false;
          }
      });
      artistsTitleContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            lastArtistCount = awxUI.settings.limitArtists
            lastArtistCountStart = 0;
            awxUI.$artistsTitleContent.empty();
            awxUI.onArtistsTitleShow();

            return false;
          }
      });
      
      this.artistsTitlePage = this.artistsPage.addPage({
        title: mkf.lang.get('Titles', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Titles', 'Page and menu'),
        content: this.$artistsTitleContent,
        contextMenu: artistsTitleContextMenu,
        onShow: $.proxy(this, "onArtistsTitleShow"),
        className: 'artistsTitle'
      });
      
      // Artists Genres
      this.$artistsGenresContent = $('<div class="pageContentWrapper"></div>');
      var artistsGenresContextMenu = $.extend(true, [], standardMusicContextMenu);
      artistsGenresContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(artistsPage);
            return false;
          }
      });
      /*artistsGenresContextMenu.push({
        'id':'findArtistsGenresButton', 'icon':'find', 'title':mkf.lang.get('Find', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var pos = $('#findArtistsGenresButton').offset();
            awxUI.$artistsGenresContent
              .defaultFindBox({id:'artistsGenresFindBox', searchItems: xbmc.getSearchTerm('agenres'), top: pos.top +50, left: pos.left});
            return false;
          }
      });*/
      artistsGenresContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$artistsGenresContent.empty();
            awxUI.onArtistsGenresShow();

            return false;
          }
      });  
      
      this.artistsGenresPage = this.artistsPage.addPage({
        title: mkf.lang.get('Genres', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Genres', 'Page and menu'),
        content: this.$artistsGenresContent,
        contextMenu: artistsGenresContextMenu,
        onShow: $.proxy(this, "onArtistsGenresShow"),
        className: 'artistsGenres'
      });
     
      //playlists m3u smart etc.
      this.$MusicPlaylistsContent = $('<div class="pageContentWrapper"></div>');
      var MusicPlaylistsContextMenu = $.extend(true, [], standardMusicContextMenu);
      MusicPlaylistsContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$MusicPlaylistsContent.empty();
            awxUI.onMusicPlaylistsShow();

            return false;
          }
      });  
      
      this.MusicPlaylistsPage = musicPage.addPage({
        title: mkf.lang.get('Playlists', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Playlists', 'Page and menu'),
        content: this.$MusicPlaylistsContent,
        contextMenu: MusicPlaylistsContextMenu,
        onShow: $.proxy(this, "onMusicPlaylistsShow"),
        className: 'MusicPlaylists'
      });

      // Albums page
      this.$albumsContent = $('<div class="pageContentWrapper"></div>');
      var musicAlbumsContextMenu = $.extend(true, [], standardMusicContextMenu);
      
      this.albumsPage = musicPage.addPage({
        title: mkf.lang.get('Albums', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Albums', 'Page and menu'),
        content: this.$albumsContent,
        contextMenu: musicAlbumsContextMenu,
        onShow: $.proxy(this, "onAlbumsShow"),
        className: 'albums'
      });
      
      //Enable it to be passed to mkf.pages.showPage
      var albumsPage = this.albumsPage;
      
      // Albums -> Albums title
      this.$albumsTitleContent = $('<div class="pageContentWrapper"></div>');
      var musicAlbumsTitleContextMenu = $.extend(true, [], standardMusicContextMenu);
      musicAlbumsTitleContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(albumsPage);
            return false;
          }
      });
      musicAlbumsTitleContextMenu.push({
        'id':'findAlbumTitleButton', 'icon':'find', 'title':mkf.lang.get('Find', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var pos = $('#findAlbumTitleButton').offset();
            //awxUI.$albumsTitleContent
              //.defaultFindBox({id:'albumsTitleFindBox', searchItems: xbmc.getSearchTerm('albums'), top: pos.top +50, left: pos.left});
            $.fn.defaultFindBox({id:'albumsTitleFindBox', searchItems: xbmc.getSearchTerm('albums'), top: pos.top +50, left: pos.left}, {searchType: 'albums', library: 'audio', field: 'album'}, awxUI.albumsTitlePage);
            return false;
          }
      });
      musicAlbumsTitleContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            lastAlbumCount = awxUI.settings.limitAlbums;
            lastAlbumCountStart = 0;
            awxUI.$albumsTitleContent.empty();
            awxUI.onAlbumsTitleShow();

            return false;
          }
      });
      
      this.albumsTitlePage = this.albumsPage.addPage({
        title: mkf.lang.get('Titles', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Titles', 'Page and menu'),
        content: this.$albumsTitleContent,
        contextMenu: musicAlbumsTitleContextMenu,
        onShow: $.proxy(this, "onAlbumsTitleShow"),
        className: 'albumsTitle'
      });

      //recent albums
      this.$albumsRecentContent = $('<div class="pageContentWrapper"></div>');
      var musicAlbumsRecentContextMenu = $.extend(true, [], standardMusicContextMenu);
      musicAlbumsRecentContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(albumsPage);
            return false;
          }
      });
      musicAlbumsRecentContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$albumsRecentContent.empty();
            awxUI.onAlbumsRecentShow();

            return false;
          }
      });

      this.albumsRecentPage = this.albumsPage.addPage({
        title: mkf.lang.get('Recently Added', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Recently Added', 'Page and menu'),
        content: this.$albumsRecentContent,
        contextMenu: musicAlbumsRecentContextMenu,
        onShow: $.proxy(this, "onAlbumsRecentShow"),
        className: 'recentAlbums'
      });
      //end recent albums
      
      //recent played albums
      this.$albumsRecentPlayedContent = $('<div class="pageContentWrapper"></div>');
      var musicAlbumsRecentPlayedContextMenu = $.extend(true, [], standardMusicContextMenu);
      musicAlbumsRecentPlayedContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(albumsPage);
            return false;
          }
      });
      musicAlbumsRecentPlayedContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$albumsRecentPlayedContent.empty();
            awxUI.onAlbumsRecentPlayedShow();

            return false;
          }
      });

      this.albumsRecentPlayedPage = this.albumsPage.addPage({
        title: mkf.lang.get('Recently Played', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Recently Played', 'Page and menu'),
        content: this.$albumsRecentPlayedContent,
        contextMenu: musicAlbumsRecentPlayedContextMenu,
        onShow: $.proxy(this, "onAlbumsRecentPlayedShow"),
        className: 'recentAlbumsPlayed'
      });
      //end recent played albums
      
      //Years albums
      this.$albumsYearsContent = $('<div class="pageContentWrapper"></div>');
      var musicAlbumsYearsContextMenu = $.extend(true, [], standardMusicContextMenu);
      musicAlbumsYearsContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(albumsPage);
            return false;
          }
      });
      musicAlbumsYearsContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$albumsYearsContent.empty();
            awxUI.onAlbumsYearsShow();

            return false;
          }
      });

      this.albumsYearsPage = this.albumsPage.addPage({
        title: mkf.lang.get('Years', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Years', 'Page and menu'),
        content: this.$albumsYearsContent,
        contextMenu: musicAlbumsYearsContextMenu,
        onShow: $.proxy(this, "onAlbumsYearsShow"),
        className: 'albumsYears'
      });
      //end Years albums
      
      // Album Genres
      this.$albumGenresContent = $('<div class="pageContentWrapper"></div>');
      var albumGenresContextMenu = $.extend(true, [], standardMusicContextMenu);
      albumGenresContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(albumsPage);
            return false;
          }
      });
      /*albumGenresContextMenu.push({
        'id':'findAlbumGenresButton', 'icon':'find', 'title':mkf.lang.get('Find', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var pos = $('#findAlbumGenresButton').offset();
            awxUI.$artistsGenresContent
              .defaultFindBox({id:'albumGenresFindBox', searchItems: xbmc.getSearchTerm('agenres'), top: pos.top +50, left: pos.left});
            return false;
          }
      });*/
      albumGenresContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$albumGenresContent.empty();
            awxUI.onAlbumGenresShow();

            return false;
          }
      });  
      
      this.albumGenresPage = this.albumsPage.addPage({
        title: mkf.lang.get('Genres', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Genres', 'Page and menu'),
        content: this.$albumGenresContent,
        contextMenu: albumGenresContextMenu,
        onShow: $.proxy(this, "onAlbumGenresShow"),
        className: 'albumGenres'
      });

      // Songs root
      this.$songsContent = $('<div class="pageContentWrapper"></div>');
      var songsContextMenu = $.extend(true, [], standardMusicContextMenu);
      
      this.songsPage = musicPage.addPage({
        title: mkf.lang.get('Songs', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Songs', 'Page and menu'),
        content: this.$songsContent,
        contextMenu: songsContextMenu,
        onShow: $.proxy(this, "onSongsShow"),
        className: 'songs'
      });
      
      var songsPage = this.songsPage;
      
      //Songs Titles
      this.$songsTitleContent = $('<div class="pageContentWrapper"></div>');
      var songsTitleContextMenu = $.extend(true, [], standardMusicContextMenu);
      songsTitleContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(songsPage);
            return false;
          }
      });
      songsTitleContextMenu.push({
        'id':'findSongsTitlesButton', 'icon':'find', 'title':mkf.lang.get('Find', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var pos = $('#findSongsTitlesButton').offset();
            //awxUI.$artistsGenresContent
              //.defaultFindBox({id:'songsTitlesFindBox', searchItems: xbmc.getSearchTerm('agenres'), top: pos.top +50, left: pos.left});
            $.fn.defaultFindBox({id:'songsTitlesFindBox', searchItems: xbmc.getSearchTerm('agenres'), top: pos.top +50, left: pos.left}, {searchType: 'songs', library: 'audio', field: 'title'}, awxUI.songsTitlePage);
            return false;
          }
      });
      songsTitleContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            lastSongsCountStart = 0;
            lastSongsCount = awxUI.settings.limitSongs;
            awxUI.$songsTitleContent.empty();
            awxUI.onSongsTitleShow();

            return false;
          }
      });

      this.songsTitlePage = this.songsPage.addPage({
        title: mkf.lang.get('Titles', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Titles', 'Page and menu'),
        content: this.$songsTitleContent,
        contextMenu: songsTitleContextMenu,
        onShow: $.proxy(this, "onSongsTitleShow"),
        className: 'songsTitle'
      });
      //end songs title
      
      //recent songs
      this.$songsRecentContent = $('<div class="pageContentWrapper"></div>');
      var musicSongsRecentContextMenu = $.extend(true, [], standardMusicContextMenu);
      musicSongsRecentContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(songsPage);
            return false;
          }
      });
      musicSongsRecentContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$songsRecentContent.empty();
            awxUI.onSongsRecentShow();

            return false;
          }
      });

      this.songsRecentPage = this.songsPage.addPage({
        title: mkf.lang.get('Recently Added', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Recently Added', 'Page and menu'),
        content: this.$songsRecentContent,
        contextMenu: musicSongsRecentContextMenu,
        onShow: $.proxy(this, "onSongsRecentShow"),
        className: 'recentSongs'
      });
      //end recent songs
      
      //recent played songs
      this.$songsRecentPlayedContent = $('<div class="pageContentWrapper"></div>');
      var musicSongsRecentPlayedContextMenu = $.extend(true, [], standardMusicContextMenu);
      musicSongsRecentPlayedContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(songsPage);
            return false;
          }
      });
      musicSongsRecentPlayedContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$songsRecentPlayedContent.empty();
            awxUI.onSongsRecentPlayedShow();

            return false;
          }
      });

      this.songsRecentPlayedPage = this.songsPage.addPage({
        title: mkf.lang.get('Recently Played', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Recently Played', 'Page and menu'),
        content: this.$songsRecentPlayedContent,
        contextMenu: musicSongsRecentPlayedContextMenu,
        onShow: $.proxy(this, "onSongsRecentPlayedShow"),
        className: 'recentPlayedSongs'
      });
      //end recent played songs
      
      //Songs Artists
      this.$songsArtistsContent = $('<div class="pageContentWrapper"></div>');
      var songsArtistsContextMenu = $.extend(true, [], standardMusicContextMenu);
      songsArtistsContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(songsPage);
            return false;
          }
      });
      songsArtistsContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$songsArtistsContent.empty();
            awxUI.onSongsArtistsShow();

            return false;
          }
      });

      this.songsArtistsPage = this.songsPage.addPage({
        title: mkf.lang.get('Artists', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Artists', 'Page and menu'),
        content: this.$songsArtistsContent,
        contextMenu: songsArtistsContextMenu,
        onShow: $.proxy(this, "onSongsArtistsShow"),
        className: 'songsArtists'
      });
      //end songs artists
      
      //Years songs
      this.$songsYearsContent = $('<div class="pageContentWrapper"></div>');
      var musicSongsYearsContextMenu = $.extend(true, [], standardMusicContextMenu);
      musicSongsYearsContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(songsPage);
            return false;
          }
      });
      musicSongsYearsContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$songsYearsContent.empty();
            awxUI.onSongsYearsShow();

            return false;
          }
      });

      this.songsYearsPage = this.songsPage.addPage({
        title: mkf.lang.get('Years', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Years', 'Page and menu'),
        content: this.$songsYearsContent,
        contextMenu: musicSongsYearsContextMenu,
        onShow: $.proxy(this, "onSongsYearsShow"),
        className: 'songsYears'
      });
      //end Years songs
      
      // Song Genres
      this.$songGenresContent = $('<div class="pageContentWrapper"></div>');
      var songGenresContextMenu = $.extend(true, [], standardMusicContextMenu);
      songGenresContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(songsPage);
            return false;
          }
      });
      /*songGenresContextMenu.push({
        'id':'findSongGenresButton', 'icon':'find', 'title':mkf.lang.get('Find', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var pos = $('#findSongGenresButton').offset();
            awxUI.$songGenresContent
              .defaultFindBox({id:'songGenresFindBox', searchItems: xbmc.getSearchTerm('agenres'), top: pos.top +50, left: pos.left});
            return false;
          }
      });*/
      songGenresContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$artistsGenresContent.empty();
            awxUI.onSongGenresShow();

            return false;
          }
      });  
      
      this.songGenresPage = this.songsPage.addPage({
        title: mkf.lang.get('Genres', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Genres', 'Page and menu'),
        content: this.$songGenresContent,
        contextMenu: songGenresContextMenu,
        onShow: $.proxy(this, "onSongGenresShow"),
        className: 'songGenres'
      });
      
      // PVR radio
      this.$pvrradioContent = $('<div class="pageContentWrapper"></div>');
      var pvrradioContextMenu = $.extend(true, [], standardMusicContextMenu);
      /*pvrradioContextMenu.push({
        'id':'findRadioButton', 'icon':'find', 'title':mkf.lang.get('Find', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var pos = $('#findRadioButton').offset();
            awxUI.$artistsContent
              .defaultFindBox({id:'radioFindBox', searchItems: xbmc.getSearchTerm('channels'), top: pos.top +50, left: pos.left});
            return false;
          }
      });*/
      pvrradioContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$pvrradioContent.empty();
            awxUI.onPVRRadioShow();

            return false;
          }
      });
      
      this.pvrradioPage = musicPage.addPage({
        title: mkf.lang.get('PVR Radio', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('PVR Radio', 'Page and menu'),
        content: this.$pvrradioContent,
        contextMenu: pvrradioContextMenu,
        onShow: $.proxy(this, "onPVRRadioShow"),
        className: 'pvrradio'
      });
      
      //Music Files
      this.$musicFilesContent = $('<div class="pageContentWrapper"></div>');
      var musicFilesContextMenu = $.extend(true, [], standardMusicContextMenu);
      
      musicFilesContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$musicFilesContent.empty();
            awxUI.onMusicFilesShow();
            return false;
          }
      });
      
      this.musicFilesPage = musicPage.addPage({
        title: mkf.lang.get('Files', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Files', 'Page and menu'),
        content: this.$musicFilesContent,
        contextMenu: musicFilesContextMenu,
        onShow: $.proxy(this, "onMusicFilesShow"),
        className: 'audiofiles'
      });
      
      //Playlist
      this.$musicPlaylistContent = $('<div class="pageContentWrapper"></div>');
      var musicPlaylistContextMenu = $.extend(true, [], standardMusicContextMenu);
      musicPlaylistContextMenu.push({
        'icon':'clear', 'title':mkf.lang.get('Clear Playlist', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Clear Playlist... ', 'Popup message with addition'));

            xbmc.clearAudioPlaylist({
              onSuccess: function () {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 5000, mkf.messageLog.status.success);
                // reload playlist
                awxUI.onMusicPlaylistShow();
              },

              onError: function () {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 5000, mkf.messageLog.status.error);
              }
            });

            return false;
          }
      });
      musicPlaylistContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$musicPlaylistContent.empty();
            awxUI.onMusicPlaylistShow();
            return false;
          }
      });
     /* musicPlaylistContextMenu.push({
        'id':'findPlaylistButton', 'icon':'find', 'title':mkf.lang.get('Find', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var pos = $('#findPlaylistButton').offset();
            awxUI.$musicPlaylistContent
              .defaultFindBox({id:'playlistFindBox', searchItems: xbmc.getSearchTerm('aplaylist'), top: pos.top +50, left: pos.left});
            return false;
          }
      });*/
      musicPlaylistContextMenu.push({
        'id':'findPlaylistButton', 'icon':'locate', 'title':mkf.lang.get('Locate currently playing', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            $('.musicPlaylist').scrollTo($('.playlistItemCur'));
            return false;
          }
      });
      this.musicPlaylistPage = musicPage.addPage({
        title: mkf.lang.get('Now Playing', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Now Playing', 'Page and menu'),
        content: this.$musicPlaylistContent,
        contextMenu: musicPlaylistContextMenu,
        onShow: $.proxy(this, "onMusicPlaylistShow"),
        className: 'musicPlaylist'
      });

      //Music Scan
      this.$musicScanContent = $('<div class="pageContentWrapper"></div>');
      var musicScanContextMenu = $.extend(true, [], standardMusicContextMenu);
      
      this.musicScanPage = musicPage.addPage({
        title: mkf.lang.get('Library Tools', 'Page and menu'),
        content: this.$musicScanContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Library Tools', 'Page and menu'),
        contextMenu: musicScanContextMenu,
        onShow: $.proxy(this, "onMusicScanShow"),
        className: 'scanMusic'
      });
      
      //Audio Addons
      this.$audioAddonsContent = $('<div class="pageContentWrapper"></div>');
      var musicScanContextMenu = $.extend(true, [], standardVideosContextMenu);
      
      this.audioAddonsPage = musicPage.addPage({
        title: mkf.lang.get('Addons', 'Page and menu'),
        content: this.$audioAddonsContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Addons', 'Page and menu'),
        contextMenu: musicScanContextMenu,
        onShow: $.proxy(this, "onAudioAddonsShow"),
        className: 'audioAddons'
      });
      
      //Audio Advanced Filter
      this.$audioAdFilterContent = $('<div class="pageContentWrapper"></div>');
      var audioAdFilterContextMenu = $.extend(true, [], standardMusicContextMenu);
      
      this.audioAdFilterPage = musicPage.addPage({
        title: mkf.lang.get('Advanced Search', 'Page and menu'),
        content: this.$audioAdFilterContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Advanced Search', 'Page and menu'),
        contextMenu: audioAdFilterContextMenu,
        onShow: $.proxy(this, "onAudioAdFilterShow"),
        className: 'audioAdFilter'
      });
      
      // --- VIDEOS ---
      this.$videosContent = $('<div class="pageContentWrapper"></div>');
      var videosPage = mkf.pages.addPage({
        title: mkf.lang.get('Video', 'Page and menu'),
        menuButtonText: '<span class="icon videos"></span>',
        content: this.$videosContent,
        className: 'videos'
      });

      var standardVideosContextMenu = [{
            'icon':'back', 'title':mkf.lang.get('Back', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function(){
              mkf.pages.showPage(videosPage);
              return false;
            }
          }];
          
      //Movies
      this.$moviesContent = $('<div class="pageContentWrapper"></div>');
      var videoMoviesContextMenu = $.extend(true, [], standardVideosContextMenu);
      
      this.moviesPage = videosPage.addPage({
        title: mkf.lang.get('Movies', 'Page and menu'),
        content: this.$moviesContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Movies', 'Page and menu'),
        contextMenu: videoMoviesContextMenu,
        onShow: $.proxy(this, "onMoviesShow"),
        className: 'movies'
      });
      
      //Required to use mkf.pages.showPage
      var moviesPage = this.moviesPage;
      
      //Sub Movies title
      this.$moviesTitleContent = $('<div class="pageContentWrapper"></div>');
      var videoMoviesTitleContextMenu = $.extend(true, [], standardVideosContextMenu);
      videoMoviesTitleContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(moviesPage);
            return false;
          }
      });
      videoMoviesTitleContextMenu.push({
        'id':'findMovieTitleButton', 'icon':'find', 'title':mkf.lang.get('Find', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var pos = $('#findMovieTitleButton').offset();
            //awxUI.$moviesTitleContent
              $.fn.defaultFindBox({id:'moviesTitleFindBox', searchItems: xbmc.getSearchTerm('movies'), top: pos.top +50, left: pos.left}, {searchType: 'movies'}, awxUI.moviesTitlePage);
            return false;
          }
      });
      videoMoviesTitleContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            lastMovieCountStart = 0;
            lastMovieCount = awxUI.settings.limitMovies;
            awxUI.$moviesTitleContent.empty();
            awxUI.onMoviesTitleShow();

            return false;
          }
      });
      
      this.moviesTitlePage = this.moviesPage.addPage({
        title: mkf.lang.get('Titles', 'Page and menu'),
        content: this.$moviesTitleContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Titles', 'Page and menu'),
        contextMenu: videoMoviesTitleContextMenu,
        onShow: $.proxy(this, "onMoviesTitleShow"),
        className: 'moviesTitle'
      });
      

      //Sub Movie sets
      this.$movieSetsContent = $('<div class="pageContentWrapper"></div>');
      var videoMovieSetsContextMenu = $.extend(true, [], standardVideosContextMenu);
      videoMovieSetsContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(moviesPage);
            return false;
          }
      });
      /*videoMovieSetsContextMenu.push({
        'id':'findMovieSetsButton', 'icon':'find', 'title':mkf.lang.get('Find', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var pos = $('#findMovieSetsButton').offset();
            awxUI.$movieSetsContent
              .defaultFindBox({id:'moviesetsFindBox', searchItems: xbmc.getSearchTerm('moviesets'), top: pos.top +50, left: pos.left});
            return false;
          }
      });*/
      videoMovieSetsContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$movieSetsContent.empty();
            awxUI.onMovieSetsShow();

            return false;
          }
      });
      
      this.movieSetsPage = this.moviesPage.addPage({
        title: mkf.lang.get('Movie Sets', 'Page and menu'),
        content: this.$movieSetsContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Movie Sets', 'Page and menu'),
        contextMenu: videoMovieSetsContextMenu,
        onShow: $.proxy(this, "onMovieSetsShow"),
        className: 'moviesets'
      });
      
      
      //playlists video smart etc.
      this.$VideoPlaylistsContent = $('<div class="pageContentWrapper"></div>');
      var VideoPlaylistsContextMenu = $.extend(true, [], standardVideosContextMenu);
      VideoPlaylistsContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$VideoPlaylistsContent.empty();
            awxUI.onVideoPlaylistsShow();

            return false;
          }
      });  
      
      this.VideoPlaylistsPage = videosPage.addPage({
        title: mkf.lang.get('Playlists', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Playlists', 'Page and menu'),
        content: this.$VideoPlaylistsContent,
        contextMenu: VideoPlaylistsContextMenu,
        onShow: $.proxy(this, "onVideoPlaylistsShow"),
        className: 'videoPlaylists'
      });

      
      //Sub Recent movies
      this.$moviesRecentContent = $('<div class="pageContentWrapper"></div>');
      var videoMoviesRecentContextMenu = $.extend(true, [], standardVideosContextMenu);
      videoMoviesRecentContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(moviesPage);
            return false;
          }
      });
      videoMoviesRecentContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$moviesRecentContent.empty();
            awxUI.onMoviesRecentShow();

            return false;
          }
      });

      this.moviesRecentPage = this.moviesPage.addPage({
        title: mkf.lang.get('Recently Added', 'Page and menu'),
        content: this.$moviesRecentContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Recently Added', 'Page and menu'),
        contextMenu: videoMoviesRecentContextMenu,
        onShow: $.proxy(this, "onMoviesRecentShow"),
        className: 'recentMovies'
      });
      //end recent movies
      
      //Movie genres
      this.$movieGenresContent = $('<div class="pageContentWrapper"></div>');
      var movieGenresContextMenu = $.extend(true, [], standardVideosContextMenu);
      movieGenresContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(moviesPage);
            return false;
          }
      });
      movieGenresContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$movieGenresContent.empty();
            awxUI.onMovieGenresShow();

            return false;
          }
      });

      this.movieGenresPage = this.moviesPage.addPage({
        title: mkf.lang.get('Genres', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Genres', 'Page and menu'),
        content: this.$movieGenresContent,
        contextMenu: movieGenresContextMenu,
        onShow: $.proxy(this, "onMovieGenresShow"),
        className: 'movieGenres'
      });
      //end Movie genres
      
      //Years
      this.$movieYearsContent = $('<div class="pageContentWrapper"></div>');
      var movieYearsContextMenu = $.extend(true, [], standardVideosContextMenu);
      movieYearsContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(moviesPage);
            return false;
          }
      });
      movieYearsContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$movieYearsContent.empty();
            awxUI.onMovieYearsShow();

            return false;
          }
      });

      this.movieYearsPage = this.moviesPage.addPage({
        title: mkf.lang.get('Years', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Years', 'Page and menu'),
        content: this.$movieYearsContent,
        contextMenu: movieYearsContextMenu,
        onShow: $.proxy(this, "onMovieYearsShow"),
        className: 'movieYears'
      });
      //end Years
      
      //Tags
      this.$movieTagsContent = $('<div class="pageContentWrapper"></div>');
      var movieTagsContextMenu = $.extend(true, [], standardVideosContextMenu);
      movieTagsContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(moviesPage);
            return false;
          }
      });
      movieTagsContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$movieTagsContent.empty();
            awxUI.onMovieTagsShow();

            return false;
          }
      });

      this.movieTagsPage = this.moviesPage.addPage({
        title: mkf.lang.get('Tags', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Tags', 'Page and menu'),
        content: this.$movieTagsContent,
        contextMenu: movieTagsContextMenu,
        onShow: $.proxy(this, "onMovieTagsShow"),
        className: 'movieTags'
      });
      //end Tags
      
      //TV Shows
      this.$tvShowsContent = $('<div class="pageContentWrapper"></div>');
      var videoTvShowsContextMenu = $.extend(true, [], standardVideosContextMenu);
      
      this.tvShowsPage = videosPage.addPage({
        title: mkf.lang.get('TV Shows', 'Page and menu'),
        content: this.$tvShowsContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('TV Shows', 'Page and menu'),
        contextMenu: videoTvShowsContextMenu,
        onShow: $.proxy(this, "onTvShowsShow"),
        className: 'tv'
      });
      
      var tvShowsPage = this.tvShowsPage;
      
      //Sub TV Shows title
      this.$tvShowsTitleContent = $('<div class="pageContentWrapper"></div>');
      var videoTvShowsTitleContextMenu = $.extend(true, [], standardVideosContextMenu);
      videoTvShowsTitleContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(tvShowsPage);
            return false;
          }
      });
      videoTvShowsTitleContextMenu.push({
        'id':'findTVShowTitleButton', 'icon':'find', 'title':mkf.lang.get('Find', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var pos = $('#findTVShowTitleButton').offset();
            $.fn.defaultFindBox({id:'tvShowFindBox', searchItems: xbmc.getSearchTerm('tvshows'), top: pos.top +50, left: pos.left}, {searchType: 'tvshows'}, awxUI.tvShowsTitlePage);
            return false;
          }
      });
      videoTvShowsTitleContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            lastTVCountStart = 0;
            lastTVCount = awxUI.settings.limitTV;
            awxUI.$tvShowsTitleContent.empty();
            awxUI.onTvShowsTitleShow();

            return false;
          }
      });
      
      this.tvShowsTitlePage = this.tvShowsPage.addPage({
        title: mkf.lang.get('Titles', 'Page and menu'),
        content: this.$tvShowsTitleContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Titles', 'Page and menu'),
        contextMenu: videoTvShowsTitleContextMenu,
        onShow: $.proxy(this, "onTvShowsTitleShow"),
        className: 'tvTitle'
      });

      //For recently added eps
      this.$tvShowsRecentlyAddedContent = $('<div class="pageContentWrapper"></div>');
      var videoTvShowsRecentlyAddedContextMenu = $.extend(true, [], standardVideosContextMenu);
      videoTvShowsRecentlyAddedContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(tvShowsPage);
            return false;
          }
      });
      videoTvShowsRecentlyAddedContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$tvShowsRecentlyAddedContent.empty();
            awxUI.onTvShowsRecentlyAddedShow();

            return false;
          }
      });
      
      this.tvShowsRecentlyAddedPage = this.tvShowsPage.addPage({
        title: mkf.lang.get('Recently Added', 'Page and menu'),
        content: this.$tvShowsRecentlyAddedContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Recently Added', 'Page and menu'),
        contextMenu: videoTvShowsRecentlyAddedContextMenu,
        onShow: $.proxy(this, "onTvShowsRecentlyAddedShow"),
        className: 'recentTV'
      });
      // end recently added eps
      
      //TV genres
      this.$tvShowsGenresContent = $('<div class="pageContentWrapper"></div>');
      var tvShowsGenresContextMenu = $.extend(true, [], standardVideosContextMenu);
      tvShowsGenresContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(tvShowsPage);
            return false;
          }
      });
      tvShowsGenresContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$tvShowsGenresContent.empty();
            awxUI.onTvShowsGenresShow();

            return false;
          }
      });

      this.tvShowsGenresPage = this.tvShowsPage.addPage({
        title: mkf.lang.get('Genres', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Genres', 'Page and menu'),
        content: this.$tvShowsGenresContent,
        contextMenu: tvShowsGenresContextMenu,
        onShow: $.proxy(this, "onTvShowsGenresShow"),
        className: 'tvShowsGenres'
      });
      //end TV genres
      
      //TV Years
      this.$tvShowsYearsContent = $('<div class="pageContentWrapper"></div>');
      var tvShowsYearsContextMenu = $.extend(true, [], standardVideosContextMenu);
      tvShowsYearsContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(tvShowsPage);
            return false;
          }
      });
      tvShowsYearsContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$tvShowsYearsContent.empty();
            awxUI.onTvShowsYearsShow();

            return false;
          }
      });

      this.tvShowsYearsPage = this.tvShowsPage.addPage({
        title: mkf.lang.get('Years', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Years', 'Page and menu'),
        content: this.$tvShowsYearsContent,
        contextMenu: tvShowsYearsContextMenu,
        onShow: $.proxy(this, "onTvShowsYearsShow"),
        className: 'tvShowsYears'
      });
      //end TV Years
      
      //tvShows Tags
      this.$tvShowsTagsContent = $('<div class="pageContentWrapper"></div>');
      var tvShowsTagsContextMenu = $.extend(true, [], standardVideosContextMenu);
      tvShowsTagsContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(tvShowsPage);
            return false;
          }
      });
      tvShowsTagsContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$tvShowsTagsContent.empty();
            awxUI.onTvShowsTagsShow();

            return false;
          }
      });

      this.tvShowsTagsPage = this.tvShowsPage.addPage({
        title: mkf.lang.get('Tags', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Tags', 'Page and menu'),
        content: this.$tvShowsTagsContent,
        contextMenu: tvShowsTagsContextMenu,
        onShow: $.proxy(this, "onTvShowsTagsShow"),
        className: 'tvShowsTags'
      });
      //end tvShows Tags
      
      //Music Videos
      this.$musicVideosContent = $('<div class="pageContentWrapper"></div>');
      var musicVideosContextMenu = $.extend(true, [], standardVideosContextMenu);

      this.musicVideosPage = videosPage.addPage({
        title: mkf.lang.get('Music Videos', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Music Videos', 'Page and menu'),
        content: this.$musicVideosContent,
        contextMenu: musicVideosContextMenu,
        onShow: $.proxy(this, "onMusicVideosShow"),
        className: 'musicVideos'
      });
      
      var musicVideoPage = this.musicVideosPage;
      
      //end Music Videos
      
      //Music Videos Title
      this.$musicVideosTitleContent = $('<div class="pageContentWrapper"></div>');
      var musicVideosTitleContextMenu = $.extend(true, [], standardVideosContextMenu);
      musicVideosTitleContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(musicVideoPage);
            return false;
          }
      });
      musicVideosTitleContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$musicVideosTitleContent.empty();
            awxUI.onMusicVideosTitleShow();

            return false;
          }
      });

      this.musicVideosTitlePage = this.musicVideosPage.addPage({
        title: mkf.lang.get('Titles', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Titles', 'Page and menu'),
        content: this.$musicVideosTitleContent,
        contextMenu: musicVideosTitleContextMenu,
        onShow: $.proxy(this, "onMusicVideosTitleShow"),
        className: 'musicVideosTitle'
      });
      //end Music Videos
      
      //For recently added music videos
      this.$musicVideosRecentContent = $('<div class="pageContentWrapper"></div>');
      var musicVideosRecentlyAddedContextMenu = $.extend(true, [], standardVideosContextMenu);
      musicVideosRecentlyAddedContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(musicVideoPage);
            return false;
          }
      });
      musicVideosRecentlyAddedContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$musicVideosRecentContent.empty();
            awxUI.onMusicVideosRecentlyAddedShow();

            return false;
          }
      });
      
      this.musicVideosRecentlyAddedPage = this.musicVideosPage.addPage({
        title: mkf.lang.get('Recently Added', 'Page and menu'),
        content: this.$musicVideosRecentContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Recently Added', 'Page and menu'),
        contextMenu: musicVideosRecentlyAddedContextMenu,
        onShow: $.proxy(this, "onMusicVideosRecentlyAddedShow"),
        className: 'recentMusicVideos'
      });
      // end recently added music videos
      
      //music videos genres
      this.$musicVideosGenresContent = $('<div class="pageContentWrapper"></div>');
      var musicVideosGenresContextMenu = $.extend(true, [], standardVideosContextMenu);
      musicVideosGenresContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(musicVideoPage);
            return false;
          }
      });
      musicVideosGenresContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$musicVideosGenresContent.empty();
            awxUI.onMusicVideosGenresShow();

            return false;
          }
      });

      this.musicVideosGenresPage = this.musicVideosPage.addPage({
        title: mkf.lang.get('Genres', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Genres', 'Page and menu'),
        content: this.$musicVideosGenresContent,
        contextMenu: musicVideosGenresContextMenu,
        onShow: $.proxy(this, "onMusicVideosGenresShow"),
        className: 'musicVideosGenres'
      });
      //end music videos genres
      
      //music videos Years
      this.$musicVideosYearsContent = $('<div class="pageContentWrapper"></div>');
      var musicVideosYearsContextMenu = $.extend(true, [], standardVideosContextMenu);
      musicVideosYearsContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(musicVideoPage);
            return false;
          }
      });
      musicVideosYearsContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$musicVideosYearsContent.empty();
            awxUI.onMusicVideosYearsShow();

            return false;
          }
      });

      this.musicVideosYearsPage = this.musicVideosPage.addPage({
        title: mkf.lang.get('Years', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Years', 'Page and menu'),
        content: this.$musicVideosYearsContent,
        contextMenu: musicVideosYearsContextMenu,
        onShow: $.proxy(this, "onMusicVideosYearsShow"),
        className: 'musicVideosYears'
      });
      //end music videos Years
      
      //musicVideos Tags
      this.$musicVideosTagsContent = $('<div class="pageContentWrapper"></div>');
      var musicVideosTagsContextMenu = $.extend(true, [], standardVideosContextMenu);
      musicVideosTagsContextMenu.push({
        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
          function() {
            mkf.pages.showPage(musicVideoPage);
            return false;
          }
      });
      musicVideosTagsContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$musicVideosTagsContent.empty();
            awxUI.onMusicVideosTagsShow();

            return false;
          }
      });

      this.musicVideosTagsPage = this.musicVideosPage.addPage({
        title: mkf.lang.get('Tags', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('Tags', 'Page and menu'),
        content: this.$musicVideosTagsContent,
        contextMenu: musicVideosTagsContextMenu,
        onShow: $.proxy(this, "onMusicVideosTagsShow"),
        className: 'musicVideosTags'
      });
      //end music videos Tags
      
      // PVR TV
      this.$pvrtvContent = $('<div class="pageContentWrapper"></div>');
      var pvrtvContextMenu = $.extend(true, [], standardVideosContextMenu);
      /*pvrtvContextMenu.push({
        'id':'findPVRtvButton', 'icon':'find', 'title':mkf.lang.get('Find', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var pos = $('#findPVRtvButton').offset();
            awxUI.$pvrtvContent
              .defaultFindBox({id:'pvrtvFindBox', searchItems: xbmc.getSearchTerm('channels'), top: pos.top +50, left: pos.left});
            return false;
          }
      });*/
      pvrtvContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$pvrtvContent.empty();
            awxUI.onPVRtvShow();

            return false;
          }
      });
      
      this.pvrtvPage = videosPage.addPage({
        title: mkf.lang.get('PVR TV', 'Page and menu'),
        menuButtonText: '&raquo; ' + mkf.lang.get('PVR TV', 'Page and menu'),
        content: this.$pvrtvContent,
        contextMenu: pvrtvContextMenu,
        onShow: $.proxy(this, "onPVRtvShow"),
        className: 'pvrtv'
      });
      
      //Video Files
      this.$videoFilesContent = $('<div class="pageContentWrapper"></div>');
      var videoFilesContextMenu = $.extend(true, [], standardVideosContextMenu);
      videoFilesContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$videoFilesContent.empty();
            awxUI.onVideoFilesShow();

            return false;
          }
      });
      
      this.videoFilesPage = videosPage.addPage({
        title: mkf.lang.get('Files', 'Page and menu'),
        content: this.$videoFilesContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Files', 'Page and menu'),
        contextMenu: videoFilesContextMenu,
        onShow: $.proxy(this, "onVideoFilesShow"),
        className: 'videofiles'
      });

      //Video Playlist
      this.$videoPlaylistContent = $('<div class="pageContentWrapper"></div>');
      var videoPlaylistContextMenu = $.extend(true, [], standardVideosContextMenu);
      videoPlaylistContextMenu.push({
        'icon':'clear', 'title':mkf.lang.get('Clear Playlist', 'Tool tip'), 'shortcut':'Ctrl+2', 'onClick':
          function(){
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Clear Playlist... ', 'Popup message with addition'));

            xbmc.clearVideoPlaylist({
              onSuccess: function () {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 5000, mkf.messageLog.status.success);
                // reload playlist
                awxUI.onVideoPlaylistShow();
              },

              onError: function () {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 5000, mkf.messageLog.status.error);
              }
            });

            return false;
          }
      });
      videoPlaylistContextMenu.push({
        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
          function(){
            awxUI.$videoPlaylistContent.empty();
            awxUI.onVideoPlaylistShow();

            return false;
          }
      });
      
      this.videoPlaylistPage = videosPage.addPage({
        title: mkf.lang.get('Now Playing', 'Page and menu'),
        content: this.$videoPlaylistContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Now Playing', 'Page and menu'),
        contextMenu: videoPlaylistContextMenu,
        onShow: $.proxy(this, "onVideoPlaylistShow"),
        className: 'videoPlaylist'
      });
      
      //Video Scan
      this.$videoScanContent = $('<div class="pageContentWrapper"></div>');
      var videoScanContextMenu = $.extend(true, [], standardVideosContextMenu);
      
      this.videoScanPage = videosPage.addPage({
        title: mkf.lang.get('Library Tools', 'Page and menu'),
        content: this.$videoScanContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Library Tools', 'Page and menu'),
        contextMenu: videoScanContextMenu,
        onShow: $.proxy(this, "onVideoScanShow"),
        className: 'videoscan'
      });

      //Video Addons
      this.$videoAddonsContent = $('<div class="pageContentWrapper"></div>');
      var videoAddonsContextMenu = $.extend(true, [], standardVideosContextMenu);
      
      this.videoAddonsPage = videosPage.addPage({
        title: mkf.lang.get('Addons', 'Page and menu'),
        content: this.$videoAddonsContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Addons', 'Page and menu'),
        contextMenu: videoAddonsContextMenu,
        onShow: $.proxy(this, "onVideoAddonsShow"),
        className: 'videoAddons'
      });
      
      //Video Advanced Filter
      this.$videoAdFilterContent = $('<div class="pageContentWrapper"></div>');
      var videoAdFilterContextMenu = $.extend(true, [], standardVideosContextMenu);
      
      this.videoAdFilterPage = videosPage.addPage({
        title: mkf.lang.get('Advanced Search', 'Page and menu'),
        content: this.$videoAdFilterContent,
        menuButtonText: '&raquo; ' + mkf.lang.get('Advanced Search', 'Page and menu'),
        contextMenu: videoAdFilterContextMenu,
        onShow: $.proxy(this, "onVideoAdFilterShow"),
        className: 'videoAdFilter'
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

      $('body').append('<div id="preload" style="display: none">' +
                '<img src="images/loading_thumb.gif" alt="Preload 1" />' +
                '<img src="images/loading_thumbBanner.gif" alt="Preload 2" />' +
                '<img src="images/loading_thumbPoster.gif" alt="Preload 3" />' +
                '<img src="images/thumbBanner.png" alt="Preload 4" />' +
                '<img src="images/thumbPoster.png" alt="Preload 5" />' +
                '<img src="images/thumb.png" alt="Preload 6" />' +
                '<img src="ui.uni/images/messagelog.png" alt="Preload 7" />' +
                '<img src="ui.uni/images/loading.gif" alt="Preload 8" />' +
                '<img src="ui.uni/images/big_buttons.png" alt="Preload 9" />' +
                '<img src="ui.uni/images/buttons.png" alt="Preload 10" />' +
                '<img src="ui.uni/images/context_buttons.png" alt="Preload 11" />' +
                '<img src="ui.uni/images/mini_buttons.png" alt="Preload 12" />' +
                '<img src="ui.uni/images/controls_big.png" alt="Preload 13" />' +
                '<img src="ui.uni/images/controls_big_player.png" alt="Preload 14" />' +
                '<img src="ui.uni/images/flagging/aCodecs.png" alt="Preload 15" />' +
                '<img src="ui.uni/images/flagging/vCodecs.png" alt="Preload 16" />' +
                '<img src="ui.uni/images/flagging/channels.png" alt="Preload 17" />' +
                '<img src="ui.uni/images/quick_controls.png" alt="Preload 18" />' +
                '<img src="images/empty_cover_music.png" alt="Preload 19" />' +
                '<img src="images/empty_cover_musicvideo.png" alt="Preload 20" />' +
                '<img src="images/empty_cover_artist.png" alt="Preload 21" />' +
                '<img src="images/empty_poster_film.png" alt="Preload 22" />' +
                '<img src="images/empty_poster_filmset.png" alt="Preload 23" />' +
                '<img src="images/empty_poster_tv.png" alt="Preload 24" />' +
                '<img src="images/empty_banner_artist.png" alt="Preload 25" />' +
                '<img src="images/empty_banner_film.png" alt="Preload 26" />' +
                '<img src="images/empty_banner_tv.png" alt="Preload 27" />' +
                '<img src="images/empty_thumb_tv.png" alt="Preload 28" />' +
                '<img src="images/emptyActor.png" alt="Preload 29" />' +

              '</div>' +
              '<div id="fullscreen" style="display: none; position: absolute; z-index: 60; width: 100%; height: 100%;"><a class="button minimise" href="" title="' + mkf.lang.get('Exit Full Screen', 'Tool tip') + '"></a><a class="button lyrics" href="" title="' + mkf.lang.get('Show Lyrics', 'Tool tip') + '"></a>' +
                '<div id="lyricContent"><div id="lyricInfo"></div><div id="lyrics"></div></div>' +
                '<div id="playing" style="display: none">' +
                  '<div id="now"><span id="nowspan"><span class="label" /><span class="seperator"></span><span class="nowArtist artist" /><span class="nowTitle" /></span></div>' +
                  '<div id="nowTime"><span id="nowspan"><span class="timePlayed" /><span class="seperator">/</span><span class="timeTotal" /></span></div>' +
                  '<div id="FSartwork" ><a href="" class="artclose"></a><img class="discThumb" src="images/blank_cdart.png" style="display: none; width: 194px; height: 194px; position: absolute; z-index: -1;"><img class="artThumb" src="images/empty_poster_overlay.png"></div>' +
                '</div>' +
              '</div>' +
              '<div id="secondBG"></div>' +
              '<div id="firstBG"></div>' +
              '<div id="background">' +
                '<div id="header">' +
                '<div id="navigation"></div>'+
                '<div id="statusLine"><div id="location"></div><div id="contextMenu"></div></div>' +
              '</div>' + 
              '<div id="displayoverlaytop"><div class="playingSliderWrapper"><div class="playingSlider"></div></div></div>' +
              '<div id="displayoverlayleft"><div id="volumeSlider"></div></div>' +
              '<div id="content">' +
                //'<div id="displayoverlay">' +
                //'<div id="displayoverlaytop"><div class="playingSliderWrapper"><div class="playingSlider"></div></div></div>' +
                //'<div style="position: fixed; bottom: 100px; left: 5px; z-index: 50; height: 100%;"><div id="volumeSlider"></div></div>' +
                /*'<div id="displayoverlaybot">' +
                '<div id="artwork"><img class="discThumb" src="images/blank_cdart.png" style="display: none; width: 194px; height: 194px; position: absolute; z-index: -1;"><img class="artThumb" src="images/thumbPoster.png"></div>' +
                '<div id="controls"></div><div class="menucon" style="height: 50px; width: 330px"></div>' +
                '</div>' +*///<div class="playingSliderWrapper"><div class="playingSlider"></div></div></div>' +
                //'</div>' +
              '</div>' +
              '<div id="displayoverlaybot"><div id="controlsPlayer32"></div><div id="controlsInput32"></div>' +
                '<div id="artwork"><a href="" class="artclose"></a><img class="discThumb" src="images/blank_cdart.png" style="display: none; width: 194px; height: 194px; position: absolute; z-index: -1;"><img class="artThumb" src="images/empty_poster_overlay.png"></div>' +
              '</div>' +
              '<div id="footer">' +
                '<div id="simple_controls"></div><div id="infoContainer"></div>' +
                '<div id="statPlayerContainer"><div id="streamdets"><div class="vFormat" /><div class="aspect" /><div class="vCodec" /><div class="aCodec" /><div class="channels" /><div class="vSubtitles" style="display: none" /></div>' +
                '<div id="statusInputkey"><a class="button inputcontrols" href="" title="Control Keys"></a></div>' +
                '<div id="statusPlayer"><div id="statusPlayerRow"><div id="paused"></div><div id="shuffled"></div></div><div id="statusPlayerRow"><div id="repeating"></div><div id="muted"></div></div></div>' +
                '<div id="remainPlayer"><div id="remaining">' + mkf.lang.get('Remaining:', 'Footer label') + ' <span class="timeRemain">00:00</span></div><div id="plTotal">' + mkf.lang.get('Total:', 'Footer label') + ' <span class="timeTotal">00:00</span></div></div>' +
              //'<div id="statPlayerContainer"><div id="statusPlayer"><div id="statusPlayerRow"><div id="paused"></div><div id="shuffled"></div></div><div id="statusPlayerRow"><div id="repeating"></div><div id="muted"></div></div></div><div id="remainPlayer"><div id="remaining">Remaing:</div><div id="plTotal">Playlist Total:</div></div>' +
                '<div id="controller"></div></div>' +
              '</div>' +
              '<div id="messageLog"></div></div>'
              );


      var $stylesheet = $('<link rel="stylesheet" type="text/css" />').appendTo('head');
      $stylesheet.attr('href', 'ui.uni/css/layout.css');
      // does not work in IE 8
      // $('<link rel="stylesheet" type="text/css" href="ui.lightDark/css/layout.css" />').appendTo('head');

      $('#messageLog').mkfMessageLog();
      $('#location').mkfLocationBar({clickable: true, autoKill: true, prepend: '&raquo; '});
      $('#navigation').mkfMenu();
      $('#content').mkfPages();
      $('#contextMenu').mkfPageContextMenu();

      $('#footer #simple_controls').simcontrols();
      $('#displayoverlaybot .menucon').topcontrols();
      $('#controlsPlayer32').controlsPlayer32();
      $('#controlsInput32').controlsInput32();
      $('#controlsPlayer24').controlsPlayer24();
      $('#controlsInput24').controlsInput24();
      $('#artwork a.artclose').click(function() { $('#artwork').hide(); return false; } );
      $('#infoContainer').uniFooterStatus();
      $('#statusInputkey a.inputcontrols').on('click', function() {
        xbmc.inputKeys('toggle');
        return false;
      });
      $('#controller').on('click', function() {

        //awxUI.settings.remoteActive = ( awxUI.settings.remoteActive? false : true );
        //Duplicate XBMC key functions
        /*if (!awxUI.settings.remoteActive) {
          xbmc.inputKeys('on');
        } else {
          xbmc.inputKeys('off');
        };*/
        
        
        $('#displayoverlayleft').toggle();
        $('#displayoverlaytop').toggle();
        $('#displayoverlaybot').toggle();
        $('#content').toggleClass('controls');
        $('#artwork').show().fadeOut(8000);
      });
      
      $('#fullscreen a.lyrics').click(function() {
        $('div#lyricContent').toggle();
        xbmc.lyrics = (xbmc.lyrics? false : true);
        if (xbmc.lyrics) { addons.culrcLyrics(); };
        return false;
      });
        
      //$('#currentlyPlaying').defaultCurrentlyPlaying({effect:'fade'});
      $('#volumeSlider').defaultVolumeControl({vertical: true});

      var $sysMenu = $('<ul class="systemMenu">').appendTo($('#navigation'));
      $sysMenu.defaultSystemButtons();
      $sysMenu.find('a').wrap('<li>');
      $sysMenu.find('a.settings').prepend('<span class="icon settings"></span>');
      $sysMenu.find('a.exit').prepend('<span class="icon exit"></span>');

      $('#displayoverlaybot').hide();
      $('#displayoverlaytop').hide();
      $('#displayoverlayleft').hide();
      $('#statusPlayer #statusPlayerRow').children().hide()
      //$('#statusPlayer').hide();


      
      //Set menu width to largest item. Can't seem to do this with CSS. IE9 and FF work but Chrome doubles parent UL width.
      setTimeout(function() {
      
        //Show menus so we can grab the widths.
        $('#navigation ul.mkfMenu .mkfSubMenu1, ul.systemMenu ul').show();
        
        $('.mkfSubMenu2').parent().addClass('subMenu');
        
        //Set root menu (music and video) width as it can't (QED) be done in CSS. Timeout is to allow the menu to draw.
        $("#navigation ul.mkfMenu .music .mkfSubMenu1").each(function() { // Loop through all the menu items that have submenu items
          var Widest=0; 
          var ThisWidth=0;

          $($(this).children()).each(function() {
            ThisWidth=parseInt($(this).css('width'));

            if (ThisWidth>Widest) {
              Widest=ThisWidth;
            }
          });

          Widest+='px';

          $(this).hide();
          $(this).children().children().css('width',Widest);
        });
        
        
        $("#navigation ul.mkfMenu .videos .mkfSubMenu1").each(function() { 
          var Widest=0; 
          var ThisWidth=0; 

          $($(this).children()).each(function() { 
            ThisWidth=parseInt($(this).css('width'));

            if (ThisWidth>Widest) { 
              Widest=ThisWidth;
            }
          });

          Widest+='px'; // Add the unit

          $(this).hide();
          $(this).children().children().css('width',Widest);
        });
      }, 500);
      
      // Hover for menus
      $('#navigation ul.mkfMenu > li, ul.systemMenu > li').hover(function() {
        // Mouse in
        var submenu = $(this).find('ul:first');
        
        submenu.stop(true, true);
        $(this).addClass('mouseover');
        submenu.slideDown('fast');

      }, function() {
        // Mouse out
        var submenu = $(this).find('ul:first');
        if (submenu.length == 0) // no submenu
          $(this).removeClass('mouseover');
        else
          submenu.slideUp('fast', function() {
            $(this).parent().removeClass('mouseover');
          });
      });
      
      
      
      $('.' + awxUI.settings.startPage + ' a').click();
      
      xbmc.musicPlaylist = $('div.musicPlaylist');
      xbmc.videoPlaylist = $('div.videoPlaylist');

      //Set player controls and input keys to on if required
      if (awxUI.settings.inputKey == 2) {
        xbmc.inputKeys('on');
      }
      if (awxUI.settings.actionOnPlay == 4) {
        $('#displayoverlayleft').toggle();
        $('#displayoverlaytop').toggle();
        $('#displayoverlaybot').toggle();
        $('#content').toggleClass('controls');
        $('#artwork').show().fadeOut(8000);
      }      
    },
    
     /**************************************
     * Called when Artist root-Page is shown. *
     **************************************/
    onArtistsShow: function(e) {
      if (this.$artistsContent.html() == '') {
        var artistsPage = awxUI.artistsPage;
        var $contentBox = awxUI.$artistsContent;
        $contentBox.addClass('loading');

        $contentBox.defaultArtistsViewer();
        $contentBox.removeClass('loading');

      }

      return false
    },
    
    /**************************************
     * Called when Artists Title-Page is shown. *
     **************************************/
    onArtistsTitleShow: function(e) {
      var artistsTitlePage = awxUI.artistsTitlePage;
      awxUI.$artistsTitleContent.empty();
        if (typeof lastArtistCount === 'undefined') { (awxUI.settings.artistsView == 'logosingle'? lastArtistCount = 1 : lastArtistCount = awxUI.settings.limitArtists) };
        if (typeof lastArtistCountStart === 'undefined') { lastArtistCountStart = 0 };
        if (typeof e != 'undefined') {
          if (e.data.Page == 'next') {
          lastArtistCount = parseInt(lastArtistCount) + parseInt(awxUI.settings.limitArtists);
          lastArtistCountStart += parseInt(awxUI.settings.limitArtists);
          };
          if (e.data.Page == 'prev') {
          lastArtistCount = parseInt(lastArtistCount) - parseInt(awxUI.settings.limitArtists);
          lastArtistCountStart -= parseInt(awxUI.settings.limitArtists);
          if (lastArtistCount == 0) {
            lastArtistCount = totalArtistCount;
            lastArtistCountStart = totalArtistCount - awxUI.settings.limitArtists;
          } else if (lastArtistCount < 1 || lastArtistCountStart < 0){
            lastArtistCount = awxUI.settings.limitArtists;
            lastArtistCountStart = 0;
          };
          };
        };
        var $contentBox = awxUI.$artistsTitleContent;
        
        $contentBox.addClass('loading');

        xbmc.getArtists({
          start: lastArtistCountStart,
          end: lastArtistCount,
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultArtistsTitleViewer(result, artistsTitlePage);
            $contentBox.removeClass('loading');
          }
        });

      return false
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
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
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
     * Called when Genres Artists genre-Page is shown. *
     **************************************/
    onArtistsGenresShow: function() {
      if (this.$artistsGenresContent.html() == '') {
        var artistsGenresPage = this.artistsGenresPage;
        var $contentBox = this.$artistsGenresContent;
        $contentBox.addClass('loading');

        xbmc.getAudioGenres({
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultGenresViewer(result, artistsGenresPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },

    /**************************************
     * Called when Albums root-Page is shown. *
     **************************************/
    onAlbumsShow: function(e) {
      if (this.$albumsContent.html() == '') {
        var albumsPage = this.albumsPage;
        var $contentBox = awxUI.$albumsContent;
        $contentBox.addClass('loading');

        $contentBox.defaultAlbumViewer();
        $contentBox.removeClass('loading');

      }

      return false
    },
    
    /**************************************
     * Called when Albums title-Page is shown. *
     **************************************/
    onAlbumsTitleShow: function(e) {
      var albumsTitlePage = awxUI.albumsTitlePage;
      awxUI.$albumsTitleContent.empty();
        if (typeof lastAlbumCount === 'undefined') { lastAlbumCount = awxUI.settings.limitAlbums };
        if (typeof lastAlbumCountStart === 'undefined') { lastAlbumCountStart = 0 };
        if (typeof e != 'undefined') {
          if (e.data.Page == 'next') {
          lastAlbumCount = parseInt(lastAlbumCount) + parseInt(awxUI.settings.limitAlbums);
          lastAlbumCountStart += parseInt(awxUI.settings.limitAlbums);
          };
          if (e.data.Page == 'prev') {
          lastAlbumCount = parseInt(lastAlbumCount) - parseInt(awxUI.settings.limitAlbums);
          lastAlbumCountStart -= parseInt(awxUI.settings.limitAlbums);
          if (lastAlbumCount == 0) {
            lastAlbumCount = totalAlbumCount;
            lastAlbumCountStart = totalAlbumCount - awxUI.settings.limitAlbums;
          } else if (lastAlbumCount < 1 || lastAlbumCountStart < 0){
            lastAlbumCount = awxUI.settings.limitAlbums;
            lastAlbumCountStart = 0;
          };
          };
        };
        var $contentBox = awxUI.$albumsTitleContent;
        $contentBox.addClass('loading');

        xbmc.getAlbums({
          start: lastAlbumCountStart,
          end: lastAlbumCount,
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultAlbumTitleViewer(result, albumsTitlePage);
            $contentBox.removeClass('loading');
          }
        });
      //}
      return false
    },

    /**************************************
     * Called when Albums Recent -Page is shown. *
     **************************************/
    onAlbumsRecentShow: function() {
      if (this.$albumsRecentContent.html() == '') {
        var albumsRecentPage = this.albumsRecentPage;
        var $contentBox = this.$albumsRecentContent;
        $contentBox.addClass('loading');

        xbmc.getRecentlyAddedAlbums({
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultAlbumRecentViewer(result, albumsRecentPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /**************************************
     * Called when Albums Recent Played-Page is shown. *
     **************************************/
    onAlbumsRecentPlayedShow: function() {
      if (this.$albumsRecentPlayedContent.html() == '') {
        var albumsRecentPlayedPage = this.albumsRecentPlayedPage;
        var $contentBox = this.$albumsRecentPlayedContent;
        $contentBox.addClass('loading');

        xbmc.getRecentlyPlayedAlbums({
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultAlbumRecentViewer(result, albumsRecentPlayedPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /**************************************
     * Called when Albums Years -Page is shown. *
     **************************************/
    onAlbumsYearsShow: function() {
      if (this.$albumsYearsContent.html() == '') {
        var albumsYearsPage = this.albumsYearsPage;
        var $contentBox = this.$albumsYearsContent;
        $contentBox.addClass('loading');

        //Can't get years via proper method, use DB direct e.g. "musicdb://9/1965/"
        xbmc.getDirectory({
          media: 'files',
          directory: 'musicdb://9/',
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultYearsViewer(result, albumsYearsPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /**************************************
     * Called when Genres Album genre-Page is shown. *
     **************************************/
    onAlbumGenresShow: function() {
      if (this.$albumGenresContent.html() == '') {
        var albumGenresPage = this.albumGenresPage;
        var $contentBox = this.$albumGenresContent;
        $contentBox.addClass('loading');

        xbmc.getAudioGenres({
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultGenresViewer(result, albumGenresPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /**************************************
     * Called when Songs root-Page is shown. *
     **************************************/
    onSongsShow: function(e) {
      if (this.$songsContent.html() == '') {
        var songsPage = this.songsPage;
        var $contentBox = awxUI.$songsContent;
        $contentBox.addClass('loading');

        $contentBox.defaultSongsViewer();
        $contentBox.removeClass('loading');

      }

      return false
    },
    
    /**************************************
     * Called when Songs title-Page is shown. *
     **************************************/
    onSongsTitleShow: function(e) {
      var songsTitlePage = awxUI.songsTitlePage;
      awxUI.$songsTitleContent.empty();
        if (typeof lastSongsCount === 'undefined') { lastSongsCount = awxUI.settings.limitSongs };
        if (typeof lastSongsCountStart === 'undefined') { lastSongsCountStart = 0 };
        if (typeof e != 'undefined') {
          if (e.data.Page == 'next') {
          lastSongsCount = parseInt(lastSongsCount) + parseInt(awxUI.settings.limitSongs);
          lastSongsCountStart += parseInt(awxUI.settings.limitSongs);
          };
          if (e.data.Page == 'prev') {
          lastSongsCount = parseInt(lastSongsCount) - parseInt(awxUI.settings.limitSongs);
          lastSongsCountStart -= parseInt(awxUI.settings.limitSongs);
          if (lastSongsCount == 0) {
            lastSongsCount = totalSongsCount;
            lastSongsCountStart = totalSongsCount - awxUI.settings.limitSongs;
          } else if (lastSongsCount < 1 || lastSongsCountStart < 0){
            lastSongsCount = awxUI.settings.limitSongs;
            lastSongsCountStart = 0;
          };
          };
        };
      var $contentBox = awxUI.$songsTitleContent;
      $contentBox.addClass('loading');

      xbmc.getSongs({
        start: lastSongsCountStart,
        end: lastSongsCount,
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          $contentBox.removeClass('loading');
        },

        onSuccess: function(result) {
          result.showDetails = true;
          $contentBox.defaultSonglistViewer(result, songsTitlePage);
          $contentBox.removeClass('loading');
        }
      });
      return false
    },
    
    /**************************************
     * Called when Songs Recent -Page is shown. *
     **************************************/
    onSongsRecentShow: function() {
      if (this.$songsRecentContent.html() == '') {
        var songsRecentPage = this.songsRecentPage;
        var $contentBox = this.$songsRecentContent;
        $contentBox.addClass('loading');

        xbmc.getRecentlyAddedSongs({
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            result.isFilter = true;
            result.showDetails = true;
            $contentBox.defaultSonglistViewer(result, songsRecentPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /**************************************
     * Called when Songs Recent -Page is shown. *
     **************************************/
    onSongsRecentPlayedShow: function() {
      if (this.$songsRecentPlayedContent.html() == '') {
        var songsRecentPlayedPage = this.songsRecentPlayedPage;
        var $contentBox = this.$songsRecentPlayedContent;
        $contentBox.addClass('loading');

        xbmc.getRecentlyPlayedSongs({
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            result.isFilter = true;
            result.showDetails = true;
            $contentBox.defaultSonglistViewer(result, songsRecentPlayedPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /**************************************
     * Called when Songs Artists -Page is shown. *
     **************************************/
    onSongsArtistsShow: function(e) {
      var songsArtistsPage = awxUI.songsArtistsPage;
      awxUI.$songsArtistsContent.empty();
        if (typeof lastArtistCount === 'undefined') { lastArtistCount = awxUI.settings.limitArtists };
        if (typeof lastArtistCountStart === 'undefined') { lastArtistCountStart = 0 };
        if (typeof e != 'undefined') {
          if (e.data.Page == 'next') {
          lastArtistCount = parseInt(lastArtistCount) + parseInt(awxUI.settings.limitArtists);
          lastArtistCountStart += parseInt(awxUI.settings.limitArtists);
          };
          if (e.data.Page == 'prev') {
          lastArtistCount = parseInt(lastArtistCount) - parseInt(awxUI.settings.limitArtists);
          lastArtistCountStart -= parseInt(awxUI.settings.limitArtists);
          if (lastArtistCount == 0) {
            lastArtistCount = totalArtistCount;
            lastArtistCountStart = totalArtistCount - awxUI.settings.limitArtists;
          } else if (lastArtistCount < 1 || lastArtistCountStart < 0){
            lastArtistCount = awxUI.settings.limitArtists;
            lastArtistCountStart = 0;
          };
          };
        };
        var $contentBox = awxUI.$songsArtistsContent;
        
        $contentBox.addClass('loading');

        xbmc.getArtists({
          start: lastArtistCountStart,
          end: lastArtistCount,
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultArtistsTitleViewer(result, songsArtistsPage);
            $contentBox.removeClass('loading');
          }
        });

      return false
    },
    
    /**************************************
     * Called when Songs Years -Page is shown. *
     **************************************/
    onSongsYearsShow: function() {
      if (this.$songsYearsContent.html() == '') {
        var songsYearsPage = this.songsYearsPage;
        var $contentBox = this.$songsYearsContent;
        $contentBox.addClass('loading');

        //Can't get years via proper method, use DB direct e.g. "musicdb://9/1965/"
        xbmc.getDirectory({
          media: 'files',
          directory: 'musicdb://9/',
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultYearsViewer(result, songsYearsPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
     /**************************************
     * Called when Genres Songs genre-Page is shown. *
     **************************************/
    onSongGenresShow: function() {
      if (this.$songGenresContent.html() == '') {
        var songGenresPage = this.songGenresPage;
        var $contentBox = this.$songGenresContent;
        $contentBox.addClass('loading');

        xbmc.getAudioGenres({
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultGenresViewer(result, songGenresPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
     /*********************************************
     * Called when Music Video-Page is shown. *
     *********************************************/
    onMusicVideosShow: function() {
      var $contentBox = this.$musicVideosContent;
      $contentBox.empty();
      $contentBox.defaultMusicVideosViewer('Video');
    },
    
    /**************************************
     * Called when Music Videos Title-Page is shown. *
     **************************************/
    onMusicVideosTitleShow: function(e) {
      awxUI.$musicVideosTitleContent.empty();
      if (typeof lastMVCount === 'undefined') { lastMVCount = awxUI.settings.limitMV };
        if (typeof lastMVCountStart === 'undefined') { lastMVCountStart = 0 };
        if (typeof e != 'undefined') {
          if (e.data.Page == 'next') {
            lastMVCount = parseInt(lastMVCount) + parseInt(awxUI.settings.limitMV);
            lastMVCountStart += parseInt(awxUI.settings.limitMV);
            };
            if (e.data.Page == 'prev') {
            lastMVCount = parseInt(lastMVCount) - parseInt(awxUI.settings.limitMV);
            lastMVCountStart -= parseInt(awxUI.settings.limitMV);
            if (lastMVCount == 0) {
              lastMVCount = totalMVCount;
              lastMVCountStart = totalMVCount - parseInt(awxUI.settings.limitMV);
            } else if (lastMVCount < 1 || lastMVCountStart < 0) {
              lastMVCount = parseInt(awxUI.settings.limitMV);
              lastMVCountStart = 0;
            };
          };
        }
      var musicVideosTitlePage = awxUI.musicVideosTitlePage;
      var $contentBox = awxUI.$musicVideosTitleContent;
      $contentBox.addClass('loading');

      xbmc.getMusicVideos({
        start: lastMVCountStart,
        end: lastMVCount,
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          $contentBox.removeClass('loading');
        },

        onSuccess: function(result) {
          $contentBox.defaultMusicVideosTitleViewer(result, musicVideosTitlePage);
          $contentBox.removeClass('loading');
        }
      });
      
      return false;
    },
    
    /*********************************************
     * Called when Recent Music Videos-Page is shown.          *
     *********************************************/
    onMusicVideosRecentlyAddedShow: function() {
      if (this.$musicVideosRecentContent.html() == '') {
        var musicVideosRecentPage = this.musicVideosRecentlyAddedPage;
        var $contentBox = this.$musicVideosRecentContent;
        $contentBox.addClass('loading');

        xbmc.getRecentlyAddedMusicVideos({
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultRecentlyAddedMusicVideosViewer(result, musicVideosRecentPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /*********************************************
     * Called when Music Videos Genres-Page is shown.          *
     *********************************************/
    onMusicVideosGenresShow: function() {

      if (this.$musicVideosGenresContent.html() == '') {
        var musicVideosGenresPage = this.musicVideosGenresPage;
        var $contentBox = this.$musicVideosGenresContent;
        $contentBox.addClass('loading');

        xbmc.getVideoGenres({
          type: 'musicvideo',
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultGenresViewer(result, musicVideosGenresPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /*********************************************
     * Called when Music Videos Years-Page is shown.          *
     *********************************************/
    onMusicVideosYearsShow: function() {

      if (this.$musicVideosYearsContent.html() == '') {
        var musicVideosYearsPage = this.musicVideosYearsPage;
        var $contentBox = this.$musicVideosYearsContent;
        $contentBox.addClass('loading');

        //Can't get years via proper method, use DB direct e.g. "videodb://1/3/1992"
        xbmc.getDirectory({
          media: 'files',
          directory: 'videodb://3/3/',
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultYearsViewer(result, musicVideosYearsPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /*********************************************
     * Called when Music Videos Tags-Page is shown.          *
     *********************************************/
    onMusicVideosTagsShow: function() {

      if (this.$musicVideosTagsContent.html() == '') {
        var musicVideosTagsPage = this.musicVideosTagsPage;
        var $contentBox = this.$musicVideosTagsContent;
        $contentBox.addClass('loading');

        //Can't get tags via proper method, use DB direct.
        xbmc.getDirectory({
          media: 'files',
          directory: 'videodb://3/9/',
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultTagsViewer(result, musicVideosTagsPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /*********************************************
     * Called when PVR Radio Page is shown.    *
     *********************************************/
    onPVRRadioShow: function() {
      if (this.$pvrradioContent.html() == '') {
        var pvrradioPage = this.pvrradioPage;
        var $contentBox = this.$pvrradioContent;
        $contentBox.addClass('loading');

        xbmc.pvrGetChannelGroups({
          group: 'radio',
          onError: function() {
            //mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultPVRViewer(result, pvrradioPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /**************************************
     * Called when Video Genres -Page is shown. *
     **************************************/
    onVideoGenresShow: function() {
      if (this.$videoGenresContent.html() == '') {
        var videoGenresPage = this.videoGenresPage;
        var $contentBox = this.$videoGenresContent;
        $contentBox.addClass('loading');

        $contentBox.defaultVideoGenresViewer(videoGenresPage);
        $contentBox.removeClass('loading');

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
          mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          $contentBox.removeClass('loading');
        },

        onSuccess: function(result) {
          $contentBox.defaultPlaylistViewer(result, 'Audio');
          $contentBox.removeClass('loading');
        }
      });
    },

    /*********************************************
     * Called when Movie-Page is shown. *
     *********************************************/
    onMoviesShow: function() {
      var $contentBox = this.$moviesContent;
      $contentBox.empty();
      $contentBox.defaultMovieViewer('Video');
    },

    /*********************************************
     * Called when Movie Title Page is shown.          *
     *********************************************/
    onMoviesTitleShow: function(e) {
      //Always refresh, mainly for limited item views
        awxUI.$moviesTitleContent.empty();
        if (typeof lastMovieCount === 'undefined') { (awxUI.settings.filmView == 'singlePoster'? lastMovieCount = 1 : lastMovieCount = awxUI.settings.limitMovies) };
        if (typeof lastMovieCountStart === 'undefined') { lastMovieCountStart = 0 };
        if (typeof e != 'undefined') {
          if (e.data.Page == 'next') {
            lastMovieCount = parseInt(lastMovieCount) + parseInt(awxUI.settings.limitMovies);
            lastMovieCountStart += parseInt(awxUI.settings.limitMovies);
            };
            if (e.data.Page == 'prev') {
            lastMovieCount = parseInt(lastMovieCount) - parseInt(awxUI.settings.limitMovies);
            lastMovieCountStart -= parseInt(awxUI.settings.limitMovies);
            if (lastMovieCount == 0) {
              lastMovieCount = totalMovieCount;
              lastMovieCountStart = totalMovieCount - parseInt(awxUI.settings.limitMovies);
            } else if (lastMovieCount < 1 || lastMovieCountStart < 0) {
              lastMovieCount = parseInt(awxUI.settings.limitMovies);
              lastMovieCountStart = 0;
            };
          };
        }
        var $contentBox = awxUI.$moviesTitleContent;
        var moviesTitlePage = awxUI.moviesTitlePage;
        $contentBox.addClass('loading');

        //Use advanced filter if we are hiding watched.
        var filter = (awxUI.settings.watched? '"filter": {"field": "playcount", "operator": "is", "value": "0"}' : '');
        
        xbmc.getMovies({
          filter: filter,
          start: lastMovieCountStart,
          end: lastMovieCount,
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultMovieTitleViewer(result, moviesTitlePage);
            $contentBox.removeClass('loading');
          }
        });
        
      return false
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
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultMovieSetTitleViewer(result, movieSetsPage);
            $contentBox.removeClass('loading');
          }
        });
      };
      
      return false;
    },

    /*********************************************
     * Called when Movie Genres-Page is shown.          *
     *********************************************/
    onMovieGenresShow: function() {

      if (this.$movieGenresContent.html() == '') {
        var movieGenresPage = this.movieGenresPage;
        var $contentBox = this.$movieGenresContent;
        $contentBox.addClass('loading');

        xbmc.getVideoGenres({
          type: 'movie',
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultGenresViewer(result, movieGenresPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /*********************************************
     * Called when Movie Years-Page is shown.          *
     *********************************************/
    onMovieYearsShow: function() {

      if (this.$movieYearsContent.html() == '') {
        var movieYearsPage = this.movieYearsPage;
        var $contentBox = this.$movieYearsContent;
        $contentBox.addClass('loading');

        //Can't get years via proper method, use DB direct e.g. "videodb://1/3/1992"
        xbmc.getDirectory({
          media: 'files',
          directory: 'videodb://1/3/',
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultYearsViewer(result, movieYearsPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /*********************************************
     * Called when Movie Tags-Page is shown.          *
     *********************************************/
    onMovieTagsShow: function() {

      if (this.$movieTagsContent.html() == '') {
        var movieTagsPage = this.movieTagsPage;
        var $contentBox = this.$movieTagsContent;
        $contentBox.addClass('loading');

        //Can't get years via proper method, use DB direct e.g. "videodb://1/9/noir"
        xbmc.getDirectory({
          media: 'files',
          directory: 'videodb://1/9/',
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultTagsViewer(result, movieTagsPage);
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
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
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
        var moviesRecentPage = this.moviesRecentPage;
        var $contentBox = this.$moviesRecentContent;
        $contentBox.addClass('loading');

        xbmc.getRecentlyAddedMovies({
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultMovieRecentViewer(result, moviesRecentPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /*********************************************
     * Called when Tv-Shows-Page is shown. *
     *********************************************/
    onTvShowsShow: function() {
      var $contentBox = this.$tvShowsContent;
      $contentBox.empty();
      $contentBox.defaultTvShowViewer('Video');
    },
    
    /***************************************
     * Called when Tv-Shows- Title Page is shown. *
     ***************************************/
    onTvShowsTitleShow: function(e) {
      var tvShowsTitlePage = awxUI.tvShowsTitlePage;
      //Always refresh, mainly for limited item views
        awxUI.$tvShowsTitleContent.empty();
        var limitTV = awxUI.settings.limitTV;
        if (typeof lastTVCount === 'undefined') { lastTVCount = limitTV };
        if (typeof lastTVCountStart === 'undefined') { lastTVCountStart = 0 };
        if (typeof e != 'undefined') {
          if (e.data.Page == 'next') {
            lastTVCount = parseInt(lastTVCount) + parseInt(limitTV);
            lastTVCountStart += parseInt(limitTV);
            };
          if (e.data.Page == 'prev') {
            lastTVCount = parseInt(lastTVCount) - parseInt(limitTV);
            lastTVCountStart -= parseInt(limitTV);
              if (lastTVCount == 0) {
                lastTVCount = totalTVCount;
                lastTVCountStart = totalTVCount - limitTV;
              } else if (lastTVCount < 1 || lastTVCountStart < 0) {
                lastTVCount = limitTV;
                lastTVCountStart = 0;
              };
          };
          
        }
        var $contentBox = awxUI.$tvShowsTitleContent;
        
        $contentBox.addClass('loading');
        //Use advanced filter if we are hiding watched.
        var filter = (awxUI.settings.watched? '"filter": {"field": "playcount", "operator": "is", "value": "0"}' : '');
        
        xbmc.getTvShows({
          filter: filter,
          start: lastTVCountStart,
          end: lastTVCount,
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultTvShowTitleViewer(result, tvShowsTitlePage);
            $contentBox.removeClass('loading');
          }
        });

      return false
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
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
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
     * Called when TvShows Genres-Page is shown.          *
     *********************************************/
    onTvShowsGenresShow: function() {

      if (this.$tvShowsGenresContent.html() == '') {
        var tvShowsGenresPage = this.tvShowsGenresPage;
        var $contentBox = this.$tvShowsGenresContent;
        $contentBox.addClass('loading');

        xbmc.getVideoGenres({
          type: 'tvshow',
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultGenresViewer(result, tvShowsGenresPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /*********************************************
     * Called when TvShows Years-Page is shown.          *
     *********************************************/
    onTvShowsYearsShow: function() {

      if (this.$tvShowsYearsContent.html() == '') {
        var tvShowsYearsPage = this.tvShowsYearsPage;
        var $contentBox = this.$tvShowsYearsContent;
        $contentBox.addClass('loading');

        //Can't get years via proper method, use DB direct e.g. "videodb://1/3/1992"
        xbmc.getDirectory({
          media: 'files',
          directory: 'videodb://2/3/',
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultYearsViewer(result, tvShowsYearsPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /*********************************************
     * Called when TvShows Tags-Page is shown.          *
     *********************************************/
    onTvShowsTagsShow: function() {

      if (this.$tvShowsTagsContent.html() == '') {
        var tvShowsTagsPage = this.tvShowsTagsPage;
        var $contentBox = this.$tvShowsTagsContent;
        $contentBox.addClass('loading');

        //Can't get tags via proper method, use DB direct.
        xbmc.getDirectory({
          media: 'files',
          directory: 'videodb://2/9/',
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultTagsViewer(result, tvShowsTagsPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /*********************************************
     * Called when PVR TV Page is shown.    *
     *********************************************/
    onPVRtvShow: function() {
      if (this.$pvrtvContent.html() == '') {
        var pvrtvPage = this.pvrtvPage;
        var $contentBox = this.$pvrtvContent;
        $contentBox.addClass('loading');

        xbmc.pvrGetChannelGroups({
          onError: function() {
            //mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultPVRViewer(result, pvrtvPage);
            $contentBox.removeClass('loading');
          }
        });
      }
    },
    
    /*********************************************
     * Called when PVR EPG Page is shown.    *
     *********************************************/
    onPVRepgGrid: function() {
      if (this.$pvrepgContent.html() == '') {
        var pvrepgPage = this.pvrepgPage;
        var $contentBox = this.$pvrepgContent;
        $contentBox.addClass('loading');

        xbmc.pvrGetChannels({
          onError: function() {
            //mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $contentBox.removeClass('loading');
          },

          onSuccess: function(result) {
            $contentBox.defaultPVRViewer(result, pvrtvPage);
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
          mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
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
     * Called when Video-Addons-Page is shown. *
     *********************************************/
    onVideoAddonsShow: function() {
      var $contentBox = this.$videoAddonsContent;
      $contentBox.empty();
      $contentBox.defaultAddonsViewer('video');
    },
    
    /*********************************************
     * Called when Audio-Addons-Page is shown. *
     *********************************************/
    onAudioAddonsShow: function() {
      var $contentBox = this.$audioAddonsContent;
      $contentBox.empty();
      $contentBox.defaultAddonsViewer('audio');
    },
    
    /*********************************************
     * Called when Ad video Filter-Page is shown. *
     *********************************************/
    onVideoAdFilterShow  : function() {
      
      if (this.$videoAdFilterContent.html() == '') {
        var $contentBox = this.$videoAdFilterContent;
        $contentBox.empty();
        $contentBox.defaultVideoAdFilterViewer(this.videoAdFilterPage);
      }
    },
    
    /*********************************************
     * Called when Ad Audio Filter-Page is shown. *
     *********************************************/
    onAudioAdFilterShow  : function() {
      
      if (this.$audioAdFilterContent.html() == '') {
        var $contentBox = this.$audioAdFilterContent;
        $contentBox.empty();
        $contentBox.defaultAudioAdFilterViewer(this.audioAdFilterPage);
      }
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
