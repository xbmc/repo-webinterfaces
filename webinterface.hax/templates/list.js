/*global JsonML */

/* namespace template */
var template;
if ("undefined" === typeof template) {
	template = {};
}

template.list = JsonML.BST(
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
	return !this.data.banner;
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
			"h1",
			{
				"jbst:visible": 
					function() {
	return !!this.data.banner;
}
			},
			" ",
			[
				"img",
				{
					src: 
						function() {
	return this.data.banner;
},
					alt: 
						function() {
	return this.data.title;
},
					title: 
						function() {
	return this.data.title;
}
				}
			],
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
	return !!this.data.thumbnail;
},
			"class": "thumbnail",
			src: 
				function() {
	return this.data.thumbnail;
},
			alt: ""
		}
	],
	" ",
	[
		"p",
		{
			"class": "button"
		},
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
		" ",
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
		"\n"
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
	]).dataBind((['Year', 'Formed', 'Disbanded', 'Born', 'Died', 'Runtime', 'Genre', 'Mood', 'Style', 'Type', 'Instrument', 'Director', 'Writer', 'Description', 'Plot']).map(function (id) { return { 'id': id, 'value': this.data[id.toLowerCase()] }; }, this).filter(function (x) { return ((x.value instanceof Array && x.value.length && x.value[0] !== '') || (typeof x.value === 'string' && x.value.length) || (typeof x.value === 'number')); }), this.index, this.count);
			},
	" ",
	[
		"ul",
		{
			"jbst:visible": 
				function() {
	return !!this.data.items;
},
			"class": 
				function() {
	return ('list'+(this.data.collapsed ? ' collapsed' : ''));
},
			"data-groupby": 
				function() {
	return this.data.groupby;
}
		},
		" ",
		function() {
				return JsonML.BST([
			"",
			" ",
			[
				"li",
				{
					"jbst:visible": 
						function() {
	return this.data.items instanceof Array;
},
					"class": "superListItem"
				},
				" ",
				[
					"h3",
					function() {
	return this.data.label;
}
				],
				" ",
				[
					"ul",
					" ",
					function() {
				return JsonML.BST([
						"",
						" ",
						[
							"li",
							{
								"class": "listItem"
							},
							" ",
							function() {
				return JsonML.BST(template.listitem).dataBind(this.data, this.index, this.count);
			},
							" "
						],
						" "
					]).dataBind(this.data.items, this.index, this.count);
			},
					" "
				],
				" "
			],
			" ",
			[
				"li",
				{
					"class": "listItem",
					"jbst:visible": 
						function() {
	return !(this.data.items instanceof Array);
}
				},
				" ",
				function() {
				return JsonML.BST(template.listitem).dataBind(this.data.items instanceof Array ? undefined : this.data, this.index, this.count);
			},
				" "
			],
			" "
		]).dataBind(this.data.items, this.index, this.count);
			},
		"\n"
	],
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
	" ",
	[
		"img",
		{
			"jbst:visible": 
				function() {
	return !!this.data.fanart;
},
			"class": "fanart",
			src: 
				function() {
	return this.data.fanart;
},
			alt: ""
		}
	]
]);
