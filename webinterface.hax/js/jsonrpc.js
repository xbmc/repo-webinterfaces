/*
JSON-RPC v2.0 javascript client.
Supports websocket and ajax (http) transports.

author: Samuel Bailey (sam@bailey.geek.nz)
licence: To the extent possible under law, Samuel Bailey has waived all copyright and related or neighboring rights to this work. This work is published from: New Zealand.

usage:
	var server = JSONRPC( 'ws://localhost:9090/jsonrpc' );
	server.sendMessage('JSONRPC.Introspect', function (data) {
		console.log('JSONRPC Introspect: ', data);
	});
	server.onNotification('Player.OnPlay', function (data) {
		console.log('Playing', data);
	});
	
methods:
	sendMessage( method[, data], function (data) {  } );
		Returns true if the message was sent immediately, false if it was buffered.
	
	sendNotification( method[, data] );
		Returns true if the notification was sent immediately, false if it was buffered.

events: (websocket only)
	onNotification( method, function (data) {  } );
		Runs the function when a notification with a matching method is received.
	
	onConnect( function () {  } );
		Runs the function when the websocket is ready.
	
	onDisconnect( function () {  } );
		Runs the function when the websocket disconnects.
	
*/
var JSONRPC = (function (window, undefined) {
	"use strict";
	
	var DEBUG = false,
	WEBSOCKET_TIMEOUT = 3000, //3 seconds
	MAX_SOCKET_CONNECTION_ATTEMPTS = 3,
	notifications = {},
	onopen = [],
	onclose = [],
	address,
	transport,
	
	parseURL = function (url, func) {

		var temp = document.createElement('a');
		temp.href = url;
		if (func instanceof Function) func.apply(temp);

		return temp.href;
	},
	
	connect = function (url) {

		address = parseURL(url, function () {
			if ((this.protocol === 'ws:') || (this.protocol === 'wss:')) transport = 'websocket';
			if ((this.protocol === 'http:') || (this.protocol === 'https:')) transport = 'ajax';
		});

		if (transport) return $.extend({
			'transport': transport,
			'address': address,
			'connect': connect,
			'onNotification': function (method, callback) {
				if (!notifications[method]) notifications[method] = [];
				notifications[method].push(callback);
			},
			'onConnect': function (callback) {
				if (callback instanceof Function) onopen.push(callback);
			},
			'onDisconnect': function (callback) {
				if (callback instanceof Function) onclose.push(callback);
			},
			'notifications': function (n) {
				if (n) notifications = n; return notifications;
			}
		}, JSONRPC[transport](address));
	}

	JSONRPC = function (url, debug) {
		if (debug && window.console) DEBUG = true;
		if (url) return connect(url);
	};

	JSONRPC.ajax = function (url) {

		var send = function (message) {

			$.ajax({
				'type': 'POST',
				'dataType': 'json',
				'contentType': 'application/json',
				'url': url,
				'data': JSON.stringify(message.data),
				'success': message.success,
				'error': message.error
			});

			return true;
		};

		var sendMessage = function (method, params, success, fail) {

			if (params instanceof Function) { fail = success; success = params; params = {} } //shuffle variables

			if (DEBUG) console.log('JSONRPC.ajax: MESSAGE SENT: '+method, params);

			return send({
				'data': {
					'jsonrpc': '2.0',
					'method': method,
					'params': params || {},
					'id': +(new Date)
				},
				'success': function (data) {
					if (DEBUG) console.log('JSONRPC.ajax: MESSAGE RECEIVED: '+method, data);
					if (success instanceof Function) success(data);
				},
				'error': function (data) {
					if (DEBUG) console.log('JSONRPC.ajax: MESSAGE ERROR: '+method, data);
					if (fail instanceof Function) fail(data);
				}
			});

		};

		var sendNotification = function (method, params) {

			if (DEBUG) console.log('JSONRPC.ajax: NOTIFICATION SENT: '+method, params);

			return send({
				'data': {
					'jsonrpc': '2.0',
					'method': method,
					'params': params || {}
				}
			});

		};

		return {
			'sendMessage': sendMessage,
			'sendNotification': sendNotification
		};
	};

	JSONRPC.websocket = function (url) {
		var socket = {},
			messages = {},
			buffer = [],
			socketConnectionAttempts = 0;

		var socketReady = function () {
			return socket.readyState === 1;
		};

		var send = function (message) {
			var id = message.data.id;
			if (socketReady()) {

				if (id && (message.success instanceof Function)) {
					message.timeout = window.setTimeout(function () {

						if (DEBUG) console.log('JSONRPC.websocket: MESSAGE TIMEOUT: RE-SENDING: '+message.data.method, message);

						if (messages[id]) {
							delete messages[id];
							send(message);
							//socket.send(JSON.stringify(message.data));
						}

					}, WEBSOCKET_TIMEOUT);
					messages[id] = message; //if its a message, save it in the message callback buffer
				}

				socket.send(JSON.stringify(message.data));
				return true;

			} else {
				buffer.push(message);
				return false;
			}
		};

		var sendNext = function () {
		  	if (buffer.length) send(buffer.shift());
		};

		var sendMessage = function (method, params, success, fail) {

			if (params instanceof Function) { success = params; params = {} } //shuffle variables

			if (DEBUG) console.log('JSONRPC.websocket: MESSAGE SENT: '+method, params);

			return send({
				'data': {
					'jsonrpc': '2.0',
					'method': method,
					'params': params || {},
					'id': +(new Date)
				},
				'success': success
			});
		};

		var sendNotification = function (method, params) {

			if (DEBUG) console.log('JSONRPC.websocket: NOTIFICATION SENT: '+method, params);

			return send({
				'data': {
					'jsonrpc': '2.0',
					'method': method,
					'params': params || {}
				}
			});
		};

		var connectSocket = function () {
			socket = new WebSocket(url);
			socket.q = {};
			socket.onmessage = function (message) {
				var data = JSON.parse(message.data), m;
			
				if (data.id) { //json-rpc message
					if (messages[data.id]) {
						m = messages[data.id];
						if (DEBUG) console.log('JSONRPC.websocket: MESSAGE RECEIVED: '+m.data.method, data);
						if (m.success instanceof Function) m.success(data);
						window.clearTimeout(m.timeout);
						delete messages[data.id];
					};
				}
				else { //json-rpc notification
					if (DEBUG) console.log('JSONRPC.websocket: NOTIFICATION RECEIVED: '+data.method, data);
					if (notifications[data.method]) {
						$.each(notifications[data.method], function (i, o) { if (o instanceof Function) o(data.params); });
					};
				}
				sendNext();
			};
			socket.onclose = function (close) {
				if (DEBUG) console.log('JSONRPC.websocket: DISCONNECTED');
				if (socketConnectionAttempts < MAX_SOCKET_CONNECTION_ATTEMPTS) { //reconnect socket
					window.setTimeout(function () {
						if (socket.readyState === 3) connectSocket();
					}, 1000); //retry after 1 second
				}
				else $.each(onclose, function (i, o) { if (o instanceof Function) o(); }); //too many connection attempts
			};
			socket.onopen = function () {
				if (DEBUG) console.log('JSONRPC.websocket: CONNECTED');
				socketConnectionAttempts = 0;
				sendNext(); //re-start the buffer when the socket reconnects
				$.each(onopen, function (i, o) { if (o instanceof Function) o(); });
			};
		};

		if (!('WebSocket' in window)) return;

		connectSocket();

		return {
			'sendMessage': sendMessage,
			'sendNotification': sendNotification
		};
	};
	
	return JSONRPC;

})(window);
