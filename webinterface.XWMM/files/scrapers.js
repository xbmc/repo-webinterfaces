
var scraperList = [
    ['imdb.xml', 'en', 'imdb.png', 'movies'],
    ['tvdb.xml', 'multi', 'tvdb.png', 'tvshows'],
	['adultcdmovies.xml', 'en', 'adultcdmovies.jpg', 'movies'],
	['amazonuk.xml', 'en', 'amazonuk.png', 'movies'],
	['amazonus.xml', 'men', 'amazonus.png', 'movies'],
	['asiandb.xml', 'en', 'asiandb.gif', 'movies'],
	['cinefacts.xml', 'de', 'cinefacts.png', 'movies'],
	['culturalia.xml', 'es', 'culturalia.gif', 'movies'],
	['daum.xml', 'ko', 'daum.png', 'movies'],
	['Excalibur.xml', 'en', 'excalibur.jpg', 'movies'],	
	['fdbpl.xml', 'pl', 'fdbpl.png', 'movies'],
	['filmaffinity.xml', 'es', 'filmaffinity.gif', 'movies'],
	['filmdelta.xml', 'sv', 'filmdelta.png', 'movies'],
	['imdb tv.xml', 'en', 'imdb.png', 'tvshows'],
	['KinoPoisk.xml', 'ru', 'KinoPoisk.gif', 'movies'],
	['mymoviesdk.xml', 'multi', 'mymoviesdk.png', 'movies'],
	['getlib.xml', 'zh', 'getlib.gif', 'movies'],
	['tvcom.xml', 'en', 'tvcom.png', 'tvshows'],
    ['cine-passion.xml', 'fr', 'cine-passion.png', 'movies']
];

var combo = new Ext.form.ComboBox({
	triggerAction: 'all',
	mode: 'local',
	forceSelection: true,
	value: 'None',
	fieldLabel:"This directory contains",
	store:['None', 'movies', 'tvshows'],
	listeners: {
		'select': function (record){ScraperGrid.store.filter('content',record.value);}
	}
});

function scraperRecord() {
	this.xbmcContent ="";
	this.xbmcScraper = "";
	this.setEmpty = setEmpty;
	this.setValue = setValue;
}

function setValue(node) {
	this.xbmcContent = node.xbmcContent;
	this.xbmcScraper = node.xbmcScraper;
};
	
function setEmpty() {
	this.xbmcContent ="None";
	this.xbmcScraper = "";
}
	
function inheritContent(node) {
	var myXbmcContent = new scraperRecord();
	if (node.attributes.xbmcContent == "") {
		if (node.parentNode.isRoot) 
			{ myXbmcContent.setEmpty()}
		else 
			{ myXbmcContent.setValue(inheritContent(node.parentNode))}
	}
	else {
		myXbmcContent.setValue(node.attributes)
	}
	return myXbmcContent;
}

var ScraperGrid = new Ext.grid.GridPanel({
	height: 500,
    store: new Ext.data.SimpleStore({
        fields: ['scraper', 'language','image', 'content'],
        data: scraperList,
		autoLoad: true
    }),
	sm: new Ext.grid.RowSelectionModel({
		singleSelect: true,
		listeners: {
			rowselect: function(sm, rowIdx, r) {
				scraperImage.updateSrc(r);
			}
		}
	}),
	// listeners: {
		// selectionchange: function(sm, rowIdx, r) {
				// scraperImage.updateSrc(r);
			// //movieGenreChange(sm);
			// //var bt = Ext.getCmp('savebutton');
			// //bt.enable();
			// }
	// },
	viewConfig: {forceFit: true},
    columns: [
        {header: 'Scraper', dataIndex: 'scraper', width: 80},
        {header: 'lang', dataIndex: 'language', width:20}
    ]
});

var scraperImage = new Ext.Container ({
	id: 'scraperimage',
	cls: 'center-align',
	border: 0,
	width: 200,
	//height:150,
	autoEl: {tag: 'img', src: "../images/noscraper.png"},
	clearSrc: function(){
		this.el.dom.src = "../images/noscraper.png"
	},
	updateSrc :function(r){
		this.el.dom.src = "../images/scrapers/"+r.data.image;
	}
	
});

var ScraperSettings = new Ext.FormPanel({
	region: 'center',
	frame:true,
	layout: 'form',
	height:400,
	//width: 400,
	//title: "<div align='center'>Select Nico</div>",
	items: [{
		layout: 'column',
		defaults: {	border: true, frame: true},
		items:[{
			columnWidth:0.5,
			//layout: 'form',
			xtype: 'panel',
			title: 'XBMC scraper settings',
			items:[{
                xtype:"checkbox",
                fieldLabel:"Label",
                boxLabel:"Scan Recursivly",
                name:"scanRecursive"
			},{
			    xtype:"checkbox",
                fieldLabel:"Label",
                boxLabel:"Use Folder Names",
                name:"useFolderNames"
			},{
			    xtype:"checkbox",
                fieldLabel:"Label",
                boxLabel:"No Updates",
                name:"noUpdate"
            }]
		},{ 
			columnWidth:0.5,
			//layout: 'form',
			//xtype: 'form',
			title: 'Scraper specific settings',
			items:[{
                xtype:"textfield",
                fieldLabel:"Text",
                name:"textvalue"
            }]
		}]
		
	}]
})

var scraperDetailPanel = new Ext.FormPanel({
	region: 'north',
	frame:true,
	height:400,
	width: 400,
	title: "<div align='center'>Scraper Info</div>",
		items: [{
		layout: 'column',
		items:[{
			columnWidth:0.60,
			layout: 'form',
			bodyStyle: 'padding:5px 10px 0',
			labelWidth: 100,
			defaults: {	xtype:'textfield', labelWidth: 100,
				listeners:{'change' : function(){DetailsFlag = true; Ext.getCmp('savebutton').enable()}}
			},
			items: [combo, scraperImage]
		},{ 
			columnWidth:0.40,
			layout: 'fit',
			height: 200,
			bodyStyle: 'padding:5px 10px 0',
			items: [ScraperGrid]
		}]
	}]
})
