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
  $.fn.simcontrols = function() {
    if (awxUI.settings.player) {
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
  };
  
  $.fn.topcontrols = function() {
    var failed = function() {
      mkf.messageLog.show(mkf.lang.get('Failed to send command!', 'Popup message'), mkf.messageLog.status.error, 5000);
    };
    
    if (awxUI.settings.input) {
      $inputcontrols = $('<div class="menucontrols"><a class="button input" href=""></a><a class="button audio" href=""></a><a class="button subs" href=""></a></div>' + //<a class="button video" href=""></a> when available
      '<div id="inputcontrols" style="display: none">' +
      '<div id="quick_row1"><a class="button home" href="" title="' + mkf.lang.get('Home', 'Tool tip') + '"></a><a class="button up" href="" title="' + mkf.lang.get('Up', 'Tool tip') + '"></a><a class="button back" href="" title="' + mkf.lang.get('Back', 'Tool tip') + '"></a></div>' +
      '<div id="quick_row2"><a class="button left" href="" title="' + mkf.lang.get('Left', 'Tool tip') + '"></a><a class="button select" href="" title="' + mkf.lang.get('Select', 'Tool tip') + '"></a><a class="button right" href="" title="' + mkf.lang.get('Right', 'Tool tip') + '"></a></div>' +
      '<div id="quick_row3"><a class="button info" href="" title="' + mkf.lang.get('Information', 'Tool tip') + '"></a><a class="button down" href="" title="' + mkf.lang.get('Down', 'Tool tip') + '"></a><a class="button contextMenu" href="" title="' + mkf.lang.get('Context Menu', 'Tool tip') + '"></a></div>' +
      '</div>' +
      '<div id="audiocontrols" style="display: none">' +
      '<div><a href="" class="bigAudioPrev" title="' + mkf.lang.get('Previous Audio Stream', 'Tool tip') + '"></a>' +
      '<a href="" class="bigAudioNext" title="' + mkf.lang.get('Next Audio Stream', 'Tool tip') + '"></a></div>' +
      '</div>' +
      '<div id="subcontrols" style="display: none">' +
      '<div><a href="" class="bigSubPrev" title="' + mkf.lang.get('Previous Subtitles', 'Tool tip') + '"></a>' +
      '<a href="" class="bigSubOnOff" title="' + mkf.lang.get('Subtitles On/Off', 'Tool tip') + '"></a>' +
      '<a href="" class="bigSubNext" title="' + mkf.lang.get('Next Subtitles', 'Tool tip') + '"></a></div>' +
      '</div>');

      $inputcontrols.find('.audio').click(function() {
        $('#inputcontrols').hide();
        $('#subcontrols').hide();
        $('#audiocontrols').toggle();
        return false;
      });
      $inputcontrols.find('.subs').click(function() {
        $('#audiocontrols').hide();
        $('#inputcontrols').hide();
        $('#subcontrols').toggle();
        return false;
      });
      $inputcontrols.find('.input').click(function() {
        $('#audiocontrols').hide();
        $('#subcontrols').hide();
        $('#inputcontrols').toggle();
        return false;
      });
      $inputcontrols.find('.left').click(function() {
        xbmc.input({type: 'Left', onError: failed}); return false;
      });
      $inputcontrols.find('.right').click(function() {
        xbmc.input({type: 'Right', onError: failed}); return false;
      });
      $inputcontrols.find('.up').click(function() {
        xbmc.input({type: 'Up', onError: failed}); return false;
      });
      $inputcontrols.find('.down').click(function() {
        xbmc.input({type: 'Down', onError: failed}); return false;
      });
      $inputcontrols.find('.back').click(function() {
        xbmc.input({type: 'Back', onError: failed}); return false;
      });
      $inputcontrols.find('.home').click(function() {
        xbmc.input({type: 'Home', onError: failed}); return false;
      });
      $inputcontrols.find('.select').click(function() {
        xbmc.input({type: 'Select', onError: failed}); return false;
      });
      $inputcontrols.find('.contextMenu').click(function() {
        xbmc.input({type: 'ContextMenu', onError: failed}); return false;
      });
      $inputcontrols.find('.info').click(function() {
        xbmc.input({type: 'Info', onError: failed}); return false;
      });
      
      $inputcontrols.find('.bigAudioNext').click(function() {
        xbmc.setAudioStream({command: 'next', onError: failed}); return false;
      });
      $inputcontrols.find('.bigAudioPrev').click(function() {
        xbmc.setAudioStream({command: 'previous', onError: failed}); return false;
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
      
      this.each (function() {
        $(this).append($inputcontrols.clone(true));
      });
    
    };
  };
  
  $.fn.extraControls = function() {
    if (awxUI.settings.player || awxUI.settings.volume) {
      $controls = $('<div id="quick">' +
      '<div id="quick_con">' +
      (awxUI.settings.player? '<a class="button prev" href=""></a><a class="button rewind" href=""></a><a class="button fastforward" href=""></a><a class="button next" href=""></a><a class="button shuffle" href="" title="' + mkf.lang.get('Shuffle', 'Tool tip') + '"></a><a class="button repeat" href="" title="' + mkf.lang.get('Repeat All', 'Tool tip') + '"></a>' : '') +
      (awxUI.settings.volume? '<a class="button voldown" href="" title="' + mkf.lang.get('Decrease Volume', 'Tool tip') + '"></a><a class="button volup" href="" title="' + mkf.lang.get('Increase Volume', 'Tool tip') + '"></a><a class="button mute" href="" title="' + mkf.lang.get('Mute On/Off', 'Tool tip') + '"></a>' : '') +
      '</div>');
      
      $controls.find('.play').click(function() {
        xbmc.control({type: 'play'}); return false;
      });
      $controls.find('.stop').click(function() {
        xbmc.control({type: 'stop'}); return false;
      });
      $controls.find('.next').click(function() {
        xbmc.playerGoTo({to: 'next'}); return false;
      });
      $controls.find('.prev').click(function() {
        xbmc.playerGoTo({to: 'previous'}); return false;
      });
      $controls.find('.rewind').click(function() {
        xbmc.controlSpeed({type: 'decrement'}); return false;
      });
      $controls.find('.fastforward').click(function() {
        xbmc.controlSpeed({type: 'increment'}); return false;
      });
      $controls.find('.mute').click(function() {
        xbmc.setMute(); return false;
      });  
      $controls.find('.volup').click(function() {
        xbmc.setVolumeInc({volume: 'increment'}); return false;
      });
      $controls.find('.voldown').click(function() {
        xbmc.setVolumeInc({volume: 'decrement'}); return false;
      });
      var shuffle = function() {
        xbmc.playerSet({type: 'shuffle', value: 'toggle'}); return false;
      };

      $controls.find('.shuffle').on('click', shuffle);

      var repeat = function() {
        xbmc.playerSet({type: 'repeat', value: 'cycle'});
        return false;
      };
      
      $controls.find('.repeat').on('click', repeat);
      
      xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
        var $shuffleBtn = $('.button.shuffle');
        if (status == 'shuffleOn') {
          $shuffleBtn.unbind('click');
          $shuffleBtn.bind('click', shuffle);
          $shuffleBtn.addClass('unshuffle');
          $shuffleBtn.attr('title', mkf.lang.get('Shuffle', 'Tool tip'));

        } else if (status == 'shuffleOff') {
          $shuffleBtn.unbind('click');
          $shuffleBtn.bind('click', shuffle);
          $shuffleBtn.removeClass('unshuffle');
          $shuffleBtn.attr('title', mkf.lang.get('Unshuffle', 'Tool tip'));
        }
      });

      xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
        var $repeatBtn = $('.button.repeat');
        if (status == 'off') {
          $repeatBtn.unbind('click');
          $repeatBtn.bind('click', {"repeat": 'all'}, repeat);
          $repeatBtn.removeClass('repeatOff');
          $repeatBtn.addClass('repeat');
          $repeatBtn.attr('title', mkf.lang.get('Repeat All', 'Tool tip'));
        } else if (status == 'all') {
          $repeatBtn.unbind('click');
          $repeatBtn.bind('click', {"repeat": 'one'}, repeat);
          $repeatBtn.addClass('repeat1');
          $repeatBtn.attr('title', mkf.lang.get('Repeat One', 'Tool tip'));
        } else if (status == 'one') {
          $repeatBtn.unbind('click');
          $repeatBtn.removeClass('repeat1');
          $repeatBtn.bind('click', {"repeat": 'off'}, repeat);      
          $repeatBtn.addClass('repeatOff');
          $repeatBtn.attr('title', mkf.lang.get('Repeat Off', 'Tool tip'));
        }
      });
      
      this.each (function() {
        $(this).append($controls.clone(true));
      });
    };
  }; // END extraControls
  
  $.fn.defaultControls = function() {
    $controls = $('<a class="button play" href=""></a><a class="button stop" href=""></a><a class="button next" href=""></a><a class="button prev" href=""></a><a class="button shuffle" href="" title="' + mkf.lang.get('Shuffle On', 'Tool tip') + '"></a><a class="button repeat" href="" title="' + mkf.lang.get('Repeat All', 'Tool tip') + '"></a>');
    $controls.filter('.play').click(function() {
      xbmc.control({type: 'play'}); return false;
    });
    $controls.filter('.stop').click(function() {
      xbmc.control({type: 'stop'}); return false;
    });
    $controls.filter('.next').click(function() {
      xbmc.playerGoTo({type: 'next'}); return false;
    });
    $controls.filter('.prev').click(function() {
      xbmc.playerGoTo({type: 'previous'}); return false;
    });
    $('.mute').click(function() {
      xbmc.setMute(); return false;
    });

    var shuffle = function(event) {
      xbmc.playerSet({type: 'shuffle', value: 'toggle'}); return false;
    };

    $controls.find('.shuffle').on('click', shuffle);

    var repeat = function(event) {
      xbmc.playerSet({type: 'repeat', value: 'cycle'});
      return false;
    };
    
    $controls.find('.repeat').on('click', repeat);

    xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
      var $muteBtn = $('.mute');
      if (status == 'muteOn') {
        //$shuffleBtn.unbind('click');
        //$shuffleBtn.bind('click', {"shuffle": false}, shuffle);
        $muteBtn.removeClass('unmuted');
        $muteBtn.addClass('muted');
        $muteBtn.attr('title', mkf.lang.get('Mute On/Off', 'Tool tip'));

      } else if (status == 'muteOff') {
        //$shuffleBtn.unbind('click');
        //$shuffleBtn.bind('click', {"shuffle": true}, shuffle);
        $muteBtn.removeClass('muted');
        $muteBtn.addClass('unmuted');
        $muteBtn.attr('title', mkf.lang.get('Mute On/Off', 'Tool tip'));
      }
    });
    
    xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
      var $shuffleBtn = $('.button.shuffle');
      if (status == 'shuffleOn') {
        $shuffleBtn.unbind('click');
        $shuffleBtn.bind('click', shuffle);
        $shuffleBtn.addClass('unshuffle');
        $shuffleBtn.attr('title', mkf.lang.get('Shuffle Off', 'Tool tip'));

      } else if (status == 'shuffleOff') {
        $shuffleBtn.unbind('click');
        $shuffleBtn.bind('click', shuffle);
        $shuffleBtn.removeClass('unshuffle');
        $shuffleBtn.attr('title', mkf.lang.get('Shuffle On', 'Tool tip'));
      }
      //No idea if we're in Audio or Video playlist; refresh both.. <-- fix: notification gives playerid
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
        $repeatBtn.attr('title', mkf.lang.get('Repeat All', 'Tool tip'));
      } else if (status == 'all') {
        $repeatBtn.unbind('click');
        $repeatBtn.bind('click', {"repeat": 'one'}, repeat);
        $repeatBtn.addClass('repeat1');
        $repeatBtn.attr('title', mkf.lang.get('Repeat One', 'Tool tip'));
      } else if (status == 'one') {
        $repeatBtn.unbind('click');
        $repeatBtn.removeClass('repeat1');
        $repeatBtn.bind('click', {"repeat": 'off'}, repeat);
        $repeatBtn.addClass('repeatOff');
        $repeatBtn.attr('title', mkf.lang.get('Repeat Off', 'Tool tip'));
      }
    });
    
    this.each (function() {
      $(this).append($controls.clone(true));
    });
  }; // END defaultControls

  $.fn.controlsInput24 = function() {
    var failed = function() {
      mkf.messageLog.show(mkf.lang.get('Failed to send command!', 'Popup message'), mkf.messageLog.status.error, 5000);
    };
    
    if (awxUI.settings.input) {
      $inputcontrols = $(
      '<div id="inputcontrols24">' +
      '<a class="button home" href="" title="' + mkf.lang.get('Home', 'Tool tip') + '"></a><a class="button up" href="" title="' + mkf.lang.get('Up', 'Tool tip') + '"></a><a class="button back" href="" title="' + mkf.lang.get('Back', 'Tool tip') + '"></a>' +
      '<a class="button left" href="" title="' + mkf.lang.get('Left', 'Tool tip') + '"></a><a class="button select" href="" title="' + mkf.lang.get('Select', 'Tool tip') + '"></a><a class="button right" href="" title="' + mkf.lang.get('Right', 'Tool tip') + '"></a>' +
      '<a class="button info" href="" title="' + mkf.lang.get('Information', 'Tool tip') + '"></a><a class="button down" href="" title="' + mkf.lang.get('Down', 'Tool tip') + '"></a><a class="button contextMenu" href="" title="' + mkf.lang.get('Context Menu', 'Tool tip') + '"></a>' +
      //'</div>' +
      /*'<div id="audiocontrols" style="display: none">' +
      '<div><a href="" class="bigAudioPrev" title="' + mkf.lang.get('Previous Audio Stream', 'Tool tip') + '"></a>' +
      '<a href="" class="bigAudioNext" title="' + mkf.lang.get('Next Audio Stream', 'Tool tip') + '"></a></div>' +
      '</div>' +
      '<div id="subcontrols" style="display: none">' +
      '<div><a href="" class="bigSubPrev" title="' + mkf.lang.get('Previous Subtitles', 'Tool tip') + '"></a>' +
      '<a href="" class="bigSubOnOff" title="' + mkf.lang.get('Subtitles On/Off', 'Tool tip') + '"></a>' +
      '<a href="" class="bigSubNext" title="' + mkf.lang.get('Next Subtitles', 'Tool tip') + '"></a></div>' +*/
      '</div>');

      /*$inputcontrols.find('.audio').click(function() {
        $('#inputcontrols').hide();
        $('#subcontrols').hide();
        $('#audiocontrols').toggle();
        return false;
      });
      $inputcontrols.find('.subs').click(function() {
        $('#audiocontrols').hide();
        $('#inputcontrols').hide();
        $('#subcontrols').toggle();
        return false;
      });
      $inputcontrols.find('.input').click(function() {
        $('#audiocontrols').hide();
        $('#subcontrols').hide();
        $('#inputcontrols').toggle();
        return false;
      });*/
      $inputcontrols.find('.left').click(function() {
        xbmc.input({type: 'Left', onError: failed}); return false;
      });
      $inputcontrols.find('.right').click(function() {
        xbmc.input({type: 'Right', onError: failed}); return false;
      });
      $inputcontrols.find('.up').click(function() {
        xbmc.input({type: 'Up', onError: failed}); return false;
      });
      $inputcontrols.find('.down').click(function() {
        xbmc.input({type: 'Down', onError: failed}); return false;
      });
      $inputcontrols.find('.back').click(function() {
        xbmc.input({type: 'Back', onError: failed}); return false;
      });
      $inputcontrols.find('.home').click(function() {
        xbmc.input({type: 'Home', onError: failed}); return false;
      });
      $inputcontrols.find('.select').click(function() {
        xbmc.input({type: 'Select', onError: failed}); return false;
      });
      $inputcontrols.find('.contextMenu').click(function() {
        xbmc.input({type: 'ContextMenu', onError: failed}); return false;
      });
      $inputcontrols.find('.info').click(function() {
        xbmc.input({type: 'Info', onError: failed}); return false;
      });
      
      /*$inputcontrols.find('.bigAudioNext').click(function() {
        xbmc.setAudioStream({command: 'next', onError: failed}); return false;
      });
      $inputcontrols.find('.bigAudioPrev').click(function() {
        xbmc.setAudioStream({command: 'previous', onError: failed}); return false;
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
      */
      this.each (function() {
        $(this).append($inputcontrols.clone(true));
      });
    
    };
  };
  
  $.fn.controlsInput32 = function() {
    var failed = function() {
      mkf.messageLog.show(mkf.lang.get('Failed to send command!', 'Popup message'), mkf.messageLog.status.error, 5000);
    };
    
    if (awxUI.settings.input) {
      $inputcontrols = $(
      '<div id="inputcontrols32">' +
      '<a class="button home" href="" title="' + mkf.lang.get('Home', 'Tool tip') + '"></a><a class="button back" href="" title="' + mkf.lang.get('Back', 'Tool tip') + '"></a><a class="button up" href="" title="' + mkf.lang.get('Up', 'Tool tip') + '"></a>' +
      '<a class="button left" href="" title="' + mkf.lang.get('Left', 'Tool tip') + '"></a><a class="button select" href="" title="' + mkf.lang.get('Select', 'Tool tip') + '"></a><a class="button right" href="" title="' + mkf.lang.get('Right', 'Tool tip') + '"></a>' +
      '<a class="button down" href="" title="' + mkf.lang.get('Down', 'Tool tip') + '"></a><a class="button info" href="" title="' + mkf.lang.get('Information', 'Tool tip') + '"></a><a class="button contextMenu" href="" title="' + mkf.lang.get('Context Menu', 'Tool tip') + '"></a>' +
      '<a class="button inputcontrols" href="" title="' + mkf.lang.get('Control Keys', 'Tool tip') + '"></a><a class="button maximise" href="" title="' + mkf.lang.get('Full Screen', 'Tool tip') + '"></a>' +
      '</div>');
      
      $inputcontrols.find('.left').click(function() {
        xbmc.input({type: 'Left', onError: failed}); return false;
      });
      $inputcontrols.find('.right').click(function() {
        xbmc.input({type: 'Right', onError: failed}); return false;
      });
      $inputcontrols.find('.up').click(function() {
        xbmc.input({type: 'Up', onError: failed}); return false;
      });
      $inputcontrols.find('.down').click(function() {
        xbmc.input({type: 'Down', onError: failed}); return false;
      });
      $inputcontrols.find('.back').click(function() {
        xbmc.input({type: 'Back', onError: failed}); return false;
      });
      $inputcontrols.find('.home').click(function() {
        xbmc.input({type: 'Home', onError: failed}); return false;
      });
      $inputcontrols.find('.select').click(function() {
        xbmc.input({type: 'Select', onError: failed}); return false;
      });
      $inputcontrols.find('.contextMenu').click(function() {
        xbmc.input({type: 'ContextMenu', onError: failed}); return false;
      });
      $inputcontrols.find('.info').click(function() {
        xbmc.input({type: 'Info', onError: failed}); return false;
      });
      $inputcontrols.find('.maximise').click(function() {
        xbmc.fullScreen(true); return false;
      });
      $inputcontrols.find('.inputcontrols').click(function() {
        xbmc.inputKeys('toggle'); return false;
      });
      
      this.each (function() {
        $(this).append($inputcontrols.clone(true));
      });
    
    };
  };
  
  $.fn.controlsPlayer24 = function() {
    if (awxUI.settings.player || awxUI.settings.volume) {
      $controls = $('<div id="playercontrols24">' +
      (awxUI.settings.player? '<a class="button prev" href=""></a><a class="button rewind" href=""></a><a class="button fastforward" href=""></a><a class="button next" href=""></a><a class="button shuffle" href="" title="' + mkf.lang.get('Shuffle', 'Tool tip') + '"></a><a class="button repeat" href="" title="' + mkf.lang.get('Repeat All', 'Tool tip') + '"></a>' : '') +
      (awxUI.settings.volume? '<a class="button voldown" href="" title="' + mkf.lang.get('Decrease Volume', 'Tool tip') + '"></a><a class="button volup" href="" title="' + mkf.lang.get('Increase Volume', 'Tool tip') + '"></a><a class="button mute" href="" title="' + mkf.lang.get('Mute On/Off', 'Tool tip') + '"></a>' : '') +
      '</div>');
      
      $controls.find('.play').click(function() {
        xbmc.control({type: 'play'}); return false;
      });
      $controls.find('.stop').click(function() {
        xbmc.control({type: 'stop'}); return false;
      });
      $controls.find('.next').click(function() {
        xbmc.playerGoTo({to: 'next'}); return false;
      });
      $controls.find('.prev').click(function() {
        xbmc.playerGoTo({to: 'previous'}); return false;
      });
      $controls.find('.rewind').click(function() {
        xbmc.controlSpeed({type: 'decrement'}); return false;
      });
      $controls.find('.fastforward').click(function() {
        xbmc.controlSpeed({type: 'increment'}); return false;
      });
      $controls.find('.mute').click(function() {
        xbmc.setMute(); return false;
      });  
      $controls.find('.volup').click(function() {
        xbmc.setVolumeInc({volume: 'increment'}); return false;
      });
      $controls.find('.voldown').click(function() {
        xbmc.setVolumeInc({volume: 'decrement'}); return false;
      });
      var shuffle = function() {
        xbmc.playerSet({type: 'shuffle', value: 'toggle'}); return false;
      };

      $controls.find('.shuffle').on('click', shuffle);

      var repeat = function() {
        xbmc.playerSet({type: 'repeat', value: 'cycle'});
        return false;
      };
      
      $controls.find('.repeat').on('click', repeat);
      
      xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
        var $shuffleBtn = $('.button.shuffle');
        if (status == 'shuffleOn') {
          $shuffleBtn.unbind('click');
          $shuffleBtn.bind('click', shuffle);
          $shuffleBtn.addClass('unshuffle');
          $shuffleBtn.attr('title', mkf.lang.get('Shuffle', 'Tool tip'));

        } else if (status == 'shuffleOff') {
          $shuffleBtn.unbind('click');
          $shuffleBtn.bind('click', shuffle);
          $shuffleBtn.removeClass('unshuffle');
          $shuffleBtn.attr('title', mkf.lang.get('Unshuffle', 'Tool tip'));
        }
      });

      xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
        var $repeatBtn = $('.button.repeat');
        if (status == 'off') {
          $repeatBtn.unbind('click');
          $repeatBtn.bind('click', {"repeat": 'all'}, repeat);
          $repeatBtn.removeClass('repeatOff');
          $repeatBtn.addClass('repeat');
          $repeatBtn.attr('title', mkf.lang.get('Repeat All', 'Tool tip'));
        } else if (status == 'all') {
          $repeatBtn.unbind('click');
          $repeatBtn.bind('click', {"repeat": 'one'}, repeat);
          $repeatBtn.addClass('repeat1');
          $repeatBtn.attr('title', mkf.lang.get('Repeat One', 'Tool tip'));
        } else if (status == 'one') {
          $repeatBtn.unbind('click');
          $repeatBtn.removeClass('repeat1');
          $repeatBtn.bind('click', {"repeat": 'off'}, repeat);      
          $repeatBtn.addClass('repeatOff');
          $repeatBtn.attr('title', mkf.lang.get('Repeat Off', 'Tool tip'));
        }
      });
      
      this.each (function() {
        $(this).append($controls.clone(true));
      });
    };
  }; // END input24

  $.fn.controlsPlayer32 = function() {
    if (awxUI.settings.player || awxUI.settings.volume) {
      $controls = $('<div id="playercontrols32">' +
      (awxUI.settings.player? '<a class="button prev" href=""></a><a class="button rewind" href=""></a><a class="button bigstepback" href="" title="' + mkf.lang.get('Big Step Backward', 'Tool tip') + '"></a><a class="button smallstepback" href="" title="' + mkf.lang.get('Small Step Backward', 'Tool tip') + '"></a><a class="button smallstepforward" href="" title="' + mkf.lang.get('Small Step Forward', 'Tool tip') + '"></a><a class="button bigstepforward" href="" title="' + mkf.lang.get('Big Step Forward', 'Tool tip') + '"></a><a class="button fastforward" href=""></a><a class="button next" href=""></a><a class="button shuffle" href="" title="' + mkf.lang.get('Shuffle', 'Tool tip') + '"></a><a class="button repeat" href="" title="' + mkf.lang.get('Repeat All', 'Tool tip') + '"></a>' : '') +
      //(awxUI.settings.volume? '<a class="button voldown" href="" title="' + mkf.lang.get('Decrease Volume', 'Tool tip') + '"></a><a class="button volup" href="" title="' + mkf.lang.get('Increase Volume', 'Tool tip') + '"></a><a class="button mute" href="" title="' + mkf.lang.get('Mute On/Off', 'Tool tip') + '"></a>' : '') +
      '</div>');
      
      $controls.find('.play').click(function() {
        xbmc.control({type: 'play'}); return false;
      });
      $controls.find('.stop').click(function() {
        xbmc.control({type: 'stop'}); return false;
      });
      $controls.find('.next').click(function() {
        xbmc.playerGoTo({to: 'next'}); return false;
      });
      $controls.find('.prev').click(function() {
        xbmc.playerGoTo({to: 'previous'}); return false;
      });
      $controls.find('.rewind').click(function() {
        xbmc.controlSpeed({type: 'decrement'}); return false;
      });
      $controls.find('.fastforward').click(function() {
        xbmc.controlSpeed({type: 'increment'}); return false;
      });
      $controls.find('.bigstepback').click(function() {
        xbmc.seekPercentage({percentage: 'bigbackward'}); return false;
      });
      $controls.find('.bigstepforward').click(function() {
        xbmc.seekPercentage({percentage: 'bigforward'}); return false;
      });
      $controls.find('.smallstepback').click(function() {
        xbmc.seekPercentage({percentage: 'smallbackward'}); return false;
      });
      $controls.find('.smallstepforward').click(function() {
        xbmc.seekPercentage({percentage: 'smallforward'}); return false;
      });
      $controls.find('.mute').click(function() {
        xbmc.setMute(); return false;
      });  
      $controls.find('.volup').click(function() {
        xbmc.setVolumeInc({volume: 'increment'}); return false;
      });
      $controls.find('.voldown').click(function() {
        xbmc.setVolumeInc({volume: 'decrement'}); return false;
      });
      var shuffle = function() {
        xbmc.playerSet({type: 'shuffle', value: 'toggle'}); return false;
      };

      $controls.find('.shuffle').on('click', shuffle);

      var repeat = function() {
        xbmc.playerSet({type: 'repeat', value: 'cycle'});
        return false;
      };
      
      $controls.find('.repeat').on('click', repeat);
      
      xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
        var $shuffleBtn = $('.button.shuffle');
        if (status == 'shuffleOn') {
          $shuffleBtn.unbind('click');
          $shuffleBtn.bind('click', shuffle);
          $shuffleBtn.addClass('unshuffle');
          $shuffleBtn.attr('title', mkf.lang.get('Shuffle', 'Tool tip'));

        } else if (status == 'shuffleOff') {
          $shuffleBtn.unbind('click');
          $shuffleBtn.bind('click', shuffle);
          $shuffleBtn.removeClass('unshuffle');
          $shuffleBtn.attr('title', mkf.lang.get('Unshuffle', 'Tool tip'));
        }
      });

      xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
        var $repeatBtn = $('.button.repeat');
        if (status == 'off') {
          $repeatBtn.unbind('click');
          $repeatBtn.bind('click', {"repeat": 'all'}, repeat);
          $repeatBtn.removeClass('repeatOff');
          $repeatBtn.addClass('repeat');
          $repeatBtn.attr('title', mkf.lang.get('Repeat All', 'Tool tip'));
        } else if (status == 'all') {
          $repeatBtn.unbind('click');
          $repeatBtn.bind('click', {"repeat": 'one'}, repeat);
          $repeatBtn.addClass('repeat1');
          $repeatBtn.attr('title', mkf.lang.get('Repeat One', 'Tool tip'));
        } else if (status == 'one') {
          $repeatBtn.unbind('click');
          $repeatBtn.removeClass('repeat1');
          $repeatBtn.bind('click', {"repeat": 'off'}, repeat);      
          $repeatBtn.addClass('repeatOff');
          $repeatBtn.attr('title', mkf.lang.get('Repeat Off', 'Tool tip'));
        }
      });
      
      this.each (function() {
        $(this).append($controls.clone(true));
      });
    };
  }; // END player32
  
  /* ########################### *\
   |  System-Buttons
  \* ########################### */
  $.fn.defaultSystemButtons = function() {
    if (awxUI.settings.input || awxUI.settings.player || awxUI.settings.volume) {
      var $exitButton = $('<a href="" class="exit"></a>');
      var currentProfile = '';
      $exitButton.click(function() {
        var dialogHandle = mkf.dialog.show(
          {
            content :
            '<h1 id="systemControlTitle" class="title">' + mkf.lang.get('System Control') + '</h1>' +
            (awxUI.settings.input? '<div class="input_big"><div><a href="" class="bigHome" title="' + mkf.lang.get('Home',  'Tool tip') + '"></a>' +
            '<a href="" class="bigUp" title="' + mkf.lang.get('Up', 'Tool tip') + '"></a>' +
            '<a href="" class="bigBack" title="' + mkf.lang.get('Back', 'Tool tip') + '"></a></div>' +
            '<div><a href="" class="bigLeft" title="' + mkf.lang.get('Left', 'Tool tip') + '"></a>' +
            '<a href="" class="bigSelect" title="' + mkf.lang.get('Select', 'Tool tip') + '"></a>' +
            '<a href="" class="bigRight" title="' + mkf.lang.get('Right', 'Tool tip') + '"></a></div>' +
            
            '<div><a href="" class="bigInfo" title="' + mkf.lang.get('Information', 'Tool tip') + '"></a><a href="" class="bigDown" title="' + mkf.lang.get('Down', 'Tool tip') + '"></a><a href="" class="bigContextMenu" title="' + mkf.lang.get('Context Menu', 'Tool tip') + '"></a></div>' +
            '</div>' : '') +
            
            (awxUI.settings.player? '<div class="controlsPlayer">' +
            '<a href="" class="bigPlayPause" title="' + mkf.lang.get('Play/Pause', 'Tool tip') + '"></a><a href="" class="bigPrev" title="' + mkf.lang.get('Previous', 'Tool tip') + '"></a><a href="" class="bigNext" title="' + mkf.lang.get('Next', 'Tool tip') + '"></a>' +
            '<a href="" class="bigStop" title="' + mkf.lang.get('Stop', 'Tool tip') + '"></a><a href="" class="bigRW" title="' + mkf.lang.get('Rewind', 'Tool tip') + '"></a><a href="" class="bigFF" title="' + mkf.lang.get('Fast Forward', 'Tool tip') + '"></a>' : '') +
            (awxUI.settings.volume? '<a href="" class="bigMute" title="' + mkf.lang.get('Mute On/Off', 'Tool tip') + '"></a><a href="" class="bigVolDown" title="' + mkf.lang.get('Decrease Volume', 'Tool tip') + '"></a><a href="" class="bigVolUp" title="' + mkf.lang.get('Increase Volume', 'Tool tip') + '"></a>' : '') +
            '</div>' +
            
            '</div>' +
            
            (awxUI.settings.input? '<div class="input_big_av"><div><a href="" class="bigSubPrev" title="' + mkf.lang.get('Previous Subtitles', 'Tool tip') + '"></a>' +
            '<a href="" class="bigSubOnOff" title="' + mkf.lang.get('Subtitles On/Off', 'Tool tip') + '"></a>' +
            '<a href="" class="bigSubNext" title="' + mkf.lang.get('Next Subtitles', 'Tool tip') + '"></a></div>' +
            
            '<div><a href="" class="bigAudioPrev" title="' + mkf.lang.get('Previous Audio Stream', 'Tool tip') + '"></a>' +
            '<a href="" class="bigAudioNext" title="' + mkf.lang.get('Next Audio Stream', 'Tool tip') + '"></a></div>' +
            '</div>' : '') +

            (awxUI.settings.player? '<div class="controlsPlayerEx">' +
            '<a href="" class="bigShuffle" title="' + mkf.lang.get('Shuffle', 'Tool tip') + '"></a>' +
            '<a href="" class="bigRepeat" title="' + mkf.lang.get('Repeat All', 'Tool tip') + '"></a>' +
            '</div>' : '') +
            
            (awxUI.settings.profiles? '<div class="profiles">' +
            '<fieldset class="profiles">' +
            '<legend>' + mkf.lang.get('Profiles', 'Settings label') + '</legend>' +
            '<select name="profile" id="profile" size="1"></select>' +
            '<a href="" class="switchProfile" title="' + mkf.lang.get('Switch Profile' , 'Tool tip') + '"></a>' +
            '</fieldset>' +
            '</div>' : '') +
            
            (awxUI.settings.system? '<div class="systemControls">' +
            '<a href="" class="exitXBMC" title="' + mkf.lang.get('Exit XBMC' , 'Tool tip') + '"></a>' +
            '<a href="" class="shutdown" title="' + mkf.lang.get('Shut Down' , 'Tool tip') + '"></a>' +
            '<a href="" class="suspend" title="' + mkf.lang.get('Suspend', 'Tool tip') + '"></a>' +
            '<a href="" class="reboot" title="' + mkf.lang.get('Reboot', 'Tool tip') + '"></a>' + 
            '</div>' : '')
          }
          
        );
        xbmc.getCurrentProfile({
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          },
          onSuccess: function(result) {
            //console.log(result);
            currentProfile = result.label;
          }
        });
        xbmc.getProfiles({
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          },
          onSuccess: function(result) {
            $.each(result.profiles, function(idx, profiles) {
            $('select#profile').append('<option value="' + profiles.label + '"' + (profiles.label==currentProfile? ' selected="selected"': '') + '>' + profiles.label + '</option>');
            });
            $('.switchProfile').click(function() {
              xbmc.setLoadProfile({name: $( "#profile option:selected" ).text(),
              onSuccess: mkf.messageLog.show(mkf.lang.get('Profile switched', 'Popup message'),
              mkf.dialog.show({content:'<h1>' + mkf.lang.get('Refresh the page to see the new profile.') + '</h1>', closeButton: false}),
              mkf.messageLog.status.success, 5000), onError: failed});
              return false;
            });
          }
        });
        mkf.dialog.addClass(dialogHandle, 'dialogSystemControl');

        var showQuitMessage = function () {
          $('body').empty();
          mkf.dialog.show({content:'<h1>' + mkf.lang.get('XBMC has quit. You can close this window.') + '</h1>', closeButton: false});
        };

        var failed = function() {
          mkf.messageLog.show(mkf.lang.get('Failed to send command!', 'Popup message'), mkf.messageLog.status.error, 5000);
        };
        
        $('.exitXBMC').click(function() {
          if (confirm(mkf.lang.get('Are you sure?', 'Alert'))) xbmc.shutdown({type: 'quit', onSuccess: showQuitMessage, onError: failed}); return false;
        });
        $('.shutdown').click(function() {
          if (confirm(mkf.lang.get('Are you sure?', 'Alert'))) xbmc.shutdown({type: 'shutdown', onSuccess: showQuitMessage, onError: failed}); return false;
        });
        $('.suspend').click(function() {
          if (confirm(mkf.lang.get('Are you sure?', 'Alert'))) xbmc.shutdown({type: 'suspend', onSuccess: showQuitMessage, onError: failed}); return false;
        });
        $('.reboot').click(function() {
          if (confirm(mkf.lang.get('Are you sure?', 'Alert'))) xbmc.shutdown({type: 'reboot', onSuccess: showQuitMessage, onError: failed}); return false;
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
        $('.bigContextMenu').click(function() {
          xbmc.input({type: 'ContextMenu', onError: failed}); return false;
        });
        $('.bigInfo').click(function() {
          xbmc.input({type: 'Info', onError: failed}); return false;
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
        $('.bigPlayPause').click(function() {
          xbmc.control({type: 'play'}); return false;
        });
        $('.bigStop').click(function() {
          xbmc.control({type: 'stop'}); return false;
        });
        $('.bigNext').click(function() {
          xbmc.playerGoTo({to: 'next'}); return false;
        });
        $('.bigPrev').click(function() {
          xbmc.playerGoTo({to: 'previous'}); return false;
        });
        $('.bigRW').click(function() {
          xbmc.controlSpeed({type: 'decrement'}); return false;
        });
        $('.bigFF').click(function() {
          xbmc.controlSpeed({type: 'increment'}); return false;
        });
        $('.bigMute').click(function() {
          xbmc.setMute(); return false;
        });
        $('.bigVolDown').click(function() {
          xbmc.setVolumeInc({volume: 'decrement'}); return false;
        });
        $('.bigVolUp').click(function() {
          xbmc.setVolumeInc({volume: 'increment'}); return false;
        });

        var bigShuffle = function(event) {
          xbmc.playerSet({type: 'shuffle', value: 'toggle'}); return false;
        };

        $('a.bigShuffle').on('click', bigShuffle);

        var bigRepeat = function(event) {
          xbmc.playerSet({type: 'repeat', value: 'cycle'});
          return false;
        };
        
        $('a.bigRepeat').on('click', bigRepeat);
        
        xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
          var $bigShuffleBtn = $('.bigShuffle');
          if (status == 'shuffleOn') {
            $bigShuffleBtn.unbind('click');
            $bigShuffleBtn.bind('click', {"shuffle": false}, bigShuffle);
            $bigShuffleBtn.addClass('bigUnshuffle');
            $bigShuffleBtn.attr('title', mkf.lang.get('Shuffle Off', 'Tool tip'));

          } else if (status == 'shuffleOff') {
            $bigShuffleBtn.unbind('click');
            $bigShuffleBtn.bind('click', {"shuffle": true}, bigShuffle);
            $bigShuffleBtn.removeClass('bigUnshuffle');
            $bigShuffleBtn.attr('title', mkf.lang.get('Shuffle On', 'Tool tip'));
          }
          //No idea if we're in Audio or Video playlist; refresh both..
          awxUI.onMusicPlaylistShow();
          awxUI.onVideoPlaylistShow();
        });

        xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
          var $bigRepeatBtn = $('.bigRepeat');
          if (status == 'off') {
            $bigRepeatBtn.unbind('click');
            $bigRepeatBtn.bind('click', {"repeat": 'all'}, bigRepeat);
            $bigRepeatBtn.removeClass('bigRepeatOff');
            $bigRepeatBtn.addClass('bigRepeat');
            $bigRepeatBtn.attr('title', mkf.lang.get('Repeat All', 'Tool tip'));
          } else if (status == 'all') {
            $bigRepeatBtn.unbind('click');
            $bigRepeatBtn.bind('click', {"repeat": 'one'}, bigRepeat);
            $bigRepeatBtn.addClass('bigRepeat1');
            $bigRepeatBtn.attr('title', mkf.lang.get('Repeat One', 'Tool tip'));
          } else if (status == 'one') {
            $bigRepeatBtn.unbind('click');
            $bigRepeatBtn.removeClass('bigRepeat1');
            $bigRepeatBtn.bind('click', {"repeat": 'off'}, bigRepeat);      
            $bigRepeatBtn.addClass('bigRepeatOff');
            $bigRepeatBtn.attr('title', mkf.lang.get('Repeat Off', 'Tool tip'));
          }
        });
      
        return false;
      });

    };
    // -----------------

    var $settingsButton = $('<a href="" class="settings"></a>');
    $settingsButton.click(function() {
      //For switching off key binds
      inputControls = false;
      
      var lazyload = (awxUI.settings.lazyload? awxUI.settings.lazyload : 'no');
      var timeout = (awxUI.settings.timeout? awxUI.settings.timeout : 20);
      var limitVideo = (awxUI.settings.limitMovies? awxUI.settings.limitMovies : 25);
      var limitMusicVideo = (awxUI.settings.limitMV? awxUI.settings.limitMV : 25);
      var limitTV = (awxUI.settings.limitTV? awxUI.settings.limitTV : 25);
      var limitArtists = (awxUI.settings.limitArtists? awxUI.settings.limitArtists : 25);
      var limitAlbums = (awxUI.settings.limitAlbums? awxUI.settings.limitAlbums : 25);
      var limitSongs = (awxUI.settings.limitSongs? awxUI.settings.limitSongs : 25);
      //var ui = mkf.cookieSettings.get('ui', 'uni');
      //var oldui = mkf.cookieSettings.get('ui');
      var lang = mkf.cookieSettings.get('lang', 'en');
      var watched = (awxUI.settings.watched? 'yes' : 'no');
      var hidewatchedmark = (awxUI.settings.hideWatchedMark? 'yes' : 'no');
      //var cinex = mkf.cookieSettings.get('cinex', 'no');
      var hoverOrClick = (awxUI.settings.hoverOrClick? 'yes' : 'no');
      //var listview = mkf.cookieSettings.get('listview', 'no');
      var artistsView = (awxUI.settings.artistsView? awxUI.settings.artistsView : 'list');
      var artistsPath = (awxUI.settings.artistsPath? awxUI.settings.artistsPath : '');
      var albumsView = (awxUI.settings.albumsView? awxUI.settings.albumsView : 'cover');
      var albumsViewRec = (awxUI.settings.albumsViewRec? awxUI.settings.albumsViewRec : 'cover');
      var filmView = (awxUI.settings.filmView? awxUI.settings.filmView : 'poster');
      var filmViewRec = (awxUI.settings.filmViewRec? awxUI.settings.filmViewRec : 'poster');
      var filmViewSets = (awxUI.settings.filmViewSets? awxUI.settings.filmViewSets : 'poster');
      var TVView = (awxUI.settings.TVView? awxUI.settings.TVView : 'banner');
      var TVViewRec = (awxUI.settings.TVViewRec? awxUI.settings.TVViewRec : 'infolist');
      var EpView = (awxUI.settings.EpView? awxUI.settings.EpView : 'listover');
      var usefanart = (awxUI.settings.useFanart? 'yes' : 'no');
      var usextrafanart = (awxUI.settings.useXtraFanart? 'yes' : 'no');
      var filmSort = (awxUI.settings.filmSort? awxUI.settings.filmSort : 'label');
      var TVSort = (awxUI.settings.tvSort? awxUI.settings.tvSort : 'label');
      var EpSort = (awxUI.settings.epSort? awxUI.settings.epSort : 'episode');
      var albumSort = (awxUI.settings.albumSort? awxUI.settings.albumSort : 'album');
      var mvSort = (awxUI.settings.musicVideosSort? awxUI.settings.musicVideosSort : 'artist');
      var mvdesc = (awxUI.settings.musicVideosdesc == 'descending'? 'descending' : 'ascending');
      var mdesc = (awxUI.settings.mdesc == 'descending'? 'descending' : 'ascending');
      var tvdesc = (awxUI.settings.tvdesc == 'descending'? 'descending' : 'ascending');
      var epdesc = (awxUI.settings.epdesc == 'descending'? 'descending' : 'ascending');
      var adesc = (awxUI.settings.adesc == 'descending'? 'descending' : 'ascending');
      var startPage = (awxUI.settings.startPage? awxUI.settings.startPage : 'recentTV');
      var showTags = (awxUI.settings.showTags? 'yes' : 'no');
      var rotateCDart = (awxUI.settings.rotateCDart? awxUI.settings.rotateCDart : 'no');
      var manualPath = mkf.cookieSettings.get('manualPath');
      var preferLogos = (awxUI.settings.preferLogos? 'yes' : 'no');
      var controllerOnPlay = (awxUI.settings.controllerOnPlay? 'yes' : 'no');
      var inputKey = (awxUI.settings.inputKey? awxUI.settings.inputKey : 0);
      var actionOnPlay = (awxUI.settings.actionOnPlay? awxUI.settings.actionOnPlay : 0);
      
      var dialogContent = $('<h1 id="systemControlTitle" class="title">' + mkf.lang.get('Settings', 'Settings tab') + '</h1>' +
        '<div class="tabs"><div id="tabs">' +
        '<ul><li><a href="#tabs-1">' + mkf.lang.get('General', 'Settings tab') +'</a></li>' +
          '<li><a href="#tabs-2">' + mkf.lang.get('Video Views', 'Settings tab') +'</a></li>' +
          '<li><a href="#tabs-3">' + mkf.lang.get('Music Views', 'Settings tab') +'</a></li>' +
          '<li><a href="#tabs-4">' + mkf.lang.get('Sorting', 'Settings tab') +'</a></li>' +
          '<li><a href="#tabs-5">' + mkf.lang.get('Kodi Settings', 'Settings tab') +'</a></li></ul>' +
        '<div id="tabs-1">' +
        '<form name="settingsForm">' +
        /*'<fieldset class="ui_settings">' +
        '<legend>' + mkf.lang.get('group_ui') + '</legend>' +
        '<input type="radio" id="defaultUI" name="userinterface" value="default" ' + (ui=='default'? 'checked="checked"' : '') + '><label for="defaultUI">' + mkf.lang.get('label_default_ui') +'</label>' +
        '<input type="radio" id="lightUI" name="userinterface" value="light" ' + (ui=='light'? 'checked="checked"' : '') + '><label for="lightUI">Light UI</label>' +
        '<input type="radio" id="lightDarkUI" name="userinterface" value="lightDark" ' + (ui=='lightDark'? 'checked="checked"' : '') + '><label for="lightDarkUI">LightDark UI</label>' +
        '<input type="radio" id="uni" name="userinterface" value="uni" ' + (ui=='uni'? 'checked="checked"' : '') + '><label for="uni">Uni UI</label>' +
        '</fieldset>' +*/
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Language', 'Settings label') + '</legend>' +
        '<select name="lang" id="lang" size="1"></select>' +
        '</fieldset>' +
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Start Page', 'Settings label') + '</legend>' +
        '<select id="startPage" name="startPage">' +
        '<option value="recentAlbums" ' + (startPage=='recentAlbums'? 'selected' : '') + '>' + mkf.lang.get('Recently Added Albums', 'Settings option') + '</option>' +
        '<option value="recentTV" ' + (startPage=='recentTV'? 'selected' : '') + '>' + mkf.lang.get('Recently Added TV Episodes', 'Settings option') + '</option>' +
        '<option value="recentMovies" ' + (startPage=='recentMovies'? 'selected' : '') + '>' + mkf.lang.get('Recently Added Movies', 'Settings option') + '</option>' +
        '<option value="movies"' + (startPage=='movies'? 'selected' : '') + '>' + mkf.lang.get('Movies', 'Settings option') + '</option>' +
        '<option value="tv"' + (startPage=='tv'? 'selected' : '') + '>' + mkf.lang.get('TV Shows', 'Settings option') + '</option>' +
        '<option value="albums"' + (startPage=='albums'? 'selected' : '') + '>' + mkf.lang.get('Albums', 'Settings option') + '</option>' +
        '<option value="artists"' + (startPage=='artists'? 'selected' : '') + '>' + mkf.lang.get('Artists', 'Settings option') + '</option>' +
        '<option value="musicPlaylist"' + (startPage=='musicPlaylist'? 'selected' : '') + '>' + mkf.lang.get('Music Playlists', 'Settings option') + '</option>' +
        '</select>' +
        '</fieldset>' +
        
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Input keys', 'Settings label') + '</legend>' +
        '<select id="inputKey" name="inputKey">' +
        '<option value=0 ' + (inputKey==0? 'selected' : '') + '>' + mkf.lang.get('Always inactive', 'Settings option') + '</option>' +
        '<option value=1 ' + (inputKey==1? 'selected' : '') + '>' + mkf.lang.get('Active when playing', 'Settings option') + '</option>' +
        '<option value=2 ' + (inputKey==2? 'selected' : '') + '>' + mkf.lang.get('Always active', 'Settings option') + '</option>' +
        '</select>' +
        '</fieldset>' +
        
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Action on play', 'Settings label') + '</legend>' +
        '<select id="actionOnPlay" name="actionOnPlay">' +
        '<option value=0 ' + (actionOnPlay==0? 'selected' : '') + '>' + mkf.lang.get('Show player controls', 'Settings option') + '</option>' +
        '<option value=1 ' + (actionOnPlay==1? 'selected' : '') + '>' + mkf.lang.get('Do nothing', 'Settings option') + '</option>' +
        '<option value=2 ' + (actionOnPlay==2? 'selected' : '') + '>' + mkf.lang.get('Fullscreen mode', 'Settings option') + '</option>' +
        '<option value=3 ' + (actionOnPlay==3? 'selected' : '') + '>' + mkf.lang.get('Fullscreen mode with lyrics', 'Settings option') + '</option>' +
        '<option value=4 ' + (actionOnPlay==4? 'selected' : '') + '>' + mkf.lang.get('Always show player controls', 'Settings option') + '</option>' +
        '</select>' +
        
        '</fieldset>' +
        /*'<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Manual File Directory', 'Settings label') + '</legend>' +
        '<input type="text" name="manual_path" id="manual_path" style="width: 98%">' +
        '</fieldset>' +*/

        '<fieldset style="clear: left">' +
        '<legend>' + mkf.lang.get('Expert', 'Settings label') + '</legend>' +
        '<a href="" class="formButton expertHelp" title="' + mkf.lang.get('Help', 'Settings label') + '">' + mkf.lang.get('Help', 'Settings label') + '</a>' + 
        '<input type="checkbox" id="usefanart" name="usefanart" ' + (usefanart=='yes'? 'checked="checked"' : '') + '><label for="usefanart">' + mkf.lang.get('Use fan art as background', 'Settings option') + '</label>' +
        '<input type="checkbox" id="usextrafanart" name="usextrafanart" ' + (usextrafanart=='yes'? 'checked="checked"' : '') + '><label for="usextrafanart">' + mkf.lang.get('Use extra fan art', 'Settings option') + '</label>' +
        '<input type="checkbox" id="hoverOrClick" name="hoverOrClick" ' + (hoverOrClick=='yes'? 'checked="checked"' : '') + '><label for="hoverOrClick">' + mkf.lang.get('Click to show item menus', 'Settings option') + '</label>' +
        '<br /><input type="checkbox" id="lazyload" name="lazyload" ' + (lazyload=='yes'? 'checked="checked"' : '') + '><label for="lazyload">' + mkf.lang.get('Use LazyLoad for Thumbnails', 'Settings option') + '</label>' +
        '<input type="checkbox" id="showTags" name="showTags" ' + (showTags=='yes'? 'checked="checked"' : '') + '><label for="showTags">' + mkf.lang.get('Show codec tags', 'Settings option') + '</label>' +
        '<input type="checkbox" id="rotateCDart" name="rotateCDart" ' + (rotateCDart=='yes'? 'checked="checked"' : '') + '><label for="rotateCDart">' + mkf.lang.get('Rotate CD art', 'Settings option') + '</label><br />' +
        '<input type="checkbox" id="preferLogos" name="preferLogos" ' + (preferLogos=='yes'? 'checked="checked"' : '') + '><label for="preferLogos">' + mkf.lang.get('Prefer Logos', 'Settings option') + '</label>' +
        //'<input type="checkbox" id="controllerOnPlay" name="controllerOnPlay" ' + (controllerOnPlay=='yes'? 'checked="checked"' : '') + '><label for="controllerOnPlay">' + mkf.lang.get('Control display when playing', 'Settings option') + '</label><br />' +
        '<br /><label for="timeout">' + mkf.lang.get('Time Out for Ajax-Requests:', 'Settings option') + '</label><input type="text" id="timeout" name="timeout" value="' + timeout + '" maxlength="3" style="width: 30px; margin-top: 10px;"> ' + mkf.lang.get('seconds', 'Settings label') +
        '</fieldset>' +
        '<a href="" class="formButton save">' + mkf.lang.get('Save', 'Settings label') + '</a>' + 
        '</form>' +
        '</div>' +
        
        //Video tab
        '<div id="tabs-2">' +
        '<form name="settingsViewsVideo">' +
        
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Movies', 'Settings label') + '</legend>' +
        '<select name="filmView"><option value="poster" ' + (filmView=='poster'? 'selected' : '') + '>' + mkf.lang.get('Posters', 'Settings option') +
        '</option><option value="listover" ' + (filmView=='listover'? 'selected' : '') + '>' + mkf.lang.get('List (Details overlay)', 'Settings option') +
        '</option><option value="listin" ' + (filmView=='listin'? 'selected' : '') + '>' + mkf.lang.get('List (Details inline)', 'Settings option') +'</option><option value="accordion"' + (filmView=='accordion'? 'selected' : '') + '>' + mkf.lang.get('Accordion (Details inline)', 'Settings option') + '</option>' +
        '<option value="singlePoster" ' + (filmView=='singlePoster'? 'selected' : '') + '>' + mkf.lang.get('Single Posters', 'Settings option') +'</option>' +
        '<option value="logo" ' + (filmView=='logo'? 'selected' : '') + '>' + mkf.lang.get('Logos', 'Settings option') +'</option>' +
        '<option value="poster" ' + (filmView=='poster'? 'selected' : '') + '>' + mkf.lang.get('Posters', 'Settings option') +'</option>' +
        '<option value="thumbnail" ' + (filmView=='thumbnail'? 'selected' : '') + '>' + mkf.lang.get('Thumbnails', 'Settings option') +'</option>' +
        '<option value="clearart" ' + (filmView=='clearart'? 'selected' : '') + '>' + mkf.lang.get('Clear Art', 'Settings option') +'</option>' +
        '</select>' +
        '</fieldset>' +
        
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Movie Sets', 'Settings label') + '</legend>' +
        '<select name="filmViewSets"><option value="poster" ' + (filmViewSets=='poster'? 'selected' : '') + '>' + mkf.lang.get('Posters', 'Settings option') +
        '</option><option value="listover" ' + (filmViewSets=='listover'? 'selected' : '') + '>' + mkf.lang.get('List (Details overlay)', 'Settings option') + '</option>' +
        '</select>' +
        '</fieldset>' +
        
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Recently Added Movies', 'Settings label') + '</legend>' +
        '<select name="filmViewRec"><option value="poster" ' + (filmViewRec=='poster'? 'selected' : '') + '>' + mkf.lang.get('Posters', 'Settings option') +
        '</option><option value="listover" ' + (filmViewRec=='listover'? 'selected' : '') + '>' + mkf.lang.get('List (Details overlay)', 'Settings option') +
        '</option><option value="listin" ' + (filmViewRec=='listin'? 'selected' : '') + '>' + mkf.lang.get('List (Details inline)', 'Settings option') +
        '</option><option value="accordion"' + (filmViewRec=='accordion'? 'selected' : '') + '>' + mkf.lang.get('Accordion (Details inline)', 'Settings option') + '</option>' +
        '<option value="singlePoster" ' + (filmViewRec=='singlePoster'? 'selected' : '') + '>' + mkf.lang.get('Single Posters', 'Settings option') +'</option>' +
        '<option value="logo" ' + (filmViewRec=='logo'? 'selected' : '') + '>' + mkf.lang.get('Logos', 'Settings option') +'</option>' +
        '</select>' +
        '</fieldset>' +
        
        '<fieldset class="ui_views" style="clear: left">' +
        '<legend>' + mkf.lang.get('TV Shows', 'Settings label') + '</legend>' +
        '<select name="TVView">' +
        '<option value="banner" ' + (TVView=='banner'? 'selected' : '') + '>' + mkf.lang.get('Banners', 'Settings option') + '</option>' +
        '<option value="poster" ' + (TVView=='poster'? 'selected' : '') + '>' + mkf.lang.get('Posters', 'Settings option') + '</option>' +
        '<option value="listover" ' + (TVView=='listover'? 'selected' : '') + '>' + mkf.lang.get('List (Details overlay)', 'Settings option') + '</option>' +
        '<option value="logo" ' + (TVView=='logo'? 'selected' : '') + '>' + mkf.lang.get('Logos', 'Settings option') + '</option>' +
        '</select>' +
        '</fieldset>' +
        
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Recently Added TV Episodes', 'Settings label') + '</legend>' +
        '<select name="TVViewRec">' +
        '<option value="infolist" ' + (TVViewRec=='infolist'? 'selected' : '') + '>' + mkf.lang.get('Information List', 'Settings option') + '</option>' +
        '<option value="thumbnail" ' + (TVViewRec=='thumbnail'? 'selected' : '') + '>' + mkf.lang.get('Thumbnails', 'Settings option') + '</option>' +
        '</select>' +
        '</fieldset>' +

        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Episodes', 'Settings label') + '</legend>' +
        '<select name="EpView"><option value="listover" ' + (EpView=='listover'? 'selected' : '') + '>' + mkf.lang.get('List (Details overlay)', 'Settings option') + '</option>' +
        '<option value="thumbnail" ' + (EpView=='thumbnail'? 'selected' : '') + '>' + mkf.lang.get('Information List', 'Settings option') + '</option>' +
        '<option value="thumbnailnoplot" ' + (EpView=='thumbnailnoplot'? 'selected' : '') + '>' + mkf.lang.get('Thumbnails', 'Settings option') + '</option>' +
        '</select>' +
        '</fieldset>' +
        
        '<fieldset style="clear: left">' +
        '<legend>' + mkf.lang.get('View Options', 'Settings label') + '</legend>' +
        '<input type="checkbox" id="watched" name="watched" ' + (watched=='yes'? 'checked="checked"' : '') + '><label for="watched">' + mkf.lang.get('Hide watched (Movies and TV)', 'Settings option') + '</label>' +
        '<input type="checkbox" id="hidewatchedmark" name="hidewatchedmark" ' + (hidewatchedmark=='yes'? 'checked="checked"' : '') + '><label for="hidewatchedmark">' + mkf.lang.get('Hide watched mark', 'Settings option') + '</label>' +
        //'<input type="checkbox" id="cinex" name="cinex" ' + (cinex=='yes'? 'checked="checked"' : '') + '><label for="cinex">' + mkf.lang.get('label_cinex') + '</label>' +
        '<br /><label for="limitVideo">' + mkf.lang.get('Number of items to list:', 'Settings label') + ' </label><input type="text" id="limitVideo" name="limitVideo" value="' + limitVideo + '" maxlength="3" style="width: 30px; margin-top: 10px;"> ' + mkf.lang.get('for movie based views.', 'Settings label') +
        '<br /><label for="limitTV">' + mkf.lang.get('Number of items to list:', 'Settings label') + ' </label><input type="text" id="limitTV" name="limitTV" value="' + limitTV + '" maxlength="3" style="width: 30px; margin-top: 10px;"> ' + mkf.lang.get('for TV based views.', 'Settings label') +        
        '<br /><label for="limitMusicVideo">' + mkf.lang.get('Number of items to list:', 'Settings label') + ' </label><input type="text" id="limitMusicVideo" name="limitMusicVideo" value="' + limitMusicVideo + '" maxlength="3" style="width: 30px; margin-top: 10px;"> ' + mkf.lang.get('for music video based views.', 'Settings label') +
        '</fieldset>' +
        //'<div class="formHint">' + mkf.lang.get('* Not recommended for a large amount of items.') + '</div>' +
        '<a href="" class="formButton save">' + mkf.lang.get('Save', 'Settings label') + '</a>' + 
        '</form>' +
        '</div>' +
        
        //Music tab
        '<div id="tabs-3">' +
        '<form name="settingsViewsMusic">' +
        
        //Artists
        '<fieldset class="ui_views" style="min-width: 270px">' +
        '<legend>' + mkf.lang.get('Artists', 'Settings label') + '</legend>' +
        '<select id="artists" name="artistsView"><option value="cover" ' + (artistsView=='cover'? 'selected' : '') + '>' + mkf.lang.get('Covers', 'Settings option') + '</option>' +
        '<option value="list" ' + (artistsView=='list'? 'selected' : '') + '>' + mkf.lang.get('List (Details overlay)', 'Settings option') + '</option>' +
        '<option value="banner" ' + (artistsView=='banner'? 'selected' : '') + '>' + mkf.lang.get('Banners', 'Settings option') + '</option>' +
        '<option value="logo" ' + (artistsView=='logo'? 'selected' : '') + '>' + mkf.lang.get('Logos', 'Settings option') + '</option>' +
        '<option value="logosingle"' + (artistsView=='logosingle'? 'selected' : '') + '>' + mkf.lang.get('Single Logos', 'Settings option') + '</option>' +
        '</select>' +
        '<input type="text" name="artists_path" id="artists_path" style="display: ' + (artistsView == 'banner' || artistsView == 'logo' || artistsView == 'logosingle'? 'block' : 'none') + ';" />' +
        '</fieldset>' +
        
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Albums', 'Settings label') + '</legend>' +
        '<select name="albumsView"><option value="cover" ' + (albumsView=='cover'? 'selected' : '') + '>' + mkf.lang.get('Covers', 'Settings option') +
        '</option><option value="list" ' + (albumsView=='list'? 'selected' : '') + '>' + mkf.lang.get('List (Details overlay)', 'Settings option') +
        '</option><option value="listin" ' + (albumsView=='listin'? 'selected' : '') + '>' + mkf.lang.get('List (Details inline)', 'Settings option') + '</option>' +
        '</select>' +
        '</fieldset>' +
        
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Recently Added Albums', 'Settings label') + '</legend>' +
        '<select name="albumsViewRec"><option value="cover" ' + (albumsViewRec=='cover'? 'selected' : '') + '>' + mkf.lang.get('Covers', 'Settings option') +
        '</option><option value="list" ' + (albumsViewRec=='list'? 'selected' : '') + '>' + mkf.lang.get('List (Details overlay)', 'Settings option') +
        '</option><option value="listin" ' + (albumsViewRec=='listin'? 'selected' : '') + '>' + mkf.lang.get('List (Details inline)', 'Settings option') + '</option>' +
        '</select>' +
        '</fieldset>' +
        
        '<fieldset style="clear: left">' +
        '<legend>' + mkf.lang.get('View Options', 'Settings label') + '</legend>' +
        '<label for="limitArtists">' + mkf.lang.get('Number of items to list:', 'Settings label') + ' </label><input type="text" id="limitArtists" name="limitMusic" value="' + limitArtists + '" maxlength="3" style="width: 30px; margin-top: 10px;"> ' + mkf.lang.get('for artist based views.', 'Settings label') +
        '<br /><label for="limitAlbums">' + mkf.lang.get('Number of items to list:', 'Settings label') + ' </label><input type="text" id="limitAlbums" name="limitAlbums" value="' + limitAlbums + '" maxlength="3" style="width: 30px; margin-top: 10px;"> ' + mkf.lang.get('for album based views.', 'Settings label') +
        '<br /><label for="limitSongs">' + mkf.lang.get('Number of items to list:', 'Settings label') + ' </label><input type="text" id="limitSongs" name="limitSong" value="' + limitSongs + '" maxlength="3" style="width: 30px; margin-top: 10px;"> ' + mkf.lang.get('for song based views.', 'Settings label') +
        '</fieldset>' +
        '<a href="" class="formButton save">' + mkf.lang.get('Save', 'Settings label') + '</a>' + 
        //'<div class="formHint">' + mkf.lang.get('label_settings_warning') + '</div>' +
        '</form>' +
        '</div>' +
        
        /*---- Sorting ----*/
        '<div id="tabs-4">' +
        '<form name="settingsSorting">' +
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Albums', 'Settings label') + '</legend>' +
        '' + mkf.lang.get('Order By:', 'Settings label') +'<select name="albumSort"><option value="album" ' + (albumSort=='album'? 'selected' : '') + '>' + mkf.lang.get('Titles', 'Settings option') +
        '</option><option value="artist" ' + (albumSort=='artist'? 'selected' : '') + '>' + mkf.lang.get('Artists', 'Settings option') +
        '</option><option value="year" ' + (albumSort=='year'? 'selected' : '') + '>' + mkf.lang.get('Years', 'Settings option') +'</option><option value="genre"' + (albumSort=='genre'? 'selected' : '') + '>' + mkf.lang.get('Genres', 'Settings option') +'</option>' +
        '<option value="dateadded" ' + (albumSort=='dateadded'? 'selected' : '') + '>' + mkf.lang.get('Date Added', 'Settings option') +
        '</select>' +
        '<input type="checkbox" id="adesc" name="adesc" ' + (adesc=='descending'? 'checked="checked"' : '') + '><label for="adesc">' + mkf.lang.get('Descending', 'Settings option') + '</label>' +
        '</fieldset>' +
        
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Music Videos', 'Settings label') + '</legend>' +
        '' + mkf.lang.get('Order By:', 'Settings label') +'<select name="mvSort"><option value="album" ' + (mvSort=='album'? 'selected' : '') + '>' + mkf.lang.get('Titles', 'Settings option') +
        '</option><option value="artist" ' + (mvSort=='artist'? 'selected' : '') + '>' + mkf.lang.get('Artists', 'Settings option') +
        '</option><option value="year" ' + (mvSort=='year'? 'selected' : '') + '>' + mkf.lang.get('Years', 'Settings option') +'</option><option value="genre"' + (mvSort=='genre'? 'selected' : '') + '>' + mkf.lang.get('Genres', 'Settings option') +'</option>' +
        '<option value="dateadded" ' + (mvSort=='dateadded'? 'selected' : '') + '>' + mkf.lang.get('Date Added', 'Settings option') +
        '</select>' +
        '<input type="checkbox" id="mvdesc" name="mvdesc" ' + (mvdesc=='descending'? 'checked="checked"' : '') + '><label for="mvdesc">' + mkf.lang.get('Descending', 'Settings option') + '</label>' +
        '</fieldset>' +
        
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Movies', 'Settings label') + '</legend>' +
        '' + mkf.lang.get('Order By:', 'Settings label') +'<select name="filmSort"><option value="label" ' + (filmSort=='label'? 'selected' : '') + '>' + mkf.lang.get('Titles', 'Settings option') +
        '</option><option value="sorttitle" ' + (filmSort=='sorttitle'? 'selected' : '') + '>' + mkf.lang.get('Sort Titles', 'Settings option') +
        '</option><option value="year" ' + (filmSort=='year'? 'selected' : '') + '>' + mkf.lang.get('Years', 'Settings option') +'</option><option value="genre"' + (filmSort=='genre'? 'selected' : '') + '>' + mkf.lang.get('Genres', 'Settings option') +'</option>' +
        '<option value="dateadded" ' + (filmSort=='dateadded'? 'selected' : '') + '>' + mkf.lang.get('Date Added', 'Settings option') +'</option><option value="videorating" ' + (filmSort=='videorating'? 'selected' : '') + '>' + mkf.lang.get('Ratings', 'Settings option') +
        '</option><option value="studio" ' + (filmSort=='studio'? 'selected' : '') + '>' + mkf.lang.get('Studios', 'Settings option') +'</option></select>' +
        '<input type="checkbox" id="mdesc" name="mdesc" ' + (mdesc=='descending'? 'checked="checked"' : '') + '><label for="mdesc">' + mkf.lang.get('Descending', 'Settings option') + '</label>' +
        '</fieldset>' +
        
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('TV Shows', 'Settings label') + '</legend>' +
        '' + mkf.lang.get('Order By:', 'Settings label') +'<select name="TVSort"><option value="label" ' + (TVSort=='label'? 'selected' : '') + '>' + mkf.lang.get('Titles', 'Settings option') +
        '</option>' +
        '</option><option value="year" ' + (TVSort=='year'? 'selected' : '') + '>' + mkf.lang.get('Years', 'Settings option') +
        '</option><option value="genre"' + (TVSort=='genre'? 'selected' : '') + '>' + mkf.lang.get('Genres', 'Settings option') +'</option>' +
        '<option value="videorating" ' + (TVSort=='videorating'? 'selected' : '') + '>' + mkf.lang.get('Ratings', 'Settings option') +
        '</option><option value="episode" ' + (TVSort=='episode'? 'selected' : '') + '>' + mkf.lang.get('Episodes', 'Settings option') +'</option></select>' +
        '<input type="checkbox" id="tvdesc" name="tvdesc" ' + (tvdesc=='descending'? 'checked="checked"' : '') + '><label for="mdesc">' + mkf.lang.get('Descending', 'Settings option') + '</label>' +
        '</fieldset>' +
        
        '<fieldset class="ui_views">' +
        '<legend>' + mkf.lang.get('Episodes', 'Settings label') + '</legend>' +
        '' + mkf.lang.get('Order By:', 'Settings label') +'<select name="EpSort"><option value="label" ' + (EpSort=='label'? 'selected' : '') + '>' + mkf.lang.get('Titles', 'Settings option') +
        '</option>' +
        '<option value="dateadded" ' + (EpSort=='dateadded'? 'selected' : '') + '>' + mkf.lang.get('Date Added', 'Settings option') + '</option>'  +
        '<option value="videorating" ' + (EpSort=='videorating'? 'selected' : '') + '>' + mkf.lang.get('Ratings', 'Settings option') +
        '</option><option value="episode" ' + (EpSort=='episode'? 'selected' : '') + '>' + mkf.lang.get('Episodes', 'Settings option') +'</option></select>' +
        '<input type="checkbox" id="epdesc" name="epdesc" ' + (epdesc=='descending'? 'checked="checked"' : '') + '><label for="mdesc">' + mkf.lang.get('Descending', 'Settings option') + '</label>' +
        '</fieldset>' +
        '<a href="" class="formButton save">' + mkf.lang.get('Save', 'Settings label') + '</a>' + 
        '</form>' +
        '</div>' +
        
        //Kodi settings
        '<div id="tabs-5">' +
        //insert from uiviews.kodiSettings()
          //uiviews.kodiSettings() +
        '</div>' +

        /*'</div>' +
        '<a href="" class="formButton save">' + mkf.lang.get('Save', 'Settings label') + '</a>' + 
        '<div class="formHint">' + mkf.lang.get('(Settings are stored in cookies. You need to enable cookies for this site.)', 'Settings') + '</div>' +*/
        '</div>');
        
      var dialogHandle = mkf.dialog.show();
      mkf.dialog.setContent(dialogHandle, dialogContent);
      
      dialogContent.find('#tabs-5').append(uiviews.kodiSettings());
      
      //Populate langs
      mkf.lang.getLanguages(function(objls) {
        if (!objls) {
          //No lang files.
          $('select#lang').replaceWith('No language files found!')
        } else {
          $.each(objls, function(idx, langs) {
            //console.log(langs);
            $('select#lang').append('<option value="' + langs + '"' + (langs==lang? ' selected="selected"': '') + '>' + langs + '</option>');
          });
          /*var langs = '';
          var c = 0;
          for (i=0; i < objls.length; i++) {
            c++
            langs += '<option value="' + objls[i].code + '"' + (lang==objls[i].code? ' selected="selected"': '') + '>' + objls[i].Language + (objls[i]['Language-Team'] == ' '? '' : ' -' + objls[i]['Language-Team'] ) + '</option>';
            if (c == objls.length) { $('select#lang').append(langs) };
          };*/
        };
      });
      
      dialogContent.find('input[type=text]').blur(function() {
        if (inputControls) {
          xbmc.inputKeys('on');
        }
      }).focus(function() {
        if (awxUI.settings.inputKeysActive) {
        inputControls = true;
        xbmc.inputKeys('off');
      };
      });
      $('#artists').change(function() {
        $('#artists_path').css('display', ($(this).val() == 'logo' || $(this).val() == 'logosingle' || $(this).val() == 'banner') ? 'block' : 'none');
      });
      
      
      if (artistsPath) { $('input#artists_path').val(artistsPath) };
      if (manualPath) { $('input#manual_path').val(manualPath) };
      
      $( "#tabs" ).tabs({ selected: 0 });
      
      $('.expertHelp').click(function() {
        //JSON lang \n is escaped, replace \\n with \n.
        alert(mkf.lang.get('LazyLoad: \\nIf you activate LazyLoad, thumbnails will not be loaded until they become visible. This will save the server from many image-requests.\\nBut if you have many items (movies, albums,...) the webinterface can be laggy on scrolling if many thumbs are not loaded.\\nIf you deactivate LazyLoad, all thumbs will be loaded when the page is shown (movies page, albums page,...). It can take a short time until all thumbs are loaded.\\n\\nPrefer Logos:\\nIf a logo for an item is available use it instead of the title in information screens.\\n\\nTimeOut:\\nIf you have lots of movies (or albums...) it can take some time to get the complete movie list. You can increase the TimeOut-value to prevent errors when trying to show the movie list.\\n\\nManual File Directory:\\nEnter a directory location on your system that will be accessable via the \"Files\" menu. Invalid directories will not be shown.\\n').replace(/\\n/g,"\n"));
        return false;
      });

      $('.save').click(function() {
        //Check artistsPath ends with a /
        if (document.settingsViewsMusic.artists_path.value.lastIndexOf("/") + 1 != document.settingsViewsMusic.artists_path.value.length) { document.settingsViewsMusic.artists_path.value += '/'; };
        // Checks require artist logo location as skins.
        if (document.settingsViewsMusic.artistsView.value == 'banner' && !document.settingsViewsMusic.artists_path.value || document.settingsViewsMusic.artistsView.value == 'logo' && !document.settingsViewsMusic.artists_path.value || document.settingsViewsMusic.artistsView.value == 'logosingle' && !document.settingsViewsMusic.artists_path.value) {
          alert(mkf.lang.get('Please enter the artists path!', 'Alert'));
          return false;
        }

        var timeout = parseInt(document.settingsForm.timeout.value);
        if (isNaN(timeout) || timeout < 5 || timeout > 120) {
          alert(mkf.lang.get('Please enter a timeout-number between 5 and 120!', 'Alert'));
          return false;
        }

        var limitVideo = parseInt(document.settingsViewsVideo.limitVideo.value);
        if (isNaN(limitVideo) || limitVideo < 1 ) {
          limitVideo = 25;
        }

        var limitMusicVideo = parseInt(document.settingsViewsVideo.limitMusicVideo.value);
        if (isNaN(limitMusicVideo) || limitMusicVideo < 1 ) {
          limitMusicVideo = 25;
        }
        
        var limitTV = parseInt(document.settingsViewsVideo.limitTV.value);
        if (isNaN(limitTV) || limitTV < 1 ) {
          limitTV = 25;
        }
        
        var limitArtists = parseInt(document.settingsViewsMusic.limitArtists.value);
        if (isNaN(limitArtists) || limitArtists < 1 ) {
          limitArtists = 25;
        }
        
        var limitAlbums = parseInt(document.settingsViewsMusic.limitAlbums.value);
        if (isNaN(limitAlbums) || limitAlbums < 1 ) {
          limitAlbums = 25;
        }
        
        var limitSongs = parseInt(document.settingsViewsMusic.limitSongs.value);
        if (isNaN(limitSongs) || limitSongs < 1 ) {
          limitSongs = 25;
        }
        
        if (document.settingsForm.lang.selectedIndex < 0) {
          alert(mkf.lang.get('Please select a language!', 'Alert'));
          return false;
        }
        
        //Use localStorage
        awxUI.settings.albumSort = document.settingsSorting.albumSort.value;
        awxUI.settings.adesc = document.settingsSorting.adesc.checked? 'descending' : 'ascending';
        awxUI.settings.artistsView = document.settingsViewsMusic.artistsView.value;
        awxUI.settings.artistsPath = document.settingsViewsMusic.artists_path.value;
        awxUI.settings.albumsView = document.settingsViewsMusic.albumsView.value;
        awxUI.settings.albumsViewRec = document.settingsViewsMusic.albumsViewRec.value; 
        awxUI.settings.musicVideosdesc = document.settingsSorting.mvdesc.checked? 'descending' : 'ascending';
        awxUI.settings.musicVideosSort = document.settingsSorting.mvSort.value;
        awxUI.settings.tvdesc = document.settingsSorting.tvdesc.checked? 'descending' : 'ascending';
        awxUI.settings.tvSort = document.settingsSorting.TVSort.value;
        awxUI.settings.epSort = document.settingsSorting.EpSort.value;
        awxUI.settings.epdesc = document.settingsSorting.epdesc.checked? 'descending' : 'ascending';
        awxUI.settings.filmSort = document.settingsSorting.filmSort.value
        awxUI.settings.mdesc = document.settingsSorting.mdesc.checked? 'descending' : 'ascending';
        awxUI.settings.filmView = document.settingsViewsVideo.filmView.value;
        awxUI.settings.filmViewRec = document.settingsViewsVideo.filmViewRec.value;
        awxUI.settings.filmViewSets = document.settingsViewsVideo.filmViewSets.value;
        awxUI.settings.TVView = document.settingsViewsVideo.TVView.value;
        awxUI.settings.TVViewRec = document.settingsViewsVideo.TVViewRec.value;
        awxUI.settings.EpView = document.settingsViewsVideo.EpView.value;
        awxUI.settings.lazyload = document.settingsForm.lazyload.checked? true : false;
        awxUI.settings.showTags = document.settingsForm.showTags.checked? true : false;
        awxUI.settings.rotateCDart = document.settingsForm.rotateCDart.checked? true : false;
        awxUI.settings.preferLogos = document.settingsForm.preferLogos.checked? true : false;
        //awxUI.settings.controllerOnPlay = document.settingsForm.controllerOnPlay.checked? true : false;
        awxUI.settings.inputKey = document.settingsForm.inputKey.value;
        awxUI.settings.actionOnPlay = document.settingsForm.actionOnPlay.value;
        
        if (awxUI.settings.useFanart && !document.settingsForm.usefanart.checked? true : false) {
          //Change in fan art, may need to remove current.
          xbmc.clearBackground();
        }
        awxUI.settings.useFanart = document.settingsForm.usefanart.checked? true : false;
        awxUI.settings.useXtraFanart = document.settingsForm.usextrafanart.checked? true : false;
        awxUI.settings.watched = document.settingsViewsVideo.watched.checked? true : false;
        awxUI.settings.hideWatchedMark = document.settingsViewsVideo.hidewatchedmark.checked? true : false;
        awxUI.settings.hoverOrClick = document.settingsForm.hoverOrClick.checked? 'click' : 'mouseenter';
        awxUI.settings.startPage = document.settingsForm.startPage.value;

        mkf.cookieSettings.add(
        'lang',
        document.settingsForm.lang.options[document.settingsForm.lang.selectedIndex].value
        );
        
        awxUI.settings.timeout = timeout;
        awxUI.settings.limitMovies = limitVideo;
        awxUI.settings.limitMV = limitMusicVideo;
        awxUI.settings.limitTV = limitTV;
        awxUI.settings.limitArtists = limitArtists;
        awxUI.settings.limitAlbums = limitAlbums;
        awxUI.settings.limitSongs = limitSongs;

        if (localStorage) {
          localStorage.setItem('AWXi', JSON.stringify(awxUI.settings));
        } else {
          alert(mkf.lang.get('Unable to save settings! Please use a modern browser capable of local storage and enable it\'s access for this site.', 'Alert'));
        }
        /*if (oldui != ui) alert(mkf.lang.get('settings_need_to_reload_awx'));*/
        mkf.dialog.close(dialogHandle);


        return false;
      });

      return false;
    });  

    this.each (function() {
      $(this).append($settingsButton.clone(true));
      if (awxUI.settings.input || awxUI.settings.player || awxUI.settings.volume) { $(this).append($exitButton.clone(true)) };
    });
  }; // END defaultSystemButtons



  /* ########################### *\
   |  Volume Control
  \* ########################### */
  $.fn.defaultVolumeControl = function(options) {
      this.append('<img style="z-index: 5; position: absolute; bottom: 0px" src="ui.uni/images/volume.png">');
      this.each (function() {
        var $sliderElement = $(this);

        // Slider
        $sliderElement.slider({
          range: 'min',
          value: 0,
          orientation: (options && options.horizontal? 'horizontal': 'vertical'),
          stop: function(event, ui) {
            if (awxUI.settings.volume) {
              xbmc.setVolume({
                volume: ui.value,
                onError: function (response) {
                  mkf.messageLog.show(mkf.lang.get('Failed to set volume!', 'Popup message'),
                          mkf.messageLog.status.error, 5000);
                }
              });
            } else {
              $sliderElement.slider("option", "value", xbmc.periodicUpdater.lastVolume);
            }
          }
        });

        xbmc.periodicUpdater.addVolumeChangedListener(function(vol) {
          $sliderElement.slider("option", "value", vol);
        });
      });
  }; // END defaultVolumeControl
  
  /* ########################### *\
   |  Music artists root page
   |
   | 
  \* ########################### */
  $.fn.defaultArtistsViewer = function() {
  
  var $artistsroot = $('<div class="submenus"><ul class="submenus"><li><a class="music_sub titles" title="' + mkf.lang.get('Titles', 'Tool tip') + '"><span>' + mkf.lang.get('Titles', 'Label') + '</span></a></li>' + 
    '<li><a class="music_sub genres" title="' + mkf.lang.get('Genres', 'Tool tip') +'"><span>' + mkf.lang.get('Genres', 'Label') + '</span></a></li>' +
    '</ul></div><br />').appendTo($(this));
    
    $artistsroot.find('.titles').click(function() { mkf.pages.showPage(awxUI.artistsTitlePage, false); } );
    $artistsroot.find('.genres').click(function() { mkf.pages.showPage(awxUI.artistsGenresPage, false); } );

    
  }; // END defaultMusicVideosViewer
  
  /* ########################### *\
   |  Show artists title.
   |
   |  @param artistResult    Result of AudioLibrary.GetArtists.
   |  @param parentPage    Page which is used as parent for new sub pages.
  \* ########################### */
  $.fn.defaultArtistsTitleViewer = function(artistResult, parentPage) {

    if (!artistResult || !artistResult.limits.total > 0) { return };
    
    var onPageShow = '';
    if (parentPage.className == 'artistsTitle') { onPageShow = 'onArtistsTitleShow' }
    else if (parentPage.className == 'songsArtists') { onPageShow = 'onSongsArtistsShow' };
    
    if (!artistResult.isFilter) {
      totalArtistCount = artistResult.limits.total;
      if (lastArtistCountStart > artistResult.limits.total -1) {
        lastArtistCount = awxUI.settings.limitArtists;
        lastArtistCountStart = 0;
        awxUI[onPageShow]();
        return
      };
    };
    
    var useLazyLoad = awxUI.settings.lazyload;
    var view = awxUI.settings.artistsView;
    //Use own next and prev for single view.
    if (view =='logosingle') { artistResult.isFilter = true };
    var $artistsViewerElement = $(this);

    switch (view) {
      case 'list':
        uiviews.ArtistViewList(artistResult, parentPage).appendTo($artistsViewerElement);
        break;
      case 'cover':
        uiviews.ArtistViewThumbnails(artistResult, parentPage).appendTo($artistsViewerElement);
        break;
      case 'banner':
        uiviews.ArtistViewBanners(artistResult, parentPage).appendTo($artistsViewerElement);
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
            container: $('#content'),
            //errorImage: 'images/thumb.png'
          }
        );
      };
      setTimeout(loadThumbs, 100);
    }
    
    if (!artistResult.isFilter) {
      $('<div class="goNextPrev"><a class="prevPage" href=""></a><a class="nextPage" href=""></a><div class="lastCount"><span class="npCount">' + (lastArtistCountStart+1) + '/' + artistResult.limits.total + '</span></div></div>').prependTo($artistsViewerElement);
      $('<div class="goNextPrev"><a class="prevPage" href=""></a><a class="nextPage" href=""></a><div class="lastCount"><span class="npCount">' + (lastArtistCount > artistResult.limits.total? artistResult.limits.total : lastArtistCount) + '/' + artistResult.limits.total + '</span></div></div>').appendTo($artistsViewerElement);
      $artistsViewerElement.find('a.nextPage').on('click', { Page: 'next'}, awxUI[onPageShow]);
      $artistsViewerElement.find('a.prevPage').on('click', { Page: 'prev'}, awxUI[onPageShow]);
      $(document).bind('keydown', 'Ctrl+Left', function() { $artistsViewerElement.find('a.prevPage').click(); } );
      $(document).bind('keydown', 'Ctrl+Right', function() { $artistsViewerElement.find('a.nextPage').click(); } );
      //$artistsViewerElement.keydown(function(event) {
        //console.log(event);
        
        /*if (event.keyCode == 0x0D) {
          onInputContentChanged();
        }
        if (event.keyCode == 0x1B || event.keyCode == 0x0D) {
          $(this).parent().hide();
        }*/
      //})
    };
      
  }; // END defaultArtistsViewer

   /* ########################### *\
   |  Show years genres.
   |
   |  
   |  @param parentPage    Page which is used as parent for new sub pages.
   \* ########################### */
  $.fn.defaultYearsViewer = function(yearsResult, parentPage) {
    // no years?
    if (!yearsResult.limits.total > 0) { return };
    
    uiviews.YearsViewList(yearsResult, parentPage).appendTo($(this));
    
  }; // END defaultYearsViewer

  /* ########################### *\
   |  Show genres.
   |
   |  @param genreResult    Result of AudioLibrary.GetGenres.
   |  @param parentPage    Page which is used as parent for new sub pages.
  \* ########################### */
  $.fn.defaultGenresViewer = function(genresResult, parentPage) {
    
    // no genres?
    if (!genresResult.limits.total > 0) { return };
    
    uiviews.genresViewList(genresResult, parentPage).appendTo($(this));
    
  }; // END defaultGenresViewer
  

  /* ########################### *\
   |  Show music playlists.
   |
   |  @param MusicPlaylistsResult    Result of Files.GetDirectory.
   |  @param parentPage    Page which is used as parent for new sub pages.
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
              'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
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
            //Check default party mode playlist has been created else link wiki.
            if (e.data.strFile == 'special://profile/PartyMode.xsp') {
              $MusicPlaylistsContent.removeClass('loading');
              $MusicPlaylistsContent.append('<div style="font-size: 2em; text-align: center; margin-top: 10px">' + mkf.lang.get('Please create a Party Mode playlist') + '<br /><a style ="color: #ddd" href="http://wiki.xbmc.org/index.php?title=Music_Library#Party_Mode">http://wiki.xbmc.org/index.php?title=Music_Library#Party_Mode</a>.</div>');
            } else {
              mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
              $MusicPlaylistsContent.removeClass('loading');
              mkf.pages.closeTempPage(MusicPlaylistsPage);
            };
          },

          onSuccess: function(result) {
            $MusicPlaylistsContent.defaultMusicPlaylistsViewer(result, MusicPlaylistsPage);
            $MusicPlaylistsContent.removeClass('loading');
          }
        });
      };
      
      if (e.data.strType == 'song') {
        var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));
        xbmc.playerOpen({
          playlistid: 0,
          item: 'songid',
          itemId: e.data.id,
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function(errorText) {
            mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
          }
        });      
      };
      return false;
    }; // END onMusicPlaylistsClick
    
    var onPlaylistsPMPlayClick = function(e) {
      xbmc.playerOpen({
        item: e.data.item,
        itemStr: e.data.pl.file,
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
        },
        onSuccess: function() {
          mkf.messageLog.show(mkf.lang.get('Playing item...', 'Popup message with addition'), mkf.messageLog.status.success, 2000);
        }
      });
      return false;
    };
    
    var onPlaylistsPlayClick = function(e) {
      xbmc.clearAudioPlaylist({
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
        },
        onSuccess: function() {
          onAddPlaylistToPlaylistClick(e)
          //Wait because of AE bug? Change to callback?
          setTimeout(function() {
            xbmc.playerOpen({
              item: 'playlistid',
              itemId: 0,
              position: 0,
              onError: function() {
                mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
              },
              onSuccess: function() {
                mkf.messageLog.show(mkf.lang.get('Playing item...', 'Popup message with addition'), mkf.messageLog.status.success, 2000);
              }
            });
          }, 1000);
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
            mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
            $MusicPlaylistsContent.removeClass('loading');
          },

          onSuccess: function(result) {
            var sendBatch = [];
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
            
            $.each(result.files, function(i, file) {
              if (file.type == 'album') {
                //add to playlist by albumid, returned as id
                sendBatch.push('{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item": { "albumid": ' + file.id + ' }, "playlistid": 0 }, "id": "batchAPL"}');

              } else if (file.type == 'song') {
                //add to playlist by songid, returned as id
                sendBatch.push('{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item": { "songid": ' + file.id + ' }, "playlistid": 0 }, "id": "batchAPL"}');

              } else {
                //it's not any of those, error
                mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
              };
            });
            //Send batch command
            xbmc.sendBatch({
              batch: sendBatch,
              onSuccess: function() {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
              },
              onError: function() {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
                console.log('batch err');
              }
            });
          }
        });
      };
      
      //should be normal playlist. m3u only? Can NOT use playlist.add directory as it doesn't honour track order.
      if (!isSmart && e.data.playlistinfo.type == 'unknown' && e.data.playlistinfo.filetype == 'directory') {
        /* messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
        xbmc.playlistAdd({
          playlistid: 0,
          item: 'directory',
          itemStr: e.data.playlistinfo.file,
          
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function(errorText) {
            mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
          }
        });*/
        xbmc.getDirectory({
          directory: e.data.playlistinfo.file,
          isPlaylist: true,
          
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
          },

          onSuccess: function(result) {
            var sendBatch = [];
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
            
            $.each(result.files, function(i, file) {
              if (file.type == 'file') {
                //add to playlist file
                sendBatch.push('{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item": { "file": ' + file.file + ' }, "playlistid": 0 }, "id": "batchAPL"}');

              } else if (file.type == 'song') {
                //add to playlist by songid, returned as id
                sendBatch.push('{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item": { "songid": ' + file.id + ' }, "playlistid": 0 }, "id": "batchAPL"}');

              } else {
                //it's not any of those, error
                mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
              };
            });
            //Send batch command
            xbmc.sendBatch({
              batch: sendBatch,
              onSuccess: function() {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
              },
              onError: function() {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
              }
            });
          }
        });
      };
      
      //Might be a stream playlist or other type Files.GetDirectory can't handle.
      if (!isSmart && e.data.playlistinfo.type == 'unknown' && e.data.playlistinfo.filetype == 'file') {
        var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
        xbmc.playlistAdd({
          playlistid: 0,
          item: 'file',
          itemStr: e.data.playlistinfo.file,
          
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function(errorText) {
            mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
          }
        });
      };
      
      if (!isSmart && e.data.playlistinfo.type == 'album') {
        var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
        xbmc.playlistAdd({
          playlistid: 0,
          item: 'albumid',
          itemId: e.data.playlistinfo.id,
          
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function(errorText) {
            mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
          }
        });
      };
      
      if (!isSmart && e.data.playlistinfo.type == 'song') {
        var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
        xbmc.playlistAdd({
          playlistid: 0,
          item: 'songid',
          itemId: e.data.playlistinfo.id,
          
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function(errorText) {
            mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
          }
        });      
      };
      return false;
    };
    
    //Add default partymode playlist.
    var defaultPartymode = {
      file: 'special://profile/PartyMode.xsp',
      filetype: 'directory',
      label: 'Party mode playlist',
      type: 'default'
    };
    
    //Only add default if in root menu.
    if (MusicPlaylistsResult.limits.total == 0 && parentPage.parentPage.className == 'music') {
      MusicPlaylistsResult.files = new Array(defaultPartymode);
    } else if (parentPage.parentPage.className == 'music') {
      MusicPlaylistsResult.files.unshift(defaultPartymode);
    }

    this.each (function() {
      var MusicPlaylistsList = $('<ul class="fileList"></ul>').appendTo($(this));

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
                  (playlist.type == 'default'? (awxUI.settings.player? '<a href="" class="button partymode' + i + '" title="' + mkf.lang.get('Play in Party Mode', 'Tool tip') + '"><span class="miniIcon partymode" /></a>' : '') :
                    (awxUI.settings.enqueue? (playlist.type != 'Directory'? '<a href="" class="button playlistinfo' + i +'" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' : '' ) : '') +
                    (awxUI.settings.player? (playlist.type != 'Directory'? '<a href="" class="button play' + i + '" title="' + mkf.lang.get('Play', 'Tool tip') + '"><span class="miniIcon play" /></a>' : '' ) : '')
                  ) +
                  '<a href="" class="playlist' + i + '">' + playlist.label +
                  (playlist.artist? ' - Artist: ' + playlist.artist : '') +
                  (playlist.album && playlist.label != playlist.album? ' - ' + mkf.lang.get('Album:', 'Label') + ' ' + playlist.album : '') +
                  ' - Type: ' + 
                  (!isPlaylist? playlist.type : (!playlist.realtype && isPlaylist? 'Playlist' : playlist.realtype)) + '<div class="findKeywords">' + playlist.label.toLowerCase() + '</div>' +
                  '</a></div></li>');

        if (playlist.type != 'Directory') {
          MusicPlaylistsList.find('.playlistinfo' + i).bind('click', {playlistinfo: playlist}, onAddPlaylistToPlaylistClick);
          MusicPlaylistsList.find('.play' + i).bind('click', {playlistinfo: playlist}, onPlaylistsPlayClick);
        };
        MusicPlaylistsList.find('.playlist' + i).on('click',{id: playlist.id,strFile: playlist.file,strLabel: playlist.label,strType: playlist.type,isPlaylist: isPlaylist}, onMusicPlaylistsClick);
        MusicPlaylistsList.find('.partymode' + i).on('click', {pl: playlist, item: 'partymode'}, onPlaylistsPMPlayClick);
        
        if (playlist.realtype == "Smart Playlist") {
          xbmc.getDirectory({
            directory: playlist.file,

            onError: function() {
              //Do nothing?
            },

            onSuccess: function(result) {
              for (var plI=0; plI < xbmc.objLength(result.files); plI++) {
                if (result.files[plI].type != 'song') {
                  break;
                } else if (plI == xbmc.objLength(result.files) -1) {
                  //Add partymode
                  if (awxUI.settings.player) {
                    MusicPlaylistsList.find('a.playlistinfo' + i).parent().prepend('<a href="" class="button partymode' + i + '" title="' + mkf.lang.get('Play in Party Mode', 'Tool tip') + '"><span class="miniIcon partymode" /></a>');
                    MusicPlaylistsList.find('a.partymode' + i).on('click', {pl: playlist, item: 'partymode'}, onPlaylistsPMPlayClick);
                  }
                }
              };
            }
          });
        }
      });
    });
  }; // END defaultMusicPlaylistsViewer

  /* ########################### *\
   |  Music album root page
   |
   | 
  \* ########################### */
  $.fn.defaultAlbumViewer = function() {
  
  var $albumsroot = $('<div class="submenus"><ul class="submenus"><li><a class="music_sub titles" title="' + mkf.lang.get('Titles', 'Tool tip') + '"><span>' + mkf.lang.get('Titles', 'Label') + '</span></a></li>' + 
    '<li><a class="music_sub recent" title="' + mkf.lang.get('Recently Added', 'Tool tip') + '"><span>' + mkf.lang.get('Recently Added', 'Label') + '</span></a></li>' +
    '<li><a class="music_sub recentplayed" title="' + mkf.lang.get('Recently Played', 'Tool tip') +'"><span>' + mkf.lang.get('Recently Played', 'Label') + '</span></a></li>' +
    '<li><a class="music_sub genres" title="' + mkf.lang.get('Genres', 'Tool tip') +'"><span>' + mkf.lang.get('Genres', 'Label') + '</span></a></li>' +
    '<li><a class="music_sub years" title="' + mkf.lang.get('Years', 'Tool tip') +'"><span>' + mkf.lang.get('Years', 'Label') + '</span></a></li>' +
    '</ul></div><br />').appendTo($(this));
    
    $albumsroot.find('.titles').click(function() { mkf.pages.showPage(awxUI.albumsTitlePage, false); } );
    $albumsroot.find('.recent').click(function() { mkf.pages.showPage(awxUI.albumsRecentPage, false); } );
    $albumsroot.find('.recentplayed').click(function() { mkf.pages.showPage(awxUI.albumsRecentPlayedPage, false); } );
    $albumsroot.find('.genres').click(function() { mkf.pages.showPage(awxUI.albumGenresPage, false); } );
    $albumsroot.find('.years').click(function() { mkf.pages.showPage(awxUI.albumsYearsPage, false); } );
    
  }; // END
  
  /* ########################### *\
   |  Show the albums.
   |
   |  @param albumResult    Result of AudioLibrary.GetAlbums.
   |  @param parentPage    Page which is used as parent for new sub pages.
  \* ########################### */
  $.fn.defaultAlbumTitleViewer = function(albumResult, parentPage) {
  
    if (!albumResult.limits.total > 0) { return };
    totalAlbumCount = albumResult.limits.total;
    //No limit for albums for artist page
    if (!albumResult.isFilter) {
      //Out of bound checking.
      if (lastAlbumCountStart > albumResult.limits.total -1) {
        lastAlbumCount = awxUI.settings.limitAlbums;
        lastAlbumCountStart = 0;
        awxUI.onAlbumsTitleShow();
        return
      };
    };
    var settings = {};
    settings.useLazyLoad = awxUI.settings.lazyload;
    settings.filterWatched = awxUI.settings.watched;
    settings.filterShowWatched = awxUI.settings.hideWatchedMark;
    settings.hoverOrClick = awxUI.settings.hoverOrClick;
    var view = awxUI.settings.albumsView;
    
    var $albumViewerElement = $(this);
    
    switch (view) {
      case 'list':
        uiviews.AlbumsViewList(albumResult, parentPage, settings).appendTo($albumViewerElement);        
        break;
      case 'cover':
        uiviews.AlbumsViewThumbnails(albumResult, parentPage, settings).appendTo($albumViewerElement);
        break;
      case 'listin':
        uiviews.AlbumsViewListInline(albumResult, parentPage, settings).appendTo($albumViewerElement);
        break;
    };

    if (settings.useLazyLoad) {
      function loadThumbs(i) {
        $albumViewerElement.find('img.thumb').lazyload(
          {
            queuedLoad: true,
            container: ($('#content')),
            errorImage: 'images/thumb.png'
          }
        );
      };
      setTimeout(loadThumbs, 100);
    }
    
    if (!albumResult.isFilter) {
      $('<div class="goNextPrev"><a class="prevPage" href=""></a><a class="nextPage" href=""></a><div class="lastCount"><span class="npCount">' + (lastAlbumCountStart+1) + '/' + albumResult.limits.total + '</span></div></div>').prependTo($albumViewerElement);
      $('<div class="goNextPrev"><a class="prevPage" href=""></a><a class="nextPage" href=""></a><div class="lastCount"><span class="npCount">' + (lastAlbumCount > albumResult.limits.total? albumResult.limits.total : lastAlbumCount) + '/' + albumResult.limits.total + '</span></div></div>').appendTo($albumViewerElement);
      $albumViewerElement.find('a.nextPage').on('click', { Page: 'next'}, awxUI.onAlbumsTitleShow);
      $albumViewerElement.find('a.prevPage').on('click', { Page: 'prev'}, awxUI.onAlbumsTitleShow);
    }
    
  }; // END defaultAlbumViewer


  /* ########################### *\
   |  Music songs root page
   |
   | 
  \* ########################### */
  $.fn.defaultSongsViewer = function() {
  
  var $songsroot = $('<div class="submenus"><ul class="submenus"><li><a class="music_sub titles" title="' + mkf.lang.get('Titles', 'Tool tip') + '"><span>' + mkf.lang.get('Titles', 'Label') + '</span></a></li>' + 
    '<li><a class="music_sub artist" title="' + mkf.lang.get('Artists', 'Tool tip') + '"><span>' + mkf.lang.get('Artists', 'Label') + '</span></a></li>' +
    '<li><a class="music_sub recent" title="' + mkf.lang.get('Recently Added', 'Tool tip') +'"><span>' + mkf.lang.get('Recently Added', 'Label') + '</span></a></li>' +
    '<li><a class="music_sub recentplayed" title="' + mkf.lang.get('Recently Added', 'Tool tip') +'"><span>' + mkf.lang.get('Recently Added', 'Label') + '</span></a></li>' +
    '<li><a class="music_sub years" title="' + mkf.lang.get('Years', 'Tool tip') +'"><span>' + mkf.lang.get('Years', 'Label') + '</span></a></li>' +
    '<li><a class="music_sub genres" title="' + mkf.lang.get('Genres', 'Tool tip') +'"><span>' + mkf.lang.get('Genres', 'Label') + '</span></a></li>' +
    '</ul></div><br />').appendTo($(this));
    
    $songsroot.find('.titles').click(function() { mkf.pages.showPage(awxUI.songsTitlePage, false); } );
    $songsroot.find('.recent').click(function() { mkf.pages.showPage(awxUI.songsRecentPage, false); } );
    $songsroot.find('.recentplayed').click(function() { mkf.pages.showPage(awxUI.songsRecentPlayedPage, false); } );
    $songsroot.find('.artist').click(function() { mkf.pages.showPage(awxUI.songsArtistsPage, false); } );
    $songsroot.find('.genres').click(function() { mkf.pages.showPage(awxUI.songGenresPage, false); } );
    $songsroot.find('.years').click(function() { mkf.pages.showPage(awxUI.songsYearsPage, false); } );
    
  }; // END defaultSongsViewer

  
  /* ########################### *\
   |  Show the songlist.
   |
   |  @param songResult    Result of AudioLibrary.GetSongs.
  \* ########################### */
  $.fn.defaultSonglistViewer = function(songResult, parentPage) {

    //Show album name if coming from Years or Genres.
    if (parentPage.parentPage.className == 'songsYears' || parentPage.parentPage.className == 'songGenres') { songResult.showDetails = true };
    
    if (!songResult.limits.total > 0) { return };
    totalSongsCount = songResult.limits.total;
    //No limit for albums for artist page
    if (!songResult.isFilter) {
      //Out of bound checking.
      if (lastSongsCountStart > songResult.limits.total -1) {
        lastSongsCount = awxUI.settings.limitSongs;
        lastSongsCountStart = 0;
        awxUI.onSongsTitleShow();
        return
      };
    };
    
    uiviews.SongViewList(songResult, parentPage).appendTo($(this));
    
    if (!songResult.isFilter) {
      $('<div class="goNextPrev"><a class="prevPage" href=""></a><a class="nextPage" href=""></a><div class="lastCount"><span class="npCount">' + (lastSongsCountStart+1) + '/' + songResult.limits.total + '</span></div></div>').prependTo($(this));
      $('<div class="goNextPrev"><a class="prevPage" href=""></a><a class="nextPage" href=""></a><div class="lastCount"><span class="npCount">' + (lastSongsCount > songResult.limits.total? songResult.limits.total : lastSongsCount) + '/' + songResult.limits.total + '</span></div></div>').appendTo($(this));
      $(this).find('a.nextPage').on('click', { Page: 'next'}, awxUI.onSongsTitleShow);
      $(this).find('a.prevPage').on('click', { Page: 'prev'}, awxUI.onSongsTitleShow);
    }
  }; // END defaultSonglistViewer


  /* ########################### *\
   |  Music video root page
   |
   | 
  \* ########################### */
  $.fn.defaultMusicVideosViewer = function() {
  
  var $musicvideoroot = $('<div class="submenus"><ul class="submenus"><li><a class="video_sub titles" title="' + mkf.lang.get('Titles', 'Tool tip') + '"><span>' + mkf.lang.get('Titles', 'Label') + '</span></a></li>' + 
    '<li><a class="video_sub tags" title="' + mkf.lang.get('Tags', 'Tool tip') + '"><span>' + mkf.lang.get('Tags', 'Label') + '</span></a></li>' +
    '<li><a class="video_sub genres" title="' + mkf.lang.get('Genres', 'Tool tip') +'"><span>' + mkf.lang.get('Genres', 'Label') + '</span></a></li>' +
    '<li><a class="video_sub years" title="' + mkf.lang.get('Years', 'Tool tip') +'"><span>' + mkf.lang.get('Years', 'Label') + '</span></a></li>' +
    '<li><a class="video_sub recent" title="' + mkf.lang.get('Recently Added', 'Tool tip') +'"><span>' + mkf.lang.get('Recently Added', 'Label') + '</span></a></li>' +
    '</ul></div><br />').appendTo($(this));
    
    $musicvideoroot.find('.titles').click(function() { mkf.pages.showPage(awxUI.musicVideosTitlePage, false); } );
    $musicvideoroot.find('.tags').click(function() { mkf.pages.showPage(awxUI.musicVideosTagsPage, false); } );
    $musicvideoroot.find('.genres').click(function() { mkf.pages.showPage(awxUI.musicVideosGenresPage, false); } );
    $musicvideoroot.find('.years').click(function() { mkf.pages.showPage(awxUI.musicVideosYearsPage, false); } );
    $musicvideoroot.find('.recent').click(function() { mkf.pages.showPage(awxUI.musicVideosRecentlyAddedPage, false); } );
    
  }; // END defaultMusicVideosViewer
  
   /* ########################### *\
   |  Show the Recent albums.
   |
   |  @param albumResult    Result of AudioLibrary.GetAlbums.
   |  @param parentPage    Page which is used as parent for new sub pages.
  \* ########################### */
  $.fn.defaultAlbumRecentViewer = function(albumResult, parentPage) {

    if (!albumResult.limits.total > 0) { return };
    
    var settings = {};
    settings.useLazyLoad = awxUI.settings.lazyload;
    settings.filterWatched = awxUI.settings.watched;
    settings.filterShowWatched = awxUI.settings.hideWatchedMark;
    settings.hoverOrClick = awxUI.settings.hoverOrClick;
    var view = awxUI.settings.albumsViewRec;
    
    var $albumViewerElement = $(this);
    
    switch (view) {
      case 'list':
        uiviews.AlbumsViewList(albumResult, parentPage, settings).appendTo($albumViewerElement);
        break;
      case 'cover':
        uiviews.AlbumsViewThumbnails(albumResult, parentPage, settings).appendTo($albumViewerElement);
        break;
      case 'listin':
        uiviews.AlbumsViewListInline(albumResult, parentPage, settings).appendTo($albumViewerElement);
        break;
    };

    if (settings.useLazyLoad) {
      function loadThumbs(i) {
        $albumViewerElement.find('img.thumb').lazyload(
          {
            queuedLoad: true,
            container: ($('#main').length? $('#main'): $('#content')),  // TODO remove fixed #main
            errorImage: 'images/thumb.png'
          }
        );
      };
      setTimeout(loadThumbs, 100);
    }

  }; // END defaultRecentAlbumViewer
  
  /* ########################### *\
   |  Show the Music Videos.
   |
   |  @param albumResult    Result of AudioLibrary.GetAlbums.
   |  @param parentPage    Page which is used as parent for new sub pages.
  \* ########################### */
  $.fn.defaultMusicVideosTitleViewer = function(mvResult, parentPage, options) {

    if (!mvResult.limits.total > 0) { return };
    
    totalMVCount = mvResult.limits.total;
    //may be passed from set page. No limiting with movie sets.
    if (!mvResult.isFilter) {
      //Out of bound checking. Reset to start, really should cycle backwards.
      if (typeof(lastMVCountStart) === 'undefined' || lastMVCountStart > mvResult.limits.total -1) {
        lastMVCount = awxUI.settings.limitMV;
        lastMVCountStart = 0;
        awxUI.onMusicVideosTitleShow();
        return
      };
    };
    
    var useLazyLoad = awxUI.settings.lazyload;
    var view = awxUI.settings.musicVideoView;
    
    var $mvViewerElement = $(this);
    
    switch (view) {
      /*case 'list':
        uiviews.AlbumsViewList(mvResult, parentPage).appendTo($mvViewerElement);
        break;*/
      case 'cover':
        uiviews.MusicVideosViewThumbnails(mvResult, parentPage).appendTo($mvViewerElement);
        break;
      /*case 'listin':
        uiviews.AlbumsViewListInline(albumResult).appendTo($albumViewerElement);
        break;*/
    };

    if (useLazyLoad) {
      function loadThumbs(i) {
        $mvViewerElement.find('img.thumb').lazyload(
          {
            queuedLoad: true,
            container: $('#content'),
            errorImage: 'images/thumb.png'
          }
        );
      };
      setTimeout(loadThumbs, 100);
    }

    if (!mvResult.isFilter) {
      $('<div class="goNextPrev"><a class="prevPage" href=""></a><a class="nextPage" href=""></a><div class="lastCount"><span class="npCount">' + (lastMVCountStart+1) + '/' + mvResult.limits.total + '</span></div></div>').prependTo($mvViewerElement);
      $('<div class="goNextPrev"><a class="prevPage" href=""></a><a class="nextPage" href=""></a><div class="lastCount"><span class="npCount">' + (lastMVCount > mvResult.limits.total? mvResult.limits.total : lastMVCount)+ '/' + mvResult.limits.total + '</span></div></div>').appendTo($mvViewerElement);
      $mvViewerElement.find('a.nextPage').on('click', { Page: 'next'}, awxUI.onMusicVideosTitleShow);
      $mvViewerElement.find('a.prevPage').on('click', { Page: 'prev'}, awxUI.onMusicVideosTitleShow);
    }
    
  }; // END defaultMusicVideosTitleViewer
  
  /* ########################### *\
   |  Show Recently Added Music Videos.
   |
   |  @param episodesResult
  \* ########################### */
  $.fn.defaultRecentlyAddedMusicVideosViewer = function(mvRecentResult, parentPage, options) {
  
    if (!mvRecentResult.limits.total > 0) { return };
    
    var useLazyLoad = awxUI.settings.lazyload;
    
    var view = awxUI.settings.musicVideoView;
    
    var mvRecentViewerElement = $(this);
    
    switch (view) {
      /*case 'list':
        uiviews.AlbumsViewList(mvResult, parentPage).appendTo($mvRecentViewerElement);
        break;*/
      case 'cover':
        uiviews.MusicVideosViewThumbnails(mvRecentResult, parentPage).appendTo(mvRecentViewerElement);
        break;
      /*case 'listin':
        uiviews.AlbumsViewListInline(albumResult).appendTo($mvRecentViewerElement);
        break;*/
    };
    
    if (useLazyLoad) {
      function loadThumbs(i) {
        mvRecentViewerElement.find('img.thumb').lazyload(
          {
            queuedLoad: true,
            container: $('#content'),
            errorImage: 'images/thumb' + xbmc.getTvShowThumbType() + '.png'
          }
        );
      };
      setTimeout(loadThumbs, 100);
    }
    
  }; // END defaultRecentlyAddedMusicVideosViewer
  
  /* ########################### *\
   |  Show playlist (Audio or Video).
   |
   |  @param playlistResult  Result of XyzPlaylist.GetItems.
   |  @param plst        Playlist-Type. Either 'Audio' (default) or 'Video'.
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
   |  Tags.
   |
   |  
   |  @param parentPage    Page which is used as parent for new sub pages.
   \* ########################### */
  $.fn.defaultTagsViewer = function(tagsResult, parentPage) {
    // no tags?
    if (!tagsResult.limits.total > 0) { mkf.messageLog.show(mkf.lang.get('Failed to find any items!', 'Popup message'), mkf.messageLog.status.error, 5000); return };
    
    uiviews.TagsViewList(tagsResult, parentPage).appendTo($(this));
    
  }; // END defaultTagsViewer
  
    /* ########################### *\
   |  Tags.
   |
   |  
   |  @param parentPage    Page which is used as parent for new sub pages.
   \* ########################### */
  $.fn.defaultAddonsViewer = function(type, parentPage) {
  
    uiviews.AddonsViewList(type, parentPage).appendTo($(this));
    
  }; // END defaultTagsViewer
  
  /* ########################### *\
   |  Movie root page
   |
   | 
  \* ########################### */
  $.fn.defaultMovieViewer = function() {

    var $movieroot = $('<div class="submenus"><ul class="submenus"><li><a class="video_sub titles" title="' + mkf.lang.get('Titles', 'Tool tip') + '"><span>' + mkf.lang.get('Titles', 'Label') + '</span></a></li>' + 
    '<li><a class="video_sub tags" title="' + mkf.lang.get('Tags', 'Tool tip') + '"><span>' + mkf.lang.get('Tags', 'Label') + '</span></a></li>' +
    '<li><a class="video_sub genres" title="' + mkf.lang.get('Genres', 'Tool tip') +'"><span>' + mkf.lang.get('Genres', 'Label') + '</span></a></li>' +
    '<li><a class="video_sub years" title="' + mkf.lang.get('Years', 'Tool tip') +'"><span>' + mkf.lang.get('Years', 'Label') + '</span></a></li>' +
    '<li><a class="video_sub sets" title="' + mkf.lang.get('Sets', 'Tool tip') +'"><span>' + mkf.lang.get('Sets', 'Label') + '</span></a></li>' +
    '<li><a class="video_sub recent" title="' + mkf.lang.get('Recently Added', 'Tool tip') +'"><span>' + mkf.lang.get('Recently Added', 'Label') + '</span></a></li>' +
    '</ul></div><br />').appendTo($(this));
    
    $movieroot.find('.titles').click(function() { mkf.pages.showPage(awxUI.moviesTitlePage, false); } );
    $movieroot.find('.tags').click(function() { mkf.pages.showPage(awxUI.movieTagsPage, false); } );
    $movieroot.find('.genres').click(function() { mkf.pages.showPage(awxUI.movieGenresPage, false); } );
    $movieroot.find('.years').click(function() { mkf.pages.showPage(awxUI.movieYearsPage, false); } );
    $movieroot.find('.sets').click(function() { mkf.pages.showPage(awxUI.movieSetsPage, false); } );
    $movieroot.find('.recent').click(function() { mkf.pages.showPage(awxUI.moviesRecentPage, false); } );

    
  }; // END defaultMovieViewer

  /* ########################### *\
   |  Show movies title.
   |
   |  @param movieResult  Result of VideoLibrary.GetMovies.
  \* ########################### */
  $.fn.defaultMovieTitleViewer = function(movieResult, parentPage, options) {
    if (!movieResult.limits.total > 0) { return };
    var settings = {};
    //Allow refresh/non-filter (next/prev) subpages
    var onPageShow = '';
    if (parentPage.className == 'moviesTitle') { onPageShow = 'onMoviesTitleShow' }
    else { onPageShow = 'onMoviesTitleShow' };
    
    totalMovieCount = movieResult.limits.total;
    //may be passed from set page. No limiting with movie sets.
    if (!movieResult.isFilter) {
      //Out of bound checking. Reset to start, really should cycle backwards.
      if (typeof(lastMovieCountStart) === 'undefined' || lastMovieCountStart > movieResult.limits.total -1) {
        lastMovieCount = awxUI.settings.limitMovies;
        lastMovieCountStart = 0;
        awxUI[onPageShow]();
        return
      };
    };
    
    settings.useLazyLoad = awxUI.settings.lazyload;
    settings.filterWatched = awxUI.settings.watched;
    settings.filterShowWatched = awxUI.settings.hideWatchedMark;
    settings.hoverOrClick = awxUI.settings.hoverOrClick;
    var view = awxUI.settings.filmView;
    
    //Overwrite settings for filtered views etc. Make a setting option?
    $.extend(settings, options);
    var $movieContainer = $(this);

    switch (view) {
      case 'poster':
        uiviews.MovieViewPosters(movieResult, parentPage, settings).appendTo($movieContainer);        
        break;
      case 'thumbnail':
        uiviews.MovieViewThumbnails(movieResult, parentPage, settings).appendTo($movieContainer);        
        break;
      case 'clearart':
        uiviews.MovieViewClearArt(movieResult, parentPage, settings).appendTo($movieContainer);        
        break;
      case 'listover':
        uiviews.MovieViewList(movieResult, parentPage, settings).appendTo($movieContainer);
        break;
      case 'listin':
        uiviews.MovieViewListInline(movieResult, parentPage, settings).appendTo($movieContainer);
        break;
      case 'accordion':
        uiviews.MovieViewAccordion(movieResult, parentPage, settings).appendTo($movieContainer);
        break;
      case 'singlePoster':
        uiviews.MovieViewSingle(movieResult, parentPage, settings).appendTo($movieContainer);
        break;
      case 'logo':
        uiviews.MovieViewLogos(movieResult, parentPage, settings).appendTo($movieContainer);
        break;
    };
    
    if (settings.useLazyLoad) {
      function loadThumbs(i) {
        $movieContainer.find('img.thumb').lazyload(
          {
            queuedLoad: true,
            container: ($('#main').length? $('#main'): $('#content')),  // TODO remove fixed #main
            errorImage: 'images/thumb' + xbmc.getMovieThumbType() + '.png'
            //errorImage: 'images/thumbBanner.png'
          }
        );
      };
      setTimeout(loadThumbs, 100);
    }
    
    //NFC why the || doesn't work below but it doesn't?!
    if (view == 'singlePoster') { movieResult.isFilter = true };
    if (!movieResult.isFilter) {
      $('<div class="goNextPrev"><a class="prevPage" href=""></a><a class="nextPage" href=""></a><div class="lastCount"><span class="npCount">' + (lastMovieCountStart+1) + '/' + movieResult.limits.total + '</span></div></div>').prependTo($movieContainer);
      $('<div class="goNextPrev"><a class="prevPage" href=""></a><a class="nextPage" href=""></a><div class="lastCount"><span class="npCount">' + (lastMovieCount > movieResult.limits.total? movieResult.limits.total : lastMovieCount)+ '/' + movieResult.limits.total + '</span></div></div>').appendTo($movieContainer);
      $movieContainer.find('a.nextPage').on('click', { Page: 'next'}, awxUI[onPageShow]);
      $movieContainer.find('a.prevPage').on('click', { Page: 'prev'}, awxUI[onPageShow]);
    }
    
  }; // END defaultMovieViewer

  
  /* ########################### *\
   |  Show movie sets.
   |
   |  @param movieResult  Result of VideoLibrary.GetMovieSets.
  \* ########################### */
  $.fn.defaultMovieSetTitleViewer = function(movieResult, parentPage) {

    if (!movieResult.limits.total > 0) { return };
    
    var useLazyLoad = awxUI.settings.lazyload;
    //var filterWatched = awxUI.settings.watched;
    //var listview = mkf.cookieSettings.get('listview', 'no')=='yes'? true : false;
    //var filterShowWatched = awxUI.settings.hideWatchedMark;
    var view = awxUI.settings.filmViewSets;
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
            container: ($('#content')),
            //errorImage: 'images/thumb' + xbmc.getMovieThumbType() + '.png'
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
   |  @param movieRecentResult  Result of VideoLibrary.GetMovies.
  \* ########################### */
  $.fn.defaultMovieRecentViewer = function(movieResult, parentPage, options) {

    if (!movieResult.limits.total > 0) { return };
    var settings = {};
    settings.useLazyLoad = awxUI.settings.lazyload;
    settings.filterWatched = false;
    settings.filterShowWatched = awxUI.settings.hideWatchedMark;
    settings.hoverOrClick = awxUI.settings.hoverOrClick;
    var view = awxUI.settings.filmViewRec;
    //var listview = mkf.cookieSettings.get('listview', 'no')=='yes'? true : false;
    //var useFanart = awxUI.settings.useFanart;
    
    $.extend(settings, options);
    

    var $movieContainer = $(this);
    
    switch (view) {
      case 'poster':
        uiviews.MovieViewPosters(movieResult, parentPage, settings).appendTo($movieContainer);
        break;
      case 'listover':
        uiviews.MovieViewList(movieResult, parentPage, settings).appendTo($movieContainer);
        break;
      case 'listin':
        uiviews.MovieViewListInline(movieResult, parentPage, settings).appendTo($movieContainer);
        break;
      case 'accordion':
        uiviews.MovieViewAccordion(movieResult, parentPage, settings).appendTo($movieContainer);
        break;
      case 'singlePoster':
        uiviews.MovieViewSingle(movieResult, parentPage, settings).appendTo($movieContainer);
        break;
      case 'logo':
        uiviews.MovieViewLogos(movieResult, parentPage, settings).appendTo($movieContainer);
        break;
    };
    
    if (settings.useLazyLoad) {
      function loadThumbs(i) {
        $movieContainer.find('img.thumb').lazyload(
          {
            queuedLoad: true,
            container: $('#content'),
            errorImage: 'images/thumb' + xbmc.getMovieThumbType() + '.png'
          }
        );
      };
      setTimeout(loadThumbs, 100);
    }

  }; // END defaultMovieRecentViewer
  
  /* ########################### *\
   |  tv show root page
   |
   | 
  \* ########################### */
  $.fn.defaultTvShowViewer = function() {

  var $tvroot = $('<div class="submenus"><ul class="submenus"><li><a class="video_sub titles" title="' + mkf.lang.get('Titles', 'Tool tip') + '"><span>' + mkf.lang.get('Titles', 'Label') + '</span></a></li>' +
    '<li><a class="video_sub recent" title="' + mkf.lang.get('Recently Added', 'Tool tip') +'"><span>' + mkf.lang.get('Recently Added', 'Label') + '</span></a></li>' +
    '<li><a class="video_sub genres" title="' + mkf.lang.get('Genres', 'Tool tip') +'"><span>' + mkf.lang.get('Genres', 'Label') + '</span></a></li>' +
    '<li><a class="video_sub years" title="' + mkf.lang.get('Years', 'Tool tip') +'"><span>' + mkf.lang.get('Years', 'Label') + '</span></a></li>' +
    '<li><a class="video_sub tags" title="' + mkf.lang.get('Tags', 'Tool tip') + '"><span>' + mkf.lang.get('Tags', 'Label') + '</span></a></li>' +
    '</ul></div><br />').appendTo($(this));
    
    $tvroot.find('.titles').click(function() { mkf.pages.showPage(awxUI.tvShowsTitlePage, false); } );
    $tvroot.find('.genres').click(function() { mkf.pages.showPage(awxUI.tvShowsGenresPage, false); } );
    $tvroot.find('.years').click(function() { mkf.pages.showPage(awxUI.tvShowsYearsPage, false); } );
    $tvroot.find('.recent').click(function() { mkf.pages.showPage(awxUI.tvShowsRecentlyAddedPage, false); } );
    $tvroot.find('.tags').click(function() { mkf.pages.showPage(awxUI.tvShowsTagsPage, false); } );
    
  }; // END defaultTvShowViewer
  
  /* ########################### *\
   |  Show TV Shows.
   |
   |  @param tvShowResult    Result of VideoLibrary.GetTVShows.
  \* ########################### */
  $.fn.defaultTvShowTitleViewer = function(tvShowResult, parentPage, options) {

    if (!tvShowResult.limits.total > 0) { return };
    var settings = {};
    totalTVCount = tvShowResult.limits.total;
    if (!tvShowResult.isFilter) {
    //Out of bound checking. Reset to start, really should cycle backwards.
      if (lastTVCountStart > tvShowResult.limits.total -1) {
        lastTVCount = awxUI.settings.limitTV;
        lastTVCountStart = 0;
        awxUI.onTvShowsTitleShow();
        return
      };
    };
    
    settings.useLazyLoad = awxUI.settings.lazyload;
    settings.filterWatched = awxUI.settings.watched;
    settings.filterShowWatched = awxUI.settings.hideWatchedMark;
    settings.hoverOrClick = awxUI.settings.hoverOrClick;
    var view = awxUI.settings.TVView;
    
    //Overwrite settings for filtered views etc. Make a setting option?
    $.extend(settings, options);
    
    var $tvshowContainer = $(this);

    switch (view) {
      case 'banner':
        uiviews.TVViewBanner(tvShowResult, parentPage, settings).appendTo($tvshowContainer);
        break;
      case 'poster':
        uiviews.TVViewPoster(tvShowResult, parentPage, settings).appendTo($tvshowContainer);
        break;
      case 'listover':
        uiviews.TVViewList(tvShowResult, parentPage, settings).appendTo($tvshowContainer);
        break;
      case 'logo':
        uiviews.TVViewLogoWall(tvShowResult, parentPage, settings).appendTo($tvshowContainer);
        break;
    };

    if (settings.useLazyLoad) {
      function loadThumbs(i) {
        $tvshowContainer.find('img.thumb').lazyload(
          {
            queuedLoad: true,
            container: ($('#main').length? $('#main'): $('#content')),  // TODO remove fixed #main
            errorImage: 'images/thumb' + xbmc.getTvShowThumbType() + '.png'
          }
        );
      };
      setTimeout(loadThumbs, 100);
    }

    if (!tvShowResult.isFilter) {
      $('<div class="goNextPrev"><a class="prevPage" href=""></a><a class="nextPage" href=""></a><div class="lastCount"><span class="npCount">' + (lastTVCountStart+1) + '/' + totalTVCount + '</span></div></div>').prependTo($tvshowContainer);
      $('<div class="goNextPrev"><a class="prevPage" href=""></a><a class="nextPage" href=""></a><div class="lastCount"><span class="npCount">' + (lastTVCount > totalTVCount? totalTVCount : lastTVCount) + '/' + totalTVCount + '</span></div></div>').appendTo($tvshowContainer);
      $tvshowContainer.find('a.nextPage').on('click', { Page: 'next'}, awxUI.onTvShowsTitleShow);
      $tvshowContainer.find('a.prevPage').on('click', { Page: 'prev'}, awxUI.onTvShowsTitleShow);
    };
    
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
   |  Show PVR
   |
   |  @param pvrResult
  \* ########################### */
  $.fn.defaultPVRViewer = function(pvrResult, parentPage) {

    if (!pvrResult.limits.total > 0) { return };
    
    uiviews.PVRViewList(pvrResult, parentPage).appendTo($(this));
    
  }; // END PVRtvViewer
  
  /* ########################### *\
   |  Show PVR TV channel
   |
   |  @param pvrchanResult
  \* ########################### */
  $.fn.defaultChannelViewer = function(pvrchanResult, parentPage) {

    if (!pvrchanResult.limits.total > 0) { return };
    
    uiviews.PVRchanViewList(pvrchanResult, parentPage).appendTo($(this));
    
  }; // END PVRchanViewer
  
  
  /* ########################### *\
   |  Show PVR EPG grid
   |
   |  @param pvrchanResult
  \* ########################### */
  $.fn.defaultEPGgridViewer = function(pvrchanResult, parentPage) {

    if (!pvrchanResult.limits.total > 0) { return };
    
    uiviews.PVRepgGrid(pvrchanResult, parentPage).appendTo($(this));
    
  }; // END PVRchanViewer
  
  /* ########################### *\
   |  Video Scan
   |
   |  @param episodesResult
  \* ########################### */
  $.fn.defaultVideoScanViewer = function() {
    var onScanVideo = function() {
      xbmc.scanVideoLibrary({
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
        },

        onSuccess: function() {
          mkf.messageLog.show(mkf.lang.get('Started Video Library Scan', 'Popup message'), mkf.messageLog.status.success, 3000);
        }
      });
    };
    
    var onCleanVideo = function() {
      xbmc.cleanVideoLibrary({
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
        },

        onSuccess: function() {
          mkf.messageLog.show(mkf.lang.get('Started Video Library Clean', 'Popup message'), mkf.messageLog.status.success, 3000);
        }
      });
    };
    
    var onExportVideo = function() {
      xbmc.exportVideoLibrary({
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
        },

        onSuccess: function() {
          mkf.messageLog.show(mkf.lang.get('Started Video Library Export', 'Popup message'), mkf.messageLog.status.success, 3000);
        }
      });
    };
    
    var $scanVideoList = $('<div class="tools"><span class="tools toolsscan" title="' + mkf.lang.get('Scan Library', 'Tool tip') +
    '">' + mkf.lang.get('Scan Library', 'Label') + '</span><span class="tools toolsclean" title="' + mkf.lang.get('Clean Library', 'Tool tip') +
    '">' + mkf.lang.get('Clean Library', 'Label') + '</span><span class="tools toolsexport" title="' + mkf.lang.get('Export Library', 'Tool tip') +'">' + mkf.lang.get('Export Library', 'Label') +'</span></div><br />').appendTo($(this));
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
          mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
        },

        onSuccess: function() {
          mkf.messageLog.show(mkf.lang.get('Started Music Library Scan', 'Popup message'), mkf.messageLog.status.success, 3000);
        }
      });
    };
    
    var onCleanMusic = function() {
      xbmc.cleanAudioLibrary({
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
        },

        onSuccess: function() {
          mkf.messageLog.show(mkf.lang.get('Started Music Library Clean', 'Popup message'), mkf.messageLog.status.success, 3000);
        }
      });
    };
    
    var onExportMusic = function() {
      xbmc.exportAudioLibrary({
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
        },

        onSuccess: function() {
          mkf.messageLog.show(mkf.lang.get('Started Music Library Export', 'Popup message'), mkf.messageLog.status.success, 3000);
        }
      });
    };
    
    var $scanMusicList = $('<div class="tools"><span class="tools toolsscan" title="' + mkf.lang.get('Scan Library', 'Tool tip') +
    '">' + mkf.lang.get('Scan Library', 'Label') + '</span><span class="tools toolsclean" title="' + mkf.lang.get('Clean Library', 'Tool tip') +
    '">' + mkf.lang.get('Clean Library', 'Label') + '</span><span class="tools toolsexport" title="' + mkf.lang.get('Export Library', 'Tool tip') +'">' + mkf.lang.get('Export Library', 'Label') +'</span></div><br />').appendTo($(this));
    $scanMusicList.find('.toolsscan').bind('click', onScanMusic);
    $scanMusicList.find('.toolsclean').bind('click', onCleanMusic);
    $scanMusicList.find('.toolsexport').bind('click', onExportMusic);
    
  }; // END defaultScanViewer
  
  /* ########################### *\
   |  Show Seasons's episodes.
   |
   |  @param episodesResult
  \* ########################### */
  $.fn.defaultEpisodesViewer = function(episodesResult, parentPage) {
    
    if (!episodesResult.limits.total > 0) { return };
    
    var useLazyLoad = awxUI.settings.lazyload;
    var view = awxUI.settings.EpView;
    var epsContainer = $(this);
    
    switch (view) {
      case 'thumbnail':
        uiviews.TVEpThumbnailList(episodesResult).appendTo(epsContainer);
        break;
      case 'listover':
        uiviews.TVEpisodesViewList(episodesResult).appendTo(epsContainer);
        break;
      case 'thumbnailnoplot':
        uiviews.TVEpThumbnail(episodesResult).appendTo(epsContainer);
        break;
    };
    
    if (useLazyLoad) {
      function loadThumbs(i) {
        epsContainer.find('img.thumb').lazyload(
          {
            queuedLoad: true,
            container: ($('#content')),
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
    var useLazyLoad = awxUI.settings.lazyload;
    var view = awxUI.settings.EpView;
    var unwatched = true;
    var epsContainer = $(this);
    
    switch (view) {
      case 'thumbnail':
        uiviews.TVEpThumbnailList(episodesResult, unwatched).appendTo(epsContainer);
        break;
      case 'listover':
        uiviews.TVEpisodesViewList(episodesResult, unwatched).appendTo(epsContainer);
        break;
      case 'thumbnailnoplot':
        uiviews.TVEpThumbnail(episodesResult).appendTo(epsContainer);
        break;
    };
    
    if (useLazyLoad) {
      function loadThumbs(i) {
        epsContainer.find('img.thumb').lazyload(
          {
            queuedLoad: true,
            container: ($('#content')),
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
    
    var useLazyLoad = awxUI.settings.lazyload;
    var view = awxUI.settings.TVViewRec;  
    
    var epsContainer = $(this);
    var options = {
      filterWatched: false,
      filterShowWatched: true
    }
    
    switch (view) {
      case 'infolist':
        uiviews.TVRecentViewInfoList(episodesResult, parentPage, options).appendTo(epsContainer);
        break;
      case 'thumbnail':
        uiviews.TVRecentThumbnail(episodesResult, parentPage, options).appendTo(epsContainer);
        break;
    };
    
    if (useLazyLoad) {
      function loadThumbs(i) {
        epsContainer.find('img.thumb').lazyload(
          {
            queuedLoad: true,
            container: ($('#content')),
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
   |  @param MusicPlaylistsResult    Result of Files.GetDirectory.
   |  @param parentPage    Page which is used as parent for new sub pages.
  \* ########################### */
  $.fn.defaultVideoPlaylistsViewer = function(VideoPlaylistsResult, parentPage) {
    var onVideoPlaylistsClick = function(e) {
      if (e.data.strType =='episode') {
        var dialogHandle = mkf.dialog.show();
        var useFanart = awxUI.settings.useFanart;

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
                if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('N/A', 'Label') };
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
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Episode:', 'Label') + '</span><span class="value">' + (ep.episode? ep.episode : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Season:', 'Label') + '</span><span class="value">' + (ep.season? ep.season : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Runtime:', 'Label') + '</span><span class="value">' + (ep.runtime? ep.runtime : mkf.lang.get('N/A', 'Label')) + '</span></div>' +            
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="value"><div class="smallRating' + Math.round(ep.rating) + '"></div></span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Votes:', 'Label') + '</span><span class="value">' + (ep.votes? ep.votes : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('First Aired:', 'Label') + '</span><span class="value">' + (ep.firstaired? ep.firstaired : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Last Played:', 'Label') + '</span><span class="value">' + (ep.lastplayed? ep.lastplayed : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="value">' + (ep.playcount? ep.playcount : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Audio Streams:', 'Label') + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('File:', 'Label') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + ep.file + '</a>' + '</span></div></div>' +
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

            mkf.dialog.setContent(dialogHandle, dialogContent);
            return false;
          },
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve information!', 'Popup message'), mkf.messageLog.status.error, 5000);
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
              'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
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

          onError: function(response) {
            //Check default party mode playlist has been created else link wiki.
            if (e.data.strFile == 'special://profile/PartyMode-Video.xsp') {
              $VideoPlaylistsContent.removeClass('loading');
              $VideoPlaylistsContent.append('<div style="font-size: 2em; text-align: center; margin-top: 10px">' + mkf.lang.get('Please create a Party Mode playlist') + '<br /><a style ="color: #ddd" href="http://wiki.xbmc.org/index.php?title=Music_Library#Party_Mode">http://wiki.xbmc.org/index.php?title=Music_Library#Party_Mode</a>.</div>');
            } else {
              mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
               $VideoPlaylistsContent.removeClass('loading');
              mkf.pages.closeTempPage(VideoPlaylistsPage);
            };
          },

          onSuccess: function(result) {
            $VideoPlaylistsContent.defaultVideoPlaylistsViewer(result, VideoPlaylistsPage);
            $VideoPlaylistsContent.removeClass('loading');
          }
        });
      };
      return false;
    }; // END onVideoPlaylistsClick
    
    var onPlaylistsPMPlayClick = function(e) {
      xbmc.playerOpen({
        item: e.data.item,
        itemStr: e.data.pl.file,
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
        },
        onSuccess: function() {
          mkf.messageLog.show(mkf.lang.get('Playing item...', 'Popup message with addition'), mkf.messageLog.status.success, 2000);
        }
      });
      return false;
    };
    
    var onPlaylistsPlayClick = function(e) {
      xbmc.clearVideoPlaylist({
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
          //$VideoPlaylistsContent.removeClass('loading');
        },
        onSuccess: function() {
          onAddPlaylistToPlaylistClick(e);
          xbmc.playVideo({
            onError: function() {
              mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
              //$MusicPlaylistsContent.removeClass('loading');
            },
            onSuccess: function() {
              mkf.messageLog.show(mkf.lang.get('Playing item...', 'Popup message with addition'), mkf.messageLog.status.success, 2000);
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
            mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
            $VideoPlaylistsContent.removeClass('loading');
          },

          onSuccess: function(result) {
            //parse playlist
            sendBatch = [];
            /*Sn = 1;
            An = 1;
            Mn = 1;
            Tn = 1;*/
            
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
            $.each(result.files, function(i, file) {
              //Make a batch command to send. Keep things in order.
              if (file.type == 'movie') {
                //add to playlist by movieid, returned as id
                sendBatch[i] = '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item": { "movieid": ' + file.id + ' }, "playlistid": 1 }, "id": "batchPL"}';

              } else if (file.type == 'episode') {
                //add to playlist by movieid, returned as id
                sendBatch[i] = '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item": { "episodeid": ' + file.id + ' }, "playlistid": 1 }, "id": "batchPL"}';

              } else if (file.type == 'musicvideo') {
                sendBatch[i] = '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item": { "musicvideoid": ' + file.id + ' }, "playlistid": 1 }, "id": "batchPL"}';
              } else if (file.filetype == 'directory') {
                //assume TV show and descend to add episodes
                xbmc.getDirectory({
                  directory: file.file,
                  isPlaylist: true,
                  media: 'video',
                  
                  onError: function() {
                    //mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
                    //$VideoPlaylistsContent.removeClass('loading');
                  },

                  onSuccess: function(result) {
                    //var Dn = 1;
                    $.each(result.files, function(i, dirfile) {
                      if (dirfile.type != 'episode') { return; };
                      sendBatch[i] == '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item": { "episodeid": ' + file.id + ' }, "playlistid": 1 }, "id": "batchPL"}';
                    });                  
                  }
                });
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
              } else {
                //it's not any of those, error
                mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
              };
            });
            //Send batch command
            xbmc.sendBatch({
              batch: sendBatch,
              onSuccess: function() {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
              },
              onError: function() {
                mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
                console.log('batch err');
              }
            });
          }
        });
      };
      
      /*------------ Single items ---------------*/
      //should be normal playlist. m3u only? Can use playlist.add directory addAudioFolderToPlaylist
      if (!isSmart && e.data.playlistinfo.type == 'unknown') {
        var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
        xbmc.playlistAdd({
          playlistid: 1,
          item: 'directory',
          itemStr: e.data.playlistinfo.file,
          
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function(errorText) {
            mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
          }
        });
      };
      
      if (!isSmart && e.data.playlistinfo.type == 'movie') {
        //add to playlist by movieid, returned as id
        var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
        xbmc.playlistAdd({
          playlistid: 1,
          item: 'movieid',
          itemId: e.data.playlistinfo.id,
          
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function(errorText) {
            mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
          }
        });
      };
      
      if (!isSmart && e.data.playlistinfo.type == 'episode') {
        //add to playlist by episodeid, returned as id
        var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
        xbmc.playlistAdd({
          playlistid: 1,
          item: 'episodeid',
          itemId: e.data.playlistinfo.id,
          
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function(errorText) {
            mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
          }
        });
      };
      
      if (!isSmart && e.data.playlistinfo.type == 'musicvideo') {
        var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
        xbmc.playlistAdd({
          playlistid: 1,
          item: 'musicvideoid',
          itemId: e.data.playlistinfo.id,
          
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function(errorText) {
            mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
          }
        });
      };
      return false;
    };
    
    //Add default partymode playlist.
    var defaultPartymode = {
      file: 'special://profile/PartyMode-Video.xsp',
      filetype: 'directory',
      label: 'Party mode playlist',
      type: 'default'
    };
    
    //Only add default if in root menu.
    if (VideoPlaylistsResult.limits.total == 0 && parentPage.parentPage.className == 'videos') {
      VideoPlaylistsResult.files = new Array(defaultPartymode);
    } else if (parentPage.parentPage.className == 'videos') {
      VideoPlaylistsResult.files.unshift(defaultPartymode);
    }

    this.each (function() {
      var VideoPlaylistsList = $('<ul class="fileList"></ul>').appendTo($(this));

      $.each(VideoPlaylistsResult.files, function(i, playlist)  {
        if (playlist.label.search('extrafanart') != -1) { return; };
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
        VideoPlaylistsList.append('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' +
                  (playlist.type == 'default'? (awxUI.settings.player? '<a href="" class="button partymode' + i + '" title="' + mkf.lang.get('Play in Party Mode', 'Tool tip') + '"><span class="miniIcon partymode" /></a>' : '') : 
                  (awxUI.settings.enqueue? '<a href="" class="button playlistinfo' + i +'" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' : '') +
                  (awxUI.settings.player? '<a href="" class="button play' + i + '" title="' + mkf.lang.get('Play', 'Tool tip') + '"><span class="miniIcon play" /></a>' : '') ) +
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
        VideoPlaylistsList.find('.partymode' + i).bind('click', {pl: playlist, item: 'partymode'}, onPlaylistsPMPlayClick);
        
        if (playlist.realtype == "Smart Playlist") {
          xbmc.getDirectory({
            directory: playlist.file,

            onError: function() {
              //Do nothing?
            },

            onSuccess: function(result) {
              for (var plI=0; plI < xbmc.objLength(result.files); plI++) {
                if (result.files[plI].type != 'musicvideo') {
                  break;
                } else if (plI == xbmc.objLength(result.files) -1) {
                  //Add partymode
                  if (awxUI.settings.player) {
                    VideoPlaylistsList.find('a.playlistinfo' + i).parent().prepend('<a href="" class="button partymode' + i + '" title="' + mkf.lang.get('Play in Party Mode', 'Tool tip') + '"><span class="miniIcon partymode" /></a>');
                    VideoPlaylistsList.find('a.partymode' + i).on('click', {pl: playlist, item: 'partymode'}, onPlaylistsPMPlayClick);
                  }
                }
              };
            }
          });
        }
      });

    });
  }; // END defaultVideoPlaylistsViewer

  /* ########################### *\
   |  Video Advanced Filter
   |
   |  @param episodesResult
  \* ########################### */
  $.fn.defaultVideoAdFilterViewer = function(parentPage) {
    
    var adFilterContainer = $(this);
    uiviews.AdvancedSearch('video', parentPage).appendTo(adFilterContainer);
    
  }; // END defaultAdFilterViewer
  
  /* ########################### *\
   |  Audio Advanced Filter
   |
   |  @param episodesResult
  \* ########################### */
  $.fn.defaultAudioAdFilterViewer = function(parentPage) {
    
    var adFilterContainer = $(this);
    uiviews.AdvancedSearch('audio', parentPage).appendTo(adFilterContainer);
    
  }; // END defaultAdAudioFilterViewer
  
  /* ########################### *\
   |  Show filesystem.
   |
   |  @param mediaType  Media-Type to show. (Either 'Audio' or 'Video')
  \* ########################### */
  $.fn.defaultFilesystemViewer = function(mediaType, parentPage, folder) {
    var media = 'music';
    if (mediaType === 'Video') {
      media = 'video';
    }

    var playFile = function(e) {
      if (typeof(e.file) != 'undefined') {
        var file = e.file;
      } else {
        $('a.close').click();
        var resume = e.data.resume;
        var file = e.data.file;
      };
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));

      var fn = 'playVideoFile';
      if (media == 'music') {
        fn = 'playAudioFile';
      }

      $.proxy(xbmc, fn)({
        file: file,
        resume: resume,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function(errorText) {
          mkf.messageLog.appendTextAndHide(messageHandle, errorText, 5000, mkf.messageLog.status.error);
        }
      });
      return false;
    };
    
    var onFilePlayClick = function(event) {
      if (event.data.file.startsWith('http://') || event.data.file.startsWith('rtmp://')) {
        //Stream, can't have resume point, will timeout so avoid.
          playFile({file: event.data.file});
      } else {
        //Check file for resume point
        xbmc.getFileDetails({
          file: event.data.file,
          media: media,
          onError: function() {
            //Failed to get file info. Shouldn't happen but try to play the file anyway.
            playFile({file: event.data.file});
          },
          onSuccess: function(response) {
            if (typeof(response.filedetails.resume) != 'undefined') {
              if (response.filedetails.resume.position > 0) {
                var resumeMins = response.filedetails.resume.position/60;
                var dialogHandle = mkf.dialog.show();
                
                var dialogContent = $('<div>' +

                  '<div class="movieinfo"><span class="resume">' + '<a class="resume" href="">' + mkf.lang.get('Resume from:', 'Label') + Math.floor(resumeMins) + ' ' + mkf.lang.get('minutes', 'Label') + '</a></span></div></div>' +
                  '<div class="movieinfo"><span class="resume">' + '<a class="beginning" href="">' + mkf.lang.get('Play from beginning', 'Label') + '</a>' + '</span></div></div></p>' +
                  
                  '</div>');

                $(dialogContent).find('a.beginning').on('click', {file: event.data.file, resume: false}, playFile);
                $(dialogContent).find('a.resume').on('click', {file: event.data.file, resume: true}, playFile);
                  
                mkf.dialog.setContent(dialogHandle, dialogContent);
              } else {
                playFile({file: event.data.file});
              }
            } else {
              //Just play the file
              playFile({file: event.data.file});
            }
            
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
        var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));

        var fn = xbmc.addVideoFolderToPlaylist;
        if (media == 'music') {
          fn = xbmc.addAudioFolderToPlaylist;
        }

        fn({
          folder: event.data.file,
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function(errorText) {
            mkf.messageLog.appendTextAndHide(messageHandle, errorText, 5000, mkf.messageLog.status.error);
          }
        });

      } else {

        var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));

        var fn = xbmc.addVideoFileToPlaylist;
        if (media == 'music') {
          fn = xbmc.addAudioFileToPlaylist;
        }

        fn({
          file: event.data.file,
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 5000, mkf.messageLog.status.error);
          }
        });
      }
      return false;
    };
    
    // **** File changed to Folder
    var onFolderPlayClick = function(event) {
      var isFolder = false;

      if (event.data.isFolder)
        isFolder = true;

      if (isFolder) {
        var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));

        var fn = 'playVideoFolder';
        if (media == 'music') {
          fn = 'playAudioFolder';
        }

        $.proxy(xbmc, fn)({
          folder: event.data.file,
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function(errorText) {
            mkf.messageLog.appendTextAndHide(messageHandle, errorText, 5000, mkf.messageLog.status.error);
          }
        });

      } else {
        var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));

        var fn = 'playVideoFile';
        if (media == 'music') {
          fn = 'playAudioFile';
        }

        $.proxy(xbmc, fn)({
          file: event.data.file,
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function(errorText) {
            mkf.messageLog.appendTextAndHide(messageHandle, errorText, 5000, mkf.messageLog.status.error);
          }
        });
      }
      return false;
    };

    var onAddFolderToPlaylistClick = function(event) {
      var isFolder = false;

      if (event.data.isFolder)
        isFolder = true;

      if (isFolder) {
        var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));

        var fn = xbmc.addVideoFolderToPlaylist;
        if (media == 'music') {
          fn = xbmc.addAudioFolderToPlaylist;
        }

        fn({
          folder: event.data.file,
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function(errorText) {
            mkf.messageLog.appendTextAndHide(messageHandle, errorText, 5000, mkf.messageLog.status.error);
          }
        });

      } else {

        var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));

        var fn = xbmc.addVideoFileToPlaylist;
        if (media == 'music') {
          fn = xbmc.addAudioFileToPlaylist;
        }

        fn({
          file: event.data.file,
          onSuccess: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          },
          onError: function() {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 5000, mkf.messageLog.status.error);
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
      $fileContainer.addClass('loading');
      var $filelist = $('<ul class="fileList"></ul>').appendTo($fileContainer);

      

      /*****************
       * If the root should be displayed:
       *    Show the /media-folder if it exist and all Shares.
       * If folder-content should be shown:
       *    Show all sub-folders and audio/video-files.
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
                    (awxUI.settings.enqueue? '<a href="" class="button playlist" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' : '') + 
                    (awxUI.settings.player? '<a href="" class="button play" title="' + mkf.lang.get('Play', 'Tool tip') + '"><span class="miniIcon play" /></a>' : '') + 
                    '<a href="" class="folder cd">' + folder.label + '/</a>' + '<div class="findKeywords">' + folder.label.toLowerCase() + '</div>' +
                    '</div></li>').appendTo($filelist);
                  $folder.find('.cd').bind('click', {folder: {name:folder.label, path:folder.file}}, onFolderClick);
                  $folder.find('.play').bind('click', {file: folder.file, isFolder: true}, onFolderPlayClick);
                  $folder.find('.playlist').bind('click', {file: folder.file, isFolder: true}, onAddFolderToPlaylistClick);
                  ++globalI;
                }
              });
            }

            if (files) {
              $.each(files, function(i, file)  {
                if (!file.file.startsWith('addons://') && file.filetype == 'file') {
                  if (!file.file.startsWith('script://') && file.filetype == 'file') {
                    var $file = $('<li' + (globalI%2==0? ' class="even"': '') + '><div class="folderLinkWrapper file' + i + '">' +
                    (awxUI.settings.enqueue? '<a href="" class="button playlist" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' : '') +
                    (awxUI.settings.player? '<a href="" class="file play">' + (file.label != ''? file.label : file.file.slice(file.file.lastIndexOf('/')+1)) + '</a>' : '<span class="label">' + (file.label != ''? file.label : file.file.slice(file.file.lastIndexOf('/')+1)) + '</span>') +
                    '</div></li>').appendTo($filelist);
                    $file.find('.play').bind('click', {file: file.file}, onFilePlayClick);
                    $file.find('.playlist').bind('click', {file: file.file}, onAddFileToPlaylistClick);
                    ++globalI;
                  }
                }
              });
            }
          },

          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to get directory!', 'Popup message'), mkf.messageLog.status.error, 5000);
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
            mkf.messageLog.show(mkf.lang.get('Failed to get File Sources!', 'Popup message'), mkf.messageLog.status.error, 5000);
          },
          async: false
        });

        //access to usb-sticks etc.
        //var manualPath = awxUI.settings.manualPath;
        if (awxUI.settings.manualPath) {
          xbmc.getDirectory({
            //directory: '/media',
            directory: awxUI.settings.manualPath,

            onSuccess: function(result) {
              var $file = $('<li' + (globalI%2==0? ' class="even"': '') + '><a href="" class="fileMedia">' + mkf.lang.get('Manual File Directory', 'Settings label')  + ' (' + awxUI.settings.manualPath + ')' + '</a></li>').appendTo($filelist);
              $file.bind('click', {folder: {name: mkf.lang.get('Manual File Directory', 'Settings label') + ' (' + awxUI.settings.manualPath + ')', path: awxUI.settings.manualPath}}, onFolderClick);
            },

            async: false
          });
        };
        
        var addonDir = 'addons://sources/' + (media == 'music'? 'audio' : media);
        xbmc.getDirectory({
          directory: addonDir,

          onSuccess: function(result) {
            var $file = $('<li' + (globalI%2==0? ' class="even"': '') + '><a href="" class="fileMedia">' + mkf.lang.get('Addons (unsupported feature)', 'Label') + '</a></li>').appendTo($filelist);
            $file.bind('click', {folder: {name: mkf.lang.get('Addons (unsupported feature)', 'Label'), path:addonDir}}, onFolderClick);
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
      
      var rotateCDart = awxUI.settings.rotateCDart;

      var content = '<div id="now_next"><div id="now">' + mkf.lang.get('Now:', 'Footer label') + ' <span class="label" /><span class="seperator"></span><span class="nowArtist artist" /><span class="nowTitle" /></div><div id="next">' + mkf.lang.get('Next:', 'Footer label') + ' <span class="nextTitle" /></div></div>';
      //content += '<div id="statPlayerContainer"><div id="statusPlayer"><div id="statusPlayerRow"><div id="paused"></div><div id="shuffled"></div></div><div id="statusPlayerRow"><div id="repeating"></div><div id="muted"></div></div></div><div id="remainPlayer"><div id="remaining">' + mkf.lang.get('label_remaining') + '<span class="timeRemain">00:00</span></div><div id="plTotal">' + mkf.lang.get('label_total') + '<span class="timeRemainTotal">00:00</span></div></div>';
      //content += '<div id="controller"></div>';
      
      $footerNowBox.html(content);
      

      var titleElement = '';
      var channelElement = '';

      var artistElement = '';
      var albumElement = '';

      var tvshowElement = '';
      var seasonElement = '';
      var episodeElement = '';
      
      var thumbElement = $('.artThumb');
      var thumbDiscElement = $('.discThumb');
      
      var nowLabelElement = $('div#now span.label');
      var nowArtistElement = $('div#now span.nowArtist');
      var nowElement = $('div#now span.nowTitle');
      var seperator = $('div#now span.seperator');
      var nextElement = $footerNowBox.find('span.nextTitle');
      var timeCurRemain = $footerStatusBox.find('span.timeRemain');
      var timeCurRemainTotal = $footerStatusBox.find('span.timeTotal');
      var sliderElement = $('.playingSliderWrapper .playingSlider');
      
      sliderElement.slider({
        range: 'min',
        value: 0,
        stop: function(event, ui) {
          if (awxUI.settings.player) { xbmc.seekPercentage({percentage: ui.value}); }
        }
      });
        
      xbmc.periodicUpdater.addPlayerStatusChangedListener(function(status) {
        if (status == 'stopped') {
          xbmc.periodicUpdater.currentlyPlayingFile = '';
          xbmc.periodicUpdater.nextPlayingFile = '';
          xbmc.musicPlaylist.find('a.playlistItemCur').removeClass("playlistItemCur");
          xbmc.videoPlaylist.find('a.playlistItemCur').removeClass("playlistItemCur");
          nowLabelElement.text('');
          nowArtistElement.text('');
          nowElement.text('');
          seperator.text('');
          nextElement.text('');
          timeCurRemain.text('00:00');
          timeCurRemainTotal.text('00:00');
          thumbDiscElement.hide();
          thumbElement.css('height', '280px');
          thumbElement.css('width', '187px');
          thumbElement.attr('src', 'images/empty_poster_overlay.png');
          thumbElement.css('margin-top', '0px');
          thumbElement.css('margin-right','0px');
          thumbElement.css('margin-left','70px');
          
          thumbDiscElement.attr('src', '');
          //$footerStatusBox.find('#statusPlayer').hide();
          $footerStatusBox.find('#statusPlayer #statusPlayerRow #paused').hide();
          $footerStatusBox.find('#statusPlayer #statusPlayerRow #shuffled').hide();
          $footerStatusBox.find('#statusPlayer #statusPlayerRow #repeating').hide();
          sliderElement.slider("option", "value", "0");
        
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
        //console.log(progress);
        
        //Send time to display function
        awxUIdisplay.timeKeeping(progress.time, progress.total);
        
        progress.total = Math.floor(progress.total / 1000);
        progress.time = Math.floor(progress.time / 1000);
        
        //console.log(progress.time);
        //console.log(xbmc.formatTime(progress.total - progress.time));
        
        
        /*timeCurRemain.text(xbmc.formatTime(progress.total - progress.time));
        timeCurRemainTotal.text(xbmc.formatTime(progress.total));*/
        //durationElement.text(progress.total);
        sliderElement.slider("option", "value", 100 * progress.time / progress.total);
      });
    
    });
  }; // END uniFooterStatus
  
  /* ########################### *\
   |  FindBox whole library
  \* ########################### */
  $.fn.defaultFindBox = function(options, params, parentPage) {
    //library: 'video', [open: 'continue', searchAndOr: '', searchFields: 'title', searchOps: 'contains', searchTerms: ''],
    var inputControls = false;
    //Switch off key binds
    if (awxUI.settings.inputKeysActive) {
      //Restore input keys after searching
      inputControls = true;
      xbmc.inputKeys('off');
    };
    
    var settings = {
      id: 'defaultFindBox',
      searchItems: '.findable',
      top: 0,
      left: 0,
    };
    var searchParams = {
      fields: [{
        open: 'continue',
        searchAndOr: '',
        searchFields: 'title',
        searchOps: 'contains',
        searchTerms: ''
      }],
      searchType: 'tvshow',
      library: 'video'
    };
    
    if(options) {
      $.extend(settings, options);
    }
    $.extend(searchParams, params);
    var self = this;
    //var timeout;
    
    var $searchItems = $(self).find(settings.searchItems);
    var $box = $('#' + settings.id);

    // Always create box
    var $div = $('<div id="' + settings.id + '" class="findBox"><input type="text" /></div>')
      .appendTo($('body'))
      .css({'left': settings.left, 'top': settings.top});

    if ($div.width() + $div.position().left > $(window).width()) {
      $div.css({'left': settings.left-$div.width()});
    }
    var input = $div.find('input');

    function onInputContentChanged() {
      searchParams.fields[0].searchTerms = input.val();
      if (searchParams.field) { searchParams.fields[0].searchFields = searchParams.field };
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Running advanced search...', 'Popup message'));
      
      xbmc.getAdFilter({
        options: searchParams,
        onSuccess: function(result) {
          result.Type = searchParams.searchType;
          if (result.limits.total > 0) {
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
            
            //make sub page for result
            var $vadFilterRContent = $('<div class="pageContentWrapper"></div>');
            var vadFilterRPage = mkf.pages.createTempPage(parentPage, {
              title: mkf.lang.langMsg.translate('Result').withContext('Page').ifPlural( result.limits.total, 'Results' ).fetch( result.limits.total ), //mkf.lang.get('page_title_results'),
              content: $vadFilterRContent
            });
            var fillPage = function() {
              $vadFilterRContent.addClass('loading');
              switch (result.Type) {
                case 'movies':
                  result.isFilter = true; //result.isFilter = true; <- change to
                  $vadFilterRContent.defaultMovieTitleViewer(result, vadFilterRPage);
                  $vadFilterRContent.removeClass('loading');
                break;
                case 'tvshows':
                  result.isFilter = true;
                  $vadFilterRContent.defaultTvShowTitleViewer(result, vadFilterRPage);
                  $vadFilterRContent.removeClass('loading');
                break;
                case 'episodes':
                  result.isFilter = true;
                  $vadFilterRContent.defaultEpisodesViewer(result, vadFilterRPage);
                  $vadFilterRContent.removeClass('loading');
                break;
                case 'musicvideos':
                  result.isFilter = true;
                  $vadFilterRContent.defaultMusicVideosTitleViewer(result, vadFilterRPage);
                  $vadFilterRContent.removeClass('loading');
                break;
                case 'artists':
                  result.isFilter = true;
                  $vadFilterRContent.defaultArtistsTitleViewer(result, vadFilterRPage);
                  $vadFilterRContent.removeClass('loading');
                break;
                case 'albums':
                  result.isFilter = true;
                  $vadFilterRContent.defaultAlbumTitleViewer(result, vadFilterRPage);
                  $vadFilterRContent.removeClass('loading');
                break;
                case 'songs':
                  result.isFilter = true;
                  result.showDetails = true;
                  $vadFilterRContent.defaultSonglistViewer(result, vadFilterRPage);
                  $vadFilterRContent.removeClass('loading');
                break;
              }
              
              

            }
            vadFilterRPage.setContextMenu(
              [
                {
                  'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
                  function() {
                    mkf.pages.closeTempPage(vadFilterRPage);
                    return false;
                  }
                },
                {
                  'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
                    function(){
                      $vadFilterRContent.empty();
                      fillPage();
                      return false;
                    }
                }
              ]
            );
            
            mkf.pages.showTempPage(vadFilterRPage);
            fillPage();
            $vadFilterRContent.removeClass('loading');

            return false;
          } else {
            //No results
            mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('No matches found!', 'Popup message'), 6000, mkf.messageLog.status.error);
          };
        },
        onError: function(error) {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed! Check your query.', 'Popup message'), 6000, mkf.messageLog.status.error);
        }          
      });

      $(window).trigger('resize'); // ugly but best performance: trigger 'resize' because lazy-load-images may be visible now and should be loaded.
    };

    input
      .blur(function() {
        $(this).parent().hide();
        if (inputControls) {
          xbmc.inputKeys('on');
        }
      })
      .keydown(function(event) {
        if (event.keyCode == 0x0D) {
          onInputContentChanged();
        }
        if (event.keyCode == 0x1B || event.keyCode == 0x0D) {
          $(this).parent().hide();
          if (inputControls) {
            xbmc.inputKeys('on');
          }
        }
      })
      .focus(function() {
        this.select();
      })
      .focus();

    return false;
  };
  
})(jQuery);
