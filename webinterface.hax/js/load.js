jQuery(function () { //on document load
	var body = $('body');

	var html = {
		'app': function () {
			body.empty();
			body.append('<div id=loading><span><img alt="Loading" src="img/loading.gif"></span></div>');
			//body.append('<div id=header></div>');
			body.append('<div id=content></div>');
			body.append('<div id=player></div>');
		},
		'connect': function () {
			var div;
			div = $('<div id="connect"></div>').appendTo(body);
			$('<div>Enter the address of your xbmc server</div>').appendTo(div);
			$('<form></form>').
			  append('<input id="address">').
			  append('<input type="submit">').
			  submit(function () {
				connect( $('#address').val() );
				return false;
			  }).
			  appendTo(div);
		} 
	};

	var supports_html5_storage = function () { //stolen from http://diveintohtml5.info/storage.html
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	};
	
	var getAddresses = function () {
		if (supports_html5_storage && localStorage['addresses']) {
			return localStorage['addresses'].split(',');
		}
		return [];
	}
	var storeAddress = function (a) {
		if (supports_html5_storage) {
			if (localStorage['addresses']) {
				array = getAddresses();
				if (array.length > 3) array = array.slice(0,3);
				array.unshift(a);
				localStorage['addresses'] = array.join(',');
				//localStorage['addresses'] = a + ',' + localStorage['addresses'];
			}
			else localStorage['addresses'] = a;
		}
		return a;
	};
	
	var submit = function () {
		var a = santizeAddress($('#address').val());
		connect(a);
		return false;
	};
	
	var connect = function (address) {
		window.xbmc = xbmcFactory(address,
		  function () { //connected
			html.app();
			xbmcPlayer = xbmcPlayerFactory();
			xbmcLibrary = xbmcLibraryFactory();
			storeAddress(address);
		  },
		  function () { //failed to connect
			render();
		  });
	};
	
	var renderList = function (array) {
		var list = $('<div class="addressList"></div>').appendTo(body);
		$.each(array, function (i, address) {
			$('<a href="#"></a>').
			  text(address).
			  click(function () { 
				connect( address );
				return false;
			  }).
			  appendTo(list);
		});
	};
	
	var render = function () {
		body.empty();
		html.connect();
		if (supports_html5_storage) {
			renderList(getAddresses());
		}
	};
	connect(); //try to connect to localhost first
});
