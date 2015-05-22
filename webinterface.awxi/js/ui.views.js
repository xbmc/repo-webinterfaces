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
 
/*--------------------------*/
/* Views and view functions */
/*--------------------------*/

var uiviews = {};

(function($) {
  $.extend(uiviews, {
  
/*-------------------*/
/* Audio UI function */
/*-------------------*/

    /*--------------*/
    ArtistInfoOverlay: function(e) {
      
      var dialogHandle = mkf.dialog.show();
      //var dialogContent = $('<div></div>');
      var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;

      xbmc.getArtistDetails({
        artistid: e.data.idArtist,
        onSuccess: function(artistdetails) {
        
          if ( useFanart ) {
            $('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(artistdetails.fanart) + '")');
          };
          //Text info may drop below poster, basic check and half poster size.
          var imgHeight = ($('#background').height() + 150 > $('#background').width()? $('#background').height() / 2 : $('#background').height() -20);
          
          //var thumb = (artistdetails.thumbnail? xbmc.getThumbUrl(artistdetails.thumbnail) : 'images/empty_cover_artist.png');
          var thumb = new Image();
          if (artistdetails.thumbnail) { thumb.src = xbmc.getThumbUrl(artistdetails.thumbnail) };
          
          var dialogContent = $(($('#background').width() > 615? '<div class="thumb" style="float: left; margin-right: 10px"></div>' : '') +
          //'<img src="' + thumb + '" class="thumbAlbums dialogThumb" />' +
            '<div><h1 class="underline">' + artistdetails.label + '</h1></div>' +
            '<div class="textinfo">' +
              
              //'<div class="test"><img src="' + tvshow.file + 'logo.png' + '" /></div>' +
              (artistdetails.genre? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( artistdetails.genre.length, 'Genres:' ).fetch( artistdetails.genre.length ) + '</span><span class="labelinfo">' + artistdetails.genre.join(', ') + '</span></div>' : '') +
              (artistdetails.mood[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Mood:').withContext('Label').ifPlural( artistdetails.mood.length, "Moods:" ).fetch( artistdetails.mood.length ) + '</span><span class="labelinfo">' + artistdetails.mood.join(', ') + '</span></div>' : '') +
              (artistdetails.style[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Style:').withContext('Label').ifPlural( artistdetails.style.length, "Styles:" ).fetch( artistdetails.style.length ) + '</span><span class="labelinfo">' +  artistdetails.style.join(', ') + '</span></div>' : '') +
              (artistdetails.born? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Born:', 'Label') + '</span><span class="labelinfo">' + artistdetails.born + '</span></div>' : '') +
              (artistdetails.formed? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Formed:', 'Label') + '</span><span class="labelinfo">' + artistdetails.formed + '</span></div>' : '') +
              (artistdetails.died? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Died:', 'Label') + '</span><span class="labelinfo">' + artistdetails.died + '</span></div>' : '') +
              (artistdetails.disbanded? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Disbanded:', 'Label') + '</span><span class="labelinfo">' + artistdetails.disbanded + '</span></div>' : '') +
              (artistdetails.yearsactive[0] != ''? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Years active:', 'Label') + '</span><span class="labelinfo">' + artistdetails.yearsactive + '</span></div>' : '') +
              (artistdetails.instrument[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Instrument:').withContext('Label').ifPlural( artistdetails.instrument.length, "Instruments:" ).fetch( artistdetails.instrument.length ) + '</span><span class="labelinfo">' + artistdetails.instrument + '</span></div>' : '') +
              '<p class="artistdesc">' + artistdetails.description + '</p>' +
            '</div>');
          
          thumb.onload = function() {
              if ((thumb.width *2) > $('#background').width()) { imgHeight = imgHeight /2 };
              dialogContent.filter('div.thumb').append('<img src="' + thumb.src + '" class="thumb">').children().css({'width': 'auto', 'height': (imgHeight > thumb.height? thumb.height : imgHeight ) });
          };
          
          if (awxUI.settings.preferLogos) {
            var artistfile = awxUI.settings.artistsPath + artistdetails.label + '/';
            //art property not available for music.
            xbmc.getLogo({path: artistfile, type: 'logo', format: '.png'}, function(logo) {
              if (logo != '') { dialogContent.find('.underline').empty().append('<img src="' + logo + '" class="thumbLogo">') };
            });
          };
          
          mkf.dialog.setContent(dialogHandle, dialogContent);
          
        },
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          mkf.dialog.close(dialogHandle);        
        }
      });

      return false;
    }, // END onArtistInformationClick

    /*--------------*/
    AlbumInfoOverlay: function(e) {
      
      var dialogHandle = mkf.dialog.show();
      //var dialogContent = $('<div></div>');
      var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;

      xbmc.getAlbumDetails({
        albumid: e.data.idAlbum,
        onSuccess: function(albumdetails) {
          if ( useFanart ) {
            $('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(albumdetails.fanart) + '")');
          };
          //Text info may drop below poster, basic check and half poster size.
          var imgHeight = ($('#background').height() + 150 > $('#background').width()? $('#background').height() / 2 : $('#background').height() -20);
          
         // var thumb = (albumdetails.thumbnail? xbmc.getThumbUrl(albumdetails.thumbnail) : 'images/empty_cover_music.png');
         var thumb = new Image();
         if (albumdetails.thumbnail) { thumb.src = xbmc.getThumbUrl(albumdetails.thumbnail) };
          
          var dialogContent = $(($('#background').width() > 615? '<div class="thumb" style="float: left; margin-right: 10px"></div>' : '') +
          //'<img src="' + thumb + '" class="thumbAlbums dialogThumb" />' +
            '<div class="textinfo">' +
              '<h1 class="underline">' + albumdetails.label + '</h1>' +
              (albumdetails.artist? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Artist:', 'Label') + '</span><span class="labelinfo">' + albumdetails.artist + '</span></div>' : '') +
              (albumdetails.genre.length > 0 && albumdetails.genre[0] != ''? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( albumdetails.genre.length, 'Genres:' ).fetch( albumdetails.genre.length ) + '</span><span class="labelinfo">' + albumdetails.genre.join(', ') + '</span></div>' : '') +
              (albumdetails.mood.length > 0 && albumdetails.mood[0] != ''? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Mood:').withContext('Label').ifPlural( albumdetails.mood.length, 'Moods:' ).fetch( albumdetails.mood.length ) + '</span><span class="labelinfo">' + albumdetails.mood.join(', ') + '</span></div>' : '') +
              (albumdetails.style.length > 0 && albumdetails.style[0] != ''? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Style:').withContext('Label').ifPlural( albumdetails.style.length, 'Styles:' ).fetch( albumdetails.style.length ) + '</span><span class="labelinfo">' +  albumdetails.style.join(', ') + '</span></div>' : '') +
              (albumdetails.rating && albumdetails.rating != -1? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="labelinfo">' + albumdetails.rating + '</span></div>' : '') +
              (albumdetails.year? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Year:', 'Label') + '</span><span class="labelinfo">' + albumdetails.year + '</span></div>' : '') +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="labelinfo">' + albumdetails.playcount + '</span></div>' +
              (albumdetails.albumlabel? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Record Label:', 'Label') + '</span><span class="labelinfo">' + albumdetails.albumlabel + '</span></div>' : '') +
              '<p class="artistdesc">' + albumdetails.description + '</p>' +
            '</div>');
          
          thumb.onload = function() {
            if ((thumb.width *2) > $('#background').width()) { imgHeight = imgHeight /2 };
            dialogContent.filter('div.thumb').append('<img src="' + thumb.src + '" class="thumb">').children().css({'width': 'auto', 'height': (imgHeight > thumb.height? thumb.height : imgHeight) });
          };
          
          if (awxUI.settings.preferLogos) {
            var artistfile = awxUI.settings.artistsPath + albumdetails.artist[0] + '/';
            //art property not available for music.
            xbmc.getLogo({path: artistfile, type: 'logo', format: '.png'}, function(logo) {
              if (logo != '') { dialogContent.find('.underline').prepend('<img src="' + logo + '" class="thumbLogo" style="display: block">') };
            });
          };
          
          mkf.dialog.setContent(dialogHandle, dialogContent);
          
        },
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          mkf.dialog.close(dialogHandle);        
        }
      });

      return false;
    }, // END AlbumInfoOverlay
    
    /*------------*/
    SongInfoOverlay: function(e) {
      var dialogHandle = mkf.dialog.show();
      //var dialogContent = $('<div></div>');
      var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;

      xbmc.getSongDetails({
        songid: e.data.idSong,
        onSuccess: function(songdetails) {
          if ( useFanart ) {
            $('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(songdetails.fanart) + '")');
          };
          //Text info may drop below poster, basic check and half poster size.
          var imgHeight = ($('#background').height() + 150 > $('#background').width()? $('#background').height() / 2 : $('#background').height() -20);
          
          //var thumb = (songdetails.thumbnail? xbmc.getThumbUrl(songdetails.thumbnail) : 'images/empty_cover_music.png');
          var thumb = new Image();
          if (songdetails.thumbnail) { thumb.src = xbmc.getThumbUrl(songdetails.thumbnail) };
          
          var dialogContent = $(($('#background').width() > 615? '<div class="thumb" style="float: left; margin-right: 10px"></div>' : '') +
          //'<img src="' + thumb + '" class="thumbAlbums dialogThumb" />' +
            '<div class="textinfo">' +
              '<h1 class="underline">' + songdetails.label + '</h1>' +
              (songdetails.artist[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Artist:', 'Label') + '</span><span class="labelinfo">' + songdetails.artist[0] + '</span></div>' : '') +
              (songdetails.genre? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( songdetails.genre.length, 'Genres:' ).fetch( songdetails.genre.length ) + '</span><span class="labelinfo">' + songdetails.genre.join(', ') + '</span></div>' : '') +
              (songdetails.track > 0? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Track:', 'Label') + '</span><span class="labelinfo">' + songdetails.track + '</span></div>' : '') +
              (songdetails.album? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Album:', 'Label') + '</span><span class="labelinfo">' +  songdetails.album + '</span></div>' : '') +
              (songdetails.rating && songdetails.rating != -1? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="labelinfo">' + songdetails.rating + '</span></div>' : '') +
              (songdetails.duration? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Duration:', 'Label') + '</span><span class="labelinfo">' + xbmc.formatTime(songdetails.duration) + '</span></div>' : '') +
              (songdetails.year? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Year:', 'Label') + '</span><span class="labelinfo">' + songdetails.year + '</span></div>' : '') +
              (songdetails.lastplayed? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Last Played:', 'Label') + '</span><span class="labelinfo">' + songdetails.lastplayed + '</span></div>' : '') +
              (songdetails.playcount? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="labelinfo">' + songdetails.playcount + '</span></div>' : '') +
              '<p class="artistdesc">' + songdetails.lyrics + '</p>' +
            '</div>');
          
          thumb.onload = function() {
            if ((thumb.width *2) > $('#background').width()) { imgHeight = imgHeight /2 };
            dialogContent.filter('div.thumb').append('<img src="' + thumb.src + '" class="thumb">').children().css({'width': 'auto', 'height': (imgHeight > thumb.height? thumb.height : imgHeight) });
          };
          
          if (awxUI.settings.preferLogos) {
            var artistfile = awxUI.settings.artistsPath + songdetails.artist[0] + '/';
            //art property not available for music.
            xbmc.getLogo({path: artistfile, type: 'logo', format: '.png'}, function(logo) {
              if (logo != '') { dialogContent.find('.underline').prepend('<img src="' + logo + '" class="thumbLogo" style="display: block">') };
            });
          };
          
          mkf.dialog.setContent(dialogHandle, dialogContent);
          
        },
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed to retrieve information!', 'Popup message'), mkf.messageLog.status.error, 5000);
          mkf.dialog.close(dialogHandle);        
        }
      });

      return false;
    }, // END SongInfoOverlay
    
    /*---------*/
    ArtistAlbums: function(e) {
      // open new page to show artist's albums
      var $ArtistAlbumsContent = $('<div class="pageContentWrapper"></div>');
      var ArtistAlbumsPage = mkf.pages.createTempPage(e.data.objParentPage, {
        title: e.data.strArtist,
        content: $ArtistAlbumsContent
      });
      ArtistAlbumsPage.setContextMenu(
        [
          {
            'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function() {
              mkf.pages.closeTempPage(ArtistAlbumsPage);
              return false;
            }
          }
        ]
      );
      mkf.pages.showTempPage(ArtistAlbumsPage);

      // show artist's albums
      $ArtistAlbumsContent.addClass('loading');
      xbmc.getAlbums({
        item: 'artistid',
        itemId: e.data.idArtist,

        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          $ArtistAlbumsContent.removeClass('loading');
        },

        onSuccess: function(result) {
          //Stop limiting by passing this flag.
          result.isFilter = true;
          $ArtistAlbumsContent.defaultAlbumTitleViewer(result, ArtistAlbumsPage);
          $ArtistAlbumsContent.removeClass('loading');
        }
      });

      return false;
    },
    
    /*---------*/
    ArtistSongs: function(e) {
      // open new page to show artist's albums
      var $ArtistSongsContent = $('<div class="pageContentWrapper"></div>');
      var ArtistSongsPage = mkf.pages.createTempPage(e.data.objParentPage, {
        title: e.data.strArtist,
        content: $ArtistSongsContent
      });
      ArtistSongsPage.setContextMenu(
        [
          {
            'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function() {
              mkf.pages.closeTempPage(ArtistSongsPage);
              return false;
            }
          }
        ]
      );
      mkf.pages.showTempPage(ArtistSongsPage);

      // show artist's albums
      $ArtistSongsContent.addClass('loading');
      xbmc.getSongs({
        item: 'artistid',
        itemId: e.data.idArtist,

        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          $ArtistSongsContent.removeClass('loading');
        },

        onSuccess: function(result) {
          result.isFilter = true;
          result.showDetails = true;
          $ArtistSongsContent.defaultSonglistViewer(result, ArtistSongsPage);
          $ArtistSongsContent.removeClass('loading');
        }
      });

      return false;
    },
    
    /*---------*/
    GenreArtists: function(e) {
        // open new page to show artist's albums
        var $artistContent = $('<div class="pageContentWrapper"></div>');
        var artistPage = mkf.pages.createTempPage(e.data.objParentPage, {
          title: e.data.strGenre,
          content: $artistContent
        });
        artistPage.setContextMenu(
          [
            {
              'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
              function() {
                mkf.pages.closeTempPage(artistPage);
                return false;
              }
            }
          ]
        );
        mkf.pages.showTempPage(artistPage);

        // show genres artists
        $artistContent.addClass('loading');
        xbmc.getArtistsGenres({
          genreid: e.data.idGenre,

          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $artistGenresContent.removeClass('loading');
          },

          onSuccess: function(result) {
            //Stop limiting
            result.isFiltered = true;
            $artistContent.defaultArtistsViewer(result, artistPage);
            $artistContent.removeClass('loading');
          }
        });

        return false;
      },

    
    /*------*/
    AlbumPlay: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));
      xbmc.playerOpen({
        item: 'albumid',
        itemId: e.data.idAlbum,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function(errorText) {
          mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
        }
      });
      return false;
    },

    /*-----------*/
    MusicGenrePlay: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));
      xbmc.playerOpen({
        item: 'genreid',
        itemId: e.data.idGenre,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function(errorText) {
          mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
        }
      });
      return false;
    },
    
    /*-----------*/
    ArtistPlay: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));
      xbmc.playerOpen({
        item: 'artistid',
        itemId: e.data.idArtist,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function(errorText) {
          mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
        }
      });
      return false;
    },
    
    
    /*---------------*/
    AddAlbumToPlaylist: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
      xbmc.playlistAdd({
        playlistid: 0,
        item: 'albumid',
        itemId: e.data.idAlbum,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 5000, mkf.messageLog.status.error);
        }
      });
      return false;
    },

    /*---------------*/
    //Can only be music genre.
    AddGenreToPlaylist: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_genre_to_playlist'));
      xbmc.playlistAdd({
        item: 'genreid',
        itemId: e.data.idGenre,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 5000, mkf.messageLog.status.error);
        }
      });
      return false;
    },
    
    /*---------------*/
    AddArtistToPlaylist: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
      xbmc.playlistAdd({
        playlistid: 0,
        item: 'artistid',
        itemId: e.data.idArtist,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 5000, mkf.messageLog.status.error);
        }
      });
      return false;
    },
    
    
    /*----------*/
    Songlist: function(e) {
      // open new page to show album's songs
      var $songlistContent = $('<div class="pageContentWrapper"></div>');
      var songlistPage = mkf.pages.createTempPage(e.data.objParentPage, {
        title: e.data.strAlbum,
        content: $songlistContent
      });
      songlistPage.setContextMenu(
        [
          {
            'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function() {
              mkf.pages.closeTempPage(songlistPage);
              return false;
            }
          }
        ]
      );
      mkf.pages.showTempPage(songlistPage);

      // show album's songs
      $songlistContent.addClass('loading');
      xbmc.getSongs({
        item: e.data.item,
        itemId: e.data.itemId,

        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          $songlistContent.removeClass('loading');
        },

        onSuccess: function(result) {
          result.isFilter = e.data.filter;
          $songlistContent.defaultSonglistViewer(result, e.data.objParentPage);
          $songlistContent.removeClass('loading');
        }
      });

      return false;
    },

    /*-----*/
    SongPlay: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));
      xbmc.playerOpen({
        item: 'songid',
        itemId: e.data.idSong,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function(errorText) {
          mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
        }
      });
      return false;
    },

    /*--------------*/
    AddSongToPlaylist: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
      xbmc.playlistAdd({
        playlistid: 0,
        item: 'songid',
        itemId: e.data.idSong,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 5000, mkf.messageLog.status.error);
        }
      });
      return false;
    },

    /*---------*/
    SongPlayNext: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing next...', 'Popup message with addition'));
      xbmc.playSongNext({
        songid: e.data.idSong,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 8000, mkf.messageLog.status.error);
        }
      });
      return false;
    },
    
    /*--------------------*/
    AddMusicVideoToPlaylist: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
      xbmc.playlistAdd({
        playlistid: 1,
        item: 'musicvideoid',
        itemId: e.data.idMusicVideo,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 5000, mkf.messageLog.status.error);
        }
      });

      return false;
    },
    
    /*------*/
    MusicVideoPlay: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));
      xbmc.playerOpen({
        item: 'musicvideoid',
        itemId: e.data.idMusicVideo,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function(errorText) {
          mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
        }
      });

      return false;
    },
    
    /*-------------*/
    MusicVideoInfoOverlay: function(e) {
      var dialogHandle = mkf.dialog.show();
      var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
      //May be event data or just movieid from playlists
      var musicvideoID = '';
      if (typeof(e) == 'number' ) { musicvideoID = e } else { musicvideoID = e.data.idMusicVideo };

      xbmc.getMusicVideoInfo({
        musicvideoid: musicvideoID,
        onSuccess: function(mv) {
          //var dialogContent = '';
          var fileDownload = '';
          
          xbmc.getPrepDownload({
            path: mv.file,
            onSuccess: function(result) {
              fileDownload = xbmc.getUrl(result.details.path);
              // no better way?
              $('.filelink').find('a').attr('href',fileDownload);
            },
            onError: function(errorText) {
              $('.filelink').find('a').replaceWith(mv.file);
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
          
          if ( useFanart ) {
            $('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(mv.fanart) + '")');
          };
          //Text info may drop below poster, basic check and half poster size.
          var imgHeight = ($('#background').height() + 150 > $('#background').width()? $('#background').height() / 2 : $('#background').height() -20);
          
          if (typeof(mv.streamdetails.video[0]) != 'undefined') {
            if (typeof(mv.streamdetails.subtitle[0]) != 'undefined') { streamdetails.hasSubs = true };
            if (typeof(mv.streamdetails.audio[0].channels) != 'undefined') {
              streamdetails.channels = mv.streamdetails.audio[0].channels;
              streamdetails.aStreams = mv.streamdetails.audio.length;
              $.each(mv.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
              if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('N/A', 'Label') };
            };
          streamdetails.aspect = xbmc.getAspect(mv.streamdetails.video[0].aspect);
          //Get video standard
          streamdetails.vFormat = xbmc.getvFormat(mv.streamdetails.video[0].width);
          //Get video codec
          streamdetails.vCodec = xbmc.getVcodec(mv.streamdetails.video[0].codec);
          //Set audio icon
          streamdetails.aCodec = xbmc.getAcodec(mv.streamdetails.audio[0].codec);
          };
          
          //var thumb = (mv.thumbnail? xbmc.getThumbUrl(mv.thumbnail) : 'images/empty_cover_musicvideo.png');
          var thumb = new Image();
          if (mv.thumbnail) { thumb.src = xbmc.getThumbUrl(mv.thumbnail) };
          
          var dialogContent = $(($('#background').width() > 615? '<div class="thumb" style="float: left; margin-right: 10px"></div>' : '') +
          //'<div><img src="' + thumb + '" class="thumb dialogThumb" />' +
            '<div class="textinfo">' +
              '<div><h1 class="underline">' + mv.title + '</h1></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Run Time:', 'Label') + '</span><span class="value">' + (mv.runtime? xbmc.formatTime(mv.runtime) : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( mv.genre.length, 'Genres:' ).fetch( mv.genre.length ) + '</span><span class="value">' + (mv.genre? mv.genre : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Years active:', 'Label') + '</span><span class="value">' + (mv.year? mv.year : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              (mv.director && mv.director[0] != ''? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Director:').withContext('Label').ifPlural( mv.director.length, 'Directors:' ).fetch( mv.director.length ) + '</span><span class="value">' + mv.director + '</span></div>' : '') +
              (mv.writer && mv.writer[0] != ''? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Writer:').withContext('Label').ifPlural( mv.writer.length, 'Writers:' ).fetch( mv.writer.length ) + '</span><span class="value">' + mv.writer + '</span></div>' : '') +
              (mv.lastplayed? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Last Played:', 'Label') + '</span><span class="value">' + mv.lastplayed + '</span></div>' : '') +
              (mv.playcount? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="value">' + mv.playcount + '</span></div>' : '') +
              '<div class="movieinfo filelink"><span class="label">' + mkf.lang.get('File:', 'Label') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + mv.file.slice(mv.file.lastIndexOf('/')+1) + '</a>' + '</span></div></div>' +
              '<div class="movieinfo"><div class="movietags">' +
              (awxUI.settings.enqueue? '<span class="infoqueue" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '" />' : '') +
              (awxUI.settings.player? '<span class="infoplay" title="' + mkf.lang.get('Play', 'Tool tip') + '" />' : '') +
              '</div></div>' +
            '</div>');

          if (typeof(mv.streamdetails.video[0]) != 'undefined') {
            dialogContent.find('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
            '<div class="aspect' + streamdetails.aspect + '" />' +
            '<div class="vCodec' + streamdetails.vCodec + '" />' +
            '<div class="aCodec' + streamdetails.aCodec + '" />' +
            '<div class="channels' + streamdetails.channels + '" />' +
            (streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
          };

          $(dialogContent).find('.infoplay').on('click', {idMusicVideo: mv.musicvideoid, strMovie: mv.label}, uiviews.MusicVideoPlay);
          $(dialogContent).find('.infoqueue').on('click', {idMusicVideo: mv.musicvideoid, strMovie: mv.label}, uiviews.AddMusicVideoToPlaylist);
          
          thumb.onload = function() { dialogContent.filter('div.thumb').append('<img src="' + thumb.src + '" class="thumbFanart">').children().css({'width': 'auto', 'height': (imgHeight > thumb.height? thumb.height : imgHeight) }) };
          
          mkf.dialog.setContent(dialogHandle, dialogContent);
          return false;
        },
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          mkf.dialog.close(dialogHandle);
        }
      });
      return false;
    },
    
/*--------------------*/
/* Movie UI functions */
/*--------------------*/

    /*------*/
    MoviePlay: function(event) {      
      //Check for resume point
      xbmc.getMovieInfo({
        movieid: event.data.idMovie,
        onSuccess: function(movieinfo) {
          var movieID = event.data.idMovie;
          //Play from beginning
          var playStart = function() {
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));

            xbmc.playerOpen({
              item: 'movieid',
              itemId: movieID,
              onSuccess: function() {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
                $('div#mkfDialog' + dialogHandle).find('a.close').click();
              },
              onError: function(errorText) {
                mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
              }
            });

          return false;
          };
          
          //Play from resume point
          var playResume = function() {
            
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));

            xbmc.playerOpen({
              item: 'movieid',
              itemId: movieID,
              resume: true,
              onSuccess: function() {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
                $('div#mkfDialog' + dialogHandle).find('a.close').click();
              },
              onError: function(errorText) {
                mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
              }
            });

          return false;
          };
          //has resume point?
          if (movieinfo.resume.position > 0) {
            var resumeMins = movieinfo.resume.position/60;
            
            uiviews.MovieInfo({IdMovie: movieID, Inline: false}, function(mPage) {
              if (mPage != '') {
                mPage.last().append('<div class="movieinfo"><span class="resume">' + '<a class="resume" href="">' + mkf.lang.get('Resume from:', 'Label') + Math.floor(resumeMins) + ' ' + mkf.lang.get('minutes', 'Label') + '</a></span></div></div>' +
                  '<div class="movieinfo"><span class="resume">' + '<a class="beginning" href="">' + mkf.lang.get('Play from beginning', 'Label') + '</a>' + '</span></div></div></p>');
                $(mPage).find('a.beginning').on('click', playStart);
                $(mPage).find('a.resume').on('click', playResume); 
                mkf.dialog.setContent(dialogHandle, mPage)
              } else {
                mkf.dialog.setContent(dialogHandle, mkf.lang.get('Failed to retrieve information!', 'Popup message')) 
              };
            });
            var dialogHandle = mkf.dialog.show();
          } else {
            playStart();
          };
        },
        onError: function(errorText) {
          mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
        }
      });
      
      return false;
    },

    /*------*/
    FilePlay: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));

      xbmc.playerOpen({
        item: 'file',
        itemStr: e.data.file,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function(errorText) {
          mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
        }
      });

      return false;
    },
    
    /*---------------*/
    AddMovieToPlaylist: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
      xbmc.playlistAdd({
        playlistid: 1,
        item: 'movieid',
        itemId: e.data.idMovie,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 5000, mkf.messageLog.status.error);
        }
      });

      return false;
    },
    
    /*-------------*/
    MovieInfo: function(film, callback) {
      movieID = film.IdMovie;
      var useFanart = awxUI.settings.useFanart;
      
      xbmc.getMovieInfo({
        movieid: movieID,
        onSuccess: function(movie) {
          //var dialogContent = '';
          var fileDownload = '';
          var castShown = false;
          //var addonsShown = false;
          
          
          var streamdetails = {
            vFormat: 'SD',
            vCodec: 'Unknown',
            aCodec: 'Unknown',
            channels: -1,
            aStreams: 0,
            hasSubs: false,
            aLang: '',
            aspect: 0,
            vwidth: 0
          };
          
          if ( useFanart ) {
            $('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(movie.fanart) + '")');
          };
          
          if (typeof(movie.streamdetails.video[0]) != 'undefined') {
            if (typeof(movie.streamdetails.subtitle[0]) != 'undefined') { streamdetails.hasSubs = true };
            if (typeof(movie.streamdetails.audio[0].channels) != 'undefined') {
              streamdetails.channels = movie.streamdetails.audio[0].channels;
              streamdetails.aStreams = movie.streamdetails.audio.length;
              $.each(movie.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
              if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('N/A', 'Label') };
            };
            if (typeof(movie.streamdetails.video[0]) !== 'undefined' ) {
              streamdetails.aspect = xbmc.getAspect(movie.streamdetails.video[0].aspect)
              //Get video standard
              streamdetails.vFormat = xbmc.getvFormat(movie.streamdetails.video[0].width);
              //Get video codec
              streamdetails.vCodec = xbmc.getVcodec(movie.streamdetails.video[0].codec);
              //Set audio icon
              streamdetails.aCodec = xbmc.getAcodec(movie.streamdetails.audio[0].codec);
            };
          };
          
          //Create a youtube link from plugin trailer link provided
          if (movie.trailer.substring(0, movie.trailer.indexOf("?")) == 'plugin://plugin.video.youtube/') { movie.trailer = 'http://www.youtube.com/watch?v=' + movie.trailer.substr(movie.trailer.lastIndexOf("=") + 1) };

          var thumb = new Image();
          if (movie.art.poster) { thumb.src = xbmc.getThumbUrl(movie.art.poster) };

          //Text info may drop below poster, basic check and half poster size.
          var imgHeight = ($('#background').height() + 150 > $('#background').width()? $('#background').height() / 2 : $('#background').height() -20);

          var dialogContent = $('' +
            ($('#background').width() > 615? '<div><img src="images/empty_poster_film.png" class="thumb thumbPosterLarge dialogThumb"></div>' : '') +
            //(cinex? '<div style="float: left; position: absolute; margin-top: 288px"><a href="#" class="cinexplay">' + mkf.lang.get('label_cinex_play') + '</a></div>' : '') + '</div>' +
            '<div class="movieframe">' +
            (!film.Inline? '<div class="title"><h1 class="underline">' + movie.title + '</h1></div>' : '') +
            '<div class="textinfo">' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Original Title:', 'Label') + '</span><span class="value">' + (movie.originaltitle? movie.originaltitle : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Run Time:', 'Label') + '</span><span class="value">' + (movie.runtime? xbmc.formatTime(movie.runtime) : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( movie.genre.length, 'Genres:' ).fetch( movie.genre.length ) + '</span><span class="value">' + (movie.genre? movie.genre.join(', ') : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="value"><div class="smallRating' + Math.round(movie.rating) + '"></div></span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Votes:', 'Label') + '</span><span class="value">' + (movie.votes? movie.votes : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Year:', 'Label') + '</span><span class="value">' + (movie.year? movie.year : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              (movie.director? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Director:').withContext('Label').ifPlural( movie.director.length, 'Directors:' ).fetch( movie.director.length ) + '</span><span class="value">' + movie.director.join(', ') + '</span></div>' : '') +
              (movie.writer? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Writer:').withContext('Label').ifPlural( movie.writer.length, 'Writers:' ).fetch( movie.writer.length ) + '</span><span class="value">' + movie.writer.join(', ') + '</span></div>' : '') +
              (movie.studio? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Studio:').withContext('Label').ifPlural( movie.studio.length, 'Studios:' ).fetch( movie.studio.length ) + '</span><span class="value">' + movie.studio.join(', ') + '</span></div>' : '') +
              (movie.tagline? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Tag Line:', 'Label') + '</span><span class="value">' + movie.tagline + '</span></div>' : '') +
              (movie.tag? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Tag:').withContext('Label').ifPlural( movie.tag.length, 'Tags:' ).fetch( movie.tag.length ) + '</span><span class="value">' + movie.tag.join(', ') + '</span></div>' : '') +
              (movie.trailer? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Trailer:', 'Label') + '</span><span class="value"><a href="' + movie.trailer + '">' + mkf.lang.get('Link', 'Label') + '</a>' +
              '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
              (awxUI.settings.player? '<a href="#" class="trailerplay">' + mkf.lang.get('Play in XBMC', 'Label') + '</a>' : '') +
              '</span></div>' : '') +
              
              (movie.set[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Set:', 'Label') + '</span><span class="value">' + movie.set + '</span></div>' : '') +
              (movie.lastplayed? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Last Played:', 'Label') + '</span><span class="value">' + movie.lastplayed + '</span></div>' : '') +
              (movie.playcount? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="value">' + movie.playcount + '</span></div>' : '') +
              '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Audio Stream:').withContext('Label').ifPlural( streamdetails.aStreams, 'Audio Streams:' ).fetch( streamdetails.aStreams ) + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              (movie.imdbnumber? '<div class="movieinfo"><span class="label">IMDB:</span><span class="value">' + '<a href="http://www.imdb.com/title/' + movie.imdbnumber + '">IMDB</a>' + '</span></div>' : '') +
              '<div class="movieinfo filelink"><span class="label">' + mkf.lang.get('File:', 'Label') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + movie.file.slice(movie.file.lastIndexOf('/')+1) + '</a>' + '</span></div>' +
              //(cinex? '<div class="cinex"><a href="#" class="cinexplay">' + mkf.lang.get('label_cinex_play') + '</a>' : '') + '</div>' +
              '<div class="movieinfo"><p class="plot">' + movie.plot + '</p></div>' +
            '</div>' +
            '<div class="movieinfo"><div class="movietags">' +
              (awxUI.settings.enqueue? '<span class="infoqueue" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '" />' : '') +
              (awxUI.settings.player? '<span class="infoplay" title="' + mkf.lang.get('Play', 'Tool tip') + '" />' : '')  +
              //(awxUI.settings.player? '<span class="infotools" title="' + mkf.lang.get('Tools and Addons', 'Tool tip') + '" /><div class="addons"></div>' : '')  +
            '</div></div>' +
            '<div class="movieinfo"><button class="cast">' + mkf.lang.get('Cast', 'Label') + '</button><button class="tools">' + mkf.lang.get('Tools and Addons', 'Tool tip') + '</button></div>' +
            '<div class="movieinfo"><div class="cast"></div><div class="addons"></div></div>' +
            '</div>');

            
          $.each(movie.cast, function(idx, actor) {
            //console.log(actor);
            dialogContent.find('div.cast').append('<div class="actorimg actOrder' + actor.order + '">' +
              '<img src="images/emptyActor.png" class="actor">' +
              '<div class="actortext"><span class="actorname">' + actor.name + '</span><span class="actorrole">' + actor.role + '</span></div>' +
              '</div>');
          });
          
          dialogContent.find('button.cast').on('click', function() {
            if (!castShown) {
              //Populate actor images
              castShown = true;
              dialogContent.find('div.cast').show('blind', 'slow');
              $.each(movie.cast, function(idx, actor) {
                //console.log(actor);
                var actorimg = new Image();
                actorimg.src = xbmc.getThumbUrl(actor.thumbnail);
                actorimg.onload = function() { dialogContent.find('.actOrder' + actor.order + ' img').attr('src', actorimg.src) };
              });
            } else {
              dialogContent.find('div.cast').toggle('blind', 'slow');
            }
          });
          
          thumb.onload = function() {
            if (!film.Inline) {
              //console.log(thumb.height)
              dialogContent.find('img.thumbPosterLarge').attr('src', thumb.src).css({'width': 'auto', 'height': (imgHeight > thumb.height? thumb.height : imgHeight) });
            } else {
              dialogContent.find('img.thumbPosterLarge').attr('src', thumb.src);
            };
          };
          
          xbmc.getPrepDownload({
            path: movie.file,
            onSuccess: function(result) {
              fileDownload = xbmc.getUrl(result.details.path);
              // no better way?
              dialogContent.find('div.filelink a').attr('href',fileDownload);
            },
            onError: function(errorText) {
              dialogContent.find('div.filelink a').replaceWith(movie.file);
            },
          });
          
          if (awxUI.settings.preferLogos && movie.art.clearlogo) {
            var logo = new Image();
            logo.src = xbmc.getThumbUrl(movie.art.clearlogo);
            logo.onload = function() { dialogContent.find('.underline').empty().append('<img src="' + logo.src + '" class="thumbLogo">') };
          };
          
          if (typeof(movie.streamdetails.video[0]) != 'undefined') {
            dialogContent.find('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
            '<div class="aspect' + streamdetails.aspect + '" />' +
            '<div class="vCodec' + streamdetails.vCodec + '" />' +
            '<div class="aCodec' + streamdetails.aCodec + '" />' +
            '<div class="channels' + streamdetails.channels + '" />' +
            (streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
          };

          $(dialogContent).find('.infoplay').on('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
          $(dialogContent).find('.infoqueue').on('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.AddMovieToPlaylist);
          //$(dialogContent).find('.infotools').on('click', {dbid: movie.movieid, media: 'video', mediatype: 'movie', movie: movie.label}, uiviews.ToolsAddons);
          $(dialogContent).find('button.tools').on('click', {dbid: movie.movieid, media: 'video', mediatype: 'movie', movie: movie.label}, uiviews.ToolsAddons);
          //$(dialogContent).find('.cinexplay').on('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.CinExPlay);
          $(dialogContent).find('.trailerplay').on('click', {file: movie.trailer}, uiviews.FilePlay);

          callback(dialogContent);
        },
        onError: function() {
          callback('');
        }
      });
    },
    
    /*-------------*/
    MovieInfoOverlay: function(e) {
      var dialogHandle = mkf.dialog.show();
      if (typeof(e) == 'number' ) { movieID = e } else { movieID = e.data.idMovie };
      
      uiviews.MovieInfo({IdMovie: movieID, Inline: false}, function(mPage) {
        if (mPage != '') {
          mkf.dialog.setContent(dialogHandle, mPage)
        } else {
          mkf.dialog.setContent(dialogHandle, mkf.lang.get('Failed to retrieve information!', 'Popup message')) 
        };
      });

      return false;
    },

    MovieSetDetails: function(e) {
      var settings = {};
      // open new page to show movies in set
      var $setContent = $('<div class="pageContentWrapper"></div>');
      var setPage = mkf.pages.createTempPage(e.data.objParentPage, {
        title: e.data.strSet,
        content: $setContent
      });
      setPage.setContextMenu(
        [
          {
            'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function() {
              mkf.pages.closeTempPage(setPage);
              return false;
            }
          }
        ]
      );
      mkf.pages.showTempPage(setPage);

      // show movies in set
      $setContent.addClass('loading');
      xbmc.getMovieSetDetails({
        setid: e.data.idSet,

        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          $setContent.removeClass('loading');
        },

        onSuccess: function(result) {
          result.setdetails.isFilter = true;
          //settings.filterWatched = false;
          //Remove watched as we can't do via "filter" with sets.
          if (awxUI.settings.watched) {
            //Make a seperate copy that we can strip and replace movies. Javascript makes pointers!
            var resultUnwatched = jQuery.extend(true, {}, result);
            //Empty movies
            resultUnwatched.setdetails.movies = [];
            
            for (var i=0; i < result.setdetails.movies.length; i++) {
              //Add unwatched movie to new obj.
              if (result.setdetails.movies[i].playcount == 0) { resultUnwatched.setdetails.movies.push(result.setdetails.movies[i]) };
              if (i == result.setdetails.movies.length-1) {
                $setContent.defaultMovieTitleViewer(resultUnwatched.setdetails, setPage, settings);
                $setContent.removeClass('loading');
              };
            }
          } else {
            $setContent.defaultMovieTitleViewer(result.setdetails, setPage, settings);
            $setContent.removeClass('loading');
          }
          
        }
      });

      return false;
    },
    
        /*--------*/
    PVRtvChannels: function(e) {
      // open new page to show channels
      var $pvrtvChanContent = $('<div class="pageContentWrapper"></div>');
      var pvrtvChanPage = mkf.pages.createTempPage(e.data.objParentPage, {
        title: e.data.strChannel,
        content: $pvrtvChanContent
      });
      var fillPage = function() {
        $pvrtvChanContent.addClass('loading');
        xbmc.pvrGetChannels({
          channelgroupid: e.data.idChannelGroup,

          onError: function() {
            //mkf.messageLog.show(mkf.lang.get('message_failed_pvr_genre'), mkf.messageLog.status.error, 5000);
            $pvrtvChanContent.removeClass('loading');
          },

          onSuccess: function(result) {
            $pvrtvChanContent.defaultChannelViewer(result, pvrtvChanPage);
            $pvrtvChanContent.removeClass('loading');
          }
        });
      }
      pvrtvChanPage.setContextMenu(
        [
          {
            'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function() {
              mkf.pages.closeTempPage(pvrtvChanPage);
              return false;
            }
          },
          {
            'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
              function(){
                $pvrtvChanContent.empty();
                fillPage();
                return false;
              }
          }
        ]
      );
      mkf.pages.showTempPage(pvrtvChanPage);

      // pvr tv Chan
      fillPage();

      return false;
    },
    
        /*--------*/
    PVRepgChannels: function(e) {
      // open new page to show epg channels
      var $pvrepgChanContent = $('<div class="pageContentWrapper"></div>');
      var pvrepgChanPage = mkf.pages.createTempPage(e.data.objParentPage, {
        title: 'EPG',
        content: $pvrepgChanContent
      });
      var fillPage = function() {
        $pvrepgChanContent.addClass('loading');
        xbmc.pvrGetChannels({
          channelgroupid: e.data.idChannelGroup,

          onError: function() {
            //mkf.messageLog.show(mkf.lang.get('message_failed_pvr_genre'), mkf.messageLog.status.error, 5000);
            $pvrepgChanContent.removeClass('loading');
          },

          onSuccess: function(result) {
            $pvrepgChanContent.defaultEPGgridViewer(result, pvrepgChanPage);
            $pvrepgChanContent.removeClass('loading');
          }
        });
      }
      pvrepgChanPage.setContextMenu(
        [
          {
            'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function() {
              mkf.pages.closeTempPage(pvrepgChanPage);
              return false;
            }
          },
          {
            'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
              function(){
                $pvrepgChanContent.empty();
                fillPage();
                return false;
              }
          }
        ]
      );
      mkf.pages.showTempPage(pvrepgChanPage);

      // pvr tv Chan
      fillPage();

      return false;
    },
    
/*-----------------*/
/* TV UI functions */
/*-----------------*/

    /*--------*/
    EpisodePlay: function(e) {
      
      xbmc.getEpisodeDetails({
        episodeid: e.data.idEpisode,
        onSuccess: function(ep) {
          var epID = e.data.idEpisode;
          //Play from beginning
          var playStart = function() {
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));

            xbmc.playerOpen({
              item: 'episodeid',
              itemId: epID,
              onSuccess: function() {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
              },
              onError: function(errorText) {
                mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
              }
            });

          return false;
          };
          
          //Play from resume point
          var playResume = function() {
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));

            xbmc.playerOpen({
              item: 'episodeid',
              itemId: epID,
              resume: true,
              onSuccess: function() {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
              },
              onError: function(errorText) {
                mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
              }
            });

          return false;
          };
          //has resume point?
          if (ep.resume.position > 0) {
            var resumeMins = ep.resume.position/60;
            var dialogHandle = mkf.dialog.show();
            var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;          
                    
          if ( useFanart ) {
            $('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(ep.fanart) + '")');
          };  
          
          var thumb = new Image();
          if (ep.thumbnail) { thumb.src = xbmc.getThumbUrl(ep.thumbnail) };
          
          var dialogContent = $('<div><img src="images/empty_thumb_tv.png" class="thumbFanart dialogThumb" /></div>' +
            '<div><h1 class="underline">' + ep.title + '</h1></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Episode',  'Label') + '</span><span class="value">' + (ep.episode? ep.episode : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Season',  'Label') + '</span><span class="value">' + (ep.season? ep.season : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Run Time:', 'Label') + '</span><span class="value">' + (ep.runtime? xbmc.formatTime(ep.runtime) : mkf.lang.get('N/A', 'Label')) + '</span></div>' +            
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="value"><div class="smallRating' + Math.round(ep.rating) + '"></div></span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Votes:', 'Label') + '</span><span class="value">' + (ep.votes? ep.votes : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('First Aired:', 'Label') + '</span><span class="value">' + (ep.firstaired? ep.firstaired : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Last Played:', 'Label') + '</span><span class="value">' + (ep.lastplayed? ep.lastplayed : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="value">' + (ep.playcount? ep.playcount : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<p class="plot">' +
            '<p class="plot">' +
            '<div class="movieinfo"><span class="resume">' + '<a class="resume" href="">' + mkf.lang.get('Resume from:', 'Label') + Math.floor(resumeMins) + ' ' + mkf.lang.get('minutes') + '</a></span></div></div>' +
            '<div class="movieinfo"><span class="resume">' + '<a class="beginning" href="">' + mkf.lang.get('Play from beginning', 'Label') + '</a>' + '</span></div></div></p>' +
            '</div>');
            
          thumb.onload = function() { dialogContent.filter('img.thumbFanart').attr('src', thumb.src) };

          $(dialogContent).find('a.beginning').on('click', playStart);
          $(dialogContent).find('a.resume').on('click', playResume);
          
          mkf.dialog.setContent(dialogHandle, dialogContent);
          //return false;
          } else {
            playStart();
          }
        },
        onError: function() {
          mkf.messageLog.show('Failed to load episode information!', mkf.messageLog.status.error, 5000);
          mkf.dialog.close(dialogHandle);
        }
      });
      return false;            
    },

    /*-----------------*/
    AddEpisodeToPlaylist: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));

      xbmc.playlistAdd({
        playlistid: 1,
        item: 'episodeid',
        itemId: e.data.idEpisode,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 5000, mkf.messageLog.status.error);
        }
      });

      return false;
    },
    
    /*--------------*/
    TVShowInfoOverlay: function(e) {
      
      var dialogHandle = mkf.dialog.show();

      xbmc.getTvShowInfo({
        tvshowid: e.data.tvshow.tvshowid,
        onSuccess: function(tvshow) {
          var castShown = false;
          
          if ( awxUI.settings.useFanart ) {
            $('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(tvshow.fanart) + '")');
          };
          
          //Text info may drop below poster, basic check and half poster size.
          var imgHeight = ($('#background').height() + 150 > $('#background').width()? $('#background').height() / 2 : $('#background').height() -20);
          
          var banner = new Image();
          if (tvshow.art.banner) { banner.src = xbmc.getThumbUrl(tvshow.art.banner) };
          var poster = new Image();
          if (tvshow.art.poster) { poster.src = xbmc.getThumbUrl(tvshow.art.poster) };
          
          var valueClass = 'value';
          var dialogContent = $(($('#background').width() > 615? '<div class="poster" style="float: left; margin-right: 10px"></div>' : '') +
            (awxUI.settings.preferLogos? '' : '<img src="images/empty_banner_tv.png" class="thumb thumbBanner">') +
            '<div class="movieframe">' +
            '<div class="textinfo">' +
            '<div class="title"><h1 class="underline">' + tvshow.title + '</h1></div>' +
              //'<h1 class="underline center">' + tvshow.title + '</h1>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( tvshow.genre.length, 'Genres:' ).fetch( tvshow.genre.length ) + '</span><span class="'+valueClass+'">' + (tvshow.genre? tvshow.genre : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="'+valueClass+'"><div class="smallRating' + Math.round(tvshow.rating) + '"></div></span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Premiered:', 'Label') + '</span><span class="'+valueClass+'">' + (tvshow.premiered? tvshow.premiered : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Episodes:',  'Label') + '</span><span class="'+valueClass+'">' + tvshow.episode + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="'+valueClass+'">' + tvshow.playcount + '</span></div>' +
              (tvshow.tag? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Tag:').withContext('Label').ifPlural( tvshow.tag.length, 'Tags:' ).fetch( tvshow.tag.length ) + '</span><span class="value">' + tvshow.tag.join(', ') + '</span></div>' : '') +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('File:', 'Label') + '</span><span class="'+valueClass+'">' + tvshow.file + '</span></div>' +
              '<p>' + tvshow.plot + '</p>' +
              /*(awxUI.settings.player? '<div class="movieinfo"><div class="movietags">' + 
                '<span class="infotools" title="' + mkf.lang.get('Tools and Addons', 'Tool tip') + '" /><div class="addons"></div>' +
              '</div></div>' : '')  +*/
              '<div class="movieinfo"><button class="cast">' + mkf.lang.get('Cast', 'Label') + '</button><button class="tools">' + mkf.lang.get('Tools and Addons', 'Tool tip') + '</button></div>' +
            '<div class="movieinfo"><div class="cast"></div><div class="addons"></div></div>' +
            '</div></div>');

            
          $.each(tvshow.cast, function(idx, actor) {
            //console.log(actor);
            dialogContent.find('div.cast').append('<div class="actorimg actOrder' + actor.order + '">' +
              '<img src="images/emptyActor.png" class="actor">' +
              '<div class="actortext"><span class="actorname">' + actor.name + '</span><span class="actorrole">' + actor.role + '</span></div>' +
              '</div>');
          });
          
          dialogContent.find('button.cast').on('click', function() {
            if (!castShown) {
              //Populate actor images
              castShown = true;
              dialogContent.find('div.cast').show('blind', 'slow');
              $.each(tvshow.cast, function(idx, actor) {
                //console.log(actor);
                var actorimg = new Image();
                actorimg.src = xbmc.getThumbUrl(actor.thumbnail);
                actorimg.onload = function() { dialogContent.find('.actOrder' + actor.order + ' img').attr('src', actorimg.src) };
              });
            } else {
              dialogContent.find('div.cast').toggle('blind', 'slow');
            }
          });

          banner.onload = function() { dialogContent.filter('img.thumb').attr('src', banner.src) };
          poster.onload = function() {
              dialogContent.filter('div.poster').append('<img src="' + poster.src + '" class="thumb thumbPosterLarge">').children().css({'width': 'auto', 'height': (imgHeight > poster.height? poster.height : imgHeight) });
          };
          
          if (awxUI.settings.preferLogos && tvshow.art.clearlogo) {
            var logo = new Image();
            logo.src = xbmc.getThumbUrl(tvshow.art.clearlogo);
            logo.onload = function() { dialogContent.find('.underline').empty().append('<img src="' + logo.src + '" class="thumbLogo">') };
          };
          
          $(dialogContent).find('button.tools').on('click', {dbid: e.data.tvshow.tvshowid, media: 'video', mediatype: 'tvshow'}, uiviews.ToolsAddons);
          
          mkf.dialog.setContent(dialogHandle, dialogContent);
          
        },
        onError: function() {
          mkf.messageLog.show('Failed to load TV information!', mkf.messageLog.status.error, 5000);
          mkf.dialog.close(dialogHandle);        
        }
      });

      return false;
    }, // END onTVShowInformationClick

    /*--------*/
    EpisodeInfo: function(e) {
      var dialogHandle = mkf.dialog.show();
      var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;

      xbmc.getEpisodeDetails({
        episodeid: e.data.idEpisode,
        onSuccess: function(ep) {
          var dialogContent = '';
          
          var fileDownload = '';

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

          if (typeof(ep.streamdetails.video[0]) != 'undefined' ) {
            if (typeof(ep.streamdetails.subtitle[0]) != 'undefined') { streamdetails.hasSubs = true };
            if (typeof(ep.streamdetails.audio[0].channels) != 'undefined') {
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
          
          //Text info may drop below poster, basic check and half poster size.
          var imgHeight = ($('#background').height() + 150 > $('#background').width()? $('#background').height() / 2 : $('#background').height() -20);
          
          var banner = new Image();
          if (ep.art.banner) { banner.src = xbmc.getThumbUrl(ep.art.banner) };
          
          var thumb = new Image();
          if (ep.thumbnail) { thumb.src = xbmc.getThumbUrl(ep.thumbnail) };

          var dialogContent = $(($('#background').width() > 615? '<div class="thumb" style="float: left; margin-right: 10px"></div>' : '') +
          //'<div><img src="images/empty_thumb_tv.png" class="thumbFanart dialogThumb" /></div>' +
            '<div class="textinfo">' +
            '<div class="title"><h1 class="underline">' + ep.title + '</h1></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Episode:',  'Label') + '</span><span class="value">' + (ep.episode? ep.episode : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Season:',  'Label') + '</span><span class="value">' + (ep.season? ep.season : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Run Time:', 'Label') + '</span><span class="value">' + (ep.runtime? xbmc.formatTime(ep.runtime) : mkf.lang.get('N/A', 'Label')) + '</span></div>' +            
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="value"><div class="smallRating' + Math.round(ep.rating) + '"></div></span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Votes:', 'Label') + '</span><span class="value">' + (ep.votes? ep.votes : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('First Aired:', 'Label') + '</span><span class="value">' + (ep.firstaired? ep.firstaired : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Last Played:', 'Label') + '</span><span class="value">' + (ep.lastplayed? ep.lastplayed : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="value">' + (ep.playcount? ep.playcount : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Audio Stream:').withContext('Label').ifPlural( streamdetails.aStreams, 'Audio Streams:' ).fetch( streamdetails.aStreams ) + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('File:', 'Label') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + ep.file + '</a>' + '</span></div></div>' +
              '<div class="movieinfo"><p class="plot">' + ep.plot + '</p></div>' +
              '<div class="movieinfo"><div class="movietags">' +
              (awxUI.settings.enqueue? '<span class="infoqueue" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '" />' : '') +
              (awxUI.settings.player? '<span class="infoplay" title="' + mkf.lang.get('Play', 'Tool tip') + '" />' : '')  +
              '</div></div>' +
            '</div>');

          if (typeof(ep.streamdetails.video[0]) != 'undefined') {
            dialogContent.find('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
            '<div class="aspect' + streamdetails.aspect + '" />' +
            '<div class="vCodec' + streamdetails.vCodec + '" />' +
            '<div class="aCodec' + streamdetails.aCodec + '" />' +
            '<div class="channels' + streamdetails.channels + '" />' +
            (streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
          };

          xbmc.getPrepDownload({
            path: ep.file,
            onSuccess: function(result) {
              fileDownload = xbmc.getUrl(result.details.path);
              // no better way?
              dialogContent.find('a').attr('href',fileDownload);
            },
            onError: function(errorText) {
              dialogContent.find('a').replaceWith(ep.file);
            },
          });
          
          //thumb.onload = function() { dialogContent.find('img.thumbFanart').attr('src', thumb.src) };
          dialogContent.filter('div.thumb').append('<img src="' + thumb.src + '" class="thumbFanart">').children().css({'width': 'auto', 'height': (imgHeight > thumb.height? thumb.height : imgHeight) });
          
          if (awxUI.settings.preferLogos && ep.art["tvshow.clearlogo"]) {
            var logo = new Image();
            logo.src = xbmc.getThumbUrl(ep.art["tvshow.clearlogo"]);
            logo.onload = function() { dialogContent.find('.underline').empty().append('<img src="' + logo.src + '" class="thumbLogo">') };
          };
          
          $(dialogContent).find('.infoplay').on('click', {idEpisode: ep.episodeid, strMovie: ep.label}, uiviews.EpisodePlay);
          $(dialogContent).find('.infoqueue').on('click', {idEpisode: ep.episodeid, strMovie: ep.label}, uiviews.AddEpisodeToPlaylist);
          mkf.dialog.setContent(dialogHandle, dialogContent);
          return false;
        },
        onError: function() {
          mkf.messageLog.show('Failed to load episode information!', mkf.messageLog.status.error, 5000);
          mkf.dialog.close(dialogHandle);
        }
      });
      return false;
    },
    
    /*--------*/
    SeasonsList: function(e) {
      // open new page to show tv show's seasons
      var $seasonsContent = $('<div class="pageContentWrapper"></div>');
      var seasonsPage = mkf.pages.createTempPage(e.data.objParentPage, {
        title: e.data.strTvShow,
        content: $seasonsContent
      });
      var fillPage = function() {
        $seasonsContent.addClass('loading');
        xbmc.getSeasons({
          tvshowid: e.data.idTvShow,

          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $seasonsContent.removeClass('loading');
          },

          onSuccess: function(result) {
            if (result.limits.total == 0) {
              mkf.messageLog.show(mkf.lang.get('No seasons found!', 'Popup message'), mkf.messageLog.status.error, 5000);
              return false;
            } else if (awxUI.settings.watched) {
              //Remove watched as we can't do via "filter" with seasons.
              //Make a seperate copy that we can strip and replace seasons. Javascript makes pointers!
              var resultUnwatched = jQuery.extend(true, {}, result);
              //Empty seasons
              resultUnwatched.seasons = [];
              
              for (var i=0; i < result.seasons.length; i++) {
                //Add unwatched seasons to new obj.
                if (result.seasons[i].playcount == 0) { resultUnwatched.seasons.push(result.seasons[i]) };
                if (i == result.seasons.length-1) {
                  if (awxUI.settings.watched && !resultUnwatched.seasons.length > 0) {
                    mkf.messageLog.show(mkf.lang.get('No unwatched seasons!', 'Popup message'), mkf.messageLog.status.error, 5000);
                    return false;
                  } else {
                    $seasonsContent.defaultSeasonsViewer(resultUnwatched, e.data.idTvShow, seasonsPage);
                    $seasonsContent.removeClass('loading');
                    mkf.pages.showTempPage(seasonsPage);
                  }
                };
              };
            } else {
              $seasonsContent.defaultSeasonsViewer(result, e.data.idTvShow, seasonsPage);
              $seasonsContent.removeClass('loading');
              mkf.pages.showTempPage(seasonsPage);
            };
          }
        });
      }
      seasonsPage.setContextMenu(
        [
          {
            'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function() {
              mkf.pages.closeTempPage(seasonsPage);
              return false;
            }
          },
          {
            'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
              function(){
                $seasonsContent.empty();
                fillPage();
                return false;
              }
          }
        ]
      );
      

      // show tv show's seasons
      fillPage();

      return false;
    },

    /*------*/
    Unwatched: function(e) {
      var $unwatchedEpsContent = $('<div class="pageContentWrapper"></div>');
      var unwatchedEpsPage = mkf.pages.createTempPage(e.data.objParentPage, {
        title: e.data.strTvShow,
        content: $unwatchedEpsContent
      });
      
      var fillPage = function() {
        $unwatchedEpsContent.addClass('loading');
        xbmc.getunwatchedEps({
          tvshowid: e.data.idTvShow,

          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
            $unwatchedEpsContent.removeClass('loading');
          },

          onSuccess: function(result) {
            if (result.length == 0) {
              mkf.messageLog.show(mkf.lang.get('No unwatched episodes!', 'Popup message'), mkf.messageLog.status.error, 5000);
              return false;
            } else {
              var eps = {};
              eps.episodes = result;
              $unwatchedEpsContent.defaultunwatchedEpsViewer(eps, e.data.idTvShow, unwatchedEpsPage);
              $unwatchedEpsContent.removeClass('loading');
              mkf.pages.showTempPage(unwatchedEpsPage);
            };
          }
        });
      };
      
      unwatchedEpsPage.setContextMenu(
        [
          {
            'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function() {
              mkf.pages.closeTempPage(unwatchedEpsPage);
              return false;
            }
          },
          {
            'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
              function(){
                $unwatchedEpsContent.empty();
                fillPage();
                return false;
              }
          }
        ]
      );

      fillPage();

      return false;
    },

    /*-----------*/
    SeasonEpisodes: function(e) {
      var $episodesContent = $('<div class="pageContentWrapper"></div>');
      var episodesPage = mkf.pages.createTempPage(e.data.objParentPage, {
        title: e.data.strSeason,
        content: $episodesContent
      });
      
      var fillPage = function() {
        var filter = (awxUI.settings.watched? '"filter": {"field": "playcount", "operator": "is", "value": "0"}' : '');
        var item = 'tvshowid';
        var itemId = e.data.idTvShow;
        var seasonId = e.data.seasonNum;
        
        $episodesContent.addClass('loading');
        xbmc.getEpisodes({
          item: item,
          itemId: itemId,
          season: seasonId,
          filter: filter,

          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
            $episodesContent.removeClass('loading');
          },

          onSuccess: function(result) {
            $episodesContent.defaultEpisodesViewer(result);
            $episodesContent.removeClass('loading');
          }
        });
      }
      
      episodesPage.setContextMenu(
        [
          {
            'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function() {
              mkf.pages.closeTempPage(episodesPage);
              return false;
            }
          },
          {
            'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
              function(){
                $episodesContent.empty();
                fillPage();
                return false;
              }
          }
        ]
      );
      mkf.pages.showTempPage(episodesPage);

      // show season's episodes
      fillPage();

      return false;
    },
    
    /*---------*/
    pvrSwitchChannel: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Changing channel...', 'Popup message with addition'));
      xbmc.playerOpen({
        item: 'channelid',
        itemId: e.data.idChannel,
        onSuccess: function() { mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), mkf.messageLog.status.success, 5000); },
        onError: function() { mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition', 'Popup message'), mkf.messageLog.status.error, 5000); }
      });
      
      return false;
    },
    
    /*---------*/
    pvrRecordChannel: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Recording channel...', 'Popup message with addition'));
      xbmc.pvrRecord({
        channel: e.data.idChannel,
        onSuccess: function() { mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), mkf.messageLog.status.success, 5000); },
        onError: function() { mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000); }
      });
      
      return false;
    },
    
