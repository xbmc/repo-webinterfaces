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

    debouncer: function ( func , timeout ) {
       var timeoutID , timeout = timeout || 200;
       return function () {
        var scope = this , args = arguments;
        clearTimeout( timeoutID );
        timeoutID = setTimeout( function () {
          func.apply( scope , Array.prototype.slice.call( args ) );
        } , timeout );
       }
    },

    //Count objects in object
    objLength: function (obj) {
      var result = 0;
      for(var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        result++;
      }
      }
      return result;
    },

    input: function(options) {
      var settings = {
        type: 'Select',
        onSuccess: null,
        onError: null
      };
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Input.' + options.type + '", "id": 1}',
        settings.onSuccess,
        settings.onError
      );

      return true;
    },

    init: function(initContainer, callback) {
      xbmc.periodicUpdater.start();
      var timeout = parseInt(mkf.cookieSettings.get('timeout'));
      this.timeout = (isNaN(timeout) || timeout < 5 || timeout > 120)? 10000: timeout*1000;
      this.detectThumbTypes(initContainer, callback);
    },

    //Cinema Experience
    //Fix: change to use executeaddon
    cinemaEx: function(options) {
      var settings = {
        film: 'Blade Runner',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.httpapi(
        'ExecBuiltIn(RunScript(script.cinema.experience,command<li>movie_title=' + settings.film + '))',
        settings.onSuccess,
        settings.Error
      );
    },
    
    sendCommand: function(command, onSuccess, onError, onComplete, asyncRequest) {
      if (typeof asyncRequest === 'undefined')
        asyncRequest = true;

      if (!this.xbmcHasQuit) {
        $.ajax({
          async: asyncRequest,
          type: 'POST',
          contentType: 'application/json',
          url: '/jsonrpc?awx',
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
            //if (onComplete) { onComplete(); }
          }
        });
      }
    },

    getSearchTerm: function(type) {

      switch (type) {
        case 'artists':
          return 'a';
          break;
        case 'agenres':
          return '.folderLinkWrapper';
          break;
        case 'albums':
        if (mkf.cookieSettings.get('albumsView', 'cover') == 'cover') {
          return '.thumbWrapper';
        } else {
          return '.folderLinkWrapper';
        }
          break;
        case 'aplaylist':
          return '.folderLinkWrapper';
          break;
        case 'channel':
          return '.folderLinkWrapper';
          break;
        case 'movies':
        if (mkf.cookieSettings.get('filmView', 'poster') == 'poster') {
          return '.thumbWrapper';
        } else if (mkf.cookieSettings.get('filmView') == 'listover') {
          return '.folderLinkWrapper';
        } else if (mkf.cookieSettings.get('filmView') == 'logo') {
          return '.logoWrapper';
        } else {
          return 'a';
        }
        break;
        case 'moviesets':
        if (mkf.cookieSettings.get('filmViewSets', 'poster') == 'poster') {
          return '.thumbWrapper';
        } else if (mkf.cookieSettings.get('filmViewSets') == 'listover') {
          return '.folderLinkWrapper';
        } else {
          return 'a';
        }
        break;
        case 'tvshows':
        if (mkf.cookieSettings.get('TVView', 'banner') == 'banner') {
          return '.thumbWrapper';
        } else if (mkf.cookieSettings.get('TVView', 'logo') == 'logo') {
          return '.thumbLogoWrapper';
        } else {
          return '.folderLinkWrapper';
        }
        break;
        case 'vplaylist':
          return '.folderLinkWrapper';
          break;
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

    timeToSec: function(time) {
      //Expects time in JSON format: time.hours, time.minutes, time.seconds. Millisecs are ignored.
      return (time.hours * 3600) + (time.minutes * 60) + time.seconds; //time in secs
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
      return '/image/' + encodeURI(url);
    },
    
    getUrl: function(url) {
      return location.protocol + '//' + location.host + '/' + url;
    },

    getLogo: function(options, callback) {
      var settings = {
        path: '',
        type: '', //logo, cdart, disc, clearart, characterart, seasonTV, banner, poster
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      if (settings.path.startsWith('stack://')) {
        settings.path = settings.path.replace(/\\/g, "/").substring(8, settings.path.indexOf(","));
      }
      var path = settings.path.replace(/\\/g, "/").substring(0, settings.path.lastIndexOf("/"));

      path += '/' + settings.type + '.png';
      
      var image = xbmc.getPrepDownload({
          path: path,
          async: true,
          onSuccess: function(result) {
            callback(location.protocol + '//' + location.host + '/' + result.details.path);
          },
          onError: function(errorText) {
            callback('');

          },
        });
      //return true;
    },
    
    detectThumbTypes: function(initContainer, callback) {
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": {"properties" : ["thumbnail"]}, "id": 1}',

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
                    callback(mkf.lang.get('Failed to detect TV Show Thumb Type!'));
                  })
                  .attr('src', xbmc.getThumbUrl(tvshow.thumbnail));

                return false;
              } else { 
                //Incase of empty thumbnails
                callback();
                return false; 
              }
            });
          } else {
            // no tv shows
            callback();
          }
        },

        function (response) {
          callback(mkf.lang.get('Failed to detect TV Show Thumb Type!'));
        },

        null,
        false // not async
      );
    },

    sendBatch: function(batch) {
      var settings = {
        batch: [],
        onSuccess: null,
        onError: null
      };
      $.extend(settings, batch);
      
      var batchCommand = '[';
      
      for (i=0; i<settings.batch.length; i++) {
        if (i == settings.batch.length -1) {
          batchCommand += settings.batch[i] + ']';
        } else {
          batchCommand += settings.batch[i] + ', ';
        };
      }
      
      xbmc.sendCommand(
        batchCommand,
        settings.onSuccess,
        settings.onError
      );
    },
    
    getInfoBooleans: function(options) {
      var settings = {
        bool: ['System.HasPVR'],
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      var bools = '';
      for (i=0; i<settings.bool.length; i++) {
        if (i == settings.bool.length -1) {
          bools += '"' + settings.bool[i] + '"';
        } else {
          bools += '"' + settings.bool[i] + '",';
        };
      };
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "XBMC.GetInfoBooleans", "params": { "booleans": [ ' + bools + ' ] }, "id": "libBools"}',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        function(response) {
          settings.onError(mkf.lang.get('Failed to send command!', 'Popup message'));
        }
      );
    },
    
    getAddons: function(options) {
      var settings = {
        enabled: true,
        content: 'unknown',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Addons.GetAddons", "params": { "enabled": ' + settings.enabled + ', "content": "' + settings.content + '", "properties": [ "name", "thumbnail", "version", "author" ] }, "id": "libAddons"}',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        settings.onError
      );
    },
    
    exeAddon: function(options) {
      var settings = {
        addonid: true,
        wait: true,
        params: '', //"mediatype=tvshow", "medianame=Last Resort"
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Addons.ExecuteAddon", "params": { "wait": ' + settings.wait + ', "addonid": "' + settings.addonid + '", "params": [ ' + settings.params + ' ] },  "id": "libExeAddon"}',
        settings.onSuccess,
        settings.onError
      );
    },
    
    //PVR
    pvrGetProperties: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "PVR.GetProperties", "params": { "properties": [ "available", "recording", "scanning" ] }, "id": "libPVRProp"}',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        function(response) {
          settings.onError(reponse.error);
        }
      );
    },
    
    pvrRecord: function(options) {
      var settings = {
        record: 'toggle',
        channel: -1, //Even though "current" is accepted. It's easier to always use channelid
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "PVR.Record", "params": { "record": "toggle", "channel": ' + settings.channel + ' }, "id": "pvrRecord"}',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        function(response) {
          settings.onError();
        }
      );
    },
    
    pvrGetChannelGroups: function(options) {
      var settings = {
        group: 'tv', //or radio
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0" , "id": "libpvrChanGrp", "method": "PVR.GetChannelGroups" , "params": { "channeltype": "' + settings.group + '" } }',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        function(response) {
          settings.onError();
        }
      );
    },
    
    pvrGetChannelGroupDetails: function(options) {
      var settings = {
        channelgroupid: -1,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0" , "id": "libpvrChanGrpDets", "method": "PVR.GetChannelGroupDetails", "params": { "channelgroupid": ' + settings.channelgroupid + ', "channels": { "properties": [ "thumbnail", "locked", "hidden", "channel", "lastplayed" ] } } }',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        function(response) {
          settings.onError();
        }
      );
    },
    
    //What does this give us extra than GetChannelGroupDetails?
    pvrGetChannels: function(options) {
      var settings = {
        channelgroupid: -1,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "PVR.GetChannels", "params": { "channelgroupid": ' + settings.channelgroupid + ', "properties": [ "thumbnail", "locked", "hidden", "channel", "lastplayed" ] }, "id": 1}',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        function(response) {
          settings.onError();
        }
      );
    },
    
    pvrGetChannelDetails: function(options) {
      var settings = {
        channelid: -1,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "PVR.GetChannelDetails", "params": { "channelid": ' + settings.channelid + ', "properties": [ "thumbnail", "locked", "hidden", "channel", "lastplayed" ] }, "id": 1}',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        function(response) {
          settings.onError();
        }
      );
    },
    
    //End PVR
    scanVideoLibrary: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.Scan"}',
        settings.onSuccess,
        settings.onError
      );
    },
    
    cleanVideoLibrary: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.Clean"}',
        settings.onSuccess,
        settings.onError
      );
    },
    
    exportVideoLibrary: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.Export"}',
        settings.onSuccess,
        settings.onError
      );
    },  
    
    scanAudioLibrary: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc":"2.0","id":2,"method":"AudioLibrary.Scan"}',
        settings.onSuccess,
        settings.onError
      );
    },
    
    cleanAudioLibrary: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc":"2.0","id":2,"method":"AudioLibrary.Clean"}',
        settings.onSuccess,
        settings.onError
      );
    },
    
    exportAudioLibrary: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc":"2.0","id":2,"method":"AudioLibrary.Export"}',
        settings.onSuccess,
        settings.onError
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
        '{"jsonrpc": "2.0", "method": "Application.SetVolume", "params": { "volume": ' + settings.volume + '}, "id": 1}',
        settings.onSuccess,
        settings.onError
      );
    },

    setVolumeInc: function(options) {
      var settings = {
        volume: 'decrement',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Application.SetVolume", "params": { "volume": "' + settings.volume + '" }, "id": 1}',
        settings.onSuccess,
        settings.onError
      );
    },
    
    setMute: function() {
      var settings = {
        onSuccess: null,
        onError: null
      };

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Application.SetMute", "params": { "mute": "toggle" }, "id": 1}',
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

      var commands = {shutdown: 'System.Shutdown', quit: 'Application.Quit', suspend: 'System.Suspend', reboot: 'System.Reboot'};

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

    executeAction: function(options) {
      var settings = {
        action: 'left',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Input.ExecuteAction", "params": { "action": "' + settings.action + '" }, "id": 1}',
        settings.onSuccess,
        settings.onError
      );
    },

    playerSet: function(options) {
      var settings = {
        type: 'Shuffle',
        value: '',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

        if (xbmc.activePlayerid == 1 || xbmc.activePlayerid == 0) {
          xbmc.sendCommand(
            '{"jsonrpc": "2.0", "method": "Player.Set' + settings.type + '", "params": { "playerid": ' + xbmc.activePlayerid + ', "' + settings.type + '": "' + settings.value + '" }, "id": 1}',
            settings.onSuccess,
            settings.onError
          );
        }
      return false;
    },
    
    playerGoTo: function(options) {
      var settings = {
        to: 'next',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      if (xbmc.activePlayerid == 1 || xbmc.activePlayerid == 0) {
        xbmc.sendCommand(
          '{"jsonrpc": "2.0", "method": "Player.GoTo", "params": { "to": "' + settings.to + '", "playerid": ' + xbmc.activePlayerid + ' }, "id": 1}',
          settings.onSuccess,
          settings.onError
        );
      }
    },
    
    playerOpen: function(options) {
      var settings = {
        item: 'albumid',
        itemId: -1,
        itemStr: '',
        position: -1,
        playlistid: 0,
        resume: false,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      //Example partymode playlist
      //"item": { "partymode": "special://profile/playlists/video/PartyMode-Video.xsp" } // xsp or "music"/"video"
      xbmc.sendCommand(
          '{"jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "' + settings.item + '": ' + (settings.itemId == -1? '"' + settings.itemStr + '"': settings.itemId) + (settings.position != -1? ', "position": ' + settings.position + ', "playlistid": ' + settings.playlistid : '') + ' } ' + (settings.resume? ', "options": { "resume": true }' : '') + ' }, "id": "libPlayerOpen"}',
          settings.onSuccess,
          function(response) {
            settings.onError(response);
          }
      );
    },
    
    playlistAdd: function(options) {
      var settings = {
        playlistid: 0,
        item: 'file',
        itemId: -1,
        itemStr: '',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
          '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item": { "' + settings.item + '": ' + (settings.itemId == -1? '"' + settings.itemStr + '"': settings.itemId) + ' }, "playlistid": ' + settings.playlistid + ' }, "id": "libPlaylistAdd"}',
          settings.onSuccess,
          settings.onError
      );
    },
    
    control: function(options) {
      var settings = {
        type: 'play',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      var commands = {play: 'PlayPause', stop: 'Stop' };//, prev: 'GoPrevious', next: 'GoNext', shuffle: 'Shuffle', unshuffle: 'Unshuffle'};

        if (xbmc.activePlayerid == 1 || xbmc.activePlayerid == 0) {
          xbmc.sendCommand(
            '{"jsonrpc": "2.0", "method": "Player.' + commands[settings.type] + '", "params": { "playerid": ' + xbmc.activePlayerid + ' }, "id": 1}',
            settings.onSuccess,
            settings.onError
          );
        }

      return false;
    },

    controlSpeed: function(options) {
      var settings = {
        type: 'increment',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
        if (xbmc.activePlayerid == 1 || xbmc.activePlayerid == 0) {
          xbmc.sendCommand(
            '{"jsonrpc": "2.0", "method": "Player.SetSpeed", "params": { "playerid": ' + xbmc.activePlayerid + ', "speed": "' + settings.type + '" }, "id": 1}',
            settings.onSuccess,
            settings.onError
          );
        }
      return false;
    },
    
    cycleRepeat: function(options) {
      var settings = {
        type: options,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

        if (xbmc.activePlayerid == 1 || xbmc.activePlayerid == 0) {
          xbmc.sendCommand(
            '{"jsonrpc": "2.0", "method": "Player.SetRepeat", "params": { "playerid": ' + xbmc.activePlayerid + ', "repeat": "cycle" }, "id": 1}',
            settings.onSuccess,
            settings.onError
          );
        }
      return false;
    },
    
    sendText: function(options) {
      var settings = {
        text: '',
        done: true,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Input.SendText", "params": { "text": "' + settings.text + '", "done": ' + settings.done + ' }, "id": 1}',
        settings.onSuccess,
        settings.onError
      );
    },
    
    setSubtitles:  function(options) {
      var settings = {
        command: 'off',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Player.SetSubtitle", "params": { "playerid": 1, "subtitle": "' + settings.command +'"}, "id": 1}',
          settings.onSuccess,
          settings.onError
      );
    },
    
    setAudioStream:  function(options) {
      var settings = {
        command: 'next',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Player.SetAudioStream", "params": { "playerid": 1, "stream": "' + settings.command +'"}, "id": 1}',
          settings.onSuccess,
          settings.onError
      );
    },
    
    
    seekPercentage: function(options) {
      var settings = {
        percentage: 0,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

        if (xbmc.activePlayerid == 1 || xbmc.activePlayerid == 0) {
          xbmc.sendCommand(
            '{"jsonrpc": "2.0", "method": "Player.Seek", "params": {"value": ' + settings.percentage + ', "playerid": ' + xbmc.activePlayerid + '}, "id": 1}',

            settings.onSuccess,
            settings.onError
          );
        }
    },

    getAspect: function(aspect) {
      if (aspect == 0)
        return 0;
      if (aspect >= 1.30 && aspect <= 1.39)
        return '133';
      else if (aspect < 1.7)
        return '166';
      else if (aspect < 1.79)
        return '178';
      else if (aspect >= 1.80 && aspect <= 1.95 )
        return '185';
      else if (aspect < 2.34)
        return '220';
      else
        return '235';
    },

    getvFormat: function(width) {
      if (width == 1920) { 
        return 'HD1080';
      } else if (width == 1280 ) { 
        return 'HD720';
      } else {
        return 'SD';
      };
    },
    
    getVcodec: function(vcodec) {
      vcodec = vcodec.toLowerCase();
      switch (vcodec) {
      case 'h264':
        return 'H264';
        break;
      case 'xvid':
        return 'XVID';
        break;
      case 'div3':
        //div3 dx50
        return 'DivX3';
        break;
      case 'dx50':
        return 'DivX5';
        break;
      case 'avc1':
        return 'AVC1';
        break;
      case 'vp8':
        return 'VP8';
        break;
      case 'mpeg1':
        return 'MPEG1';
        break;
      case 'mpeg2':
        return 'MPEG2';
        break;
      case 'mpeg2video':
        return 'MPEG2';
        break;
      case 'dvd':
        return 'DVD';
        break;
      case 'bluray':
        return 'BluRay';
        break;
      case 'vc-1':
        return 'VC1';
        break;
      case 'wvc1':
        return 'VC1';
        break;
      case 'flv':
        return 'FLV';
        break;
      };
      return 'Unknown';
    },

    getAcodec: function (acodec) {
      acodec = acodec.toLowerCase();
      switch (acodec) {
      case 'aac':
        return 'AAC';
        break;
      case 'ac3':
        return 'AC3';
        break;
      case 'aif':
        return 'AIF';
        break;
      case 'aifc':
        return 'AIFC';
        break;
      case 'ape':
        return 'APE';
        break;
      case 'avc':
        return 'AVC';
        break;
      case 'cdda':
        return 'CDDA';
        break;
      case 'dca':
        return 'DCA';
        break;
      case 'dts':
        return 'DTS';
        break;
      case 'dtshd_hra':
        return 'DTSHD';
        break;
      case 'dtshd_ma':
        return 'DTSMA';
        break;
      case 'eac3':
        return 'EAC3';
        break;
      case 'flac':
        return 'FLAC';
        break;
      case 'mp1':
        return 'MP1';
        break;
      case 'mp2':
        return 'MP2';
        break;
      case 'mp3':
        return 'MP3';
        break;
      case 'ogg':
        return 'OGG';
        break;
      case 'vorbis':
        return 'OGG';
        break;
      case 'truehd':
        return 'DDTrueHD';
        break;
      case 'wav':
        return 'wav';
        break;
      case 'wavpack':
        return 'wavpack';
        break;
      case 'wma':
        return 'WMA';
        break;
      case 'wmapro':
        return 'WMAPro';
        break;
      case 'wma2':
        return 'WMA2';
        break;
      case 'pcm_bluray':
        return 'PCM';
        break;
      case 'alac':
        return 'ALAC';
        break;
      };    
    },
    
    
    getAudioGenres: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetGenres", "params": {"sort": { "order": "ascending", "method": "label" } }, "id": 1}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
      );
    },
    
    getArtists: function(options) {
      var settings = {
        item: '',
        itemId: -1,
        filter: '',
        start: 0,
        end: 999999,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetArtists", "params": { ' + (settings.item == ''? (settings.filter != ''? settings.filter + ', ' : '') : '"filter": { "' + settings.item + '": ' + (settings.itemId !== -1? settings.itemId : '"' + settings.itemStr + '"') + '}, ') + '"limits": { "start" : ' + settings.start + ', "end": ' + settings.end + ' }, "properties": [ "thumbnail", "fanart", "born", "formed", "died", "disbanded", "yearsactive", "mood", "style", "genre" ], "sort": { "order": "ascending", "method": "artist", "ignorearticle": true } }, "id": 1}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
      );
    },

    getArtistDetails: function(options) {
      var settings = {
        artistid: -1,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetArtistDetails", "params": { "artistid": ' + settings.artistid + ', "properties": [ "thumbnail", "fanart", "born", "formed", "died", "disbanded", "yearsactive", "mood", "style", "genre", "description", "instrument" ] }, "id": 1}',

        function(response) {
          settings.onSuccess(response.result.artistdetails);
        },

        settings.onError
      );
    },

    getAlbums: function(options) {
      var settings = {
        item: '',
        itemId: -1,
        filter: '',
        sortby: 'album',
        order: 'ascending',
        start: 0,
        end: 99999,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      //var order = mkf.cookieSettings.get('albumOrder')=='album'? 'label' : 'artist';
      settings.sortby = mkf.cookieSettings.get('albumSort', 'label');
      settings.order = mkf.cookieSettings.get('adesc', 'ascending');

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": { ' + (settings.item == ''? (settings.filter != ''? settings.filter + ', ' : '') : '"filter": { "' + settings.item + '": ' + (settings.itemId !== -1? settings.itemId : '"' + settings.itemStr + '"') + '}, ') + '"limits": { "start" : ' + settings.start + ', "end": ' + settings.end + ' }, "properties": ["artist", "genre", "rating", "thumbnail", "year", "mood", "style"], "sort": { "order": "' + settings.order + '", "method": "' + settings.sortby + '", "ignorearticle": true } }, "id": "libAlbums"}',

        function(response) {
          if (settings.order == 'descending' && settings.sortby == 'none') {
          var aresult = $.makeArray(response.result.albums).reverse();
          delete response.result.albums;
          response.result.albums = aresult;
          settings.onSuccess(response.result);
          } else {
          settings.onSuccess(response.result);
          }
        },

        settings.onError
      );
    },
    
    getAlbumDetails: function(options) {
      var settings = {
        albumid: -1,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbumDetails", "params": { "albumid" : ' + settings.albumid + ', "properties" : ["rating", "artist", "thumbnail", "description", "title", "genre", "theme", "mood", "style", "type", "albumlabel", "year", "musicbrainzalbumid", "musicbrainzalbumartistid", "fanart" ] }, "id": "libAlbumDets"}',

        function(response) {
          settings.onSuccess(response.result.albumdetails);
        },
        settings.onError
      );
    },
    
    getRecentlyAddedAlbums: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc":"2.0","id":2,"method":"AudioLibrary.GetRecentlyAddedAlbums","params":{ "limits": {"end": 25},"properties":["thumbnail","genre","artist","rating"]}}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
      );
    },
    
    getRecentlyPlayedAlbums: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc":"2.0","id":2,"method":"AudioLibrary.GetRecentlyPlayedAlbums","params":{ "limits": {"end": 25},"properties":["thumbnail","genre","artist","rating"]}}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
      );
    },
    
    getSongs: function(options) {
      var settings = {
        item: '', //genre(id), artist(id), album(id)
        itemId: -1, //genreid, artistid, albumid
        itemStr: '', //genre, artist, album
        filter: '',
        sortby: 'track',
        order: 'ascending',
        start: 0,
        end: 999999,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": { ' + (settings.item == ''? (settings.filter != ''? settings.filter + ', ' : '') : '"filter": { "' + settings.item + '": ' + (settings.itemId !== -1? settings.itemId : '"' + settings.itemStr + '"') + '}, ') + '"limits": { "start" : ' + settings.start + ', "end": ' + settings.end + ' }, "properties": [ "artist", "duration", "track" ], "sort": { "order": "' + settings.order + '", "method": "' + settings.sortby + '", "ignorearticle": true } }, "id": "libSongs"}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
      );
    },
    
    getSongDetails: function(options) {
      var settings = {
        songid: -1,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongDetails", "params": { "songid" : ' + settings.songid + ', "properties" : [ "title", "artist", "albumartist", "genre", "year", "rating", "album", "track", "duration", "comment", "lyrics", "musicbrainztrackid", "musicbrainzartistid", "musicbrainzalbumid", "musicbrainzalbumartistid", "playcount", "fanart", "thumbnail", "file", "albumid", "lastplayed", "disc" ] }, "id": "libSongDets"}',

        function(response) {
          settings.onSuccess(response.result.songdetails);
        },
        settings.onError
      );
    },
    
    getRecentlyAddedSongs: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetRecentlyAddedSongs", "params": { "limits": { "start": 0, "end": 50 }, "properties": [ "artist", "duration", "track" ] }, "id": "libRecentSongs"}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
      );
    },
    
    getRecentlyPlayedSongs: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetRecentlyPlayedSongs", "params": { "limits": { "start": 0, "end": 50 }, "sort": { "method": "lastplayed", "order": "descending" }, "properties": [ "artist", "duration", "track", "lastplayed" ] }, "id": "libRecentSongs"}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
      );
    },
    
    getMusicVideos: function(options) {
      var settings = {
        item: '',
        itemId: -1,
        filter: '',
        sortby: 'none',
        order: 'ascending',
        start: 0,
        end: 99999,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      settings.sortby = mkf.cookieSettings.get('musicVideoSort', 'label');
      settings.order = mkf.cookieSettings.get('mvdesc', 'ascending');

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMusicVideos", "params": { ' + (settings.item == ''? (settings.filter != ''? settings.filter + ', ' : '') : '"filter": { "' + settings.item + '": ' + (settings.itemId !== -1? settings.itemId : '"' + settings.itemStr + '"') + '}, ') + '"properties": [ "title", "thumbnail", "artist", "album", "genre", "lastplayed", "year", "runtime", "fanart", "file", "streamdetails" ], "sort": { "order": "' + settings.order + '", "method": "' + settings.sortby + '", "ignorearticle": true } }, "id": "libMusicVideos"}',

        function(response) {
          if (settings.order == 'descending' && settings.sortby == 'none') {
          var aresult = $.makeArray(response.result.albums).reverse();
          delete response.result.musicvideos;
          response.result.musicvideos = aresult;
          settings.onSuccess(response.result);
          } else {
          settings.onSuccess(response.result);
          }
        },

        settings.onError
      );    
    },
    
    getRecentlyAddedMusicVideos: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc":"2.0", "id": "libRecentMVs", "method": "VideoLibrary.GetRecentlyAddedMusicVideos","params": { "limits": { "end": 25}, "properties": [ "title", "thumbnail", "artist", "album", "genre", "lastplayed", "year", "runtime", "fanart", "file", "streamdetails" ] } }',

        function(response) {
          settings.onSuccess(response.result);
        },
        settings.onError
      );
    },
    
    getMusicVideoInfo: function(options) {
      var settings = {
        musicvideoid: 0,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMusicVideoDetails", "params": { "musicvideoid": ' + settings.musicvideoid + ', "properties": ["genre", "director", "plot", "title", "runtime", "year", "thumbnail", "playcount", "file", "lastplayed", "streamdetails", "fanart"] },  "id": 2}',
        function(response) {
          settings.onSuccess(response.result.musicvideodetails);
        },
        settings.onError
      );
    },
    
    getMusicPlaylists: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params": {"directory": "special://profile/playlists/music/", "media": "music", "sort": { "method": "label" } }, "id": 1}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
      );
    },
    
    getVideoPlaylists: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params": {"directory": "special://profile/playlists/video/", "media": "video", "sort": { "method": "label" } }, "id": 1}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
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
        '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item": {"file": "' + settings.file.replace(/\\/g, "\\\\") + '"}, "playlistid": 0 }, "id": 1}',
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

      //Will not recurse
      var containsfiles = false;
      var recurseDir = [];
      
      xbmc.getDirectory({
        media: 'music',
        directory: settings.folder,
        
        onSuccess: function(result) {
          var n = 0;
          $.each(result.files, function(i, file) {
            if (file.filetype == 'file') {
              containsfiles = true;
            };
            if (file.filetype == 'directory') {
              recurseDir[n] = file.file;
              n ++;
            };
            //if (file.filetype == 'file') { if (file.file.search(/\.mp3|\.flac|\.wav|\.aac/i)) { console.log( i + '.audio file!') }; };
          });
        },
        onError: function(result) {
          settings.onError(result);
        }
      });
      if (containsfiles) {
        xbmc.sendCommand(
          '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": {"item": {"directory": "' + settings.folder + '"}, "playlistid": 0}, "id": 1}',
          
          function(response) {
            settings.onSuccess()
          },
          
          function(response) {
            settings.onError(mkf.lang.get('Failed to add items to the playlist!', 'Popup message'));
          }
        );  
      };
      if (recurseDir.length > 0) {
        $.each(recurseDir, function(i, dir) {
          xbmc.sendCommand(
            '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": {"item": {"directory": "' + recurseDir[i] + '"}, "playlistid": 0}, "id": 1}',
            
            function(response) {
              settings.onSuccess()
            },
            
            function(response) {
              settings.onError(mkf.lang.get('Failed to add items to the playlist!', 'Popup message'));
            }
          );  
        });
      };
      if (!containsfiles && recurseDir.length == 0) { settings.onError(mkf.lang.get('Failed to add items to the playlist!', 'Popup message')); };
    },

    clearAudioPlaylist: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Playlist.Clear", "params": { "playlistid": 0 }, "id": 1}',
        settings.onSuccess,
        settings.onError
      );
    },

    swapAudioPlaylist: function(options) {
      var settings = {
        plFrom: '0',
        plTo: '0',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Playlist.Swap", "params": { "playlistid": 0, "position1": ' + settings.plFrom + ', "position2": '+ settings.plTo +' }, "id": 1}',
        settings.onSuccess,
        settings.onError
      );
    },
    
    swapVideoPlaylist: function(options) {
      var settings = {
        plFrom: '0',
        plTo: '0',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Playlist.Swap", "params": { "playlistid": 1, "position1": ' + settings.plFrom + ', "position2": '+ settings.plTo +' }, "id": 1}',
        settings.onSuccess,
        settings.onError
      );
    },

    playlistPlay: function(options) {
      var settings = {
        item: 0,
        playlistid: 0,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      if (xbmc.activePlayerid == settings.playlistid) {
        xbmc.sendCommand(
          '{"jsonrpc": "2.0", "method": "Player.GoTo", "params" : { "playerid" : ' + settings.playlistid + ', "to": ' + settings.item + ' }, "id": 1}',
          settings.onSuccess,
          settings.onError
        );
      } else {
        xbmc.sendCommand(
          '{"jsonrpc": "2.0", "method": "Player.Open", "params" : { "item" : { "playlistid" : ' + settings.playlistid + ', "position": ' + settings.item + ' } }, "id": 1}',
          settings.onSuccess,
          settings.onError
        );
      }
    },

    removeAudioPlaylistItem: function(options) {
      var settings = {
        item: 0,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Playlist.Remove", "params" : { "playlistid" : 0, "position": ' + settings.item + ' }, "id": 1}',
        settings.onSuccess,
        settings.onError
      );
    },
    
    removeVideoPlaylistItem: function(options) {
      var settings = {
        item: 0,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Playlist.Remove", "params" : { "playlistid" : 1, "position" : ' + settings.item + ' }, "id": 1}',
        settings.onSuccess,
        settings.onError
      );
    },

    playSongNext: function(options) {
      var settings = {
        songid: 0,
        position: 0,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      if (xbmc.activePlayerid == 0) {
        xbmc.sendCommand(
          '{"jsonrpc":"2.0","id":2,"method":"Player.GetProperties","params":{ "playerid": 0,"properties":["time", "totaltime", "position"] } }',

          function(response) {
            var insertAhead = 1;
            var curtime = (response.result.time.hours * 3600) + (response.result.time.minutes * 60) + response.result.time.seconds;
            var curruntime = (response.result.totaltime.hours * 3600) + (response.result.totaltime.minutes * 60) + response.result.totaltime.seconds;
            var timeRemaining = curruntime - curtime;
            // Allow for a delay in inserting. If < 15 seconds left, insert 2 ahead.
            if (timeRemaining < 15) { insertAhead = 2; };
            settings.position = response.result.position + insertAhead;
            
            xbmc.insertPlaylist({
              itemid: settings.songid,
              playlistid: 0,
              itemtype: 'songid',
              position: settings.position,
              
              onSuccess: settings.onSuccess,
              
              onError: settings.onError
            });
              
          },

          settings.onError
        );
      //return true;
      } else {
        settings.onError
      }
    },

    playAudioFile: function(options) {
      var settings = {
        file: '',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      //Fix: change to use player.open
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
              settings.onError();
            }
          });
        },

        onError: function() {
          settings.onError();
        }
      });
    },

    playAudioFolder: function(options) {
      var settings = {
        folder: '',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      //Fix: change to use player.open
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
          settings.onError();
        }
      });
    },

    getAudioPlaylist: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Playlist.GetItems", "params": { "properties": ["title", "album", "artist", "duration"], "playlistid": 0 }, "id": 1}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
      );
    },

    insertPlaylist: function(options) {
      var settings = {
        position: 0,
        playlistid: 0,
        itemtype: 'songid',
        itemid: 0,
        itemfile: '',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Playlist.Insert", "params": { "playlistid": ' + settings.playlistid + ', "position":' + settings.position + ', "item": { "' + settings.itemtype + '":' + settings.itemid + '}}, "id": 1}',
        settings.onSuccess,
        settings.onError
      );
    },
    
    getVideoGenres: function(options) {
      var settings = {
        type: 'movie',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetGenres", "params": { "type": "' + settings.type +'" , "sort": { "method": "label" } }, "id": 1}',
        function(response) {
          settings.onSuccess(response.result);
        },
        settings.onError
      );
    },
    
    clearVideoPlaylist: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Playlist.Clear", "params": { "playlistid": 1 }, "id": 1}',
        settings.onSuccess,
        settings.onError
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
        '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item" : { "file": "' + settings.file.replace(/\\/g, "\\\\") + '"}, "playlistid": 1 }, "id": 1}',
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

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": { "item" : { "directory": "' + settings.folder.replace(/\\/g, "\\\\") + '"}, "playlistid": 1 }, "id": 1}',
        settings.onSuccess,
        settings.onError,
        null,
        settings.async
      );
      
    },

    playVideoFile: function(options) {
      var settings = {
        file: '',
        resume: false,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
          '{"jsonrpc": "2.0", "method": "Player.Open", "params" : { "item" : { "file" : "' + settings.file + '"}, "options": { "resume": ' + settings.resume + ' } }, "id": 1}',
          settings.onSuccess,
          settings.onError
      );
    },



    playVideoFolder: function(options) {
      var settings = {
        folder: '',
        onSuccess: null,
        onError: null
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
          settings.onError();
        }
      });
    },
    
    getMovies: function(options) {
      var settings = {
        item: '',
        itemId: -1,
        itemStr: '',
        filter: '',
        sortby: 'label',
        order: 'ascending',
        start: 0,
        end: 99999,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      settings.sortby = mkf.cookieSettings.get('filmSort', 'label');
      settings.order = mkf.cookieSettings.get('mdesc', 'ascending');

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { ' + (settings.item == ''? (settings.filter != ''? settings.filter + ', ' : '') : '"filter": { "' + settings.item + '": ' + (settings.itemId !== -1? settings.itemId : '"' + settings.itemStr + '"') + '}, ') + '"limits": { "start" : ' + settings.start + ', "end": ' + settings.end + ' }, "properties" : ["rating", "thumbnail", "playcount", "file"], "sort": { "order": "' + settings.order +'", "method": "' + settings.sortby + '", "ignorearticle": true } }, "id": "libMovies"}',
        function(response) {
          if (settings.order == 'descending' && settings.sortby == 'none') {
            var mresult = $.makeArray(response.result.movies).reverse();
            delete response.result.movies;
            response.result.movies = mresult;
            settings.onSuccess(response.result);
          } else {
            settings.onSuccess(response.result);
          };
        },
        settings.onError
      );
    },


    getMovieInfo: function(options) {
      var settings = {
        movieid: 0,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovieDetails", "params": { "movieid": ' + settings.movieid + ', "properties": ["genre", "director", "plot", "title", "originaltitle", "runtime", "year", "rating", "thumbnail", "playcount", "trailer", "cast", "resume", "file", "tagline", "set", "setid", "lastplayed", "studio", "mpaa", "votes", "streamdetails", "writer", "fanart", "imdbnumber"] },  "id": 2}',
        function(response) {
          settings.onSuccess(response.result.moviedetails);
        },
        settings.onError
      );
    },
    
    getMovieSets: function(options) {
      var settings = {
        sortby: 'label',
        order: 'ascending',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      //settings.sortby = mkf.cookieSettings.get('filmSort', 'label');
      //settings.order = mkf.cookieSettings.get('mdesc', 'ascending');

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovieSets", "params": {"properties": [ "fanart", "playcount", "thumbnail"], "sort": { "order": "ascending", "method": "label", "ignorearticle": true } },"id": 1 }',
        function(response) {
            settings.onSuccess(response.result);
        },
        settings.onError
      );
    },

    getMovieSetDetails: function(options) {
      var settings = {
        setid: 0,
        sortby: 'label',
        order: 'ascending',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      //settings.sortby = mkf.cookieSettings.get('filmSort', 'label');
      //settings.order = mkf.cookieSettings.get('mdesc', 'ascending');

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovieSetDetails", "params": {"setid": ' + settings.setid + ', "properties": [ "fanart", "playcount", "thumbnail" ], "movies": { "properties": [ "rating", "thumbnail", "playcount", "file" ], "sort": { "order": "ascending", "method": "sorttitle" }} },"id": 1 } },"id": 1 }',
        function(response) {
            settings.onSuccess(response.result);
        },
        settings.onError
      );
    },

    getTvShows: function(options) {
      var settings = {
        item: '',
        itemId: -1,
        filter: '',
        sortby: 'label',
        order: 'ascending',
        start: 0,
        end: 99999,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      settings.sortby = mkf.cookieSettings.get('TVSort', 'label');
      settings.order = mkf.cookieSettings.get('tvdesc', 'ascending');

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": { ' + (settings.item == ''? (settings.filter != ''? settings.filter + ', ' : '') : '"filter": { "' + settings.item + '": ' + (settings.itemId !== -1? settings.itemId : '"' + settings.itemStr + '"') + '}, ') + '"limits": { "start" : ' + settings.start + ', "end": ' + settings.end + ' }, "properties": ["genre", "plot", "title", "originaltitle", "year", "rating", "thumbnail", "playcount", "file", "fanart"], "sort": { "order": "' + settings.order + '", "method": "' + settings.sortby + '" } }, "id": "libTvShows"}',
        function(response) {
          settings.onSuccess(response.result);
        },
        settings.onError
      );
    },
    
    getTvShowInfo: function(options) {
      var settings = {
        tvshowid: 0,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShowDetails", "params": { "tvshowid": ' + settings.tvshowid + ', "properties": [ "votes", "premiered", "cast", "genre", "plot", "title", "originaltitle", "year", "rating", "thumbnail", "playcount", "file", "fanart", "episode"] }, "id": 1}',
        function(response) {
          settings.onSuccess(response.result.tvshowdetails);
        },
        settings.onError
      );
    },

    getSeasons: function(options) {
      var settings = {
        tvshowid: 0,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetSeasons", "params": { "tvshowid": ' + settings.tvshowid + ', "properties": ["season", "playcount"], "sort": { "method": "label" } }, "id": 1}',
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
        sortby: 'episode',
        order: 'ascending',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      settings.sortby = mkf.cookieSettings.get('EpSort', 'label');
      settings.order = mkf.cookieSettings.get('epdesc', 'ascending');
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": { "tvshowid": ' + settings.tvshowid + ', "season" : ' + settings.season + ', "properties": ["episode", "playcount", "fanart", "plot", "season", "showtitle", "thumbnail", "rating"], "sort": { "order": "' + settings.order + '", "method": "' + settings.sortby + '" } }, "id": 1}',
        function(response) {
          if (settings.order == 'descending' && settings.sortby == 'none') {
            var epresult = $.makeArray(response.result.episodes).reverse();
            delete response.result.episodes;
            response.result.episodes = epresult;
            settings.onSuccess(response.result);
          } else {
            settings.onSuccess(response.result);
          };
        },
        settings.onError
      );
    },


    getEpisodeDetails: function(options) {
      var settings = {
        episodeid: 0,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodeDetails", "params": { "episodeid": ' + settings.episodeid + ', "properties": ["season", "episode", "firstaired", "plot", "title", "runtime", "rating", "thumbnail", "playcount", "file", "fanart", "streamdetails", "resume"] }, "id": 2}',
        function(response) {
          settings.onSuccess(response.result.episodedetails);
        },
        settings.onError
      );
    },
    
    
    getVideoPlaylist: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Playlist.GetItems", "params": { "properties": [ "runtime", "showtitle", "season", "title", "artist" ], "playlistid": 1}, "id": 1}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
      );
    },

    getNextPlaylistItem: function(options) {
      var settings = {
        playlistid: -1,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      var plCurPos = -1;
      var nextItem = '';
      
      xbmc.sendCommand(
        '{"jsonrpc":"2.0","id":"OPProp","method":"Player.GetProperties","params": { "playerid": ' + xbmc.activePlayerid + ', "properties": [ "speed", "shuffled", "repeat", "subtitleenabled", "time", "totaltime", "position", "currentaudiostream" ] } }',

        function(response) {
          //Current playlist position
          plCurPos = response.result.position;
          
          xbmc.sendCommand(
            '{"jsonrpc": "2.0", "id": "libNextItem", "method": "Playlist.GetItems", "params": { "properties": [ "runtime", "showtitle", "season", "title", "album", "artist", "duration", "file" ], "playlistid": ' + settings.playlistid + '}}',

            function(response) {
              if (response.result.limits.total > 1) { nextItem = response.result.items[plCurPos + 1] };
              settings.onSuccess(nextItem);
            },
            settings.onError
        );

        },
        settings.onError
      );
    },

    getSources: function(options) {
      var settings = {
        media: 'music',
        onSuccess: null,
        onError: null,
        async: true
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Files.GetSources", "params" : { "media" : "' + settings.media + '" }, "id": 1}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError,
        null,
        settings.async
      );
    },

    
    getRecentlyAddedEpisodes: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.GetRecentlyAddedEpisodes","params":{ "limits": {"end": 25},"properties":["title","runtime","season","episode","showtitle","thumbnail","file","plot","playcount","tvshowid"]}} ',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
      );
    },

    getunwatchedEps: function(options) {
      var settings = {
        tvshowid: 0,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      var eps = [];
      
      xbmc.sendCommand(
        '{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.GetEpisodes","params":{ "tvshowid": ' + settings.tvshowid + ', "properties":["season","playcount","episode","thumbnail","rating","plot"], "sort": { "order": "ascending", "method": "episode" }}}',

        function(response) {
          var n = 0;
          $.each(response.result.episodes, function (i, episode) {
            if (episode.playcount == 0) {
              eps.splice(n,0,response.result.episodes[i]);
              n += 1;
            }
          });
          settings.onSuccess(eps);
        },

        settings.onError
      );
    },
    
    getRecentlyAddedMovies: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.GetRecentlyAddedMovies","params":{ "limits": {"end": 25},"properties":["title","originaltitle","runtime","thumbnail","file","year","plot","tagline","playcount","rating","genre","director"]}}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
      );
    },
    
    getAdFilter: function(options) {
      var settings = {
        library: 'Video',
        searchType: 'movie',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options.options);
      //temp fix
      settings.onSuccess = options.onSuccess;
      settings.onError = options.onError;

      var fields = settings.fields;
      var fieldsLen = xbmc.objLength(fields);
      var open = 0;
      var finalClose = true;

      switch (settings.searchType) {
        case 'movies':
          properties = '"properties" : ["rating", "thumbnail", "playcount", "file"],';
          settings.sortby = mkf.cookieSettings.get('filmSort', 'label');
          settings.order = mkf.cookieSettings.get('mdesc', 'ascending');
        break;
        case 'tvshows':
          properties = '"properties": ["genre", "plot", "title", "originaltitle", "year", "rating", "thumbnail", "playcount", "file", "fanart"],';
          settings.sortby = mkf.cookieSettings.get('TVSort', 'label');
          settings.order = mkf.cookieSettings.get('tvdesc', 'ascending');
        break;
        case 'episodes':
          properties = '"properties": ["episode", "playcount", "fanart", "plot", "season", "showtitle", "thumbnail", "rating"],';
          settings.sortby = mkf.cookieSettings.get('EpSort', 'episode');
          settings.order = mkf.cookieSettings.get('epdesc', 'ascending');
        break;
        case 'musicvideos':
          properties = '"properties": [ "title", "thumbnail", "artist", "album", "genre", "lastplayed", "year", "runtime", "fanart", "file", "streamdetails" ],';
          //No music sort order yet. Set a default.
          settings.sortby = 'label';
          settings.order = 'ascending';
        break;
        case 'artists':
          properties = '"properties" : ["thumbnail", "fanart", "born", "formed", "died", "disbanded", "yearsactive", "mood", "style", "genre"],';
          settings.sortby = 'artist';
          settings.order = 'ascending';
        break;
        case 'albums':
          properties = '"properties": ["artist", "genre", "rating", "thumbnail", "year", "mood", "style"],';
          settings.sortby = mkf.cookieSettings.get('albumSort', 'label');
          settings.order = mkf.cookieSettings.get('adesc', 'ascending');
        break;
        case 'songs':
          properties = '"properties": ["artist", "track", "thumbnail", "genre", "year", "lyrics", "albumid", "playcount", "rating"],';
          settings.sortby = 'track';
          settings.order = 'ascending';
        break;
      };
      
      var query = '{"jsonrpc": "2.0", "id": 1, "method": "' + settings.library + 'Library.Get' + settings.searchType +'", "params": { "sort": { "order": "' + settings.order +'", "method": "' + settings.sortby + '", "ignorearticle": true }, ' + properties + ' "filter": ';
      var properties = '';
      
      if (typeof(fields[0]) !== 'undefined' && fieldsLen == 1) {
        //Single search term
        query += '{"field": "' + fields[0].searchFields +'", "operator": "' + fields[0].searchOps + '", "value": "' + fields[0].searchTerms + '"} } }';
      } else {
        //Multiple search fields

        //Catch start with openning
        if (fields[0].searchAndOr != '' && typeof(fields[0].searchFields) === 'undefined') { finalClose = false };

        for (i=0; i<fieldsLen; i++) {

          if (fields[i].searchAndOr != '' && fields[i].open == 'continue') {
            query += ' { "' + fields[i].searchAndOr + '": [';
          };
          if (fields[i].open == 'continue') {
            query += ' {"field": "' + fields[i].searchFields +'", "operator": "' + fields[i].searchOps + '", "value": "' + fields[i].searchTerms + '"}' + (i!=fieldsLen-1? ',' : ' ] }');
          };

          if (fields[i].open == 'open') {
            if (typeof(fields[i].searchFields) === 'undefined') {
              query += ' { "' + fields[i].searchAndOr + '": [';
              open ++;
            } else {
              query += ' { "' + fields[i].searchAndOr + '": [' + ' {"field": "' + fields[i].searchFields +'", "operator": "' + fields[i].searchOps + '", "value": "' + fields[i].searchTerms + '"}' + (i!=fieldsLen-1? ',' : '');
            }
          };
          
          if (fields[i].open == 'close') {          
            if (typeof(fields[i].searchFields) === 'undefined') {
              query = query.substring(0, query.length-1);
              query += ' ] }'; // +  (i!=fieldsLen-1? ',' : '] }');
              if (i!=fieldsLen-1) {
                query += ',';
              } else if (open > 0 && finalClose) {
                query += ' ] }';
              };
              open --;
            } else {
              query += ' {"field": "' + fields[i].searchFields +'", "operator": "' + fields[i].searchOps + '", "value": "' + fields[i].searchTerms + '"}' + ' ] },' //+ (open != 0? ',' : '');
              if (i==fieldsLen-1) {
                query = query.substring(0, query.length-1);
                query += ' ] }';
              }
            };
            
          };
        };
        query += ' } }';
      }

      xbmc.sendCommand(
        query,
        function(response) {
          settings.onSuccess(response.result);
        },
        function(response) {
          settings.onError(response.error);
        }
      );

    },
    
    getPrepDownload: function(options) {
      var settings = {
        path: '',
        onSuccess: null,
        onError: null,
      };
      $.extend(settings, options);

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Files.PrepareDownload", "params": { "path": "' + settings.path + '"}, "id": 1}',

        function(response) {
          settings.onSuccess(response.result);
        },

        settings.onError
      );
    },

    getFileDetails: function(options) {
      var settings = {
        media: 'music',
        file: '',
        onSuccess: null,
        onError: null,
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Files.GetFileDetails", "params": { "file": "' + settings.file + '", "media": "' + settings.media + '", "properties": [ "resume" ] }, "id": 1}',

        function(response) {
          settings.onSuccess(response.result);
        },
        function(response) {
          settings.onError(response.error);
        }
        
      );
    },
    
    getDirectory: function(options) {
      var settings = {
        media: 'music',
        isPlaylist: false,
        directory: '',
        onSuccess: null,
        onError: null,
        async: false
      };
      $.extend(settings, options);

      var command;
      
      if (settings.isPlaylist) {
        command = '{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params" : { "directory" : "' + settings.directory.replace(/\\/g, "\\\\") + '", "media" : "' + settings.media +'", "properties": ["artist", "album", "showtitle", "episode", "season", "title"] }, "id": 1}'
        } else {
        command = '{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params" : { "directory" : "' + settings.directory.replace(/\\/g, "\\\\") + '", "media" : "' + settings.media +'", "properties": [ "file" ], "sort": { "order": "ascending", "method": "file" } }, "id": 1}'
        };
      xbmc.sendCommand(
        command,

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
      nextPlayingChangedListener: [],
      playerStatusChangedListener: [],
      progressChangedListener: [],
      
      addVolumeChangedListener: function(fn) {
        this.volumeChangedListener.push(fn);
      },

      addCurrentlyPlayingChangedListener: function(fn) {
        this.currentlyPlayingChangedListener.push(fn);
      },

      addNextPlayingChangedListener: function(fn) {
        this.nextPlayingChangedListener.push(fn);
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

      fireNextPlayingChanged: function(file) {
        $.each(xbmc.periodicUpdater.nextPlayingChangedListener, function(i, listener)  {
          listener(file);
        });
      },
      
      fireProgressChanged: function(progress) {
        $.each(xbmc.periodicUpdater.progressChangedListener, function(i, listener)  {
          listener(progress);
        });
      },

      start: function() {
          xbmc.sendCommand(
            '{"jsonrpc": "2.0", "method": "JSONRPC.Version",  "id": 1}',

            function (response) {
              if (response.result.version >= 5 && navigator.appVersion.indexOf("MSIE") == -1) {
                if ("WebSocket" in window) {
                  xbmc.wsListener();
                  console.log('Trying websocket');
                }
              } else {
                setTimeout($.proxy(xbmc.periodicUpdater, "periodicStep"), 20);
                console.log('No websocket support');
              }
            }
          );
      },
    
      periodicStep: function() {
        
        //Stop changed status firering by only setting vars once!
        if (typeof xbmc.periodicUpdater.lastVolume === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            lastVolume: -1
          });
        }
        if (typeof xbmc.periodicUpdater.shuffleStatus === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            shuffleStatus: false
          });
        }
        if (typeof xbmc.periodicUpdater.currentlyPlayingFile === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            currentlyPlayingFile: null
          });
        }
        if (typeof xbmc.periodicUpdater.nextPlayingFile === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            nextPlayingFile: null
          });
        }        
        if (typeof xbmc.periodicUpdater.progress === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            progress: 0
          });
        }
        if (typeof xbmc.periodicUpdater.progressEnd === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            progressEnd: 0
          });
        }
        if (typeof xbmc.periodicUpdater.playerStatus === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            playerStatus: 'stopped'
          });
        }
        //For highlighting current item in playlist
        if (typeof xbmc.periodicUpdater.curPlaylistNum === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            curPlaylistNum: 0
          });
        }
        if (typeof xbmc.periodicUpdater.repeatStatus === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            repeatStatus: 'off'
          });
        }
        if (typeof xbmc.periodicUpdater.muteStatus === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            muteStatus: 'off'
          });
        }
        if (typeof xbmc.$backgroundFanart === 'undefined') {
          xbmc.$backgroundFanart = '';
        }
        if (typeof xbmc.periodicUpdater.subsenabled === 'undefined') {
          xbmc.periodicUpdater.subsenabled = false;
        }
        
        var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
        var showInfoTags = mkf.cookieSettings.get('showTags', 'no')=='yes'? true : false;
        var ui = mkf.cookieSettings.get('ui');
        
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

          if (typeof xbmc.activePlayer === 'undefined') { xbmc.activePlayer = 'none'; }
          if (typeof xbmc.activePlayerid === 'undefined') { xbmc.activePlayerid = -1; }
          if (typeof xbmc.inErrorState === 'undefined') { xbmc.inErrorState = 0; }
          if (typeof xbmc.playerPartyMode === 'undefined') { xbmc.playerPartyMode = false; }

          xbmc.sendCommand(
            '{"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1}',

            function (response) {
              var playerActive = response.result;
              if (xbmc.inErrorState != 0) { xbmc.inErrorState = 0; };
              //need to cover slideshow
              if (playerActive == '') {
                xbmc.activePlayer = 'none';
                xbmc.activePlayerid = -1;
              } else {
                xbmc.activePlayer = playerActive[0].type;
                xbmc.activePlayerid = playerActive[0].playerid;
              }
            },
            
            function(response) {
              activePlayer = 'none'; // ERROR
              xbmc.inErrorState ++;
              console.log(xbmc.inErrorState);
              if (xbmc.inErrorState == 5) {
                $('body').empty();
                mkf.dialog.show({content:'<h1>' + mkf.lang.get('XBMC has quit. You can close this window.') + '</h1>', closeButton: false});
                xbmc.setHasQuit();
              };
            },

            null, true // IS async // not async
          );

          // has volume changed? Or first start?
            xbmc.sendCommand(
              '{"jsonrpc": "2.0", "method": "Application.GetProperties", "params": { "properties": [ "volume", "muted" ] }, "id": 1}',

              function (response) {
                var volume = response.result.volume;
                var muted = response.result.muted;
                if (volume != xbmc.periodicUpdater.lastVolume) {
                  xbmc.periodicUpdater.lastVolume = volume;
                    $.each(xbmc.periodicUpdater.volumeChangedListener, function(i, listener)  {
                  listener(volume);
                  });
                };
                if (muted != xbmc.periodicUpdater.muteStatus) {
                  xbmc.periodicUpdater.muteStatus = muted;
                  if (muted) {
                    xbmc.periodicUpdater.firePlayerStatusChanged('muteOn');
                  } else {
                    xbmc.periodicUpdater.firePlayerStatusChanged('muteOff');
                  };
                };
              },

              null, true // IS async // not async
            );
          //}

          // playing state
          // We reached the end my friend... (of the playlist)
          if ( xbmc.periodicUpdater.playerStatus != 'stopped' && xbmc.activePlayer == 'none') {
            xbmc.periodicUpdater.playerStatus = 'stopped';
            if ( xbmc.$backgroundFanart != '' && useFanart ) {
              xbmc.$backgroundFanart = '';
              //if ( ui == 'default') {
                //$('#main').css('background-image', 'url("")');
              //} else if ( ui == 'uni' ) {
                $('#background').css('background-image', 'url("")');
              //} else {
                //$('#content').css('background-image', 'url("")');
              //}
            };
            $('#streamdets .vFormat').removeClass().addClass('vFormat');
            $('#streamdets .aspect').removeClass().addClass('aspect');
            $('#streamdets .channels').removeClass().addClass('channels');
            $('#streamdets .vCodec').removeClass().addClass('vCodec');
            $('#streamdets .aCodec').removeClass().addClass('aCodec');
            $('#streamdets .vSubtitles').css('display', 'none');
            $('#content #displayoverlay #artwork .artThumb').css('margin-right','0px');
            $('#displayoverlay').css('width','510px');
            $('#content #displayoverlay #artwork .discThumb').hide();
            
            if (typeof(spinCDArt) != 'undefined') { clearInterval(spinCDArt) };
            
            
            xbmc.periodicUpdater.firePlayerStatusChanged('stopped');
          }

          if (xbmc.activePlayer != 'none') {
            var request = '';

            if (xbmc.activePlayer == 'audio' || xbmc.activePlayer == 'video' ) {
              request = '{"jsonrpc":"2.0","id":2,"method":"Player.GetProperties","params":{ "playerid":' + xbmc.activePlayerid + ',"properties":["speed", "shuffled", "repeat", "subtitleenabled", "time", "totaltime", "position", "currentaudiostream", "partymode" ] } }'

            };

            xbmc.sendCommand(
              request,

              function (response) {
                var currentPlayer = response.result;
                //var currentTimes = response.result;
                var curtime = 0;
                var curruntime = 0;
                var curPlayItemNum = currentPlayer.position;
                xbmc.playerPartyMode = currentPlayer.partymode;
                
                //Get the number of the currently playing item in the playlist
                if (xbmc.periodicUpdater.curPlaylistNum != curPlayItemNum) {
                  //Change highlights rather than reload playlist
                  if (xbmc.activePlayer == 'audio') {
                    $("div.folderLinkWrapper a.playlistItemCur").removeClass("playlistItemCur");
                    $(".apli"+curPlayItemNum).addClass("playlistItemCur");
                    xbmc.periodicUpdater.curPlaylistNum = curPlayItemNum;
                    //awxUI.onMusicPlaylistShow();
                  } else if (xbmc.activePlayer == 'video') {
                    $("#vpli"+xbmc.periodicUpdater.curPlaylistNum).attr("class","playlistItem");
                    $("#vpli"+curPlayItemNum).attr("class","playlistItemCur");
                    xbmc.periodicUpdater.curPlaylistNum = curPlayItemNum;
                    //awxUI.onVideoPlaylistShow();
                  }
                    
                }

                curtime = (currentPlayer.time.hours * 3600) + (currentPlayer.time.minutes * 60) + currentPlayer.time.seconds; //time in secs
                curruntime = (currentPlayer.totaltime.hours * 3600) + (currentPlayer.totaltime.minutes * 60) + currentPlayer.totaltime.seconds;
                
                //console.log('drift: ' + (curtime - xbmc.periodicUpdater.progress));
                xbmc.periodicUpdater.progress = curtime +1;
                xbmc.periodicUpdater.progressEnd = curruntime;
                xbmc.periodicUpdater.fireProgressChanged({"time": curtime, total: curruntime});
                
                if (currentPlayer.speed != 0 && currentPlayer.speed != 1 ) {
                  // not playing
                  if (xbmc.periodicUpdater.playerStatus != 'stopped') {
                    xbmc.periodicUpdater.playerStatus = 'stopped';
                    xbmc.periodicUpdater.firePlayerStatusChanged('stopped');
                  }

                } else if (currentPlayer.speed == 0 && xbmc.periodicUpdater.playerStatus != 'paused') {
                  xbmc.periodicUpdater.playerStatus = 'paused';
                  xbmc.periodicUpdater.firePlayerStatusChanged('paused');

                } else if (currentPlayer.speed == 1 && xbmc.periodicUpdater.playerStatus != 'playing') {
                  xbmc.periodicUpdater.playerStatus = 'playing';
                  xbmc.periodicUpdater.firePlayerStatusChanged('playing');
                }
                
                //shuffle status changed?
                shuffle = currentPlayer.shuffled;
                if (xbmc.periodicUpdater.shuffleStatus != shuffle) {
                  xbmc.periodicUpdater.shuffleStatus = shuffle;
                  xbmc.periodicUpdater.firePlayerStatusChanged(shuffle? 'shuffleOn': 'shuffleOff');
                }
                
                //repeat off, one, all
                repeat = currentPlayer.repeat;
                if (xbmc.periodicUpdater.repeatStatus != repeat) {
                  xbmc.periodicUpdater.repeatStatus = repeat;
                  xbmc.periodicUpdater.firePlayerStatusChanged(repeat);
                }
                
                //subs enabled
                subs = currentPlayer.subtitleenabled;
                if (xbmc.periodicUpdater.subsenabled != subs) {
                  xbmc.periodicUpdater.subsenabled = subs;
                }

                //Stream info in footer bar. Uni UI only
                if (xbmc.activePlayer == 'audio' && showInfoTags) {
                  var streamdetails = {
                    aCodec: 'Unknown',
                    channels: 0,
                    aStreams: 0,
                    bitrate: 0
                  };
  
                  if (typeof(currentPlayer.currentaudiostream) != 'undefined') {
                    streamdetails.channels = currentPlayer.currentaudiostream.channels;
                    //Set audio icon
                    streamdetails.aCodec = xbmc.getAcodec(currentPlayer.currentaudiostream.codec);
                    
                    $('#streamdets .channels').addClass('channels' + streamdetails.channels);
                    $('#streamdets .aCodec').addClass('aCodec' + streamdetails.aCodec);
                  };
                }
              },

              null, null, true // IS async // not async
            );
          }
            // Get current item
          if (xbmc.activePlayer != 'none') {
            var request = '';

            if (xbmc.activePlayer == 'audio') {
              request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "duration", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 0 }, "id": 1}';

            } else if (xbmc.activePlayer == 'video') {
              request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "season", "episode", "duration", "showtitle", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 1 }, "id": 1}';
            }
          
            // Current file changed?
            xbmc.sendCommand(
              request,

              function (response) {
                var currentItem = response.result.item;
                // $('#content').css('background-image', 'url("' +  + '")')
                
                //PVR reports no file attrib. Copy title to file
                if (currentItem.type == 'channel') { currentItem.file = currentItem.title };
                
                if ( xbmc.$backgroundFanart != xbmc.getThumbUrl(currentItem.fanart) && useFanart ) {
                  xbmc.$backgroundFanart = xbmc.getThumbUrl(currentItem.fanart);
                  //if ( ui == 'default') {
                    //$('#main').css('background-image', 'url("' + xbmc.$backgroundFanart + '")');
                  //} else if ( ui == 'uni' ) {
                    $('#background').css('background-image', 'url("' + xbmc.$backgroundFanart + '")');
                  //} else {
                    //$('#content').css('background-image', 'url("' + xbmc.$backgroundFanart + '")');
                  //}
                };
                if (xbmc.periodicUpdater.currentlyPlayingFile != currentItem.file) {
                  xbmc.periodicUpdater.currentlyPlayingFile = currentItem.file;
                  $.extend(currentItem, {
                    xbmcMediaType: xbmc.activePlayer
                  });
                  //hack for party mode
                  if (xbmc.playerPartyMode) {
                    $.extend(currentItem, {
                      partymode: xbmc.playerPartyMode
                    });
                  };
                  xbmc.periodicUpdater.fireCurrentlyPlayingChanged(currentItem);
                var getNext = function() {
                  xbmc.getNextPlaylistItem({
                    'playlistid': xbmc.activePlayerid,
                    'plCurPos': xbmc.periodicUpdater.curPlaylistNum,
                    onSuccess: function(nextItem) {
                      if (typeof nextItem === 'undefined') {
                        xbmc.periodicUpdater.nextPlayingFile = '';
                        xbmc.periodicUpdater.fireNextPlayingChanged('');
                      } else {
                        if (nextItem.file == xbmc.periodicUpdater.currentlyPlayingFile) { getNext(); return };
                        $.extend(nextItem, {
                          xbmcMediaType: xbmc.activePlayer
                        });
                        xbmc.periodicUpdater.nextPlayingFile = nextItem.file;
                        xbmc.periodicUpdater.fireNextPlayingChanged(nextItem);
                      }
                    },
                    onError: function() {
                      xbmc.periodicUpdater.nextPlayingFile = mkf.lang.get();
                    }
                  });
                };
                getNext();

                  //Footer stream details for video
                  if (xbmc.activePlayer == 'video' && showInfoTags) {

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
                    
                    if (typeof(currentItem.streamdetails) != 'undefined') {
                      if (currentItem.streamdetails != null) {

                        if (currentItem.streamdetails.subtitle) { streamdetails.hasSubs = true };
                        if (currentItem.streamdetails.audio) {
                          streamdetails.channels = currentItem.streamdetails.audio[0].channels;
                          streamdetails.aStreams = currentItem.streamdetails.audio.length;
                        };
                        streamdetails.aspect = xbmc.getAspect(currentItem.streamdetails.video[0].aspect);
                        //Get video standard
                        streamdetails.vFormat = xbmc.getvFormat(currentItem.streamdetails.video[0].width);
                        //Get video codec
                        streamdetails.vCodec = xbmc.getVcodec(currentItem.streamdetails.video[0].codec);
                        //Set audio icon
                        streamdetails.aCodec = xbmc.getAcodec(currentItem.streamdetails.audio[0].codec);
                          
                        $('#streamdets .vFormat').addClass('vFormat' + streamdetails.vFormat);
                        $('#streamdets .aspect').addClass('aspect' + streamdetails.aspect);
                        $('#streamdets .channels').addClass('channels' + streamdetails.channels);
                        $('#streamdets .vCodec').addClass('vCodec' + streamdetails.vCodec);
                        $('#streamdets .aCodec').addClass('aCodec' + streamdetails.aCodec);
                        (streamdetails.hasSubs? $('#streamdets .vSubtitles').css('display', 'block') : $('#streamdets .vSubtitles').css('display', 'none'));
                      };
                    };
                  }
                };
              },

              null, null, true // IS async // not async
            );
          }

        }

        setTimeout($.proxy(this, "periodicStep"), 5000);
      }
    } // END xbmc.periodicUpdater
  }); // END xbmc
  
  $.extend(xbmc, {
    pollTime: function() {

      ++xbmc.periodicUpdater.loopCount;
      
      //if ((xbmc.periodicUpdater.loopCount % 30) == 0 || xbmc.periodicUpdater.loopCount == 1) {
      //Initial time grab and checking for time slip every 10%.
      if (xbmc.periodicUpdater.progressEnd != 0) {
        var proEnd10per = Math.floor((xbmc.periodicUpdater.progressEnd / 100) * 10);
      } else {
        //Lost or haven't retrieved progressEnd
        //console.log('no proEnd');
        var proEnd10per = 30;
      }
      if ((xbmc.periodicUpdater.progress % proEnd10per) == 0 || xbmc.periodicUpdater.loopCount == 1) {
        var curtime = 0;
        var curruntime = 0;
        xbmc.sendCommand(
          //request,
          //'{"jsonrpc":"2.0","id":2,"method":"Player.GetProperties","params":{ "playerid":' + xbmc.activePlayerid + ',"properties":["speed", "shuffled", "repeat", "subtitleenabled", "time", "totaltime", "position", "currentaudiostream"] } }',
          '{"jsonrpc":"2.0","id":"PollGetProp","method":"Player.GetProperties","params":{ "playerid":' + xbmc.activePlayerid + ',"properties":["time", "totaltime"] } }',
          function (response) {
            var currentPlayer = response.result;
            
            curtime = xbmc.timeToSec(currentPlayer.time);
            curruntime = xbmc.timeToSec(currentPlayer.totaltime);
            
            //console.log('drift: ' + (curtime - xbmc.periodicUpdater.progress));
            xbmc.periodicUpdater.progress = curtime +1;
            xbmc.periodicUpdater.progressEnd = curruntime;
            xbmc.periodicUpdater.fireProgressChanged({"time": curtime, total: curruntime});

            //subs enabled
            /*subs = currentPlayer.subtitleenabled;
            if (xbmc.periodicUpdater.subsenabled != subs) {
              xbmc.periodicUpdater.subsenabled = subs;
            }*/
          }
          //null, null, true // IS async // not async
        );
      } else {
      //Internal counting
        if (xbmc.periodicUpdater.progress < xbmc.periodicUpdater.progressEnd ) { xbmc.periodicUpdater.progress++ };
        xbmc.periodicUpdater.fireProgressChanged({"time": xbmc.periodicUpdater.progress, total: xbmc.periodicUpdater.progressEnd});
      }
    },

    pollTimeStart: function() {
      pollTimeRunning = setInterval('xbmc.pollTime()', 1000);
    }
    
  });
  //Web socket
  $.extend(xbmc, {    
    //Use websocket for listening
    wsListener: function() {
        //Stop changed status firering by only setting vars once!
        if (typeof xbmc.periodicUpdater.lastVolume === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            lastVolume: -1
          });
        }
        if (typeof xbmc.periodicUpdater.shuffleStatus === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            shuffleStatus: false
          });
        }
        if (typeof xbmc.periodicUpdater.currentlyPlayingFile === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            currentlyPlayingFile: null
          });
        }
        if (typeof xbmc.periodicUpdater.nextPlayingFile === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            nextPlayingFile: null
          });
        }        
        if (typeof xbmc.periodicUpdater.progress === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            progress: 0
          });
        }
        if (typeof xbmc.periodicUpdater.progressEnd === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            progressEnd: 0
          });
        }
        if (typeof xbmc.periodicUpdater.playerStatus === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            playerStatus: 'stopped'
          });
        }
        //For highlighting current item in playlist
        if (typeof xbmc.periodicUpdater.curPlaylistNum === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            curPlaylistNum: 0
          });
        }
        if (typeof xbmc.periodicUpdater.repeatStatus === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            repeatStatus: 'off'
          });
        }
        if (typeof xbmc.periodicUpdater.muteStatus === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            muteStatus: 'off'
          });
        }
        if (typeof xbmc.$backgroundFanart === 'undefined') {
          xbmc.$backgroundFanart = '';
        }
        if (typeof xbmc.periodicUpdater.subsenabled === 'undefined') {
          xbmc.periodicUpdater.subsenabled = false;
        }
        if (typeof pollTimeRunning === 'undefined') {
          pollTimeRunning = false;
        }
        if (typeof xbmc.OnScanStartedMsgId === 'undefined') {
          xbmc.vidOnScanStartedMsgId = -1;
        }
        if (typeof xbmc.OnScanStartedMsgId === 'undefined') {
          xbmc.audOnScanStartedMsgId = -1;
        }
        if (typeof xbmc.periodicUpdater.loopCount === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            loopCount: 0
          });
        }
        
        
        var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
        var showInfoTags = mkf.cookieSettings.get('showTags', 'no')=='yes'? true : false;
        var ui = mkf.cookieSettings.get('ui');
        
        var wsConn = 'ws://' + location.hostname + ':9090/jsonrpc?awxi';
        //console.log(wsConn);
        ws = new WebSocket(wsConn);
        //console.log(ws);
        ws.onopen = function (e) {
          console.log('socket open');
          
          if (typeof xbmc.activePlayer === 'undefined') { xbmc.activePlayer = 'none'; }
          if (typeof xbmc.activePlayerid === 'undefined') { xbmc.activePlayerid = -1; }
          if (typeof xbmc.inErrorState === 'undefined') { xbmc.inErrorState = 0; }
          if (typeof xbmc.playerPartyMode === 'undefined') { xbmc.playerPartyMode = false; }
          //Wait for window to draw - FF mostly.
          setTimeout(function() {
              //Initial status readings, after rely on notifications.
              xbmc.sendCommand(
                '{"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": "OPAct"}',

                function (response) {
                  var playerActive = response.result;
                  //need to cover slideshow
                  if (playerActive == '') {
                    xbmc.activePlayer = 'none';
                  } else {
                    xbmc.activePlayer = playerActive[0].type;
                    xbmc.activePlayerid = playerActive[0].playerid;
                    

                    if (xbmc.activePlayer != 'none') {
                      xbmc.sendCommand(
                        '{"jsonrpc":"2.0","id":"OPProp","method":"Player.GetProperties","params":{ "playerid":' + xbmc.activePlayerid + ',"properties":["speed", "shuffled", "repeat", "subtitleenabled", "time", "totaltime", "position", "currentaudiostream", "partymode"] } }',

                        function (response) {
                          var currentPlayer = response.result;
                          //If playing (not paused) start time counter
                          if (currentPlayer.speed != 0) { xbmc.pollTimeStart() };
                          var curtime = 0;
                          var curruntime = 0;
                          var curPlayItemNum = currentPlayer.position;
                          xbmc.playerPartyMode = currentPlayer.partymode;
                          
                          //Get the number of the currently playing item in the playlist
                          //if (xbmc.periodicUpdater.curPlaylistNum != curPlayItemNum) {
                            //Change highlights rather than reload playlist <-- is the required as on it's done on playlist draw in ui.views?
                            if (xbmc.activePlayer == 'audio') {
                              xbmc.musicPlaylist.find('a.playlistItemCur').removeClass('playlistItemCur');
                              xbmc.musicPlaylist.find('a.apli' + curPlayItemNum).addClass('playlistItemCur');
                              xbmc.periodicUpdater.curPlaylistNum = curPlayItemNum;
                              //awxUI.onMusicPlaylistShow();
                            } else if (xbmc.activePlayer == 'video') {
                              /*$("#vpli"+xbmc.periodicUpdater.curPlaylistNum).attr("class","playlistItem");
                              $("#vpli"+curPlayItemNum).attr("class","playlistItemCur");*/
                              xbmc.videoPlaylist.find('a.playlistItemCur').removeClass("playlistItemCur");
                              xbmc.videoPlaylist.find('a.vpli' + curPlayItemNum).addClass('playlistItemCur');
                              xbmc.periodicUpdater.curPlaylistNum = curPlayItemNum;
                              //awxUI.onVideoPlaylistShow();
                            }
                              
                          //}
                          
                          curtime = xbmc.timeToSec(currentPlayer.time);
                          curruntime = xbmc.timeToSec(currentPlayer.totaltime);
                          
                          if (xbmc.periodicUpdater.progress != curtime) {
                            xbmc.periodicUpdater.fireProgressChanged({"time": curtime, total: curruntime});
                            xbmc.periodicUpdater.progress = curtime;
                            xbmc.periodicUpdater.progressEnd = curruntime;
                          }
                          if (currentPlayer.speed != 0 && currentPlayer.speed != 1 ) {
                            // not playing
                            if (xbmc.periodicUpdater.playerStatus != 'stopped') {
                              xbmc.periodicUpdater.playerStatus = 'stopped';
                              xbmc.periodicUpdater.firePlayerStatusChanged('stopped');
                            }

                          } else if (currentPlayer.speed == 0 && xbmc.periodicUpdater.playerStatus != 'paused') {
                            xbmc.periodicUpdater.playerStatus = 'paused';
                            xbmc.periodicUpdater.firePlayerStatusChanged('paused');

                          } else if (currentPlayer.speed == 1 && xbmc.periodicUpdater.playerStatus != 'playing') {
                            xbmc.periodicUpdater.playerStatus = 'playing';
                            xbmc.periodicUpdater.firePlayerStatusChanged('playing');
                          }
                          
                          //shuffle status changed?
                          shuffle = currentPlayer.shuffled;
                          if (xbmc.periodicUpdater.shuffleStatus != shuffle) {
                            xbmc.periodicUpdater.shuffleStatus = shuffle;
                            xbmc.periodicUpdater.firePlayerStatusChanged(shuffle? 'shuffleOn': 'shuffleOff');
                          }
                          
                          //repeat off, one, all
                          repeat = currentPlayer.repeat;
                          if (xbmc.periodicUpdater.repeatStatus != repeat) {
                            xbmc.periodicUpdater.repeatStatus = repeat;
                            xbmc.periodicUpdater.firePlayerStatusChanged(repeat);
                          }
                          
                          //subs enabled
                          subs = currentPlayer.subtitleenabled;
                          if (xbmc.periodicUpdater.subsenabled != subs) {
                            xbmc.periodicUpdater.subsenabled = subs;
                          }

                          //Stream info in footer bar. Uni UI only
                          if (xbmc.activePlayer == 'audio' && showInfoTags) {
                            var streamdetails = {
                              aCodec: 'Unknown',
                              channels: 0,
                              aStreams: 0,
                              bitrate: 0
                            };
            
                            if (typeof(currentPlayer.currentaudiostream) != 'undefined') {
                              streamdetails.channels = currentPlayer.currentaudiostream.channels;
                              //Set audio icon
                              streamdetails.aCodec = xbmc.getAcodec(currentPlayer.currentaudiostream.codec);
                              
                              $('#streamdets .channels').addClass('channels' + streamdetails.channels);
                              $('#streamdets .aCodec').addClass('aCodec' + streamdetails.aCodec);
                            };
                          }
                        
                        }
                      );
                      var request = '';

                      if (xbmc.activePlayer == 'audio') {
                        request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "duration", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 0 }, "id": "OPGetItem"}';

                      } else if (xbmc.activePlayer == 'video') {
                        request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "season", "episode", "duration", "showtitle", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 1 }, "id": "OPGetItem"}';
                      }
                    
                      // Current file changed?
                      xbmc.sendCommand(
                        request,

                        function (response) {
                          var currentItem = response.result.item;
                          
                          //PVR reports no file attrib. Copy title to file
                          if (currentItem.type == 'channel') { currentItem.file = currentItem.title };
                          if ( xbmc.$backgroundFanart != xbmc.getThumbUrl(currentItem.fanart) && useFanart ) {
                            xbmc.$backgroundFanart = xbmc.getThumbUrl(currentItem.fanart);
                            //if ( ui == 'default') {
                              //$('#main').css('background-image', 'url("' + xbmc.$backgroundFanart + '")');
                            //} else if ( ui == 'uni' ) {
                              $('#background').css('background-image', 'url("' + xbmc.$backgroundFanart + '")');
                            //} else {
                              //$('#content').css('background-image', 'url("' + xbmc.$backgroundFanart + '")');
                            //}
                          };
                          if (xbmc.periodicUpdater.currentlyPlayingFile != currentItem.file) {
                            xbmc.periodicUpdater.currentlyPlayingFile = currentItem.file;
                            $.extend(currentItem, {
                              xbmcMediaType: xbmc.activePlayer
                            });
                            xbmc.periodicUpdater.fireCurrentlyPlayingChanged(currentItem);
                          //};
                          //if (xbmc.periodicUpdater.nextPlayingFile == currentItem.file) {
                            xbmc.getNextPlaylistItem({
                              'playlistid': xbmc.activePlayerid,
                              onSuccess: function(nextItem) {
                                if (typeof nextItem === 'undefined') {
                                  xbmc.periodicUpdater.nextPlayingFile = '';
                                  xbmc.periodicUpdater.fireNextPlayingChanged('');
                                } else {
                                  
                                  $.extend(nextItem, {
                                    xbmcMediaType: xbmc.activePlayer
                                  });
                                  xbmc.periodicUpdater.nextPlayingFile = nextItem.file;
                                  xbmc.periodicUpdater.fireNextPlayingChanged(nextItem);
                                }
                              },
                              onError: function() {
                                xbmc.periodicUpdater.nextPlayingFile = mkf.lang.get();
                              }
                            });

                            //Footer stream details for video
                            if (xbmc.activePlayer == 'video' && showInfoTags) {

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
                              
                              if (typeof(currentItem.streamdetails) != 'undefined') {
                                if (currentItem.streamdetails != null) {

                                  if (currentItem.streamdetails.subtitle) { streamdetails.hasSubs = true };
                                  if (currentItem.streamdetails.audio) {
                                    streamdetails.channels = currentItem.streamdetails.audio[0].channels;
                                    streamdetails.aStreams = currentItem.streamdetails.audio.length;
                                    //$.each(currentItem.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
                                    //if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('label_not_available') };
                                  };
                                  streamdetails.aspect = xbmc.getAspect(currentItem.streamdetails.video[0].aspect);
                                  //Get video standard
                                  streamdetails.vFormat = xbmc.getvFormat(currentItem.streamdetails.video[0].width);
                                  //Get video codec
                                  streamdetails.vCodec = xbmc.getVcodec(currentItem.streamdetails.video[0].codec);
                                  //Set audio icon
                                  streamdetails.aCodec = xbmc.getAcodec(currentItem.streamdetails.audio[0].codec);
                                    
                                  $('#streamdets .vFormat').addClass('vFormat' + streamdetails.vFormat);
                                  $('#streamdets .aspect').addClass('aspect' + streamdetails.aspect);
                                  $('#streamdets .channels').addClass('channels' + streamdetails.channels);
                                  $('#streamdets .vCodec').addClass('vCodec' + streamdetails.vCodec);
                                  $('#streamdets .aCodec').addClass('aCodec' + streamdetails.aCodec);
                                  (streamdetails.hasSubs? $('#streamdets .vSubtitles').css('display', 'block') : $('#streamdets .vSubtitles').css('display', 'none'));
                                };
                              };
                            }
                          };
                        }
                      );
                    }

                  }
                },
                
                function(response) {
                  xbmc.activePlayer = 'none'; // ERROR
                  xbmc.inErrorState ++;
                  if (xbmc.inErrorState == 5) {
                    $('body').empty();
                    mkf.dialog.show({content:'<h1>' + mkf.lang.get('XBMC has quit. You can close this window.') + '</h1>', closeButton: false});
                    xbmc.setHasQuit();
                  };
                }
              );
              
              xbmc.sendCommand(
                '{"jsonrpc": "2.0", "method": "Application.GetProperties", "params": { "properties": [ "volume", "muted" ] }, "id": "OAppVol"}',

                function (response) {
                  var volume = response.result.volume;
                  var muted = response.result.muted;
                  if (volume != xbmc.periodicUpdater.lastVolume) {
                    xbmc.periodicUpdater.lastVolume = volume;
                      $.each(xbmc.periodicUpdater.volumeChangedListener, function(i, listener)  {
                        listener(volume);
                    });
                  };
                  if (muted != xbmc.periodicUpdater.muteStatus) {
                    xbmc.periodicUpdater.muteStatus = muted;
                    if (muted) {
                      xbmc.periodicUpdater.firePlayerStatusChanged('muteOn');
                    } else {
                      xbmc.periodicUpdater.firePlayerStatusChanged('muteOff');
                    };
                  };
                }
              );
          }, 3000);
          //};
        };
        ws.onerror = function (err) {
          console.log(err);
        };
        ws.onmessage = function (e) {
          //console.log(e.data);
          var JSONRPCnotification = jQuery.parseJSON(e.data);
          console.log(JSONRPCnotification);
          switch (JSONRPCnotification.method) {
          case 'Player.OnPlay':
            xbmc.activePlayerid = JSONRPCnotification.params.data.player.playerid;
            if (xbmc.activePlayerid == 1) {
              xbmc.activePlayer = 'video';
            } else if (xbmc.activePlayerid == 0) {
              xbmc.activePlayer = 'audio';
            }

            //Unset pause
            if (xbmc.periodicUpdater.playerStatus = 'paused') {
              xbmc.periodicUpdater.playerStatus = 'playing';
              xbmc.periodicUpdater.firePlayerStatusChanged('playing');
            }
            
            //Reset counters to avoid "59:59" when waiting for initial times.
            xbmc.periodicUpdater.loopCount = 0;
            xbmc.periodicUpdater.progress = 0;
            xbmc.periodicUpdater.progressEnd = 0;
            //xbmc.periodicUpdater.fireProgressChanged({"time": xbmc.periodicUpdater.progress, total: xbmc.periodicUpdater.progressEnd});
            
            if (pollTimeRunning === false) { xbmc.pollTimeStart() };
            
            //Also activated on item change. Check incase it's slideshow.
            if (xbmc.activePlayer != 'none') {
              var request = '';
              //var curtime = 0;
              //var curruntime = 0;

              if (xbmc.activePlayer == 'audio') {
                request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "duration", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 0 }, "id": "OnPlayGetItem"}';

              } else if (xbmc.activePlayer == 'video') {
                request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "season", "episode", "duration", "showtitle", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 1 }, "id": "OnPlayGetItem"}';
              }
            
              // Current file changed?
              xbmc.sendCommand(
                request,

                function (response) {
                  var currentItem = response.result.item;
                  
                  //PVR reports no file attrib. Copy title to file
                  if (currentItem.type == 'channel') { currentItem.file = currentItem.title };
                  if ( xbmc.$backgroundFanart != xbmc.getThumbUrl(currentItem.fanart) && useFanart ) {
                    xbmc.$backgroundFanart = xbmc.getThumbUrl(currentItem.fanart);
                    //if ( ui == 'default') {
                      //$('#main').css('background-image', 'url("' + xbmc.$backgroundFanart + '")');
                    //} else if ( ui == 'uni' ) {
                      $('#background').css('background-image', 'url("' + xbmc.$backgroundFanart + '")');
                    //} else {
                      //$('#content').css('background-image', 'url("' + xbmc.$backgroundFanart + '")');
                    //}
                  };
                  if (xbmc.periodicUpdater.currentlyPlayingFile != currentItem.file) {
                    xbmc.periodicUpdater.currentlyPlayingFile = currentItem.file;
                    $.extend(currentItem, {
                      xbmcMediaType: xbmc.activePlayer
                    });
                    xbmc.periodicUpdater.fireCurrentlyPlayingChanged(currentItem);
                    xbmc.getNextPlaylistItem({
                      'playlistid': xbmc.activePlayerid,
                      onSuccess: function(nextItem) {
                        if (typeof nextItem === 'undefined') {
                          xbmc.periodicUpdater.nextPlayingFile = '';
                          xbmc.periodicUpdater.fireNextPlayingChanged('');
                        } else {
                          
                          $.extend(nextItem, {
                            xbmcMediaType: xbmc.activePlayer
                          });
                          xbmc.periodicUpdater.nextPlayingFile = nextItem.file;
                          xbmc.periodicUpdater.fireNextPlayingChanged(nextItem);
                        }
                      },
                      onError: function() {
                        xbmc.periodicUpdater.nextPlayingFile = mkf.lang.get();
                      }
                    });

                    //Footer stream details for video
                    if (xbmc.activePlayer == 'video' && showInfoTags) {

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
                      
                      if (typeof(currentItem.streamdetails) != 'undefined') {
                        if (currentItem.streamdetails != null) {

                          if (currentItem.streamdetails.subtitle) { streamdetails.hasSubs = true };
                          if (currentItem.streamdetails.audio) {
                            streamdetails.channels = currentItem.streamdetails.audio[0].channels;
                            streamdetails.aStreams = currentItem.streamdetails.audio.length;
                            //$.each(currentItem.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
                            //if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('label_not_available') };
                          };
                          streamdetails.aspect = xbmc.getAspect(currentItem.streamdetails.video[0].aspect);
                          //Get video standard
                          streamdetails.vFormat = xbmc.getvFormat(currentItem.streamdetails.video[0].width);
                          //Get video codec
                          streamdetails.vCodec = xbmc.getVcodec(currentItem.streamdetails.video[0].codec);
                          //Set audio icon
                          streamdetails.aCodec = xbmc.getAcodec(currentItem.streamdetails.audio[0].codec);
                            
                          $('#streamdets .vFormat').addClass('vFormat' + streamdetails.vFormat);
                          $('#streamdets .aspect').addClass('aspect' + streamdetails.aspect);
                          $('#streamdets .channels').addClass('channels' + streamdetails.channels);
                          $('#streamdets .vCodec').addClass('vCodec' + streamdetails.vCodec);
                          $('#streamdets .aCodec').addClass('aCodec' + streamdetails.aCodec);
                          (streamdetails.hasSubs? $('#streamdets .vSubtitles').css('display', 'block') : $('#streamdets .vSubtitles').css('display', 'none'));
                        };
                      };
                    }
                  };
                }

                //null, null, true // IS async // not async
              );
            };
            
            //Delay to allow currentaudiostream to be retrieved.
            setTimeout (function() {
              if (xbmc.activePlayer != 'none') {
                xbmc.sendCommand(
                  '{"jsonrpc":"2.0","id":"OnPlayGetProp","method":"Player.GetProperties","params":{ "playerid":' + xbmc.activePlayerid + ',"properties":["speed", "shuffled", "repeat", "subtitleenabled", "time", "totaltime", "position", "currentaudiostream"] } }',

                  function (response) {
                    var currentPlayer = response.result;
                    var curPlayItemNum = '';
                    curPlayItemNum = currentPlayer.position;
                    
                    //Get the number of the currently playing item in the playlist
                    if (xbmc.periodicUpdater.curPlaylistNum != curPlayItemNum || curPlayItemNum == 0) {
                      //Change highlights rather than reload playlist
                      if (xbmc.activePlayer == 'audio') {
                        xbmc.musicPlaylist.find('a.playlistItemCur').removeClass("playlistItemCur");
                        xbmc.musicPlaylist.find('a.apli' + curPlayItemNum).addClass('playlistItemCur');
                        xbmc.periodicUpdater.curPlaylistNum = curPlayItemNum;
                      } else if (xbmc.activePlayer == 'video') {
                        xbmc.videoPlaylist.find('a.playlistItemCur').removeClass("playlistItemCur");
                        xbmc.videoPlaylist.find('a.vpli' + curPlayItemNum).addClass('playlistItemCur');
                        xbmc.periodicUpdater.curPlaylistNum = curPlayItemNum;
                      }
                    
                    }

                    //Stream info in footer bar. Uni UI only *Seems this won't work because incorrect details are returned*
                    if (xbmc.activePlayer == 'audio' && showInfoTags) {
                      var streamdetails = {
                        aCodec: 'Unknown',
                        channels: 0,
                        aStreams: 0,
                        bitrate: 0
                      };
      
                      if (typeof(currentPlayer.currentaudiostream) != 'undefined') {
                        streamdetails.channels = currentPlayer.currentaudiostream.channels;
                        //Set audio icon
                        streamdetails.aCodec = xbmc.getAcodec(currentPlayer.currentaudiostream.codec);
                        
                        $('#streamdets .channels').addClass('channels' + streamdetails.channels);
                        $('#streamdets .aCodec').addClass('aCodec' + streamdetails.aCodec);
                      };
                    }
                  },

                  null, null, true // IS async // not async
                );
              };
            }, 2000);

            
          break;
          case 'Player.OnStop':
            clearInterval(pollTimeRunning);
            pollTimeRunning = false;
            xbmc.activePlayerid = -1
            xbmc.activePlayer = 'none';
            
            if ( xbmc.$backgroundFanart != '' && useFanart ) {
              xbmc.$backgroundFanart = '';
              //if ( ui == 'default') {
                //$('#main').css('background-image', 'url("")');
              //} else if ( ui == 'uni' ) {
                $('#background').css('background-image', 'url("")');
              //} else {
                //$('#content').css('background-image', 'url("")');
              //}
            };
            $('#streamdets .vFormat').removeClass().addClass('vFormat');
            $('#streamdets .aspect').removeClass().addClass('aspect');
            $('#streamdets .channels').removeClass().addClass('channels');
            $('#streamdets .vCodec').removeClass().addClass('vCodec');
            $('#streamdets .aCodec').removeClass().addClass('aCodec');
            $('#streamdets .vSubtitles').css('display', 'none');
            
            //reset display overlay
            /*$('#displayoverlay').css('width','625px');
            $('#displayoverlay img.discThumb').hide();
            $('#displayoverlay img.discThumb').css('margin-left','0px');
            $('#displayoverlay img.discThumb').css('width','194px');
            $('#displayoverlay img.discThumb').css('width','194px');*/
            
            xbmc.periodicUpdater.firePlayerStatusChanged('stopped');
          break;
          case 'Player.OnPropertyChanged':
            if (typeof(JSONRPCnotification.params.data.property.shuffled) !== 'undefined') {
              xbmc.periodicUpdater.firePlayerStatusChanged(JSONRPCnotification.params.data.property.shuffled? 'shuffleOn' : 'shuffleOff');
            } else if (typeof(JSONRPCnotification.params.data.property.repeat) !== 'undefined') {
              xbmc.periodicUpdater.firePlayerStatusChanged(JSONRPCnotification.params.data.property.repeat);
            } else if (typeof(JSONRPCnotification.params.data.property.partymode) !== 'undefined') {
              xbmc.playerPartyMode = JSONRPCnotification.params.data.property.partymode;
            }
          break;
          case 'Player.OnPause':
            console.log('paused');
            xbmc.periodicUpdater.playerStatus = 'paused';
            xbmc.periodicUpdater.firePlayerStatusChanged('paused');
            clearInterval(pollTimeRunning);
            pollTimeRunning = false;
          break;
          case 'Player.OnSeek':
            xbmc.periodicUpdater.progress = xbmc.timeToSec(JSONRPCnotification.params.data.player.time);
            xbmc.periodicUpdater.fireProgressChanged({"time": xbmc.periodicUpdater.progress, total: xbmc.periodicUpdater.progressEnd});
          break;
          case 'Player.OnSpeedChanged':
            //Notify footer?
          break;
          case 'Playlist.OnClear':
            //TODO: Remove next
            if (JSONRPCnotification.params.data.playlistid == 0) {
              awxUI.onMusicPlaylistShow();
            } else if (JSONRPCnotification.params.data.playlistid == 1) {
              awxUI.onVideoPlaylistShow();
            }
          break;
          case 'Playlist.OnAdd':
            //TODO: Update next
            if (JSONRPCnotification.params.data.playlistid == 0) {
              awxUI.onMusicPlaylistShow();
            } else if (JSONRPCnotification.params.data.playlistid == 1) {
              awxUI.onVideoPlaylistShow();
            }
          break;
          case 'Application.OnVolumeChanged':
            if (JSONRPCnotification.params.data.volume != xbmc.periodicUpdater.lastVolume) {
                  xbmc.periodicUpdater.lastVolume = JSONRPCnotification.params.data.volume;
                    $.each(xbmc.periodicUpdater.volumeChangedListener, function(i, listener)  {
                  listener(JSONRPCnotification.params.data.volume);
                  });
            } else if (JSONRPCnotification.params.data.muted != xbmc.periodicUpdater.muteStatus) {
              xbmc.periodicUpdater.muteStatus = JSONRPCnotification.params.data.muted;
              if (JSONRPCnotification.params.data.muted) {
                xbmc.periodicUpdater.firePlayerStatusChanged('muteOn');
              } else {
                xbmc.periodicUpdater.firePlayerStatusChanged('muteOff');
              };
            };
          break;
          case 'VideoLibrary.OnScanStarted':
            //Set to messageid so we can clear it on finish.
            xbmc.vidOnScanStartedMsgId = mkf.messageLog.show(mkf.lang.get('Started Video Library Scan', 'Popup message'), mkf.messageLog.status.loading, 0);
          break;
          case 'VideoLibrary.OnScanFinished':
            if (xbmc.vidOnScanStartedMsgId != -1) {
              mkf.messageLog.replaceTextAndHide(xbmc.vidOnScanStartedMsgId, mkf.lang.get('Finished Video Library Scan', 'Popup message'), 2000, mkf.messageLog.status.success);
              //Reset
              xbmc.vidOnScanStartedMsgId = -1;
            } else {
              mkf.messageLog.show(mkf.lang.get('Finished Video Library Scan', 'Popup message'), mkf.messageLog.status.success, 3000);
            };
          break;
          case 'AudioLibrary.OnScanStarted':
            //Set to messageid so we can clear it on finish.
            xbmc.audOnScanStartedMsgId = mkf.messageLog.show(mkf.lang.get('Started Music Library Scan', 'Popup message'), mkf.messageLog.status.loading, 0);
          break;
          case 'AudioLibrary.OnScanFinished':
            if (xbmc.audOnScanStartedMsgId != -1) {
              mkf.messageLog.replaceTextAndHide(xbmc.audOnScanStartedMsgId, mkf.lang.get('Finished Music Library Scan', 'Popup message'), 2000, mkf.messageLog.status.success);
              //Reset
              xbmc.audOnScanStartedMsgId = -1;
            } else {
              mkf.messageLog.show(mkf.lang.get('Finished Music Library Scan', 'Popup message'), mkf.messageLog.status.success, 3000);
            };
            
          break;
          case 'Input.OnInputRequested':
            //Add masking for passwords
            uiviews.InputSendText(JSONRPCnotification.params.data, (JSONRPCnotification.params.data.type == 'password'? true : false));
          break;
          case 'Input.OnInputFinished':
            console.log('Input closed');
            $('div.inputSendText .close').click();
          break;
          case 'System.OnQuit':
            $('body').empty();
            mkf.dialog.show({content:'<h1>' + mkf.lang.get('XBMC has quit. You can close this window.') + '</h1>', closeButton: false});
            xbmc.setHasQuit();
          break;
          }
        };
        ws.onclose = function (e) {
          console.log('socket closed - assume crash/quit');
          //Check to see if XBMC /is/ running
          xbmc.sendCommand(
            '{"jsonrpc": "2.0", "method": "JSONRPC.Ping",  "id": "WSClosePing"}',

            function (response) {
              if (response.result == 'pong') {
                  //XBMC is running! Change to polling.
                  console.log('XBMC is alive. Switching to polling.');
                  setTimeout($.proxy(xbmc.periodicUpdater, "periodicStep"), 20);
              } else {
                $('body').empty();
                mkf.dialog.show({content:'<h1>' + mkf.lang.get('XBMC has quit. You can close this window.') + '</h1>', closeButton: false});
                xbmc.setHasQuit();
              }
            }
          );

        };

    }
  });
})(jQuery);

