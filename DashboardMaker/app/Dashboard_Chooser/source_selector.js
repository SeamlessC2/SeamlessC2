var widget_recommendations = [];
var cur_source_num = null;

owfdojo.addOnLoad(function() {
    OWF.ready(function(){
       // widget_controller.addSelectionListener(processSelectedWidget);
    });
});

//generates the "Add" button for a Source Panel
var generateSourceAddButtonPanel = function(sourceNum){
    //var button = generateSourceAddButton(sourceNum);
    var panel = Ext.create('Ext.Panel', {
        id: "add_button_panel"+sourceNum,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        height: 25, 
        border: false,
        defaults: {
            border: false
        },
        items: [{
            html:"",
            flex:1
        }, {
            html:"Blank", 
            bodyStyle: "color: #FFF;", 
            flex:1
        },

        {
            html:"",
            flex:1
        },
        ]
    });
    return panel;
}

var generateSourceRemoveButton = function(sourceNum){
    var button = Ext.create('Ext.button.Button', {
        id: 'source_remove_button'+sourceNum,
        class: 'remove_button',
        text: 'Remove',
        height: 20,
        width: 50,
        handler: function(){
            executeRemoveButton(sourceNum);
        }
    });
    return button;
};

//generates the "Remove" button for a Source Panel
var generateSourceRemoveButtonPanel = function(sourceNum){
    var button = generateSourceRemoveButton(sourceNum);
    var panel = Ext.create('Ext.Panel', {
        id: "remove_button_panel"+sourceNum,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        height: 25,
        border: false,
        defaults: {
            border: false
        },
        items: [
        {
            html:"",
            flex:1
        },
        button,
        {
            html:"",
            flex:1
        }
        ]
    });
    //log("Generated button: ", button);
    //panel.hide();
    return panel;
}


log("DataSource request to "+DATASOURCES_URL);

Ext.Ajax.useDefaultXhrHeader = false; //for cross side scripting xxs http://stackoverflow.com/questions/10830334/ext-ajax-request-sending-options-request-cross-domain-when-jquery-ajax-sends-get
Ext.Ajax.request({
    //withCredentials: true,
    //        useDefaultXhrHeader: false,
    url: TAILOR_8080_URL+"tailorcore/sources.json",//DATASOURCES_URL,//environment.js
    success: function(response){
        //log("Success! Response: ", response.responseText);
        var responseObject =  Ext.JSON.decode(response.responseText);
        //log("Attempting to decode: ", responseObject);
        states = Ext.create('Ext.data.Store', {
            fields: ['name', 'Url'],
            data: responseObject
        });
        log("Dynamic states are: ", states);
    },
    failure: function(response){
        log(DATASOURCES_URL+ " DataSource FAILURE. Response: ", response);

        states = Ext.create('Ext.data.Store', {
            fields: ['name', 'Url'],
            //TODO Remove Hardcoded
            //data : [{                "source_id":12,                "name":"Decision Spaces",                "Url":"../tailor/options.csv"            },{                "source_id":13,                "name":"CIV data source",                "Url":"http://tinker.mitre.org:8080/ComposableInformationVisualization/json/grouped-data.json"            },{                "source_id":14,                "name":"Decision Spaces Web Service",                "Url":"http://crystal.mitre.org:8080/crystal-a2c2/eme/resultsets/1/ "            },{                "source_id":15,                "name":"World Population Data Feed",                "Url":"http://a2c2srv.mitre.org:8080/cra/impl/WorldPopDataFeedAdaptor/CraInstanceServlet?requestType=getLatestDataItem" }]
            data : []
        });
        log("Hardcoded states are: ", states);
    },
    callback: function(response){
        log("now setting comboboxes");

        combobox1 = Ext.create('Ext.form.ComboBox', {
            //fieldLabel: 'Choose State',
            id: "combobox1",
            store: states,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            width: 205
        //renderTo: Ext.getBody()
        });

        combobox2 = Ext.create('Ext.form.ComboBox', {
            //fieldLabel: 'Choose State',
            id: "combobox2",
            store: states,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            width: 205
        //renderTo: Ext.getBody()
        });

        combobox3 = Ext.create('Ext.form.ComboBox', {
            //fieldLabel: 'Choose State',
            id: "combobox3",
            store: states,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            width: 205
        //renderTo: Ext.getBody()
        });

        combobox4 = Ext.create('Ext.form.ComboBox', {
            //fieldLabel: 'Choose State',
            id: "combobox4",
            store: states,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            width: 205
        //renderTo: Ext.getBody()
        });

    }
});

