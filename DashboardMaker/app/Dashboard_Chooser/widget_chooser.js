/*
OWF.Launcher.launch({
	guid: widget.guid;
	launchOnlyIfClosed: true,
	//title: 'Channel Listener Launched',
	data: '[{"widget_name":"MITRE.CIV","dataURI":"http://a2c2srv.mitre.org:8080/cra/impl/WorldPopDataFeedAdaptor/CraInstanceServlet?requestType=getLatestDataItem","visualizationProperties":{"visualizationId":"d3.scatterPlot","visualizationMappings":[{"elementName":"Label","fieldName":"name"},{"elementName":"Mark X Position","fieldName":"population"},{"elementName":"Mark Y Position","fieldName":"lifeExpectancy"}]',
});
*/



color_image_sources = ["resources/images/map.png","resources/images/table.png","resources/images/tree.png","resources/images/directions.png"];
grey_image_sources = ["resources/images/map_grey.png","resources/images/table_grey.png","resources/images/tree_grey.png","resources/images/directions_grey.png"];
graph_image = "resources/images/graph.png";
graph_grey_image = "resources/images/graph_grey.png";
stock_image = "resources/images/stock.png";
stock_grey_image = "resources/images/stock_grey.png";

function widgetData(id, colorImg, greyImg, color_child_images, grey_child_images, universalNames, index, childData){
    this.id = id;
    this.colorImg = colorImg;
    this.greyImg = greyImg;
    this.color_child_images = color_child_images;
    this.grey_child_images = grey_child_images;
    this.universalNames = universalNames;
    this.index = index;
    this.childData = childData;
}

graphData = {
    "widget_name":"MITRE.CIV", 
    //"dataURI": "http://a2c2srv.mitre.org:8080/SeamlessC2/rawGraphData.json",			
    "dataURI": LOCAL_8080_URL+"DashboardMaker/data/rawGraphData.json",
    "visualizationProperties": {
        "visualizationId": "nvd3.barGraph",
        "visualizationMappings": [ 
        {
            elementName: "Label", 
            fieldName: "name"
        },

        {
            elementName: "Bar Series", 
            fieldName: "upTime"
        }
        ]
    }
};

//mapWidget = new widgetData("mapWidget", color_image_sources[0], grey_image_sources[0], [color_image_sources[3], color_image_sources[0]], [grey_image_sources[3], grey_image_sources[0]], ["jc2cui.map", "jc2cui.map"], 0, [{"mapURI": "https://a2c2srv.mitre.org:8443/datacreator/MapDataCombined.xml"},{"mapURI": "https://a2c2srv.mitre.org:8443/datacreator/MapDataCombined.xml"}]);

mapWidget = new widgetData("mapWidget", color_image_sources[0], grey_image_sources[0], [color_image_sources[3], color_image_sources[0]], [grey_image_sources[3], grey_image_sources[0]], ["jc2cui.map", "jc2cui.map"], 0, 
    [{
        "mapURI": LOCAL_8443_URL+"DataCreator/MapDataCombined.xml"
    },

    {
        "mapURI": LOCAL_8443_URL+"DataCreator/MapDataCombined.xml"
    }]);
tableWidget = new widgetData("tableWidget", color_image_sources[1], grey_image_sources[1], [color_image_sources[1]], [grey_image_sources[1]], ["org.owfgoss.owf.examples.NYSE"], 1, []);
treeWidget = new widgetData("treeWidget", color_image_sources[2], grey_image_sources[2], [color_image_sources[2]], [grey_image_sources[2]], ["org.owfgoss.owf.examples.NYSE"], 2, []);
graphWidget = new widgetData("graphWidget", stock_image, stock_grey_image, [stock_image], [stock_grey_image], ["MITRE.CIV"], 3, [graphData]);
stockWidget = new widgetData("stockWidget", stock_image, stock_grey_image, [stock_image], [stock_grey_image], ["org.owfgoss.owf.examples.StockChart"], 4, []);

log(mapWidget);

var defaultArray = [graphWidget, tableWidget];
var mapArray = [mapWidget, tableWidget];