/*-----------------------*/
/* Playlist UI functions */
/*-----------------------*/
  
    /*--------------------*/
    PlaylistAudioItemRemove: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Removing item...', 'Popup message with addition'));
      
      xbmc.removeAudioPlaylistItem({
        item: e.data.itemNum,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          awxUI.onMusicPlaylistShow();
        },
        onError: function(errorText) {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 8000, mkf.messageLog.status.error);
        }
      });
    
      return false;
    },

    /*------------------*/
    PlaylistAudioItemPlay: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing item...', 'Popup message with addition'));

      xbmc.playlistPlay({
        item: e.data.itemNum,
        playlistid: 0,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function(errorText) {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 5000, mkf.messageLog.status.error);
        }
      });

      return false;
    },

    /*--------------------*/
    PlaylistVideoItemRemove: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Removing item...', 'Popup message with addition'));
      
      xbmc.removeVideoPlaylistItem({
        item: e.data.itemNum,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
          awxUI.onVideoPlaylistShow();
        },
        onError: function(errorText) {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 8000, mkf.messageLog.status.error);
        }
      });
    
      return false;
    },

    /*------------------*/
    PlaylistVideoItemPlay: function(e) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing item...', 'Popup message with addition'));

      xbmc.playlistPlay({
        item: e.data.itemNum,
        playlistid: 1,
        onSuccess: function() {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
        },
        onError: function(errorText) {
          mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 5000, mkf.messageLog.status.error);
        }
      });

      return false;
    },
    
