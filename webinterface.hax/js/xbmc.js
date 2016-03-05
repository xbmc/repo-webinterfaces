var xbmcFactory = (function ($) { //create the xbmc global object
	"use strict";

	//globals
	var VERSION, pub = {},
	  DEBUG = window.DEBUG || true, socket = { 'q': {} }, events = {}, server;

	//the map below describes the XBMC.* functions
	//functions are added to the XBMC object
	//objects are passed to makeFunction() before being added
	var rpc = {
		'Introspect': {
			'method': 'JSONRPC.Introspect'
		},
		'Version': {
			'method': 'JSONRPC.Version'
		},
		'GetAddons': {
			'method': 'Addons.GetAddons',
			'cache': true
		},
		'GetAddonDetails': {
			'method': 'Addons.GetAddonDetails',
			'params': { 'properties': [ 'name', 'version', 'summary', 'author', 'thumbnail', 'broken', 'enabled' ] },
			'cache': true
		},
		'GetChannelGroups': {
			'method': 'PVR.GetChannelGroups',
			'cache': true
		},
		'GetChannelGroupDetails': {
			'method': 'PVR.GetChannelGroupDetails',
			'cache': true
		},
		'GetChannels': {
			'method': 'PVR.GetChannels',
			'params': { 'properties': [ 'thumbnail', 'hidden', 'locked', 'channel' ] },
			'cache': true
		},
		'GetChannel': {
			'method': 'PVR.GetChannelDetails',
			'params': { 'properties': [ 'thumbnail', 'hidden', 'locked', 'channel' ] },
			'cache': true
		},
		'GetTVShows': {
			'method': 'VideoLibrary.GetTVShows',
			'params': { 'properties': [ 'thumbnail', 'art', 'year', 'studio', 'genre' ] },
			'cache': true
		},
		'GetTVShowDetails': {
			'method': 'VideoLibrary.GetTVShowDetails',
			'params': { 'properties': [ 'title', 'art', 'thumbnail' ] },
			'cache': true
		},
		'GetTVEpisodes': {
			'method': 'VideoLibrary.GetEpisodes',
			'params': { 'properties': [ 'tvshowid', 'title', 'thumbnail', 'episode', 'season', 'file', 'showtitle', 'runtime', 'lastplayed' ] },
			'cache': true
		},
		'GetEpisodeDetails': {
			'method': 'VideoLibrary.GetEpisodeDetails',
			'params': { 'properties': [ 'title', 'plot', 'writer', 'firstaired', 'playcount', 'runtime', 'director', 'season', 'episode', 'showtitle', 'cast', 'streamdetails', 'lastplayed', 'thumbnail', 'fanart', 'file', 'tvshowid' ] }
		},
		'GetRecentlyAddedEpisodes': {
			'method': 'VideoLibrary.GetRecentlyAddedEpisodes',
			'params': { 'properties': [ 'tvshowid', 'title', 'thumbnail', 'episode', 'season', 'file', 'showtitle' ], 'limits': { 'end': 5 } }
		},
		'GetMovies': {
			'method': 'VideoLibrary.GetMovies',
			'params': { "properties": [ "title", "originaltitle", "runtime", "year", "thumbnail", "file", "genre" ], "sort": { "method": "sorttitle", "ignorearticle": true } },
			'cache': true
		},
		'GetMovieYears': {
			'method': 'VideoLibrary.GetMovies',
			'params': { "properties": [ "year" ] },
			'cache': true
		},
		'GetVideoGenres': {
			'method': 'VideoLibrary.GetGenres',
			'cache': true
		},
		'GetAudioGenres': {
			'method': 'AudioLibrary.GetGenres',
			'cache': true
		},
		'GetRecentlyAddedMovies': {
			'method': 'VideoLibrary.GetRecentlyAddedMovies',
			'params': { "properties": [ "title", "originaltitle", "runtime", "year", "thumbnail", "file" ], 'limits': { 'end': 5 } }
		},
		'GetMovieDetails': {
			'method': 'VideoLibrary.GetMovieDetails',
			'params': { 'properties': [ 'title', 'genre', 'year', 'director', 'tagline', 'plot', 'runtime', 'fanart', 'thumbnail', 'writer', 'file' ] }
		},
		'GetArtists': {
			'params': { 'properties': [ 'thumbnail', 'genre' ], 'albumartistsonly': true },
			'method': 'AudioLibrary.GetArtists',
			'cache': true
		},
		'GetArtistDetails': {
			'params': { 'properties': [ 'thumbnail', 'genre', 'born', 'formed', 'died', 'disbanded' ] },
			'method': 'AudioLibrary.GetArtistDetails',
			'cache': true
		},
		'GetSongs': {
			'params': { 'properties': [ 'file', 'title', 'track', 'duration' ] },
			'method': 'AudioLibrary.GetSongs'
		},
		'GetRecentlyAddedAlbums': {
			'params': { 'properties': [ 'title', 'artist', 'albumlabel', 'year', 'thumbnail' ], 'limits': { 'end': 5 } },
			'method': 'AudioLibrary.GetRecentlyAddedAlbums'
		},
		'GetAlbums': {
			'params': {
				'properties': [ 'title', 'artist', 'year', 'thumbnail' ]
			},
			'method': 'AudioLibrary.GetAlbums',
			'cache': true
		},
		'GetAlbumDetails': {
			'params': { 'properties': [ 'title', 'artist', 'genre', 'albumlabel', 'year', 'fanart', 'thumbnail' ] },
			'method': 'AudioLibrary.GetAlbumDetails'
		},
		'GetMusicVideos': {
			'params': { 'properties': [ 'title', 'runtime', 'year', 'album', 'artist', 'track', 'thumbnail', 'file' ] },
			'method': 'VideoLibrary.GetMusicVideos',
			'cache': true
		},
		'GetMusicVideo': {
			'params': { 'properties': [ 'title', 'runtime', 'year', 'album', 'artist', 'track', 'thumbnail', 'file' ] },
			'method': 'VideoLibrary.GetMusicVideo'
		},
		'GetSources': {
			'method': 'Files.GetSources',
			'cache': true
		},
		'GetDirectory': {
			'params': {
				'properties': [ 'title', 'duration', 'originaltitle', 'thumbnail', 'file', 'size', 'mimetype' ],
				'sort': { 'method': 'file', 'order': 'ascending' }
			},
			'method': 'Files.GetDirectory'
		},
		'Open': {
			'method': 'Player.Open'
		},
		'GetPlaylists': {
			'method': 'Playlist.GetPlaylists'
		},
		'GetPlaylistItems': {
			'method': 'Playlist.GetItems',
			'params': { 'properties': [ 'title', 'showtitle', 'artist', 'season', 'episode', 'file', 'thumbnail', 'runtime', 'duration' ] }
		},
		'AddToPlaylist': {
			'method': 'Playlist.Add'
		},
		'RemoveFromPlaylist': {
			'method': 'Playlist.Remove'
		},
		'ClearPlaylist': {
			'method': 'Playlist.Clear'
		},
		'GetActivePlayer': {
			'method': 'Player.GetActivePlayers',
			'wrapper': function (players, callback) {
				if (!players.length) { callback(); return; };
				callback(players[0]); //run callback with the active player
			}
		},
		'GetActivePlayerID': {
			'method': 'Player.GetActivePlayers',
			'wrapper': function (players, callback) {
				if (!players.length) return; //do nothing if there is nothing playing
				callback(players[0].playerid); //run callback with the id of the active player
			}
		},
		'GetPlayerProperties': {
			'method': 'Player.GetProperties',
			'params': { 'properties': [ 'time', 'totaltime', 'speed', 'playlistid', 'position', 'repeat', 'type', 'partymode', 'shuffled', 'live' ] }
		},
		'GetActivePlayerProperties': function (callback) {
			pub.GetActivePlayer(function (player) {
				if (!player) { callback(); return; }
				else pub.GetPlayerProperties({ 'playerid': player.playerid },
					function (properties) {
						callback(properties);
					}
				);
			});
		},
		'PlayPause': {
			'requires': { 'name': 'playerid', 'value': 'GetActivePlayerID' },
			'method': 'Player.PlayPause'
		},
		'Stop': {
			'requires': { 'name': 'playerid', 'value': 'GetActivePlayerID' },
			'method': 'Player.Stop'
		},
		'GoTo': {
			'requires': { 'name': 'playerid', 'value': 'GetActivePlayerID' },
			'method': 'Player.GoTo'
		},
		'GoNext': function (callback) {
			pub.GoTo({ 'to': 'next' }, callback);
		},
		'GoPrevious': function (callback) {
			pub.GoTo({ 'to': 'previous' }, callback);
		},
		'Play': function (o, playlistid, position) {
			pub.ClearPlaylist({ 'playlistid': playlistid }, function () {
				pub.AddToPlaylist({ 'playlistid': playlistid, 'item': typeof o === 'string' ? { 'file': o } : o }, function () {
					pub.Open({ 'item': { 'playlistid': playlistid, 'position': position||0 } });
				});
			});
		},
		'Seek': {
			'requires': { 'name': 'playerid', 'value': 'GetActivePlayerID' },
			'method': 'Player.Seek'
		},
		'Volume': {
			'method': 'Application.SetVolume'
		},
		'GetApplicationProperties': {
			'params': { 'properties': [ 'volume', 'muted', 'name' ] },
			'method': 'Application.GetProperties'
		},
		'SendText': {
			'method': 'Input.SendText'
		},
		'ExecuteAction': {
			'method': 'Input.ExecuteAction'
		},
		'Action': function (action, callback) {
			pub.ExecuteAction({ 'action': action }, callback);
		},
		'Down': {
			'method': 'Input.Down'
		},
		'Up': {
			'method': 'Input.Up'
		},
		'Left': {
			'method': 'Input.Left'
		},
		'Right': {
			'method': 'Input.Right'
		},
		'Back': {
			'method': 'Input.Back'
		},
		'Home': {
			'method': 'Input.Home'
		},
		'Select': {
			'method': 'Input.Select'
		},
		'Info': {
			'method': 'Input.Info'
		},
		'ContextMenu': {
			'method': 'Input.ContextMenu'
		},
		'GetGUIProperties': {
			'params': { 'properties': [ "currentwindow", "currentcontrol", "skin", "fullscreen" ] },
			'method': 'GUI.GetProperties'
		},
		'GetGUIPropertiesFullscreen': {
			'params': { 'properties': [ "fullscreen" ] },
			'method': 'GUI.GetProperties'
		},
		'ToggleFullscreen': function (callback) {
			pub.GetGUIPropertiesFullscreen(function (properties) {
				pub.Fullscreen( { 'fullscreen': !properties.fullscreen }, callback );
			});
		},
		'Fullscreen': {
			'method': 'GUI.SetFullscreen'
		},
		'Eject': {
			'method': 'System.EjectOpticalDrive'
		}
	};
	
	
	//Modifies parts of an url
	//parseURL( '/' );
	//parseURL( '/', { 'protocol': 'https', 'port': 8080 } );
	//parseURL( '/', function () { this.protocol = 'https'; this.port = 8080; } );
	//parseURL( '/', [ { 'protocol': 'https' }, function () { this.port = '8080'; } ] );
	
	var parseURL = function (url, m) {
		var temp = document.createElement('a');
		temp.href = url || '/';
		var modifyObject = function (object, modifications) {
			if (!(modifications instanceof Array)) modifications = [modifications];
			$.each(modifications, function (i, modification) {
				if (modification instanceof Function) modification.apply(object);
				else if (modification instanceof Array) object = modifyObject(object, modification);
				else $.extend(object, modification);
			});
			return object;
		};
		if (m) temp = modifyObject(temp, m);
		return temp.href;
	};

	//public functions
	var pub = {
		'vfs2uri': (function () { //converts xbmc virtual filesystem paths to URIs
			var self, vfsurl = parseURL('/',{'protocol':'http'});
			self = function (vfs) {
				//if (vfs.substring(0,21) === 'image://http%3a%2f%2f') return decodeURIComponent( vfs.substring(8) ); //get image directly from the internet, bypassing the xbmc cache
				return vfsurl + encodeURIComponent(vfs);
			};
			self.set = function (url) {
				vfsurl = parseURL(url || '/');
			};
			return self;
		})(),
		'onNotification': function (method, callback) {
			server.onNotification(method, callback);
		},
		'version': (function () {
			var self, version;
			self = function () { return version; }
			self.set = function (v) { if (v >= 0) version = v; }
			return self;
		})(),
		'transport': (function () {
			var self, transport = 'ajax';
			self = function () { return transport; }
			self.set = function (t) { transport = t; }
			return self;
		})()
	};

	var cache = {};
	var load = function (name, params, callback) { //loads data from the JSON-RPC server using HTTP
		var r = rpc[name], cb;
		var hash = r.method+'_'+JSON.stringify(params).replace(/\W/g,''), cached = cache[hash];
		if (cached) callback(JSON.parse(cached));
		else {
			if (r && r.method) server.sendMessage(r.method, params, callback ? function (result) {
			  	if (callback instanceof Function) {
			  		cb = r.cache ? function (x) { cache[hash] = JSON.stringify(x); return callback(x); } : callback;
					if (result.result) result = result.result;
			  		if (r.wrapper) r.wrapper(result, cb);
			  		else cb(result);
				}
			} : undefined);
		}
	};
	
	
	var makeFunction = function (index, item) { //make public functions from the rpc array
		var template = function (params, callback) { //template for all the xbmc.* functions
			if (params && params instanceof Function) {
					callback = params;
					params = {};
			}
			if (!params) params = {};
			if (item.params) $.extend(true, params, item.params);
			load(index, params, callback);
		};
		if (item instanceof Function) { //if item is a function, just use that
			pub[index] = item;
			return;
		};
		if (item.requires) pub[index] = function (params, callback) { //wrap the template if there is a dependency
			if (params instanceof Function) { callback = params; params = {}; }
			if (!params) params = {};
			//return the required function with the template as a callback
			pub[item.requires.value]( {}, function (result) {
				var newparams = {};
				if (result !== undefined && item.requires.name) newparams[item.requires.name] = result;
				$.extend(newparams, params);
				template(newparams, callback);
			});
		};
		else pub[index] = template; //just use the bare template if there is no dependency
	};
	$.each(rpc, makeFunction); //make public functions from the rpc array
	
	var upgradeToSocket = function (address, callback) { //upgrade from ajax to websocket
		var ws = JSONRPC(address), ajax = server;
		if (DEBUG) console.log('XBMC: Attempting to upgrade transport to websocket '+address);
		if (!ws) { //ws is undefined if the browser has no websocket support
			if (DEBUG) console.log('XBMC: No websocket support in this browser: '+navigator.userAgent);
			return;
		};
		ws.notifications(ajax.notifications());
		ws.onConnect(function () {
			if (DEBUG) console.log('XBMC: Transport upgraded to websocket');
			server = ws; //replace ajax transport with websocket
			pub.transport.set('websocket');
			if (callback instanceof Function) callback();
		});
		ws.onDisconnect(function () { //replace websocket transport with ajax
			if (DEBUG) console.log('XBMC: Upgrading transport to websocket failed');
			if (pub.transport() === 'websocket') server = ajax;
			pub.transport.set('ajax');
		});
	};

	return function (address, success, fail) {
		
		//set URL variables
		var address = parseURL('/', { 'host': address });
		var ajaxURL = parseURL(address, { 'protocol': 'http', 'pathname': 'jsonrpc', 'search': '' });
		var wsURL = parseURL(address, { 'protocol': 'ws', 'pathname': 'jsonrpc', 'port': 9090 });
		pub.vfs2uri.set(parseURL(address, [
			{ 'protocol': 'http', 'pathname': 'vfs/' },
			function () { if (this.port === 9090) this.port = 80 }
		]));
		
		if (DEBUG) console.log('XBMC: Connecting to '+ajaxURL);
	 
	 	//create an ajax transport
		server = JSONRPC(ajaxURL);
		pub.transport.set('ajax');
	
		//get the version from the server, if it is over 5 the server supports websockets so we should upgrade the connection
		server.sendMessage('JSONRPC.Version',
		  function (data) { //success
			if (data.result && data.result.version) {
				if (DEBUG) console.log('XBMC: Connected: API Version '+data.result.version);
				pub.version.set(data.result.version);
				if (data.result.version >= 5) upgradeToSocket(wsURL);
				if (success instanceof Function) success();
			} else {
				if (DEBUG) console.log('XBMC: Connection failure: Invalid version received', data);
				if (fail instanceof Function) fail();
			}
		  },
		  function (data, error) { //failure
			if (DEBUG) console.log('XBMC: Connection failure: '+error, data);
			if (fail instanceof Function) fail();
		  });

		
		return pub;
	};
})(jQuery);