function generateSourceSelector(sourceNumber){
    /*
    var fileForm = Ext.create('Ext.form.Panel', {
    		id: "fileForm"+sourceNumber,
			flex: 1,
			bodyStyle: 'padding: 10px;',
			//border: false,

			defaults: {
				anchor: '100%',
				allowBlank: false,
				msgTarget: 'side',
				labelWidth: 50
			},

			items: [
			{html: "<div class='sourcePanel'>My Computer</div>", bodyStyle: "background: #DFE9F6; border: 0px;",},
			{
				xtype: 'filefield',
				id: 'inputFile'+sourceNumber,
				emptyText: 'Select a CSV file',
				name: 'inputFile',
				buttonText: 'Browse',
				listeners: {
					change: function(t, fileLocation) {
						log("file changed!");
						var form = this.up('form').getForm();
						log("form = ", form);
						if(form.isValid()){
							form.submit({
								//url: '/DataEngine/csvSlurper/',
								url: 'https://localhost:8443/DataEngine/csvSlurper/',
								force_mime_type: "text/plain",
								waitMsg: 'Uploading your file...',
								success: function(fp, o) {
									msg('Success', 'Processed file "' + o.result.file + '" on the server');
								},
								failure: function (form, o) {
									Ext.Msg.show({
										title: 'Add Request Failed',
										msg: o.result.error,
										buttons: Ext.Msg.OK,
										icon: Ext.Msg.ERROR
									});
								}
							});
						}
					}
				}

			}],

		});
    */
    var tailorAddButton = Ext.create('Ext.button.Button', {
        //id: 'source_add_button'+sourceNumber,
        class: 'add_button',
        text: 'Add',
        bodyStyle: 'padding: 10px;',
        //height: 20,
        width: 50,
        handler: function(){
            executeAddButton(sourceNumber, "tailor");
        }
    });

    var tailorForm = new Ext.form.FormPanel({
        //flex: 1,
        border: false,
        //layout: 'fit',
        bodyStyle: 'padding: 10px;',
        //height: 200,
        items: [
        {
            html: "<div class='sourcePanel'>Tailor Data Source</div>",
            bodyStyle: "background: #DFE9F6; border: 0px;"
        },
        window["combobox"+sourceNumber]
        ],
        buttons: [tailorAddButton],
        listeners: {
    /*
      	boxready: function(t, width, height) {
      		//log("Box ready! Resizing url form...");
      		var textField = Ext.get('urlInput'+sourceNumber);
      		var firstWidth = t.getWidth();
      		textField.setWidth(firstWidth - 30);
      	},
      	resize: function(t, width, height, oldWidth, oldHeight, eOpts ) {
      		//log("Resizing...");
      		var textField = Ext.get('urlInput'+sourceNumber);
      		textFieldOldWidth = textField.getWidth();
      		textField.setWidth(textFieldOldWidth + (width - oldWidth));
      	}
      	*/
    }
    });

    var tailorPanel1 = Ext.create('Ext.Panel', {
        id: "tailorPanel1-"+sourceNumber,
        layout: 'fit',
        border: true,
        items: [
        tailorForm,
        ]
    });

    var tailorPanel2 = Ext.create('Ext.Panel', {
        id: "tailorPanel2-"+sourceNumber,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        width: 240,
        padding: "10px",
        height: 132,
        border: false,
        items: [
        tailorPanel1,
        ]
    });

    var urlButton = Ext.create('Ext.button.Button', {
        //id: 'source_add_button'+sourceNumber,
        class: 'add_button',
        text: 'Add',
        bodyStyle: 'padding: 10px;',
        //height: 20,
        width: 50,
        handler: function(){
            executeAddButton(sourceNumber, "url");
        }
    });


    var urlForm = new Ext.form.FormPanel({
        //flex: 1,
        border: false,
        //layout: 'fit',
        bodyStyle: 'padding: 10px;',
        //height: 200,
        items: [
        {
            html: "<div class='sourcePanel'>URL Data Source</div>",
            bodyStyle: "background: #DFE9F6; border: 0px;"
        },
        //window["combobox"+sourceNumber]

        new Ext.form.TextField({
            xtype: 'textfield',
            id:'urlInput'+sourceNumber,
            name: 'urlInput'+sourceNumber,
            label: "Web Address",
            hideLabel: 'true',
            //height: 40,
            width: 200
        }),

        ],
        buttons: [urlButton],
        listeners: {
    /*
      	boxready: function(t, width, height) {
      		//log("Box ready! Resizing url form...");
      		var textField = Ext.get('urlInput'+sourceNumber);
      		var firstWidth = t.getWidth();
      		textField.setWidth(firstWidth - 30);
      	},
      	resize: function(t, width, height, oldWidth, oldHeight, eOpts ) {
      		//log("Resizing...");
      		var textField = Ext.get('urlInput'+sourceNumber);
      		textFieldOldWidth = textField.getWidth();
      		textField.setWidth(textFieldOldWidth + (width - oldWidth));
      	}
      	*/
    }
    });

    var urlPanel1 = Ext.create('Ext.Panel', {
        id: "urlPanel1-"+sourceNumber,
        layout: 'fit',
        //width: 240,
        //height: 240,
        border: true,
        items: [
        //{html: "", flex: 1, border: false},
        urlForm,
        //{html: "", flex: 1, border: false}
        ]
    });

    var urlPanel2 = Ext.create('Ext.Panel', {
        id: "urlPanel2-"+sourceNumber,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        width: 240,
        height: 132,
        border: false,
        padding: "10px",
        items: [
        //{html: "", flex: 1, border: false},
        urlPanel1,
        //{html: "", flex: 1, border: false}
        ]
    });

    var or = Ext.create('Ext.Panel', {
        layout: {
            type: 'vbox',
            align: 'stretch'
        //pack: 'center'
        },
        width: 20,
        height: 20,
        border: false,
        items: [
        {
            html: "",
            border: false,
            height: 66
        },

        {
            html: "or",
            style: "text-align: center",
            border: false,
            width: 20,
            height: 20
        }
        ]
    });


    var source_choice = Ext.create('Ext.Panel', {
        id: "source_choice"+sourceNumber,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        border: false,
        defaults: {
            cls: 'round-corners'
        },
        flex: 2,
        items: [
        {
            html: "",
            flex: 1,
            border: false
        },
        tailorPanel2,
        or,
        urlPanel2,
        {
            html: "",
            flex: 1,
            border: false
        }
        ]
    });

    var removeButtonPanel = generateSourceRemoveButtonPanel(sourceNumber);
    //log("RemoveButtonPanel = ", removeButtonPanel);

    var source_info = Ext.create('Ext.Panel', {
        title: "Source Successfully Loaded",
        id: "sourceInfo"+sourceNumber,
        defaults: {
            border: false
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            html: "<div id='continue"+sourceNumber+"' class='continuePanel'></div>",
            flex:1
        }, removeButtonPanel],
        flex:2
    });

    /*
	var source_continue = Ext.create('Ext.Panel', {
		id: 'source_continue'+sourceNumber,
		border: false,
		//title: "Source Information",
		height:240,
		layout: "hbox",
		items: [{html: "", border: false, flex:1},
				source_info,
				{html: "", border: false, flex:1}],
	});
	//log("sourceInfo: ", Ext.getCmp("sourceInfo"+sourceNumber));
	Ext.getCmp("source_continue"+sourceNumber).hide();
    */

    var source_banner = generateBannerPanel("Select Data Source "+sourceNumber, "Select a Tailor data source or provide a URL for this widget.");

    var source_selector_layout = Ext.create('Ext.Panel', {
        id: "source_selector_layout"+sourceNumber,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        defaults: {
            border: false
        },
        border: true,
        items: [
        {
            html: "",
            flex: 1
        },
        //			{html: "<div class='progressPanel'><img class='centered' src='resources/images/step"+sourceNumber+"a.png'/></div>", height: 95},
        source_banner,
        source_choice,
        //source_continue,
        {
            html: "",
            flex: 1
        },
        ]
    });

    var source_selector = Ext.create('Ext.Panel', {
        id: "source_selector"+sourceNumber,
        layout: 'card',
        defaults: {
            border: false
        },
        border: true,
        items: [
        source_selector_layout,
        ]
    });
    return source_selector;
};

