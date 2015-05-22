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

    inputKeys: function(options) {
      var inputKeysOn = function() {
        if (!awxUI.settings.inputKeysActive) {
          awxUI.settings.inputKeysActive = true;
          //Duplicate XBMC key functions
          $(document).on('keydown', function(e) {
            //console.log(e.keyCode)
            if (e.keyCode == 32) { xbmc.control({type: 'play'}); return false; };
            if (e.keyCode == 88) { xbmc.control({type: 'stop'}); return false; };
            if (e.keyCode == 37) { xbmc.input({type: 'Left'}); return false; };
            if (e.keyCode == 39) { xbmc.input({type: 'Right'}); return false; };
            if (e.keyCode == 38) { xbmc.input({type: 'Up'}); return false; };
            if (e.keyCode == 40) { xbmc.input({type: 'Down'}); return false; };
            if (e.keyCode == 13) { xbmc.input({type: 'Select'}); return false; };
            if (e.keyCode == 73) { xbmc.input({type: 'Info'}); return false; };
            if (e.keyCode == 67) { xbmc.input({type: 'ContextMenu'}); return false; };
            if (e.keyCode == 8) { xbmc.input({type: 'Back'}); return false; };
            if (e.keyCode == 36) { xbmc.input({type: 'Home'}); return false; };
            if (e.keyCode == 109 || e.keyCode == 189) { xbmc.setVolumeInc({volume: 'decrement'}); return false; };
            if (e.keyCode == 107 || e.keyCode == 187) { xbmc.setVolumeInc({volume: 'increment'}); return false; };
            if (e.keyCode == 70) { xbmc.controlSpeed({type: 'increment'}); return false; };
            if (e.keyCode == 82) { xbmc.controlSpeed({type: 'decrement'}); return false; };
            if (e.keyCode == 76) { xbmc.setSubtitles({command: 'next'}); return false; };
            if (e.keyCode == 84) { xbmc.setSubtitles({command: (xbmc.periodicUpdater.subsenabled? 'off' : 'on')}); return false; };
            if (e.keyCode == 219) { xbmc.executeAction({action: 'bigstepback'}); return false; };
            if (e.keyCode == 221) { xbmc.executeAction({action: 'bigstepforward'}); return false; };
            if (e.keyCode == 65) { xbmc.executeAction({action: 'audiodelay'}); return false; };
            if (e.keyCode == 192) { xbmc.executeAction({action: 'smallstepback'}); return false; };
            if (e.keyCode == 188) { xbmc.executeAction({action: 'skipprevious'}); return false; };
            if (e.keyCode == 190) { xbmc.executeAction({action: 'skipnext'}); return false; };
            if (e.keyCode == 9 || e.keyCode == 27) { xbmc.executeAction({action: 'togglefullscreen'}); return false; };
          });
          $('a.inputcontrols').addClass('active');
          mkf.messageLog.show(mkf.lang.get('Control keys active.', 'Popup message'), mkf.messageLog.status.success, 5000);
        }
      }
      var inputKeysOff = function() {
        awxUI.settings.inputKeysActive = false;
        $(document).off('keydown');
        $('a.inputcontrols').removeClass('active');
        mkf.messageLog.show(mkf.lang.get('Control keys inactive.', 'Popup message'), mkf.messageLog.status.success, 5000);
      }
      
      if (options == 'on') {
        inputKeysOn();
      } else if (options == 'toggle') {
        if (awxUI.settings.inputKeysActive) {
          inputKeysOff();
        } else {
          inputKeysOn();
        }
      } else {
        inputKeysOff();
      };
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

    sqlToEpoch: function(sqlDate) {
      return timestamp = new Date(sqlDate.replace(' ', 'T')).getTime();
    },
    
    sqlToJsDate: function(sqlDate) {
      console.log(sqlDate);
      //sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
      var sqlDateArr1 = sqlDate.split("-");
      //format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
      var sYear = sqlDateArr1[0];
      var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
      var sqlDateArr2 = sqlDateArr1[2].split(" ");
      //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
      var sDay = sqlDateArr2[0];
      var sqlDateArr3 = sqlDateArr2[1].split(":");
      //format of sqlDateArr3[] = ['hh','mm','ss.ms']
      var sHour = sqlDateArr3[0];
      var sMinute = sqlDateArr3[1];
      var sqlDateArr4 = sqlDateArr3[2].split(".");
      //format of sqlDateArr4[] = ['ss','ms']
      var sSecond = sqlDateArr4[0];
      var sMillisecond = sqlDateArr4[1];

      //console.log(sYear+sMonth+sDay+sHour+sMinute+sSecond+sMillisecond);
      return new Date(sYear,sMonth,sDay,sHour,sMinute,sSecond,sMillisecond);
    },

    sqlToDatePlusOffset: function(sqlDate) {
      //console.log(sqlDate);
      var offset = new Date().getTimezoneOffset();
      //sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
      var sqlDateArr1 = sqlDate.split("-");
      //format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
      var sYear = sqlDateArr1[0];
      var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
      var sqlDateArr2 = sqlDateArr1[2].split(" ");
      //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
      var sDay = sqlDateArr2[0];
      var sqlDateArr3 = sqlDateArr2[1].split(":");
      //format of sqlDateArr3[] = ['hh','mm','ss.ms']
      var sHour = sqlDateArr3[0];
      var sMinute = sqlDateArr3[1];
      //var sqlDateArr4 = sqlDateArr3[2].split(".");
      //format of sqlDateArr4[] = ['ss','ms']
      var sSecond = sqlDateArr3[2];

      //console.log(sYear+sMonth+sDay+sHour+sMinute+sSecond);
      var curDate = new Date(sYear,sMonth,sDay,sHour,sMinute,sSecond);
      //console.log(curDate);
      //console.log(new Date(curDate.getTime() + curDate.getTimezoneOffset()*60*1000));
      return new Date(curDate.getTime() + Math.abs(curDate.getTimezoneOffset()*60*1000));
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

    timeToMilliSec: function(time) {
      //Expects time in JSON format: time.hours, time.minutes, time.seconds. 
      return (time.hours * 3600000) + (time.minutes * 60000) + (time.seconds * 1000) + time.milliseconds; //time in millisecs
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
        format: '.png',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      if (settings.path.startsWith('stack://')) {
        settings.path = settings.path.replace(/\\/g, "/").substring(8, settings.path.indexOf(","));
      }
      var path = settings.path.replace(/\\/g, "/").substring(0, settings.path.lastIndexOf("/"));

      path += '/' + settings.type + settings.format;
      
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
    },
    
    clearBackground: function() {
      xbmc.$backgroundFanart = '';
      xbmc.$backgroundFanart2nd = '';

      $('#firstBG').css('background-image', 'url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==)');
      $('#secondBG').css('background-image', 'url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==)');
      $('#firstBG').removeClass('transparent');
    },
    
    getExtraArt: function(options, callbackMain) {
      var settings = {
        path: '',
        type: '', //extrafanart, extrathumbs and ...?
        tvid: -1,
        library: 'song',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      var xart = [];
      var xartFull = [];
      var getxArt = function(xpath, callback) {
        xbmc.getDirectory({
          directory: xpath,
          media: 'files',
          async: true,
          onSuccess: function(result) {
            if (result.files) {
              for (n=0; n<result.files.length; n++) {
                var file = result.files[n];
                if (file.file.split('.').pop().toLowerCase() == 'jpg') { xart.push(file.file) };
                
                if (n == result.files.length-1) {
                  var count = 0;
                  for(i=0; i<xart.length; i++) {
                    var filename = xart[i];
                    xbmc.getPrepDownload({
                      path: filename,
                      async: true,
                      onSuccess: function(full) {
                        count++;
                        xartFull.push((location.protocol + '//' + location.host + '/' + full.details.path));
                        if (count == xart.length) { callback(xartFull) };
                      },
                      onError: function(errorText) {
                        count++;
                        if (count == xart.length && xart.length >0) { console.log('getPrep failed'); console.log(errorText); callback() };
                      },
                    });
                  };
                };
              };
            } else {
              //file: null
              callback('');
            }
          },
          onError: function(errorText) {
            callback('');
          }
        });
      };
      if (settings.path.startsWith('stack://')) {
        settings.path = settings.path.replace(/\\/g, "/").substring(8, settings.path.indexOf(","));
      }
      var path = settings.path.replace(/\\/g, "/").substring(0, settings.path.lastIndexOf("/"));

      if (settings.library == 'song') {
        path = path.substring(0, path.lastIndexOf("/")) + '/' + settings.type;
        getxArt(path, callbackMain);
      } else if (settings.library == 'episode') {
        xbmc.getTvShowInfo({
          tvshowid: settings.tvid,
          onSuccess: function(result) {
            path = result.file + settings.type;
            getxArt(path, callbackMain);
          },
          onError: function(result) {
            console.log(result);
          }
        });
        
      } else if (settings.library == 'musicvideo') {
        callbackMain([]);
      } else {
        path += '/' + settings.type;
        getxArt(path, callbackMain);
      };
      
      
    },
    
    switchFanart: function() {
      var genRnd = function() {
        return Math.floor(Math.random() * xbmc.xart.length);
      }
      var rnd = genRnd();
      
      //More than 2 extra images so random pick.
      if (xbmc.xart.length > 2) {
        if ($('#firstBG').hasClass('transparent')) {
          //Check we aren't swapping to the same image.
          if ('url(' + xbmc.xart[rnd] + ')' != $('#secondBG').css('background-image')) {
            xbmc.$backgroundFanart == xbmc.xart[rnd];
            //Preload image
            $('<img/>').attr('src', xbmc.xart[rnd]).load(function() {
              //Switch image
              $('#firstBG').css('background-image', 'url("' + xbmc.xart[rnd] + '")');
            });
            //$('#firstBG').css('background-image', 'url("' + xbmc.xart[rnd] + '")');
            //Better performance with CSS3 but not available in IE9
            if (BrowserVersion >10) {
              $('#firstBG').toggleClass( 'transparent');
            } else {
              $('#firstBG').toggleClass( 'transparent', 3000, 'easeInCubic');
            };
          } else {
            xbmc.switchFanart();
          };
        } else {
          if ('url(' + xbmc.xart[rnd] + ')' != $('#firstBG').css('background-image')) {
            xbmc.$backgroundFanart2nd == xbmc.xart[rnd];
            $('<img/>').attr('src', xbmc.xart[rnd]).load(function() {
              $('#secondBG').css('background-image', 'url("' + xbmc.xart[rnd] + '")');
            });
            if (BrowserVersion >10) {
              $('#firstBG').toggleClass( 'transparent');
            } else {
              $('#firstBG').toggleClass( 'transparent', 3000, 'easeInCubic');
            };
          } else {
            //Try again.
            xbmc.switchFanart();
          };
        };
      } else if (xbmc.xart.length == 2) {
        //Preload image
        $('<img/>').attr('src', xbmc.xart[1]).load(function() {
          //Switch image
          $('#firstBG').css('background-image', 'url("' + xbmc.xart[1] + '")');
        });
        $('<img/>').attr('src', xbmc.xart[0]).load(function() {
          $('#secondBG').css('background-image', 'url("' + xbmc.xart[0] + '")');
        });
        //$('#firstBG').css('background-image', 'url("' + xbmc.xart[1] + '")');
        //$('#secondBG').css('background-image', 'url("' + xbmc.xart[0] + '")');
        xbmc.$backgroundFanart == xbmc.xart[1];
        xbmc.$backgroundFanart2nd == xbmc.xart[0];
        if (BrowserVersion >10) {
          $('#firstBG').toggleClass( 'transparent');
        } else {
          $('#firstBG').toggleClass( 'transparent', 3000, 'easeInCubic');
        };
      } else {
        return false;
      };
    },
    
    fullScreen: function(max) {
      if (max) {
        if (xbmc.activePlayerid == 1 || xbmc.activePlayerid == 0) {
          xbmc.fullScreen == true;
          //Stop flashing with FF
          $('#background').hide();
          $('div#fullscreen').show();
          $('#firstBG').css('z-index', '51');
          $('#secondBG').css('z-index', '50');
          $('#fullscreen a.minimise').click(function() {
            if (awxUI.settings.actionOnPlay == 3 || awxUI.settings.actionOnPlay == 2) {
              //Cancel auto fullscreen mode
              awxUI.settings.actionOnPlay = 1;
              mkf.messageLog.show(mkf.lang.get('Automatic fullscreen mode cancelled', 'Popup message'), mkf.messageLog.status.success, 5000);
            }
            xbmc.fullScreen(false);
            return false; 
          });
          
          xbmc.nowPlaying(true);
          
          //Show lyrics if required
          if (awxUI.settings.actionOnPlay == 3 && xbmc.lyrics == false) {
            $('#fullscreen a.lyrics').click();
          }
        } else {
          //Not playing
          mkf.messageLog.show(mkf.lang.get('Nothing is playing!', 'Popup message'), mkf.messageLog.status.error, 5000);
        }
      } else {
        xbmc.fullScreen == false;
        $('#background').show();
        $('div#lyricContent').hide();
        $('div#fullscreen').hide();
        $('div#playing').hide();
        $('#firstBG').css('z-index', '4');
        $('#secondBG').css('z-index', '3');
        xbmc.lyrics = false;
        $('#lyrics').empty();
        $('#lyricInfo').empty();
      };
    },
    
    nowPlaying: function(show) {
      if (show && xbmc.fullScreen) {
        $('div#playing').fadeIn(800, function() {
          setTimeout(function() { xbmc.nowPlaying(false) }, 20000);
        });
      } else if (!show && xbmc.fullScreen) {
        //$('div#playing').fadeOut(800);
      };
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
    
    getSettings: function(options) {
      var settings = {
        section: '',
        category: '',
        level: 'expert',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Settings.GetSettings", "params": { "filter": { "section": "' + settings.section + '", "category": "' + settings.category + '"}, "level": "' + settings.level + '" }, "id": "libGetSettingsSections"}',
        function(response) {
          settings.onSuccess(response.result);
        },
        function(response) {
          settings.onError(response.result);
        }
      );
    },
    
    getSettingsSections: function(options) {
      var settings = {
        level: 'expert',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Settings.GetSections", "params": { "level": "' + settings.level + '" }, "id": "libGetSettingsSections"}',
        function(response) {
          settings.onSuccess(response.result);
        },
        function(response) {
          settings.onError(reponse.result);
        }
      );
    },
    
    getSettingsCategories: function(options) {
      var settings = {
        section: '',
        level: 'expert',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Settings.GetCategories", "params": { ' + (settings.section != ''? '"section": "' + settings.section + '"' : '') + ', "level": "' + settings.level + '" }, "id": "libGetSettingsCategories"}',
        function(response) {
          settings.onSuccess(response.result);
        },
        function(response) {
          settings.onError(response.result);
        }
      );
    },
    
    setSettingValue: function(options) {
      var settings = {
        setting: '',
        value: '',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      //Check value is Int and convert if so
      if ((parseFloat(settings.value) == parseInt(settings.value)) && !isNaN(settings.value)) {
        settings.value = parseInt(settings.value);
      }

      if (typeof settings.value == 'object') {
        xbmc.sendCommand(
          '{"jsonrpc": "2.0", "method": "Settings.SetSettingValue", "params": { "setting": "' + settings.setting + '", "value": ' + JSON.stringify(settings.value) + ' }, "id": "libSetSettingValue"}',
          function(response) {
            settings.onSuccess(response.result);
          },
          function(response) {
            settings.onError(response);
          }
        );

      } else {
        xbmc.sendCommand(
          '{"jsonrpc": "2.0", "method": "Settings.SetSettingValue", "params": { "setting": "' + settings.setting + '", "value": ' + (typeof settings.value == 'string'? '"' + settings.value + '"' : settings.value) + ' }, "id": "libSetSettingValue"}',
          function(response) {
            settings.onSuccess(response.result);
          },
          function(response) {
            settings.onError(response);
          }
        );
      }
    },
    
    getProfiles: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Profiles.GetProfiles", "params": {"properties": ["thumbnail", "lockmode"]}, "id": "libGetProfiles"}',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        function(response) {
          settings.onError(mkf.lang.get('Failed to send command!', 'Popup message'));
        }
      );
    },
    
    getCurrentProfile: function(options) {
      var settings = {
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Profiles.GetCurrentProfile", "id": "libGetCurrProfiles"}',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        function(response) {
          settings.onError(mkf.lang.get('Failed to send command!', 'Popup message'));
        }
      );
    },
    
    setLoadProfile: function(options) {
      var settings = {
        name: 'master',
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "Profiles.LoadProfile", "params": { "profile": "' + settings.name + '" }, "id": "libLoadProfile"}',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        function(response) {
          settings.onError(mkf.lang.get('Failed to send command!', 'Popup message'));
        }
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
      for (var i=0; i<settings.bool.length; i++) {
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
    
    getInfoLabels: function(options) {
      var settings = {
        labels: ['System.HasPVR'],
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      var labels = '';
      for (var i=0; i<settings.labels.length; i++) {
        if (i == settings.labels.length -1) {
          labels += '"' + settings.labels[i] + '"';
        } else {
          labels += '"' + settings.labels[i] + '",';
        };
      };
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "XBMC.GetInfoLabels", "params": { "labels": [ ' + labels + ' ] }, "id": "libLabels"}',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        function(response) {
          settings.onError(mkf.lang.get('Failed to send command!', 'Popup message'));
        }
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
        '{"jsonrpc": "2.0", "method": "PVR.GetChannels", "params": { "channelgroupid": ' + settings.channelgroupid + ', "properties": [ "thumbnail", "locked", "hidden", "channel", "lastplayed" ] }, "id": "libGetChannels"}',
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
        '{"jsonrpc": "2.0", "method": "PVR.GetChannelDetails", "params": { "channelid": ' + settings.channelid + ', "properties": [ "thumbnail", "locked", "hidden", "channel", "lastplayed" ] }, "id": "libGetChanDets"}',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        function(response) {
          settings.onError();
        }
      );
    },
    
    pvrGetBroadcasts: function(options) {
      var settings = {
        channelid: -1,
        start: 0,
        end: 100,
        onSuccess: null,
        onError: null
      };
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "PVR.GetBroadcasts", "params": { "channelid": ' + settings.channelid + ', "limits": { "start" : ' + settings.start + ', "end": ' + settings.end + ' }, "properties": [ "title", "plot", "starttime", "endtime", "genre", "runtime", "progress", "progresspercentage" ,"episodename", "episodenum", "episodepart","firstaired", "hastimer", "isactive", "parentalrating","wasactive", "thumbnail" ] }, "id": "libGetBroadcasts"}',
        function(reponse) {
          settings.onSuccess(reponse.result);
        },
        function(response) {
          settings.onError(response);
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
        item: '',
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
            '{"jsonrpc": "2.0", "method": "Player.Seek", "params": {"value": ' + (typeof(settings.percentage) == 'string'? '"' + settings.percentage + '"' : settings.percentage) + ', "playerid": ' + xbmc.activePlayerid + '}, "id": 1}',

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

      if (typeof(acodec) !== 'undefined') { acodec = acodec.toLowerCase() };
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

      settings.sortby = awxUI.settings.albumSort;
      settings.order = awxUI.settings.adesc;

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": { ' + (settings.item == ''? (settings.filter != ''? settings.filter + ', ' : '') : '"filter": { "' + settings.item + '": ' + (settings.itemId !== -1? settings.itemId : '"' + settings.itemStr + '"') + '}, ') + '"limits": { "start" : ' + settings.start + ', "end": ' + settings.end + ' }, "properties": ["playcount", "artist", "genre", "rating", "thumbnail", "year", "mood", "style"], "sort": { "order": "' + settings.order + '", "method": "' + settings.sortby + '", "ignorearticle": true } }, "id": "libAlbums"}',

        function(response) {
          settings.onSuccess(response.result);
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
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbumDetails", "params": { "albumid" : ' + settings.albumid + ', "properties" : ["playcount", "rating", "artist", "thumbnail", "description", "title", "genre", "theme", "mood", "style", "type", "albumlabel", "year", "musicbrainzalbumid", "musicbrainzalbumartistid", "fanart" ] }, "id": "libAlbumDets"}',

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
        '{"jsonrpc":"2.0","id":2,"method":"AudioLibrary.GetRecentlyAddedAlbums","params":{ "properties":["thumbnail","genre","artist","rating"]}}',

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
        '{"jsonrpc":"2.0","id":2,"method":"AudioLibrary.GetRecentlyPlayedAlbums","params":{ "properties":["thumbnail","genre","artist","rating"]}}',

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
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": { ' + (settings.item == ''? (settings.filter != ''? settings.filter + ', ' : '') : '"filter": { "' + settings.item + '": ' + (settings.itemId !== -1? settings.itemId : '"' + settings.itemStr + '"') + '}, ') + '"limits": { "start" : ' + settings.start + ', "end": ' + settings.end + ' }, "properties": [ "artist", "duration", "album", "track" ], "sort": { "order": "' + settings.order + '", "method": "' + settings.sortby + '", "ignorearticle": true } }, "id": "libSongs"}',

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
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetRecentlyAddedSongs", "params": { "properties": [ "artist", "album", "duration", "track" ] }, "id": "libRecentSongs"}',

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
        '{"jsonrpc": "2.0", "method": "AudioLibrary.GetRecentlyPlayedSongs", "params": { "sort": { "method": "lastplayed", "order": "descending" }, "properties": [ "artist", "album", "duration", "track", "lastplayed" ] }, "id": "libRecentSongs"}',

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

      settings.sortby = awxUI.settings.musicVideosSort;
      settings.order = awxUI.settings.musicVideosdesc;

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMusicVideos", "params": { ' + (settings.item == ''? (settings.filter != ''? settings.filter + ', ' : '') : '"filter": { "' + settings.item + '": ' + (settings.itemId !== -1? settings.itemId : '"' + settings.itemStr + '"') + '}, ') + '"properties": [ "title", "thumbnail", "artist", "album", "genre", "lastplayed", "year", "runtime", "fanart", "file", "streamdetails" ], "sort": { "order": "' + settings.order + '", "method": "' + settings.sortby + '", "ignorearticle": true } }, "id": "libMusicVideos"}',

        function(response) {
          settings.onSuccess(response.result);
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
        '{"jsonrpc":"2.0", "id": "libRecentMVs", "method": "VideoLibrary.GetRecentlyAddedMusicVideos","params": { "properties": [ "title", "thumbnail", "artist", "album", "genre", "lastplayed", "year", "runtime", "fanart", "file", "streamdetails" ] } }',

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
          '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": {"item": {"directory": "' + settings.folder.replace(/\\/g, "\\\\") + '"}, "playlistid": 0}, "id": 1}',
          
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
            '{"jsonrpc": "2.0", "method": "Playlist.Add", "params": {"item": {"directory": "' + recurseDir[i].replace(/\\/g, "\\\\") + '"}, "playlistid": 0}, "id": 1}',
            
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
      
      xbmc.playerOpen({
        item: 'file',
        itemStr: settings.file.replace(/\\/g, "\\\\"),
        playlistid: 0,
        onSuccess: settings.onSuccess,
        onError: function(errorText) {
          settings.onError(errorText);
        }
      })
      //Fix: change to use player.open
      /*this.clearAudioPlaylist({
        onSuccess: function() {
          xbmc.addAudioFileToPlaylist({
            file: settings.file,

            onSuccess: function() {
              xbmc.playerOpen({
                position: 0,
                playlistid: 0,
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
      });*/
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
            folder: settings.folder.replace(/\\/g, "\\\\"),

            onSuccess: function() {
              xbmc.playerOpen({
                position: 0,
                item: 'playlistid',
                itemId: 0,
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
          '{"jsonrpc": "2.0", "method": "Player.Open", "params" : { "item" : { "file" : "' + settings.file.replace(/\\/g, "\\\\") + '"}, "options": { "resume": ' + settings.resume + ' } }, "id": 1}',
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
              xbmc.playerOpen({
                position: 0,
                playlistid: 1,
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

      settings.sortby = awxUI.settings.filmSort;
      settings.order = awxUI.settings.mdesc;

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { ' + (settings.item == ''? (settings.filter != ''? settings.filter + ', ' : '') : '"filter": { "' + settings.item + '": ' + (settings.itemId !== -1? settings.itemId : '"' + settings.itemStr + '"') + '}, ') + '"limits": { "start" : ' + settings.start + ', "end": ' + settings.end + ' }, "properties" : ["art", "rating", "thumbnail", "playcount", "file"], "sort": { "order": "' + settings.order +'", "method": "' + settings.sortby + '", "ignorearticle": true } }, "id": "libMovies"}',
        function(response) {
          settings.onSuccess(response.result);
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
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovieDetails", "params": { "movieid": ' + settings.movieid + ', "properties": ["art", "genre", "director", "plot", "title", "tag", "originaltitle", "runtime", "year", "rating", "thumbnail", "playcount", "trailer", "cast", "resume", "file", "tagline", "set", "setid", "lastplayed", "studio", "mpaa", "votes", "streamdetails", "writer", "fanart", "imdbnumber"] },  "id": 2}',
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

      //settings.sortby = awxUI.settings.filmSort;
      //settings.order = awxUI.settings.mdesc;

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovieSets", "params": {"properties": [ "art", "fanart", "playcount", "thumbnail"], "sort": { "order": "ascending", "method": "label", "ignorearticle": true } },"id": "libMovieSets" }',
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

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovieSetDetails", "params": {"setid": ' + settings.setid + ', "properties": [ "art", "fanart", "playcount", "thumbnail" ], "movies": { "properties": [ "art", "rating", "thumbnail", "playcount", "file" ], "sort": { "order": "ascending", "method": "sorttitle" }} },"id": 1 } },"id": 1 }',
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
      
      settings.sortby = awxUI.settings.tvSort;
      settings.order = awxUI.settings.tvdesc;

      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": { ' + (settings.item == ''? (settings.filter != ''? settings.filter + ', ' : '') : '"filter": { "' + settings.item + '": ' + (settings.itemId !== -1? settings.itemId : '"' + settings.itemStr + '"') + '}, ') + '"limits": { "start" : ' + settings.start + ', "end": ' + settings.end + ' }, "properties": ["art", "genre", "plot", "title", "originaltitle", "year", "rating", "thumbnail", "playcount", "file", "fanart"], "sort": { "order": "' + settings.order + '", "method": "' + settings.sortby + '" } }, "id": "libTvShows"}',
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
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShowDetails", "params": { "tvshowid": ' + settings.tvshowid + ', "properties": [ "art", "votes", "premiered", "cast", "tag", "genre", "plot", "title", "originaltitle", "year", "rating", "thumbnail", "playcount", "file", "fanart", "episode"] }, "id": 1}',
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
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetSeasons", "params": { "tvshowid": ' + settings.tvshowid + ', "properties": ["art", "season", "playcount"], "sort": { "method": "label" } }, "id": "libSeasons"}',
        function(response) {
          settings.onSuccess(response.result);
        },
        settings.onError
      );
    },

    getEpisodes: function(options) {
      var settings = {
        item: '',
        itemId: -1,
        filter: '',
        start: 0,
        end: 99999,
        tvshowid: 0,
        season: -1,
        onSuccess: null,
        onError: null
      };
      settings.sortby = awxUI.settings.epSort;
      settings.order = awxUI.settings.epdesc;
      
      //Overide global settings if required.
      $.extend(settings, options);
      
      xbmc.sendCommand(
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": { ' + (settings.item == ''? (settings.filter != ''? settings.filter : '') : (settings.filter != ''? settings.filter + ', ' : '') + '"' + settings.item + '": ' + (settings.itemId != -1? (settings.season != -1? settings.itemId + ', "season": ' + settings.season : settings.itemId) : (settings.season != -1? '"season": ' + settings.season + ', ' + '"' + settings.itemStr + '"' : '"' + settings.itemStr + '"') ) ) + ', "limits": { "start" : ' + settings.start + ', "end": ' + settings.end + ' }, "properties": ["title", "episode", "playcount", "fanart", "plot", "season", "showtitle", "thumbnail", "rating"], "sort": { "order": "' + settings.order + '", "method": "' + settings.sortby + '" } }, "id": "libEps"}',
        function(response) {
          settings.onSuccess(response.result);
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
        '{"jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodeDetails", "params": { "episodeid": ' + settings.episodeid + ', "properties": ["art", "season", "episode", "firstaired", "plot", "title", "runtime", "rating", "thumbnail", "playcount", "file", "fanart", "streamdetails", "resume"] }, "id": 2}',
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
              if (response.result.limits.total > 1 && typeof response.result.items[plCurPos + 1] !== 'undefined') {
                nextItem = response.result.items[plCurPos + 1];
              
              } else {
                //Empty
                nextItem = false;
              }
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
        '{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.GetRecentlyAddedEpisodes","params":{ "properties":["title","runtime","season","episode","showtitle","thumbnail","file","plot","playcount","tvshowid"]}} ',

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
        '{"jsonrpc":"2.0","id":2,"method":"VideoLibrary.GetEpisodes","params":{ "tvshowid": ' + settings.tvshowid + ', "properties":["title","season","playcount","episode","thumbnail","rating","plot"], "sort": { "order": "ascending", "method": "episode" }}}',

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
        '{ "jsonrpc": "2.0", "id": 2, "method": "VideoLibrary.GetRecentlyAddedMovies", "params": { "properties": [ "art", "title", "originaltitle", "runtime", "thumbnail", "file", "year", "plot", "tagline", "playcount", "rating", "genre", "director" ] } }',

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
          properties = '"properties" : ["art", "rating", "thumbnail", "playcount", "file"],';
          settings.sortby = awxUI.settings.filmSort;
          settings.order = awxUI.settings.mdesc;
        break;
        case 'tvshows':
          properties = '"properties": ["art", "genre", "plot", "title", "originaltitle", "year", "rating", "thumbnail", "playcount", "file", "fanart"],';
          settings.sortby = awxUI.settings.tvSort;
          settings.order = awxUI.settings.tvdesc;
        break;
        case 'episodes':
          properties = '"properties": ["episode", "playcount", "fanart", "plot", "season", "showtitle", "thumbnail", "rating"],';
          settings.sortby = awxUI.settings.epSort;
          settings.order = awxUI.settings.epdesc;
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
          settings.sortby = awxUI.settings.albumSort;
          settings.order = awxUI.settings.adesc;
        break;
        case 'songs':
          properties = '"properties": ["artist", "album", "track", "thumbnail", "genre", "year", "lyrics", "albumid", "playcount", "rating", "duration"],';
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
      //currentlyPlayingChangedListener: [],
      //nextPlayingChangedListener: [],
      playerStatusChangedListener: [],
      progressChangedListener: [],
      
      addVolumeChangedListener: function(fn) {
        this.volumeChangedListener.push(fn);
      },

      /*addCurrentlyPlayingChangedListener: function(fn) {
        this.currentlyPlayingChangedListener.push(fn);
      },*/

      /*addNextPlayingChangedListener: function(fn) {
        this.nextPlayingChangedListener.push(fn);
      },*/
      
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

      /*fireCurrentlyPlayingChanged: function(file) {
        $.each(xbmc.periodicUpdater.currentlyPlayingChangedListener, function(i, listener)  {
          listener(file);
        });
      },*/

      /*fireNextPlayingChanged: function(file) {
        $.each(xbmc.periodicUpdater.nextPlayingChangedListener, function(i, listener)  {
          listener(file);
        });
      },*/
      
      fireProgressChanged: function(progress) {
        $.each(xbmc.periodicUpdater.progressChangedListener, function(i, listener)  {
          listener(progress);
        });
      },

      start: function() {
          xbmc.sendCommand(
            '{"jsonrpc": "2.0", "method": "JSONRPC.Version",  "id": 1}',

            function (response) {
              var browserVersion = 999;
              if (navigator.appVersion.indexOf("MSIE") != -1) {
                browserVersion = parseFloat(navigator.appVersion.split("MSIE")[1]);
              }
              if (browserVersion > 9) {
                if ("WebSocket" in window) {
                  xbmc.wsListener();
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
        /*if (typeof xbmc.periodicUpdater.currentlyPlayingFile === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            currentlyPlayingFile: null
          });
        }*/
        /*if (typeof xbmc.periodicUpdater.nextPlayingFile === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            nextPlayingFile: null
          });
        }*/     
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
        if (typeof xbmc.fullScreen === 'undefined') {
          xbmc.fullScreen = false;
        }
        if (typeof xbmc.lyrics === 'undefined') {
          xbmc.lyrics = false;
        }
        if (typeof xbmc.addons === 'undefined') {
          xbmc.addons = [];
          addons.regAddons();
        }
        
        var useFanart = awxUI.settings.useFanart;
        var showInfoTags = awxUI.settings.showTags;
        
        // ---------------------------------
        // ---      Volume Changes       ---
        // ---------------------------------
        // --- Currently Playing Changes ---
        // ---------------------------------
        if ((this.volumeChangedListener &&
          this.volumeChangedListener.length) ||
          (this.playerStatusChangedListener &&
          this.playerStatusChangedListener.length) ||
          (this.progressChangedListener &&
          this.progressChangedListener.length)) {

          if (typeof xbmc.activePlayer === 'undefined') { xbmc.activePlayer = 'none'; }
          if (typeof xbmc.activePlayerid === 'undefined') { xbmc.activePlayerid = -1; }
          if (typeof xbmc.inErrorState === 'undefined') { xbmc.inErrorState = 0; }
          if (typeof xbmc.playerPartyMode === 'undefined') { xbmc.playerPartyMode = false; }
          if (typeof xbmc.activePVR === 'undefined') { xbmc.activePVR = false; }

          xbmc.sendCommand(
            '{"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1}',

            function (response) {
              var playerActive = response.result;
              if (xbmc.inErrorState != 0) { xbmc.inErrorState = 0; };
              //need to cover slideshow
              if (playerActive == '') {
                xbmc.activePlayer = 'none';
                xbmc.activePlayerid = -1;
                xbmc.activePVR = false;
              } else {
                //Playing something
                xbmc.activePlayer = playerActive[0].type;
                xbmc.activePlayerid = playerActive[0].playerid;
                
                //Try this:
                if (pollTimeRunning === false) { xbmc.pollTimeStart() };
                
                //Show controller
                if (awxUI.settings.actionOnPlay == 0 && !awxUI.settings.remoteActive) {
                  awxUI.settings.remoteActive = true;
                  awxUIdisplay.showController(true);
                } else if (awxUI.settings.actionOnPlay == 2 || awxUI.settings.actionOnPlay == 3) {
                  xbmc.fullScreen(true);
                }
                //Turn on input keys if required
                if (awxUI.settings.inputKey == 1 && !awxUI.settings.inputKeysActive) {
                  xbmc.inputKeys('on');
                }
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
            /*if ( xbmc.$backgroundFanart != '' && useFanart ) {
              xbmc.clearBackground();
            };*/

            //Try this:
            clearInterval(pollTimeRunning);
            
            xbmc.activePVR = false;
            //pollTimeRunning = false;
            //xbmc.activePlayerid = -1
            //xbmc.activePlayer = 'none';
            
            xbmc.clearBackground();
            xbmc.fullScreen(false);
            xbmc.lyrics = false;
            xbmc.$backgroundFanart = '';
            
            xbmc.fullScreen(false);
            
            awxUIdisplay.mediaTags(false);
            
            $('#content #displayoverlay #artwork .artThumb').css('margin-right','0px');
            $('#displayoverlay').css('width','510px');
            $('#content #displayoverlay #artwork .discThumb').hide();
            
            if (typeof(spinCDArt) != 'undefined') { clearInterval(spinCDArt) };
            
            //Hide controller if required
            if (awxUI.settings.actionOnPlay == 0 && awxUI.settings.remoteActive) {
              awxUIdisplay.showController(false);
            }
            if (awxUI.settings.inputKeysActive && awxUI.settings.inputKey == 1) {
              xbmc.inputKeys('off');
            }
            
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

                curtime = xbmc.timeToMilliSec(currentPlayer.time);
                curruntime = xbmc.timeToMilliSec(currentPlayer.totaltime);
                
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
                  clearInterval(pollTimeRunning);
                  xbmc.periodicUpdater.playerStatus = 'paused';
                  xbmc.periodicUpdater.firePlayerStatusChanged('paused');

                } else if (currentPlayer.speed == 1 && xbmc.periodicUpdater.playerStatus != 'playing') {
                  if (pollTimeRunning === false) { xbmc.pollTimeStart() };
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
                if (xbmc.activePlayer == 'audio' && awxUI.settings.showTags) {
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
              request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "duration", "thumbnail", "file", "fanart", "streamdetails", "art"], "playerid": 0 }, "id": 1}';

            } else if (xbmc.activePlayer == 'video') {
              request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "season", "episode", "duration", "showtitle", "thumbnail", "file", "fanart", "streamdetails", "tvshowid", "art"], "playerid": 1 }, "id": 1}';
            }
          
            // Current file changed?
            xbmc.sendCommand(
              request,

              function (response) {
                var currentItem = response.result.item;
                // $('#content').css('background-image', 'url("' +  + '")')
                
                //PVR reports no file attrib. Copy title to file
                if (currentItem.type == 'channel') {
                  currentItem.file = currentItem.title;
                  xbmc.activePVR = true;
                } else {
                  xbmc.activePVR = false;
                }
                
                if ( currentItem.fanart != '' && xbmc.$backgroundFanart != xbmc.getThumbUrl(currentItem.fanart) && useFanart && !awxUI.settings.useXtraFanart) {
                  xbmc.$backgroundFanart = xbmc.getThumbUrl(currentItem.fanart);
                  $('#firstBG').css('background-image', 'url(' + xbmc.$backgroundFanart + ')');
                                      //TODO add check if same album don't re-query extra.
                } else if (currentItem.fanart != '' && awxUI.settings.useXtraFanart) {
                  if (xbmc.$backgroundFanart == '') {
                    xbmc.$backgroundFanart = xbmc.getThumbUrl(currentItem.fanart);
                    $('#firstBG').css('background-image', 'url(' + xbmc.$backgroundFanart + ')');
                  };
                  xbmc.getExtraArt({path: currentItem.file, type: 'extrafanart', tvid: currentItem.tvshowid, library: currentItem.type}, function(xart) { xbmc.xart = xart; xbmc.switchFanart() } );
                } else if (useFanart && currentItem.fanart == '') {
                    xbmc.$backgroundFanart = xbmc.getThumbUrl('images/black.gif');
                    $('#firstBG').css('background-image', 'url(' + xbmc.$backgroundFanart + ')');
                };

                if (xbmc.periodicUpdater.currentlyPlayingFile != currentItem.file) {
                  xbmc.periodicUpdater.currentlyPlayingFile = currentItem.file;
                  $.extend(currentItem, {
                    xbmcMediaType: xbmc.activePlayer
                  });
                  if (xbmc.fullScreen) { xbmc.nowPlaying(true); };
                  //hack for party mode
                  if (xbmc.playerPartyMode) {
                    $.extend(currentItem, {
                      partymode: xbmc.playerPartyMode
                    });
                  };
                  xbmc.periodicUpdater.fireCurrentlyPlayingChanged(currentItem);

                awxUIdisplay.currentItem(currentItem);
                awxUIdisplay.nextItem();

                  //Footer stream details for video
                  if (xbmc.activePlayer == 'video' && awxUI.settings.showTags) {

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
                    
                    if (currentItem.streamdetails.video.length != 0) {
                      console.log(currentItem.streamdetails);
                      if (currentItem.streamdetails != null) {

                        if (currentItem.streamdetails.subtitle) { streamdetails.hasSubs = true };
                        if (currentItem.streamdetails.audio.length != 0) {
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
                        
                        //Send for display
                        awxUIdisplay.mediaTags(streamdetails);
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
      
      //Rotate media info and time
      if ((xbmc.periodicUpdater.loopCount % 45) == 0) {
        $('div#playing div#now').slideToggle(800);
        $('div#playing div#nowTime').slideToggle(800);
      }
      
      //Rotate fan art background
      if ((xbmc.periodicUpdater.loopCount % 45) == 0 && xbmc.periodicUpdater.loopCount > 14 && awxUI.settings.useXtraFanart && xbmc.xart.length > 0) {
        xbmc.switchFanart();
      }
      
      //Look for lyric time
      if (xbmc.activePlayer == 'audio' && xbmc.lyrics && $('div#lyrics span.time').filter(function() { return $.text([this]) == '#' + xbmc.periodicUpdater.progress }).length > 0) {
        $('div#lyrics div').removeClass('current');
        $('div#lyrics span.time').filter(function() { return $.text([this]) == '#' + xbmc.periodicUpdater.progress }).parent().addClass('current');
        $('div#lyrics').scrollTo($('.lyricline.current'),500,{"offset": -50});
      }

      //Sync roughly every minute.
      if ((xbmc.periodicUpdater.loopCount % 240) == 0 || xbmc.periodicUpdater.loopCount == 1) {
        var curtime = 0;
        var curruntime = 0;
        xbmc.sendCommand(
          '{"jsonrpc":"2.0","id":"PollGetProp","method":"Player.GetProperties","params":{ "playerid":' + xbmc.activePlayerid + ',"properties":["time", "totaltime"] } }',
          function (response) {
            var currentPlayer = response.result;
            
            curtime = xbmc.timeToMilliSec(currentPlayer.time);
            curruntime = xbmc.timeToMilliSec(currentPlayer.totaltime);
            
            //console.log('drift: ' + (curtime - xbmc.periodicUpdater.progress));
            //console.log('cur: ' + curtime + ' prog: ' + xbmc.periodicUpdater.progress);
            
            xbmc.periodicUpdater.progress = curtime; // +1;
            xbmc.periodicUpdater.progressEnd = curruntime;
            xbmc.periodicUpdater.fireProgressChanged({"time": xbmc.periodicUpdater.progress, total: xbmc.periodicUpdater.progressEnd});
            xbmc.periodicUpdater.oldtime = new Date().getTime() - xbmc.periodicUpdater.startTime;
          }
        );

        //PVR hack. No notification on programme change, only channel change.
        if (xbmc.activePVR) {
          var request = '';

          if (xbmc.activePlayer == 'audio') {
            request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "duration", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 0 }, "id": "OPGetItem"}';

          } else if (xbmc.activePlayer == 'video') {
            request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "season", "episode", "duration", "showtitle", "tvshowid", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 1 }, "id": "OPGetItem"}';
          }
        
          // Current file changed?
          xbmc.sendCommand(
            request,

            function (response) {
              var currentItem = response.result.item;
              
              //PVR reports no file attrib. Copy title to file
              if (currentItem.type == 'channel') { currentItem.file = currentItem.title };
              
              if (xbmc.periodicUpdater.currentlyPlayingFile != currentItem.file) {
                xbmc.periodicUpdater.currentlyPlayingFile = currentItem.file;
                $.extend(currentItem, {
                  xbmcMediaType: xbmc.activePlayer
                });
                xbmc.periodicUpdater.fireCurrentlyPlayingChanged(currentItem);

                //Footer stream details for video
                if (xbmc.activePlayer == 'video' && awxUI.settings.showTags) {

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
                    if (currentItem.streamdetails.video.length != 0) {

                      if (currentItem.streamdetails.subtitle) { streamdetails.hasSubs = true };
                      if (currentItem.streamdetails.audio.length != 0) {
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
                    }
                  }
                }
              }
            }
          );
        }
      } else {
      //Internal counting
        if (xbmc.periodicUpdater.progress < xbmc.periodicUpdater.progressEnd ) {
          
          //Due to time counting problems via setTimeout use system date for time checking
          var time = new Date().getTime() - xbmc.periodicUpdater.startTime;
          var diff = time - xbmc.periodicUpdater.oldtime;
          xbmc.periodicUpdater.progress += diff;

          //if (diff > 750) { console.log('diff: ' + diff); }

          xbmc.periodicUpdater.oldtime = new Date().getTime() - xbmc.periodicUpdater.startTime;
        };
        xbmc.periodicUpdater.fireProgressChanged({"time": xbmc.periodicUpdater.progress, total: xbmc.periodicUpdater.progressEnd});
      }
    },

    pollTimeStart: function() {
      xbmc.periodicUpdater.startTime = new Date().getTime();
      xbmc.periodicUpdater.oldtime = 0;
      pollTimeRunning = setInterval('xbmc.pollTime()', 250);
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
        /*if (typeof xbmc.periodicUpdater.currentlyPlayingFile === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            currentlyPlayingFile: null
          });
        }*/
        /*if (typeof xbmc.periodicUpdater.nextPlayingFile === 'undefined') {
          $.extend(xbmc.periodicUpdater, {
            nextPlayingFile: null
          });
        }     */   
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
        if (typeof xbmc.$backgroundFanart2nd === 'undefined') {
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
        if (typeof xbmc.xart === 'undefined') {
          xbmc.xart = [];
        }
        if (typeof xbmc.fullScreen === 'undefined') {
          xbmc.fullScreen = false;
        }
        if (typeof xbmc.lyrics === 'undefined') {
          xbmc.lyrics = false;
        }
        if (typeof xbmc.addons === 'undefined') {
          xbmc.addons = [];
        }
        
        addons.regAddons();
        
        var useFanart = awxUI.settings.useFanart;
        var showInfoTags = awxUI.settings.showTags;
        if (typeof xbmc.activePlayer === 'undefined') { xbmc.activePlayer = 'none'; }
        if (typeof xbmc.activePlayerid === 'undefined') { xbmc.activePlayerid = -1; }
        if (typeof xbmc.inErrorState === 'undefined') { xbmc.inErrorState = 0; }
        if (typeof xbmc.playerPartyMode === 'undefined') { xbmc.playerPartyMode = false; }
        if (typeof xbmc.activePVR === 'undefined') { xbmc.activePVR = false; }
          
        var WSmessageHandle = mkf.messageLog.show(mkf.lang.get('Attempting to connect to websocket...', 'Popup message with addition'));
        //mkf.messageLog.show(mkf.lang.get('Attempting to connect to websocket...', 'Popup message'), mkf.messageLog.status.error, 10000);
        
        var wsConn = 'ws://' + location.hostname + ':9090/jsonrpc?awxi';
        ws = new WebSocket(wsConn);
        ws.onopen = function (e) {
          mkf.messageLog.appendTextAndHide(WSmessageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          
          
          
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
                      //Show controller
                      if (awxUI.settings.actionOnPlay == 0 && !awxUI.settings.remoteActive) {
                        awxUI.settings.remoteActive = true;
                        awxUIdisplay.showController(true);
                      } else if (awxUI.settings.actionOnPlay == 2 || awxUI.settings.actionOnPlay == 3) {
                        xbmc.fullScreen(true);
                      }
                      //Turn on input keys if required
                      if (awxUI.settings.inputKey == 1 && !awxUI.settings.inputKeysActive) {
                        xbmc.inputKeys('on');
                      }
                      xbmc.sendCommand(
                        '{"jsonrpc":"2.0","id":"OPProp","method":"Player.GetProperties","params":{ "playerid":' + xbmc.activePlayerid + ',"properties":["speed", "shuffled", "repeat", "subtitleenabled", "time", "totaltime", "position", "currentaudiostream", "partymode"] } }',

                        function (response) {
                          var currentPlayer = response.result;
                          //If playing (not paused) start time counter
                          if (currentPlayer.speed != 0) { xbmc.pollTimeStart() };
                          //var curtime = 0;
                          //var curruntime = 0;
                          var curPlayItemNum = currentPlayer.position;
                          xbmc.playerPartyMode = currentPlayer.partymode;
                          
                          //Change highlights rather than reload playlist <-- is the required as on it's done on playlist draw in ui.views?
                          if (xbmc.activePlayer == 'audio') {
                            xbmc.musicPlaylist.find('.playlistItemCur').removeClass('playlistItemCur');
                            xbmc.musicPlaylist.find('.apli' + curPlayItemNum).addClass('playlistItemCur');
                            xbmc.periodicUpdater.curPlaylistNum = curPlayItemNum;
                            //awxUI.onMusicPlaylistShow();
                          } else if (xbmc.activePlayer == 'video') {
                            /*$("#vpli"+xbmc.periodicUpdater.curPlaylistNum).attr("class","playlistItem");
                            $("#vpli"+curPlayItemNum).attr("class","playlistItemCur");*/
                            xbmc.videoPlaylist.find('.playlistItemCur').removeClass("playlistItemCur");
                            xbmc.videoPlaylist.find('.vpli' + curPlayItemNum).addClass('playlistItemCur');
                            xbmc.periodicUpdater.curPlaylistNum = curPlayItemNum;
                            //awxUI.onVideoPlaylistShow();
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
                        request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "season", "episode", "duration", "showtitle", "tvshowid", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 1 }, "id": "OPGetItem"}';
                      }
                    
                      // Current file changed?
                      xbmc.sendCommand(
                        request,

                        function (response) {
                          var currentItem = response.result.item;
                          
                          //PVR reports no file attrib. Copy title to file
                          if (currentItem.type == 'channel') {
                            currentItem.file = currentItem.title;
                            xbmc.activePVR = true;
                          } else {
                            xbmc.activePVR = false;
                          }
                          
                          xbmc.getExtraArt({path: currentItem.file, type: 'extrafanart', library: currentItem.type, tvid: currentItem.tvshowid}, function(xart) { xbmc.xart = xart } );
                          
                          if ( xbmc.$backgroundFanart != xbmc.getThumbUrl(currentItem.fanart) && useFanart && currentItem.fanart != '' ) {
                            xbmc.$backgroundFanart = xbmc.getThumbUrl(currentItem.fanart);
                            $('#firstBG').css('background-image', 'url(' + xbmc.$backgroundFanart + ')');
                          } else if (useFanart && currentItem.fanart == '') {
                            xbmc.$backgroundFanart = xbmc.getThumbUrl('images/black.gif');
                            $('#firstBG').css('background-image', 'url(' + xbmc.$backgroundFanart + ')');
                          };
                          
                          if (xbmc.periodicUpdater.currentlyPlayingFile != currentItem.file) {
                            xbmc.periodicUpdater.currentlyPlayingFile = currentItem.file;
                            $.extend(currentItem, {
                              xbmcMediaType: xbmc.activePlayer
                            });
                            //xbmc.periodicUpdater.fireCurrentlyPlayingChanged(currentItem);
                            awxUIdisplay.currentItem(currentItem);

                            awxUIdisplay.nextItem();

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
                                if (currentItem.streamdetails.video.length != 0) {

                                  if (currentItem.streamdetails.subtitle) { streamdetails.hasSubs = true };
                                  if (currentItem.streamdetails.audio.length != 0) {
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
                                  
                                  //Send for display
                                  awxUIdisplay.mediaTags(streamdetails);
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
            }, 1000);
        };
        ws.onerror = function (err) {
          //onerror and onclose both fired. Use only one to avoid error counting issues. No way to tell the difference between refused and closed?
          console.log(err);
        };
        ws.onmessage = function (e) {
          var JSONRPCnotification = jQuery.parseJSON(e.data);
          //console.log(JSONRPCnotification);
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
            
            if (pollTimeRunning === false) { xbmc.pollTimeStart() };
            
            //Show controller
            if (awxUI.settings.actionOnPlay == 0 && !awxUI.settings.remoteActive) {
              awxUI.settings.remoteActive = true;
              awxUIdisplay.showController(true);
            } else if (awxUI.settings.actionOnPlay == 2 || awxUI.settings.actionOnPlay == 3) {
              xbmc.fullScreen(true);
            }
            
            //Turn on input keys if required
            if (awxUI.settings.inputKey == 1 && !awxUI.settings.inputKeysActive) {
              xbmc.inputKeys('on');
            }
              
            //Add detail as getting previous lyrics
            if (xbmc.lyrics) { setTimeout(function() { 
              addons.culrcLyrics();
              $('div#lyrics').scrollTo('0px',500);
            }, 1000) };
            
            //Also activated on item change. Check incase it's slideshow.
            if (xbmc.activePlayer != 'none') {
              var request = '';
              if (xbmc.fullScreen) { xbmc.nowPlaying(true); };

              if (xbmc.activePlayer == 'audio') {
                request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["art", "title", "album", "artist", "duration", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 0 }, "id": "OnPlayGetItem"}';

              } else if (xbmc.activePlayer == 'video') {
                request = '{"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["art", "title", "album", "artist", "season", "episode", "duration", "showtitle", "tvshowid", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 1 }, "id": "OnPlayGetItem"}';
              }
            
              //Delay slightly to allow stream details to populate
              setTimeout(function() {
                // Current file changed?
                xbmc.sendCommand(
                  request,

                  function (response) {
                    var currentItem = response.result.item;
                    
                    //PVR reports no file attrib. Copy title to file
                    if (currentItem.type == 'channel') {
                      currentItem.file = currentItem.title;
                      xbmc.activePVR = true;
                    } else {
                      xbmc.activePVR = false;
                    }
                    
                    if ( currentItem.fanart != '' && xbmc.$backgroundFanart != xbmc.getThumbUrl(currentItem.fanart) && useFanart && !awxUI.settings.useXtraFanart) {
                      xbmc.$backgroundFanart = xbmc.getThumbUrl(currentItem.fanart);
                      $('#firstBG').removeClass('transparent');
                      $('#firstBG').css('background-image', 'url(' + xbmc.$backgroundFanart + ')');
                                          //TODO add check if same album don't re-query extra.
                    } else if (awxUI.settings.useXtraFanart) {
                      xbmc.getExtraArt({path: currentItem.file, type: 'extrafanart', tvid: currentItem.tvshowid, library: currentItem.type}, function(xart) {
                        if (xart) {
                          xbmc.xart = xart;
                          $('#firstBG').removeClass('transparent');
                          $('#firstBG').css('background-image', 'url(' + xart[0] + ')');
                          xbmc.$backgroundFanart = xart[0];
                          //xbmc.switchFanart();
                        } else {
                          //No fan xtra art found.
                          xbmc.xart = [];
                          if (currentItem.fanart != '') {
                            //Use normal fanart
                            $('#firstBG').removeClass('transparent');
                            xbmc.$backgroundFanart = xbmc.getThumbUrl(currentItem.fanart);
                            $('#firstBG').css('background-image', 'url(' + xbmc.$backgroundFanart + ')');
                          } else {
                            //No fan art at all, set a 1x1px transparent base64 gif.
                            $('#firstBG').css('background-image', 'images/black.gif');
                            $('#secondBG').css('background-image', 'url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==)');
                            $('#firstBG').removeClass('transparent');
                            xbmc.$backgroundFanart = xbmc.getThumbUrl('images/black.gif');
                          }
                        }
                      });
                    };
                    
                    if (xbmc.periodicUpdater.currentlyPlayingFile != currentItem.file) {
                      xbmc.periodicUpdater.currentlyPlayingFile = currentItem.file;
                      $.extend(currentItem, {
                        xbmcMediaType: xbmc.activePlayer
                      });
                      //xbmc.periodicUpdater.fireCurrentlyPlayingChanged(currentItem);
                      awxUIdisplay.currentItem(currentItem);
                      awxUIdisplay.nextItem();
                      
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
                        
                        if (currentItem.streamdetails != null && currentItem.streamdetails.video != 'undefined') {
                          if (currentItem.streamdetails.video.length != 0) {
                            if (currentItem.streamdetails.subtitle) { streamdetails.hasSubs = true };
                            if (currentItem.streamdetails.audio.length != 0) {
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
                            //Send for display
                            awxUIdisplay.mediaTags(streamdetails);
                          };
                        };
                      }
                    };
                  }

                  //null, null, true // IS async // not async
                );
              }, 750);
            };
            
            //Delay to allow currentaudiostream to be retrieved.
            setTimeout(function() {
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
                        xbmc.musicPlaylist.find('.playlistItemCur').removeClass("playlistItemCur");
                        xbmc.musicPlaylist.find('.apli' + curPlayItemNum).addClass('playlistItemCur');
                        xbmc.periodicUpdater.curPlaylistNum = curPlayItemNum;
                      } else if (xbmc.activePlayer == 'video') {
                        xbmc.videoPlaylist.find('.playlistItemCur').removeClass("playlistItemCur");
                        xbmc.videoPlaylist.find('.vpli' + curPlayItemNum).addClass('playlistItemCur');
                        xbmc.periodicUpdater.curPlaylistNum = curPlayItemNum;
                      }
                    
                    }

                    //Stream info in footer bar. Uni UI only *Seems this won't work because incorrect details are returned*
                    /*if (xbmc.activePlayer == 'audio' && showInfoTags) {
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
                    }*/
                  },

                  null, null, true // IS async // not async
                );
              };
            }, 750);

            
          break;
          case 'Player.OnStop':
            clearInterval(pollTimeRunning);
            xbmc.activePVR = false;
            pollTimeRunning = false;
            xbmc.activePlayerid = -1
            xbmc.activePlayer = 'none';
            
            xbmc.clearBackground();
            xbmc.fullScreen(false);
            xbmc.lyrics = false;
            xbmc.$backgroundFanart = '';

            //Hide controller if required
            if (awxUI.settings.actionOnPlay == 0 && awxUI.settings.remoteActive) {
              awxUIdisplay.showController(false);
            }
            if (awxUI.settings.inputKeysActive && awxUI.settings.inputKey == 1) {
              xbmc.inputKeys('off');
            }
              
            awxUIdisplay.mediaTags(false);
            awxUI.settings.remoteActive = false;
            
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
            xbmc.periodicUpdater.playerStatus = 'paused';
            xbmc.periodicUpdater.firePlayerStatusChanged('paused');
            clearInterval(pollTimeRunning);
            pollTimeRunning = false;
          break;
          case 'Player.OnSeek':
            xbmc.periodicUpdater.progress = xbmc.timeToMilliSec(JSONRPCnotification.params.data.player.time);
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
            if (JSONRPCnotification.params.data.playlistid == 0) {
              awxUI.onMusicPlaylistShow();
            } else if (JSONRPCnotification.params.data.playlistid == 1) {
              awxUI.onVideoPlaylistShow();
            }
            if (xbmc.activePlayerid != -1) {
              awxUIdisplay.nextItem();
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
            //Clear recent
            awxUI.$musicVideosRecentContent.empty();
            awxUI.$tvShowsRecentlyAddedContent.empty();
            awxUI.$moviesRecentContent.empty();
            awxUI.onTvShowsRecentlyAddedShow();
            awxUI.onMoviesRecentShow();
            awxUI.onMusicVideosRecentlyAddedShow();
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
          case 'VideoLibrary.OnCleanStarted':
            //Set to messageid so we can clear it on finish.
            xbmc.vidOnCleanStartedMsgId = mkf.messageLog.show(mkf.lang.get('Started Video Library Clean', 'Popup message'), mkf.messageLog.status.loading, 0);
          break;
          case 'VideoLibrary.OnCleanFinished':
            if (xbmc.vidOnCleanStartedMsgId != -1) {
              mkf.messageLog.replaceTextAndHide(xbmc.vidOnCleanStartedMsgId, mkf.lang.get('Finished Video Library Clean', 'Popup message'), 2000, mkf.messageLog.status.success);
              //Reset
              xbmc.vidOnCleanStartedMsgId = -1;
            } else {
              mkf.messageLog.show(mkf.lang.get('Finished Video Library Clean', 'Popup message'), mkf.messageLog.status.success, 3000);
            };
          break;
          case 'VideoLibrary.OnUpdate':
            console.log(JSONRPCnotification.params.data);
          break;
          case 'AudioLibrary.OnCleanStarted':
            //Set to messageid so we can clear it on finish.
            xbmc.audOnCleanStartedMsgId = mkf.messageLog.show(mkf.lang.get('Started Music Library Clean', 'Popup message'), mkf.messageLog.status.loading, 0);
          break;
          case 'AudioLibrary.OnCleanFinished':
            if (xbmc.audOnCleanStartedMsgId != -1) {
              mkf.messageLog.replaceTextAndHide(xbmc.audOnCleanStartedMsgId, mkf.lang.get('Finished Music Library Clean', 'Popup message'), 2000, mkf.messageLog.status.success);
              //Reset
              xbmc.audOnCleanStartedMsgId = -1;
            } else {
              mkf.messageLog.show(mkf.lang.get('Finished Music Library Clean', 'Popup message'), mkf.messageLog.status.success, 3000);
            };
          break;
          case 'Input.OnInputRequested':
            console.log(JSONRPCnotification.params.data);
            //Add masking for passwords
            uiviews.InputSendText(JSONRPCnotification.params.data, (JSONRPCnotification.params.data.type == 'password'? true : false));
          break;
          case 'Input.OnInputFinished':
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
          xbmc.inErrorState++;
          setTimeout(function() {
            mkf.messageLog.appendTextAndHide(WSmessageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 2000, mkf.messageLog.status.error);
            
            //Check to see if XBMC /is/ running
            xbmc.sendCommand(
              '{"jsonrpc": "2.0", "method": "JSONRPC.Ping",  "id": "WSClosePing"}',
              function (response) {
                if (response.result == 'pong') {
                  //XBMC is responding. Relaunch websocket
                  if (xbmc.inErrorState < 4) {
                    console.log('ws.close retrying... ' + xbmc.inErrorState);
                    mkf.messageLog.show(mkf.lang.get('Failed to connect to websocket, retrying...', 'Popup message'), mkf.messageLog.status.error, 5000);
                    xbmc.wsListener();
                  } else {
                    //Cannot open websocket, switch to polling
                    console.log('Failed to open websocket after ' + xbmc.inErrorState + ' attempts, switching to polling');
                    mkf.messageLog.show(mkf.lang.get('Failed to connect to websocket, switching to polling...', 'Popup message'), mkf.messageLog.status.error, 8000);
                    setTimeout($.proxy(xbmc.periodicUpdater, "periodicStep"), 20);
                  }
                } else {
                  $('body').empty();
                  mkf.dialog.show({content:'<h1>' + mkf.lang.get('XBMC has quit. You can close this window.') + '</h1>', closeButton: false});
                  xbmc.setHasQuit();
                }
              }
            );
          }, 2000);
        };

    }
  });
})(jQuery);

