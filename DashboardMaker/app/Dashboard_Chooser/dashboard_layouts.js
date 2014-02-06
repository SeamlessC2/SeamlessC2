/*This is the layouts for the various dashboards.
 *You send in a widget from the system and it will populate a layout based on the guids, etc...
 *The layouts can be configured using the Ozone dashboard creator. Then export the dashboard to get the layout.
 *
 *
 */


DashboardController.prototype.updateDashboardModels = function (widget){
    
    var data_select_widget_template = {
        "universalName": widget.value.universalName,
        "widgetGuid": widget.id,
        "name": widget.value.namespace,
        "active": true,
        "x": 0,
        "y": 0,
        "minimized": false,
        "maximized": true,
        "pinned": false,
        "collapsed": false,
        "columnPos": 0,
        "buttonId": null,
        "buttonOpened": false,
        "region": "none",
        "statePosition": 3,
        "intentConfig": null,
        "singleton": false,
        "floatingWidget": false,
        "background": false,
        "zIndex": 19050,
        "height": 400,
        "width": 400
    };
    var guid ={};
    guid['width']= NEW_DASHBOARD_SIZE.width;// "100%";//maximize window - this maximizes the widget to fill its window
    guid['height'] = NEW_DASHBOARD_SIZE.height;//"100%"; //maximize window
    guid['x'] = 0;
    guid['y'] = 0;
    guid.timestamp = new Date().getTime();
    var widgetStates ={};
    widgetStates[widget.id] = guid;
        
    var data_select_widget_default_settings = {};
    data_select_widget_default_settings['widgetStates'] = widgetStates;
    /*
            "defaultSettings": {
                    "widgetStates": {
                        "412ec70d-a178-41ae-a8d9-6713a430c87c": {
                            "x": 0,
                            "y": 196,
                            "height": 440,
                            "width": 818,
                            "timestamp": 1383151840276
                        },
        };*/
                
                    
    var basicConfig ={            
        "height": "100%",
        "items": [],
        "xtype": "desktoppane",
        "flex": 1,
        "paneType": "desktoppane",
        "widgets": [data_select_widget_template],
        "defaultSettings": data_select_widget_default_settings            
    };
    
    var verticalConfig = { // left/right
           
        "xtype": "container",
        "cls": "hbox",
        "layout": {
            "type": "hbox",
            "align": "stretch"
        },
        "items": [
        {
            "xtype": "desktoppane",
            "cls": "left",
            "flex": 1,
            "height": "100%",
            "htmlText": "50%",
            "items": [],
            "widgets": [data_select_widget_template],
            "paneType": "desktoppane",
            "defaultSettings": data_select_widget_default_settings
        },
        {
            "xtype": "dashboardsplitter"
        },
        {
            "xtype": "desktoppane",
            "cls": "right",
            "flex": 1,
            "htmlText": "50%",
            "items": [],
            "paneType": "desktoppane",
            "widgets":[data_select_widget_template],
            "defaultSettings": data_select_widget_default_settings
        }
        ],
        "flex": 1
    };
    var horizontalConfig = { //top and bottom
            
        "xtype": "container",
        "cls": "vbox ",
        "layout": {
            "type": "vbox",
            "align": "stretch"
        },
        "items": [
        {
            "xtype": "desktoppane",
            "cls": "top",
            "flex": 1,
            "htmlText": "50%",
            "items": [],
            "widgets": [data_select_widget_template],
            "paneType": "desktoppane",
            "defaultSettings": data_select_widget_default_settings
        },
        {
            "xtype": "dashboardsplitter"
        },
        {
            "xtype": "desktoppane",
            "cls": "bottom",
            "flex": 1,
            "htmlText": "50%",
            "items": [],
            "paneType": "desktoppane",
            "widgets": [data_select_widget_template],
            "defaultSettings": data_select_widget_default_settings
        }
        ],
        "flex": 1
            
    };
        
    var rightTConfig = { 
            
        "xtype": "container",
        "cls": "hbox ",
        "layout": {
            "type": "hbox",
            "align": "stretch"
        },
        "items": [
        {
            "xtype": "desktoppane",
            "cls": "left",
            "flex": 1,
            "htmlText": "50%",
            "items": [],
            "widgets": [data_select_widget_template],
            "paneType": "desktoppane",
            "defaultSettings": data_select_widget_default_settings
        },
        {
            "xtype": "dashboardsplitter"
        },
        {
            "xtype": "container",
            "cls": "vbox right",
            "layout": {
                "type": "vbox",
                "align": "stretch"
            },
            "items": [
            {
                "xtype": "desktoppane",
                "cls": "top",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "widgets": [data_select_widget_template],
                "paneType": "desktoppane",
                "defaultSettings": data_select_widget_default_settings
            },
            {
                "xtype": "dashboardsplitter"
            },
            {
                "xtype": "desktoppane",
                "cls": "bottom",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "paneType": "desktoppane",
                "widgets": [data_select_widget_template],
                "defaultSettings": data_select_widget_default_settings
            }
            ],
            "flex": 1
        }
        ],
        "flex": 1
            
    };
        
    var leftTConfig = { 
            
        "xtype": "container",
        "cls": "hbox ",
        "layout": {
            "type": "hbox",
            "align": "stretch"
        },
        "items": [
        {
            "xtype": "container",
            "cls": "vbox left",
            "layout": {
                "type": "vbox",
                "align": "stretch"
            },
            "items": [
            {
                "xtype": "desktoppane",
                "cls": "top",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "widgets": [data_select_widget_template],
                "paneType": "desktoppane",
                "defaultSettings": data_select_widget_default_settings
            },
            {
                "xtype": "dashboardsplitter"
            },
            {
                "xtype": "desktoppane",
                "cls": "bottom",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "paneType": "desktoppane",
                "widgets": [data_select_widget_template],
                "defaultSettings": data_select_widget_default_settings
            }
            ],
            "flex": 1
        },
            
        {
            "xtype": "dashboardsplitter"
        },
        {
            "xtype": "desktoppane",
            "cls": "right",
            "flex": 1,
            "htmlText": "50%",
            "items": [],
            "paneType": "desktoppane",
            "widgets": [data_select_widget_template],
            "defaultSettings": data_select_widget_default_settings
        }
               
        ],
            
        "flex": 1            
    };
    var downTConfig ={ 
            
        "xtype": "container",
        "cls": "vbox ",
        "layout": {
            "type": "vbox",
            "align": "stretch"
        },
        "items": [
        {
            "xtype": "desktoppane",
            "cls": "top",
            "flex": 1,
            "htmlText": "50%",
            "items": [],
            "widgets": [data_select_widget_template],
            "paneType": "desktoppane",
            "defaultSettings": data_select_widget_default_settings
        },
        {
            "xtype": "dashboardsplitter"
        },
        {
            "xtype": "container",
            "cls": "hbox bottom",
            "layout": {
                "type": "hbox",
                "align": "stretch"
            },
            "items": [
            {
                "xtype": "desktoppane",
                "cls": "left",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "widgets": [data_select_widget_template],
                "paneType": "desktoppane",
                "defaultSettings": data_select_widget_default_settings
            },
            {
                "xtype": "dashboardsplitter"
            },
            {
                "xtype": "desktoppane",
                "cls": "right",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "paneType": "desktoppane",
                "widgets": [data_select_widget_template],
                "defaultSettings": data_select_widget_default_settings
            }
            ],
            "flex": 1
        }
        ],
        "flex": 1
    };
    
    var upTConfig ={ 
            
        "xtype": "container",
        "cls": "vbox ",
        "layout": {
            "type": "vbox",
            "align": "stretch"
        },
        "items": [        
        {
            "xtype": "container",
            "cls": "hbox top",
            "layout": {
                "type": "hbox",
                "align": "stretch"
            },
            "items": [
            {
                "xtype": "container",
                "cls": "hbox top",
                "layout": {
                    "type": "hbox",
                    "align": "stretch"
                },
                "items": [
                {
                    "xtype": "desktoppane",
                    "cls": "left",
                    "flex": 1,
                    "htmlText": "50%",
                    "items": [],
                    "widgets": [data_select_widget_template],
                    "paneType": "desktoppane",
                    "defaultSettings": data_select_widget_default_settings
                },
                {
                    "xtype": "dashboardsplitter"
                },
                {
                    "xtype": "desktoppane",
                    "cls": "right",
                    "flex": 1,
                    "htmlText": "50%",
                    "items": [],
                    "paneType": "desktoppane",
                    "widgets": [data_select_widget_template],
                    "defaultSettings": data_select_widget_default_settings
                }
                ],
                "flex": 1
            }
            ],
            "flex": 1
        },
        {
            "xtype": "dashboardsplitter"
        },
        {
            "xtype": "desktoppane",
            "cls": "bottom",
            "flex": 1,
            "htmlText": "50%",
            "items": [],
            "paneType": "desktoppane",
            "widgets": [data_select_widget_template],
            "defaultSettings": data_select_widget_default_settings
        }
        ],                
        "flex": 1
    };        
        
    var fourConfig = {
        "xtype": "container",
        "cls": "vbox ",
        "layout": {
            "type": "vbox",
            "align": "stretch"
        },
        "items": [
        {
            "xtype": "container",
            "cls": "hbox top",
            "layout": {
                "type": "hbox",
                "align": "stretch"
            },
            "items": [
            {
                "xtype": "desktoppane",
                "cls": "left",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "widgets": [data_select_widget_template],
                "paneType": "desktoppane",
                "defaultSettings": data_select_widget_default_settings
            },
            {
                "xtype": "dashboardsplitter"
            },
            {
                "xtype": "desktoppane",
                "cls": "right",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "paneType": "desktoppane",
                "widgets": [data_select_widget_template],
                "defaultSettings": data_select_widget_default_settings
            }
            ],
            "flex": 1
        },
        {
            "xtype": "dashboardsplitter"
        },
        {
            "xtype": "container",
            "cls": "hbox bottom",
            "layout": {
                "type": "hbox",
                "align": "stretch"
            },
            "items": [
            {
                "xtype": "desktoppane",
                "cls": "left",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "widgets": [data_select_widget_template],
                "paneType": "desktoppane",
                "defaultSettings": data_select_widget_default_settings
            },
            {
                "xtype": "dashboardsplitter"
            },
            {
                "xtype": "desktoppane",
                "cls": "right",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "paneType": "desktoppane",
                "widgets": [data_select_widget_template],
                "defaultSettings": data_select_widget_default_settings
            }
            ],
            "flex": 1
        }
        ],
        "flex": 1
    };
    this.dashboardDict = {
        0: basicConfig, 
        1: verticalConfig, 
        2: horizontalConfig, 
        3: rightTConfig, 
        4: leftTConfig, 
        5: downTConfig, 
        6: upTConfig, 
        7: fourConfig
    };
}