var executeRemoveButton = function(sourceNum){
    Ext.getCmp("source_choice"+sourceNum).show();
    disableButton("next", true);
    var last_item;
    if (sourceNum == 1){
        last_item = source_attribute1.items.items.pop();
    }
    if (sourceNum == 2){
        last_item = source_attribute2.items.items.pop();
    }
    log("Destroying: ", last_item);
    last_item.destroy();
    disableButton("next", false);

    Ext.getCmp("source_continue"+sourceNum).hide();
}

/*
mapWidget = new widgetData("mapWidget", color_image_sources[0], grey_image_sources[0], [color_image_sources[3], color_image_sources[0]], [grey_image_sources[3], grey_image_sources[0]], ["org.owfgoss.owf.examples.GetDirections", "org.owfgoss.owf.examples.GoogleMaps"], 0);
tableWidget = new widgetData("tableWidget", color_image_sources[1], grey_image_sources[1], [color_image_sources[1]], [grey_image_sources[1]], ["org.owfgoss.owf.examples.NYSE"], 1);
treeWidget = new widgetData("treeWidget", color_image_sources[2], grey_image_sources[2], [color_image_sources[2]], [grey_image_sources[2]], ["org.owfgoss.owf.examples.NYSE"], 2);

var defaultArray = [mapWidget, tableWidget, treeWidget];
*/