/*-------------------*/
/* Misc UI functions */
/*-------------------*/

    /*-----------*/
    GenreItems: function(e) {
      var settings = {};
      var lib = 'get' + e.data.lib;
      var defaultViewer = '';
      var sortby = '';
      if (e.data.lib == 'Artists') {
        defaultViewer = 'defaultArtistsTitleViewer';
      } else if (e.data.lib == 'Albums') {
        defaultViewer = 'defaultAlbumTitleViewer';
      } else if (e.data.lib == 'Songs') {
        defaultViewer = 'defaultSonglistViewer';
        //sortby = 'label';
      } else if (e.data.lib == 'Movies') {
        defaultViewer = 'defaultMovieTitleViewer';
      } else if (e.data.lib == 'TvShows') {
        defaultViewer = 'defaultTvShowTitleViewer';
      } else if (e.data.lib == 'MusicVideos') {
        defaultViewer = 'defaultMusicVideosTitleViewer';
      };
      // open new page to show artist's albums
      var $GenreItemsContent = $('<div class="pageContentWrapper"></div>');
      var GenreItemsPage = mkf.pages.createTempPage(e.data.objParentPage, {
        title: e.data.strGenre,
        content: $GenreItemsContent
      });
      GenreItemsPage.setContextMenu(
        [
          {
            'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function() {
              mkf.pages.closeTempPage(GenreItemsPage);
              return false;
            }
          }
        ]
      );
      mkf.pages.showTempPage(GenreItemsPage);

      // show artist's
      $GenreItemsContent.addClass('loading');
      xbmc[lib]({
        item: 'genreid',
        itemId: e.data.idGenre,
        //(typeof(sortby) !== 'undefined'? 'sortby: ' + sortby : ''),

        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
          $GenreItemsContent.removeClass('loading');
        },

        onSuccess: function(result) {
          //Stop limiting.
          result.isFilter = true;
          settings.filterWatched = false;
          $GenreItemsContent[defaultViewer](result, GenreItemsPage, settings);
          $GenreItemsContent.removeClass('loading');
        }
      });

      return false;
    },
    
    /*-----------*/
    YearsItems: function(e) {
      var settings = {};
      var lib = 'get' + e.data.lib;
      var defaultViewer = '';
      var settings = {
        sortby: '',
        order: '',
        filter: '',
        onSuccess: null,
        onError: null
      };

      if (e.data.lib == 'Albums') {
        defaultViewer = 'defaultAlbumTitleViewer';
        settings.sortby = awxUI.settings.albumSort;
        settings.order = awxUI.settings.adesc;
      } else if (e.data.lib == 'Songs') {
        defaultViewer = 'defaultSonglistViewer';
        settings.sortby = 'label';
        settings.order = 'ascending';
      } else if (e.data.lib == 'Movies') {
        //Use recent so watched are shown.
        defaultViewer = 'defaultMovieRecentViewer';
        settings.sortby = 'label';
        settings.order = 'ascending';
      } else if (e.data.lib == 'TvShows') {
        defaultViewer = 'defaultTvShowTitleViewer';
        settings.sortby = 'label';
        settings.order = 'ascending';
      } else if (e.data.lib == 'MusicVideos') {
        defaultViewer = 'defaultMusicVideosTitleViewer';
        settings.sortby = 'label';
        settings.order = 'ascending';
      };
      
      // open new page to show year's albums
      var $YearsItemsContent = $('<div class="pageContentWrapper"></div>');
      var YearsItemsPage = mkf.pages.createTempPage(e.data.objParentPage, {
        title: e.data.strYear,
        content: $YearsItemsContent
      });
      YearsItemsPage.setContextMenu(
        [
          {
            'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function() {
              mkf.pages.closeTempPage(YearsItemsPage);
              return false;
            }
          }
        ]
      );
      mkf.pages.showTempPage(YearsItemsPage);

      // show year's
      $YearsItemsContent.addClass('loading');
      //No builtin, use advanced filter
      settings.filter = '"filter": {"field": "year", "operator": "is", "value": "' + e.data.strYear + '"}';
      xbmc[lib]({
        filter: settings.filter,
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
          $YearsItemsContent.removeClass('loading');
        },

        onSuccess: function(result) {
          if (result.limits.total > 0) {
            //Stop limiting.
            result.isFilter = true;
            settings.filterWatched = false;
            $YearsItemsContent[defaultViewer](result, YearsItemsPage, settings);
            $YearsItemsContent.removeClass('loading');
          } else {
            mkf.messageLog.show(mkf.lang.get('Failed to find any items!', 'Popup message'), mkf.messageLog.status.error, 5000);
            mkf.pages.closeTempPage(YearsItemsPage);
          }
            
        }
      });

      return false;
    },
    
    /*-----------*/
    TagsItems: function(e) {
      var lib = 'get' + e.data.lib;
      var defaultViewer = '';
      var settings = {
        sortby: '',
        order: '',
        filter: '',
        onSuccess: null,
        onError: null
      };

      if (e.data.lib == 'Movies') {
        //Use recent so watched are shown.
        defaultViewer = 'defaultMovieRecentViewer';
        settings.sortby = 'label';
        settings.order = 'ascending';
      } else if (e.data.lib == 'TvShows') {
        defaultViewer = 'defaultTvShowTitleViewer';
        settings.sortby = 'label';
        settings.order = 'ascending';
      } else if (e.data.lib == 'MusicVideos') {
        defaultViewer = 'defaultMusicVideosTitleViewer';
        settings.sortby = 'label';
        settings.order = 'ascending';
      };
      
      // open new page to show year's albums
      var $TagsItemsContent = $('<div class="pageContentWrapper"></div>');
      var TagsItemsPage = mkf.pages.createTempPage(e.data.objParentPage, {
        title: e.data.strTag,
        content: $TagsItemsContent
      });
      TagsItemsPage.setContextMenu(
        [
          {
            'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
            function() {
              mkf.pages.closeTempPage(TagsItemsPage);
              return false;
            }
          }
        ]
      );
      mkf.pages.showTempPage(TagsItemsPage);

      // show tag's items
      $TagsItemsContent.addClass('loading');
      //No builtin, use advanced filter
      //settings.filter = '"filter": {"field": "tag", "operator": "is", "value": "' + e.data.strTag + '"}';
      xbmc[lib]({
        item: 'tag',
        itemStr: e.data.strTag,
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed!', 'Popup message addition'), mkf.messageLog.status.error, 5000);
          $TagsItemsContent.removeClass('loading');
        },

        onSuccess: function(result) {
          if (result.limits.total > 0) {
            //Stop limiting.
            result.isFilter = true;
            settings.filterWatched = false;
            $TagsItemsContent[defaultViewer](result, TagsItemsPage);
            $TagsItemsContent.removeClass('loading');
          } else {
            mkf.messageLog.show(mkf.lang.get('Failed to find any items!', 'Popup message'), mkf.messageLog.status.error, 5000);
            mkf.pages.closeTempPage(TagsItemsPage);
          }
        }
      });

      return false;
    },
    
    ToolsAddons: function(e) {
    //console.log($('.movieframe').find('div.addons').is(':empty'));
      var addonContent = $('.movieframe').find('div.addons');
      
      if (addonContent.is(':empty')) {
        addonContent.show('blind', 'slow');
        
        if (e.data.media == 'video' && xbmc.addons.artwork) { $('<div class="addon"><img src="' + xbmc.getThumbUrl(xbmc.addons.artwork.thumb) +'" alt="' + xbmc.addons.artwork.name + '" class="thumb addon" /><a href="" class="artwork">' + xbmc.addons.artwork.name + '</a></div>').appendTo(addonContent) };
        if (e.data.media == 'video' && e.data.mediatype == 'movie' && xbmc.addons.cinex) { $('<div class="addon"><img src="' + xbmc.getThumbUrl(xbmc.addons.cinex.thumb) +'" alt="' + xbmc.addons.cinex.name + '" class="thumb addon" /><a href="" class="cinex">' + xbmc.addons.cinex.name + '</a></div>').appendTo(addonContent) };
        if (e.data.media == 'audio' && xbmc.addons.cdart) { $('<div class="addon"><img src="' + xbmc.getThumbUrl(xbmc.addons.cdart.thumb) +'" alt="' + xbmc.addons.artwork.name + '" class="thumb addon" /><a href="" class="cdart">' + xbmc.addons.cdart.name + '</a></div>').appendTo(addonContent) };
        
        addonContent.find('a.artwork').on('click', {dbid: e.data.dbid, mediatype: e.data.mediatype}, uiviews.addonAD);
        addonContent.find('a.cinex').on('click', function() { addons.cineEx(e.data.movie) });
      
      } else {
        addonContent.toggle('blind', 'slow');
      }
      
    },
    
/*----------*/
/* UI Views */
/*----------*/

