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
          
          var thumb = (artistdetails.thumbnail? xbmc.getThumbUrl(artistdetails.thumbnail) : 'images/thumb.png');
          var dialogContent = $('<img src="' + thumb + '" class="thumbAlbums dialogThumb" />' +
            '<h1 class="underline">' + artistdetails.label + '</h1>' +
            //'<div class="test"><img src="' + tvshow.file + 'logo.png' + '" /></div>' +
            (artistdetails.genre? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( artistdetails.genre.length, 'Genres:' ).fetch( artistdetails.genre.length ) + '</span><span class="labelinfo">' + artistdetails.genre.join(', ') + '</span></div>' : '') +
            (artistdetails.mood[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Mood:').withContext('Label').ifPlural( artistdetails.mood.length, "Moods:" ).fetch( artistdetails.mood.length ) + '</span><span class="labelinfo">' + artistdetails.mood.join(', ') + '</span></div>' : '') +
            (artistdetails.style[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Style:').withContext('Label').ifPlural( artistdetails.style.length, "Styles:" ).fetch( artistdetails.style.length ) + '</span><span class="labelinfo">' +  artistdetails.style.join(', ') + '</span></div>' : '') +
            (artistdetails.born? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Born:', 'Label') + '</span><span class="labelinfo">' + artistdetails.born + '</span></div>' : '') +
            (artistdetails.formed? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Formed:', 'Label') + '</span><span class="labelinfo">' + artistdetails.formed + '</span></div>' : '') +
            (artistdetails.died? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Died:', 'Label') + '</span><span class="labelinfo">' + artistdetails.died + '</span></div>' : '') +
            (artistdetails.disbanded? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Disbanded:', 'Label') + '</span><span class="labelinfo">' + artistdetails.disbanded + '</span></div>' : '') +
            (artistdetails.yearsactive? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Years active:', 'Label') + '</span><span class="labelinfo">' + artistdetails.yearsactive + '</span></div>' : '') +
            (artistdetails.instrument[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Instrument:').withContext('Label').ifPlural( artistdetails.instrument.length, "Instruments:" ).fetch( artistdetails.instrument.length ) + '</span><span class="labelinfo">' + artistdetails.instrument + '</span></div>' : '') +
            '<p class="artistdesc">' + artistdetails.description + '</p>');
          
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
          
          var thumb = (albumdetails.thumbnail? xbmc.getThumbUrl(albumdetails.thumbnail) : 'images/thumb.png');
          var dialogContent = $('<img src="' + thumb + '" class="thumbAlbums dialogThumb" />' +
            '<h1 class="underline">' + albumdetails.label + '</h1>' +
            (albumdetails.artist? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Artist:', 'Label') + '</span><span class="labelinfo">' + albumdetails.artist + '</span></div>' : '') +
            (albumdetails.genre? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( albumdetails.genre.length, 'Genres:' ).fetch( albumdetails.genre.length ) + '</span><span class="labelinfo">' + albumdetails.genre.join(', ') + '</span></div>' : '') +
            (albumdetails.mood? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Mood:').withContext('Label').ifPlural( albumdetails.mood.length, 'Moods:' ).fetch( albumdetails.mood.length ) + '</span><span class="labelinfo">' + albumdetails.mood.join(', ') + '</span></div>' : '') +
            (albumdetails.style? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Style:').withContext('Label').ifPlural( albumdetails.style.length, 'Styles:' ).fetch( albumdetails.style.length ) + '</span><span class="labelinfo">' +  albumdetails.style.join(', ') + '</span></div>' : '') +
            (albumdetails.rating? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="labelinfo">' + albumdetails.rating + '</span></div>' : '') +
            (albumdetails.year? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Years active:', 'Label') + '</span><span class="labelinfo">' + albumdetails.year + '</span></div>' : '') +
            (albumdetails.albumlabel? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Record Label:', 'Label') + '</span><span class="labelinfo">' + albumdetails.albumlabel + '</span></div>' : '') +
            '<p class="artistdesc">' + albumdetails.description + '</p>');
          
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
          console.log(songdetails);
          if ( useFanart ) {
            $('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(songdetails.fanart) + '")');
          };
          
          var thumb = (songdetails.thumbnail? xbmc.getThumbUrl(songdetails.thumbnail) : 'images/thumb.png');
          var dialogContent = $('<img src="' + thumb + '" class="thumbAlbums dialogThumb" />' +
            '<h1 class="underline">' + songdetails.label + '</h1>' +
            (songdetails.artist[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Artist:', 'Label') + '</span><span class="labelinfo">' + songdetails.artist[0] + '</span></div>' : '') +
            (songdetails.genre? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( songdetails.genre.length, 'Genres:' ).fetch( songdetails.genre.length ) + '</span><span class="labelinfo">' + songdetails.genre.join(', ') + '</span></div>' : '') +
            (songdetails.track > 0? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Track:', 'Label') + '</span><span class="labelinfo">' + songdetails.track + '</span></div>' : '') +
            (songdetails.album? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Album:', 'Label') + '</span><span class="labelinfo">' +  songdetails.album + '</span></div>' : '') +
            (songdetails.rating? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="labelinfo">' + songdetails.rating + '</span></div>' : '') +
            (songdetails.duration? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Duration:', 'Label') + '</span><span class="labelinfo">' + xbmc.formatTime(songdetails.duration) + '</span></div>' : '') +
            (songdetails.year? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Years active:', 'Label') + '</span><span class="labelinfo">' + songdetails.year + '</span></div>' : '') +
            (songdetails.lastplayed? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Last Played:', 'Label') + '</span><span class="labelinfo">' + songdetails.lastplayed + '</span></div>' : '') +
            (songdetails.playcount? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="labelinfo">' + songdetails.playcount + '</span></div>' : '') +
            '<p class="artistdesc">' + songdetails.lyrics + '</p>');
          
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
          
          var thumb = (mv.thumbnail? xbmc.getThumbUrl(mv.thumbnail) : 'images/thumb.png');
          var dialogContent = $('<div><img src="' + thumb + '" class="thumb dialogThumb" />' +
            '<div><h1 class="underline">' + mv.title + '</h1></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Run Time:', 'Label') + '</span><span class="value">' + (mv.runtime? mv.runtime : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( mv.genre.length, 'Genres:' ).fetch( mv.genre.length ) + '</span><span class="value">' + (mv.genre? mv.genre : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Years active:', 'Label') + '</span><span class="value">' + (mv.year? mv.year : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            (mv.director? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Director:').withContext('Label').ifPlural( mv.director.length, 'Directors:' ).fetch( mv.director.length ) + '</span><span class="value">' + mv.director + '</span></div>' : '') +
            (mv.writer? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Writer:').withContext('Label').ifPlural( mv.writer.length, 'Writers:' ).fetch( mv.writer.length ) + '</span><span class="value">' + mv.writer + '</span></div>' : '') +
            (mv.lastplayed? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Last Played:', 'Label') + '</span><span class="value">' + mv.lastplayed + '</span></div>' : '') +
            (mv.playcount? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="value">' + mv.playcount + '</span></div>' : '') +
            '<div class="movieinfo filelink"><span class="label">' + mkf.lang.get('File:', 'Label') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + mv.file + '</a>' + '</span></div></div>' +
            '<br /><div class="movietags"><span class="infoqueue" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '" /><span class="infoplay" title="' + mkf.lang.get('Play', 'Tool tip') + '" /></div>');

          if (typeof(mv.streamdetails.video[0]) != 'undefined') {
            dialogContent.filter('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
            '<div class="aspect' + streamdetails.aspect + '" />' +
            '<div class="vCodec' + streamdetails.vCodec + '" />' +
            '<div class="aCodec' + streamdetails.aCodec + '" />' +
            '<div class="channels' + streamdetails.channels + '" />' +
            (streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
          };

          $(dialogContent).find('.infoplay').on('click', {idMusicVideo: mv.musicvideoid, strMovie: mv.label}, uiviews.MusicVideoPlay);
          $(dialogContent).find('.infoqueue').on('click', {idMusicVideo: mv.musicvideoid, strMovie: mv.label}, uiviews.AddMusicVideoToPlaylist);
          
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
            var dialogHandle = mkf.dialog.show();
            var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
            
            var thumb = (movieinfo.thumbnail? xbmc.getThumbUrl(movieinfo.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
            var dialogContent = $('<div><img src="' + thumb + '" class="thumb thumbPosterLarge dialogThumb" />' +
              '<div><h1 class="underline">' + movieinfo.title + '</h1></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Original Title:', 'Label') + '</span><span class="value">' + (movieinfo.originaltitle? movieinfo.originaltitle : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Run Time:', 'Label') + '</span><span class="value">' + (movieinfo.runtime? movieinfo.runtime : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( movieinfo.genre.length, 'Genres:' ).fetch( movieinfo.genre.length ) + '</span><span class="value">' + (movieinfo.genre? movieinfo.genre : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="value"><div class="smallRating' + Math.round(movieinfo.rating) + '"></div></span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Votes:', 'Label') + '</span><span class="value">' + (movieinfo.votes? movieinfo.votes : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              '<div class="movieinfo"><span class="label">' + mkf.lang.get('Year:', 'Label') + '</span><span class="value">' + (movieinfo.year? movieinfo.year : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
              (movieinfo.director? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Director:').withContext('Label').ifPlural( movieinfo.director.length, 'Directors:' ).fetch( movieinfo.director.length ) + '</span><span class="value">' + movieinfo.director + '</span></div>' : '') +
              (movieinfo.writer? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Writer:').withContext('Label').ifPlural( movieinfo.writer.length, 'Writers:' ).fetch( movieinfo.writer.length ) + '</span><span class="value">' + movieinfo.writer + '</span></div>' : '') +
              (movieinfo.studio? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Studio:').withContext('Label').ifPlural( movieinfo.studio.length, 'Studios:' ).fetch( movieinfo.studio.length ) + '</span><span class="value">' + movieinfo.studio + '</span></div>' : '') +
              (movieinfo.tagline? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Tag Line:', 'Label') + '</span><span class="value">' + movieinfo.tagline + '</span></div>' : '') +
              (movieinfo.trailer? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Trailer:', 'Label') + '</span><span class="value"><a href="' + movieinfo.trailer + '">' + mkf.lang.get('Link', 'Label') + '</a>' +
              '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="trailerplay">' + mkf.lang.get('Play in XBMC', 'Label') + '</a></span></div></div>' : '') +
              
              (movieinfo.set[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Set:', 'Label') + '</span><span class="value">' + movieinfo.set + '</span></div>' : '') +
              (movieinfo.lastplayed? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Last Played:', 'Label') + '</span><span class="value">' + movieinfo.lastplayed + '</span></div>' : '') +
              (movieinfo.playcount? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="value">' + movieinfo.playcount + '</span></div>' : '') +
              (movieinfo.imdbnumber? '<div class="movieinfo"><span class="label">IMDB:</span><span class="value">' + '<a href="http://www.imdb.com/title/' + movieinfo.imdbnumber + '">IMDB</a>' + '</span></div></div>' : '') +
              '<p class="plot">' +
              '<div class="movieinfo"><span class="resume">' + '<a class="resume" href="">' + mkf.lang.get('Resume from:', 'Label') + Math.floor(resumeMins) + ' ' + mkf.lang.get('minutes') + '</a></span></div></div>' +
              '<div class="movieinfo"><span class="resume">' + '<a class="beginning" href="">' + mkf.lang.get('Play from beginning', 'Label') + '</a>' + '</span></div></div></p>' +
              
              '</div>');

              $(dialogContent).find('a.beginning').on('click', playStart);
              $(dialogContent).find('a.resume').on('click', playResume);
              
              mkf.dialog.setContent(dialogHandle, dialogContent);
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
    FilePlay: function(event) {
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
    
    /*------*/
    CinExPlay: function(event) {
      var messageHandle = mkf.messageLog.show(mkf.lang.get('Playing...', 'Popup message with addition'));

      xbmc.cinemaEx({
        film: event.data.strMovie,
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
    MovieInfoOverlay: function(e) {
      var dialogHandle = mkf.dialog.show();
      var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
      var cinex = mkf.cookieSettings.get('cinex', 'no')=='yes'? true : false;
      //May be event data or just movieid from playlists
      var movieID = '';
      if (typeof(e) == 'number' ) { movieID = e } else { movieID = e.data.idMovie };
      
      xbmc.getMovieInfo({
        movieid: movieID,
        onSuccess: function(movie) {
          //var dialogContent = '';
          var fileDownload = '';
          
          xbmc.getPrepDownload({
            path: movie.file,
            onSuccess: function(result) {
              fileDownload = xbmc.getUrl(result.details.path);
              // no better way?
              $('.filelink').find('a').attr('href',fileDownload);
            },
            onError: function(errorText) {
              $('.filelink').find('a').replaceWith(movie.file);
            },
          });
          
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

          
          var thumb = (movie.thumbnail? xbmc.getThumbUrl(movie.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
          //dialogContent += '<img src="' + thumb + '" class="thumb thumb' + xbmc.getMovieThumbType() + ' dialogThumb" />' + //Won't this always be poster?!
          var dialogContent = $('<div><img src="' + thumb + '" class="thumb thumbPosterLarge dialogThumb" />' +
            //(cinex? '<div style="float: left; position: absolute; margin-top: 288px"><a href="#" class="cinexplay">' + mkf.lang.get('label_cinex_play') + '</a></div>' : '') + '</div>' +
            '<div><h1 class="underline">' + movie.title + '</h1></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Original Title:', 'Label') + '</span><span class="value">' + (movie.originaltitle? movie.originaltitle : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Run Time:', 'Label') + '</span><span class="value">' + (movie.runtime? movie.runtime : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( movie.genre.length, 'Genres:' ).fetch( movie.genre.length ) + '</span><span class="value">' + (movie.genre? movie.genre : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="value"><div class="smallRating' + Math.round(movie.rating) + '"></div></span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Votes:', 'Label') + '</span><span class="value">' + (movie.votes? movie.votes : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Year:', 'Label') + '</span><span class="value">' + (movie.year? movie.year : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            (movie.director? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Director:').withContext('Label').ifPlural( movie.director.length, 'Directors:' ).fetch( movie.director.length ) + '</span><span class="value">' + movie.director + '</span></div>' : '') +
            (movie.writer? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Writer:').withContext('Label').ifPlural( movie.writer.length, 'Writers:' ).fetch( movie.writer.length ) + '</span><span class="value">' + movie.writer + '</span></div>' : '') +
            (movie.studio? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Studio:').withContext('Label').ifPlural( movie.studio.length, 'Studios:' ).fetch( movie.studio.length ) + '</span><span class="value">' + movie.studio + '</span></div>' : '') +
            (movie.tagline? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Tag Line:', 'Label') + '</span><span class="value">' + movie.tagline + '</span></div>' : '') +
            (movie.trailer? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Trailer:', 'Label') + '</span><span class="value"><a href="' + movie.trailer + '">' + mkf.lang.get('Link', 'Label') + '</a>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="trailerplay">' + mkf.lang.get('Play in XBMC', 'Label') + '</a></span></div></div>' : '') +
            
            (movie.set[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Set:', 'Label') + '</span><span class="value">' + movie.set + '</span></div>' : '') +
            (movie.lastplayed? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Last Played:', 'Label') + '</span><span class="value">' + movie.lastplayed + '</span></div>' : '') +
            (movie.playcount? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="value">' + movie.playcount + '</span></div>' : '') +
            '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Audio Stream:').withContext('Label').ifPlural( streamdetails.aStreams, 'Audio Streams:' ).fetch( streamdetails.aStreams ) + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            (movie.imdbnumber? '<div class="movieinfo"><span class="label">IMDB:</span><span class="value">' + '<a href="http://www.imdb.com/title/' + movie.imdbnumber + '">IMDB</a>' + '</span></div></div>' : '') +
            '<div class="movieinfo filelink"><span class="label">' + mkf.lang.get('File:', 'Label') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + movie.file + '</a>' + '</span></div></div>' +
            //(cinex? '<div class="cinex"><a href="#" class="cinexplay">' + mkf.lang.get('label_cinex_play') + '</a>' : '') + '</div>' +
            '<p class="plot">' + movie.plot + '</p>' +
            '<div class="movietags"><span class="infoqueue" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '" /><span class="infoplay" title="' + mkf.lang.get('Play', 'Tool tip') + '" /></div>');

          if (typeof(movie.streamdetails.video[0]) != 'undefined') {
            dialogContent.filter('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
            '<div class="aspect' + streamdetails.aspect + '" />' +
            '<div class="vCodec' + streamdetails.vCodec + '" />' +
            '<div class="aCodec' + streamdetails.aCodec + '" />' +
            '<div class="channels' + streamdetails.channels + '" />' +
            (streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
          };

          $(dialogContent).find('.infoplay').on('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
          $(dialogContent).find('.infoqueue').on('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.AddMovieToPlaylist);
          $(dialogContent).find('.cinexplay').on('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.CinExPlay);
          $(dialogContent).find('.trailerplay').on('click', {file: movie.trailer}, uiviews.FilePlay);
          
          mkf.dialog.setContent(dialogHandle, dialogContent);
          return false;
        },
        onError: function() {
          mkf.messageLog.show('Failed to load movie information!', mkf.messageLog.status.error, 5000);
          mkf.dialog.close(dialogHandle);
        }
      });
      return false;
    },

    /*------------*/
    MovieInfoInline: function(m, callback) {
      var dialogContent;
      xbmc.getMovieInfo({
        movieid: m,
        onSuccess: function(movie) {
          var fileDownload = '';
          var cinex = mkf.cookieSettings.get('cinex', 'no')=='yes'? true : false;
          
          xbmc.getPrepDownload({
            path: movie.file,
            onSuccess: function(result) {
              fileDownload = xbmc.getUrl(result.details.path);
              // no better way?
              $('.filelink').find('a').attr('href',fileDownload);
            },
            onError: function(errorText) {
              $('.filelink').find('a').replaceWith(movie.file);
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
          
          if (typeof(movie.streamdetails.video[0]) != 'undefined') {
            if (typeof(movie.streamdetails.subtitle[0]) != 'undefined') { streamdetails.hasSubs = true };
            if (typeof(movie.streamdetails.audio[0].channels) != 'undefined') {
              streamdetails.channels = movie.streamdetails.audio[0].channels;
              streamdetails.aStreams = movie.streamdetails.audio.length;
              $.each(movie.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
              if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('N/A', 'Label') };
            };
          streamdetails.aspect = xbmc.getAspect(movie.streamdetails.video[0].aspect);
          //Get video standard
          streamdetails.vFormat = xbmc.getvFormat(movie.streamdetails.video[0].width);
          //Get video codec
          streamdetails.vCodec = xbmc.getVcodec(movie.streamdetails.video[0].codec);
          //Set audio icon
          streamdetails.aCodec = xbmc.getAcodec(movie.streamdetails.audio[0].codec);
          };
          
          //Create a youtube link from plugin trailer link provided
          if (movie.trailer.substring(0, movie.trailer.indexOf("?")) == 'plugin://plugin.video.youtube/') { movie.trailer = 'http://www.youtube.com/watch?v=' + movie.trailer.substr(movie.trailer.lastIndexOf("=") + 1) };
          
          var thumb = (movie.thumbnail? xbmc.getThumbUrl(movie.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
          dialogContent = $('<div style="float: left; margin-right: 5px;"><img src="' + thumb + '" class="thumb thumbPosterLarge dialogThumb" /></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Original Title:', 'Label') + '</span><span class="value">' + (movie.originaltitle? movie.originaltitle : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Run Time:', 'Label') + '</span><span class="value">' + (movie.runtime? movie.runtime : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( movie.genre.length, 'Genres:' ).fetch( movie.genre.length ) + '</span><span class="value">' + (movie.genre? movie.genre : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="value"><div class="smallRating' + Math.round(movie.rating) + '"></div></span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Votes:', 'Label') + '</span><span class="value">' + (movie.votes? movie.votes : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Years active:', 'Label') + '</span><span class="value">' + (movie.year? movie.year : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            (movie.director? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Director:').withContext('Label').ifPlural( movie.director.length, 'Directors:' ).fetch( movie.director.length ) + '</span><span class="value">' + movie.director + '</span></div>' : '') +
            (movie.writer? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Writer:').withContext('Label').ifPlural( movie.writer.length, 'Writers:' ).fetch( movie.writer.length ) + '</span><span class="value">' + movie.writer + '</span></div>' : '') +
            (movie.studio? '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Studio:').withContext('Label').ifPlural( movie.studio.length, 'Studios:' ).fetch( movie.studio.length ) + '</span><span class="value">' + movie.studio + '</span></div>' : '') +
            (movie.tagline? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Tag Line:', 'Label') + '</span><span class="value">' + movie.tagline + '</span></div>' : '') +
            (movie.trailer? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Trailer:', 'Label') + '</span><span class="value"><a href="' + movie.trailer + '">' + mkf.lang.get('Link', 'Label') + '</a>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="trailerplay">' + mkf.lang.get('Play in XBMC', 'Label') + '</a></span></div></div>' : '') +
            
            (movie.set[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Set:', 'Label') + '</span><span class="value">' + movie.set + '</span></div>' : '') +
            (movie.lastplayed? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Last Played:', 'Label') + '</span><span class="value">' + movie.lastplayed + '</span></div>' : '') +
            (movie.playcount? '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="value">' + movie.playcount + '</span></div>' : '') +
            '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Audio Stream:').withContext('Label').ifPlural( streamdetails.aStreams, 'Audio Streams:' ).fetch( streamdetails.aStreams ) + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            (movie.imdbnumber? '<div class="movieinfo"><span class="label">IMDB:</span><span class="value">' + '<a href="http://www.imdb.com/title/' + movie.imdbnumber + '">IMDB</a>' + '</span></div></div>' : '') +
            '<div class="movieinfo filelink"><span class="label">' + mkf.lang.get('File:', 'Label') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + movie.file + '</a>' + '</span></div></div>' +
            //(cinex? '<div class="cinex"><a href="#" class="cinexplay">' + mkf.lang.get('label_cinex_play') + '</a>' : '') + '</div>' +
            '<p class="plot">' + movie.plot + '</p>' +
            '<div class="movietags" style="display: inline-block; width: auto"><span class="infoqueue" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '" /><span class="infoplay" title="' + mkf.lang.get('Play', 'Tool tip') + '" /></div>');

          if (typeof(movie.streamdetails.video[0]) != 'undefined') {
            dialogContent.filter('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
            '<div class="aspect' + streamdetails.aspect + '" />' +
            '<div class="vCodec' + streamdetails.vCodec + '" />' +
            '<div class="aCodec' + streamdetails.aCodec + '" />' +
            '<div class="channels' + streamdetails.channels + '" />' +
            (streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
          };
            //return dialogContent;
            callback(dialogContent);
            $(dialogContent).find('.cinexplay').on('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.CinExPlay);
            $(dialogContent).find('.infoplay').on('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
            $(dialogContent).find('.infoqueue').on('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.AddMovieToPlaylist);
            $(dialogContent).find('.trailerplay').on('click', {file: movie.trailer}, uiviews.FilePlay);
            
          },
          onError: function() {
            mkf.messageLog.show('Failed to load movie information!', mkf.messageLog.status.error, 5000);
            mkf.dialog.close(dialogHandle);
          }
        
      });
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
          settings.filterWatched = false;
          $setContent.defaultMovieTitleViewer(result.setdetails, setPage, settings);
          $setContent.removeClass('loading');
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
          
          var thumb = (ep.thumbnail? xbmc.getThumbUrl(ep.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
          //dialogContent += '<img src="' + thumb + '" class="thumb thumb' + xbmc.getMovieThumbType() + ' dialogThumb" />' + //Won't this always be poster?!
          var dialogContent = $('<div><img src="' + thumb + '" class="thumbFanart dialogThumb" /></div>' +
            '<div><h1 class="underline">' + ep.title + '</h1></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Episode',  'Label') + '</span><span class="value">' + (ep.episode? ep.episode : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Season',  'Label') + '</span><span class="value">' + (ep.season? ep.season : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Run Time:', 'Label') + '</span><span class="value">' + (ep.runtime? ep.runtime : mkf.lang.get('N/A', 'Label')) + '</span></div>' +            
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
      //var dialogContent = $('<div></div>');
      var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;

      xbmc.getTvShowInfo({
        tvshowid: e.data.tvshow.tvshowid,
        onSuccess: function(tvshow) {
          
          if ( useFanart ) {
            $('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(tvshow.fanart) + '")');
          };
          
          var thumb = (tvshow.thumbnail? xbmc.getThumbUrl(tvshow.thumbnail) : 'images/thumb' + xbmc.getTvShowThumbType() + '.png');
          var valueClass = 'value' + xbmc.getTvShowThumbType();
          var dialogContent = $('<img src="' + thumb + '" class="thumb thumb' + xbmc.getTvShowThumbType() + ' dialogThumb' + xbmc.getTvShowThumbType() + '" />' +
            '<h1 class="underline">' + tvshow.title + '</h1>' +
            //'<div class="test"><img src="' + tvshow.file + 'logo.png' + '" /></div>' +
            '<div class="test"><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( tvshow.genre.length, 'Genres:' ).fetch( tvshow.genre.length ) + '</span><span class="'+valueClass+'">' + (tvshow.genre? tvshow.genre : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="test"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="'+valueClass+'"><div class="smallRating' + Math.round(tvshow.rating) + '"></div></span></div>' +
            '<div class="test"><span class="label">' + mkf.lang.get('Premiered:', 'Label') + '</span><span class="'+valueClass+'">' + (tvshow.premiered? tvshow.premiered : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="test"><span class="label">' + mkf.lang.get('Episodes:',  'Label') + '</span><span class="'+valueClass+'">' + tvshow.episode + '</span></div>' +
            '<div class="test"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="'+valueClass+'">' + tvshow.playcount + '</span></div>' +
            '<div class="test"><span class="label">' + mkf.lang.get('File:', 'Label') + '</span><span class="'+valueClass+'">' + tvshow.file + '</span></div>' +
            '<p class="plot">' + tvshow.plot + '</p>');

          /*xbmc.getLogo(tvshow.file, function(logo) {
            //$('.dialog').css('background-image', 'url("' + logo + '")');
            //$('.filelink').find('a').attr('href',fileDownload);
            if (logo) {
              $('.dialog').find('img').attr('src', logo);
              $('.dialog').find('img.thumbBanner').removeAttr('height');
            }
          });*/
          
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
          
          var thumb = (ep.thumbnail? xbmc.getThumbUrl(ep.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
          //dialogContent += '<img src="' + thumb + '" class="thumb thumb' + xbmc.getMovieThumbType() + ' dialogThumb" />' + //Won't this always be poster?!
          var dialogContent = $('<div><img src="' + thumb + '" class="thumbFanart dialogThumb" /></div>' +
            '<div><h1 class="underline">' + ep.title + '</h1></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Episode:',  'Label') + '</span><span class="value">' + (ep.episode? ep.episode : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Season:',  'Label') + '</span><span class="value">' + (ep.season? ep.season : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Run Time:', 'Label') + '</span><span class="value">' + (ep.runtime? ep.runtime : mkf.lang.get('N/A', 'Label')) + '</span></div>' +            
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="value"><div class="smallRating' + Math.round(ep.rating) + '"></div></span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Votes:', 'Label') + '</span><span class="value">' + (ep.votes? ep.votes : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('First Aired:', 'Label') + '</span><span class="value">' + (ep.firstaired? ep.firstaired : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Last Played:', 'Label') + '</span><span class="value">' + (ep.lastplayed? ep.lastplayed : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('Played:', 'Label') + '</span><span class="value">' + (ep.playcount? ep.playcount : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.langMsg.translate('Audio Stream:').withContext('Label').ifPlural( streamdetails.aStreams, 'Audio Streams:' ).fetch( streamdetails.aStreams ) + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
            '<div class="movieinfo"><span class="label">' + mkf.lang.get('File:', 'Label') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + ep.file + '</a>' + '</span></div></div>' +
            '<p class="plot">' + ep.plot + '</p>' +
            '<div class="movietags"><span class="infoqueue" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '" /><span class="infoplay" title="' + mkf.lang.get('Play', 'Tool tip') + '" /></div>');

          if (typeof(ep.streamdetails.video[0]) != 'undefined') {
            dialogContent.filter('.movietags').prepend('<div class="vFormat' + streamdetails.vFormat + '" />' +
            '<div class="aspect' + streamdetails.aspect + '" />' +
            '<div class="vCodec' + streamdetails.vCodec + '" />' +
            '<div class="aCodec' + streamdetails.aCodec + '" />' +
            '<div class="channels' + streamdetails.channels + '" />' +
            (streamdetails.hasSubs? '<div class="vSubtitles" />' : ''));
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
            $seasonsContent.defaultSeasonsViewer(result, e.data.idTvShow, seasonsPage);
            $seasonsContent.removeClass('loading');
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
      mkf.pages.showTempPage(seasonsPage);

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
            mkf.pages.closeTempPage(unwatchedEpsPage);
            return false;
            };
            $unwatchedEpsContent.defaultunwatchedEpsViewer(result, e.data.idTvShow, unwatchedEpsPage);
            $unwatchedEpsContent.removeClass('loading');

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

      mkf.pages.showTempPage(unwatchedEpsPage);
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
        $episodesContent.addClass('loading');
        xbmc.getEpisodes({
          tvshowid: e.data.idTvShow,
          season: e.data.seasonNum,

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
        settings.sortby = mkf.cookieSettings.get('albumSort', 'label');
        settings.order = mkf.cookieSettings.get('adesc', 'ascending');
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
                    '<a href="" class="button playlist' + artist.artistid + '" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' +
                    '<a href="" class="button play' + artist.artistid + '" title="' + mkf.lang.get('Play', 'Tool tip') + '"><span class="miniIcon play" /></a>' + 
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
      var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
      var hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no')=='yes'? 'click' : 'mouseenter';
      
      var $artistList = $('<div></div>');

        $.each(artists.artists, function(i, artist)  {
          var thumb = (artist.thumbnail? xbmc.getThumbUrl(artist.thumbnail) : 'images/thumb.png');
          $artist = $('<div class="album'+artist.artistid+' thumbWrapper">' +
            '<div class="linkArtistWrapper">' + 
                (allSongs? '<a href="" class="songs' + artist.artistid + '">' + mkf.lang.get('All Songs', 'Label') + '</a>' : '<a href="" class="albums' + artist.artistid + '">' + mkf.lang.get('All Albums', 'Label') + '</a>') +
                '<a href="" class="info' + artist.artistid + '">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
                '<a href="" class="enqueue' + artist.artistid + '">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' +
            '</div>' +
            (useLazyLoad?
              '<img src="images/loading_thumb.gif" alt="' + artist.label + '" class="thumb albums" data-original="' + thumb + '" />':
              '<img src="' + thumb + '" alt="' + artist.label + '" class="thumb albums" />'
            ) +
            '<div class="albumInfo">' + artist.artist + '</div></div>' +
            '<div class="findKeywords">' + artist.label.toLowerCase() + ' ' + artist.artist.toLowerCase() + '</div>' +
          '</div>');

        $artistList.append($artist);
        $artistList.find('.albums' + artist.artistid).bind('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums);
        $artistList.find('.songs' + artist.artistid).on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistSongs);
        $artistList.find('.enqueue' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.AddArtistToPlaylist);
        //$artistList.find('.play' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.ArtistPlay);
        $artistList.find('.info' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.ArtistInfoOverlay);
        });
        
      $artistList.find('.thumbWrapper').on(hoverOrClick, function() { $(this).children('.linkArtistWrapper').show() });
      $artistList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkArtistWrapper').hide() });      
      
      return $artistList;
    },

    /*----Artists logo view----*/
    ArtistViewLogos: function(artists, parentPage) {
      var allSongs = false;
      if (parentPage.className == 'songsArtists') { allSongs = true; };
      var artistsPath = mkf.cookieSettings.get('artistsPath', '');
      var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
      var hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no')=='yes'? 'click' : 'mouseenter';
      
      var $artistList = $('<div></div>');

        $.each(artists.artists, function(i, artist)  {
          //var thumb = (artist.thumbnail? xbmc.getThumbUrl(artist.thumbnail) : 'images/missing_logo.png');
          artist.file = artistsPath + artist.label + '/';
          xbmc.getLogo({path: artist.file, type: 'logo'}, function(logo) {
          $artist = $('<div class="artist'+artist.artistid+' logoWrapper thumbLogoWrapper">' +
            '<div class="linkTVLogoWrapper">' + 
                (allSongs? '<a href="" class="songs' + artist.artistid + '">' + mkf.lang.get('All Songs', 'Label') + '</a>' : '<a href="" class="albums' + artist.artistid + '">' + mkf.lang.get('All Albums', 'Label') + '</a>') +
                '<a href="" class="info' + artist.artistid + '">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
                '<a href="" class="enqueue' + artist.artistid + '">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a>' +
            '</div>' +
            (useLazyLoad?
            '<img src="images/loading_thumb.gif" alt="' + artist.label + '" class="thumb thumbLogo" data-original="' + (logo? logo : 'images/missing_logo.png') + '" />':
            '<img src="' + (logo? logo : 'images/missing_logo.png') + '" alt="' + artist.label + '" class="thumbLogo artist" />'
            ) +
            '<div class="albumArtist">' + artist.artist + '</div></div>' +
            '<div class="findKeywords">' + artist.label.toLowerCase() + '</div>' +
          '</div>').appendTo($artistList);

          $artistList.find('.albums' + artist.artistid).on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums);
          $artistList.find('.songs' + artist.artistid).on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistSongs);
          $artistList.find('.enqueue' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.AddArtistToPlaylist);
          //$artistList.find('.play' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.ArtistPlay);
          $artistList.find('.info' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.ArtistInfoOverlay);

          //Has to go here because of logo callback...
          $artistList.find('.thumbLogoWrapper').on(hoverOrClick, function() { $(this).children('.linkTVLogoWrapper').show() });
          $artistList.find('.thumbLogoWrapper').on('mouseleave', function() { $(this).children('.linkTVLogoWrapper').hide() });
          });
        });
      
      return $artistList;
    },

    /*----Artists single logo view----*/
    ArtistViewSingleLogos: function(artists, parentPage) {
      var artistsPath = mkf.cookieSettings.get('artistsPath', '');
      var artist = artists.artists[0];
      var currentArtist = 0;
      var contentWidth = $('#content').width();
      var contentHeight = ($('#main').length? $('#main').height() -65: $('#content').height())-190;

      var $artistList = $('<div class="singleView" style="margin-top: ' + contentHeight/2 + 'px"></div>');

        //$.each(artists.artists, function(i, artist)  {
          var thumb = ('images/missing_logo.png');
          $artist = $('<div class="prev" style="float: left; margin-bottom: 50px; margin-left: 10px; display: table-cell"><a href="#" /></div>' +
            '<div class="artist'+artist.artistid+' logoWrapper thumbFullLogoWrapper" style="float: none; display: table-cell">' +
            '<img src="' + thumb + '" alt="' + artist.label + '" class="thumbFullLogo artist" />' +
            '<div class="albumArtist">' + artist.artist + '</div>' +
            '<div class="movietags" style="display: inline-block; width: auto; margin-top: 5px"><span class="infoqueue" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '" /><span class="infoplay" title="' + mkf.lang.get('Play', 'Tool tip') + '" /><span class="infoinfo" title="' + mkf.lang.get('Information',  'Tool tip') + '" /></div>' +
            '</div>' +
            //'<div class="findKeywords">' + artist.label.toLowerCase() + '</div>' +
            '<div class="next" style="float: left; margin-bottom: 50px; margin-left: 10px; display: table-cell"><a href="#" /></div>' +
          '</div>').appendTo($artistList);;

        artist.file = artistsPath + artist.label + '/';

        $artist.find('.artist').on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums);

        $artistList.find('.infoplay').on('click', {idArtist: artist.artistid}, uiviews.ArtistPlay);
        $artistList.find('.infoenqueue').on('click', {idArtist: artist.artistid}, uiviews.AddArtistToPlaylist);
        $artistList.find('.infoinfo').on('click', {idArtist: artist.artistid}, uiviews.ArtistInfoOverlay);
        xbmc.getLogo({path: artist.file, type: 'logo'}, function(logo) {
            $('.artist'+artist.artistid).children('img').attr('src', (logo? logo : 'images/missing_logo.png')); 
          });
        
        $artistList.find('div.next').on('click', function () {
          $('div.artist' + artists.artists[currentArtist].artistid).removeClass('artist' + artists.artists[currentArtist].artistid);
          if (currentArtist < artists.limits.end -1) {currentArtist++ } else { currentArtist = artists.limits.start };
          $('div.logoWrapper').addClass('artist' + artists.artists[currentArtist].artistid);
          artist.file = artistsPath + artists.artists[currentArtist].label + '/';
          xbmc.getLogo({path: artist.file, type: 'logo'}, function(logo) {
            $('img.artist').attr('src', (logo? logo : 'images/missing_logo.png'));
          });
          $('div.albumArtist').text(artists.artists[currentArtist].label);
          $artistList.find('.artist').off();
          $artistList.find('.infoplay').off();
          $artistList.find('.infoenqueue').off();
          $artistList.find('.infoinfo').off();
          
          $artistList.find('.artist').on('click', { idArtist: artists.artists[currentArtist].artistid, strArtist: artists.artists[currentArtist].label, objParentPage: parentPage }, uiviews.ArtistAlbums);
          $artistList.find('.infoplay').on('click', { idArtist: artists.artists[currentArtist].artistid }, uiviews.ArtistPlay);
          $artistList.find('.infoenqueue').on('click', { idArtist: artists.artists[currentArtist].artistid }, uiviews.AddArtistToPlaylist);
          $artistList.find('.infoinfo').on('click', { idArtist: artists.artists[currentArtist].artistid }, uiviews.ArtistInfoOverlay);
        });

        $artistList.find('div.prev').on('click', function () {
          $('div.artist' + artists.artists[currentArtist].artistid).removeClass('artist' + artists.artists[currentArtist].artistid);
          if (currentArtist > artists.limits.start) {currentArtist-- } else { currentArtist = artists.limits.end -1 };
          $('div.logoWrapper').addClass('artist' + artists.artists[currentArtist].artistid);
          artist.file = artistsPath + artists.artists[currentArtist].label + '/';
          xbmc.getLogo({path: artist.file, type: 'logo'}, function(logo) {
            $('img.artist').attr('src', (logo? logo : 'images/missing_logo.png'));
          });
          $('div.albumArtist').text(artists.artists[currentArtist].label);
          $artistList.find('.artist').off();
          $artistList.find('.infoplay').off();
          $artistList.find('.infoenqueue').off();
          $artistList.find('.infoinfo').off();
          
          $artistList.find('.artist').on('click', { idArtist: artists.artists[currentArtist].artistid, strArtist: artists.artists[currentArtist].label, objParentPage: parentPage }, uiviews.ArtistAlbums);
          $artistList.find('.infoplay').on('click', { idArtist: artists.artists[currentArtist].artistid }, uiviews.ArtistPlay);
          $artistList.find('.infoenqueue').on('click', { idArtist: artists.artists[currentArtist].artistid }, uiviews.AddArtistToPlaylist);
          $artistList.find('.infoinfo').on('click', { idArtist: artists.artists[currentArtist].artistid }, uiviews.ArtistInfoOverlay);
        });

        $( window ).resize( xbmc.debouncer( function ( e ) {
          contentHeight = ($('#main').length? $('#main').height() -65: $('#content').height())-190; //$('#content').height() -5;
          
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
                      '<a href="" class="button playlistinfo' + i +'" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' +
                      '<a href="" class="button play' + i + '" title="' + mkf.lang.get('Play', 'Tool tip') + '"><span class="miniIcon play" /></a>' +
                      '<a href="" class="playlist' + i + '">' + playlist.label +
                      (playlist.artist? ' - Artist: ' + playlist.artist : '') +
                      (playlist.album && playlist.label != playlist.album? ' - Album: ' + playlist.album : '') +
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
      //var albums = albumResult.albums;
      var $albumsList = $('<ul class="fileList"></ul>');
        $.each(albums.albums, function(i, album)  {
          $album = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' +
            '<a href="" class="button info' + album.albumid + '" title="' + mkf.lang.get('Information',  'Tool tip') + '"><span class="miniIcon information" /></a>' +
            '<a href="" class="button playlist" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' +
            '<a href="" class="button play" title="' + mkf.lang.get('Play', 'Tool tip') + '"><span class="miniIcon play" /></a>' +
            '<a href="" class="album' + album.albumid + '">' + album.label + ' - ' + album.artist[0] + '<div class="findKeywords">' + album.label.toLowerCase() + ' ' + album.artist[0].toLowerCase() + '</div>' +
            '</a></div></li>').appendTo($albumsList);

          $album.find('.album'+ album.albumid).bind('click', {itemId: album.albumid, strAlbum: album.label, objParentPage: parentPage, item: 'albumid', filter: true }, uiviews.Songlist);
          $album.find('.playlist').bind('click', {idAlbum: album.albumid}, uiviews.AddAlbumToPlaylist);
          $album.find('.play').bind('click', {idAlbum: album.albumid, strAlbum: album.label}, uiviews.AlbumPlay);
          $album.find('.info'+ album.albumid).on('click', {idAlbum: album.albumid}, uiviews.AlbumInfoOverlay);
          
        });
      return $albumsList
    },
    
    /*----Albums thumbnail view----*/
    AlbumsViewThumbnails: function(albums, parentPage) {
      var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
      var hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no')=='yes'? 'click' : 'mouseenter';
      //var $albumsList = $('<div><div class="goNextPrev"><a style="font-size: 26px; margin-left: 10px;" class="prevPage" href="">Previous</a><a style="font-size: 26px; float: right; margin-right: 10px" class="nextPage" href="">Next</a></div></div>');
      var $albumsList = $('<div></div>');
      
      $.each(albums.albums, function(i, album) {
        var thumb = (album.thumbnail? xbmc.getThumbUrl(album.thumbnail) : 'images/thumb.png');
        $album = $('<div class="album'+album.albumid+' thumbWrapper">' +
            '<div class="linkWrapper">' + 
              '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a><a href="" class="songs">' + mkf.lang.get('Songs', 'Label') + '</a><a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a><a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
            '</div>' +
            (useLazyLoad?
              '<img src="images/loading_thumb.gif" alt="' + album.label + '" class="thumb" data-original="' + thumb + '" />':
              '<img src="' + thumb + '" alt="' + album.label + '" class="thumb" />'
            ) +
            '<div class="albumName">' + album.label + '' +
            '<div class="albumArtist">' + album.artist[0] + '</div></div>' +
            '<div class="findKeywords">' + album.label.toLowerCase() + ' ' + album.artist[0].toLowerCase() + '</div>' +
          '</div>');

        $albumsList.append($album);
        $album.find('.play').bind('click', {idAlbum: album.albumid, strAlbum: album.label}, uiviews.AlbumPlay);
        $album.find('.songs').bind('click', {itemId: album.albumid, strAlbum: album.label, objParentPage: parentPage, item: 'albumid', filter: true }, uiviews.Songlist);
        $album.find('.playlist').bind('click', {idAlbum: album.albumid}, uiviews.AddAlbumToPlaylist);
        $album.find('.info').bind('click', {idAlbum: album.albumid}, uiviews.AlbumInfoOverlay);
        
      });
      //$('<div class="goNextPrev"><a style="font-size: 26px; margin-left: 10px;" class="prevPage" href="">Previous</a><a style="font-size: 26px; float: right; margin-right: 10px" class="nextPage" href="">Next</a></div>').appendTo($albumsList);
      $albumsList.find('.thumbWrapper').on(hoverOrClick, function() { $(this).children('.linkWrapper').show() });          
      $albumsList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkWrapper').hide() });
      //$albumsList.find('a.nextPage').on('click', { Page: 'next'}, awxUI.onAlbumsShow);
      //$albumsList.find('a.prevPage').on('click', { Page: 'prev'}, awxUI.onAlbumsShow);
      
      return $albumsList;
    },
    
    /*----Albums list inline song view----*/
    AlbumsViewListInline: function(albums) {
    
      //can't find accordion without this...?
      var page = $('<div></div>');
      
      var $albumsList = $('<div id="multiOpenAccordion"></div>').appendTo(page);
      
        $.each(albums.albums, function(i, album) {
              //var thumb = (album.thumbnail? xbmc.getThumbUrl(album.thumbnail) : 'images/thumb.png');
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
                  //$songlistContent.defaultSonglistViewer(result);
                  var albuminfo = albums.albums[albumI];
                  var thumb = (albuminfo.thumbnail? xbmc.getThumbUrl(albuminfo.thumbnail) : 'images/thumb.png');
                  //var thumb = (songs.songs[0].thumbnail? xbmc.getThumbUrl(songs.songs[0].thumbnail) : 'images/thumb.png');
                  infodiv.removeClass('loading');
                  var albumContent = $('<div style="float: left; margin: 5px;"><img src="' + thumb + '" style="width: 154px; height: 154px;" />' +
                  '<div style="width: 154px; display: block; padding-left: 0px; padding-bottom: 50px"><span class="infoqueue" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '" /><span class="infoplay" title="' + mkf.lang.get('Play', 'Tool tip') + '" /><span class="infoinfo" title="' + mkf.lang.get('Information',  'Tool tip') + '" /></div>' +
                  '<div style="width: 154px;"><div><span class="label">' + mkf.lang.langMsg.translate('Genre:').withContext('Label').ifPlural( albuminfo.genre.length, 'Genres:' ).fetch( albuminfo.genre.length ) + '</span>' +
                  '<span class="value">' + albuminfo.genre + '</span></div><div><span class="label">' + mkf.lang.get('Rating:', 'Label') + '</span><span class="value">' + (albuminfo.rating? albuminfo.rating : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
                  '<div><span class="label">' + mkf.lang.get('Years active:', 'Label') + '</span><span class="value">' + (albuminfo.year? albuminfo.year : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
                  '<div><span class="label">' + mkf.lang.langMsg.translate('Mood:').withContext('Label').ifPlural( albuminfo.mood.length, 'Moods:' ).fetch( albuminfo.mood.length ) + '</span><span class="value">' + (albuminfo.mood? albuminfo.mood.join(', ') : mkf.lang.get('N/A', 'Label')) + '</span></div>' +
                  '<div><span class="label">' + mkf.lang.langMsg.translate('Style:').withContext('Label').ifPlural( albuminfo.style.length, 'Styles:' ).fetch( albuminfo.style.length ) + '</span><span class="value">' + (albuminfo.style? albuminfo.style.join(', ') : mkf.lang.get('N/A', 'Label')) + '</span></div>' + '</div></div>');
                  
                  albumContent.find('.infoplay').bind('click', {idAlbum: albuminfo.albumid, strAlbum: albuminfo.label}, uiviews.AlbumPlay);
                  albumContent.find('.infoqueue').bind('click', {idAlbum: albuminfo.albumid}, uiviews.AddAlbumToPlaylist);
                  albumContent.find('.infoinfo').bind('click', {idAlbum: albuminfo.albumid}, uiviews.AlbumInfoOverlay);
                  
                  var $songList = $('<ul class="fileList" style="margin: 5px 0 5px 0"></ul>');

                    $.each(songs.songs, function(i, song)  {
                      var $song = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper song' + song.songid + '"> <a href="" class="button playlist" title="' + mkf.lang.get('Enqueue', 'Tool tip') +
                      '"><span class="miniIcon enqueue" /></a> <a href="" class="button playnext" title="' + mkf.lang.get('Play Next', 'Tool tip') +
                      '"><span class="miniIcon playnext" /></a> <a href="" class="song play">' + song.track + '. ' + song.label + '</a></div></li>').appendTo($songList);
                      
                      $song.find('.playlist').bind('click', {idSong: song.songid}, uiviews.AddSongToPlaylist);
                      $song.find('.play').bind('click', {idSong: song.songid}, uiviews.SongPlay);
                      $song.find('.playnext').bind('click', {idSong: song.songid}, uiviews.SongPlayNext);
                      
                    });
                    
                  //albumContent.append($songList);
                  infodiv.addClass('filled');                    
                  infodiv.append(albumContent);
                  infodiv.append($songList);
                }
              });
              
              /*uiviews.MovieInfoInline(albumID, function(albumSongsContent) {
                infodiv.removeClass('loading');
                infodiv.append(albumSongsContent);
                infodiv.addClass('filled');
                });*/
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

      $.each(songs.songs, function(i, song)  {
        var $song = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper song' + song.songid + '"><a href="" class="button info' + song.songid + '" title="' + mkf.lang.get('Information',  'Tool tip') + '"><span class="miniIcon information" /></a>' +
        '<a href="" class="button playlist" title="' + mkf.lang.get('Enqueue', 'Tool tip') +
        '"><span class="miniIcon enqueue" /></a> <a href="" class="button playnext" title="' + mkf.lang.get('Play Next', 'Tool tip') +
        '"><span class="miniIcon playnext" /></a> <a href="" class="song play">' + song.label + ' - ' + song.artist[0] + ' ' + xbmc.formatTime(song.duration) + '</a>' +
        '<div class="findKeywords">' + song.label.toLowerCase() + '</div>' +
        '</div></li>').appendTo($songList);
        
        $song.find('.info' + song.songid).on('click', {idSong: song.songid}, uiviews.SongInfoOverlay);
        $song.find('.playlist' + song.songid).bind('click', {idSong: song.songid}, uiviews.AddSongToPlaylist);
        $song.find('.play' + song.songid).bind('click', {idSong: song.songid}, uiviews.SongPlay);
        $song.find('.playnext' + song.songid).bind('click', {idSong: song.songid}, uiviews.SongPlayNext);
      });

      return $songList;
    },
  
    /*----Music Videos thumbnail view----*/
    MusicVideosViewThumbnails: function(mv, parentPage) {
      var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
      var hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no')=='yes'? 'click' : 'mouseenter';
      var $mvList = $('<div></div>');
      $.each(mv.musicvideos, function(i, mv) {
        var thumb = (mv.thumbnail? xbmc.getThumbUrl(mv.thumbnail) : 'images/thumb.png');
        $mv = $('<div class="mv'+mv.musicvideoid+' thumbWrapper">' +
            '<div class="linkWrapper">' + 
              '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a><a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a><a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
            '</div>' +
            (useLazyLoad?
              '<img src="images/loading_thumb.gif" alt="' + mv.label + '" class="thumb" data-original="' + thumb + '" />':
              '<img src="' + thumb + '" alt="' + mv.label + '" class="thumb" />'
            ) +
            '<div class="albumName">' + mv.label + '' +
            '<div class="albumArtist">' + mv.artist[0] + '</div></div>' +
            '<div class="findKeywords">' + mv.label.toLowerCase() + ' ' + mv.artist[0].toLowerCase() + '</div>' +
          '</div>');

        $mvList.append($mv);
        
        $mv.find('.play').bind('click', {idMusicVideo: mv.musicvideoid, strMovie: mv.label}, uiviews.MusicVideoPlay);
        $mv.find('.playlist').bind('click', {idMusicVideo: mv.musicvideoid}, uiviews.AddMusicVideoToPlaylist);
        $mv.find('.info').bind('click', {idMusicVideo: mv.musicvideoid}, uiviews.MusicVideoInfoOverlay);
        
      });
      
      $mvList.find('.thumbWrapper').on(hoverOrClick, function() { $(this).children('.linkWrapper').show() });      
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
          if (typeof movie.movieid === 'undefined') { return; }
          if (movie.playcount > 0 && !options.filterShowWatched) { watched = true; }
          if (options.filterWatched && watched) { return; }

          classEven += 1;
              $movie = $('<h3 id="movieName' + movie.movieid + '"><a href="#">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') +
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
            uiviews.MovieInfoInline(movieID, function(movieInfoContent) {
              ui.newContent.removeClass('loading');
              ui.newContent.append(movieInfoContent);
              } ); 
          };
        },
        autoHeight: false,
        clearStyle: true,
        fillSpace: true,
        collapsible: true
        });
        
      return page;
    },    
    
    /*----Movie list inline info view----*/
    MovieViewListInline: function(movies, parentPage, options) {
    
      //can't find accordion without this...?
      var page = $('<div></div>');
      
      var $moviesList = $('<div id="multiOpenAccordion"></div>').appendTo(page);
      var classEven = -1;
      
        $.each(movies.movies, function(i, movie) {
          var watched = false;
          if (typeof movie.movieid === 'undefined') { return; }
          if (movie.playcount > 0 && !options.filterShowWatched) { watched = true; }
          if (options.filterWatched && watched) { return; }

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

              uiviews.MovieInfoInline(movieID, function(movieInfoContent) {
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
          if (typeof movie.movieid === 'undefined') { return; }
          if (movie.playcount > 0 && !options.filterShowWatched) { watched = true; }
          if (options.filterWatched && watched) { return; }
            
          classEven += 1
          $movie = $('<li' + (classEven%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' + 
            '<a href="" class="button playlist" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' +
            '<a href="" class="button play" title="' + mkf.lang.get('Play', 'Tool tip') + '"><span class="miniIcon play" /></a>' +
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
        if (typeof movie.movieid === 'undefined') { return; }
        if (movie.playcount > 0) { watched = true; }
        if (options.filterWatched && watched) { return; }
        
        var thumb = 'images/missing_logo.png';
        xbmc.getLogo({path: movie.file, type: 'logo'}, function(logo) {
          var $movie = $(
            '<div class="movie'+movie.movieid+' logoWrapper thumbLogoWrapper">' +
              '<div class="linkTVLogoWrapper">' + 
                '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a><a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a><a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
              '</div>' +
              (options.useLazyLoad?
                '<img src="images/loading_thumb.gif" alt="' + movie.label + '" class="thumb thumbLogo" data-original="' + (logo? logo : thumb) + '" />':
                '<img src="' + (logo? logo : thumb) + '" alt="' + movie.label + '" class="thumbLogo" />'
              ) +
              '<div class="movieName">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
              '<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
            '</div>').appendTo($moviesList);
          $movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
          $movie.find('.playlist').bind('click', {idMovie: movie.movieid}, uiviews.AddMovieToPlaylist);
          $movie.find('.info').bind('click', {idMovie: movie.movieid}, uiviews.MovieInfoOverlay);
          
          $moviesList.find('.thumbLogoWrapper').on(options.hoverOrClick, function() { $(this).children('.linkTVLogoWrapper').show() });          
          $moviesList.find('.thumbLogoWrapper').on('mouseleave', function() { $(this).children('.linkTVLogoWrapper').hide() });
                
        });
        
      });
      
      return $moviesList;
    },
      
    /*----Movie thumbnail view----*/
    MovieViewThumbnails: function(movies, parentPage, options) {

    var $moviesList = $('<div></div>');
      $.each(movies.movies, function(i, movie) {
        var watched = false;
        // if movie has no id (e.g. movie sets), ignore it
        if (typeof movie.movieid === 'undefined') { return; }
        if (movie.playcount > 0) { watched = true; }
        if (options.filterWatched && watched) { return; }
        
        var thumb = (movie.thumbnail? xbmc.getThumbUrl(movie.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
        var $movie = $(
          '<div class="movie'+movie.movieid+' thumbWrapper thumb' + xbmc.getMovieThumbType() + 'Wrapper">' +
            '<div class="linkWrapper">' + 
              '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a><a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a><a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
              '<div class="movieRating' + Math.round(movie.rating) + '"></div>' +
            '</div>' +
            (options.useLazyLoad?
              '<img src="images/loading_thumb' + xbmc.getMovieThumbType() + '.gif" alt="' + movie.label + '" class="thumb thumb' + xbmc.getMovieThumbType() + '" data-original="' + thumb + '" />':
              '<img src="' + thumb + '" alt="' + movie.label + '" class="thumb thumb' + xbmc.getMovieThumbType() + '" />'
            ) +
            '<div class="movieName">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
            '<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
          '</div>').appendTo($moviesList);
        $movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
        $movie.find('.playlist').bind('click', {idMovie: movie.movieid}, uiviews.AddMovieToPlaylist);
        $movie.find('.info').bind('click', {idMovie: movie.movieid}, uiviews.MovieInfoOverlay);
        
      });
      
      $moviesList.find('.thumbWrapper').on(options.hoverOrClick, function() { $(this).children('.linkWrapper').show() });          
      $moviesList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkWrapper').hide() });
      
      return $moviesList;
    },
        
    /*----Movie single view----*/
    MovieViewSingle: function(movies, parentPage, options) {
    
    var currentItem = 0;
    var contentWidth = $('#content').width();
    var contentHeight = ($('#main').length? $('#main').height() -65: $('#content').height());
    
    var imgHeight = contentHeight -100;
    //var imgWidthName = $('img.singleThumb').width();
    contentWidth += -100;
    contentHeight += -5;
    
    var $moviesList = $('<div class="singleView"></div>');
    
    var thumb = (movies.movies[currentItem].thumbnail? xbmc.getThumbUrl(movies.movies[currentItem].thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
      var $movie = $('<div class="prev" style="float: left; margin-bottom: ' + contentHeight/2.5 + 'px; margin-left: 10px; display: table-cell"><a href="#" /></div>' +
        '<div class="single" style="display: table-cell;"><div style="width: auto; float: none; padding: 0; text-align: center; margin-top: 5px" class="movie'+movies.movies[currentItem].movieid+' movie">' +
        //'<div>' +
        '<img src="' + thumb + '" alt="' + movies.movies[currentItem].label + '" class="singleThumb" style="height: ' + imgHeight + 'px; min-height: 170px; min-width: 114px" />' +
        '<div class="movieName albumInfo" style="margin-top: 0; height: 20px; width: 100%"><span style="vertical-align: middle; margin: 0 3px;">' + movies.movies[currentItem].label + '</span>' + (movies.movies[currentItem].playcount > 0? '<img style="vertical-align: middle" src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
        //'</div>' +
        '<div class="rating smallRating' + Math.round(movies.movies[currentItem].rating) + '" style="margin-bottom: 3px;"></div><br />' +
        '<div class="movietags" style="display: inline-block; width: auto"><span class="infoqueue" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '" /><span class="infoplay" title="' + mkf.lang.get('Play', 'Tool tip') + '" /><span class="infoinfo" title="' + mkf.lang.get('Information',  'Tool tip') + '" /></div>' +
        '</div></div>' +
        '<div class="next" style="float: right; margin-bottom: ' + contentHeight/2.5 + 'px; margin-right: 10px; display: table-cell;"><a href="#" /></div>' +
        '').appendTo($moviesList);
        
      $movie.find('.infoplay').bind('click', {idMovie: movies.movies[currentItem].movieid, strMovie: movies.movies[currentItem].label}, uiviews.MoviePlay);
      $movie.find('.infoqueue').bind('click', {idMovie: movies.movies[currentItem].movieid}, uiviews.AddMovieToPlaylist);
      $movie.find('.infoinfo').bind('click', {idMovie: movies.movies[currentItem].movieid}, uiviews.MovieInfoOverlay);
      
      $moviesList.find('.prev').on('click', function () {
        $('div.movie' + movies.movies[currentItem].movieid).removeClass('movie' + movies.movies[currentItem].movieid);
        $('div.rating').removeClass('smallRating' + Math.round(movies.movies[currentItem].rating));
        $('div.movieName img').remove();
        if (currentItem > movies.limits.start) { currentItem-- } else { currentItem = movies.limits.end -1 };
        //Check if next movie has been watched.
        if (options.filterWatched) {
          while (movies.movies[currentItem].playcount > 0) {
            if (currentItem > movies.limits.start) { currentItem-- } else { currentItem = movies.limits.end -1 };
          }
        }
        $('div.movie').addClass('movie' + movies.movies[currentItem].movieid);
        $('img.singleThumb').attr('src', xbmc.getThumbUrl(movies.movies[currentItem].thumbnail));
        $('img.singleThumb').attr('alt', movies.movies[currentItem].label);
        $('div.movieName span').text(movies.movies[currentItem].label);
        if (movies.movies[currentItem].playcount > 0) $('div.movieName').append('<img style="vertical-align: middle" src="images/OverlayWatched_Small.png" />');
        $('div.rating').addClass('smallRating' + Math.round(movies.movies[currentItem].rating));
        
        $movie.find('.infoplay').unbind();
        $movie.find('.infoqueue').unbind();
        $movie.find('.infoinfo').unbind();
        
        $movie.find('.infoplay').bind('click', {idMovie: movies.movies[currentItem].movieid, strMovie: movies.movies[currentItem].label}, uiviews.MoviePlay);
        $movie.find('.infoqueue').bind('click', {idMovie: movies.movies[currentItem].movieid}, uiviews.AddMovieToPlaylist);
        $movie.find('.infoinfo').bind('click', {idMovie: movies.movies[currentItem].movieid}, uiviews.MovieInfoOverlay);
      });
      
      $moviesList.find('.next').on('click', function () {
        
        $('div.movie' + movies.movies[currentItem].movieid).removeClass('movie' + movies.movies[currentItem].movieid);
        $('div.rating').removeClass('smallRating' + Math.round(movies.movies[currentItem].rating));
        $('div.movieName img').remove();
        if (currentItem < movies.limits.end -1) { currentItem++ } else { currentItem = movies.limits.start };
        //Check if next movie has been watched.
        if (options.filterWatched) {
          while (movies.movies[currentItem].playcount > 0) {
            if (currentItem < movies.limits.end -1) { currentItem++ } else { currentItem = movies.limits.start };
          }
        }
        $('div.movie').addClass('movie' + movies.movies[currentItem].movieid);
        $('img.singleThumb').attr('src', xbmc.getThumbUrl(movies.movies[currentItem].thumbnail));
        $('img.singleThumb').attr('alt', movies.movies[currentItem].label);
        $('div.movieName span').text(movies.movies[currentItem].label);
        if (movies.movies[currentItem].playcount > 0) $('div.movieName').append('<img style="vertical-align: middle" src="images/OverlayWatched_Small.png" />');
        $('div.rating').addClass('smallRating' + Math.round(movies.movies[currentItem].rating));
        
        $movie.find('.infoplay').unbind();
        $movie.find('.infoqueue').unbind();
        $movie.find('.infoinfo').unbind();
        
        $movie.find('.infoplay').bind('click', {idMovie: movies.movies[currentItem].movieid, strMovie: movies.movies[currentItem].label}, uiviews.MoviePlay);
        $movie.find('.infoqueue').bind('click', {idMovie: movies.movies[currentItem].movieid}, uiviews.AddMovieToPlaylist);
        $movie.find('.infoinfo').bind('click', {idMovie: movies.movies[currentItem].movieid}, uiviews.MovieInfoOverlay);
        
      });

      $( window ).resize( xbmc.debouncer( function ( e ) {
        contentHeight = ($('#main').length? $('#main').height() -65: $('#content').height() -5); //$('#content').height() -5;
        
        $('div.next, div.prev').css('margin-bottom', contentHeight/2.5);
        $('img.singleThumb').css('height', contentHeight -95);
        //$('div.movieName').css('width', $('img.singleThumb').width());
        
      } ) );
      
      return $moviesList;
    },
    
/*------------------*/
/* Movie sets views */
/*------------------*/

    /*----Movie Sets list view----*/
    MovieSetsViewList: function(movies, parentPage, options) {
    
    var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
    var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
    var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
    var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
    
    if (options) { filterWatched = options.filterWatched };
    
      var $movieList = $('<ul class="fileList"></ul>');
      var classEven = -1;
        $.each(movies.sets, function(i, movie) {
          var watched = false;
          if (movie.playcount > 0 && !filterShowWatched) { watched = true; }
          if (filterWatched && watched) { return; }
            
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
    
    var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
    var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
    var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
    var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
    
    if (options) { filterWatched = options.filterWatched };
    
    var $moviesList = $('<div></div>');
      $.each(movies.sets, function(i, movie) {
        var watched = false;
        if (movie.playcount > 0) { watched = true; }
        if (filterWatched && watched) { return; }
        
        var thumb = (movie.thumbnail? xbmc.getThumbUrl(movie.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
        var $movie = $(
          '<div class="set'+movie.setid+' thumbWrapper thumb' + xbmc.getMovieThumbType() + 'Wrapper">' +
            (useLazyLoad?
              '<img src="images/loading_thumb' + xbmc.getMovieThumbType() + '.gif" alt="' + movie.label + '" class="list thumb thumb' + xbmc.getMovieThumbType() + '" data-original="' + thumb + '" />':
              '<img src="' + thumb + '" alt="' + movie.label + '" class="list thumb thumb' + xbmc.getMovieThumbType() + '" />'
            ) +
            '<div class="movieName">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
            '<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
          '</div>').appendTo($moviesList);
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
          if (tvshow.playcount > 0 && !options.filterShowWatched) { watched = true; }
          if (options.filterWatched && watched) { return; }
          
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
    
    /*----TV banner view----*/
    TVViewBanner: function(shows, parentPage, options) {
      
      var $tvShowList = $('<div></div>');
      
      if (shows.limits.total > 0) {
        $.each(shows.tvshows, function(i, tvshow) {
          var watched = false;
          if (tvshow.playcount > 0 && !options.filterShowWatched) { watched = true; }
          if (options.filterWatched && watched) { return; }
          var thumb = (tvshow.thumbnail? xbmc.getThumbUrl(tvshow.thumbnail) : 'images/thumb' + xbmc.getTvShowThumbType() + '.png');
          var $tvshow = $('<div class="tvshow'+tvshow.tvshowid+' thumbWrapper thumb' + xbmc.getTvShowThumbType() + 'Wrapper">' +
              '<div class="linkTVWrapper">' + 
                '<a href="" class="season">' + mkf.lang.get('Seasons', 'Label') + '</a>' +
                '<a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
                '<a href="" class="unwatched">' + mkf.lang.get('Unwatched',  'Tool tip') + '</a>' +
              '</div>' +
              (options.useLazyLoad?
                '<img src="images/loading_thumb' + xbmc.getTvShowThumbType() + '.gif" alt="' + tvshow.label + '" class="thumb thumb' + xbmc.getTvShowThumbType() + '" data-original="' + thumb + '" />':
                '<img src="' + thumb + '" alt="' + tvshow.label + '" class="thumb thumb' + xbmc.getTvShowThumbType() + '" />'
              ) +
              '<div class="tvshowName">' + tvshow.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
              '<div class="findKeywords">' + tvshow.label.toLowerCase() + '</div>' +
            '</div>')
            .appendTo($tvShowList);
          $tvshow.find('.season').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.SeasonsList);
          $tvshow.find('.info').bind('click', {'tvshow': tvshow}, uiviews.TVShowInfoOverlay);
          $tvshow.find('.unwatched').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.Unwatched);
          
          
        });
      }
      $tvShowList.find('.thumbWrapper').on(options.hoverOrClick, function() { $(this).children('.linkTVWrapper').show() });          
      $tvShowList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkTVWrapper').hide() });

      return $tvShowList;
    },
    
    /*----TV logo view----*/
    TVViewLogoWall: function(shows, parentPage, options) {
      
      var $tvShowList = $('<div></div>');
      
      if (shows.limits.total > 0) {
        $.each(shows.tvshows, function(i, tvshow) {
          var watched = false;
          if (tvshow.playcount > 0 && !options.filterShowWatched) { watched = true; }
          if (options.filterWatched && watched) { return; }
          var thumb = (tvshow.thumbnail? xbmc.getThumbUrl(tvshow.thumbnail) : 'images/missing_logo.png');
          xbmc.getLogo({path: tvshow.file, type: 'logo'}, function(logo) {
          var $tvshow = $('<div class="tvshow'+tvshow.tvshowid+' logoWrapper thumbLogoWrapper">' +
              '<div class="linkTVLogoWrapper">' + 
                '<a href="" class="season">' + mkf.lang.get('Seasons', 'Label') + '</a>' +
                '<a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
                '<a href="" class="unwatched">' + mkf.lang.get('Unwatched',  'Tool tip') + '</a>' +
              '</div>' + 
              //'<img src="' + thumb + '" alt="' + tvshow.label + '" class="thumbLogo" />' +
              (options.useLazyLoad?
              '<img src="images/loading_thumb.gif" alt="' + tvshow.label + '" class="thumb thumbLogo" data-original="' + (logo? logo : thumb) + '" />':
              '<img src="' + (logo? logo : thumb) + '" alt="' + tvshow.label + '" class="thumbLogo" />'
              ) +
              '<div class="tvshowName">' + tvshow.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
              '<div class="findKeywords">' + tvshow.label.toLowerCase() + '</div>' +
            '</div>')
            .appendTo($tvShowList);
          
          $tvshow.find('.season').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.SeasonsList);
          $tvshow.find('.info').bind('click', {'tvshow': tvshow}, uiviews.TVShowInfoOverlay);
          $tvshow.find('.unwatched').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.Unwatched);
          
          //Has to go here because of logo callback...
          $tvShowList.find('.thumbLogoWrapper').on(options.hoverOrClick, function() { $(this).children('.linkTVLogoWrapper').show() });          
          $tvShowList.find('.thumbLogoWrapper').on('mouseleave', function() { $(this).children('.linkTVLogoWrapper').hide() });

          });
        });
      }
  
      return $tvShowList;
    },
    
    /*----TV seasons list----*/
    TVSeasonsViewList: function(seasons, idTvShow, parentPage) {
      var $seasonsList = $('<ul class="fileList"></ul>');

        $.each(seasons.seasons, function(i, season)  {
          var watched = false;
          var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
          var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
          
          if (season.playcount > 0 && !filterShowWatched) { watched = true; }
          if (filterWatched && watched) { return; }
          
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
          var $changrp = $('<li' + (i%2==0? ' class="even"': '') + '><div class="linkWrapper"> <a href="" class="pvrchan' + i +
          '">' + changrp.label + '</a></div></li>').appendTo($pvrlist);
          $changrp.find('a').on('click',{idChannelGroup: changrp.channelgroupid, strChannel: changrp.label, objParentPage: parentPage}, uiviews.PVRtvChannels);
        });

      return $pvrlist;
    },

    /*----PVR channel list----*/
    PVRchanViewList: function(pvrchan, parentPage) {
      var $pvrchan = $('<ul class="fileList"></ul>');

        $.each(pvrchan.channels, function(i, chan)  {          
          var $chan = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper"><a href="" class="button rec recoff" title="' + mkf.lang.get('Record', 'Tool tip') +
          '"><span class="miniIcon recoff" /></a> <a href="" class="pvrchan' + i +
          '">' + chan.label + '</a></div></li>').appendTo($pvrchan);
          $chan.find('a.rec').on('click',{idChannel: chan.channelid}, uiviews.pvrRecordChannel);
          $chan.find('a.pvrchan' + i).on('click',{idChannel: chan.channelid, strChannel: chan.label, objParentPage: parentPage}, uiviews.pvrSwitchChannel);
        });

      return $pvrchan;
    },
    
    /*----TV episodes list----*/
    TVEpisodesViewList: function(eps, options) {
      //var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
      var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
      var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
      var genlist = eps.episodes;
      //var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
      
      //For unwatched listing
      if (options) genlist = eps;
      
      var $episodeList = $('<ul class="fileList"></ul>');

      $.each(genlist, function(i, episode)  {
        var watched = false;
        
        if (episode.playcount > 0 && !filterShowWatched) { watched = true; }
        if (filterWatched && watched) { return; }
        
        var $episode = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper episode' + episode.episodeid +
        '"> <a href="" class="button playlist" title="' + mkf.lang.get('Enqueue', 'Tool tip') +
        '"><span class="miniIcon enqueue" /></a><a href="" class="button info" title="' + mkf.lang.get('Information',  'Tool tip') +
        '"><span class="miniIcon information" /></a><a href="" class="episode play">' + //episode.episode + '. ' + 
        episode.label + '' + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</a></div></li>').appendTo($episodeList);

        $episode.find('.play').bind('click', {idEpisode: episode.episodeid}, uiviews.EpisodePlay);
        $episode.find('.playlist').bind('click', {idEpisode: episode.episodeid}, uiviews.AddEpisodeToPlaylist);
        $episode.find('.information').bind('click', {idEpisode: episode.episodeid}, uiviews.EpisodeInfo);
      });

      return $episodeList;
    },

    /*----TV episodes thumbnail----*/
    TVEpThumbnailList: function(eps, options) {

      var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
      var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
      var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
      var hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no')=='yes'? 'click' : 'mouseenter';
      var genlist = eps.episodes;
      //var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
      
      //if (options) { unwatched = options };
      if (options) genlist = eps;
      
      var $episodeList = $('<ul class="RecentfileList"></ul>');

        $.each(genlist, function(i, episode)  {
          var watched = false;  
          if (episode.playcount > 0 && !filterShowWatched) { watched = true; }
          if (filterWatched && watched) { return; }
          
          var thumb = (episode.thumbnail? xbmc.getThumbUrl(episode.thumbnail) : 'images/thumb.png');
          var $episode = $('<li><div class="showEpisode thumbEpWrapper">' + 
          '<div class="episodeThumb">' +
          '<div class="linkEpWrapper">' + 
              '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a><a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a><a href="" class="info">' + mkf.lang.get('Information',  'Tool tip') + '</a>' +
            '</div>' +
          (useLazyLoad?
          '<img src="images/loading_thumb.gif" alt="' + episode.label + '" class="thumb thumbFanart" data-original="' + thumb + '" />' :
          '<img src="' + thumb + '" alt="' + episode.label + '" class="thumbFanart" />'
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
          
        });

      $episodeList.find('.episodeThumb').on(hoverOrClick, function() { $(this).children('.linkEpWrapper').show() });          
      $episodeList.find('.episodeThumb').on('mouseleave', function() { $(this).children('.linkEpWrapper').hide() });
          
      return $episodeList;
    },
    
    /*----TV Recently Added----*/
    TVRecentViewInfoList: function(eps, parentPage, options) {

      var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
      var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
      var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
      var hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no')=='yes'? 'click' : 'mouseenter';
      
      if (options) { filterWatched = options.filterWatched };
      
      var $episodeList = $('<ul class="RecentfileList"></ul>');

        $.each(eps.episodes, function(i, episode)  {
          var watched = false;  
          if (episode.playcount > 0 && !filterShowWatched) { watched = true; }
          if (filterWatched && watched) { return; }
          
          var thumb = (episode.thumbnail? xbmc.getThumbUrl(episode.thumbnail) : 'images/thumb.png');
          var $episode = $('<li><div class="recentTVshow thumbEpWrapper">' + 
          '<div class="episodeThumb">' +
          '<div class="linkEpWrapper">' + 
              '<a href="" class="play">' + mkf.lang.get('Play', 'Tool tip') + '</a><a href="" class="playlist">' + mkf.lang.get('Enqueue', 'Tool tip') + '</a><a href="" class="unwatchedEps">' + mkf.lang.get('Unwatched',  'Tool tip') + '</a>' +
            '</div>' +
          (useLazyLoad?
          '<img src="images/loading_thumb.gif" alt="' + episode.label + '" class="thumb thumbFanart episode" data-original="' + thumb + '" />':
          '<img src="' + thumb + '" alt="' + episode.label + '" class="thumbFanart episode" />'
          ) +
          '</div>' +
          '<div class="recentTVshowName">' + episode.showtitle + (watched? '<img src="images/OverlayWatched_Small.png" class="epWatched" />' : '') + 
          '<div class="episodeTVSE">' + mkf.lang.get('Season',  'Label') + ' ' + episode.season + ' - ' + mkf.lang.get('Episode',  'Label') + ' ' +episode.episode + '</div>' +
          //'</div><div class="recentTVSE">Season: ' + episode.season + ' - Episode: ' +episode.episode + 
          '</div><div class="recentTVtitle">' + episode.label + '</div><div class="recentTVplot">' + episode.plot + '</div></div></li>').appendTo($episodeList);
          
          $episode.find('.play').bind('click', {idEpisode: episode.episodeid}, uiviews.EpisodePlay);
          $episode.find('.playlist').bind('click', {idEpisode: episode.episodeid}, uiviews.AddEpisodeToPlaylist);
          $episode.find('.unwatchedEps').bind('click', {idTvShow: episode.tvshowid, strTvShow: episode.showtitle, objParentPage: parentPage}, uiviews.Unwatched);

        });
        
      $episodeList.find('.episodeThumb').on(hoverOrClick, function() { $(this).children('.linkEpWrapper').show() });          
      $episodeList.find('.episodeThumb').on('mouseleave', function() { $(this).children('.linkEpWrapper').hide() });
          
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
              '<a class="button remove" href="" title="' + mkf.lang.get('Remove', 'Tool tip') +  '"><span class="miniIcon remove" /></a><a class="button playlistmove" href="" title="' + mkf.lang.get('Swap', 'Tool tip') +  '"><span class="miniIcon playlistmove" /></a>' +
              '<a class="' + playlistItemCur + ' apli' + i + ' play" href="">' + (i+1) + '. ' +
              (artist? artist + ' - ' : '') + (album? album + ' - ' : '') + (title? title : label) + '&nbsp;&nbsp;&nbsp;&nbsp;' + (duration? xbmc.formatTime(duration) : '') +
              (artist? '<div class="findKeywords">' + artist[0].toLowerCase() + ' ' + album.toLowerCase() + ' ' + label.toLowerCase() + '</div>' : '' ) +
              '</a></div></li>').appendTo($itemList);

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
              '<a class="button remove" href="" title="' + mkf.lang.get('Remove', 'Tool tip') +  '"><span class="miniIcon remove" /></a><a class="button playlistmove" href="" title="' + mkf.lang.get('Swap', 'Tool tip') +  '"><span class="miniIcon playlistmove" /></a>' +
              '<a class="' + playlistItemCur  + ' vpli' + i + ' play" href="">' + (i+1) + '. ' +
              (item.type=='episode'? showtitle + ' - Season ' + season + ' - ' + title : title) + (item.type=='musicvideo'? (item.artist != ''? ' - ' + item.artist[0] : '') : '') + '&nbsp;&nbsp;&nbsp;&nbsp;' + xbmc.formatTime(duration) +
              '</a></div></li>').appendTo($itemList);

            $item.find('a.play').bind('click', {itemNum: i}, uiviews.PlaylistVideoItemPlay);
            $item.find('a.remove').bind('click', {itemNum: i}, uiviews.PlaylistVideoItemRemove);
          });

        if (runtime > 0) {
          $('<p>' + mkf.lang.get('Run Time:', 'Label') + xbmc.formatTime(runtime) + '</p>').appendTo($itemList);
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
                  '><div class="folderLinkWrapper"><a href="" class="button playlist' + genre.genreid + '" title="' + mkf.lang.get('Enqueue', 'Tool tip') + '"><span class="miniIcon enqueue" /></a>' +
                  '<a href="" class="button play' + genre.genreid + '" title="' + mkf.lang.get('Play', 'Tool tip') + '"><span class="miniIcon play" /></a><a href="" class="genre' + 
                  genre.genreid + '">' +
                  genre.label + '<div class="findKeywords">' + genre.label.toLowerCase() + '</div>' +
                  '</a></div></li>');
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
            '<p class="advhelp">' + mkf.lang.get('Advanced search help text') + '</p>' +
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
      var dialogHandle = mkf.dialog.show({classname: 'inputSendText'});
      var dialogContent = $('<div><h1>' + data.title + '</h1><form name="sendtext" id="sendTextForm">' +
        '<input type="' + (password? 'password' : 'text') + '" size=90 id="sendText" /><input type="submit" style="position: absolute; left: -9999px; width: 1px; height: 1px;" /></form></div>');

      dialogContent.find('#sendTextForm').on('submit', function() {
        xbmc.sendText({
          text: $('input').val(),
          onSuccess: function() {
            $('div.inputSendText .close').click();
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