/*
var widget0 = new widgetData("widget0", color_image_sources[0], grey_image_sources[0], color_image_sources, grey_image_sources, 0);
var widget1 = new widgetData("widget1", color_image_sources[1], grey_image_sources[1], color_image_sources, grey_image_sources, 1);
var widget2 = new widgetData("widget2", color_image_sources[2], grey_image_sources[2], color_image_sources, grey_image_sources, 2);

var widgetArray1 = [widget0, widget1, widget2];

var widget3 = new widgetData("widget3", color_image_sources[0], grey_image_sources[0], color_image_sources, grey_image_sources, 0);
var widget4 = new widgetData("widget4", color_image_sources[1], grey_image_sources[1], color_image_sources, grey_image_sources, 1);
var widget5 = new widgetData("widget5", color_image_sources[2], grey_image_sources[2], color_image_sources, grey_image_sources, 2);

var widgetArray2 = [widget3, widget4, widget5];

var widget6 = new widgetData("widget6", color_image_sources[0], grey_image_sources[0], color_image_sources, grey_image_sources, 0);
var widget7 = new widgetData("widget7", color_image_sources[1], grey_image_sources[1], color_image_sources, grey_image_sources, 1);
var widget8 = new widgetData("widget8", color_image_sources[2], grey_image_sources[2], color_image_sources, grey_image_sources, 2);

var widgetArray3 = [widget6, widget7, widget8];

var widgeta = new widgetData("widgeta", color_image_sources[1], grey_image_sources[1], color_image_sources, grey_image_sources, 0);
var widgetb = new widgetData("widgetb", color_image_sources[2], grey_image_sources[2], color_image_sources, grey_image_sources, 1);
var widgetc = new widgetData("widgetc", color_image_sources[0], grey_image_sources[0], color_image_sources, grey_image_sources, 2);

var widgetArray4 = [widgeta, widgetb, widgetc];
*/


Ext.define('changingIcon', {
    extend: 'Ext.Img',
    unselect: function () {
        //log("Unselecting...", this.children); 
        this.displaying_children = false;
        this.setSrc(this.greySrc);
        for(i in this.children){
            //child = Ext.getCmp(this.id+"-"+i);
            child = this.children[i];
            child.hide();
            child.unselect();
        }
    },
    activeChild: function () {
        for(i in this.children){
            child = this.children[i];
            if (child.active){
                return child;
            }
        }
    }
});

Ext.define('changingChild', {
    extend: 'Ext.Img',
    unselect: function () {
        if(this.active){
            this.active = false;
            this.setSrc(this.greySrc);
            if(numberOfSources != selectedSources){
                var b = document.getElementById("confirm_button_html");
                log("NO LONGER READY! DISABLING :( ", b);
               // b.disabled = "disabled";
            }
            selectedSources--;
            log("Going DOWN", selectedSources);

        }
    },
    select: function () {
        this.active = true;
        this.setSrc(this.colorSrc);
        selectedSources++;
        log("Going UP", selectedSources);

        if(numberOfSources == selectedSources){
            var b = document.getElementById("confirm_button_html");
            log("READY! ENABLING: ", b);
           // b.disabled = false;
        }
    	
        window["widgetSelected"+this.sourceNumber] = {
            "name":this.universalName, 
            "data":this.data
            };
        log("widgetSelected"+this.sourceNumber, " set to: ", window["widgetSelected"+this.sourceNumber]);
    	
    }
});

/*
var test_array = ["zero", "one", "two"];

for (i in test_array){
	log(arrayMinusIndex(test_array, i));
}
*/

function arrayMinusIndex(array, i){
    if (i == array.length - 1) {
        return array.slice(0, i) //skip "after", because you can't do array.slice(0, -0)
    }
    before = array.slice(0,i);
    //for some reason, I can't just use the positive index (i+1) here
    //it returns an empty array if i is not 0 or the max index. (!?)
    after = array.slice(i - array.length + 1); 
    return before.concat(after);

//return array.slice(0, i).concat(array.slice(i+1)); //this only worked for the first/last i
}

function putItemInPanel(item){
    return Ext.create('changingChild', {
        layout: "fit",
        items: [item]
    });
}