var generateWidgetListComponent = function(sourceNum, widgetListFromRecs, recs){
    var newComponent;
    log("WIDGETLISTFROMRECS: ", widgetListFromRecs);
    /*
	if (urlInput.value.slice(-3) == "kml") {
		newComponent = generatePanelWithSizeAndWidgets('w_choice'+sourceNum, 'hbox', 'middle', 555, 300, defaultArray, "tl-bl", "l-r", 0);
	}
	else {
		newComponent = generatePanelWithSizeAndWidgets('w_choice'+sourceNum, 'hbox', 'middle', 555, 300, defaultArray, "tl-bl", "l-r", -1);
	}
	*/
    var childWidgetArray = [];
    var childImageArray = [];
    var childGreyArray = [];
    var childDataArray = [];
    for (i in widgetListFromRecs){
        var currentChild = widgetListFromRecs[i].value;
        childWidgetArray.push(currentChild.universalName);
        //childImageArray.push(currentChild.largeIconUrl);
        childImageArray.push(graph_image);
        childGreyArray.push(graph_grey_image);
        childDataArray.push(recs[i]);
    }
    log("childDataArray looks like: ", childDataArray);
    //var firstChild = widgetListFromRecs[0].value;
    var newWidget = new widgetData("recWidget", graph_image, graph_grey_image, childImageArray, childGreyArray, childWidgetArray, 0, childDataArray);//widget_chooser
    var finalArray = [newWidget].concat(defaultArray);

    newComponent = generatePanelWithSizeAndWidgets(sourceNum, 'hbox', 'middle', 555, 200, finalArray, "tl-bl", "l-r", 0);

    var source_card = Ext.getCmp("source_selector"+sourceNum);
    log("source_selector = ", source_card)

    source_card.add(newComponent);
    source_card.getLayout().setActiveItem(1);

}


//called when the Add button is clicked
var executeAddButton = function(sourceNum, sourceName){
    log("Add button pressed: SourceName = "+ sourceName+ " SourceNum="+sourceNum);
    cur_source_num = sourceNum;
    if(sourceName == "tailor"){
        var url = TAILOR_8080_URL+"tailorcore/recommendations.json";
        var comboboxInput = Ext.getCmp("combobox"+sourceNum);
        var data_source = comboboxInput.getValue();
        log("TAILOR Datasource: ",data_source, "(", comboboxInput.getRawValue(), ")");
        log("Making request for Tailor to "+url);
        var params = {
            activityType: "Monitoring",
            dataSource: data_source
        };
        getRecommendationsAJAX(url,params,processRecommendationsCallback);
    }
    else {
        var urlInput = Ext.getCmp("urlInput"+sourceNum);
        var input_url = urlInput.getValue();
        log("urlInput value: ", urlInput);
        log("value: ", input_url);

        if (input_url.length > 0){
            log("making Url Data Source request: "+input_url);
            params={
                activityType: "Monitoring"
            };
            getRecommendationsAJAX(input_url,processRecommendationsCallback);
        }else{//EMPTY
            generateWidgetSelector();
        }
    }
}