/*-------------*/
/* Audio views */
/*-------------*/

    /*----Artists list view----*/
    ArtistViewList: function(artists, parentPage) {
      var allSongs = false;
      if (parentPage.className == 'songsArtists') { allSongs = true; };
      var $artistList = $('<ul class="fileList"></ul>');

        $.each(artists.artists, function(i, artist)  {
          $artistList.append('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper"><a href="" class="button info' + artist.artistid + '" title="' + mkf.lang.get('Information',  'Tool tip') + '"><span class="miniIcon information" /></a>' +
                    (awxUI.settings.enqueue? '<a href="" class="button playlist' + artist.artistid + '" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' : '') +
                    (awxUI.settings.player? '<a href="" class="button play' + artist.artistid + '" title="' + mkf.lang.get('Play', 'Tool tip') + '"><span class="miniIcon play" /></a>' : '') + 
                    (allSongs? '<a href="" class="songs' + artist.artistid + '">' + artist.label + '</a>' : '<a href="" class="artist' + artist.artistid + '">' + artist.label + '<div class="findKeywords">' + artist.label.toLowerCase() + '</div>') +
                    '</a></li>');
          $artistList.find('.artist' + artist.artistid)
            .bind('click',{ idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums);
            $artistList.find('.songs' + artist.artistid).on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistSongs)
          $artistList.find('.playlist' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.AddArtistToPlaylist);
          $artistList.find('.play' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.ArtistPlay);
          $artistList.find('.info' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.ArtistInfoOverlay);
          
        });

      return $artistList;
    },

    /*----Artists thumb view----*/
    ArtistViewThumbnails: function(artists, parentPage) {
      var allSongs = false;
      if (parentPage.className == 'songsArtists') { allSongs = true; };
      
      var $artistList = $('<div></div>');

        $.each(artists.artists, function(i, artist)  {
        
          var thumb = new Image();
          if (artist.thumbnail) { thumb.src = xbmc.getThumbUrl(artist.thumbnail) };
        
          $artist = $('<div class="artist'+artist.artistid+' thumbWrapper">' +
            '<div class="linkArtistWrapper">' + 
                (allSongs? '<a href="" class="songs' + artist.artistid + '">' + mkf.lang.get('All Songs', 'Label') + '</a>' : '<a href="" class="albums' + artist.artistid + '">' + mkf.lang.get('All Albums', 'Label') + '</a>') +
                '<a href="" class="info' + artist.artistid + '">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
                (awxUI.settings.enqueue? '<a href="" class="enqueue' + artist.artistid + '">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' : '') +
            '</div>' +
            (awxUI.settings.useLazyLoad?
              '<img src="images/empty_cover_artist.png" alt="' + artist.label + '" class="thumb albums" data-original="' + thumb.src + '" />':
              '<img src="images/empty_cover_artist.png" alt="' + artist.label + '" class="thumb albums" />'
            ) +
            '<div class="albumArtist"><span class="label">' + artist.artist + '</span></div></div>' +
            '<div class="findKeywords">' + artist.label.toLowerCase() + ' ' + artist.artist.toLowerCase() + '</div>' +
          '</div>');

        $artistList.append($artist);
        
        $artistList.find('.albums' + artist.artistid).bind('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums);
        $artistList.find('.songs' + artist.artistid).on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistSongs);
        $artistList.find('.enqueue' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.AddArtistToPlaylist);
        $artistList.find('.info' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.ArtistInfoOverlay);
        
        if (!awxUI.settings.useLazyLoad) {
          thumb.onload = function() { $artistList.find('div.artist'+artist.artistid+' > img.albums').attr('src', thumb.src) };
        } else {
          thumb.onload = function() { $artistList.find('div.artist'+artist.artistid+' > img.albums').attr('data-original', thumb.src) };
        };
        
        });
        
      $artistList.find('.thumbWrapper').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkArtistWrapper').show() });
      $artistList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkArtistWrapper').hide() });      
      
      return $artistList;
    },

    /*----Artists banner view----*/
    ArtistViewBanners: function(artists, parentPage) {
      var allSongs = false;
      if (parentPage.className == 'songsArtists') { allSongs = true; };
      
      var $artistList = $('<div></div>');

        $.each(artists.artists, function(i, artist)  {
          artist.file = awxUI.settings.artistsPath + artist.label + '/';
          
          $artist = $('<div class="artist'+artist.artistid+' thumbWrapper thumbBannerWrapper">' +
            '<div class="linkTVWrapper">' + 
                (allSongs? '<a href="" class="songs' + artist.artistid + '">' + mkf.lang.get('All Songs', 'Label') + '</a>' : '<a href="" class="albums' + artist.artistid + '">' + mkf.lang.get('All Albums', 'Label') + '</a>') +
                '<a href="" class="info' + artist.artistid + '">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
                (awxUI.settings.enqueue? '<a href="" class="enqueue' + artist.artistid + '">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' : '') +
            '</div>' +
            (awxUI.settings.lazyload?
            '<img src="images/empty_banner_artist.png" alt="' + artist.label + '" class="thumb thumbBanner" data-original="images/empty_banner_artist.png">':
            '<img src="images/empty_banner_artist.png"' + '" alt="' + artist.label + '" class="thumbBanner artist">'
            ) +
            '<div class="albumArtist"><span class="label">' + artist.artist + '</span></div></div>' +
            '<div class="findKeywords">' + artist.label.toLowerCase() + '</div>' +
          '</div>').appendTo($artistList);

          //art property not available for music.
          xbmc.getLogo({path: artist.file, type: 'banner', format: '.jpg'}, function(banner) {
            if (!awxUI.settings.lazyload && banner != '') {
              $artistList.find('div.artist' + artist.artistid + ' > img.thumbBanner').attr('src', banner);
            } else if (banner != '') {
              $artistList.find('div.artist' + artist.artistid + ' > img.thumbBanner').attr('data-original', banner);
            };
          });
          
          $artistList.find('.albums' + artist.artistid).on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums);
          $artistList.find('.songs' + artist.artistid).on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistSongs);
          $artistList.find('.enqueue' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.AddArtistToPlaylist);
          $artistList.find('.info' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.ArtistInfoOverlay);

        });
      
        $artistList.find('.thumbBannerWrapper').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkTVWrapper').show() });
        $artistList.find('.thumbBannerWrapper').on('mouseleave', function() { $(this).children('.linkTVWrapper').hide() });
          
      return $artistList;
    },
    
    /*----Artists logo view----*/
    ArtistViewLogos: function(artists, parentPage) {
      var allSongs = false;
      if (parentPage.className == 'songsArtists') { allSongs = true; };
      
      var $artistList = $('<div></div>');

        $.each(artists.artists, function(i, artist)  {
          artist.file = awxUI.settings.artistsPath + artist.label + '/';
          
          $artist = $('<div class="artist'+artist.artistid+' logoWrapper thumbLogoWrapper">' +
            '<div class="linkTVLogoWrapper">' + 
                (allSongs? '<a href="" class="songs' + artist.artistid + '">' + mkf.lang.get('All Songs', 'Label') + '</a>' : '<a href="" class="albums' + artist.artistid + '">' + mkf.lang.get('All Albums', 'Label') + '</a>') +
                '<a href="" class="info' + artist.artistid + '">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
                (awxUI.settings.enqueue? '<a href="" class="enqueue' + artist.artistid + '">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' : '') +
            '</div>' +
            (awxUI.settings.lazyload?
            '<img src="images/missing_logo.png" alt="' + artist.label + '" class="thumb thumbLogo" data-original="images/missing_logo.png">':
            '<img src="images/missing_logo.png"' + '" alt="' + artist.label + '" class="thumbLogo artist">'
            ) +
            '<div class="albumArtist"><span class="label">' + artist.artist + '</span></div></div>' +
            '<div class="findKeywords">' + artist.label.toLowerCase() + '</div>' +
          '</div>').appendTo($artistList);

          //art property not available for music.
          xbmc.getLogo({path: artist.file, type: 'logo', format: '.png'}, function(logo) {
            if (!awxUI.settings.lazyload && logo != '') {
              $artistList.find('div.artist' + artist.artistid + ' > img.thumbLogo').attr('src', logo);
            } else if (logo != '') {
              $artistList.find('div.artist' + artist.artistid + ' > img.thumbLogo').attr('data-original', logo);
            };
          });
          
          $artistList.find('.albums' + artist.artistid).on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums);
          $artistList.find('.songs' + artist.artistid).on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistSongs);
          $artistList.find('.enqueue' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.AddArtistToPlaylist);
          $artistList.find('.info' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.ArtistInfoOverlay);

        });
      
        $artistList.find('.thumbLogoWrapper').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkTVLogoWrapper').show() });
        $artistList.find('.thumbLogoWrapper').on('mouseleave', function() { $(this).children('.linkTVLogoWrapper').hide() });
          
      return $artistList;
    },

    /*----Artists single logo view----*/
    ArtistViewSingleLogos: function(artists, parentPage) {
      var artistsPath = awxUI.settings.artistsPath;
      var totalArtists = artists.limits.total;
      var currentArtist = 0;
      var contentWidth = $('#content').width();
      var contentHeight = ($('#main').length? $('#main').height() -65: $('#content').height())-190;

      var getSingleArtist = function(callback) {
        xbmc.getArtists({
          start: currentArtist,
          end: currentArtist +1,
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          },
          onSuccess: function(result) {
            callback(result.artists[0]);
          }
        });
      };
    
      var $artistList = $('<div class="singleView" style="margin-top: ' + contentHeight/2 + 'px"></div>');

      getSingleArtist(function(artist) {
        $artist = $('<div style="display: table">' +
          '<div class="prev" />' +
          '<div style="background-color: rgba(0,0,0,0.6); display: inline-block; margin-bottom: 3px; padding: 5px;"><img src="images/missing_logo.png" alt="' + artist.label + '" class="thumbFullLogo artist"></div>' +
          '<div class="next" />' +
          '</div>' +
          '<div class="infobox">' +
            '<div style="margin: 0 auto; display: table; text-align: center">' +
              '<div class="albumArtist"><span class="label">' + artist.artist + '</span></div>' +
              '<div class="movietags" style="display: inline-block; width: auto; margin-top: 5px">' +
              (awxUI.settings.enqueue? '<span class="infoqueue" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '" />' : '') +
              (awxUI.settings.player? '<span class="infoplay" title="' + mkf.lang.get('Play', 'Tool tip') + '" />' : '')  +
              '<span class="infoinfo" title="' + mkf.lang.get('Information',  'Tool tip') + '" /></div>' +
            '</div>' +
          '</div>' +
        '</div>').appendTo($artistList);;

        artist.file = artistsPath + artist.label + '/';

        $artist.find('.artist').on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums);

        $artist.find('.infoplay').on('click', {idArtist: artist.artistid}, uiviews.ArtistPlay);
        $artist.find('.infoqueue').on('click', {idArtist: artist.artistid}, uiviews.AddArtistToPlaylist);
        $artist.find('.infoinfo').on('click', {idArtist: artist.artistid}, uiviews.ArtistInfoOverlay);
        xbmc.getLogo({path: artist.file, type: 'logo'}, function(logo) {
          $('img.artist').attr('src', (logo? logo : 'images/missing_logo.png'));
        });
        
        
        $artist.find('.next').on('click', function () {
          if (currentArtist+1 > totalArtists-1) { currentArtist = 0 } else { currentArtist++ };
          getSingleArtist(function(artist) {
            artist.file = artistsPath + artist.label + '/';
            xbmc.getLogo({path: artist.file, type: 'logo'}, function(logo) {
              $('img.artist').attr('src', (logo? logo : 'images/missing_logo.png')); 
            });
          
            $artist.find('span.label').text(artist.label);
            $artist.find('.artist').off();
            $artist.find('.infoplay').off();
            $artist.find('.infoqueue').off();
            $artist.find('.infoinfo').off();
            
            $artist.find('.artist').on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums);
            $artist.find('.infoplay').on('click', { idArtist: artist.artistid }, uiviews.ArtistPlay);
            $artist.find('.infoqueue').on('click', { idArtist: artist.artistid }, uiviews.AddArtistToPlaylist);
            $artist.find('.infoinfo').on('click', { idArtist: artist.artistid }, uiviews.ArtistInfoOverlay);
            });
        });

        $artist.find('.prev').on('click', function () {
          if (currentArtist-1 < 0) { currentArtist = totalArtists-1 } else { currentArtist-- };
          getSingleArtist(function(artist) {
            artist.file = artistsPath + artist.label + '/';
            xbmc.getLogo({path: artist.file, type: 'logo'}, function(logo) {
              $('img.artist').attr('src', (logo? logo : 'images/missing_logo.png')); 
            });
          
            $artist.find('span.label').text(artist.label);
            $artist.find('.artist').off();
            $artist.find('.infoplay').off();
            $artist.find('.infoqueue').off();
            $artist.find('.infoinfo').off();
            
            $artist.find('.artist').on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums);
            $artist.find('.infoplay').on('click', { idArtist: artist.artistid }, uiviews.ArtistPlay);
            $artist.find('.infoqueue').on('click', { idArtist: artist.artistid }, uiviews.AddArtistToPlaylist);
            $artist.find('.infoinfo').on('click', { idArtist: artist.artistid }, uiviews.ArtistInfoOverlay);
            });
        });

      });
        
        $( window ).resize( xbmc.debouncer( function ( e ) {
          contentHeight = ($('#content').height())-190;
          
          //$('div.next, div.prev').css('margin-bottom', contentHeight/2.5);
          $('div.singleView').css('margin-top', contentHeight/2);
          //$('div.movieName').css('width', $('img.singleThumb').width());
        
        } ) );
      
      return $artistList;
    },
    
    /*----Audio Playlists list view----*/
    AudioPlaylistsViewList: function(aplaylists, callback) {
      var $audioPlaylists = $('<ul class="fileList"></ul>');
      $.each (aplaylists, function() {
        if (aplaylists > 0) {
          $.each(aplaylists, function(i, playlist)  {
            $audioPlaylists.append('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' +
                      (awxUI.settings.enqueue? '<a href="" class="button playlistinfo' + i +'" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' : '') +
                      (awxUI.settings.player? '<a href="" class="button play' + i + '" title="' + mkf.lang.get('Play', 'Tool tip') + '"><span class="miniIcon play" /></a>' : '') +
                      '<a href="" class="playlist' + i + '">' + playlist.label +
                      (playlist.artist? ' - Artist: ' + playlist.artist : '') +
                      (playlist.album && playlist.label != playlist.album? ' - ' + mkf.lang.get('Album:', 'Label') + ' ' + playlist.album : '') +
                      ' - Type: ' + 
                      (playlist.type == 'unknown' ? 'Playlist' : playlist.type) + '<div class="findKeywords">' + playlist.label.toLowerCase() + '</div>' +
                      '</a></div></li>');
            //$audioPlaylists.find('.playlist' + i).bind('click', {id: playlist.id,strFile: playlist.file,strLabel: playlist.label, strType: playlist.type}, MusicPlaylists);
            //$audioPlaylists.find('.playlistinfo' + i).bind('click', {playlistinfo: playlist}, onAddPlaylistToPlaylistClick);
            //$audioPlaylists.find('.play' + i).bind('click', {playlistinfo: playlist}, onPlaylistsPlayClick);
          });
        }
      });
      return $audioPlaylists;
    },
    
    /*----Album list view----*/
    AlbumsViewList: function(albums, parentPage) {
      var $albumsList = $('<ul class="fileList"></ul>');
        $.each(albums.albums, function(i, album)  {
          $album = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' +
            '<a href="" class="button info' + album.albumid + '" title="' + mkf.lang.get('Information',  'Tool tip') + '"><span class="miniIcon information" /></a>' +
            (awxUI.settings.enqueue? '<a href="" class="button playlist" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' : '') +
            (awxUI.settings.player? '<a href="" class="button play" title="' + mkf.lang.get('Play', 'Tool tip') + '"><span class="miniIcon play" /></a>' : '') +
            '<a href="" class="album' + album.albumid + '">' + album.label + ' - ' + album.artist[0] + '<div class="findKeywords">' + album.label.toLowerCase() + ' ' + album.artist[0].toLowerCase() + '</div>' +
            '</a></div></li>').appendTo($albumsList);

          $album.find('.album'+ album.albumid).bind('click', {itemId: album.albumid, strAlbum: album.label, objParentPage: parentPage, item: 'albumid', filter: true }, uiviews.Songlist);
          $album.find('.playlist').bind('click', {idAlbum: album.albumid}, uiviews.AddAlbumToPlaylist);
          $album.find('.play').bind('click', {idAlbum: album.albumid, strAlbum: album.label}, uiviews.AlbumPlay);
          $album.find('.info'+ album.albumid).on('click', {idAlbum: album.albumid}, uiviews.AlbumInfoOverlay);
          
        });
        
      return $albumsList
    },
    
    /*----Albums cover thumbnail view----*/
    AlbumsViewThumbnails: function(albums, parentPage, options) {
      var $albumsList = $('<div></div>');
      
      $.each(albums.albums, function(i, album) {
        var thumb = new Image();
        if (album.thumbnail) { thumb.src = xbmc.getThumbUrl(album.thumbnail) };
        
        $album = $('<div class="album'+album.albumid+' thumbWrapper">' +
            '<div class="linkWrapper">' + 
              (awxUI.settings.player? '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a>' : '') +
              '<a href="" class="songs">' + mkf.lang.get('Songs', 'Label') + '</a>' +
              (awxUI.settings.enqueue? '<a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' : '') +
              '<a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
            '</div>' +
            (awxUI.settings.lazyload?
              '<img src="images/empty_cover_music.png" alt="' + album.label + '" class="thumb" data-original="' + thumb.src + '">':
              '<img src="images/empty_cover_music.png" alt="' + album.label + '" class="thumb">'
            ) +
            '<div class="albumName">' + album.label + '' +
            '<div class="albumArtist">' + album.artist[0] + '</div></div>' +
            '<div class="findKeywords">' + album.label.toLowerCase() + ' ' + album.artist[0].toLowerCase() + '</div>' +
          '</div>').appendTo($albumsList);

        
        
        $album.find('.play').bind('click', {idAlbum: album.albumid, strAlbum: album.label}, uiviews.AlbumPlay);
        $album.find('.songs').bind('click', {itemId: album.albumid, strAlbum: album.label, objParentPage: parentPage, item: 'albumid', filter: true }, uiviews.Songlist);
        $album.find('.playlist').bind('click', {idAlbum: album.albumid}, uiviews.AddAlbumToPlaylist);
        $album.find('.info').bind('click', {idAlbum: album.albumid}, uiviews.AlbumInfoOverlay);
        
        if (!awxUI.settings.lazyload) {
          thumb.onload = function() { $albumsList.find('div.album' + album.albumid + ' > img.thumb').attr('src', thumb.src) };
        } else {
          thumb.onload = function() { $albumsList.find('div.album' + album.albumid + ' > img.thumb').attr('data-original', thumb.src) };
        };
        
      });

      $albumsList.find('.thumbWrapper').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkWrapper').show() });          
      $albumsList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkWrapper').hide() });
      
      return $albumsList;
    },
    
    /*----Albums list inline song view----*/
    AlbumsViewListInline: function(albums) {
    
      //can't find accordion without this...?
      var page = $('<div></div>');
      
      var $albumsList = $('<div id="multiOpenAccordion"></div>').appendTo(page);
      
        $.each(albums.albums, function(i, album) {
          $album = $('<h3 class="multiOpenAccordion-header" id="albumName' + album.albumid + '"><a href="#" id="album' + i + '">' + album.label + ' - ' + album.artist[0] +
          '<div class="findKeywords">' + album.label.toLowerCase() + '</div></a></h3>' +
          '<div class="multiOpenAccordion-content" style="display: table; padding: 0px; width: 100%;">' +
          '</div>').appendTo($albumsList);
        });
        
        
        page.find('div#multiOpenAccordion:eq(0)> div').hide();
          page.find('div#multiOpenAccordion:eq(0)> h3').click(function() {
            $(this).next().slideToggle('fast');
            if (!$(this).next().hasClass('filled')) {
              var albumID = $(this).attr('id').replace(/[^\d]+/g, '');
              var albumI = $(this).children('a').attr('id').replace(/[^\d]+/g, '');
              var infodiv = $(this).next();
              
              infodiv.addClass('loading');

              xbmc.getSongs({
                item: 'albumid',
                itemId: albumID,

                onError: function() {
                  mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
                  infodiv.removeClass('loading');
                },

                onSuccess: function(songs) {
                  var albuminfo = albums.albums[albumI];
                  var thumb = new Image();
                  if (albuminfo.thumbnail) { thumb.src = xbmc.getThumbUrl(albuminfo.thumbnail) };
                  infodiv.removeClass('loading');
                  
                  var albumContent = $('<div style="float: left; margin: 5px;"><img src="images/empty_cover_music.png" class="inlinethumb" style="width: 154px; height: 154px;" />' +
                  '<div style="width: 154px; display: block; padding-left: 0px; padding-bottom: 50px">' +
                  (awxUI.settings.enqueue? '<span class="infoqueue" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '" />' : '') +
                  (awxUI.settings.player? '<span class="infoplay" title="' + mkf.lang.get('Play', 'Tool tip') + '" />' : '') +
                  '<span class="infoinfo" title="' + mkf.lang.get('Information',  'Tool tip') + '" /></div>' +
                  '<div style="width: 154px;"><div><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( albuminfo.genre.length, 'Genres:' ).fetch( albuminfo.genre.length ) + '</span>' +
                  '<span class="value">' + albuminfo.genre + '</span></div><div><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="value">' + (albuminfo.rating? albuminfo.rating : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
                  '<div><span class="label">' + mkf.lang.get('Year:', 'Label') + '</span><span class="value">' + (albuminfo.year? albuminfo.year : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
                  (albuminfo.mood.length > 0 && albuminfo.mood[0] != ''? '<div><span class="label">' + mkf.lang.langMsg.translate('Mood:').withContext('Label').ifPlural( albuminfo.mood.length, 'Moods:' ).fetch( albuminfo.mood.length ) + '</span><span class="value">' + albuminfo.mood.join(', ') + '</span></div>' : '') +
                  (albuminfo.style.length > 0 && albuminfo.style[0] != ''? '<div><span class="label">' + mkf.lang.langMsg.translate('Style:').withContext('Label').ifPlural( albuminfo.style.length, 'Styles:' ).fetch( albuminfo.style.length ) + '</span><span class="value">' + albuminfo.style.join(', ') + '</span></div>' : '') + '</div></div>');
                  
                  albumContent.find('.infoplay').bind('click', {idAlbum: albuminfo.albumid, strAlbum: albuminfo.label}, uiviews.AlbumPlay);
                  albumContent.find('.infoqueue').bind('click', {idAlbum: albuminfo.albumid}, uiviews.AddAlbumToPlaylist);
                  albumContent.find('.infoinfo').bind('click', {idAlbum: albuminfo.albumid}, uiviews.AlbumInfoOverlay);
                  
                  thumb.onload = function() { albumContent.find('img.inlinethumb').attr('src', thumb.src) };
                  
                  var $songList = $('<ul class="fileList" style="margin: 5px 0 5px 0"></ul>');

                    $.each(songs.songs, function(i, song)  {
                      var $song = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper song' + song.songid + '">' +
                      (awxUI.settings.enqueue? '<a href="" class="button playlist" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' : '') +
                      (awxUI.settings.playnext? '<a href="" class="button playnext" title="' + mkf.lang.get('Play Next', 'Tool tip') + '"><span class="miniIcon playnext" /></a>' : '')+
                      (awxUI.settings.player? '<a href="" class="song play">' + song.track + '. ' + song.label + '</a>' : '<span class="label">' + song.track + '. ' + song.label + '</span>') +
                      '</div></li>').appendTo($songList);
                      
                      $song.find('.playlist').bind('click', {idSong: song.songid}, uiviews.AddSongToPlaylist);
                      $song.find('.play').bind('click', {idSong: song.songid}, uiviews.SongPlay);
                      $song.find('.playnext').bind('click', {idSong: song.songid}, uiviews.SongPlayNext);
                      
                    });
                    
                  infodiv.addClass('filled');                    
                  infodiv.append(albumContent);
                  infodiv.append($songList);
                }
              });
              
            } else if ($(this).next().hasClass('filled')) {
              //Clear for refresh and hopefully keep memory usage down.
              $(this).next().empty();
              $(this).next().removeClass('filled');
            }
          });
      
      return page;
    },
    
    /*----Song list view-----*/
    SongViewList: function(songs, parentPage) {
      var $songList = $('<ul class="fileList"></ul>');

      if (songs.showDetails) {
        //Include album name.
        $.each(songs.songs, function(i, song)  {
          var $song = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper song' + song.songid + '"><a href="" class="button info" title="' + mkf.lang.get('Information',  'Tool tip') + '"><span class="miniIcon information" /></a>' +
          (awxUI.settings.enqueue? '<a href="" class="button playlist" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' : '') +
          (awxUI.settings.playnext? '<a href="" class="button playnext" title="' + mkf.lang.get('Play Next', 'Tool tip') + '">' + '<span class="miniIcon playnext" /></a>' : '') +
          (awxUI.settings.player? '<a href="" class="song play">' + song.track + '. ' + song.label + ' - ' + song.album + ' - ' + song.artist[0] + ' ' + xbmc.formatTime(song.duration) + '</a>' : '<span class="label">' + song.track + '. ' + song.label + ' - ' + song.artist[0] + ' ' + xbmc.formatTime(song.duration) + '</span>') +
          '<div class="findKeywords">' + song.label.toLowerCase() + '</div>' +
          '</div></li>').appendTo($songList);
          
          $song.find('.info').on('click', {idSong: song.songid}, uiviews.SongInfoOverlay);
          $song.find('.playlist').bind('click', {idSong: song.songid}, uiviews.AddSongToPlaylist);
          $song.find('.play').bind('click', {idSong: song.songid}, uiviews.SongPlay);
          $song.find('.playnext').bind('click', {idSong: song.songid}, uiviews.SongPlayNext);
        });
      } else {
        $.each(songs.songs, function(i, song)  {
          var $song = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper song' + song.songid + '"><a href="" class="button info" title="' + mkf.lang.get('Information',  'Tool tip') + '"><span class="miniIcon information" /></a>' +
          (awxUI.settings.enqueue? '<a href="" class="button playlist" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' : '') +
          (awxUI.settings.playnext? '<a href="" class="button playnext" title="' + mkf.lang.get('Play Next', 'Tool tip') + '">' + '<span class="miniIcon playnext" /></a>' : '') +
          (awxUI.settings.player? '<a href="" class="song play">' + song.track + '. ' + song.label + ' - ' + song.artist[0] + ' ' + xbmc.formatTime(song.duration) + '</a>' : '<span class="label">' + song.track + '. ' + ' - ' + song.artist[0] + song.label + ' - ' + xbmc.formatTime(song.duration) + '</span>') +
          '<div class="findKeywords">' + song.label.toLowerCase() + '</div>' +
          '</div></li>').appendTo($songList);
          
          $song.find('.info').on('click', {idSong: song.songid}, uiviews.SongInfoOverlay);
          $song.find('.playlist').on('click', {idSong: song.songid}, uiviews.AddSongToPlaylist);
          $song.find('.play').on('click', {idSong: song.songid}, uiviews.SongPlay);
          $song.find('.playnext').on('click', {idSong: song.songid}, uiviews.SongPlayNext);
        });
      }
      
      return $songList;
    },
  
    /*----Music Videos thumbnail view----*/
    MusicVideosViewThumbnails: function(mv, parentPage) {
      var $mvList = $('<div></div>');
      
      $.each(mv.musicvideos, function(i, mv) {
        //var thumb = (mv.thumbnail? xbmc.getThumbUrl(mv.thumbnail) : 'images/thumb.png');
        var thumb = new Image();
        if (mv.thumbnail) { thumb.src = xbmc.getThumbUrl(mv.thumbnail) };
        
        $mv = $('<div class="mv'+mv.musicvideoid+' thumbWrapper">' +
            '<div class="linkWrapper">' + 
              (awxUI.settings.player? '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a>' : '') +
              (awxUI.settings.enqueue? '<a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' : '') +
              '<a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
            '</div>' +
            (awxUI.settings.lazyload?
              '<img src="images/empty_cover_musicvideo.png" alt="' + mv.label + '" class="thumb" data-original="' + thumb.src + '" />':
              '<img src="images/empty_cover_musicvideo.png" alt="' + mv.label + '" class="thumb" />'
            ) +
            '<div class="albumName">' + mv.label + '' +
            '<div class="albumArtist">' + mv.artist[0] + '</div></div>' +
            '<div class="findKeywords">' + mv.label.toLowerCase() + ' ' + mv.artist[0].toLowerCase() + '</div>' +
          '</div>');

        $mvList.append($mv);
        
        $mv.find('.play').bind('click', {idMusicVideo: mv.musicvideoid, strMovie: mv.label}, uiviews.MusicVideoPlay);
        $mv.find('.playlist').bind('click', {idMusicVideo: mv.musicvideoid}, uiviews.AddMusicVideoToPlaylist);
        $mv.find('.info').bind('click', {idMusicVideo: mv.musicvideoid}, uiviews.MusicVideoInfoOverlay);
        
        if (!awxUI.settings.lazyload) {
          thumb.onload = function() { $mvList.find('div.mv' + mv.musicvideoid + ' > img.thumb').attr('src', thumb.src) };
        } else {
          thumb.onload = function() { $mvList.find('div.mv' + mv.musicvideoid + ' > img.thumb').attr('data-original', thumb.src) };
        };
        
      });
      
      $mvList.find('.thumbWrapper').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkWrapper').show() });      
      $mvList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkWrapper').hide() });
      
      return $mvList;
    },

/*-------------*/
/* Video views */
/*-------------*/
    
