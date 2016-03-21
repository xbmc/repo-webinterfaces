/*
Q: executes asynchronous functions using a queue

author: Samuel Bailey (sam@bailey.geek.nz)
licence: To the extent possible under law, Samuel Bailey has waived all copyright and related or neighboring rights to this work. This work is published from: New Zealand.

NOTE: functions must take a single callback parameter that gets run when the function is finished.
eg:
	function (callback) {
		callback();
	}
or:
	function (callback) {
		$.ajax('ajax/test.html').
		  done(function (d) { $.extend(data,d); }).  
		  always(function () { callback(); });
	}
	
functions can return an options object
eg:
	function (callback) {
		callback();
		return {
			'timeout': 1000, //run the next function in the queue (or finish) after this many milliseconds
			'ontimeout': function (c) { //optional
				console.log('timeout');
				c(); //run the next function in the queue
			}
		};
	};
	

	
usage:
	var myQ = Q();		//the Q function returns a new Q object
	myQ.add(function);	//functions and arrays of functions can be passed to the new Q object
	myQ.add([function, function]);
	myQ.start(); 		//start the queue
	
	myQ.stop();		//stop the queue

usage:
	var myQ = Q([		//functions and arrays of functions can be passed directly to the constructor function
		function,
		function
	]).start(); 		//start the queue
	
	myQ.stop();		//stop the queue
	
usage:
	Q(function).
	  add([function, function]).
	  start();
	
usage:
	myQ = Q();
	myQ(function);
	myQ([function, function]);
	myQ(); 			//start the queue
	
usage:
	myQ = Q();
	myQ({ 'add': function });
	myQ({ 'add': [function, function] });
	myQ({
		'onfinish': function,
		'start': 0
	});
	
*/
jQuery(function () {
	"use strict";
	
	window.Q = function (x) {
		var queue = [], next = 0, stop = false, onstop = false, onfinish = false, onstop = false, timer = undefined,
		add = function (f) { //PRIVATE: adds a single function to the queue
			var queueLength = queue.push(function () {
				var callback, options;
				if (timer !== undefined) { //clear the timer
					clearTimeout(timer);
					timer = undefined;
				}
				next = queueLength;
				if (stop) {
					if (onstop) onstop();
					return;
				}
				
				callback = queue[next] || onfinish || function () {};
				options = f(callback) || {}; //run the function
				if (options.timeout) timer = window.setTimeout( //set the timer
					options.ontimeout instanceof Function ?
					function () { options.ontimeout(callback); } :
					callback,
					options.timeout
				);
			});
		},
		q = function (f) { //PUBLIC: decorator
			if (f instanceof Array || f instanceof Function) return q.add(f);
			if (f === undefined) return q.start();
			return q;
		};
		q.add = function (f) { //PUBLIC: adds a new function or list of functions to the queue
			var isFunction = f instanceof Function,
			  isArray = f instanceof Array,
			  isObject = f instanceof Object;
			  
			if (isFunction) add(f);
			if (isArray) $.each(f, function (i, g) {
				add(g);
			});
			if (isObject && !isFunction && !isArray) $.each(q, function (i) {
				if (f[i]) q[i](f[i]);
			});
			return q;
		};
		q.stop = function () { //PUBLIC: stops the queue
			stop = true;
			return q;
		};
		q.start = function (x) { //PUBLIC: starts the queue
			if (!x) x = 0;
			if (queue[x] instanceof Function ) queue[x](); //run the first function in the queue
			return q;
		};
		q.onfinish = function (f) { //PUBLIC: runs the given function after the last item in the queue has run
			if (f instanceof Function) onfinish = f;
			return q;
		};
		q.onstop = function (f) { //PUBLIC: runs the given function when the queue is stopped using the .stop() method
			if (f instanceof Function) onstop = f;
			return q;
		};
		
		//if something is passed to the constructor, pass it to the decorator function
		if (x) q(x);
		
		return q;
	}

});