function generateChildIcon(id, sourceNumber, anchorPanel, anchorRule, colorImg, greyImg, universalName, data){
    var returnImg = Ext.create('changingChild', {
        id: id,
    	    
        floating: true,
    		
        src: greyImg,
        greySrc: greyImg,
        colorSrc: colorImg,
        sourceNumber: sourceNumber,
        universalName: universalName,
        data: data,
    	
        active: false,
    	
        border: false, 
        shadow: false,
		
        anchorPanel: anchorPanel,
        anchorRule: anchorRule,
		
        listeners: {	
            'afterrender': function(){
                this.alignTo(anchorPanel, anchorRule);
            },	
            el: {
                click: function(eventObject, element) {
                    var parent = Ext.getCmp(id); //this seems silly
                    if(!parent.active){
                        //parent.setSrc(parent.colorSrc);
                        //parent.active = true;
                        parent.select();
                        //tell siblings to deactivate, maybe as part of custom setActive method
                        for(i in parent.siblings){
                            parent.siblings[i].unselect();
                        }
                    }
                    else{
                        //parent.setSrc(parent.greySrc);
                        //parent.active = false;
                        parent.unselect();
                    }
                },
                mouseenter: function(eventObject, element){
                    var parent = Ext.getCmp(id); 
                    if(!parent.active){
                        parent.setSrc(parent.colorSrc); 
                    }
				
                },
                mouseleave: function(eventObject, element){
                    var parent = Ext.getCmp(id); 
                    if(!parent.active){
                        parent.setSrc(parent.greySrc); 
                    }
                }
            }
        }
    });
    return returnImg;
};


//function generateChangingIcon(id, x, y, colorImg, greyImg, color_child_image_sources, grey_child_image_sources){
function generateChangingWidgetIcon(sourceNumber, indexNumber, widget, main_rule, sub_rule){
    //id = widget.id;
    //colorImg = widget.colorImg;
    //greyImg = widget.greyImg;
    //color_child_images = widget.color_child_images;
    //grey_child_images = widget.grey_child_images;
    log("Generating widgetChoice with id: ", "Widget-"+sourceNumber+"-"+indexNumber);
    var returnImg = Ext.create('changingIcon', {
        id: "Widget-"+sourceNumber+"-"+indexNumber,
        //x: 0,
        //y: 0,
    	
        //flex: 10,
    	
        width: 128,
        height: 128,
    	
        src: widget.greyImg,
        greySrc: widget.greyImg,
        colorSrc: widget.colorImg,
        sourceNumber: sourceNumber,
        indexNumber: indexNumber,
    	
        color_child_images: widget.color_child_images,
        grey_child_images: widget.grey_child_images,
        universalNames: widget.universalNames,
        childData: widget.childData,
        displaying_children: false,
    	
        main_rule: main_rule,
        sub_rule: sub_rule,
    	
        children: [],
    	
        border: false, 
        shadow: false,	

        listeners: {
            'afterrender': function(){
                //if invalid id, complain / strip out
                //this.doLayout();
                /*
				log("this = ", this);
				log("this.x = ", this.x);
				log("getPosition = ", this.getPosition(true));
				log("getPosition = ", this.getPosition(false));
				log("X = ", this.getEl().getXY());
				log("ownerCt = ", this.ownerCt);
				
				this.x = this.getPosition()[0];
				this.y = this.getPosition()[1];
				*/

                this.children = [];
                //deltaX = 0;
				
                for(i in this.color_child_images){
                    //log("generating child with id: ", id+"-"+i);
                    //log("position will be: ", this.x+(70*i)+5, this.y+120);
                    if (i == 0) {
                        //var new_child = generateChildIcon(this.id+"-"+i, this, "tl-bl", this.x+(70*i)+5, this.y+120, this.color_child_images[i], this.grey_child_images[i])
                        var new_child = generateChildIcon(this.id+"-"+i, this.sourceNumber, this, this.main_rule, this.color_child_images[i], this.grey_child_images[i], this.universalNames[i], this.childData[i])
                    }
                    else {
                        //var new_child = generateChildIcon(this.id+"-"+i, this.children[i-1], "l-r", this.x+(70*i)+5, this.y+120, this.color_child_images[i], this.grey_child_images[i])						
                        var new_child = generateChildIcon(this.id+"-"+i, this.sourceNumber, this.children[i-1], this.sub_rule, this.color_child_images[i], this.grey_child_images[i], this.universalNames[i], this.childData[i])												
                    }
                    //var new_child = putItemInPanel(new_child0);
                    //log("new_child0 = ", new_child0);
                    //log("new_child = ", new_child);
                    //this.ownerCt.add(new_child);
                    //new_child.show();
                    //new_child.alignTo(this, "bl-tl");
                    new_child.setSize(64, 64);
                    this.children.push(new_child);
                    //this.ownerCt.add(this.children[i]);
                    this.children[i].hide();				
                }
                for (i in this.children){
                    this.children[i].siblings = arrayMinusIndex(this.children, i);
                }
            //log("Children set to: ", children);
			
            },
			
            'added': function(){
            //log("added has fired");
            //log("this.id = ", this.id);
            //log("uid + widget.id = ", uid + widget.id);

            },
			
            el: {
                click: function(eventObject, element) {
                    //this.testFunc(); //fails
                    //this.test_func(); //also fails
                    //this.testFunction(); //also fails
                    var parent = Ext.getCmp("Widget-"+sourceNumber+"-"+indexNumber); //this seems silly
                    //log(parent);
                    //log("Siblings are: ", parent.siblings);
                    for (i in parent.siblings){
                        //log("i is: ", i);
                        //log("Shutting down: ", parent.siblings[i]);
                        parent.siblings[i].unselect();	
                    } 
                    parent.setSrc(parent.colorSrc); //oh well, it works
                    //parent.testFunc(); //this too
                    if(!parent.displaying_children){
                        parent.displaying_children = true;
                        //log("clicked on icon: ", parent.id);
                        //log("Parent.children are: ", parent.children);
                        for(i in parent.children){
                            //log("Now displaying: ", parent.children[i].id);
                            parent.children[i].show();
                        //Ext.getCmp(parent.id+"-"+i).show();
                        }
                    }
                    else{
                        parent.displaying_children = false;
                        for(i in parent.children){
                            parent.children[i].hide();
                        //Ext.getCmp(parent.id+"-"+i).hide();
                        }
                    }
                },
                mouseenter: function(eventObject, element){
                    //log("Mouse entered: ", element);
                    //log("id is either: ", this.id, ", or ", element.id);
                    var parent = Ext.getCmp("Widget-"+sourceNumber+"-"+indexNumber); 
                    //log("parent = ", parent);
                    if(!parent.displaying_children){
                        parent.setSrc(parent.colorSrc); 
                    }
				
                },
                mouseleave: function(eventObject, element){
                    //log("Mouse left: ", element);
                    var parent = Ext.getCmp("Widget-"+sourceNumber+"-"+indexNumber); 
                    if(!parent.displaying_children){
                        parent.setSrc(parent.greySrc); 
                    }
                }
            }
        }
    });
    //returnImg.testFunction = function () { log("Success!") };
    //log("returnImg's id is: ", returnImg.id);
    return returnImg;
};

