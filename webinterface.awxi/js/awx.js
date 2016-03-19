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

var awx = {};

(function($) {

  /*************
   * AWX stuff *
   *************/
  $.extend(awx, {

    init: function() {
      var dialogHandle = mkf.dialog.show({content:'<h1 class="loading" id="loadingAWXHint">Loading AWXi ...</h1>', closeButton: false});
      $('body').append('<div id="initAWX"></div>');
      //Find if we are IE and which version, you know why...
      BrowserVersion = 999;
      if (navigator.appVersion.indexOf("MSIE") != -1) { BrowserVersion = parseFloat(navigator.appVersion.split("MSIE")[1]) }; 
      
      $('#initAWX').hide();

      // init-Object contains each init-step as a function
      var init = {
        // --- STEP 1: Set Language
        step1 : function() {
          mkf.lang.setLanguage(mkf.cookieSettings.get('lang', 'en'), function(ready) {
            if (ready) {
              init.step2();
            } else {
              $('#loadingAWXHint').removeClass('loading');
              $('#loadingAWXHint').html('Failed loading language file! <br />Please make sure they are in /lang/<country code>.json. <br />Example: en.json'); 
            }
          });
          //init.step2();
        },

        // --- STEP 2: Load UI-Script
        step2 : function() {
          //Disable cache on json requests
          //$.ajaxSetup({ cache:false });
          
          $('#loadingAWXHint').text(mkf.lang.get('Setting up UI...', 'Initial window screen'));

          //var ui = mkf.cookieSettings.get('ui');
          var uiScript = '';

          //Get user options via cookies or defaults.
          awxUI = {};
          awxUI.settings = {};
          
          //Get user control settings.
          $.getJSON('js/settings.json', function(data) { $.extend(awxUI.settings, data) } );
          
          //Load setting from local storage
          if(localStorage && localStorage.getItem('AWXi')) {
            awxUI.settings = JSON.parse(localStorage.getItem('AWXi'));
            //Check for undefined
            //Views
            if (typeof awxUI.settings.artistsView === 'undefined') { awxUI.settings.artistsView = 'list'; }
            if (typeof awxUI.settings.albumsView === 'undefined') {  awxUI.settings.albumsView = 'cover'; }
            if (typeof awxUI.settings.albumsViewRec === 'undefined') {  awxUI.settings.albumsViewRec = 'cover'; }
            if (typeof awxUI.settings.filmView === 'undefined') {  awxUI.settings.filmView = 'poster'; }
            if (typeof awxUI.settings.filmViewRec === 'undefined') {  awxUI.settings.filmViewRec = 'poster'; }
            if (typeof awxUI.settings.filmViewSets === 'undefined') {  awxUI.settings.filmViewSets = 'poster'; }
            if (typeof awxUI.settings.TVView === 'undefined') {  awxUI.settings.TVView = 'banner'; }
            if (typeof awxUI.settings.TVViewRec === 'undefined') {  awxUI.settings.TVViewRec = 'infolist'; }
            if (typeof awxUI.settings.EpView === 'undefined') {  awxUI.settings.EpView = 'listover'; }
            if (typeof awxUI.settings.musicVideoView === 'undefined') {  awxUI.settings.musicVideosView = 'cover'; }
            
            //Sorting
            if (typeof awxUI.settings.filmSort === 'undefined') {  awxUI.settings.filmSort = 'label'; }
            if (typeof awxUI.settings.mdesc === 'undefined') {  awxUI.settings.mdesc = 'ascending'; }
            if (typeof awxUI.settings.tvSort === 'undefined') {  awxUI.settings.TVSort = 'label'; }
            if (typeof awxUI.settings.tvdesc === 'undefined') {  awxUI.settings.tvdesc = 'ascending'; }
            if (typeof awxUI.settings.epSort === 'undefined') {  awxUI.settings.EpSort = 'episode'; }
            if (typeof awxUI.settings.epdesc === 'undefined') {  awxUI.settings.epdesc = 'ascending'; }
            if (typeof awxUI.settings.albumSort === 'undefined') {  awxUI.settings.albumSort = 'album'; }
            if (typeof awxUI.settings.adesc === 'undefined') {  awxUI.settings.adesc = 'ascending'; }
            if (typeof awxUI.settings.musicVideosSort === 'undefined') {  awxUI.settings.mvSort = 'artist'; }
            if (typeof awxUI.settings.musicVideosdesc === 'undefined') {  awxUI.settings.mvdesc = 'ascending'; }
            
            //Limits
            if (typeof awxUI.settings.limitMovies === 'undefined') {  awxUI.settings.limitVideo = 25; }
            if (typeof awxUI.settings.limitTV === 'undefined') {  awxUI.settings.limitTV = 25; }
            if (typeof awxUI.settings.limitArtists === 'undefined') {  awxUI.settings.limitArtists = 25; }
            if (typeof awxUI.settings.limitAlbums === 'undefined') {  awxUI.settings.limitAlbums = 25; }
            if (typeof awxUI.settings.limitSongs === 'undefined') {  awxUI.settings.limitSongs = 25; }
            if (typeof awxUI.settings.limitMV === 'undefined') {  awxUI.settings.limitMusicVideo = 25; }
            
            //General
            if (typeof awxUI.settings.lazyload === 'undefined') {  awxUI.settings.lazyload = false; }
            if (typeof awxUI.settings.timeout === 'undefined') {  awxUI.settings.timeout = 20; }
            if (typeof awxUI.settings.ui === 'undefined') {  awxUI.settings.ui = 'uni'; }
            if (typeof awxUI.settings.lang === 'undefined') {  awxUI.settings.lang = 'en'; }
            if (typeof awxUI.settings.watched === 'undefined') {  awxUI.settings.watched = false; }
            if (typeof awxUI.settings.hideWatchedMark === 'undefined') {  awxUI.settings.hidewatchedmark = false; }
            if (typeof awxUI.settings.hoverOrClick === 'undefined') {  awxUI.settings.hoverOrClick = 'mouseenter'; }
            if (typeof awxUI.settings.useFanart === 'undefined') {  awxUI.settings.usefanart = false; }
            if (typeof awxUI.settings.useXtraFanart === 'undefined') {  awxUI.settings.usextrafanart = false; }
            if (typeof awxUI.settings.startPage === 'undefined') {  awxUI.settings.startPage = 'recentTV'; }
            if (typeof awxUI.settings.showTags === 'undefined') {  awxUI.settings.showTags = false; }
            if (typeof awxUI.settings.rotateCDart === 'undefined') {  awxUI.settings.rotateCDart = false; }
            if (typeof awxUI.settings.artistsPath === 'undefined') {  awxUI.settings.artistsPath = ''; }
            if (typeof awxUI.settings.preferLogos === 'undefined') {  awxUI.settings.preferLogos = false; }
            if (typeof awxUI.settings.controllerOnPlay === 'undefined') {  awxUI.settings.controllerOnPlay = true; }
            if (typeof awxUI.settings.inputKey === 'undefined') {  awxUI.settings.inputKey = 0; }
            if (typeof awxUI.settings.actionOnPlay === 'undefined') {  awxUI.settings.actionOnPlay = 0; }
          } else {
            //Views
            awxUI.settings.artistsView = mkf.cookieSettings.get('artistsView', 'list');
            awxUI.settings.albumsView = mkf.cookieSettings.get('albumsView', 'cover');
            awxUI.settings.albumsViewRec = mkf.cookieSettings.get('albumsViewRec', 'cover');
            awxUI.settings.filmView = mkf.cookieSettings.get('filmView', 'poster');
            awxUI.settings.filmViewRec = mkf.cookieSettings.get('filmViewRec', 'poster');
            awxUI.settings.filmViewSets = mkf.cookieSettings.get('filmViewSets', 'poster');
            awxUI.settings.TVView = mkf.cookieSettings.get('TVView', 'banner');
            awxUI.settings.TVViewRec = mkf.cookieSettings.get('TVViewRec', 'infolist');
            awxUI.settings.EpView = mkf.cookieSettings.get('EpView', 'listover');
            awxUI.settings.musicVideoView = mkf.cookieSettings.get('musicVideosView', 'cover');
            
            //Sorting
            awxUI.settings.filmSort = mkf.cookieSettings.get('filmSort', 'label');
            awxUI.settings.mdesc = mkf.cookieSettings.get('mdesc', 'ascending');
            awxUI.settings.tvSort = mkf.cookieSettings.get('TVSort', 'label');
            awxUI.settings.tvdesc = mkf.cookieSettings.get('tvdesc', 'ascending');
            awxUI.settings.epSort = mkf.cookieSettings.get('EpSort', 'episode');
            awxUI.settings.epdesc = mkf.cookieSettings.get('epdesc', 'ascending');
            awxUI.settings.albumSort = mkf.cookieSettings.get('albumSort', 'album');
            awxUI.settings.adesc = mkf.cookieSettings.get('adesc', 'ascending');
            awxUI.settings.musicVideosSort = mkf.cookieSettings.get('mvSort', 'artist');
            awxUI.settings.musicVideosdesc = mkf.cookieSettings.get('mvdesc', 'ascending');
            
            //Limits
            awxUI.settings.limitMovies = mkf.cookieSettings.get('limitVideo', 25);
            awxUI.settings.limitTV = mkf.cookieSettings.get('limitTV', 25);
            awxUI.settings.limitArtists = mkf.cookieSettings.get('limitArtists', 25);
            awxUI.settings.limitAlbums = mkf.cookieSettings.get('limitAlbums', 25);
            awxUI.settings.limitSongs = mkf.cookieSettings.get('limitSongs', 25);
            awxUI.settings.limitMV = mkf.cookieSettings.get('limitMusicVideo', 25);
            
            //General
            awxUI.settings.lazyload = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
            awxUI.settings.timeout = mkf.cookieSettings.get('timeout', 20);
            awxUI.settings.ui = mkf.cookieSettings.get('ui', 'uni');
            awxUI.settings.lang = mkf.cookieSettings.get('lang', 'en');
            awxUI.settings.watched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
            awxUI.settings.hideWatchedMark = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
            awxUI.settings.hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no')=='yes'? 'click' : 'mouseenter';
            awxUI.settings.useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
            awxUI.settings.useXtraFanart = mkf.cookieSettings.get('usextrafanart', 'no')=='yes'? true : false;
            awxUI.settings.startPage = mkf.cookieSettings.get('startPage', 'recentTV');
            awxUI.settings.showTags = mkf.cookieSettings.get('showTags', 'yes')=='yes'? true : false;
            awxUI.settings.rotateCDart = mkf.cookieSettings.get('rotateCDart', 'no')=='yes'? true : false;
            awxUI.settings.artistsPath = mkf.cookieSettings.get('artistsPath');
            awxUI.settings.manualPath = mkf.cookieSettings.get('manualPath');
            awxUI.settings.preferLogos = mkf.cookieSettings.get('preferLogos')=='yes'? true : false;
            awxUI.settings.controllerOnPlay = mkf.cookieSettings.get('controllerOnPlay', 'yes')=='yes'? true : false;
            awxUI.settings.inputKey = mkf.cookieSettings.get('inputKey', 0);
            awxUI.settings.actionOnPlay = mkf.cookieSettings.get('actionOnPlay', 0);
          }

          awxUI.settings.remoteActive = false;
          awxUI.settings.inputKeysActive = false;
          
          /*if (ui == 'light') {
            uiScript = 'ui.light/ui.light.js';
          } else if (ui == 'default') {
            uiScript = 'ui.default/ui.default.js';
          } else if (ui == 'lightDark') {
            uiScript = 'ui.lightDark/ui.lightDark.js';
          } else {*/
            uiScript = 'ui.uni/ui.uni.js';
          //}

          mkf.scriptLoader.load({
            script: uiScript,
            onload: init.step3,
            onerror: function() {
              alert(mkf.lang.get('Failed to load UI!', 'Alert'));
              init.step5();
            }
          });
        },

        // --- STEP 3: Init xbmc-lib
        step3: function() {
          $('#loadingAWXHint').text(mkf.lang.get('Initialize XBMC-lib...', 'Initial window screen'));
          xbmc.init($('#initAWX'), init.step4);
        },

        // --- STEP 4: Init UI
        step4 : function() {
          awxUI.init();
          init.step5();
        },

        // --- STEP 5: Cleanup
        step5 : function(errorText) {
          if (errorText) {
            mkf.messageLog.show(errorText, mkf.messageLog.status.error, 5000);
          }

          $('#initAWX').remove();
          mkf.dialog.close(dialogHandle);
        }
      };

      // Begin with step 1
      init.step1();
    }

  });

})(jQuery);

