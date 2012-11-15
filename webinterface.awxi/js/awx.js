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
          $('#loadingAWXHint').text(mkf.lang.get('Setting up UI...', 'Initial window screen'));

          //var ui = mkf.cookieSettings.get('ui');
          var uiScript = '';

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