/*
test_icon0 = generateChangingIcon("icon0",  50, 50, color_image_sources[0], grey_image_sources[0], color_image_sources, grey_image_sources);
test_icon1 = generateChangingIcon("icon1", 220, 50, color_image_sources[1], grey_image_sources[1], color_image_sources, grey_image_sources);
test_icon2 = generateChangingIcon("icon2", 390, 50, color_image_sources[2], grey_image_sources[2], color_image_sources, grey_image_sources);
test_icon2.setSize(128,128);

test_icons = [test_icon0, test_icon1, test_icon2];
test_icon0.siblings = arrayMinusIndex(test_icons, 0);
test_icon1.siblings = arrayMinusIndex(test_icons, 1);
test_icon2.siblings = arrayMinusIndex(test_icons, 2);

var main_panel = Ext.create('Ext.Panel', {
	layout: 'absolute',
	height: 500,
	items: [test_icon0, test_icon1, test_icon2],
});

*/

function setSiblings(iconArray){
    //log("array is: ", iconArray);
    for (i in iconArray){
        //log("Currently working on item ", i);
        iconArray[i].siblings = arrayMinusIndex(iconArray, i);
    //log("Siblings set to: ", iconArray[i].siblings);
    }
}


function generatePanelWithSizeAndWidgets(sourceNumber, arrangement, alignment, panelWidth, panelHeight, widgetArray, main_rule, sub_rule, suggested_index){
    //	id: "TEMPORARY",
    var widgetPanels = [];
    var iconArray = [];
    //var spacer = {html: "", flex: 1};
    //var vspacer = {html: "", flex: 1};
    var icon;
    for (i in widgetArray){
        icon = generateChangingWidgetIcon(sourceNumber, i, widgetArray[i], main_rule, sub_rule);
        iconArray.push(icon);
        //widgetPanels.push(spacer);
        widgetPanels.push(icon);
		
    }
    //widgetPanels.push(spacer);
    log(widgetPanels);
	
    setSiblings(iconArray);
	
	
    if(suggested_index >= 0) {
        for (var i = 0; i < suggested_index+1; i++){
            var newPanel = Ext.create('Ext.Panel', {
                border: true,
                items: widgetPanels[i]
            });
            widgetPanels.splice(i, 1, newPanel);
        }
    }
	
    /*
	if(suggested_index >= 0) {
		if (arrangement == "hbox") {
			var vspacer = {html: "<HR width=1 size=150/>", border:false};
			widgetPanels.splice(suggested_index+1, 0, vspacer);	
		}
		else {
			var hspacer = {html: "<HR width=150/>", border:false};
			widgetPanels.splice(suggested_index+1, 0, hspacer);			
		}

	}
	*/
	
    //log("Defining widgetPanel with widgetPanels: ", widgetPanels);
    widgetPanel = Ext.create('Ext.Panel', {
        id: "Widget_Panel_"+sourceNumber,
        layout: {
            type: arrangement,
            pack: 'center',
            align: alignment
        //defaultMargins: '0, 10'
        },
        border: false,
        width: panelWidth,
        height: panelHeight,
        items: widgetPanels
    });
	
    var widget_banner = generateBannerPanel("Select Widget "+sourceNumber, "<div id='widget_banner_id'>Select a widget for this data, then a visualization for that widget. Suggested widgets have a blue border.</div>");
    layoutPanel = Ext.create('Ext.Panel', {
        id: "Layout_Panel_"+sourceNumber,
        layout: {
            type: 'vbox',
            align: 'stretch'
        //pack: 'center',

        //defaultMargins: '0, 10'
        },
        width: panelWidth,
        height: panelHeight+100,
        border: false,
        defaults: {
            border: false
        },
        items: [
        {
            html: "", 
            flex: 1
        },
        widget_banner,
        widgetPanel,
        {
            html: "", 
            flex: 1
        },
        ]
    });
	
    /*
	returnPanel = Ext.create('Ext.Panel', {
		layout: 'vbox',
		width: panelWidth,
		height: panelHeight,
		items: //[vspacer, widgetPanel, vspacer]
	});
	*/
    //log("Returning widget panel: ", widgetPanel);
    return layoutPanel;
}


