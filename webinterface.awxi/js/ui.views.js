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
						(artistdetails.genre? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_genre') + '</span><span class="labelinfo">' + artistdetails.genre + '</span></div>' : '') +
						(artistdetails.mood? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_mood') + '</span><span class="labelinfo">' + artistdetails.mood + '</span></div>' : '') +
						(artistdetails.style? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_style') + '</span><span class="labelinfo">' +  artistdetails.style + '</span></div>' : '') +
						(artistdetails.born? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_born') + '</span><span class="labelinfo">' + artistdetails.born + '</span></div>' : '') +
						(artistdetails.formed? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_formed') + '</span><span class="labelinfo">' + artistdetails.formed + '</span></div>' : '') +
						(artistdetails.died? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_died') + '</span><span class="labelinfo">' + artistdetails.died + '</span></div>' : '') +
						(artistdetails.disbanded? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_disbanded') + '</span><span class="labelinfo">' + artistdetails.disbanded + '</span></div>' : '') +
						(artistdetails.yearsactive? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_yearsactive') + '</span><span class="labelinfo">' + artistdetails.yearsactive + '</span></div>' : '') +
						(artistdetails.instrument? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_instrument') + '</span><span class="labelinfo">' + artistdetails.instrument + '</span></div>' : '') +
						'<p class="artistdesc">' + artistdetails.description + '</p>');
					
					mkf.dialog.setContent(dialogHandle, dialogContent);
					
				},
				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed_artist_list'), mkf.messageLog.status.error, 5000);
					mkf.dialog.close(dialogHandle);				
				}
			});

			return false;
		}, // END onArtistInformationClick

		/*---------*/
		ArtistAlbums: function(e) {
			// open new page to show artist's albums
			//console.log(e.data);
			var $artistContent = $('<div class="pageContentWrapper"></div>');
			var artistPage = mkf.pages.createTempPage(e.data.objParentPage, {
				title: e.data.strArtist,
				content: $artistContent
			});
			artistPage.setContextMenu(
				[
					{
						'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_album_list'), 'shortcut':'Ctrl+1', 'onClick':
						function() {
							mkf.pages.closeTempPage(artistPage);
							return false;
						}
					}
				]
			);
			mkf.pages.showTempPage(artistPage);

			// show artist's albums
			$artistContent.addClass('loading');
			xbmc.getArtistsAlbums({
				artistid: e.data.idArtist,

				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed_artists_albums'), mkf.messageLog.status.error, 5000);
					$artistContent.removeClass('loading');
				},

				onSuccess: function(result) {
					$artistContent.defaultAlbumViewer(result, artistPage);
					$artistContent.removeClass('loading');
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
							'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_album_list'), 'shortcut':'Ctrl+1', 'onClick':
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
						mkf.messageLog.show(mkf.lang.get('message_failed_artists_list'), mkf.messageLog.status.error, 5000);
						$artistGenresContent.removeClass('loading');
					},

					onSuccess: function(result) {
						$artistContent.defaultArtistsViewer(result, artistPage);
						$artistContent.removeClass('loading');
					}
				});

				return false;
			},
		
		/*-----------*/
		AllGenreAlbums: function(e) {
			// open new page to show artist's albums
			var $artistsGenresContent = $('<div class="pageContentWrapper"></div>');
			var artistPage = mkf.pages.createTempPage(e.data.objParentPage, {
				title: e.data.strGenre,
				content: $artistsGenresContent
			});
			artistPage.setContextMenu(
				[
					{
						'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_album_list'), 'shortcut':'Ctrl+1', 'onClick':
						function() {
							mkf.pages.closeTempPage(artistPage);
							return false;
						}
					}
				]
			);
			mkf.pages.showTempPage(artistPage);

			// show artist's
			$artistsGenresContent.addClass('loading');
			xbmc.getGenresAlbums({
				genreid: e.data.idGenre,

				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed_album_list'), mkf.messageLog.status.error, 5000);
					$artistsGenresContent.removeClass('loading');
				},

				onSuccess: function(result) {
					$artistsGenresContent.defaultAlbumViewer(result, artistPage);
					$artistsGenresContent.removeClass('loading');
				}
			});

			return false;
		},
		
		/*------*/
		AlbumPlay: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_album'));
			xbmc.playAlbum({
				albumid: e.data.idAlbum,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});
			return false;
		},

		/*-----------*/
		MusicGenrePlay: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_genre'));
			xbmc.playMusicGenre({
				genreid: e.data.idGenre,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});
			return false;
		},
		
		/*-----------*/
		ArtistPlay: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_playing_artist'));
			xbmc.playArtist({
				artistid: e.data.idArtist,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});
			return false;
		},
		
		
		/*---------------*/
		AddAlbumToPlaylist: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_album_to_playlist'));
			xbmc.addAlbumToPlaylist({
				albumid: e.data.idAlbum,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});
			return false;
		},

		/*---------------*/
		AddGenreToPlaylist: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_genre_to_playlist'));
			xbmc.addGenreToPlaylist({
				genreid: e.data.idGenre,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});
			return false;
		},
		
		/*---------------*/
		AddArtistToPlaylist: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_artist_to_playlist'));
			xbmc.addArtistToPlaylist({
				artistid: e.data.idArtist,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
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
						'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_song_list'), 'shortcut':'Ctrl+1', 'onClick':
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
			xbmc.getAlbumsSongs({
				albumid: e.data.idAlbum,

				onError: function() {
					mkf.messageLog.show(mkf.lang.get('message_failed_albums_songs'), mkf.messageLog.status.error, 5000);
					$songlistContent.removeClass('loading');
				},

				onSuccess: function(result) {
					$songlistContent.defaultSonglistViewer(result);
					$songlistContent.removeClass('loading');
				}
			});

			return false;
		},

		/*-----*/
		SongPlay: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_song'));
			xbmc.playSong({
				songid: e.data.idSong,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});
			return false;
		},

		/*--------------*/
		AddSongToPlaylist: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_song_to_playlist'));
			xbmc.addSongToPlaylist({
				songid: e.data.idSong,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 8000, mkf.messageLog.status.error);
				}
			});
			return false;
		},

		/*---------*/
		SongPlayNext: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_song_next'));
			xbmc.playSongNext({
				songid: e.data.idSong,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 8000, mkf.messageLog.status.error);
				}
			});
			return false;
		},
		