function getRecommendationsAJAX(url,params,callback){
    log("AJAX Call:"+url);
    Ext.Ajax.request({
        method: "GET",
        url: url,
        params: params,
        success: function(response){
            log("AJAX Success! Response: ", response);
        },
        failure: function(response){
            log("AJAX  Failure. Response: ", response);
        },
        callback: callback
    });
}

function processRecommendationsCallback(original, successBool,ajax_response){
    log("AJAX Callback: ", ajax_response);
    if(typeof(ajax_response) === 'undefined' || ajax_response == null || ajax_response.length==0){
        log("ERROR in AJAX response ",original);
        throw("ERROR in AJAX response ",original);
    }
    var data = Ext.JSON.decode(ajax_response.responseText);
    if(typeof(data) === 'undefined' || data == null || data.length==0){
        log("ERROR in AJAX response ",original);
        throw("ERROR in AJAX response ",original);
    }
    var recs = data["visRecommendations"];
    if(typeof(recs) === 'undefined' || recs == null || recs.length==0){
        log("ERROR in AJAX response ",original);
        throw("ERROR in AJAX response ",original);
    }

    log("Widget Recommendations",recs);
    widget_recommendations =[];
    for (i in recs){
        var rec = recs[i];
        log("Recommendation", rec);
        widget_recommendations.push(rec);
    }
    generateWidgetSelector();
};

function generateWidgetSelector(){
    var sourceNum = cur_source_num;
    var widget_store = widget_controller.getWidgetStore();
    var widget_panel = widget_controller.getWidgetDataView(widget_store);
    //adjust for recommendations
    var panel_width = 555;
    var panel_height = 200;
    var txt = "Select a widget for this data. ";
    if(widget_recommendations.length > 0){
        txt +="<span class='widget_recommended'>Recommended widgets are highlighted</span>";
        widget_store.data.each(function(item, index, totalItems ) {
            var name = item.data['name'];
            for(i in widget_recommendations){
                var rec = widget_recommendations[i];
                if(rec.widget_name == name ){
                    log("recommended widget found:"+name);
                    item.data['class'] = 'widget_recommended';
                }
            }
        });
    }

    var widget_banner = generateBannerPanel("Select Widget ", "<div id='widget_banner_id'>"+txt+"</div>");

    //get the layout for the page
    var layout_panel = generateLayoutPanel(widget_banner,widget_panel,sourceNum,panel_width,panel_height);

    var source_card = Ext.getCmp("source_selector"+sourceNum);
    log("source_selector = ", source_card)

    source_card.add(layout_panel);
    source_card.getLayout().setActiveItem(1);
}

function processSelectedWidget(widget_list){
    for(i in widget_list){
        var widget = widget_list[i];
        log("Processing:"+widget.data.name,widget);
    }
}
/*
	if (urlInput.value.slice(-3) == "kml") {
		newComponent = generatePanelWithSizeAndWidgets('w_choice'+sourceNum, 'hbox', 'middle', 555, 300, defaultArray, "tl-bl", "l-r", 0);
	}
	else {
		newComponent = generatePanelWithSizeAndWidgets('w_choice'+sourceNum, 'hbox', 'middle', 555, 300, defaultArray, "tl-bl", "l-r", -1);
	}
	*/

/*
	newComponent = generatePanelWithSizeAndWidgets(sourceNum, 'hbox', 'middle', 555, 300, defaultArray, "tl-bl", "l-r", 0);

	var source_card = Ext.getCmp("source_selector"+sourceNum);
	log("source_selector = ", source_card)

	source_card.add(newComponent);
	source_card.getLayout().setActiveItem(1);
	*/