//example_panel1 = generatePanelWithSizeAndWidgets('hbox', 'middle', 555, 300, widgetArray1, "tl-bl", "l-r");
//example_panel2 = generatePanelWithSizeAndWidgets('hbox', 'top', 500, 350, widgetArray3, "t-b", "t-b");
//example_panel3 = generatePanelWithSizeAndWidgets(800, 400, widgetArray, "tl-bl", "l-r");

//example_panel4 = generatePanelWithSizeAndWidgets('vbox', 'middle', 250, 505, widgetArray2, "tl-tr", "t-b");
//example_panel5 = generatePanelWithSizeAndWidgets(200, 300, widgetArray, "tl-tr", "l-r");
//example_panel6 = generatePanelWithSizeAndWidgets(600, 300, widgetArray, "tl-tr", "l-r");
//log("example_panel = ", example_panel);

/*
Ext.define('Ext.ux.Image', {
    extend: 'Ext.Component', // subclass Ext.Component
    alias: 'widget.managedimage', // this component will have an xtype of 'managedimage'
    autoEl: {
        tag: 'img',
        src: this.src || 'http://www.sencha.com/img/20110215-feat-perf.png',
        cls: 'my-managed-image'
    },

    // Add custom processing to the onRender phase.
    // Add a ‘load’ listener to the element.
    onRender: function() {
    	//log("this.initialConfig: ", this.initialConfig);
        this.autoEl = Ext.apply({}, this.initialConfig, this.autoEl);
        this.callParent(arguments);
        this.el.on('load', this.onLoad, this);
    },

    onLoad: function() {
        this.fireEvent('load', this);
    },

    setSrc: function(src) {
    	log("this.rendered: ", this.rendered);
        if (this.rendered) {
            this.el.dom.src = src;
        } else {
            this.src = src;
        }
    },

    getSrc: function(src) {
        return this.el.dom.src || this.src;
    }
});
*/



// change the src of the image programmatically
//changingImage.setSrc('http://www.sencha.com/img/20110215-feat-perf.png');

