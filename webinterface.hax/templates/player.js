/*global JsonML */

/* namespace template */
var template;
if ("undefined" === typeof template) {
	template = {};
}

template.player = JsonML.BST(
[
	"",
	"\n",
	[
		"div",
		{
			"class": "show"
		}
	],
	"\n",
	[
		"div",
		{
			"class": "player"
		},
		" ",
		""/* <progress max="1000"></progress> */,
		" ",
		[
			"div",
			{
				id: "progress"
			},
			" ",
			[
				"div",
				{
					"class": "bar"
				}
			],
			" ",
			[
				"div",
				{
					"class": "status"
				}
			],
			" ",
			[
				"div",
				{
					"class": "time"
				}
			],
			" "
		],
		" ",
		function() {
				return JsonML.BST(template.buttons).dataBind(this.data, this.index, this.count);
			},
		"\n"
	]
]);