/*--------------------*/
/* Movie UI functions */
/*--------------------*/

		/*------*/
		MoviePlay: function(event) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_movie'));

			xbmc.playMovie({
				movieid: event.data.idMovie,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});

			return false;
		},

		/*------*/
		FilePlay: function(event) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_file'));

			xbmc.playVideoFile({
				file: event.data.file,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});

			return false;
		},
		
		/*------*/
		CinExPlay: function(event) {
			//var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_movie'));

			xbmc.cinemaEx({
				film: event.data.strMovie,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});

			return false;
		},
		
		/*---------------*/
		AddMovieToPlaylist: function(event) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_movie_to_playlist'));

			xbmc.addMovieToPlaylist({
				movieid: event.data.idMovie,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 8000, mkf.messageLog.status.error);
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
						channels: 0,
						aStreams: 0,
						hasSubs: false,
						aLang: '',
						aspect: 0,
						vwidth: 0
					};
					
					if ( useFanart ) {
						$('.mkfOverlay').css('background-image', 'url("' + xbmc.getThumbUrl(movie.fanart) + '")');
					};
					
					if (movie.streamdetails) {
						if (movie.streamdetails.subtitle) { streamdetails.hasSubs = true };
						if (movie.streamdetails.audio) {
							streamdetails.channels = movie.streamdetails.audio[0].channels;
							streamdetails.aStreams = movie.streamdetails.audio.length;
							$.each(movie.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
							if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('label_not_available') };
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
					//dialogContent += '<img src="' + thumb + '" class="thumb thumb' + xbmc.getMovieThumbType() + ' dialogThumb" />' + //Won't this always be poster?!
					var dialogContent = $('<div><img src="' + thumb + '" class="thumb thumbPosterLarge dialogThumb" />' +
						//(cinex? '<div style="float: left; position: absolute; margin-top: 288px"><a href="#" class="cinexplay">' + mkf.lang.get('label_cinex_play') + '</a></div>' : '') + '</div>' +
						'<div><h1 class="underline">' + movie.title + '</h1></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_original_title') + '</span><span class="value">' + (movie.originaltitle? movie.originaltitle : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_runtime') + '</span><span class="value">' + (movie.runtime? movie.runtime : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_genre') + '</span><span class="value">' + (movie.genre? movie.genre : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="value"><div class="smallRating' + Math.round(movie.rating) + '"></div></span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_votes') + '</span><span class="value">' + (movie.votes? movie.votes : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_year') + '</span><span class="value">' + (movie.year? movie.year : mkf.lang.get('label_not_available')) + '</span></div>' +
						(movie.director? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_director') + '</span><span class="value">' + movie.director + '</span></div>' : '') +
						(movie.writer? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_writer') + '</span><span class="value">' + movie.writer + '</span></div>' : '') +
						(movie.studio? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_studio') + '</span><span class="value">' + movie.studio + '</span></div>' : '') +
						(movie.tagline? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_tagline') + '</span><span class="value">' + movie.tagline + '</span></div>' : '') +
						(movie.trailer? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_trailer') + '</span><span class="value"><a href="' + movie.trailer + '">' + mkf.lang.get('label_link') + '</a>' +
						'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="trailerplay">' + mkf.lang.get('label_xbmc_play') + '</a></span></div></div>' : '') +
						
						(movie.set[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_set') + '</span><span class="value">' + movie.set + '</span></div>' : '') +
						(movie.lastplayed? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_lastplayed') + '</span><span class="value">' + movie.lastplayed + '</span></div>' : '') +
						(movie.playcount? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_playcount') + '</span><span class="value">' + movie.playcount + '</span></div>' : '') +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_audioStreams') + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('label_not_available')) + '</span></div>' +
						(movie.imdbnumber? '<div class="movieinfo"><span class="label">IMDB:</span><span class="value">' + '<a href="http://www.imdb.com/title/' + movie.imdbnumber + '">IMDB</a>' + '</span></div></div>' : '') +
						'<div class="movieinfo filelink"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + movie.file + '</a>' + '</span></div></div>' +
						(cinex? '<div class="cinex"><a href="#" class="cinexplay">' + mkf.lang.get('label_cinex_play') + '</a>' : '') + '</div>' +
						'<p class="plot">' + movie.plot + '</p>' +
						'<div class="movietags"><span class="infoqueue" title="' + mkf.lang.get('btn_enqueue') + '" /><span class="infoplay" title="' + mkf.lang.get('btn_play') + '" /></div>');

					if (movie.streamdetails) {
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
					
					if (movie.streamdetails) {
						if (movie.streamdetails.subtitle) { streamdetails.hasSubs = true };
						if (movie.streamdetails.audio) {
							streamdetails.channels = movie.streamdetails.audio[0].channels;
							streamdetails.aStreams = movie.streamdetails.audio.length;
							$.each(movie.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
							if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('label_not_available') };
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
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_original_title') + '</span><span class="value">' + (movie.originaltitle? movie.originaltitle : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_runtime') + '</span><span class="value">' + (movie.runtime? movie.runtime : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_genre') + '</span><span class="value">' + (movie.genre? movie.genre : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="value"><div class="smallRating' + Math.round(movie.rating) + '"></div></span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_votes') + '</span><span class="value">' + (movie.votes? movie.votes : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_year') + '</span><span class="value">' + (movie.year? movie.year : mkf.lang.get('label_not_available')) + '</span></div>' +
						(movie.director? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_director') + '</span><span class="value">' + movie.director + '</span></div>' : '') +
						(movie.writer? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_writer') + '</span><span class="value">' + movie.writer + '</span></div>' : '') +
						(movie.studio? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_studio') + '</span><span class="value">' + movie.studio + '</span></div>' : '') +
						(movie.tagline? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_tagline') + '</span><span class="value">' + movie.tagline + '</span></div>' : '') +
						(movie.trailer? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_trailer') + '</span><span class="value"><a href="' + movie.trailer + '">' + mkf.lang.get('label_link') + '</a>' +
						'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="trailerplay">' + mkf.lang.get('label_xbmc_play') + '</a></span></div></div>' : '') +
						
						(movie.set[0]? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_set') + '</span><span class="value">' + movie.set + '</span></div>' : '') +
						(movie.lastplayed? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_lastplayed') + '</span><span class="value">' + movie.lastplayed + '</span></div>' : '') +
						(movie.playcount? '<div class="movieinfo"><span class="label">' + mkf.lang.get('label_playcount') + '</span><span class="value">' + movie.playcount + '</span></div>' : '') +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_audioStreams') + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('label_not_available')) + '</span></div>' +
						(movie.imdbnumber? '<div class="movieinfo"><span class="label">IMDB:</span><span class="value">' + '<a href="http://www.imdb.com/title/' + movie.imdbnumber + '">IMDB</a>' + '</span></div></div>' : '') +
						'<div class="movieinfo filelink"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + movie.file + '</a>' + '</span></div></div>' +
						(cinex? '<div class="cinex"><a href="#" class="cinexplay">' + mkf.lang.get('label_cinex_play') + '</a>' : '') + '</div>' +
						'<p class="plot">' + movie.plot + '</p>' +
						'<div class="movietags" style="display: inline-block; width: auto"><span class="infoqueue" title="' + mkf.lang.get('btn_enqueue') + '" /><span class="infoplay" title="' + mkf.lang.get('btn_play') + '" /></div>');

					if (movie.streamdetails) {
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
			// open new page to show movies in set
			var $setContent = $('<div class="pageContentWrapper"></div>');
			var setPage = mkf.pages.createTempPage(e.data.objParentPage, {
				title: e.data.strSet,
				content: $setContent
			});
			setPage.setContextMenu(
				[
					{
						'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_season_list'), 'shortcut':'Ctrl+1', 'onClick':
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
					mkf.messageLog.show(mkf.lang.get('message_failed_movie_list'), mkf.messageLog.status.error, 5000);
					$setContent.removeClass('loading');
				},

				onSuccess: function(result) {
					$setContent.defaultMovieViewer(result.setdetails.items, e.data.idSet, setPage);
					$setContent.removeClass('loading');
				}
			});

			return false;
		},
		
/*-----------------*/
/* TV UI functions */
/*-----------------*/

		/*--------*/
		EpisodePlay: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_episode'));

			xbmc.playEpisode({
				episodeid: e.data.idEpisode,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});

			return false;
		},

		/*-----------------*/
		AddEpisodeToPlaylist: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('messsage_add_episode_to_playlist'));

			xbmc.addEpisodeToPlaylist({
				episodeid: e.data.idEpisode,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 8000, mkf.messageLog.status.error);
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
						'<div class="test"><span class="label">' + mkf.lang.get('label_genre') + '</span><span class="'+valueClass+'">' + (tvshow.genre? tvshow.genre : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="test"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="'+valueClass+'"><div class="smallRating' + Math.round(tvshow.rating) + '"></div></span></div>' +
						'<div class="test"><span class="label">' + mkf.lang.get('label_premiered') + '</span><span class="'+valueClass+'">' + (tvshow.premiered? tvshow.premiered : mkf.lang.get('label_not_available')) + '</span></div>' +
						//'<div class="test"><span class="label">' + mkf.lang.get('label_year') + '</span><span class="'+valueClass+'">' + (tvshow.year? tvshow.year : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="test"><span class="label">' + mkf.lang.get('label_episodes') + '</span><span class="'+valueClass+'">' + tvshow.episode + '</span></div>' +
						'<div class="test"><span class="label">' + mkf.lang.get('label_playcount') + '</span><span class="'+valueClass+'">' + tvshow.playcount + '</span></div>' +
						'<div class="test"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="'+valueClass+'">' + tvshow.file + '</span></div>' +
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

					if (ep.streamdetails) {
						if (ep.streamdetails.subtitle) { streamdetails.hasSubs = true };
						if (ep.streamdetails.audio) {
							streamdetails.channels = ep.streamdetails.audio[0].channels;
							streamdetails.aStreams = ep.streamdetails.audio.length;
							$.each(ep.streamdetails.audio, function(i, audio) { streamdetails.aLang += audio.language + ' ' } );
							if ( streamdetails.aLang == ' ' ) { streamdetails.aLang = mkf.lang.get('label_not_available') };
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
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_episode') + '</span><span class="value">' + (ep.episode? ep.episode : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_season') + '</span><span class="value">' + (ep.season? ep.season : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_runtime') + '</span><span class="value">' + (ep.runtime? ep.runtime : mkf.lang.get('label_not_available')) + '</span></div>' +						
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="value"><div class="smallRating' + Math.round(ep.rating) + '"></div></span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_votes') + '</span><span class="value">' + (ep.votes? ep.votes : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_firstaired') + '</span><span class="value">' + (ep.firstaired? ep.firstaired : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_lastplayed') + '</span><span class="value">' + (ep.lastplayed? ep.lastplayed : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_playcount') + '</span><span class="value">' + (ep.playcount? ep.playcount : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_audioStreams') + '</span><span class="value">' + (streamdetails.aStreams? streamdetails.aStreams + ' - ' + streamdetails.aLang : mkf.lang.get('label_not_available')) + '</span></div>' +
						'<div class="movieinfo"><span class="label">' + mkf.lang.get('label_file') + '</span><span class="value">' + '<a href="' + fileDownload + '">' + ep.file + '</a>' + '</span></div></div>' +
						'<p class="plot">' + ep.plot + '</p>' +
						'<div class="movietags"><span class="infoqueue" title="' + mkf.lang.get('btn_enqueue') + '" /><span class="infoplay" title="' + mkf.lang.get('btn_play') + '" /></div>');

					if (ep.streamdetails) {
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
						mkf.messageLog.show(mkf.lang.get('message_failed_tvshows_seasons'), mkf.messageLog.status.error, 5000);
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
						'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_season_list'), 'shortcut':'Ctrl+1', 'onClick':
						function() {
							mkf.pages.closeTempPage(seasonsPage);
							return false;
						}
					},
					{
						'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
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
			
			//console.log(e.data);
			var fillPage = function() {
				$unwatchedEpsContent.addClass('loading');
				xbmc.getunwatchedEps({
					tvshowid: e.data.idTvShow,

					onError: function() {
						mkf.messageLog.show(mkf.lang.get('message_failed'), mkf.messageLog.status.error, 5000);
						$unwatchedEpsContent.removeClass('loading');
					},

					onSuccess: function(result) {
						if (result.length == 0) {
						mkf.messageLog.show(mkf.lang.get('message_nounwatched'), mkf.messageLog.status.error, 5000);
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
						'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_season_list'), 'shortcut':'Ctrl+1', 'onClick':
						function() {
							mkf.pages.closeTempPage(unwatchedEpsPage);
							return false;
						}
					},
					{
						'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
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
						mkf.messageLog.show(mkf.lang.get('message_failed_seasons_episodes'), mkf.messageLog.status.error, 5000);
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
						'icon':'close', 'title':mkf.lang.get('ctxt_btn_close_episode_list'), 'shortcut':'Ctrl+1', 'onClick':
						function() {
							mkf.pages.closeTempPage(episodesPage);
							return false;
						}
					},
					{
						'icon':'refresh', 'title':mkf.lang.get('ctxt_btn_refresh_list'), 'onClick':
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
	
/*-----------------------*/
/* Playlist UI functions */
/*-----------------------*/
	
		/*--------------------*/
		PlaylistAudioItemRemove: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_removing_item'));
			
			xbmc.removeAudioPlaylistItem({
				item: e.data.itemNum,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					awxUI.onMusicPlaylistShow();
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});
		
			return false;
		},

		/*------------------*/
		PlaylistAudioItemPlay: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_item'));

			xbmc.playAudio({
				item: e.data.itemNum,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});

			return false;
		},

		/*--------------------*/
		PlaylistVideoItemRemove: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_removing_item'));
			
			xbmc.removeVideoPlaylistItem({
				item: e.data.itemNum,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
					awxUI.onVideoPlaylistShow();
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
				}
			});
		
			return false;
		},

		/*------------------*/
		PlaylistVideoItemPlay: function(e) {
			var messageHandle = mkf.messageLog.show(mkf.lang.get('message_playing_item'));

			xbmc.playVideo({
				item: e.data.itemNum,
				onSuccess: function() {
					mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
				},
				onError: function(errorText) {
					mkf.messageLog.appendTextAndHide(messageHandle, errorText, 8000, mkf.messageLog.status.error);
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
			var $artistList = $('<ul class="fileList"></ul>');

				$.each(artists.artists, function(i, artist)  {
					$artistList.append('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper"><a href="" class="button info' + artist.artistid + '" title="' + mkf.lang.get('btn_information') + '"><span class="miniIcon information" /></a>' +
										'<a href="" class="button playlist' + artist.artistid + '" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' +
										'<a href="" class="button play' + artist.artistid + '" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' + 
										'<a href="" class="artist' +
										artist.artistid + '">' +
										artist.label + '<div class="findKeywords">' + artist.label.toLowerCase() + '</div>' +
										'</a></li>');
					$artistList.find('.artist' + artist.artistid)
						.bind('click',{ idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums);
					$artistList.find('.playlist' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.AddArtistToPlaylist);
					$artistList.find('.play' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.ArtistPlay);
					$artistList.find('.info' + artist.artistid).on('click', {idArtist: artist.artistid}, uiviews.ArtistInfoOverlay);
					
				});

			return $artistList;
		},

		/*----Artists thumb view----*/
		ArtistViewThumbnails: function(artists, parentPage) {
			var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
			var hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no')=='yes'? 'click' : 'mouseenter';
			
			var $artistList = $('<div></div>');

				$.each(artists.artists, function(i, artist)  {
					var thumb = (artist.thumbnail? xbmc.getThumbUrl(artist.thumbnail) : 'images/thumb.png');
					$artist = $('<div class="album'+artist.artistid+' thumbWrapper">' +
						'<div class="linkArtistWrapper">' + 
								'<a href="" class="albums' + artist.artistid + '">' + mkf.lang.get('btn_all') + '</a>' +
								'<a href="" class="info' + artist.artistid + '">' + mkf.lang.get('btn_information') + '</a>' +
								'<a href="" class="enqueue' + artist.artistid + '">' + mkf.lang.get('btn_enqueue') + '</a>' +
						'</div>' +
						(useLazyLoad?
							'<img src="images/loading_thumb.gif" alt="' + artist.label + '" class="thumb albums" data-original="' + thumb + '" />':
							'<img src="' + thumb + '" alt="' + artist.label + '" class="thumb albums" />'
						) +
						'<div class="albumInfo">' + artist.artist + '</div></div>' +
						'<div class="findKeywords">' + artist.label.toLowerCase() + ' ' + artist.artist.toLowerCase() + '</div>' +
					'</div>');

				$artistList.append($artist);
				$artistList.find('.albums' + artist.artistid).bind('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums)
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
			var artistsPath = mkf.cookieSettings.get('artistsPath', '');
			var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
			var hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no')=='yes'? 'click' : 'mouseenter';
			
			var $artistList = $('<div></div>');

				$.each(artists.artists, function(i, artist)  {
					//var thumb = (artist.thumbnail? xbmc.getThumbUrl(artist.thumbnail) : 'images/missing_logo.png');
					artist.file = artistsPath + artist.label + '/';
					xbmc.getLogo(artist.file, function(logo) {
					$artist = $('<div class="artist'+artist.artistid+' logoWrapper thumbLogoWrapper">' +
						'<div class="linkTVLogoWrapper">' + 
								'<a href="" class="albums' + artist.artistid + '">' + mkf.lang.get('btn_all') + '</a>' +
								'<a href="" class="info' + artist.artistid + '">' + mkf.lang.get('btn_information') + '</a>' +
								'<a href="" class="enqueue' + artist.artistid + '">' + mkf.lang.get('btn_enqueue') + '</a>' +
						'</div>' +
						(useLazyLoad?
						'<img src="images/loading_thumb.gif" alt="' + artist.label + '" class="thumb thumbLogo" data-original="' + (logo? logo : 'images/missing_logo.png') + '" />':
						'<img src="' + (logo? logo : 'images/missing_logo.png') + '" alt="' + artist.label + '" class="thumbLogo artist" />'
						) +
						'<div class="albumArtist">' + artist.artist + '</div></div>' +
						'<div class="findKeywords">' + artist.label.toLowerCase() + '</div>' +
					'</div>').appendTo($artistList);

					$artistList.find('.albums' + artist.artistid).bind('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums)
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
						'<div class="movietags" style="display: inline-block; width: auto; margin-top: 5px"><span class="infoqueue" title="' + mkf.lang.get('btn_enqueue') + '" /><span class="infoplay" title="' + mkf.lang.get('btn_play') + '" /><span class="infoinfo" title="' + mkf.lang.get('btn_information') + '" /></div>' +
						'</div>' +
						//'<div class="findKeywords">' + artist.label.toLowerCase() + '</div>' +
						'<div class="next" style="float: left; margin-bottom: 50px; margin-left: 10px; display: table-cell"><a href="#" /></div>' +
					'</div>').appendTo($artistList);;

				artist.file = artistsPath + artist.label + '/';

				$artist.find('.artist').on('click', { idArtist: artist.artistid, strArtist: artist.label, objParentPage: parentPage }, uiviews.ArtistAlbums);

				$artistList.find('.infoplay').on('click', {idArtist: artist.artistid}, uiviews.ArtistPlay);
				$artistList.find('.infoenqueue').on('click', {idArtist: artist.artistid}, uiviews.AddArtistToPlaylist);
				$artistList.find('.infoinfo').on('click', {idArtist: artist.artistid}, uiviews.ArtistInfoOverlay);
				
				xbmc.getLogo(artist.file, function(logo) {
						$('.artist'+artist.artistid).children('img').attr('src', (logo? logo : 'images/missing_logo.png')); 
					});
				
				$artistList.find('div.next').on('click', function () {
					$('div.artist' + artists.artists[currentArtist].artistid).removeClass('artist' + artists.artists[currentArtist].artistid);
					if (currentArtist < artists.limits.end -1) {currentArtist++ } else { currentArtist = artists.limits.start };
					$('div.logoWrapper').addClass('artist' + artists.artists[currentArtist].artistid);
					artist.file = artistsPath + artists.artists[currentArtist].label + '/';
					xbmc.getLogo(artist.file, function(logo) {
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
					xbmc.getLogo(artist.file, function(logo) {
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
		
		/*----Audio genres list view----*/
		AudioGenresViewList: function(agenres, parentPage) {
			var $artistGenresList = $('<ul class="fileList"></ul>');
			$.each(agenres.genres, function(i, artistGenres)  {
				if (artistGenres.genreid == 0) { return };
				$artistGenresList.append('<li' + (i%2==0? ' class="even"': '') + 
									'><div class="folderLinkWrapper"><a href="" class="button allgenre' + artistGenres.genreid + '" title="' + mkf.lang.get('btn_all') +
									'"><span class="miniIcon all" /></a><a href="" class="button playlist' + artistGenres.genreid + '" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' +
									'<a href="" class="button play' + artistGenres.genreid + '" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a><a href="" class="genre' + 
									artistGenres.genreid + '">' +
									artistGenres.label + '<div class="findKeywords">' + artistGenres.label.toLowerCase() + '</div>' +
									'</a></div></li>');
				$artistGenresList.find('.allgenre' + artistGenres.genreid).on('click', {idGenre: artistGenres.genreid, strGenre: artistGenres.label, objParentPage: parentPage}, uiviews.AllGenreAlbums);
				$artistGenresList.find('.genre' + artistGenres.genreid).bind('click',{idGenre: artistGenres.genreid,strGenre: artistGenres.label, objParentPage: parentPage}, uiviews.GenreArtists);
				$artistGenresList.find('.playlist' + artistGenres.genreid).on('click', {idGenre: artistGenres.genreid}, uiviews.AddGenreToPlaylist);
				$artistGenresList.find('.play' + artistGenres.genreid).bind('click', {idGenre: artistGenres.genreid, strAlbum: artistGenres.label}, uiviews.MusicGenrePlay);
			});
			return $artistGenresList;
		},
		
		/*----Audio Playlists list view----*/
		AudioPlaylistsViewList: function(aplaylists, callback) {
			var $audioPlaylists = $('<ul class="fileList"></ul>');
			$.each (aplaylists, function() {
				if (aplaylists > 0) {
					$.each(aplaylists, function(i, playlist)  {
						$audioPlaylists.append('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' +
											'<a href="" class="button playlistinfo' + i +'" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' +
											'<a href="" class="button play' + i + '" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' +
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
						'<a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' +
						'<a href="" class="button play" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' +
						'<a href="" class="album' + album.albumid + '">' + album.label + ' - ' + album.artist + '<div class="findKeywords">' + album.label.toLowerCase() + ' ' + album.artist.toLowerCase() + '</div>' +
						'</a></div></li>').appendTo($albumsList);

					$album.find('.album'+ album.albumid).bind('click', {idAlbum: album.albumid, strAlbum: album.label, objParentPage: parentPage }, uiviews.Songlist);
					$album.find('.playlist').bind('click', {idAlbum: album.albumid}, uiviews.AddAlbumToPlaylist);
					$album.find('.play').bind('click', {idAlbum: album.albumid, strAlbum: album.label}, uiviews.AlbumPlay);
				});
			return $albumsList
		},
		
		/*----Albums thumbnail view----*/
		AlbumsViewThumbnails: function(albums, parentPage) {
			var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
			var hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no')=='yes'? 'click' : 'mouseenter';
			var $albumsList = $('<div></div>');
			
			$.each(albums.albums, function(i, album) {
				var thumb = (album.thumbnail? xbmc.getThumbUrl(album.thumbnail) : 'images/thumb.png');
				$album = $('<div class="album'+album.albumid+' thumbWrapper">' +
						'<div class="linkWrapper">' + 
							'<a href="" class="play">' + mkf.lang.get('btn_play') + '</a><a href="" class="songs">' + mkf.lang.get('btn_songs') + '</a><a href="" class="playlist">' + mkf.lang.get('btn_enqueue') + '</a>' +
						'</div>' +
						(useLazyLoad?
							'<img src="images/loading_thumb.gif" alt="' + album.label + '" class="thumb" data-original="' + thumb + '" />':
							'<img src="' + thumb + '" alt="' + album.label + '" class="thumb" />'
						) +
						'<div class="albumName">' + album.label + '' +
						'<div class="albumArtist">' + album.artist + '</div></div>' +
						'<div class="findKeywords">' + album.label.toLowerCase() + ' ' + album.artist.toLowerCase() + '</div>' +
					'</div>');

				$albumsList.append($album);
				$album.find('.play').bind('click', {idAlbum: album.albumid, strAlbum: album.label}, uiviews.AlbumPlay);
				$album.find('.songs').bind('click', {idAlbum: album.albumid, strAlbum: album.label, objParentPage: parentPage }, uiviews.Songlist);
				$album.find('.playlist').bind('click', {idAlbum: album.albumid}, uiviews.AddAlbumToPlaylist);
				
			});
			
			$albumsList.find('.thumbWrapper').on(hoverOrClick, function() { $(this).children('.linkWrapper').show() });					
			$albumsList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkWrapper').hide() });
			
			return $albumsList;
		},
		
		/*----Albums list inline song view----*/
		AlbumsViewListInline: function(albums) {
		
			//can't find accordion without this...?
			var page = $('<div></div>');
			
			var $albumsList = $('<div id="multiOpenAccordion"></div>').appendTo(page);
			
				$.each(albums.albums, function(i, album) {
							//var thumb = (album.thumbnail? xbmc.getThumbUrl(album.thumbnail) : 'images/thumb.png');
							$album = $('<h3 class="multiOpenAccordion-header" id="albumName' + album.albumid + '"><a href="#" id="album' + i + '">' + album.label + ' - ' + album.artist +
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

							xbmc.getAlbumsSongs({
								albumid: albumID,

								onError: function() {
									mkf.messageLog.show(mkf.lang.get('message_failed_albums_songs'), mkf.messageLog.status.error, 5000);
									infodiv.removeClass('loading');
								},

								onSuccess: function(songs) {
									//$songlistContent.defaultSonglistViewer(result);
									var albuminfo = albums.albums[albumI];
									var thumb = (albuminfo.thumbnail? xbmc.getThumbUrl(albuminfo.thumbnail) : 'images/thumb.png');
									//var thumb = (songs.songs[0].thumbnail? xbmc.getThumbUrl(songs.songs[0].thumbnail) : 'images/thumb.png');
									infodiv.removeClass('loading');
									//console.log(songs);
									var albumContent = $('<div style="float: left; margin: 5px;"><img src="' + thumb + '" class="thumb" />' +
									'<div style="width: 102px; display: block; padding-left: 13px; padding-bottom: 50px"><span class="infoqueue" title="' + mkf.lang.get('btn_enqueue') + '" /><span class="infoplay" title="' + mkf.lang.get('btn_play') + '" /></div>' +
									'<div class="albumInfo"><div><span class="label">' + mkf.lang.get('label_genre') + '</span>' +
									'<span class="value">' + albuminfo.genre + '</span></div><div><span class="label">' + mkf.lang.get('label_rating') + '</span><span class="value">' + (albuminfo.rating? albuminfo.rating : mkf.lang.get('label_not_available')) + '</span></div>' +
									'<div><span class="label">' + mkf.lang.get('label_year') + '</span><span class="value">' + (albuminfo.year? albuminfo.year : mkf.lang.get('label_not_available')) + '</span></div>' +
									'<div><span class="label">' + mkf.lang.get('label_mood') + '</span><span class="value">' + (albuminfo.mood? albuminfo.mood : mkf.lang.get('label_not_available')) + '</span></div>' +
									'<div><span class="label">' + mkf.lang.get('label_style') + '</span><span class="value">' + (albuminfo.style? albuminfo.style : mkf.lang.get('label_not_available')) + '</span></div>' + '</div></div>');
									
									albumContent.find('.infoplay').bind('click', {idAlbum: albuminfo.albumid, strAlbum: albuminfo.label}, uiviews.AlbumPlay);
									albumContent.find('.infoqueue').bind('click', {idAlbum: albuminfo.albumid}, uiviews.AddAlbumToPlaylist);
									
									var $songList = $('<ul class="fileList" style="margin: 5px 0 5px 0"></ul>');

										$.each(songs.songs, function(i, song)  {
											var $song = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper song' + song.songid + '"> <a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') +
											'"><span class="miniIcon enqueue" /></a> <a href="" class="button playnext" title="' + mkf.lang.get('btn_playnext') +
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
		SongViewList: function(songs, options) {
			var $songList = $('<ul class="fileList"></ul>');

				$.each(songs.songs, function(i, song)  {
					var $song = $('<li' + (i%2==0? ' class="even"': '') + '><div class="folderLinkWrapper song' + song.songid + '"> <a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') +
					'"><span class="miniIcon enqueue" /></a> <a href="" class="button playnext" title="' + mkf.lang.get('btn_playnext') +
					'"><span class="miniIcon playnext" /></a> <a href="" class="song play">' + song.track + '. ' + song.artist + ' - ' + song.label + '</a></div></li>').appendTo($songList);
					
					$song.find('.playlist').bind('click', {idSong: song.songid}, uiviews.AddSongToPlaylist);
					$song.find('.play').bind('click', {idSong: song.songid}, uiviews.SongPlay);
					$song.find('.playnext').bind('click', {idSong: song.songid}, uiviews.SongPlayNext);
				});
			return $songList;
		},
		
/*-------------*/
/* Movie views */
/*-------------*/

		/*----Movie list accordion view----*/
		MovieViewAccordion: function(movies, options) {
		
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
		var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
		var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
		var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
		
		if (options) { filterWatched = options.filterWatched };
		
			//can't find accordion without this...?
			var page = $('<div></div>');
			
			var $moviesList = $('<div id="accordion"></div>').appendTo(page);
			var classEven = -1;
			
				$.each(movies.movies, function(i, movie) {
					var watched = false;
					if (typeof movie.movieid === 'undefined') { return; }
					if (movie.playcount > 0 && !filterShowWatched) { watched = true; }
					if (filterWatched && watched) { return; }

					classEven += 1;
							$movie = $('<h3 id="movieName' + movie.movieid + '"><a href="#">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') +
							'<div class="findKeywords">' + movie.label.toLowerCase() + '</div></a></h3><div>' + 
								'</div>').appendTo($moviesList);
				});
			
			//console.log($moviesList);
			
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
		MovieViewListInline: function(movies, options) {
		
			var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
			var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
			var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
			var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
			
			if (options) { filterWatched = options.filterWatched };
		
			//can't find accordion without this...?
			var page = $('<div></div>');
			
			var $moviesList = $('<div id="multiOpenAccordion"></div>').appendTo(page);
			var classEven = -1;
			
				$.each(movies.movies, function(i, movie) {
					var watched = false;
					if (typeof movie.movieid === 'undefined') { return; }
					if (movie.playcount > 0 && !filterShowWatched) { watched = true; }
					if (filterWatched && watched) { return; }

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
		MovieViewList: function(movies, options) {
		
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
		var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
		var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
		var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
		
		if (options) { filterWatched = options.filterWatched };
		
			var $movieList = $('<ul class="fileList"></ul>');
			var classEven = -1;
				$.each(movies.movies, function(i, movie) {
					var watched = false;
					if (typeof movie.movieid === 'undefined') { return; }
					if (movie.playcount > 0 && !filterShowWatched) { watched = true; }
					if (filterWatched && watched) { return; }
						
					classEven += 1
					$movie = $('<li' + (classEven%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' + 
						'<a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' +
						'<a href="" class="button play" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' +
						'<a href="" class="movieName' + movie.movieid + '">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
						'</a></div></li>').appendTo($movieList);

					$movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
					$movie.find('.playlist').bind('click', {idMovie: movie.movieid}, uiviews.AddMovieToPlaylist);
					$movie.find('.movieName' + movie.movieid).bind('click', {idMovie: movie.movieid}, uiviews.MovieInfoOverlay);
				});
			return $movieList;
		},
		
		/*----Movie thumbnail view----*/
		MovieViewThumbnails: function(movies, options) {
		
		var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
		var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
		var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
		var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
		var hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no')=='yes'? 'click' : 'mouseenter';
		
		if (options) { filterWatched = options.filterWatched };

		var $moviesList = $('<div></div>');
			$.each(movies.movies, function(i, movie) {
				var watched = false;
				// if movie has no id (e.g. movie sets), ignore it
				if (typeof movie.movieid === 'undefined') { return; }
				if (movie.playcount > 0) { watched = true; }
				if (filterWatched && watched) { return; }
				
				var thumb = (movie.thumbnail? xbmc.getThumbUrl(movie.thumbnail) : 'images/thumb' + xbmc.getMovieThumbType() + '.png');
				var $movie = $(
					'<div class="movie'+movie.movieid+' thumbWrapper thumb' + xbmc.getMovieThumbType() + 'Wrapper">' +
						'<div class="linkWrapper">' + 
							'<a href="" class="play">' + mkf.lang.get('btn_play') + '</a><a href="" class="playlist">' + mkf.lang.get('btn_enqueue') + '</a><a href="" class="info">' + mkf.lang.get('btn_information') + '</a>' +
							'<div class="movieRating' + Math.round(movie.rating) + '"></div>' +
						'</div>' +
						(useLazyLoad?
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
			
			$moviesList.find('.thumbWrapper').on(hoverOrClick, function() { $(this).children('.linkWrapper').show() });					
			$moviesList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkWrapper').hide() });
			
			return $moviesList;
		},
		
		/*----Movie single view----*/
		MovieViewSingle: function(movies, options) {
		
		//var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
		var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
		var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
		var useFanart = mkf.cookieSettings.get('usefanart', 'no')=='yes'? true : false;
		
		if (options) { filterWatched = options.filterWatched };

		
		var currentItem = 0;
		var contentWidth = $('#content').width();
		var contentHeight = ($('#main').length? $('#main').height() -65: $('#content').height());
		
		var imgHeight = contentHeight -100;
		//var imgWidthName = $('img.singleThumb').width();
		//console.log(imgWidthName);
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
				'<div class="movietags" style="display: inline-block; width: auto"><span class="infoqueue" title="' + mkf.lang.get('btn_enqueue') + '" /><span class="infoplay" title="' + mkf.lang.get('btn_play') + '" /><span class="infoinfo" title="' + mkf.lang.get('btn_information') + '" /></div>' +
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
				if (filterWatched) {
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
				if (filterWatched) {
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
						//'<a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') + '"><span class="miniIcon enqueue" /></a>' +
						//'<a href="" class="button play" title="' + mkf.lang.get('btn_play') + '"><span class="miniIcon play" /></a>' +
						'<a href="" class="movieSet' + movie.setid + '">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
						'</a></div></li>').appendTo($movieList);

					//$movie.find('.play').bind('click', {idMovie: movie.movieid, strMovie: movie.label}, uiviews.MoviePlay);
					//$movie.find('.playlist').bind('click', {idMovie: movie.movieid}, uiviews.AddMovieToPlaylist);
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
						//'<div class="linkWrapper">' + 
							//'<a href="" class="list">' + mkf.lang.get('btn_play') + '</a>' + 
							//<a href="" class="playlist">' + mkf.lang.get('btn_enqueue') + '</a><a href="" class="info">' + mkf.lang.get('btn_information') + '</a>' +
						//'</div>' +
						(useLazyLoad?
							'<img src="images/loading_thumb' + xbmc.getMovieThumbType() + '.gif" alt="' + movie.label + '" class="list thumb thumb' + xbmc.getMovieThumbType() + '" data-original="' + thumb + '" />':
							'<img src="' + thumb + '" alt="' + movie.label + '" class="list thumb thumb' + xbmc.getMovieThumbType() + '" />'
						) +
						'<div class="movieName">' + movie.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
						'<div class="findKeywords">' + movie.label.toLowerCase() + '</div>' +
					'</div>').appendTo($moviesList);
				$movie.find('.list').bind('click', {idSet: movie.setid, strSet: movie.label, objParentPage: parentPage}, uiviews.MovieSetDetails);
				//$movie.find('.playlist').bind('click', {idMovie: movie.movieid}, uiviews.AddMovieToPlaylist);
				//$movie.find('.info').bind('click', {idMovie: movie.movieid}, uiviews.MovieInfoOverlay);
			});
			return $moviesList;
		},

/*----------*/
/* TV views */
/*----------*/

		/*----TV list view----*/
		TVViewList: function(shows, parentPage) {
			//var $tvshowContainer = $(this);
			var $tvShowList = $('<ul class="fileList"></ul>');
			
			//var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
			var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
			//var listview = mkf.cookieSettings.get('listview', 'no')=='yes'? true : false;
			var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
		
			//if (listview) { var $tvShowList = $('<ul class="fileList"></ul>').appendTo($(this)); };
			var classEven = -1;

				$.each(shows.tvshows, function(i, tvshow) {
					var watched = false;
					if (tvshow.playcount > 0 && !filterShowWatched) { watched = true; }
					if (filterWatched && watched) { return; }
					
					classEven += 1
					$tvshow = $('<li' + (classEven%2==0? ' class="even"': '') + '><div class="folderLinkWrapper">' + 
						//'<a href="" class="season">' + mkf.lang.get('btn_seasons') + '</a>' +
						//'<a href="" class="info">' + mkf.lang.get('btn_information') + '</a>' +
						'<a href="" class="button info" title="' + mkf.lang.get('btn_information') + '"><span class="miniIcon information" /></a>' +
						'<a href="" class="button unwatched" title="' + mkf.lang.get('btn_unwatched') + '"><span class="miniIcon unwatched" /></a>' +
						'<a href="" class="tvshowName season">' + tvshow.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '<div class="findKeywords">' + tvshow.label.toLowerCase() + '</div>' +
						'</a></div></li>').appendTo($tvShowList);

					$tvshow.find('.season').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.SeasonsList);
					$tvshow.find('.info').bind('click', {'tvshow': tvshow}, uiviews.TVShowInfoOverlay);
					$tvshow.find('.unwatched').bind('click', {idTvShow: tvshow.tvshowid, strTvShow: tvshow.label, objParentPage: parentPage}, uiviews.Unwatched);
				});

			return $tvShowList;
		},
		
		/*----TV banner view----*/
		TVViewBanner: function(shows, parentPage) {
		
			var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
			var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
			var hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no')=='yes'? 'click' : 'mouseenter';
			var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
			
			var $tvShowList = $('<div></div>');
			
			if (shows.limits.total > 0) {
				$.each(shows.tvshows, function(i, tvshow) {
					var watched = false;
					if (tvshow.playcount > 0 && !filterShowWatched) { watched = true; }
					if (filterWatched && watched) { return; }
					var thumb = (tvshow.thumbnail? xbmc.getThumbUrl(tvshow.thumbnail) : 'images/thumb' + xbmc.getTvShowThumbType() + '.png');
					var $tvshow = $('<div class="tvshow'+tvshow.tvshowid+' thumbWrapper thumb' + xbmc.getTvShowThumbType() + 'Wrapper">' +
							'<div class="linkTVWrapper">' + 
								'<a href="" class="season">' + mkf.lang.get('btn_seasons') + '</a>' +
								'<a href="" class="info">' + mkf.lang.get('btn_information') + '</a>' +
								'<a href="" class="unwatched">' + mkf.lang.get('btn_unwatched') + '</a>' +
							'</div>' +
							(useLazyLoad?
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
			
			$tvShowList.find('.thumbWrapper').on(hoverOrClick, function() { $(this).children('.linkTVWrapper').show() });					
			$tvShowList.find('.thumbWrapper').on('mouseleave', function() { $(this).children('.linkTVWrapper').hide() });
				
			return $tvShowList;
		},
		
		/*----TV logo view----*/
		TVViewLogoWall: function(shows, parentPage) {
		
			var useLazyLoad = mkf.cookieSettings.get('lazyload', 'no')=='yes'? true : false;
			var filterWatched = mkf.cookieSettings.get('watched', 'no')=='yes'? true : false;
			var hoverOrClick = mkf.cookieSettings.get('hoverOrClick', 'no')=='yes'? 'click' : 'mouseenter';
			var filterShowWatched = mkf.cookieSettings.get('hidewatchedmark', 'no')=='yes'? true : false;
			
			var $tvShowList = $('<div></div>');
			
			if (shows.limits.total > 0) {
				$.each(shows.tvshows, function(i, tvshow) {
					var watched = false;
					if (tvshow.playcount > 0 && !filterShowWatched) { watched = true; }
					if (filterWatched && watched) { return; }
					var thumb = (tvshow.thumbnail? xbmc.getThumbUrl(tvshow.thumbnail) : 'images/missing_logo.png');
					xbmc.getLogo(tvshow.file, function(logo) {
					var $tvshow = $('<div class="tvshow'+tvshow.tvshowid+' logoWrapper thumbLogoWrapper">' +
							'<div class="linkTVLogoWrapper">' + 
								'<a href="" class="season">' + mkf.lang.get('btn_seasons') + '</a>' +
								'<a href="" class="info">' + mkf.lang.get('btn_information') + '</a>' +
								'<a href="" class="unwatched">' + mkf.lang.get('btn_unwatched') + '</a>' +
							'</div>' + 
							//'<img src="' + thumb + '" alt="' + tvshow.label + '" class="thumbLogo" />' +
							(useLazyLoad?
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
					$tvShowList.find('.thumbLogoWrapper').on(hoverOrClick, function() { $(this).children('.linkTVLogoWrapper').show() });					
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
				'"> <a href="" class="button playlist" title="' + mkf.lang.get('btn_enqueue') +
				'"><span class="miniIcon enqueue" /></a><a href="" class="button info" title="' + mkf.lang.get('btn_information') +
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
							'<a href="" class="play">' + mkf.lang.get('btn_play') + '</a><a href="" class="playlist">' + mkf.lang.get('btn_enqueue') + '</a><a href="" class="info">' + mkf.lang.get('btn_information') + '</a>' +
						'</div>' +
					(useLazyLoad?
					'<img src="images/loading_thumb.gif" alt="' + episode.label + '" class="thumb thumbFanart" data-original="' + thumb + '" />' :
					'<img src="' + thumb + '" alt="' + episode.label + '" class="thumbFanart" />'
					) +
					'</div>' +
					'<div class="episodeTitle">' + episode.label + (watched? '<img src="images/OverlayWatched_Small.png" />' : '') + '</div>' +
					'<div class="episodeTVSE">' + mkf.lang.get('label_season') + ' ' + episode.season + ' - ' + mkf.lang.get('label_episode') + ' ' +episode.episode + '</div>' +
					'<div class="episodeRating"><span class="label">' + mkf.lang.get('label_rating') + '</span><span><div class="smallRating' + Math.round(episode.rating) + '"></div></span></div>' +
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
							'<a href="" class="play">' + mkf.lang.get('btn_play') + '</a><a href="" class="playlist">' + mkf.lang.get('btn_enqueue') + '</a><a href="" class="unwatchedEps">' + mkf.lang.get('btn_unwatched') + '</a>' +
						'</div>' +
					(useLazyLoad?
					'<img src="images/loading_thumb.gif" alt="' + episode.label + '" class="thumb thumbFanart episode" data-original="' + thumb + '" />':
					'<img src="' + thumb + '" alt="' + episode.label + '" class="thumbFanart episode" />'
					) +
					'</div>' +
					'<div class="recentTVshowName">' + episode.showtitle + (watched? '<img src="images/OverlayWatched_Small.png" class="epWatched" />' : '') + 
					'<div class="episodeTVSE">' + mkf.lang.get('label_season') + ' ' + episode.season + ' - ' + mkf.lang.get('label_episode') + ' ' +episode.episode + '</div>' +
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
							var artist = (item.artist? item.artist : mkf.lang.get('label_not_available'));
							var album = (item.album? item.album : mkf.lang.get('label_not_available'));
							var label = (item.label? item.label : mkf.lang.get('label_not_available'));
							var title = (item.title? item.title : label);
							//var duration = (item.duration? item.duration : '');
						} else {
							var label = (item.label? item.label : mkf.lang.get('label_not_available'));
						};
						var duration = (item.duration? item.duration : '');
						var playlistItemClass = '';
						if (i%2==0) {
							playlistItemClass = 'even';
						}
						// what to about runtime and added files? console.log(runtime);
						runtime += duration;
						playlistItemCur = 'playlistItem';
						
						if (i == xbmc.periodicUpdater.curPlaylistNum && xbmc.periodicUpdater.playerStatus != 'stopped') {
							playlistItemCur = 'playlistItemCur';
							//$('#content').scrollTop($('.playlistItemCur').position().top);
						} else {
							playlistItemCur = 'playlistItem';
						}
						
						$item = $('<li class="' + playlistItemClass + '" id="apli' + i + '"><div class="folderLinkWrapper playlistItem' + i + '">' + 
							'<a class="button remove" href="" title="' + mkf.lang.get('btn_remove') +  '"><span class="miniIcon remove" /></a><a class="button playlistmove" href="" title="' + mkf.lang.get('btn_swap') +  '"><span class="miniIcon playlistmove" /></a>' +
							'<a class="' + playlistItemCur + ' apli' + i + ' play" href="">' + (i+1) + '. ' +
							(artist? artist + ' - ' : '') + (album? album + ' - ' : '') + (title? title : label) + '&nbsp;&nbsp;&nbsp;&nbsp;' + (duration? xbmc.formatTime(duration) : '') +
							(artist? '<div class="findKeywords">' + artist.toLowerCase() + ' ' + album.toLowerCase() + ' ' + label.toLowerCase() + '</div>' : '' ) +
							'</a></div></li>').appendTo($itemList);

						$item.find('a.play').bind('click', {itemNum: i}, uiviews.PlaylistAudioItemPlay);
						$item.find('a.remove').bind('click', {itemNum: i}, uiviews.PlaylistAudioItemRemove);
					});
				
				if (runtime > 0) {
						$('<div class="playtime"><p>' + mkf.lang.get('label_total_runtime') + xbmc.formatTime(runtime) + '</p></div>').appendTo(page);
				}
				
				
				page.find('#sortable').sortable({
					helper: 'clone',
					handle : '.playlistmove',
					update: function(event, ui) {
						var messageHandle = mkf.messageLog.show(mkf.lang.get('message_swap_playlist'));
						xbmc.swapAudioPlaylist({
							plFrom: ui.item.attr("id").replace(/[^\d]+/g, ''),
							plTo: ui.item.prevAll().length,
							onSuccess: function() {
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
								// update playlist - $each classRemove classAdd new IDs?
								awxUI.onMusicPlaylistShow();
							},
							onError: function(errorText) {
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 8000, mkf.messageLog.status.error);
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
						var showtitle = (item.showtitle? item.showtitle : mkf.lang.get('label_not_available'));
						var title = (item.label? item.label : mkf.lang.get('label_not_available'));
						var season = (item.season? item.season : mkf.lang.get('label_not_available'));
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
						if (i == xbmc.periodicUpdater.curPlaylistNum && xbmc.periodicUpdater.playerStatus != 'stopped') {
							playlistItemCur = 'playlistItemCur';
							//$('#content').scrollTop($('.fileList li:nth-child(' + i + ')').position().top);
						} else {
							playlistItemCur = 'playlistItem';
						};			
						$item = $('<li class="' + playlistItemClass + '" id="vpli' + i + '"><div class="folderLinkWrapper playlistItem' + i + '">' + 
							'<a class="button remove" href="" title="' + mkf.lang.get('btn_remove') +  '"><span class="miniIcon remove" /></a><a class="button playlistmove" href="" title="' + mkf.lang.get('btn_swap') +  '"><span class="miniIcon playlistmove" /></a>' +
							'<a class="' + playlistItemCur  + ' vpli' + i + ' play" href="">' + (i+1) + '. ' +
							(item.type=='episode'? showtitle + ' - Season ' + season + ' - ' + title : title) + '&nbsp;&nbsp;&nbsp;&nbsp;' + xbmc.formatTime(duration) +
							'</a></div></li>').appendTo($itemList);

						$item.find('a.play').bind('click', {itemNum: i}, uiviews.PlaylistVideoItemPlay);
						$item.find('a.remove').bind('click', {itemNum: i}, uiviews.PlaylistVideoItemRemove);
					});

				if (runtime > 0) {
					$('<p>' + mkf.lang.get('label_total_runtime') + xbmc.formatTime(runtime) + '</p>').appendTo($itemList);
				}
				
				page.find('#sortable').sortable({
					helper: 'clone',
					handle : '.playlistmove',
					update: function(event, ui) {
						var messageHandle = mkf.messageLog.show(mkf.lang.get('message_swap_playlist'));
						xbmc.swapVideoPlaylist({
							plFrom: ui.item.attr("id").replace(/[^\d]+/g, ''),
							plTo: ui.item.prevAll().length,
							onSuccess: function() {
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_ok'), 2000, mkf.messageLog.status.success);
								// update playlist - $each classRemove classAdd new IDs?
								awxUI.onVideoPlaylistShow();
							},
							onError: function(errorText) {
								mkf.messageLog.appendTextAndHide(messageHandle, mkf.lang.get('message_failed'), 8000, mkf.messageLog.status.error);
							}
						});
					}
				});
				
			return page;		
		}
		
	}); // END ui.views
})(jQuery);