/*
Ext.define('Widget_Item', {
	extend: 'Ext.container.Container',
	alias: "widget.widget_item",

	layout: "fit",
	
	height: 200,
	width: 200,

	name: "Default Name",
	src: "resources/images/map.png", //default image
	displaying_children: false,
	child_images: [],
	//perhaps url link to widget type?
	
	constructor: function(name, src, child_images) {
		log("Constructor called with: ", name, ", ", src, ", ", child_images);
		//this.initComponent();
		this.name = name;
		log("set name");
		this.src = src;
		this.child_images = child_images;
		this.displaying_children = false;
		log("Preparing to generateItems: ", this.items);
		this.items = this.generateItems();
		log("Finished preparing items: ", this.items);
		return this;
	},
	
	generateItems: function(){
		log("GenerateItems will return: ", this.generateImgFromSrc(this.src));
		return [this.generateImgFromSrc(this.src)];
	},
	
	generateImgFromSrc: function(src){
		return Ext.create('Ext.Img', {
    		src: src,
    	});
	},

	setSrc: function(src) {
		this.src = src;
		//refresh items
    },

    getSrc: function(src) {
    	return this.src;
    }
	
}); 
*/

/*	
Ext.define('Widget_Item_Old', {
	extend: 'Ext.Component',
	alias: "widget.widget_item",
	
	autoEl: {
        tag: 'img',
        src: this.src,
        cls: 'widget_image'
    },

	height: 200,
	width: 200,

	name: "Default Name",
	src: "resources/images/map.png", //default image
	displaying_children: false,
	child_images: "",
	//perhaps url link to widget type?
	
	
	constructor: function(name, src, child_images) {
		log("Constructor called with: ", name, ", ", image_source, ", ", child_images);
		this.initComponent();
		this.name = name;
		this.src = src;
		this.child_images = child_images;
		this.displaying_children = false;
		return this;
	},
	
	
	
	initComponent: function() {
		log("initComponent");
        Ext.apply(this, {
            // complex configs (objects / arrays) go here
            //columns: colModel,  
        });

        this.callParent(arguments);
    },
	
	onRender: function() {
		log("onRender");
        this.autoEl = Ext.apply({}, this.initialConfig, this.autoEl);
        this.callParent(arguments);
        this.el.on('load', this.onLoad, this);
    },
    
    onLoad: function() {
    	log("onLoad");
        this.fireEvent('load', this);
    },


	setSrc: function(src) {
		log("setting source to: ", src);
        if (this.rendered) {
        	log("Rendered: Using DOM");
            this.el.dom.src = src;
            this.src = src;
        } else {
        	log("Not rendered: setting widget property");
            this.src = src;
        }
    },

    getSrc: function(src) {
    	log("getSrc returning: ", this.el.dom.src || this.src);
        return this.el.dom.src || this.src;
    }
	
	
	generatePanel: function() {
		var return_panel = Ext.create('Ext.Img', {
    		src: this.image_source,
    		listeners: {
				el: {
					click: function() {
						if (!displaying_children) {
							var child_panel = Ext.create('Ext.Img', {
								src: this.child_images[0],
								floating: true
							});
							child_panel.show();
						}
					}
				}
    		}
    	});
    	return return_panel;
	}
	
}); 
*/

/*
	function(name, image_source, child_images) {
		log("Constructor called with: ", name, image_source);
		this.name = name;
		this.image_source = image_source;
		this.child_images = child_images;
		this.displaying_children = false;
		return this;
});
*/

/*
Ext.define('Widget_Chooser', {
	variable: "value",
 
    constructor: function(value) {
        this.variable = value
                
        return this;
    },
 
    display: function() {
        log("Widget Choose object. Variable = " + this.variable);
    },
    
    //might need: idNumber
    makePanel: function() {
    	var return_panel = Ext.create('Ext.Panel', {
			layout: {
				type: 'table',
				columns: 5
			},
			items: [
						{html: "", class: "blankRow",},
						{html: "", class: "blankRow",},
						{html: "", class: "blankRow",},
						{html: "", class: "blankRow",},
						{html: "", class: "blankRow",},
						{html: "", class: "blankColumn"},
						{html: "<img class='icon' src='resources/images/map.png' />",   class: "imageHolder",},
						{html: "<img class='icon' src='resources/images/table.png' />", class: "imageHolder",},
						{html: "<img class='icon' src='resources/images/tree.png' />",  class: "imageHolder",},
						{html: "", class: "blankColumn"},
						{html: "", class: "blankRow", colspan: 5,},
					],
		});
		return return_panel;
    }
    
});
*/

log("Widget Chooser: load complete.");