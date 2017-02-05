/*global JsonML */

/* namespace template */
var template;
if ("undefined" === typeof template) {
	template = {};
}

template.listdetails = JsonML.BST(
[
	"",
	" ",
	[
		"header",
		" ",
		[
			"a",
			{
				"jbst:visible": 
					function() {
	return !this.data.hideNavigation;
},
				href: "javascript:history.go(-1)",
				"class": "backButton"
			},
			[
				"img",
				{
					src: "img/buttons/icon_back.png",
					height: "32",
					width: "32"
				}
			]
		],
		" ",
		[
			"a",
			{
				"jbst:visible": 
					function() {
	return !this.data.hideNavigation;
},
				href: "#page=Home",
				"class": "homeButton"
			},
			[
				"img",
				{
					src: "img/buttons/icon_home.png",
					height: "32",
					width: "32"
				}
			]
		],
		" ",
		[
			"h1",
			{
				"jbst:visible": 
					function() {
	return !!this.data.title;
}
			},
			" ",
			function() {
	return this.data.title;
},
			" "
		],
		" ",
		[
			"h2",
			{
				"jbst:visible": 
					function() {
	return !!this.data.subtitle;
}
			},
			" ",
			function() {
	return this.data.subtitle;
},
			" "
		],
		"\n"
	],
	" ",
	[
		"img",
		{
			"jbst:visible": 
				function() {
	return !!this.data.banner;
},
			"class": "banner",
			src: 
				function() {
	return this.data.banner;
},
			alt: ""
		}
	],
	"\n",
	[
		"img",
		{
			"jbst:visible": 
				function() {
	return (!!this.data.thumbnail && !this.data.banner);
},
			"class": "headerThumbnail",
			src: 
				function() {
	return this.data.thumbnail;
},
			alt: ""
		}
	],
	" ",
	[
		"span",
		{
			"data-role": "button",
			"jbst:visible": 
				function() {
	return !!this.data.play;
},
			"class": "play",
			onclick: 
				function() {
	return this.data.play;
}
		},
		"\u25B6 Play"
	],
	"\n",
	[
		"span",
		{
			"data-role": "button",
			"jbst:visible": 
				function() {
	return !!this.data.add;
},
			"class": "add",
			onclick: 
				function() {
	return this.data.add;
}
		},
		"+ Add to playlist"
	],
	" ",
	function() {
				return JsonML.BST([
		"",
		" ",
		[
			"h3",
			function() {
	return this.data.id+(this.data.value instanceof Array && this.data.value.length > 1 ? 's' : '');
}
		],
		" ",
		[
			"p",
			function() {
	return (this.data.value instanceof Array ? this.data.value.join(', ') : this.data.value);
}
		],
		"\n"
	]).dataBind((['Year', 'Formed', 'Disbanded', 'Born', 'Died', 'Runtime', 'Genre', 'Mood', 'Style', 'Type', 'Instrument', 'Director', 'Writer', 'Description', 'Plot']).map(function (id) { return { 'id': id, 'value': this.data[id.toLowerCase()] }; }, this).filter(function (x) { return ((x.value instanceof Array && x.value.length && x.value[0] !== '') || (x.value instanceof String && x.value.length) || (typeof x.value === 'number')); }), this.index, this.count);
			},
	" ",
	[
		"h3",
		{
			"jbst:visible": 
				function() {
	return !!this.data.recentlyadded;
}
		},
		"Recently Added"
	],
	"\n",
	[
		"ul",
		{
			"jbst:visible": 
				function() {
	return !!this.data.recentlyadded;
},
			"class": "recentlyadded"
		},
		" ",
		function() {
				return JsonML.BST(template.recentlyaddeditem).dataBind(this.data.recentlyadded, this.index, this.count);
			},
		"\n"
	],
	"\n"
]);
