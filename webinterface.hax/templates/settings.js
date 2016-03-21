/*global JsonML */

/* namespace template */
var template;
if ("undefined" === typeof template) {
	template = {};
}

template.settings = JsonML.BST(
[
	"div",
	{
		"class": "settings"
	},
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
				function() {
	return this.data.label;
},
				[
					"input",
					{
						list: 
							function() {
	return this.data.list;
},
						type: 
							function() {
	return this.data.type;
},
						value: 
							function() {
	return this.data.value || this.data.label;
},
						name: 
							function() {
	return this.data.name || this.data.label;
}
					}
				]
			],
			" "
		]).dataBind(this.data.items, this.index, this.count);
			},
		" "
	],
	" "
]);