/*global JsonML */

/* namespace template */
var template;
if ("undefined" === typeof template) {
	template = {};
}

template.listitem = JsonML.BST(
[
	"",
	"\n",
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
		"\u25B6"
	],
	"\n",
	[
		"span",
		{
			"data-role": "button",
			"jbst:visible": 
				function() {
	return !!this.data.remove;
},
			"class": "remove",
			onclick: 
				function() {
	return this.data.remove;
}
		},
		"-"
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
		"+"
	],
	" ",
	function() {
				return JsonML.BST(template.link).dataBind(this.data, this.index, this.count, {
		$: 
			[
				"",
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
						style: 
							function() {
	return this.data.thumbnailWidth ? 'width:'+this.data.thumbnailWidth : '';
}
					}
				],
				" ",
				[
					"div",
					{
						"jbst:visible": 
							function() {
	return !!this.data.number;
},
						"class": "number"
					},
					function() {
	return this.data.number;
},
					"."
				],
				" ",
				[
					"div",
					{
						"class": 
							function() {
	return this.data.details ? 'line1' : 'label';
}
					},
					function() {
	return this.data.label;
}
				],
				" ",
				[
					"div",
					{
						"class": "line2",
						"jbst:visible": 
							function() {
	return !!this.data.details;
}
					},
					" ",
					function() {
				return JsonML.BST([
						"",
						" ",
						[
							"span",
							function() {
	return this.data;
}
						],
						" "
					]).dataBind(this.data.details, this.index, this.count);
			},
					" "
				],
				"\n"
			]
	});
			}
]);