/*-------------*/
/* Movie views */
/*-------------*/

    /*----Movie list accordion view----*/
    MovieViewAccordion: function(movies, parentPage, options) {
    
      //can't find accordion without this...?
      var page = $('<div></div>');
      
      var $moviesList = $('<div id="accordion"></div>').appendTo(page);
      var classEven = -1;
      
        $.each(movies.movies, function(i, movie) {
          var watched = false;
          //if (movie.playcount > 0 && options.isFilter) { return; };
          if (movie.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; };

          classEven += 1;
              $movie = $('<h3 id="movieName' + movie.movieid + '"><a href="">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') +
              '<div class="findKeywords">' + movie.label.toLowerCase() + '</div></a></h3><div>' + 
                '</div>').appendTo($moviesList);
        });
      
      
      page.find('#accordion').accordion({
        active:false,
        change:function(event, ui) {
          if(ui.newContent.html()!=""){ ui.newContent.empty(); }
          if(ui.newContent.html()==""){
            $('.ui-state-active').scrollTop(0);
            var movieID = $(ui.newHeader).attr('id').replace(/[^\d]+/g, '');
            ui.newContent.addClass('loading');
            uiviews.MovieInfo({IdMovie: movieID, Inline: true}, function(movieInfoContent) {
              ui.newContent.removeClass('loading');
              ui.newContent.append(movieInfoContent);
              } ); 
          };
        },
        heightStyle: 'content',
        collapsible: true
        });
        
      return page;
    },    
    
    /*----Movie list inline info view----*/
    MovieViewListInline: function(movies, parentPage, options) {
    
      //can't find accordion without this...? Well use filter dummy! :p
      var page = $('<div></div>');
      
      var $moviesList = $('<div id="multiOpenAccordion"></div>').appendTo(page);
      var classEven = -1;
      
        $.each(movies.movies, function(i, movie) {
          var watched = false;
          //if (movie.playcount > 0 && options.isFilter) { return; };
          if (movie.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; };

          classEven += 1;
              $movie = $('<h3 class="multiOpenAccordion-header" id="movieName' + movie.movieid + '"><a href="#">' + movie.label +
              (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '<div class="findKeywords">' + movie.label.toLowerCase() + '</div></a></h3>' +
              '<div class="multiOpenAccordion-content">' +
                '</div>').appendTo($moviesList);
        });
        
        
        page.find('div#multiOpenAccordion:eq(0)> div').hide();
          page.find('div#multiOpenAccordion:eq(0)> h3').click(function() {
            $(this).next().slideToggle('fast');
            if (!$(this).next().hasClass('filled')) {
              var movieID = $(this).attr('id').replace(/[^\d]+/g, '');
              var infodiv = $(this).next();
              
              infodiv.addClass('loading');

              uiviews.MovieInfo({IdMovie: movieID, Inline: true}, function(movieInfoContent) {
                infodiv.removeClass('loading');
                infodiv.append(movieInfoContent);
                infodiv.addClass('filled');
                });
            } else if ($(this).next().hasClass('filled')) {
              //Clear for refresh and hopefully keep memory usage down.
              $(this).next().empty();
              $(this).next().removeClass('filled');
            }
          });
      
      return page;
    },
    
    /*----Movie list view----*/
    MovieViewList: function(movies, options, parentPage) {

      var $movieList = $('<ul class="fileList"></ul>');
      var classEven = -1;
        $.each(movies.movies, function(i, movie) {
          var watched = false;
          //if (movie.playcount > 0 && options.isFilter) { return; };
          if (movie.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; };
            
          classEven += 1
          $movie = $('<li' + (classEven%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' + 
            (awxUI.settings.enqueue? '<a href="" class="button playlist" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' : '') +
            (awxUI.settings.player? '<a href="" class="button play" title="' + mkf.lang.get('Play', 'Tool tip') + '"><span class="miniIcon play" /></a>' : '') +
            '<a href="" class="movieName' + movie.movieid + '">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
            '</a></div></li>').appendTo($movieList);

          $movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
          $movie.find('.playlist').bind('click', {idMovie: movie.movieid}, uiviews.AddMovieToPlaylist);
          $movie.find('.movieName' + movie.movieid).bind('click', {idMovie: movie.movieid}, uiviews.MovieInfoOverlay);
        });
      return $movieList;
    },
    
    /*----Movie logo view----*/
    MovieViewLogos: function(movies, parentPage, options) {

    var $moviesList = $('<div></div>');
      $.each(movies.movies, function(i, movie) {
        var watched = false;
        // if movie has no id (e.g. movie sets), ignore it
        //if (movie.playcount > 0 && options.isFilter) { return; };
        if (movie.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; };
        
        var thumb = new Image();
        if (movie.art.clearlogo) { thumb.src = xbmc.getThumbUrl(movie.art.clearlogo) };
        
        var $movie = $(
          '<div class="movie'+movie.movieid+' logoWrapper thumbLogoWrapper">' +
            '<div class="linkTVLogoWrapper">' + 
              (awxUI.settings.player? '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a>' : '') +
              (awxUI.settings.enqueue? '<a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' : '') +
              '<a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
            '</div>' +
            (awxUI.settings.lazyload?
              '<img src="images/missing_logo.png" alt="' + movie.label + '" class="thumb thumbLogo" data-original="' + thumb.src + '" />':
              '<img src="images/missing_logo.png" alt="' + movie.label + '" class="thumbLogo" />'
            ) +
            '<div class="movieTitle"><span class="label">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</span></div>' +
            '<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
          '</div>').appendTo($moviesList);
          
        $movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
        $movie.find('.playlist').bind('click', {idMovie: movie.movieid}, uiviews.AddMovieToPlaylist);
        $movie.find('.info').bind('click', {idMovie: movie.movieid}, uiviews.MovieInfoOverlay);
        
        if (!awxUI.settings.lazyload) {
          thumb.onload = function() { $movie.find('img.thumbLogo').attr('src', thumb.src) };
        } else {
          thumb.onload = function() { $movie.find('img.thumbLogo').attr('data-original', thumb.src) };
        };
        
      });
      
      $moviesList.find('.thumbLogoWrapper').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkTVLogoWrapper').show() });          
      $moviesList.find('.thumbLogoWrapper').on('mouseleave', function() { $(this).children('.linkTVLogoWrapper').hide() });
        
      return $moviesList;
    },
      
    /*----Movie thumbnail view----*/
    MovieViewThumbnails: function(movies, parentPage, options) {
      var $moviesList = $('<div></div>');
      $.each(movies.movies, function(i, movie) {
        var watched = false;
        if (movie.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; };
        
        var thumb = new Image();
        if (movie.art.landscape) { thumb.src = xbmc.getThumbUrl(movie.art.landscape) };
        
        var $movie = $(
          '<div class="movie'+movie.movieid+' thumbEpWrapper" style="display: inline">' +
            '<div class="thumbLarge">' +
            '<div class="linkEpWrapper">' + 
              (awxUI.settings.player? '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a>' : '') +
              (awxUI.settings.enqueue? '<a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' : '') +
              '<a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
            '</div>' +
            (awxUI.settings.lazyload?
              '<img src="images/empty_poster_film.png" alt="' + movie.label + '" class="thumb thumbFanartLarge" data-original="' + thumb.src + '" />':
              '<img src="images/empty_poster_film.png" alt="' + movie.label + '" class="thumb thumbFanartLarge" />'
            ) +
            '<div class="movieTitle"><span class="label">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" class="watchedLandscape">' : '') + '</span></div>' +
            '</div>' +
          '</div>').appendTo($moviesList);
          
        $movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
        $movie.find('.playlist').bind('click', {idMovie: movie.movieid}, uiviews.AddMovieToPlaylist);
        $movie.find('.info').bind('click', {idMovie: movie.movieid}, uiviews.MovieInfoOverlay);
        
        if (!awxUI.settings.lazyload) {
          thumb.onload = function() { $movie.find('img.thumbFanartLarge').attr('src', thumb.src) };
        } else {
          thumb.onload = function() { $movie.find('img.thumbFanartLarge').attr('data-original', thumb.src) };
        };
        
      });
      
      $moviesList.find('.thumbLarge').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkEpWrapper').show() });          
      $moviesList.find('.thumbLarge').on('mouseleave', function() { $(this).children('.linkEpWrapper').hide() });
      
      return $moviesList;
    },
    
    /*----Movie clear art view----*/
    MovieViewClearArt: function(movies, parentPage, options) {
      var $moviesList = $('<div></div>');
      $.each(movies.movies, function(i, movie) {
        var watched = false;
        if (movie.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; };
        
        var thumb = new Image();
        if (movie.art.clearart) { thumb.src = xbmc.getThumbUrl(movie.art.clearart) };
        
        var $movie = $(
          '<div class="movie'+movie.movieid+' clearartWrapper">' +
            '<div class="clearartLarge">' +
            '<div class="linkEpWrapper">' + 
              (awxUI.settings.player? '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a>' : '') +
              (awxUI.settings.enqueue? '<a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' : '') +
              '<a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
            '</div>' +
            (awxUI.settings.lazyload?
              '<img src="images/empty_poster_film.png" alt="' + movie.label + '" class="thumb thumbFanartLarge" data-original="' + thumb.src + '" />':
              '<img src="images/empty_poster_film.png" alt="' + movie.label + '" class="thumb thumbFanartLarge" />'
            ) +
            '</div>' +
            '<div class="movieTitle"><span class="label">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" class="watchedClearart">' : '') + '</span></div>' +
            
          '</div>').appendTo($moviesList);
          
        $movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
        $movie.find('.playlist').bind('click', {idMovie: movie.movieid}, uiviews.AddMovieToPlaylist);
        $movie.find('.info').bind('click', {idMovie: movie.movieid}, uiviews.MovieInfoOverlay);
        
        if (!awxUI.settings.lazyload) {
          thumb.onload = function() { $movie.find('img.thumbFanartLarge').attr('src', thumb.src) };
        } else {
          thumb.onload = function() { $movie.find('img.thumbFanartLarge').attr('data-original', thumb.src) };
        };
        
      });
      
      $moviesList.find('.thumbLarge').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkEpWrapper').show() });          
      $moviesList.find('.thumbLarge').on('mouseleave', function() { $(this).children('.linkEpWrapper').hide() });
      
      return $moviesList;
    },
    
    /*----Movie poster thumbnail view----*/
    MovieViewPosters: function(movies, parentPage, options) {
      var $moviesList = $('<div></div>');
      $.each(movies.movies, function(i, movie) {
        var watched = false;
        if (movie.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; };
        
        var thumb = new Image();
        if (movie.art.poster) { thumb.src = xbmc.getThumbUrl(movie.art.poster) };
        
        var $movie = $(
          '<div class="movie'+movie.movieid+' thumbWrapper thumbPosterWrapper">' +
            '<div class="linkWrapper">' + 
              (awxUI.settings.player? '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a>' : '') +
              (awxUI.settings.enqueue? '<a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' : '') +
              '<a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
              '<div class="movieRating' + Math.round(movie.rating) + '"></div>' +
            '</div>' +
            (awxUI.settings.lazyload?
              '<img src="images/empty_poster_film.png" alt="' + movie.label + '" class="thumb thumbPoster" data-original="' + thumb.src + '" />':
              '<img src="images/empty_poster_film.png" alt="' + movie.label + '" class="thumb thumbPoster" />'
            ) +
            '<div class="movieTitle"><span class="label">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" class="watchedPoster">' : '') + '</span></div>' +
            '<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
          '</div>').appendTo($moviesList);
          
        $movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
        $movie.find('.playlist').bind('click', {idMovie: movie.movieid}, uiviews.AddMovieToPlaylist);
        $movie.find('.info').bind('click', {idMovie: movie.movieid}, uiviews.MovieInfoOverlay);
        
        if (!awxUI.settings.lazyload) {
          thumb.onload = function() { $movie.find('img.thumbPoster').attr('src', thumb.src) };
        } else {
          thumb.onload = function() { $movie.find('img.thumbPoster').attr('data-original', thumb.src) };
        };
        
      });
      
      $moviesList.find('.thumbWrapper').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkWrapper').show() });          
      $moviesList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkWrapper').hide() });
      
      return $moviesList;
    },
    
    /*----Movie single poster view----*/
    MovieViewSingle: function(movies, parentPage, options) {

    var filter = '';
    var currentNum = 0;
    var totalMovies = movies.limits.total;
    var contentHeight = ($('#content').height());
    
    var getSingleMovie = function(callback) {
      if (parentPage.className == 'recentMovies') {
        xbmc.getRecentlyAddedMovies({
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          },
          onSuccess: function(result) {
            callback(result.movies[currentNum]);
          }
        });
      } else {
        xbmc.getMovies({
          filter: filter,
          start: currentNum,
          end: currentNum +1,
          onError: function() {
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          },
          onSuccess: function(result) {
            callback(result.movies[0]);
          }
        });
      };
    };
    
    //Hide watched, filter out watched titles.
    if (awxUI.settings.watched) { var filter = '"filter": {"field": "playcount", "operator": "is", "value": "0"}' };
    
    var $moviesList = $('<div class="singleMoviePosterView"></div>');
    
    getSingleMovie(function(movie) {
      var thumb = (movie.art.poster? xbmc.getThumbUrl(movie.art.poster) : 'images/empty_poster_film.png');
      
      var $movie = $('<div class="singleMovie">' +
        '<div style="display: table; margin: 3px auto;"><div class="prev" /><img src="' + thumb + '" alt="' + movie.label + '" class="imgPoster"><div class="next" /></div>' +
        '<div class="infobox">' +
          '<div style="margin: 0 auto; display: table; text-align: center">' +
            '<div class="movieTitle"><span class="label">' + movie.label + '</span>' + (movie.playcount > 0 && !awxUI.settings.hideWatchedMark? '<img class="watched" style="vertical-align: middle" src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
            '<div class="rating smallRating' + Math.round(movie.rating) + '"></div><br />' +
            '<div class="movietags" style="display: inline-block; width: auto; margin-top: 3px;">' +
              (awxUI.settings.enqueue? '<span class="infoqueue" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '" />' : '') +
              (awxUI.settings.player? '<span class="infoplay" title="' + mkf.lang.get('Play', 'Tool tip') + '" />' : '')  +
              '<span class="infoinfo" title="' + mkf.lang.get('Information',  'Tool tip') + '" />' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '').appendTo($moviesList);

      $movie.find('.infoplay').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
      $movie.find('.infoqueue').bind('click', {idMovie: movie.movieid}, uiviews.AddMovieToPlaylist);
      $movie.find('.infoinfo').bind('click', {idMovie: movie.movieid}, uiviews.MovieInfoOverlay);
      

    
      $moviesList.find('.prev').on('click', function () {
        if (currentNum-1 < 0) { currentNum = totalMovies-1 } else { currentNum-- };
        getSingleMovie(function(movie) {
          $movie.find('div.rating').removeClass('smallRating*');
          $movie.find('img.watched').remove();
          if (movie.art.poster) { $movie.find('img.imgPoster').attr('src', xbmc.getThumbUrl(movie.art.poster)) } else { $movie.find('img.imgPoster').attr('src', 'images/empty_poster_film.png') };
          $movie.find('img.imgPoster').attr('alt', movie.label);
          $movie.find('span.label').text(movie.label);
          if (movie.playcount > 0 && !awxUI.settings.hideWatchedMark) $movie.find('span.label').append('<img class="watched" style="vertical-align: middle" src="images/OverlayWatched_Small.png" />');
          $movie.find('div.rating').addClass('smallRating' + Math.round(movie.rating));
          
          $movie.find('.infoplay').unbind();
          $movie.find('.infoqueue').unbind();
          $movie.find('.infoinfo').unbind();
          
          $movie.find('.infoplay').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
          $movie.find('.infoqueue').bind('click', {idMovie: movie.movieid}, uiviews.AddMovieToPlaylist);
          $movie.find('.infoinfo').bind('click', {idMovie: movie.movieid}, uiviews.MovieInfoOverlay);
        });
      });
      
      $moviesList.find('.next').on('click', function () {
        if (currentNum+1 > totalMovies-1) { currentNum = 0 } else { currentNum++ };
        getSingleMovie(function(movie) {
          $movie.find('div.rating').removeClass('smallRating*');
          $movie.find('img.watched').remove();
          if (movie.art.poster) { $movie.find('img.imgPoster').attr('src', xbmc.getThumbUrl(movie.art.poster)) } else { $movie.find('img.imgPoster').attr('src', 'images/empty_poster_film.png') };
          $movie.find('img.imgPoster').attr('alt', movie.label);
          $movie.find('span.label').text(movie.label);
          if (movie.playcount > 0 && !awxUI.settings.hideWatchedMark) $movie.find('span.label').append('<img style="vertical-align: middle" src="images/OverlayWatched_Small.png" />');
          $movie.find('div.rating').addClass('smallRating' + Math.round(movie.rating));
          
          $movie.find('.infoplay').unbind();
          $movie.find('.infoqueue').unbind();
          $movie.find('.infoinfo').unbind();
          
          $movie.find('.infoplay').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
          $movie.find('.infoqueue').bind('click', {idMovie: movie.movieid}, uiviews.AddMovieToPlaylist);
          $movie.find('.infoinfo').bind('click', {idMovie: movie.movieid}, uiviews.MovieInfoOverlay);
        });
      });

      //I gave up with CSS :'(
      $moviesList.find('img.imgPoster').css('height', contentHeight - ($moviesList.find('div.infobox').height() +10));      
    });
    
      $( window ).resize( xbmc.debouncer( function ( e ) {
        contentHeight = ($('#content').height());
        $moviesList.find('img.imgPoster').css('height', contentHeight - ($moviesList.find('div.infobox').height() +10));
      } ) );
      
      return $moviesList;
    },
    
/*------------------*/
/* Movie sets views */
/*------------------*/

    /*----Movie Sets list view----*/
    MovieSetsViewList: function(movies, parentPage, options) {
    
      var $movieList = $('<ul class="fileList"></ul>');
      var classEven = -1;
        $.each(movies.sets, function(i, movie) {
          var watched = false;
          if (movie.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; }
          if (awxUI.settings.watched && watched) { return; }
            
          classEven += 1
          $movie = $('<li' + (classEven%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' + 
            '<a href="" class="movieSet' + movie.setid + '">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
            '</a></div></li>').appendTo($movieList);

          $movie.find('.movieSet' + movie.setid).bind('click', {idSet: movie.setid, strSet: movie.label, objParentPage: parentPage}, uiviews.MovieSetDetails);
        });
      return $movieList;
    },
    
    /*----Movie Sets thumbnail view----*/
    MovieSetsViewThumbnails: function(movies, parentPage, options) {
    
    var $moviesList = $('<div></div>');
      $.each(movies.sets, function(i, movie) {
        var watched = false;
        if (movie.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; }
        if (awxUI.settings.watched && watched) { return; }
        
        var thumb = new Image();
        if (movie.art.poster) { thumb.src = xbmc.getThumbUrl(movie.art.poster) };
        
        var $movie = $(
          '<div class="set'+movie.setid+' thumbWrapper thumbPosterWrapper">' +
            (awxUI.settings.lazyload?
              '<img src="images/empty_poster_filmset.png" alt="' + movie.label + '" class="list thumb thumbPoster" data-original="' + thumb.src + '" />':
              '<img src="images/empty_poster_filmset.png" alt="' + movie.label + '" class="list thumb thumbPoster" />'
            ) +
            '<div class="movieName">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
            '<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
          '</div>').appendTo($moviesList);
          
        if (!awxUI.settings.lazyload) {
          thumb.onload = function() { $movie.find('img.thumbPoster').attr('src', thumb.src) };
        } else {
          thumb.onload = function() { $movie.find('img.thumbPoster').attr('data-original', thumb.src) };
        };
        
        $movie.find('.list').bind('click', {idSet: movie.setid, strSet: movie.label, objParentPage: parentPage}, uiviews.MovieSetDetails);
      });
      return $moviesList;
    },

/*----------*/
/* TV views */
/*----------*/

    /*----TV list view----*/
    TVViewList: function(shows, parentPage, options) {
      var $tvShowList = $('<ul class="fileList"></ul>');

      var classEven = -1;

        $.each(shows.tvshows, function(i, tvshow) {
          var watched = false;
          if (tvshow.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; }
          //if (options.filterWatched && watched) { return; }
          
          classEven += 1
          $tvshow = $('<li' + (classEven%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' + 
            '<a href="" class="button info" title="' + mkf.lang.get('Information',  'Tool tip') + '"><span class="miniIcon information" /></a>' +
            '<a href="" class="button unwatched" title="' + mkf.lang.get('Unwatched',  'Tool tip') + '"><span class="miniIcon unwatched" /></a>' +
            '<a href="" class="tvshowName season">' + tvshow.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '<div class="findKeywords">' + tvshow.label.toLowerCase() + '</div>' +
            '</a></div></li>').appendTo($tvShowList);

          $tvshow.find('.season').on('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.SeasonsList);
          $tvshow.find('.info').on('click', {'tvshow': tvshow}, uiviews.TVShowInfoOverlay);
          $tvshow.find('.unwatched').on('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.Unwatched);
        });

      return $tvShowList;
    },
    
    /*----TV poster view----*/
    TVViewPoster: function(shows, parentPage, options) {
      
      var $tvShowList = $('<div></div>');
      
      if (shows.limits.total > 0) {
        $.each(shows.tvshows, function(i, tvshow) {
          var watched = false;
          if (tvshow.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; };

          var thumb = new Image();
          if (tvshow.art.poster) { thumb.src = xbmc.getThumbUrl(tvshow.art.poster) };
          
          var $tvshow = $('<div class="tvshow'+tvshow.tvshowid+' thumbWrapper thumbPosterWrapper">' +
              '<div class="linkWrapper">' + 
                '<a href="" class="season">' + mkf.lang.get('Seasons', 'Label') + '</a>' +
                '<a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
                '<a href="" class="unwatched">' + mkf.lang.get('Unwatched',  'Tool tip') + '</a>' +
              '</div>' +
              (awxUI.settings.lazyload?
                '<img src="images/empty_poster_tv.png" alt="' + tvshow.label + '" class="thumb thumbPoster" data-original="' + thumb.src + '" />':
                '<img src="images/empty_poster_tv.png" alt="' + tvshow.label + '" class="thumb thumbPoster" />'
              ) +
              '<div class="tvshowTitle"><span class="label">' + tvshow.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</span></div>' +
              '<div class="findKeywords">' + tvshow.label.toLowerCase() + '</div>' +
            '</div>')
            .appendTo($tvShowList);
            
          $tvshow.find('.season').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.SeasonsList);
          $tvshow.find('.info').bind('click', {'tvshow': tvshow}, uiviews.TVShowInfoOverlay);
          $tvshow.find('.unwatched').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.Unwatched);
          
          if (!awxUI.settings.lazyload) {
            thumb.onload = function() { $tvshow.find('img.thumbPoster').attr('src', thumb.src) };
          } else {
            thumb.onload = function() { $tvshow.find('img.thumbPoster').attr('data-original', thumb.src) };
          };
        
        });
      };
      
      $tvShowList.find('.thumbWrapper').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkWrapper').show() });          
      $tvShowList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkWrapper').hide() });

      return $tvShowList;
    },
    
    /*----TV banner view----*/
    TVViewBanner: function(shows, parentPage, options) {
      
      var $tvShowList = $('<div></div>');

      if (shows.limits.total > 0) {
        $.each(shows.tvshows, function(i, tvshow) {
          var watched = false;
          if (tvshow.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; }
          
          var thumb = new Image();
          if (tvshow.art.banner) { thumb.src = xbmc.getThumbUrl(tvshow.art.banner) };
          
          var $tvshow = $('<div class="tvshow'+tvshow.tvshowid+' thumbWrapper thumbBannerWrapper">' +
              '<div class="linkTVWrapper">' + 
                '<a href="" class="season">' + mkf.lang.get('Seasons', 'Label') + '</a>' +
                '<a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
                '<a href="" class="unwatched">' + mkf.lang.get('Unwatched',  'Tool tip') + '</a>' +
              '</div>' +
              (awxUI.settings.lazyload?
                '<img src="images/empty_banner_tv.png" alt="' + tvshow.label + '" class="thumb thumbBanner" data-original="' + thumb.src + '" />':
                '<img src="images/empty_banner_tv.png" alt="' + tvshow.label + '" class="thumb thumbBanner" />'
              ) +
              '<div class="tvshowTitle"><span class="label">' + tvshow.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</span></div>' +
              '<div class="findKeywords">' + tvshow.label.toLowerCase() + '</div>' +
            '</div>').appendTo($tvShowList);
            
          $tvshow.find('.season').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.SeasonsList);
          $tvshow.find('.info').bind('click', {'tvshow': tvshow}, uiviews.TVShowInfoOverlay);
          $tvshow.find('.unwatched').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.Unwatched);
          
          if (!awxUI.settings.lazyload) {
            thumb.onload = function() { $tvshow.find('img.thumbBanner').attr('src', thumb.src) };
          } else {
            thumb.onload = function() { $tvshow.find('img.thumbBanner').attr('data-original', thumb.src) };
          };
          
        });
      };
      
      $tvShowList.find('.thumbWrapper').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkTVWrapper').show() });          
      $tvShowList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkTVWrapper').hide() });

      return $tvShowList;
    },
    
    /*----TV logo view----*/
    TVViewLogoWall: function(shows, parentPage, options) {
      
      var $tvShowList = $('<div></div>');
      
      if (shows.limits.total > 0) {
        $.each(shows.tvshows, function(i, tvshow) {
          var watched = false;
          if (tvshow.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; }
          
          var thumb = new Image();
          if (tvshow.art.clearlogo) { thumb.src = xbmc.getThumbUrl(tvshow.art.clearlogo) };
          
          var $tvshow = $('<div class="tvshow'+tvshow.tvshowid+' logoWrapper thumbLogoWrapper">' +
              '<div class="linkTVLogoWrapper">' + 
                '<a href="" class="season">' + mkf.lang.get('Seasons', 'Label') + '</a>' +
                '<a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
                '<a href="" class="unwatched">' + mkf.lang.get('Unwatched',  'Tool tip') + '</a>' +
              '</div>' + 
              (awxUI.settings.lazyload?
              '<img src="images/missing_logo.png" alt="' + tvshow.label + '" class="thumb thumbLogo" data-original="' + thumb.src + '" />':
              '<img src="images/missing_logo.png" alt="' + tvshow.label + '" class="thumbLogo" />'
              ) +
              '<div class="tvshowTitle"><span class="label">' + tvshow.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</span></div>' +
              '<div class="findKeywords">' + tvshow.label.toLowerCase() + '</div>' +
            '</div>')
            .appendTo($tvShowList);
          
          $tvshow.find('.season').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.SeasonsList);
          $tvshow.find('.info').bind('click', {'tvshow': tvshow}, uiviews.TVShowInfoOverlay);
          $tvshow.find('.unwatched').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.Unwatched);
          
          

          if (!awxUI.settings.lazyload) {
            thumb.onload = function() { $tvshow.find('img.thumbLogo').attr('src', thumb.src) };
          } else {
            thumb.onload = function() { $tvshow.find('img.thumbLogo').attr('data-original', thumb.src) };
          };
          
        });
        
        $tvShowList.find('.thumbLogoWrapper').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkTVLogoWrapper').show() });          
        $tvShowList.find('.thumbLogoWrapper').on('mouseleave', function() { $(this).children('.linkTVLogoWrapper').hide() });
        
      }
  
      return $tvShowList;
    },
    
    /*----TV seasons list----*/
    TVSeasonsViewList: function(seasons, idTvShow, parentPage) {
      var $seasonsList = $('<ul class="fileList"></ul>');

        $.each(seasons.seasons, function(i, season)  {
          var watched = false;
          
          if (season.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; }
          if (awxUI.settings.watched && watched) { return; }
          
          var $season = $('<li' + (i%2==0? ' class="even"': '') + '><div class="linkWrapper"> <a href="" class="season' + i +
          '">' + season.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</a></div></li>').appendTo($seasonsList);
          
          $season.find('a').bind('click',{idTvShow: idTvShow,seasonNum: season.season, strSeason: season.label, objParentPage: parentPage}, uiviews.SeasonEpisodes);
        });

      return $seasonsList;
    },

    /*----PVR list----*/
    PVRViewList: function(pvrchans, parentPage) {
      var $pvrlist = $('<ul class="fileList"></ul>');

        $.each(pvrchans.channelgroups, function(i, changrp)  {          
          var $changrp = $('<li' + (i%2==0? ' class="even"': '') + '><div class="linkWrapper"><a href="" class="pvrchan' + i +
          '"><button class="epg"><span class="epg">EPG</span></button>' + changrp.label + '</a></div></li>').appendTo($pvrlist);
          $changrp.find('a').on('click',{idChannelGroup: changrp.channelgroupid, strChannel: changrp.label, objParentPage: parentPage}, uiviews.PVRtvChannels);
          $changrp.find('button.epg').on('click',{idChannelGroup: changrp.channelgroupid, strChannel: changrp.label, objParentPage: parentPage}, uiviews.PVRepgChannels);
        });

      return $pvrlist;
    },

    /*----PVR channel list----*/
    PVRchanViewList: function(pvrchan, parentPage) {
      var $pvrchan = $('<ul class="fileList"></ul>');

        $.each(pvrchan.channels, function(i, chan)  {          
          var $chan = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' +
          (awxUI.settings.livetv? '<a href="" class="button rec recoff" title="' + mkf.lang.get('Record', 'Tool tip') + '"><span class="miniIcon recoff" /></a>' +
          '<a href="" class="pvrchan' + i + '">' + chan.label + '</a>' :
          '<span class="label">' + chan.label + '</span>') + 
          '</div></li>').appendTo($pvrchan);
          $chan.find('a.rec').on('click',{idChannel: chan.channelid}, uiviews.pvrRecordChannel);
          $chan.find('a.pvrchan' + i).on('click',{idChannel: chan.channelid, strChannel: chan.label, objParentPage: parentPage}, uiviews.pvrSwitchChannel);
        });

      return $pvrchan;
    },
    
    /*----PVR EPG----*/
    PVRepgGrid: function(pvrchan, parentPage) {
      //Time now from local system, then have to take account of timezone...
      var timeNow = new Date();
      //One minute of programme time equals two pixels - 1m = 2px. Change the var below to alter.
      var minToPx = 3;
      var pvrEPG = $('<div class="epgGrid"><div class="nowTime"></div><div class="timeBar"><div class="timeBarBlank"></div><div class="timeBarTimes"></div></div></div>');
      
      //generate timeline bar
      for (i=0;i<24;i++) {
        pvrEPG.find('.timeBarTimes').append('<div class="timeBarHour"><span class="hours">' + Math.floor(timeNow.getHours() + i)%24 + '</span><div class="timeBarHalfHour"></div></div>');
      }
      //pvrEPG.find('.timeBarTimes').css('left', (timeNow.getHours() == 0? timeNow.getHours()*60*minToPx +100 : '-' + Math.abs(timeNow.getHours()*60*minToPx -100) + 'px'));
      
      $.each(pvrchan.channels, function(i, chan)  {
        
        var chanEPG = $('<div class="epgChan chanid' + chan.channelid + '" data-channelid="' + chan.channelid + '"><div class="channelName"><a href="" class="epgChannel' + chan.channelid + '" title="' + mkf.lang.get('Switch to channel', 'Label') + '">' + (chan.thumbnail != ''? '<img src="'+ xbmc.getThumbUrl(chan.thumbnail) +'" height="60px" class="chanIcon epgChannel">' : '<span class="epgChannel">' + chan.label + '</span>') + '</a></div></div>').appendTo(pvrEPG);
        chanEPG.find('a.epgChannel' + chan.channelid).on('click',{idChannel: chan.channelid, strChannel: chan.label}, uiviews.pvrSwitchChannel);
        
        xbmc.pvrGetBroadcasts({
          channelid: chan.channelid,
          onSuccess: function(response) {
            if (response.broadcasts) {
              var firstTimeCheck = true;
              var earliestTime = new Date().getTime();
              var latestTime = new Date().getTime();
              
              var chanProgrammes = $('<div class="programmes loading"></div>');
              
              $.each(response.broadcasts, function(i, programme) {
                //Ignore anything earlier than 30 minutes ago
                //if (xbmc.sqlToEpoch(programme.endtime) > (timeNow.getTime() - 3600000) - Math.abs(timeNow.getTimezoneOffset()*60*1000)) {
                  //Check for earliest time
                  if (firstTimeCheck) {
                    //console.log(xbmc.sqlToEpoch(programme.starttime))
                    if (xbmc.sqlToEpoch(programme.starttime) < earliestTime) {
                      //console.log(programme.broadcastid);
                      //console.log(new Date(earliestTime).toUTCString());
                      earliestTime = xbmc.sqlToEpoch(programme.starttime); 
                      firstTimeCheck = false;
                      //console.log(new Date(earliestTime).toUTCString());
                    }
                  }
                  //Check for latest time
                  if (response.broadcasts.length == i) {
                    if (xbmc.sqlToEpoch(programme.endtime) > latestTime) { latestTime = xbmc.sqlToEpoch(programme.endtime); }
                  }
                  chanProgrammes.append('<div class="programme '+ programme.genre[0].replace(/\/|\s|\'/gi, '-') + '" style="width: ' + Math.floor(programme.runtime*minToPx-2) + 'px" data-broadcastid="' + programme.broadcastid + '" data-runtime="' + programme.runtime + '" data-starttime="' + programme.starttime + '" data-endtime="' + programme.endtime + '"><div class="programmeLabel"><span class="programmeLabel">' + programme.label + '</span></div>' +
                    /*Can't really do any recording other than current, no timer support at all.
                    '<div class="epgButtons">' +
                      '<a href="" class="button info information" title="Information"><span class="miniIconSmall information"></span></a>' +
                      '<a href="" class="button switch play" title="Switch"><span class="miniIconSmall play"></span></a>' +
                      '<a href="" class="button rec recoff" title="Record"><span class="miniIconSmall recoff"></span></a>' +
                    '</div>' +*/
                    (programme.hastimer? '<div style="margin-top: 3px;"><img src="images/timer.png"></div>' : '') +
                  '</div>');
                  pvrEPG.find('.epgChan.chanid' + chan.channelid).append(chanProgrammes);
                  if (programme.hastimer) console.log('timer: ' + programme.label);
                  
                  chanProgrammes.find('[data-broadcastid="' + programme.broadcastid + '"]').on({
                    'click': function(e) {
                      //Firefox doesn't set offset
                      if (typeof e.offsetY === 'undefined') { e.offsetY = e.pageY - $(this).offset().top; }
                      var parentOffset = $(this).parent().offset();
                      var infoLeft = e.clientX;
                      var infoTop = e.clientY - e.offsetY + $('#content').scrollTop();
                      
                      pvrEPG.find('.programmeInfo').empty().append('<span>' + programme.label + '</span>'+
                        '<span>' + mkf.lang.get('Start Time:', 'Label') + xbmc.sqlToDatePlusOffset(programme.starttime).toLocaleString() + '</span>' +
                        '<span>' + mkf.lang.get('End Time:', 'Label') + xbmc.sqlToDatePlusOffset(programme.endtime).toLocaleString() + '</span>' +
                        '<span>' + mkf.lang.get('Run Time:', 'Label') + programme.runtime + '</span>' +
                        '<span>' + programme.plot + '</span>' +
                      '');
                      
                      //Check info window is within the page
                      if ((infoLeft + pvrEPG.find('.programmeInfo').outerWidth() + 20) > $(document).width()) {
                        infoLeft -= pvrEPG.find('.programmeInfo').outerWidth() + 25;
                        pvrEPG.find('.programmeInfo').css({'left': infoLeft +'px'});
                      } else if (infoLeft < 100) {
                        infoLeft += pvrEPG.find('.programmeInfo').outerWidth();
                      } else {
                        pvrEPG.find('.programmeInfo').css({'left': infoLeft +'px'});
                      }
                      
                      if ((infoTop + pvrEPG.find('.programmeInfo').height() + 20) > pvrEPG.height()) {
                        infoTop -= pvrEPG.find('.programmeInfo').height() + 25;
                        pvrEPG.find('.programmeInfo').css({'top': infoTop +'px'});
                        //console.log(infoTop +'bottom change');
                      } else if (infoTop < 10) {
                        infoTop += pvrEPG.find('.programmeInfo').height();
                        //console.log(infoTop +'top change');
                      } else {
                        pvrEPG.find('.programmeInfo').css({'top': infoTop +'px'});
                        //console.log(infoTop +'no change');
                      }
                      
                      pvrEPG.find('.programmeInfo').addClass('show');
                      
                      return false;
                    }
                  });
                  chanProgrammes.removeClass('loading');
                //}
              });
              //Offset programme times.
              var offsetNow = timeNow.getTime() - (timeNow.getMinutes()*60*1000); //- (Math.abs(timeNow.getTimezoneOffset()*60*1000));
              var offsetTime = earliestTime - offsetNow;
              chanProgrammes.css('left', (offsetTime/60/1000)*minToPx + 'px');
            }
          },
          onError: function(response) {
            console.log(response);
            mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
          }
        });
      });
      pvrEPG.append('<div class="programmeInfo"></div>');
      pvrEPG.find('.programmeInfo').on({
        /*'mouseleave': function() {
          $(this).removeClass('show');
        },*/
        'click': function() {
          $(this).removeClass('show');
        }
      });
      //Show time past
      setTimeout(function() {
        pvrEPG.find('.nowTime').css({'height': pvrEPG[0].offsetHeight});
        pvrEPG.find('.nowTime').animate({width: timeNow.getMinutes() *minToPx + 'px'}, 500);    
        //console.log(pvrEPG[0].offsetHeight); 
      }, 500);
            
            
      return pvrEPG;
    },
    
    /*----TV episodes list----*/
    TVEpisodesViewList: function(eps, options) {
      var genlist = eps.episodes;
      
      //For unwatched listing
      //if (options) genlist = eps;
      
      var $episodeList = $('<ul class="fileList"></ul>');

      $.each(genlist, function(i, episode)  {
        var watched = false;
        
        if (episode.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; }
        
        var $episode = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper episode' + episode.episodeid + '">' +
        (awxUI.settings.enqueue? '<a href="" class="button playlist" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' : '') +
        '<a href="" class="button info" title="' + mkf.lang.get('Information',  'Tool tip') + '"><span class="miniIcon information" /></a>' +
        (awxUI.settings.player? '<a href="" class="episode play">' + episode.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</a>' : '<span class="label">' + episode.label + '' + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</a></span>') +
        '</div></li>').appendTo($episodeList);

        $episode.find('.play').bind('click', {idEpisode: episode.episodeid}, uiviews.EpisodePlay);
        $episode.find('.playlist').bind('click', {idEpisode: episode.episodeid}, uiviews.AddEpisodeToPlaylist);
        $episode.find('.information').bind('click', {idEpisode: episode.episodeid}, uiviews.EpisodeInfo);
      });

      return $episodeList;
    },

    /*----TV episodes thumbnail----*/
    TVEpThumbnailList: function(eps, options) {
      var genlist = eps.episodes;
      
      //if (options) genlist = eps;
      
      var $episodeList = $('<ul class="RecentfileList"></ul>');

        $.each(genlist, function(i, episode)  {
          var watched = false;  
          if (episode.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; }
          
          var thumb = new Image();
          if (episode.thumbnail) { thumb.src = xbmc.getThumbUrl(episode.thumbnail) };
          
          var $episode = $('<li><div class="showEpisode thumbEpWrapper">' + 
          '<div class="episodeThumb">' +
          '<div class="linkEpWrapper">' + 
              (awxUI.settings.player? '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a>' : '') +
              (awxUI.settings.enqueue? '<a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' : '') +
              '<a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
            '</div>' +
          (awxUI.settings.lazyload?
          '<img src="images/empty_thumb_tv.png" alt="' + episode.label + '" class="thumb thumbFanart episode" data-original="' + thumb.src + '" />' :
          '<img src="images/empty_thumb_tv.png" alt="' + episode.label + '" class="thumbFanart episode" />'
          ) +
          '</div>' +
          '<div class="episodeTitle">' + episode.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
          '<div class="episodeTVSE">' + mkf.lang.get('Season',  'Label') + ' ' + episode.season + ' - ' + mkf.lang.get('Episode',  'Label') + ' ' +episode.episode + '</div>' +
          '<div class="episodeRating"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span><div class="smallRating' + Math.round(episode.rating) + '"></div></span></div>' +
          '<div class="episodePlot">' + episode.plot + '</div>' +
          '</div></li>').appendTo($episodeList);
          
          $episode.find('.play').bind('click', {idEpisode: episode.episodeid}, uiviews.EpisodePlay);
          $episode.find('.playlist').bind('click', {idEpisode: episode.episodeid}, uiviews.AddEpisodeToPlaylist);
          $episode.find('.info').bind('click', {idEpisode: episode.episodeid}, uiviews.EpisodeInfo);
          
          if (!awxUI.settings.lazyload) {
            thumb.onload = function() { $episode.find('img.episode').attr('src', thumb.src) };
          } else {
            thumb.onload = function() { $episode.find('img.episode').attr('data-original', thumb.src) };
          };
          
        });

      $episodeList.find('.episodeThumb').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkEpWrapper').show() });
      $episodeList.find('.episodeThumb').on('mouseleave', function() { $(this).children('.linkEpWrapper').hide() });
          
      return $episodeList;
    },
    
    /*----Ep thumb no plot view----*/
    TVEpThumbnail: function(eps, options) {
      
      var genlist = eps.episodes;
      
      //if (options) genlist = eps;
      //console.log(genlist)
      var $episodeList = $('<div></div>');

        $.each(genlist, function(i, episode)  {
          var watched = false;  
          if (episode.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; }
          
          var thumb = new Image();
          if (episode.thumbnail) { thumb.src = xbmc.getThumbUrl(episode.thumbnail) };
          
          var $episode = $('<div class="thumbEpWrapper" style="display: inline">' + 
            '<div class="thumbLarge">' +
              '<div class="linkEpWrapper">' + 
                (awxUI.settings.player? '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a>' : '') +
                (awxUI.settings.enqueue? '<a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' : '') +
                '<a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
              '</div>' +
              (awxUI.settings.lazyload?
              '<img src="images/empty_thumb_tv.png" alt="' + episode.label + '" class="thumb thumbFanartLarge episode" data-original="' + thumb.src + '" />' :
              '<img src="images/empty_thumb_tv.png" alt="' + episode.label + '" class="thumbFanartLarge episode" />'
              ) +
              '' +
              '<div class="movieTitle"><span class="label">' + episode.title + (watched? '<img src="images/OverlayWatched_Small.png" class="watchedLandscape">' : '') + '</span>' +
              '<div class="recentTVtitle"><span>' + mkf.lang.get('Season',  'Label') + ' ' + episode.season + ' - ' + mkf.lang.get('Episode',  'Label') + ' ' +episode.episode + '</span></div></div>' +
              //'<div class="label">' + mkf.lang.get('Season',  'Label') + ' ' + episode.season + ' - ' + mkf.lang.get('Episode',  'Label') + ' ' +episode.episode + '</div>' +
              //'<div class="episodeRating"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span><div class="smallRating' + Math.round(episode.rating) + '"></div></span></div>' +
            '</div>' +
          '</div>').appendTo($episodeList);
          
          $episode.find('.play').bind('click', {idEpisode: episode.episodeid}, uiviews.EpisodePlay);
          $episode.find('.playlist').bind('click', {idEpisode: episode.episodeid}, uiviews.AddEpisodeToPlaylist);
          $episode.find('.info').bind('click', {idEpisode: episode.episodeid}, uiviews.EpisodeInfo);
          
          if (!awxUI.settings.lazyload) {
            thumb.onload = function() { $episode.find('img.episode').attr('src', thumb.src) };
          } else {
            thumb.onload = function() { $episode.find('img.episode').attr('data-original', thumb.src) };
          };
          
        });

      $episodeList.find('.thumbLarge').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkEpWrapper').show() });
      $episodeList.find('.thumbLarge').on('mouseleave', function() { $(this).children('.linkEpWrapper').hide() });
          
      return $episodeList;
    },
    
    /*----TV Recently Added----*/
    TVRecentViewInfoList: function(eps, parentPage, options) {
      
      var $episodeList = $('<ul class="RecentfileList"></ul>');

        $.each(eps.episodes, function(i, episode)  {
          var watched = false;  
          if (episode.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; }
          //if (filterWatched && watched) { return; }
          
          //var thumb = (episode.thumbnail? xbmc.getThumbUrl(episode.thumbnail) : 'images/empty_thumb_tv.png');
          var thumb = new Image();
          if (episode.thumbnail) { thumb.src = xbmc.getThumbUrl(episode.thumbnail) };
          
          var $episode = $('<li><div class="recentTVshow thumbEpWrapper">' + 
          '<div class="episodeThumb">' +
          '<div class="linkEpWrapper">' + 
              (awxUI.settings.player? '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a>' : '') +
              (awxUI.settings.enqueue? '<a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' : '') +
              '<a href="" class="unwatchedEps">' + mkf.lang.get('Unwatched',  'Tool tip') + '</a>' +
            '</div>' +
          (awxUI.settings.lazyload?
          '<img src="images/empty_thumb_tv.png" alt="' + episode.label + '" class="thumb thumbFanart episode" data-original="' + thumb.src + '" />':
          '<img src="images/empty_thumb_tv.png" alt="' + episode.label + '" class="thumbFanart episode" />'
          ) +
          '</div>' +
          '<div class="recentTVshowName">' + episode.showtitle + (watched? '<img src="images/OverlayWatched_Small.png" class="epWatched" />' : '') + 
          '<div class="episodeTVSE">' + mkf.lang.get('Season',  'Label') + ' ' + episode.season + ' - ' + mkf.lang.get('Episode',  'Label') + ' ' +episode.episode + '</div>' +
          //'</div><div class="recentTVSE">Season: ' + episode.season + ' - Episode: ' +episode.episode + 
          '</div><div class="recentTVtitle">' + episode.label + '</div><div class="recentTVplot">' + episode.plot + '</div></div></li>').appendTo($episodeList);
          
          $episode.find('.play').bind('click', {idEpisode: episode.episodeid}, uiviews.EpisodePlay);
          $episode.find('.playlist').bind('click', {idEpisode: episode.episodeid}, uiviews.AddEpisodeToPlaylist);
          $episode.find('.unwatchedEps').bind('click', {idTvShow: episode.tvshowid, strTvShow: episode.showtitle, objParentPage: parentPage}, uiviews.Unwatched);

          if (!awxUI.settings.lazyload) {
            thumb.onload = function() { $episode.find('img.episode').attr('src', thumb.src) };
          } else {
            thumb.onload = function() { $episode.find('img.episode').attr('data-original', thumb.src) };
          };
        
        });
        
      $episodeList.find('.episodeThumb').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkEpWrapper').show() });          
      $episodeList.find('.episodeThumb').on('mouseleave', function() { $(this).children('.linkEpWrapper').hide() });
          
      return $episodeList;
    },
    
    /*----Ep recent thumb no plot view----*/
    TVRecentThumbnail: function(eps, parentPage, options) {
      
      var $episodeList = $('<div></div>');

        $.each(eps.episodes, function(i, episode)  {
          var watched = false;  
          if (episode.playcount > 0 && !awxUI.settings.hideWatchedMark) { watched = true; }
          
          var thumb = new Image();
          if (episode.thumbnail) { thumb.src = xbmc.getThumbUrl(episode.thumbnail) };
          
          var $episode = $('<div class="thumbEpWrapper" style="display: inline">' + 
            '<div class="thumbLarge">' +
              '<div class="linkEpWrapper">' + 
                (awxUI.settings.player? '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a>' : '') +
                (awxUI.settings.enqueue? '<a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' : '') +
                '<a href="" class="unwatchedEps">' + mkf.lang.get('Unwatched',  'Tool tip') + '</a>' +
              '</div>' +
            (awxUI.settings.lazyload?
            '<img src="images/empty_thumb_tv.png" alt="' + episode.label + '" class="thumb thumbFanartLarge episode" data-original="' + thumb.src + '" />' :
            '<img src="images/empty_thumb_tv.png" alt="' + episode.label + '" class="thumbFanartLarge episode" />'
            ) +
            '' +
            '<div class="movieTitle">' +
              '<div class="recentTVshowName">' + episode.showtitle + '</div>' +
              '<span class="label">' + episode.title + (watched? '<img src="images/OverlayWatched_Small.png" class="watchedLandscape">' : '') + '</span>' +
              '<div class="recentTVtitle"><span>' + mkf.lang.get('Season',  'Label') + ' ' + episode.season + ' - ' + mkf.lang.get('Episode',  'Label') + ' ' +episode.episode + '</span></div>' +
            '</div>' +
            //'<div class="label">' + mkf.lang.get('Season',  'Label') + ' ' + episode.season + ' - ' + mkf.lang.get('Episode',  'Label') + ' ' +episode.episode + '</div>' +
            //'<div class="episodeRating"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span><div class="smallRating' + Math.round(episode.rating) + '"></div></span></div>' +
          '</div>' +
          '</div>').appendTo($episodeList);
          
          $episode.find('.play').bind('click', {idEpisode: episode.episodeid}, uiviews.EpisodePlay);
          $episode.find('.playlist').bind('click', {idEpisode: episode.episodeid}, uiviews.AddEpisodeToPlaylist);
          $episode.find('.unwatchedEps').bind('click', {idTvShow: episode.tvshowid, strTvShow: episode.showtitle, objParentPage: parentPage}, uiviews.Unwatched);
          
          if (!awxUI.settings.lazyload) {
            thumb.onload = function() { $episode.find('img.episode').attr('src', thumb.src) };
          } else {
            thumb.onload = function() { $episode.find('img.episode').attr('data-original', thumb.src) };
          };
          
        });

      $episodeList.find('.thumbLarge').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkEpWrapper').show() });
      $episodeList.find('.thumbLarge').on('mouseleave', function() { $(this).children('.linkEpWrapper').hide() });
          
      return $episodeList;
    },
    