/*
	if (urlInput.value){
		//log("Found URL, proceeding");
		var urlValue =  urlInput.value;

		if (sourceNum == 1){
			sourceURL1 = urlValue;
		}
		else {
			sourceURL2 = urlValue;
		}
		if (urlValue == "data"+sourceNum+".csv" || urlValue == "undefined") {
			urlInput = DOMAIN+"/DataEngine/csvSlurper?url="+DOMAIN+ROOT+"/data"+sourceNum+".csv";
		}
		else {
			if (urlValue.slice(-3) == "csv"){
				urlInput = DOMAIN+"/DataEngine/"+CSVSLURPER+"?url="+urlValue;
			}
			else{
				urlInput = DOMAIN+"/DataEngine/"+JSONSLURPER+"?url="+urlValue;
			}
		}
		Ext.Ajax.request({
		   method: "GET",
		   url: urlInput,
		   //success: slurperPass,
		   //failure: slurperFail,
		   //jsonData: { foo: 'bar' }  // your json data
		   params: { format: 'json' },
		   callback: function(original, successBool, response){
				//log("ResponseText: ", response.responseText);
				var jsonResponse = JSON.parse(response.responseText);
				//log(jsonResponse);

				var keys = Object.keys(jsonResponse.feed.records[0].ext);
				if (sourceNum == 1){
					global_keys1 = keys;
				}
				else {
					global_keys2 = keys;
				}
				//log("Data"+sourceNum+"'s keys: ", keys);
				Ext.define("Data"+sourceNum,{
					extend: 'Ext.data.Model',
					fields: keys,
				});

				//log("Data"+sourceNum+"'s data: ", jsonResponse);
				var new_store = Ext.create('Ext.data.Store', {
					id: "data_store"+sourceNum+"",
					model: "Data"+sourceNum,
					autoLoad: true,
					data: jsonResponse.feed,
					proxy: {
						type: 'memory',
						reader: {
							type: 'json',
							root: 'records',
							record: 'ext',
						}
					}
				});

				new_store.load({
					callback: function(records, operation, success) {
					//log("Objects in store: ", new_store.getCount());
					if(success){
						//log("Source "+sourceNum+": Success!");
						//log("Records: ", records);
						//log("Name: ", jsonResponse.title);
						var title = jsonResponse.title;
						if (title == null){
							title = "Source "+sourceNum;
						}
						var type = jsonResponse.description;
						if (type == null){
							type = "Undefined";
						}
						if (sourceNum == 1){
							global_store = new_store;
						}
						else {
							global_store2 = new_store;
						}
						//var msg = sourceTemplate.applyTemplate({name: title, type: type, url: urlValue, dataRecords: new_store.getCount(), dataFields: keys.length, num: sourceNum});

						sourceTemplate.overwrite("continue"+sourceNum, {name: title, type: type, url: urlValue, dataRecords: new_store.getCount(), dataFields: keys.length, num: sourceNum});
						//continueButton1.render('continueButton1');
						//Ext.getCmp("main_next").setDisabled(false);
						//Ext.getCmp("main_next").setSrc("resources/images/button_next.png");
						disableButton("next", false);
						//Ext.getCmp("urlButton"+sourceNum).setDisabled(true);
						Ext.getCmp("source_choice"+sourceNum).hide();
						//Ext.getCmp('add_button_panel'+sourceNum).hide();
						//Ext.getCmp('remove_button_panel'+sourceNum).show();

						//urlPanel = Ext.get('urlPanel'+sourceNum);
						//check.show();
						//check.alignTo(urlPanel, "c-c");
						Ext.getCmp("source_continue"+sourceNum).show();


					}
					else{
						//log("Source "+sourceNum+": Failure.");
						failureTemplate.overwrite("continue"+sourceNum);
					}
				}});

			}
		});

		//remove_button = Ext.getCmp("source_remove_button"+sourceNum);
		//log("Found remove_button: ",remove_button);
		//remove_button.visibility = "visible";


		return;
	}
	else {
		//log("Didn't find URL, ignoring");
	}
	*/


function generateLayoutPanel(widget_banner_panel,widget_panel,sourceNum,panel_width,panel_height){
    var layout_panel = Ext.create('Ext.Panel', {
        id: "Layout_Panel_"+sourceNum,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        width: panel_width,
        height: panel_height+100,
        border: false,
        defaults: {
            border: false
        },
        items: [
        {
            html: "",
            flex: 1
        },
        widget_banner_panel,
        widget_panel,
        {
            html: "",
            flex: 1
        },
        ]
    });
    return layout_panel;
}

function generateBannerPanel(title, text){
    var banner_panel = Ext.create('Ext.Panel', {
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        border: false,
        defaults: {
            border:false
        },
        height: 100,
        items: [
        {
            html:"<div class='banner'>"+title+"</div>",
            flex:1
        },

        {
            html:"<div class='text'>"+text+"</div>",
            height: 40
        },
        //title_panel,
        //text_panel,
        //preview_panel,
        ]

    });
    return banner_panel;
}