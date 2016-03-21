/*global JsonML */

/* namespace template */
var template;
if ("undefined" === typeof template) {
	template = {};
}

template.details = JsonML.BST(
[
	"",
	" ",
	[
		"div",
		{
			"class": "details"
		},
		" ",
		[
			"a",
			{
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
			"img",
			{
				"jbst:visible": 
					function() {
	return !!this.data.thumbnail;
},
				src: 
					function() {
	return this.data.thumbnail;
},
				alt: "",
				"class": "image"
			}
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
			function() {
	return this.data.title;
}
		],
		" ",
		[
			"h2",
			{
				"jbst:visible": 
					function() {
	return !!this.data.heading;
}
			},
			function() {
	return this.data.heading;
}
		],
		" ",
		[
			"div",
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
			" "
		],
		" ",
		[
			"h3",
			{
				"jbst:visible": 
					function() {
	return !!this.data.runtime;
}
			},
			"Runtime"
		],
		" ",
		[
			"p",
			{
				"jbst:visible": 
					function() {
	return !!this.data.runtime;
}
			},
			function() {
	return this.data.runtime + ' minutes';
}
		],
		" ",
		[
			"h3",
			{
				"jbst:visible": 
					function() {
	return !!this.data.director;
}
			},
			function() {
	return 'Director'+(this.data.director instanceof Array && this.data.director.length > 1 ? 's' : '');
}
		],
		" ",
		[
			"p",
			{
				"jbst:visible": 
					function() {
	return !!this.data.director;
}
			},
			function() {
	return (this.data.director instanceof Array ? this.data.director.join(', ') : this.data.director);
}
		],
		" ",
		[
			"h3",
			{
				"jbst:visible": 
					function() {
	return !!this.data.writer;
}
			},
			function() {
	return 'Writer'+(this.data.writer instanceof Array && this.data.writer.length > 1 ? 's' : '');
}
		],
		" ",
		[
			"p",
			{
				"jbst:visible": 
					function() {
	return !!this.data.writer;
}
			},
			function() {
	return (this.data.writer instanceof Array ? this.data.writer.join(', ') : this.data.writer);
}
		],
		" ",
		[
			"h3",
			{
				"jbst:visible": 
					function() {
	return !!this.data.plot;
}
			},
			"Plot"
		],
		" ",
		[
			"p",
			{
				"jbst:visible": 
					function() {
	return !!this.data.plot;
}
			},
			function() {
	return this.data.plot;
}
		],
		" ",
		[
			"h3",
			{
				"jbst:visible": 
					function() {
	return !!this.data.genre;
}
			},
			function() {
	return 'Genre'+(this.data.genre instanceof Array && this.data.genre.length > 1 ? 's' : '');
}
		],
		" ",
		[
			"p",
			{
				"jbst:visible": 
					function() {
	return !!this.data.genre;
}
			},
			function() {
	return (this.data.genre instanceof Array ? this.data.genre.join(', ') : this.data.genre);
}
		],
		" ",
		[
			"div",
			{
				"jbst:visible": 
					function() {
	return !!this.data.fanart;
},
				"class": "fanart"
			},
			[
				"img",
				{
					src: 
						function() {
	return this.data.fanart;
},
					alt: ""
				}
			]
		],
		"\n"
	],
	"\n"
]);