/*----------------*/
/* Playlist views */
/*----------------*/

    /*------------------*/
    PlaylistAudioViewList: function(playlist) {
        var page = $('<div></div>');
        var $itemList = $('<ul class="fileList" id="sortable"></ul>').appendTo(page);
        var runtime = 0;
          $.each(playlist.items, function(i, item)  {
            // for files added via file function
            if (item.type != 'unknown') {
              var artist = (item.artist? item.artist : mkf.lang.get('N/A', 'Label'));
              var album = (item.album? item.album : mkf.lang.get('N/A', 'Label'));
              var label = (item.label? item.label : mkf.lang.get('N/A', 'Label'));
              var title = (item.title? item.title : label);
              //var duration = (item.duration? item.duration : '');
            } else {
              var label = (item.label? item.label : mkf.lang.get('N/A', 'Label'));
            };
            var duration = (item.duration? item.duration : '');
            var playlistItemClass = '';
            if (i%2==0) {
              playlistItemClass = 'even';
            }
            // what to about runtime and added files? console.log(runtime);
            runtime += duration;
            playlistItemCur = 'playlistItem';
            
            if (i == xbmc.periodicUpdater.curPlaylistNum && xbmc.periodicUpdater.playerStatus != 'stopped' && xbmc.activePlayerid == 0) {
              playlistItemCur = 'playlistItemCur';
              //$('#content').scrollTop($('.playlistItemCur').position().top);
            } else {
              playlistItemCur = 'playlistItem';
            }
            
            $item = $('<li class="' + playlistItemClass + '" id="apli' + i + '"><div class="folderLinkWrapper playlistItem' + i + '">' + 
              (awxUI.settings.playlist? '<a class="button remove" href="" title="' + mkf.lang.get('Remove', 'Tool tip') +  '"><span class="miniIcon remove" /></a>' +
              '<a class="button playlistmove" href="" title="' + mkf.lang.get('Swap', 'Tool tip') +  '"><span class="miniIcon playlistmove" /></a>' : '') +
              (awxUI.settings.player? '<a class="' + playlistItemCur + ' apli' + i + ' play" href="">' + (i+1) + '. ' +
              (artist? artist + ' - ' : '') + (album? album + ' - ' : '') + (title? title : label) + '&nbsp;&nbsp;&nbsp;&nbsp;' + (duration? xbmc.formatTime(duration) : '') + '</a>' :
              '<span class="label ' + playlistItemCur + ' apli' + i + '">' + (i+1) + '. ' +
              (artist? artist + ' - ' : '') + (album? album + ' - ' : '') + (title? title : label) + '&nbsp;&nbsp;&nbsp;&nbsp;' + (duration? xbmc.formatTime(duration) : '') + '</span>' ) +
              (artist? '<div class="findKeywords">' + artist[0].toLowerCase() + ' ' + album.toLowerCase() + ' ' + label.toLowerCase() + '</div>' : '' ) +
              '</div></li>').appendTo($itemList);

            //remove clear if playlist is false
            if (!awxUI.settings.playlist) { $('ul.mkfPageContextMenu > li a.clear').parent().remove() };
            $item.find('a.play').bind('click', {itemNum: i}, uiviews.PlaylistAudioItemPlay);
            $item.find('a.remove').bind('click', {itemNum: i}, uiviews.PlaylistAudioItemRemove);
          });
        
        if (runtime > 0) {
            $('<div class="playtime"><p>' + mkf.lang.get('Playlist Total:') + ' ' + xbmc.formatTime(runtime) + '</p></div>').appendTo(page);
        }
        
        
        page.find('#sortable').sortable({
          helper: 'clone',
          handle : '.playlistmove',
          update: function(event, ui) {
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Swapping playlist item...', 'Popup message with addition'));
            xbmc.swapAudioPlaylist({
              plFrom: ui.item.attr("id").replace(/[^\d]+/g, ''),
              plTo: ui.item.prevAll().length,
              onSuccess: function() {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
                // update playlist - $each classRemove classAdd new IDs?
                awxUI.onMusicPlaylistShow();
              },
              onError: function(errorText) {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 8000, mkf.messageLog.status.error);
              }
            });
          }
        });
        
      return page;
    },
    
    /*------------------*/
    PlaylistVideoViewList: function(playlist) {
        var page = $('<div></div>');
        var $itemList = $('<ul class="fileList" id="sortable"></ul>').appendTo(page);
        var runtime = 0;
          $.each(playlist.items, function(i, item)  {
            var showtitle = (item.showtitle? item.showtitle : mkf.lang.get('N/A', 'Label'));
            var title = (item.label? item.label : mkf.lang.get('N/A', 'Label'));
            var season = (item.season? item.season : mkf.lang.get('N/A', 'Label'));
            var duration  = (item.runtime? item.runtime : 0);
            if (duration != 0) {
              duration = duration * 60;
              runtime += duration;
            };
            var playlistItemClass = '';
            if (i%2==0) {
              playlistItemClass = 'even';
            };

            //initial marking of currently playing item. After periodic sets.
            if (i == xbmc.periodicUpdater.curPlaylistNum && xbmc.periodicUpdater.playerStatus != 'stopped' && xbmc.activePlayerid == 1) {
              playlistItemCur = 'playlistItemCur';
              //$('#content').scrollTop($('.fileList li:nth-child(' + i + ')').position().top);
            } else {
              playlistItemCur = 'playlistItem';
            };
            $item = $('<li class="' + playlistItemClass + '" id="vpli' + i + '"><div class="folderLinkWrapper playlistItem' + i + '">' + 
              (awxUI.settings.playlist? '<a class="button remove" href="" title="' + mkf.lang.get('Remove', 'Tool tip') +  '"><span class="miniIcon remove" /></a>'+
              '<a class="button playlistmove" href="" title="' + mkf.lang.get('Swap', 'Tool tip') +  '"><span class="miniIcon playlistmove" /></a>' : '') +
              (awxUI.settings.player? '<a class="' + playlistItemCur  + ' vpli' + i + ' play" href="">' + (i+1) + '. ' +
              (item.type=='episode'? showtitle + ' - Season ' + season + ' - ' + title : title) + (item.type=='musicvideo'? (item.artist != ''? ' - ' + item.artist[0] : '') : '') + '&nbsp;&nbsp;&nbsp;&nbsp;' + xbmc.formatTime(duration) + '</a>' :
              '<span class="label ' + playlistItemCur  + ' vpli' + i + '">' + (i+1) + '. ' +
              (item.type=='episode'? showtitle + ' - Season ' + season + ' - ' + title : title) + (item.type=='musicvideo'? (item.artist != ''? ' - ' + item.artist[0] : '') : '') + '&nbsp;&nbsp;&nbsp;&nbsp;' + xbmc.formatTime(duration) + '</span>') +
              '</div></li>').appendTo($itemList);

            //remove clear if playlist is false
            if (!awxUI.settings.playlist) { $('ul.mkfPageContextMenu > li a.clear').parent().remove() };
            $item.find('a.play').bind('click', {itemNum: i}, uiviews.PlaylistVideoItemPlay);
            $item.find('a.remove').bind('click', {itemNum: i}, uiviews.PlaylistVideoItemRemove);
          });

        if (runtime > 0) {
          $('<div class="playtime"><p>' + mkf.lang.get('Run Time:', 'Label') + xbmc.formatTime(runtime) + '</p></div>').appendTo($itemList);
        }
        
        page.find('#sortable').sortable({
          helper: 'clone',
          handle : '.playlistmove',
          update: function(event, ui) {
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Swapping playlist item...', 'Popup message with addition'));
            xbmc.swapVideoPlaylist({
              plFrom: ui.item.attr("id").replace(/[^\d]+/g, ''),
              plTo: ui.item.prevAll().length,
              onSuccess: function() {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
                // update playlist - $each classRemove classAdd new IDs?
                awxUI.onVideoPlaylistShow();
              },
              onError: function(errorText) {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('Failed!', 'Popup message addition'), 8000, mkf.messageLog.status.error);
              }
            });
          }
        });
        
      return page;    
    },
    
/*--------*/
/* Addons */
/*--------*/  
    /*----Artwork downloader----*/
    addonAD: function(e) {
      var dialogHandle = mkf.dialog.show();
      var options = {
        mode: 'custom',
        silent: true,
        mediatype: e.data.mediatype,
        dbid: e.data.dbid
      };
      
      //mediatype = tvshow, movie or musicvideo
      // http://wiki.xbmc.org/index.php?title=Add-on:Artwork_Downloader#Script_options
      var item = $('<ul class="fileList">' +
        '<li class="tworow"><a href="" class="poster">' + mkf.lang.get('Poster', 'Label') + '</a></li>' +
        '<li class="tworow"><a href="" class="fanart">' + mkf.lang.get('Fan Art', 'Label') + '</a></li>' +
        '<li class="tworow"><a href="" class="extrafanart">' + mkf.lang.get('Extra Fan Art', 'Label') + '</a></li>' +
        '<li class="tworow"><a href="" class="extrathumbs">' + mkf.lang.get('Extra Thumbnails', 'Label') + '</a></li>' +
        '<li class="tworow"><a href="" class="clearlogo">' + mkf.lang.get('Clear Logo', 'Label') + '</a></li>' +
        '<li class="tworow"><a href="" class="clearart">' + mkf.lang.get('Clear Art', 'Label') + '</a></li>' +
        (e.data.mediatype == 'tvshow'? '' : '<li class="tworow"><a href="" class="discart">' + mkf.lang.get('Disc Art', 'Label') + '</a></li>') +
        (e.data.mediatype == 'musicvideo'? '' : '<li class="tworow"><a href="" class="thumb">' + mkf.lang.get('Thumbnail', 'Label') + '</a></li>') +
        (e.data.mediatype == 'musicvideo'? '' : '<li class="tworow"><a href="" class="banner">' + mkf.lang.get('Banner', 'Label') + '</a></li>') +
        (e.data.mediatype == 'tvshow'? '<li class="tworow"><a href="" class="seasonposter">' + mkf.lang.get('Season Posters', 'Label') + '</a></li>' : '') +
        (e.data.mediatype == 'tvshow'? '<li class="tworow"><a href="" class="seasonthumb">' + mkf.lang.get('Season Thumbnails', 'Label') + '</a></li>' : '') +
        (e.data.mediatype == 'tvshow'? '<li class="tworow"><a href="" class="seasonbanner">' + mkf.lang.get('Season Banners', 'Label') + '</a></li>' : '') +
        (e.data.mediatype == 'tvshow'? '<li class="tworow"><a href="" class="characterart">' + mkf.lang.get('Character Art', 'Label') + '</a></li>' : '') +
        '<li><a href="" class="all">' + mkf.lang.get('All', 'Label') + '</a></li>' +
      '</ul>');
      
      item.find('a').click(function() {
        options.art = $(this)[0].className;
        if (options.art == 'all') { options.mode = '' };
        addons.artworkDownloader(options);
        $('#mkfDialog' + dialogHandle + ' a.close').click();
        return false;
      });
      
      mkf.dialog.setContent(dialogHandle, item);
      
      return false;
    },

