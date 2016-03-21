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
 
/*-----------------------------------------*/
/* Display functions, changing *visibles*  */
/*-----------------------------------------*/

var awxUIdisplay = {};

(function($) {
  $.extend(awxUIdisplay, {
    //Change display span class timePlayed, timeRemain and timeTotal
    //Time in milliseconds
    timeKeeping: function(currentTime, totalTime) {
      //Check times are valid
      if ((parseFloat(currentTime) == parseInt(currentTime)) && !isNaN(currentTime)) {
        $('.timePlayed').text(xbmc.formatTime(Math.floor(currentTime / 1000)));
      } else {
        currentTime = 0;
        $('.timePlayed').text('00:00');
      }
      if ((parseFloat(totalTime) == parseInt(totalTime)) && !isNaN(totalTime)) {
        $('.timeTotal').text(xbmc.formatTime(Math.floor(totalTime / 1000)));
      } else {
        totalTime = 0;
        $('.timeTotal').text('00:00');
      }
      $('.timeRemain').text(xbmc.formatTime(Math.floor((totalTime - currentTime) / 1000)));
    },
    //Change display class: title, artist, album, track etc.
    mediaInfo: function(info) {
    
    },
    //Volume percent
    volumeChange: function(volume) {
    
    },
    //Media tags
    mediaTags: function(tags) {
      if (!tags) {
        //Hide tags
        $('#streamdets .vFormat').removeAttr('class').addClass('vFormat');
        $('#streamdets .aspect').removeAttr('class').addClass('aspect');
        $('#streamdets .channels').removeAttr('class').addClass('channels');
        $('#streamdets .vCodec').removeAttr('class').addClass('vCodec');
        $('#streamdets .aCodec').removeAttr('class').addClass('aCodec');
        $('#streamdets .vSubtitles').css('display', 'none');
      } else {
        var infoTags = {
          vFormat: 'SD',
          vCodec: 'Unknown',
          aCodec: 'Unknown',
          channels: 0,
          aStreams: 0,
          hasSubs: false,
          aLang: '',
          aspect: 0,
          vwidth: 0
        }
        
        $.extend(infoTags, tags);
        
        $('#streamdets .vFormat').addClass('vFormat' + infoTags.vFormat);
        $('#streamdets .aspect').addClass('aspect' + infoTags.aspect);
        $('#streamdets .channels').addClass('channels' + infoTags.channels);
        $('#streamdets .vCodec').addClass('vCodec' + infoTags.vCodec);
        $('#streamdets .aCodec').addClass('aCodec' + infoTags.aCodec);
        (infoTags.hasSubs? $('#streamdets .vSubtitles').css('display', 'block') : $('#streamdets .vSubtitles').css('display', 'none'));
      }
    },
    //Show the controller controls
    showController: function(show) {
      if (show) {
        $('#displayoverlayleft').show();
        $('#displayoverlaytop').show();
        $('#displayoverlaybot').show();
        $('#content').addClass('controls');
        $('#artwork').show().fadeOut(8000);
      } else {
        $('#displayoverlayleft').hide();
        $('#displayoverlaytop').hide();
        $('#displayoverlaybot').hide();
        $('#content').removeClass('controls');
        $('#artwork').hide();
      }
    },
    //Current item
    currentItem: function(currentFile) {
      var rotateCDart = awxUI.settings.rotateCDart;
      
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
      //var nextElement = $footerNowBox.find('span.nextTitle');
      //var timeCurRemain = $footerStatusBox.find('span.timeRemain');
      //var timeCurRemainTotal = $footerStatusBox.find('span.timeTotal');
      //var sliderElement = $('.playingSliderWrapper .playingSlider');
    
      // ALL: AUDIO, VIDEO, PICTURE
      if (currentFile.title && currentFile.title != '') { titleElement=currentFile.title; } else { titleElement = (currentFile.label? currentFile.label : mkf.lang.get('N/A', 'Label')) ; }

      if (currentFile.xbmcMediaType == 'audio') {
        // AUDIO
        if (currentFile.type == 'channel') {
          //label = channel, title = program name
          if (currentFile.title) { titleElement = currentFile.title; } else { titleElement = mkf.lang.get('N/A', 'Label'); }
          if (currentFile.label) { channelElement = currentFile.label; } else { channelElement = mkf.lang.get('N/A', 'Label'); }
          
          nowLabelElement.text(titleElement);
          nowElement.text(' - ' + channelElement);
        } else {
          if (currentFile.artist) { artistElement = currentFile.artist; } else { artistElement = mkf.lang.get('N/A', 'Label'); }
          if (currentFile.album) { albumElement = currentFile.album; } else { albumElement = mkf.lang.get('N/A', 'Label'); }
          
          //If in partymode refresh the playlist on item change.
          if (currentFile.partymode) {
            awxUI.onMusicPlaylistShow();
          };
          nowLabelElement.text(titleElement);
          nowArtistElement.text(artistElement);
          seperator.text(' - ');
          nowElement.text(' - ' + albumElement);
        };
      } else if (currentFile.xbmcMediaType == 'video') {
        // VIDEO

        if (currentFile.type == 'episode') {

          tvshowElement = currentFile.showtitle;
          seasonElement = currentFile.season;
          episodeElement = currentFile.episode;
          seperator.text(' - ');
          
          nowLabelElement.text(titleElement);
          nowElement.text(tvshowElement + ' - S' + seasonElement + 'E' + episodeElement);

        } else if (currentFile.type == 'channel') {
          //label = channel, title = program name
          if (currentFile.title) { titleElement = currentFile.title; } else { titleElement = mkf.lang.get('N/A', 'Label'); }
          if (currentFile.label) { channelElement = currentFile.label; } else { channelElement = mkf.lang.get('N/A', 'Label'); }
          
          nowLabelElement.text(titleElement);
          nowElement.text(' - ' + channelElement);
        } else if (currentFile.type == 'musicvideo') {
          if (currentFile.artist) { artistElement = currentFile.artist; } else { artistElement = mkf.lang.get('N/A', 'Label'); }
          if (currentFile.album) { albumElement = currentFile.album; } else { albumElement = mkf.lang.get('N/A', 'Label'); }
          
          //hack for partymode playlist refresh - *change to playlist notification*
          if (currentFile.partymode) {
            awxUI.onVideoPlaylistShow();
          };
          nowLabelElement.text(titleElement);
          nowElement.text(' - ' + artistElement);
        } else {
          nowLabelElement.text(titleElement);
        }
      }
      
      //thumbElement.attr('src', 'images/thumbPoster.png');
      var thumb = new Image();
      //if (currentFile.thumbnail != '') { thumb.src = xbmc.getThumbUrl(currentFile.thumbnail) };
      
      //if (currentFile.thumbnail != '') {
        //thumbElement.attr('src', xbmc.getThumbUrl(currentFile.thumbnail));
        if (currentFile.type == 'episode') {
          //if ($('#displayoverlay').css('width') != '656px') { $('#displayoverlay').css('width','656px') };
          thumbElement.attr('src', 'images/empty_thumb_tv.png');
          if (currentFile.thumbnail != '') { thumb.src = xbmc.getThumbUrl(currentFile.thumbnail) };
          thumb.onload = function() { thumbElement.attr('src', thumb.src) };
          thumbElement.css('margin-top', '120px');
          thumbElement.css('margin-left', '5px');
          thumbElement.css('width', '255px');
          thumbElement.css('height', '163px');
          
          /*xbmc.getLogo({path: currentFile.file, type: 'logo'}, function(logo) {
            console.log(currentFile);
            thumbDiscElement.attr('src', logo);
            if (thumbDiscElement.css('width') != '200px') { thumbDiscElement.css('width','200px'); thumbDiscElement.css('height','78px'); };
            thumbDiscElement.show();
            
          });*/
        } else if (currentFile.xbmcMediaType == 'audio') {
          //if ($('#displayoverlay').css('width') != '510px') { $('#displayoverlay').css('width','510px') };
          thumbElement.attr('src', 'images/empty_cover_musicO.png');
          if (currentFile.thumbnail != '') { thumb.src = xbmc.getThumbUrl(currentFile.thumbnail) };
          thumb.onload = function() { thumbElement.attr('src', thumb.src) };
          thumbElement.css('margin-top', '57px');
          thumbElement.css('margin-left', '35px');
          thumbElement.css('height', '225px');
          thumbElement.css('width', '225px');
          if (thumbDiscElement.css('width') != '225px') { thumbDiscElement.css('width','225px'); thumbDiscElement.css('height','225px'); };
            
          xbmc.getLogo({path: currentFile.file, type: 'cdart'}, function(cdart) {
            if (cdart == '') {
              thumbDiscElement.hide();
            } else {thumbDiscElement.css('margin-left','35px');
              thumbDiscElement.attr('src', cdart);
              thumbDiscElement.show();
              
              if (rotateCDart) {
                var angle = 0;
                spinCDArt = setInterval(function(){
                angle+=3;
                  thumbDiscElement.rotate(angle);
                },75);
              };
            };
          });
        } else if (currentFile.type == 'channel') {
          thumbElement.css('margin-top', '57px');
          thumbElement.css('margin-left', '35px');
          thumbElement.css('height', '225px');
          thumbElement.css('width', '225px');
          
        } else if (currentFile.type == 'movie') {
          thumbElement.attr('src', 'images/empty_poster_film.png');
          if (currentFile.thumbnail != '') { thumb.src = xbmc.getThumbUrl(currentFile.thumbnail) };
          thumb.onload = function() { thumbElement.attr('src', thumb.src) };
          
          thumbElement.css('margin-top', '0px');
          thumbElement.css('margin-left', '70px');
          thumbElement.css('height', '280px');
          thumbElement.css('width', '187px');
          xbmc.getLogo({path: currentFile.file, type: 'disc'}, function(cdart) {
            if (cdart != '') {
              $('#displayoverlay').css('width','720px');
              thumbElement.css('margin-right','100px');
              //#displayoverlay width: 600px;
              //.discThumb width: 270px; height: 270px; margin-left: 20px;
              thumbDiscElement.css('width','270px');
              thumbDiscElement.css('height','270px');
              thumbDiscElement.css('margin-left','-20px');
              thumbDiscElement.attr('src', cdart);
              thumbDiscElement.show();
              
              if (rotateCDart) {
                var angle = 0;
                spinCDArt = setInterval(function(){
                angle+=3;
                  thumbDiscElement.rotate(angle);
                },75);
              }
            }
          });
          
        } else if (currentFile.type == 'musicvideo') {
          thumbElement.attr('src', 'images/empty_cover_musicvideo.png');
          if (currentFile.thumbnail != '') { thumb.src = xbmc.getThumbUrl(currentFile.thumbnail) };
          thumb.onload = function() { thumbElement.attr('src', thumb.src) };
          thumbElement.css('margin-top', '57px');
          thumbElement.css('margin-left', '35px');
          thumbElement.css('height', '225px');
          thumbElement.css('width', '225px');
        };

      //}
    },
    //Next item on the current player playlist
    nextItem: function() {
      xbmc.getNextPlaylistItem({
        playlistid: xbmc.activePlayerid,
        onSuccess: function(nextFile) {
          if (!nextFile) {
            //No next item
          } else {
            var titleElement = '';
            var artistElement = '';
            var albumElement = '';
            var tvshowElement = '';
            var seasonElement = '';
            var episodeElement = '';
            var nextElement = $('.nextTitle');
            
            // ALL: AUDIO, VIDEO, PICTURE
            if (nextFile.title) { titleElement=nextFile.title; } else { titleElement = (nextFile.label? nextFile.label : '') ; }

            if (xbmc.activePlayerid == 0) {
              // AUDIO
              if (nextFile.artist) { artistElement = nextFile.artist; } else { artistElement = mkf.lang.get('N/A', 'Label'); }
              if (nextFile.album) { albumElement = nextFile.album; } else { albumElement = mkf.lang.get('N/A', 'Label'); }
              
              nextElement.text(titleElement + ' - ' + artistElement + ' - ' + albumElement);
            } else {
              // VIDEO
              if (nextFile.season && nextFile.episode && nextFile.showtitle) {
                tvshowElement = nextFile.showtitle;
                seasonElement = nextFile.season;
                episodeElement = nextFile.episode;
                
                nextElement.text(titleElement + ' - ' + tvshowElement + ' - S' + seasonElement + 'E' + episodeElement);

              } else {
                nextElement.text(titleElement);
              }
            }
          }
        },
        onError: function(response) {
          console.log(response);
        }
      });
    }
  }); // END addawxUI.display
})(jQuery);