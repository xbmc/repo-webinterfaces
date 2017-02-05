/**
 * @author sam.bailus@gmail.com
 */

/* HASH FUNCTIONS */
(function (window, document) {
	"use strict";
	window.getHash = function(name) {
		var y, z, hasharray;
		if (!document.location.hash) { return false; }
		hasharray = document.location.hash.substring(1).split(/\&/);
		for (y = 0; y < hasharray.length; y++) {  //for (y in hasharray) {
			z = hasharray[y].split(/\=/);
			if (z[0] === name) return decodeURIComponent(z[1]);
		}
	}

	window.setHash = function(name, value) {
		var hasharray, y, z;
		if (getHash(name)) {
			hasharray = document.location.hash.substring(1).split(/\&/);
			for (y = 0; y < hasharray.length; y++) {  //for (y in hasharray) {
				z = hasharray[y].split(/\=/);
				if ((z[0] === name) && !(value === '')) {
					z[1] = encodeURIComponent(value);
					hasharray[y] = z.join('=');
				}
			}
			document.location.hash = '#' + hasharray.join('&');
		} else {
			document.location.hash = document.location.hash ? document.location.hash + '&' : '#';
			document.location.hash += name + '=' + value;
		}
	}
})(window,document);