/*------------*/
/* Misc views */
/*------------*/  
  
    /*----Genres list view----*/
    genresViewList: function(agenres, parentPage) {
      var lib = '';
      if (parentPage.className == 'artistsGenres') {
        lib = 'Artists';
      } else if (parentPage.className == 'albumGenres') {
        lib = 'Albums';
      } else if (parentPage.className == 'songGenres') {
        lib = 'Songs';
      } else if (parentPage.className == 'movieGenres') {
        lib = 'Movies';
      } else if (parentPage.className == 'tvShowsGenres') {
        lib = 'TvShows';
      } else if (parentPage.className == 'musicVideosGenres') {
        lib = 'MusicVideos';
      };
      
      var $genresList = $('<ul class="fileList"></ul>');
      $.each(agenres.genres, function(i, genre)  {
        if (genre.genreid == 0) { return };
        $genresList.append('<li' + (i%2==0? ' class="even"': '') + 
                  //'><div class="folderLinkWrapper"><a href="" class="button allgenre' + genre.genreid + '" title="' + mkf.lang.get('All Albums', 'Label') +
                  '><div class="folderLinkWrapper">' +
                  (awxUI.settings.enqueue? '<a href="" class="button playlist' + genre.genreid + '" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' : '') +
                  (awxUI.settings.player? '<a href="" class="button play' + genre.genreid + '" title="' + mkf.lang.get('Play', 'Tool tip') + '"><span class="miniIcon play" /></a>' : '') +
                  '<a href="" class="genre' + genre.genreid + '">' + genre.label + '<div class="findKeywords">' + genre.label.toLowerCase() + '</div>' + '</a>' +
                  '</div></li>');
        //$genresList.find('.allgenre' + genre.genreid).on('click', {idGenre: genre.genreid, strGenre: genre.label, objParentPage: parentPage}, uiviews.AllGenreAlbums);
        $genresList.find('.genre' + genre.genreid).on('click',{idGenre: genre.genreid, strGenre: genre.label, objParentPage: parentPage, lib: lib}, uiviews.GenreItems);
        $genresList.find('.playlist' + genre.genreid).on('click', {idGenre: genre.genreid}, uiviews.AddGenreToPlaylist);
        $genresList.find('.play' + genre.genreid).on('click', {idGenre: genre.genreid, strAlbum: genre.label}, uiviews.MusicGenrePlay);
      });
      return $genresList;
    },
    
    /*----Years list view----*/
    YearsViewList: function(years, parentPage) {
      var lib = '';
      if (parentPage.className == 'albumsYears') {
        lib = 'Albums';
      } else if (parentPage.className == 'songsYears') {
        lib = 'Songs';
      } else if (parentPage.className == 'movieYears') {
        lib = 'Movies';
      } else if (parentPage.className == 'tvShowsYears') {
        lib = 'TvShows';
      } else if (parentPage.className == 'musicVideosYears') {
        lib = 'MusicVideos';
      };
      
      var $yearsList = $('<ul class="fileList"></ul>');
      $.each(years.files, function(i, year)  {
        if (year == '0') { return };
        $yearsList.append('<li' + (i%2==0? ' class="even"': '') + 
                  '><div class="folderLinkWrapper"><a href="" class="year' + 
                  year.label + '">' +
                  year.label + '<div class="findKeywords">' + year.label.toLowerCase() + '</div>' +
                  '</a></div></li>');

                  $yearsList.find('.year' + year.label).on('click', {strYear: year.label, lib: lib, objParentPage: parentPage}, uiviews.YearsItems);
      });
      return $yearsList;
    },
    
    /*----Tags list view----*/
    TagsViewList: function(tags, parentPage) {
      var lib = '';
      if (parentPage.className == 'movieTags') {
        lib = 'Movies';
      } else if (parentPage.className == 'tvShowsTags') {
        lib = 'TvShows';
      } else if (parentPage.className == 'musicVideosTags') {
        lib = 'MusicVideos';
      };
      
      var $tagsList = $('<ul class="fileList"></ul>');
      $.each(tags.files, function(i, tag)  {
        if (tag == '0') { return };
        $tagsList.append('<li' + (i%2==0? ' class="even"': '') + 
                  '><div class="folderLinkWrapper"><a href="" class="tag' + 
                  tag.id + '">' +
                  tag.label + '<div class="findKeywords">' + tag.label.toLowerCase() + '</div>' +
                  '</a></div></li>');
        $tagsList.find('.tag' + tag.id).on('click', {strTag: tag.label, lib: lib, objParentPage: parentPage}, uiviews.TagsItems);
      });
      return $tagsList;
    },
    
    /*----Addons list view----*/
    AddonsViewList: function(type, parentPage) {
      
      var $addonsList = $('<div class="addons" style="padding: 5px"></div>');
      
      if (type == 'video' && xbmc.addons.artwork) {
        $('<div class="addon artwork">' +
            '<div class="thumbWrapper"><div class="linkWrapper">' + 
              '<a href="" class="run">' + mkf.lang.get('Run Addon', 'Label') + '</a>' +
              '<a href="" class="adcustomrun">' + mkf.lang.get('Custom Run', 'Label') + '</a>' +
            '</div>' +
            '<img src="' + xbmc.getThumbUrl(xbmc.addons.artwork.thumb) +'" alt="' + xbmc.addons.artwork.name + '" class="thumb addon" />' +
            '<span class="label">' + xbmc.addons.artwork.name + '</span>' +
          '</div></div>').appendTo($addonsList);
          
        $addonsList.find('.artwork a.run').on('click', function() { addons.exeAddon({addonid: 'script.artwork.downloader'}); return false; });
        $addonsList.find('a.adcustomrun').on('click', function() {
          var dialogContent = $('<div><ul class="fileList">' +
            '<li class="tworow"><a href="" class="poster">' + mkf.lang.get('Poster', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="fanart">' + mkf.lang.get('Fan Art', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="extrafanart">' + mkf.lang.get('Extra Fan Art', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="extrathumbs">' + mkf.lang.get('Extra Thumbnails', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="clearlogo">' + mkf.lang.get('Clear Logo', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="clearart">' + mkf.lang.get('Clear Art', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="discart">' + mkf.lang.get('Disc Art', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="thumb">' + mkf.lang.get('Thumbnail', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="banner">' + mkf.lang.get('Banner', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="seasonposter">' + mkf.lang.get('Season Posters', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="seasonthumb">' + mkf.lang.get('Season Thumbnails', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="seasonbanner">' + mkf.lang.get('Season Banners', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="characterart">' + mkf.lang.get('Character Art', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="all">' + mkf.lang.get('All', 'Label') + '</a></li>' +
          '</ul></div>');
          
          dialogContent.find('a').click(function() {
            var options = {
              mode: 'custom',
              silent: true,
            };
            options.art = $(this)[0].className;
            if (options.art == 'all') { options.mode = '' };
            addons.artworkDownloader(options);
            $('#mkfDialog' + dialogHandle + ' a.close').click();
            return false;
          });
          var dialogHandle = mkf.dialog.show({content: dialogContent});
          
          return false;
        });
      };
      
      if (type == 'video' && xbmc.addons.youtube) {
        $('<div class="addon youtube">' +
            '<div class="thumbWrapper">' +
              '<div class="linkWrapper">' + 
              '<a href="" class="run">' + mkf.lang.get('Run Addon', 'Label') + '</a>' +
              '<a href="" class="playurl">' + mkf.lang.get('Play URL', 'Label') + '</a>' +
              '<a href="" class="enqurl">' + mkf.lang.get('Enqueue URL', 'Label') + '</a>' +
              '</div>' +
            '<img src="' + xbmc.getThumbUrl(xbmc.addons.youtube.thumb) +'" alt="' + xbmc.addons.youtube.name + '" class="thumb addon" />' +
            
            '<span class="label">' + xbmc.addons.youtube.name + '</span>' +
          '</div>' +
        '<div class="youtubeurlplay" style="display: none; position: absolute; top: 80px; left: 155px;"><form name="youtubeplay" id="youtubeplay"><input id="ytplay" type="text" style="width: 300px"><input type="submit" value="' + mkf.lang.get('Play', 'Tool tip') + '"><a href="" class="close"></a></form></div>' +
        '<div class="youtubeurlenq" style="display: none; position: absolute; top: 115px; left: 155px;"><form name="youtubeenq" id="youtubeenq"><input id="ytenq" type="text" style="width: 300px"><input type="submit" value="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><a href="" class="close"></a></form></div>' +
        '</div>').appendTo($addonsList);
        
        $addonsList.find('a.close').on('click', function() {
          if ($(this).parent()[0].id =='youtubeplay') {
            $addonsList.find('div.youtubeurlplay').hide();
          } else {
            $addonsList.find('div.youtubeurlenq').hide();
          }
          return false;
        });
        $addonsList.find('.youtube a.run').on('click', function() { addons.exeAddon({addonid: 'plugin.video.youtube'}); return false; });
        $addonsList.find('a.playurl').on('click', function() {
          //Show input box
          $addonsList.find('div.youtubeurlplay').show();
          $addonsList.find('form#youtubeplay').on('submit', function() {
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));
            //Grab you tube id and make playable uri.
            var ytid = $('input#ytplay').val().substr($('input#ytplay').val().lastIndexOf("=") + 1);
            var fullURL = 'plugin://plugin.video.youtube/?action=play_video&videoid=' + ytid;
            
            xbmc.playerOpen({
              item: 'file',
              itemStr: fullURL,
              onSuccess: function() {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
                $addonsList.find('div.youtubeurlplay').hide();
              },
              onError: function(errorText) {
                mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
              }
            });
            return false;
          });
          
          return false;
        });
        
        $addonsList.find('a.enqurl').on('click', function() {
          $addonsList.find('div.youtubeurlenq').show();
          $addonsList.find('form#youtubeenq').on('submit', function() {
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Adding to playlist...', 'Popup message with addition'));
            console.log($('input#ytenq').val().substr($('input#ytenq').val().lastIndexOf("=") + 1))
            var ytid = $('input#ytenq').val().substr($('input#ytenq').val().lastIndexOf("=") + 1);
            var fullURL = 'plugin://plugin.video.youtube/?action=play_video&videoid=' + ytid;
            
            xbmc.addVideoFileToPlaylist({
              file: fullURL,
              onSuccess: function() {
                mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
                $addonsList.find('div.youtubeurlenq').hide();
              },
              onError: function(errorText) {
                mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
              }
            });
            return false;
          });
          
          return false;
        });
      };
      
      if (type == 'audio' && xbmc.addons.cdart) {
        $('<div class="addon cdart">' +
          '<div class="thumbWrapper"><div class="linkWrapper">' + 
              '<a href="" class="run">' + mkf.lang.get('Run Addon', 'Label') + '</a>' +
              '<a href="" class="cdcustomrun">' + mkf.lang.get('Custom Run', 'Label') + '</a>' +
            '</div>' +
            '<img src="' + xbmc.getThumbUrl(xbmc.addons.cdart.thumb) +'" alt="' + xbmc.addons.cdart.name + '" class="thumb addon" />' +
            '<span class="label">' + xbmc.addons.cdart.name + '</span>' +
        '</div></div>').appendTo($addonsList);
        
        $addonsList.find('.cdart a.run').on('click', function() { addons.exeAddon({addonid: 'script.cdartmanager'}); return false; });
        $addonsList.find('a.cdcustomrun').on('click', function() {
          var dialogContent = $('<div><ul class="fileList">' +
            '<li class="tworow"><a href="" class="autocdart">' + mkf.lang.get('CD Arts', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="autocover">' + mkf.lang.get('Covers', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="autofanart">' + mkf.lang.get('Fan Arts', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="autologo">' + mkf.lang.get('Logos', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="autothumb">' + mkf.lang.get('Thumbnails', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="autoall">' + mkf.lang.get('All Arts', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="update">' + mkf.lang.get('Update Database', 'Label') + '</a></li>' +
            '<li class="tworow"><a href="" class="database">' + mkf.lang.get('(Re)build Database', 'Label') + '</a></li>' +
          '</ul></div>');
          
          dialogContent.find('a').click(function() {
            var mode = '"' + $(this)[0].className + '"';
            //if (options.art == 'all') { options.mode = '' };
            addons.cdart(mode);
            $('#mkfDialog' + dialogHandle + ' a.close').click();
            return false;
          });
          var dialogHandle = mkf.dialog.show({content: dialogContent});
          
          return false;
        });
      };
      
      if (type == 'audio' && xbmc.addons.culrclyrics) {
        $('<div class="addon culrclyrics">' +
          '<div class="thumbWrapper"><div class="linkWrapper">' + 
              '<a href="" class="run">' + mkf.lang.get('Run Addon', 'Label') + '</a>' +
            '</div>' +
            '<img src="' + xbmc.getThumbUrl(xbmc.addons.culrclyrics.thumb) +'" alt="' + xbmc.addons.culrclyrics.name + '" class="thumb addon" />' +
            '<span class="label">' + xbmc.addons.culrclyrics.name + '</span>' +
        '</div></div>').appendTo($addonsList);
        
        $addonsList.find('.culrclyrics a.run').on('click', function() {
          /*var dialogContent = $('<div id="lyricContent"><div id="lyricInfo"></div><div id="lyrics"></div></div>');
          xbmc.lyrics = (xbmc.lyrics? false : true);
          if (xbmc.lyrics) { addons.culrcLyrics(); };
          
          var dialogHandle = mkf.dialog.show({content: dialogContent});*/
          xbmc.lyrics = (xbmc.lyrics? false : true);
          if (xbmc.lyrics) { addons.culrcLyrics(); };
          xbmc.fullScreen(true);
          $('div#lyricContent').show();
          return false;
        });
      };
      
      $('<div class="addon">' +
        '<div style="font-size: 1.2em; margin-left: 10px; margin-top: 50px">' + mkf.lang.get('See Files->Addons for playable content.') + '</div>' +
      '</div>').appendTo($addonsList);
      
      $addonsList.find('.thumbWrapper').on(awxUI.settings.hoverOrClick, function() { $(this).children('.linkWrapper').show() });
      $addonsList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkWrapper').hide() });
      
      return $addonsList;
    },
    
    /*----Kodi Settings----*/
    kodiSettings: function(e) {
      //var dialogHandle = mkf.dialog.show();
      var dialogContent = $('<div id="kodiSettings"><ul id="kodiSettingsSections"></ul></div>');
      
      var loadAddons = function(type, setting, allowEmpty) {
        //Because of a bug pre-Isengard change xbmc.audioencoder type to unknown and parse out unwanted results after.
        var wasAudioencoder = false;
        if (type == 'xbmc.audioencoder') { 
          type = 'unknown';
          wasAudioencoder = true;
        }
        
        addons.getAddons({
          type: type,
          onSuccess: function(result) {
            var dialogAddonsHandle = mkf.dialog.show();
            var dialogAddonsContent = $('<div><div>Available Addons</div></div>');
            
            //Parse out unwanted types.
            if (wasAudioencoder) {
              $.each(result.addons, function(idx, addon) {
                if(addon.type != 'xbmc.audioencoder') {
                  result.addons = result.addons.filter(function(el) {
                    return el.type == 'xbmc.audioencoder';
                  });
                }
              });
            }
            
            if (allowEmpty) {
              //Create an empty option
              result.addons.push({
                addonid: 'None',
                author: 'None',
                name: 'None',
                thumbnail: '',
                type: type,
                version: "0.0"
              });
            }
            
            $.each(result.addons, function(idx, addon) {
              dialogAddonsContent.append('<div class="addonsList"><div class="switchTo"><a href="#" id="' + addon.addonid.replace(/\./g,'-') + '">' + mkf.lang.get('Select', 'Tool tip') + '</a></div><img src="' + (addon.thumbnail == ''? 'images/emptyAddon.png' : xbmc.getThumbUrl(addon.thumbnail)) + '" class="">' +
                '<div class="movieinfo"><span class="label">Name:</span><span class="value">' + addon.name + '</span></div>' +
                '<div class="movieinfo"><span class="label">Author:</span><span class="value">' + addon.author + '</span></div>' +
                '<div class="movieinfo"><span class="label">Version:</span><span class="value">' + addon.version + '</span></div>' +
                //'<div class="switchTo"><a href="#" id="' + addon.addonid.replace(/\./g,'-') + '">Use</a></div>' +
                '</div>');
                
                dialogAddonsContent.find('a#'+ addon.addonid.replace(/\./g,'-')).button().on('click', function() {
                  xbmc.setSettingValue({
                    setting: setting,
                    value: (addon.addonid == 'None'? '' : addon.addonid),
                    onSuccess: function() {
                      mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                      //As we get a Yes/No box on skin changes, wait a sec then left, select to confirm.
                      if (type == 'xbmc.gui.skin') {
                        setTimeout(
                          xbmc.sendBatch({
                            batch: ['{"jsonrpc": "2.0", "method": "Input.Left", "id": "skinInputLeft"},{"jsonrpc": "2.0", "method": "Input.Select", "id": "skinInputSelect"}'],
                            onSuccess: function(result) {
                              console.log(result);
                            },
                            onError: function(result) {
                              console.log(result);
                            }
                          })
                        , 1500);
                      }
                      //Close window
                      //dialogAddonsContent.parent().find('a.close').click();
                      mkf.dialog.close(dialogAddonsHandle);
                    },
                    onError: function() {
                      mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                    }
                  });
                });
            });
            mkf.dialog.setContent(dialogAddonsHandle, dialogAddonsContent);
            return false;
          },
          onError: function() {
            console.log('failed to get addon list');
          }        
        });
      }
      
      var loadSettings = function(ui) {
        var tab = ui.newPanel;
        //console.log(ui.newPanel.parent().parent()[0].id);
        //console.log(ui.newPanel[0].id);
        xbmc.getSettings({
          section: ui.newPanel.parent().parent()[0].id,
          category: ui.newPanel[0].id,
          onSuccess: function(result) {
            tab.empty();
            $.each(result.settings, function(idx, setting) {
              switch (setting.control.type) {
                case 'spinner':
                  if (setting.type == 'string') {
                    tab.append('<div class="kodiSetting"><label for="' + setting.id.replace(/\./g,'-') + '">' + setting.label + ':</label><select class="KsettingSpin" id="' + setting.id.replace(/\./g,'-') + '" name="' + setting.id.replace(/\./g,'-') + '"></select><button id="' + setting.id.replace(/\./g,'-') + '-save">Save</button><button title="' + setting.default + '" id="' + setting.id.replace(/\./g,'-') + '-default">Default</button></div>');
                    if (typeof setting.options !== 'undefined') {
                      $.each(setting.options, function(idx, option) {
                        tab.find('select#' + setting.id.replace(/\./g,'-')).append('<option value="' + option.value + '"' + (option.value == setting.value? 'selected' : '') + '>' + option.label + '</option>');
                      });
                    }
                  } else if (setting.type == 'integer' && typeof setting.options !== 'undefined') {
                    //Int value but with no logical stepping so select it is.
                    tab.append('<div class="kodiSetting"><label for="' + setting.id.replace(/\./g,'-') + '">' + setting.label + ':</label><select class="KsettingSpin" id="' + setting.id.replace(/\./g,'-') + '" name="' + setting.id.replace(/\./g,'-') + '"></select><button id="' + setting.id.replace(/\./g,'-') + '-save">Save</button><button title="' + setting.default + '" id="' + setting.id.replace(/\./g,'-') + '-default">Default</button></div>');
                    if (typeof setting.options !== 'undefined') {
                      $.each(setting.options, function(idx, option) {
                        tab.find('select#' + setting.id.replace(/\./g,'-')).append('<option value="' + option.value + '"' + (option.value == setting.value? 'selected' : '') + '>' + option.label + '</option>');
                      });
                    }
                  } else {
                    //Assume number
                    tab.append('<div class="kodiSetting"><label for="' + setting.id.replace(/\./g,'-') + '">' + setting.label + ':</label><input class="KsettingSpin" id="' + setting.id.replace(/\./g,'-') + '" name="' + setting.id.replace(/\./g,'-') + '" value="' + setting.value + '"><button id="' + setting.id.replace(/\./g,'-') + '-save">Save</button><button title="' + setting.default + '" id="' + setting.id.replace(/\./g,'-') + '-default">Default</button></div>');
                    var spinner = tab.find('input#' + setting.id.replace(/\./g,'-')).spinner();
                    if (typeof setting.maximum !=='undefined') { spinner.spinner('option', 'max', setting.maximum); }
                    if (typeof setting.minimum !=='undefined') { spinner.spinner('option', 'min', setting.minimum); }
                    if (typeof setting.step !=='undefined') { spinner.spinner('option', 'step', setting.step); }
                    
                    tab.find('button#' + setting.id.replace(/\./g,'-') + '-save').on('click', function() {
                      var sendValue = $(this).parent().find('input#' + setting.id.replace(/\./g,'-')).val();
                      xbmc.setSettingValue({
                        setting: setting.id,
                        value: sendValue,
                        onSuccess: function() {
                          mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                        },
                        onError: function() {
                          mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                        }
                      });
                    });
                    tab.find('button#' + setting.id.replace(/\./g,'-') + '-default').on('click', function() {
                      xbmc.setSettingValue({
                        setting: setting.id,
                        value: setting.default,
                        onSuccess: function() {
                          mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                        },
                        onError: function() {
                          mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                        }
                      });
                    });
                  }
                  tab.find('button#' + setting.id.replace(/\./g,'-') + '-save').on('click', function() {
                    var sendValue = $(this).parent().find('select#' + setting.id.replace(/\./g,'-')).val();
                    xbmc.setSettingValue({
                      setting: setting.id,
                      value: sendValue,
                      onSuccess: function() {
                        mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                      },
                      onError: function() {
                        mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                      }
                    });
                  });
                  tab.find('button#' + setting.id.replace(/\./g,'-') + '-default').on('click', function() {
                    xbmc.setSettingValue({
                      setting: setting.id,
                      value: setting.default,
                      onSuccess: function() {
                        mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                      },
                      onError: function() {
                        mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                      }
                    });
                  });
                break;
                
                case 'checkmark':
                  tab.append('<div class="kodiSetting"><label for="' + setting.id.replace(/\./g,'-') + '">' + setting.label + ':</label><input class="KsettingCheck" id="' + setting.id.replace(/\./g,'-') + '" name="' + setting.id.replace(/\./g,'-') + '" type="checkbox" value="' + setting.value + '" ' + (setting.value? 'checked' : '') + '><button id="' + setting.id.replace(/\./g,'-') + '-save">Save</button><button title="' + setting.default + '" id="' + setting.id.replace(/\./g,'-') + '-default">Default</button></div>');
                  tab.find('button#' + setting.id.replace(/\./g,'-') + '-save').on('click', function() {
                    var sendValue = $(this).parent().find('input#' + setting.id.replace(/\./g,'-')).is(':checked');
                    xbmc.setSettingValue({
                      setting: setting.id,
                      value: sendValue,
                      onSuccess: function() {
                        mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                      },
                      onError: function() {
                        mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                      }
                    });
                  });
                  tab.find('button#' + setting.id.replace(/\./g,'-') + '-default').on('click', function() {
                    xbmc.setSettingValue({
                      setting: setting.id,
                      value: setting.default,
                      onSuccess: function() {
                      mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                      },
                      onError: function() {
                        mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                      }
                    });
                  });
                break;
                
                case 'toggle':
                  tab.append('<div class="kodiSetting"><label for="' + setting.id.replace(/\./g,'-') + '">' + setting.label + ':</label><input class="KsettingCheck" id="' + setting.id.replace(/\./g,'-') + '" name="' + setting.id.replace(/\./g,'-') + '" type="checkbox" value="' + setting.value + '" ' + (setting.value? 'checked' : '') + '><button id="' + setting.id.replace(/\./g,'-') + '-save">Save</button><button title="' + setting.default + '" id="' + setting.id.replace(/\./g,'-') + '-default">Default</button></div>');
                  tab.find('button#' + setting.id.replace(/\./g,'-') + '-save').on('click', function() {
                    var sendValue = $(this).parent().find('input#' + setting.id.replace(/\./g,'-')).is(':checked');
                    xbmc.setSettingValue({
                      setting: setting.id,
                      value: sendValue,
                      onSuccess: function() {
                      mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                      },
                      onError: function() {
                        mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                      }
                    });
                  });
                  tab.find('button#' + setting.id.replace(/\./g,'-') + '-default').on('click', function() {
                    xbmc.setSettingValue({
                      setting: setting.id,
                      value: setting.default,
                      onSuccess: function() {
                      mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                      },
                      onError: function() {
                        mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                      }
                    });
                  });
                break;
                
                case 'edit':
                  tab.append('<div class="kodiSetting"><label for="' + setting.id.replace(/\./g,'-') + '">' + setting.label + ':</label><input class="KsettingEdit" id="' + setting.id.replace(/\./g,'-') + '" name="' + setting.id.replace(/\./g,'-') + '" type="text" value="' + setting.value + '"><button id="' + setting.id.replace(/\./g,'-') + '-save">Save</button><button title="' + setting.default + '" id="' + setting.id.replace(/\./g,'-') + '-default">Default</button></div>');
                  tab.find('button#' + setting.id.replace(/\./g,'-') + '-save').on('click', function() {
                    var sendValue = $(this).parent().find('input#' + setting.id.replace(/\./g,'-')).is(':checked');
                    xbmc.setSettingValue({
                      setting: setting.id,
                      value: sendValue
                    });
                    mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                  });
                  tab.find('button#' + setting.id.replace(/\./g,'-') + '-default').on('click', function() {
                    xbmc.setSettingValue({
                      setting: setting.id,
                      value: setting.default,
                      onSuccess: function() {
                      mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                      },
                      onError: function() {
                        mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                      }
                    });
                  });
                break;
                
                case 'button':
                  switch (setting.control.format) {
                    case 'addon':
                      tab.append('<div class="kodiSetting"><label for="' + setting.id.replace(/\./g,'-') + '">' + setting.label + ':</label><input class="KsettingButton" id="' + setting.id.replace(/\./g,'-') + '" name="' + setting.id.replace(/\./g,'-') + '" type="button" value="' + setting.value + '"><button title="' + setting.default + '" id="' + setting.id.replace(/\./g,'-') + '-default">Default</button></div>');
                      tab.find('input#' + setting.id.replace(/\./g,'-')).click(function() {
                        loadAddons(setting.addontype, setting.id, setting.allowempty);
                      });
                    break;
                    
                    case 'path':
                      tab.append('<div class="kodiSetting"><label for="' + setting.id.replace(/\./g,'-') + '">' + setting.label + ':</label><input class="KsettingPath" id="' + setting.id.replace(/\./g,'-') + '" name="' + setting.id.replace(/\./g,'-') + '" type="text" value="' + setting.value + '"><button id="' + setting.id.replace(/\./g,'-') + '-save">Save</button><button title="' + setting.default + '" id="' + setting.id.replace(/\./g,'-') + '-default">Default</button></div>');

                      tab.find('button#' + setting.id.replace(/\./g,'-') + '-save').on('click', function() {
                        var sendValue = $(this).parent().find('input#' + setting.id.replace(/\./g,'-')).val();
                        console.log(typeof sendValue);
                        //if (sendValue.length > 1 && typeof setting.delimiter !== 'undefined') { sendValue = sendValue.join(setting.delimiter).toString() }
                        //sendValue = sendValue.join(setting.delimiter).toString();
                        xbmc.setSettingValue({
                          setting: setting.id,
                          value: sendValue,
                          onSuccess: function() {
                            mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                          },
                          onError: function() {
                            mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                          }
                        });
                      });
                      tab.find('button#' + setting.id.replace(/\./g,'-') + '-default').on('click', function() {
                        xbmc.setSettingValue({
                          setting: setting.id,
                          value: setting.default,
                          onSuccess: function() {
                            mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                          },
                          onError: function() {
                            mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                          }
                        });
                      });
                      
                    break;
                    
                    default:
                      if (typeof setting.value === 'undefined' || setting.value == '' && setting.control.format == 'action') {
                        //We can do nothing with these!
                      } else {
                        tab.append('<div class="kodiSetting"><label for="' + setting.id.replace(/\./g,'-') + '">' + setting.label + ':</label><input class="KsettingButton" id="' + setting.id.replace(/\./g,'-') + '" name="' + setting.id.replace(/\./g,'-') + '" type="button" value="' + setting.value + '"><button id="' + setting.id.replace(/\./g,'-') + '-save">Save</button><button title="' + setting.default + '" id="' + setting.id.replace(/\./g,'-') + '-default">Default</button></div>');
                        tab.find('button#' + setting.id.replace(/\./g,'-') + '-save').on('click', function() {
                          var sendValue = $(this).parent().find('input#' + setting.id.replace(/\./g,'-')).is(':checked');
                          xbmc.setSettingValue({
                            setting: setting.id,
                            value: sendValue,
                            onSuccess: function() {
                              mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                            },
                            onError: function() {
                              mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                            }
                          });
                        });
                        tab.find('button#' + setting.id.replace(/\./g,'-') + '-default').on('click', function() {
                          xbmc.setSettingValue({
                            setting: setting.id,
                            value: setting.default,
                            onSuccess: function() {
                              mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                            },
                            onError: function() {
                              mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                            }
                          });
                        });
                      }
                    break;
                  }                
                break;
                
                case 'list':
                  tab.append('<div class="kodiSetting"><label for="' + setting.id.replace(/\./g,'-') + '">' + setting.label + ':</label><select class="KsettingList" id="' + setting.id.replace(/\./g,'-') + '" name="' + setting.id.replace(/\./g,'-') + '" ' + (setting.control.multiselect? 'multiple' : '') + '></select><button id="' + setting.id.replace(/\./g,'-') + '-save">Save</button><button title="' + setting.default + '" id="' + setting.id.replace(/\./g,'-') + '-default">Default</button></div>');
                  if (typeof setting.options !== 'undefined') {
                    $.each(setting.options, function(idx, option) {
                      tab.find('select#' + setting.id.replace(/\./g,'-')).append('<option value="' + option.value + '"' + (option.value == setting.value? 'selected' : '') + '>' + option.label + '</option>');
                    });
                  } else if (typeof setting.definition !== 'undefined') {
                    $.each(setting.definition.options, function(idx, option) {
                      if (setting.control.multiselect) {
                        tab.find('select#' + setting.id.replace(/\./g,'-')).append('<option value="' + option.value + '"' + ($.inArray(option.value, setting.value) !==-1? 'selected' : '') + '>' + option.label + '</option>');
                      } else {
                        tab.find('select#' + setting.id.replace(/\./g,'-')).append('<option value="' + option.value + '"' + (option.value == setting.value? 'selected' : '') + '>' + option.label + '</option>');
                      }
                    });
                  }
                  tab.find('button#' + setting.id.replace(/\./g,'-') + '-save').on('click', function() {
                    var sendValue = $(this).parent().find('select#' + setting.id.replace(/\./g,'-')).val();
                    console.log(typeof sendValue);
                    //if (sendValue.length > 1 && typeof setting.delimiter !== 'undefined') { sendValue = sendValue.join(setting.delimiter).toString() }
                    //sendValue = sendValue.join(setting.delimiter).toString();
                    console.log(typeof sendValue);
                    xbmc.setSettingValue({
                      setting: setting.id,
                      value: sendValue,
                      onSuccess: function() {
                        mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                      },
                      onError: function() {
                        mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                      }
                    });
                    tab.find('button#' + setting.id.replace(/\./g,'-') + '-default').on('click', function() {
                      xbmc.setSettingValue({
                        setting: setting.id,
                        value: setting.default,
                        onSuccess: function() {
                          mkf.messageLog.show(mkf.lang.get('Saved Kodi setting', 'Popup message'), mkf.messageLog.status.success, 3000);
                        },
                        onError: function() {
                          mkf.messageLog.show(mkf.lang.get('Failed to save Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
                        }
                      });
                    });
                  });
                break;
                
                case 'slider':
                  tab.append('<div class="kodiSetting">' + setting.label + ': ' + setting.value + '<button id="' + setting.id.replace(/\./g,'-') + '-save" disabled>Save</button><button title="' + setting.default + '" id="' + setting.id.replace(/\./g,'-') + '-default" disabled>Default</button></div>');
                break;
                
                case 'range':
                  tab.append('<div class="kodiSetting"><label for="' + setting.id.replace(/\./g,'-') + '">' + setting.label + ':</label><input class="KsettingRange" id="' + setting.id.replace(/\./g,'-') + '" name="' + setting.id.replace(/\./g,'-') + '" type="range" value="' + setting.value + '" disabled><button id="' + setting.id.replace(/\./g,'-') + '-save">Save</button><button title="' + setting.default + '" id="' + setting.id.replace(/\./g,'-') + '-default" disabled>Default</button></div>');
                break;

                default:
                  tab.append('<div class="kodiSetting">' + setting.label + ': ' + setting.value + '<button id="' + setting.id.replace(/\./g,'-') + '-save" disabled>Save</button><button title="' + setting.default + '" id="' + setting.id.replace(/\./g,'-') + '-default" disabled>Default</button></div>');
              }
            });
            tab.find('input[type=text]').blur(function() {
              if (inputControls) {
                xbmc.inputKeys('on');
              }
            }).focus(function() {
              if (awxUI.settings.remoteActive && awxUI.settings.inputKey > 0) {
                inputControls = true;
                xbmc.inputKeys('off');
              }
            });
          },
          onError: function(result) {
            mkf.messageLog.show(mkf.lang.get('Failed to load Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
          }
        });
        
      }
      
      var loadCategories = function(ui) {
        //console.log(ui);
        var tab = ui.newPanel;
        xbmc.getSettingsCategories({
        section: ui.newPanel[0].id,
        onSuccess: function(result) {
          //console.log(result.categories);
          tab.empty();
          tab.append('<div class="' + ui.newPanel[0].id + 'Cat"><ul></ul></div>');
          
          var catTab = tab.find('div.' + ui.newPanel[0].id + 'Cat').tabs({
            activate: function(e, ui) {
              loadSettings(ui);
            }
          });
          
          $.each(result.categories, function(idx, category) {
            tab.find('ul').append('<li><a href="#' + category.id + '">' + category.label + '</a></li>');
            tab.children().append('<div id="' + category.id + '"></div>');
            catTab.tabs('refresh');
          });

          catTab.tabs({active: 0});
        },
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed to load Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
        }
        });
      }
      
      xbmc.getSettingsSections({
        onSuccess: function(result) {
          //var dialogContent = $('<div id="kodiSettings"><ul id="kodiSettingsSections"></ul></div>');
          var sectionTabs = dialogContent.find('#kodiSettingsSections').parent().tabs({
            activate: function(e, ui) {
              loadCategories(ui);
            }
          });
          $.each(result.sections, function(idx, section) {
            dialogContent.find('ul#kodiSettingsSections').append('<li><a href="#' + section.id + '">' + section.label + '</a></li>');
            dialogContent.append('<div id="' + section.id + '"></div>');
            
            sectionTabs.tabs('refresh');
            
          });
          sectionTabs.tabs({active: 0});
          //mkf.dialog.setContent(dialogHandle, dialogContent);
          //return false;
          
        },
        onError: function() {
          mkf.messageLog.show(mkf.lang.get('Failed to load Kodi settings!', 'Popup message'), mkf.messageLog.status.error, 5000);
          //mkf.dialog.close(dialogHandle);
        }
      });
            
      //return false;
      return dialogContent;
    },
    
    /*-----------*/
    AdvancedSearch: function(search, parentPage) {
      
      var fillOptions = function(fields, ops, num) {
        page.find('select#searchFields' + num).children().remove();
        $.each(fields, function(i, field) {
          page.find('select#searchFields' + num).append('<option value=' + field + '>' + field + '</option>');
        });
        page.find('select#searchOps' + num).children().remove();
        $.each(ops, function(i, op) {
          page.find('select#searchOps' + num).append('<option value=' + op + '>' + op + '</option>');
        });  
      };

      var addItem = function() {
        if (search == 'video') {
          vn += 1;
          var indentLev = vindentLevel;
          //Create a value from n that won't change.
          var i = vn;
          var searchLib = vsearchLib;
        } else if (search == 'audio') {
          an += 1;
          var indentLev = aindentLevel;
          //Create a value from n that won't change.
          var i = an;
          var searchLib = asearchLib;          
        };
        var searchBlock = $('<div class="searchDiv' + (indentLev >0? ' indent' + indentLev + '">' : '">') +
          '<div class="searchCom">' + (i != 0? '<a href="" class="groupOpen"><span class="advsearch open" /></a> <a href="" class="groupClose"><span class="advsearch close" /></a>' : '') +
          '<div class="searchFieldset">' +
          '<fieldset class="searchBlock">' +
          '<legend>' + mkf.lang.get('Field', 'Label') + '</legend>' +
          '<select id="searchFields' + i + '" name="searchFields' + i + '"></select>' +
          '</fieldset>' +
          '<fieldset class="searchBlock">' +
          '<legend>' + mkf.lang.get('Operator', 'Label') + '</legend>' +
          '<select id="searchOps' + i + '" name="searchOps' + i + '"></select>' +
          '</fieldset>' +
          '<fieldset>' +
          '<legend>' + mkf.lang.get('Search For', 'Label') + '</legend>' +
          '<input type="text" id="searchTerms' + i + '" name="searchTerms' + i + '" style="width: 100%" />' +
          '</fieldset>' +
          '</div>' +
          '<select id="searchAndOr' + i + '" name="searchAndOr' + i + '" style="width: 70px; clear: both; display: none;"></select>' +
          '</div>');

        page.find('input#search').before(searchBlock);
        searchBlock.find('a.groupOpen').on('click', {num: i}, groupOpen);
        searchBlock.find('a.groupClose').on('click', {num: i}, groupClose);
        
        if (i == 2) {
          searchBlock.prevAll('.searchDiv:first').find('select').append('<option value="and">' + mkf.lang.get('and', 'Label') + '</option><option value="or">' + mkf.lang.get('or', 'Label') + '</option>');
          searchBlock.prevAll('.searchDiv:first').find('select').show();
        };

        fillOptions(eval('searchFields' + searchLib), eval('searchOps' + searchLib), i);
        return false;
      };
      
      var groupOpen = function(e) {
        var prevFieldSet = $(this).parent().parent();
        if (search == 'video') {
          vindentLevel += 1;
          var indentLevel = vindentLevel;
        } else if (search =='audio') {
          aindentLevel += 1;
          var indentLevel = aindentLevel;
        };
        prevFieldSet.removeClass('searchGroupClose');
        prevFieldSet.addClass('searchGroupOpen');
        prevFieldSet.removeClass('indent' + indentLevel-1);
        prevFieldSet.addClass('indent' + indentLevel);
        var prevDiv = $(this).parent().parent().prevAll('.searchDiv:first');
        if (prevDiv.hasClass('searchGroupOpen')) {
          prevDiv.find('div.searchFieldset').empty();
          (search == 'video'? vopenGroupsToClose += 1 : aopenGroupsToClose +=1);
        };
        if ($(this).parent().find('select:last').html() == '') {
          $(this).parent().find('select:last').append('<option value="and">' + mkf.lang.get('and', 'Label') + '</option><option value="or">' + mkf.lang.get('or', 'Label') + '</option>');
          $(this).parent().find('select:last').show();
        }
        (search == 'video'? vopenGroups += 1 : aopenGroups += 1);

        return false;
      };
      
      var groupClose = function(e) {        
        $(this).parent().parent().removeClass('searchGroupOpen');
        $(this).parent().parent().addClass('searchGroupClose');
        var prevDiv = $(this).parent().parent().prevAll('.searchDiv:first');
        if (search == 'video') {
          vindentLevel -= 1;
          if ((vopenGroups - vopenGroupsToClose) != 1) { $(this).parent().parent().empty(); vopenGroupsToClose -= 1; };
          vopenGroups -= 1;
        } else if (search =='audio') {
          aindentLevel -= 1;
          if ((aopenGroups - aopenGroupsToClose) != 1) { $(this).parent().parent().empty(); aopenGroupsToClose -= 1; };
          aopenGroups -= 1;
        };
        return false;
      };
      
      //Music or video?
      if (search == 'video') {
      
        var vn = 0;
        var vindentLevel = 0;
        var vopenGroups = 0;
        var vopenGroupsToClose = 0;
        var vsearchLib = 'movies';
        var vadFilterPage = $('<div class="AdFilter"></div>');
      
        var searchFieldsmovies = ["title","plot","plotoutline","tagline","votes","rating","time","writers","playcount","lastplayed","inprogress","genre","country","year","director","actor","mpaarating","top250","studio","hastrailer","filename","path","set","tag","dateadded","videoresolution","audiochannels","videocodec","audiocodec","audiolanguage","subtitlelanguage","videoaspect","playlist"];
        var searchOpsmovies = ["contains","doesnotcontain","is","isnot","startswith","endswith","greaterthan","lessthan","after","before","inthelast","notinthelast","true","false"];
        var searchFieldstvshows = ["title","plot","status","votes","rating","year","genre","director","actor","numepisodes","numwatched","playcount","path","studio","mpaarating","dateadded","playlist"];
        var searchOpstvshows = ["contains","doesnotcontain","is","isnot","startswith","endswith","greaterthan","lessthan","after","before","inthelast","notinthelast","true","false"];
        var searchFieldsepisodes = ["title","tvshow","plot","votes","rating","time","writers","airdate","playcount","lastplayed","inprogress","genre","year","director","actor","episode","season","filename","path","studio","mpaarating","dateadded","videoresolution","audiochannels","videocodec","audiocodec","audiolanguage","subtitlelanguage","videoaspect","playlist"];
        var searchOpsepisodes = ["contains","doesnotcontain","is","isnot","startswith","endswith","greaterthan","lessthan","after","before","inthelast","notinthelast","true","false"];
        var searchFieldsmusicvideos = ["title","genre","album","year","artist","filename","path","playcount","lastplayed","time","director","studio","plot","dateadded","videoresolution","audiochannels","videocodec","audiocodec","audiolanguage","subtitlelanguage","videoaspect","playlist"];
        var searchOpsmusicvideos = ["contains","doesnotcontain","is","isnot","startswith","endswith","greaterthan","lessthan","after","before","inthelast","notinthelast","true","false"];

          
        var page = $('<div class="vadvSearch"><h2>' + mkf.lang.get('Advanced Video Search', 'Label') + '<a href="" class="advhelp"><span class="advsearch help" /></a></h2>' +
          '<form name="vadvSearchForm" id="vadvSearchForm">' +
          '<fieldset class="searchRoot">' +
          '<legend>' + mkf.lang.get('Library', 'Label') + '</legend>' +
          '<select id="vsearchType" name="vsearchType">' +
          '<option value="movies">' + mkf.lang.get('Movies', 'Settings option') + '</option>' +
          '<option value="tvshows">' + mkf.lang.get('TV Shows', 'Settings option') + '</option>' +
          '<option value="episodes">' + mkf.lang.get('Episodes', 'Settings option') + '</option>' +
          '<option value="musicvideos">' + mkf.lang.get('Music Videos', 'Settings option') + '</option>' +
          '</select>' +
          '</fieldset>' +
          '<input type="submit" name="search" value="' + mkf.lang.get('Search', 'Label') + '" id="search" />' +
          '<input type="button" class="addSearch" value="' + mkf.lang.get('Add', 'Label') + '">' +
          '<input type="button" class="resetSearch" value="' + mkf.lang.get('Reset', 'Label') + '">' +
          '</form></div>').appendTo(vadFilterPage);
          
        addItem();
        
        page.find('.advhelp').click(function() {
          var dialogHandle = mkf.dialog.show();
          var content = $('<h2>' + mkf.lang.get('Advanced search help') + '</h2>' +
            '<p class="advhelp">' + mkf.lang.get('The advanced search provides a multitude of ways to search your library. Because of the complexity available it is possible to create invalid queries. Examples are available on the wiki page:') + '</p>' +
            '<a class="advhelplink" href="http://wiki.xbmc.org/index.php?title=Add-on:AWXi">http://wiki.xbmc.org/index.php?title=Add-on:AWXi</a>');
          mkf.dialog.setContent(dialogHandle, content);
          return false;
        });
        page.find('#vsearchType').change(function() {
          //remove fields on library change
          vsearchLib = $(this).val()
          page.find('.searchDiv').empty().remove();
          vn = 0;
          vindentLevel = 0;
          vopenGroups = 0;
          vopenGroupsToClose = 0;
          addItem();
          fillOptions(eval('searchFields' + vsearchLib), eval('searchOps' + vsearchLib), 1);
        });
        fillOptions(searchFieldsmovies, searchOpsmovies);
        

        
        page.find('input.addSearch').on('click', addItem);
        page.find('input.resetSearch').on('click', function() {
          page.find('.searchDiv').empty().remove();
          vn = 0;
          vindentLevel = 0;
          vopenGroups = 0;
          vopenGroupsToClose = 0;
          addItem();
        });
        
        page.find('form#vadvSearchForm').submit(function() {
          //Build a useful object to parse later          
          var vgroupOpen = 0;
          var vsearchType = $(this).find('#vsearchType').val();
          var searchParams = {library: search};
          searchParams.searchType = vsearchType;
          searchParams.fields = {};
          searchParams.fields[0] = {};
          
          page.find('div.searchDiv').each(function(c, div) {
            if (typeof(searchParams.fields[c]) === 'undefined') { searchParams.fields[c] = {} };
            
            if ($(this).hasClass('searchGroupOpen')) {
              searchParams.fields[c].open = 'open';
              groupOpen += 1;
            } else if ($(this).hasClass('searchGroupClose')) {
              searchParams.fields[c].open = 'close';
              groupOpen -= 1;
            } else {
              searchParams.fields[c].open = 'continue';
            };
            
            
            
            $(this).find(':input').each(function(i, val) {              
              var name = val.name.slice(0, -1);              
              searchParams.fields[c][name] = val.value;
            });
            
          });
          
          if (vgroupOpen != 0) {
            mkf.messageLog.show(mkf.lang.get('Please close all statements', 'Popup message'), mkf.messageLog.status.error, 5000);
          } else {
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Running advanced search...', 'Popup message'));

            console.log(searchParams)
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
          };
          return false;
        });

      } else if (search == 'audio') {
        var an = 0;
        var aindentLevel = 0;
        var aopenGroups = 0;
        var aopenGroupsToClose = 0;
        var asearchLib = 'artists';
        var aadFilterPage = $('<div class="AdFilter"></div>');

        var searchFieldsartists = ["artist","genre","moods","styles","instruments","biography","born","bandformed","disbanded","died","playlist"];
        var searchOpsartists = ["contains","doesnotcontain","is","isnot","startswith","endswith","greaterthan","lessthan","after","before","inthelast","notinthelast","true","false"];
        var searchFieldsalbums = ["genre","album","artist","albumartist","year","review","themes","moods","styles","type","label","rating","playlist"];
        var searchOpsalbums = ["contains","doesnotcontain","is","isnot","startswith","endswith","greaterthan","lessthan","after","before","inthelast","notinthelast","true","false"];
        var searchFieldssongs = ["genre","album","artist","albumartist","title","year","time","tracknumber","filename","path","playcount","lastplayed","rating","comment","dateadded","playlist"];
        var searchOpssongs = ["contains","doesnotcontain","is","isnot","startswith","endswith","greaterthan","lessthan","after","before","inthelast","notinthelast","true","false"];
        
        var page = $('<div class="aadvSearch"><h2>' + mkf.lang.get('Advanced Music Search', 'Label') + '<a href="" class="advhelp"><span class="advsearch help" /></a></h2>' +
          '<form name="aadvSearchForm" id="aadvSearchForm">' +
          '<fieldset class="searchRoot">' +
          '<legend>' + mkf.lang.get('Library', 'Label') + '</legend>' +
          '<select id="asearchType" name="asearchType">' +
          '<option value="artists">' + mkf.lang.get('Artists', 'Settings option') + '</option>' +
          '<option value="albums">' + mkf.lang.get('Albums', 'Settings option') + '</option>' +
          '<option value="songs">' + mkf.lang.get('Songs', 'Settings option') + '</option>' +
          '</select>' +
          '</fieldset>' +
          '<input type="submit" name="search" value="' + mkf.lang.get('Search', 'Label') + '" id="search" />' +
          '<input type="button" class="addSearch" value="' + mkf.lang.get('Add', 'Label') + '">' +
          '<input type="button" class="resetSearch" value="' + mkf.lang.get('Reset', 'Label') + '">' +
          '</form></div>').appendTo(aadFilterPage);
          
        addItem();
        
        page.find('.advhelp').click(function() {
          var dialogHandle = mkf.dialog.show();
          mkf.dialog.setContent(dialogHandle, mkf.lang.get('Advanced search help'));
          return false;
        });
        page.find('#asearchType').change(function() {
          //remove fields on library change
          asearchLib = $(this).val()
          page.find('.searchDiv').empty().remove();
          an = 0;
          aindentLevel = 0;
          aopenGroups = 0;
          aopenGroupsToClose = 0;
          addItem();
          fillOptions(eval('searchFields' + asearchLib), eval('searchOps' + asearchLib), 1);
        });
        fillOptions(searchFieldsartists, searchOpsartists);
        

        
        page.find('input.addSearch').on('click', addItem);
        page.find('input.resetSearch').on('click', function() {
          page.find('.searchDiv').empty().remove();
          an = 0;
          aindentLevel = 0;
          aopenGroups = 0;
          aopenGroupsToClose = 0;
          addItem();
        });
        
        page.find('form#aadvSearchForm').submit(function() {
          //Build a useful object to pharse later          
          var agroupOpen = 0;
          var asearchType = $(this).find('#asearchType').val();
          var searchParams = {library: search};
          searchParams.searchType = asearchType;
          searchParams.fields = {};
          searchParams.fields[0] = {};
          
          page.find('div.searchDiv').each(function(c, div) {
            if (typeof(searchParams.fields[c]) === 'undefined') { searchParams.fields[c] = {} };
            
            if ($(this).hasClass('searchGroupOpen')) {
              searchParams.fields[c].open = 'open';
              groupOpen += 1;
            } else if ($(this).hasClass('searchGroupClose')) {
              searchParams.fields[c].open = 'close';
              groupOpen -= 1;
            } else {
              searchParams.fields[c].open = 'continue';
            };
            
            
            
            $(this).find(':input').each(function(i, val) {              
              var name = val.name.slice(0, -1);              
              searchParams.fields[c][name] = val.value;
            });
            
          });
          
          if (agroupOpen != 0) {
            mkf.messageLog.show(mkf.lang.get('Please close all statements', 'Popup message'), mkf.messageLog.status.error, 5000);
          } else {
            var messageHandle = mkf.messageLog.show(mkf.lang.get('Running advanced search...', 'Popup message'));

            xbmc.getAdFilter({
              options: searchParams,
              onSuccess: function(result) {
                
                result.Type = searchParams.searchType;
                if (result.limits.total > 0) {
                  mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('OK', 'Popup message addition'), 2000, mkf.messageLog.status.success);
                  
                  //make sub page for result
                  var $aadFilterRContent = $('<div class="pageContentWrapper"></div>');
                  var aadFilterRPage = mkf.pages.createTempPage(parentPage, {
                    title: mkf.lang.langMsg.translate('Result').withContext('Page').ifPlural( result.limits.total, 'Results' ).fetch( result.limits.total ),
                    content: $aadFilterRContent
                  });
                  var fillPage = function() {
                    $aadFilterRContent.addClass('loading');
                    switch (result.Type) {
                      case 'artists':
                        result.isFilter = true;
                        $aadFilterRContent.defaultArtistsTitleViewer(result, aadFilterRPage);
                        $aadFilterRContent.removeClass('loading');
                      break;
                      case 'albums':
                        result.isFilter = true;
                        $aadFilterRContent.defaultAlbumTitleViewer(result, aadFilterRPage);
                        $aadFilterRContent.removeClass('loading');
                      break;
                      case 'songs':
                        result.isFilter = true;
                        result.showDetails = true;
                        $aadFilterRContent.defaultSonglistViewer(result, aadFilterRPage);
                        $aadFilterRContent.removeClass('loading');
                      break;
                    }                    

                  }
                  aadFilterRPage.setContextMenu(
                    [
                      {
                        'icon':'close', 'title':mkf.lang.get('Close', 'Tool tip'), 'shortcut':'Ctrl+1', 'onClick':
                        function() {
                          mkf.pages.closeTempPage(aadFilterRPage);
                          return false;
                        }
                      },
                      {
                        'icon':'refresh', 'title':mkf.lang.get('Refresh', 'Tool tip'), 'onClick':
                          function(){
                            $aadFilterRContent.empty();
                            fillPage();
                            return false;
                          }
                      }
                    ]
                  );
                  
                  mkf.pages.showTempPage(aadFilterRPage);
                  fillPage();
                  $aadFilterRContent.removeClass('loading');

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
          };
          return false;
        });
      }
      
    return page;
    },
    
    InputSendText: function(data, password) {
      var inputControls = false;
      //Switch off key binds
      if (awxUI.settings.remoteActive && awxUI.settings.inputKey > 0) {
        //Restore input keys after searching
        inputControls = true;
        xbmc.inputKeys('off');
      };
      var dialogHandle = mkf.dialog.show({classname: 'inputSendText'});
      var dialogContent = $('<div><h1>' + data.title + '</h1><form name="sendtext" id="sendTextForm">' +
        '<input type="' + (password? 'password' : 'text') + '" size=90 id="sendText" /><input type="submit" style="position: absolute; left: -9999px; width: 1px; height: 1px;" /></form></div>');

      dialogContent.find('#sendTextForm').on('submit', function() {
        xbmc.sendText({
          text: $('input').val(),
          onSuccess: function() {
            $('div.inputSendText .close').click();
            if (inputControls) {
              xbmc.inputKeys('on');
            }
          },
          onError: function(errorText) {
            mkf.messageLog.show(mkf.lang.get('Failed to send input!', 'Popup message'), 5000, mkf.messageLog.status.error);
          }
        });
      return false;
      });
      mkf.dialog.setContent(dialogHandle, dialogContent);

      return false;
    }
    
  }); // END ui.views
})(jQuery);