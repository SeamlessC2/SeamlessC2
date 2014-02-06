var DEBUG_LOCAL = true;
var LOGGER_ENABLED = false;
var CONSOLE_ENABLED = true;

var LOCAL_8443_URL = "https://localhost:8443/";
var LOCAL_8080_URL = "http://localhost:8080/";
var NEW_DASHBOARD_SIZE = {width:207,height:337};  //set each to "100%" maximize window - this maximizes the widget to fill its window

//GLOBAL VARIABLES
var TAILOR_8080_URL = LOCAL_8443_URL+"DashboardMaker/data/";// "http://tinker.mitre.org:8080/";
var TAILOR_8443_URL = LOCAL_8080_URL+"DashboardMaker/data/";// "https://tinker.mitre.org:8443/";
var DASH_URL = "";
var CRYSTAL_URL = "http://crystal.mitre.org:8080/";

var DATASOURCES_URL = TAILOR_8443_URL+"tailorcore/sources.json";//cross side scripting issue

var DATA_SELECTOR_WIDGET_NAME = "SeamlessC2"; //DataSelector";

//OWF SETUP
var owf_running = OWF.Util.isRunningInOWF(); //https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Creating-a-Widget                    
//The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
OWF.relayFile = '../owf/js/eventing/rpc_relay.uncompressed.html';

//LOGGING
if(LOGGER_ENABLED){
    var logger = OWF.Log.getDefaultLogger(); //popup window
    var appender = logger.getEffectiveAppenders()[0];
    // Enable logging 
    appender.setThreshold(log4javascript.Level.DEBUG);
    OWF.Log.setEnabled(LOG_ENABLED);
}

//Logger used through app
function log(str,obj){  
    if(CONSOLE_ENABLED){
        if(typeof(console) !== 'undefined'){
            if(typeof(obj) !== 'undefined'){
                console.log(str,obj);
            }else{
                console.log(str);
            }
        }
    }
    if(LOGGER_ENABLED){
        logger.debug(str);
    }
}
function error(str,obj){  
    if(CONSOLE_ENABLED){
        if(typeof(console) !== 'undefined'){
            if(typeof(obj) !== 'undefined'){
                console.log(str,obj);
            }else{
                console.log(str);
            }
        }
    }
    if(LOGGER_ENABLED){
        logger.error(str);
    }
    Ext.MessageBox.alert(str);
    //throw(str);
}



//
//
//var DATASOURCES_URL = LOCAL_8443_URL+"DashboardMaker/data/tailor_sources.json"; 
/*
 * Data sources
 * http://tinker.mitre.org:8080/tailorcore/sources
 * 
 */
/*
http://srv.a2c2.mitre.org:8080/cra/impl/WorldPopDataFeedCacheAdaptor/CraInstanceServlet?requestType=getLatestDataItem this call is made to DASH right? 

{
    "inputs": {
        "activityType": "Monitoring",
        "dataSource": "World Population Data",
        "relevantFields": [
            {
                "name": "name",
                "measure": "nominal",
                "criticality": "high",
                "availability": "known"
            },
            {
                "name": "income",
                "measure": "quantitative",
                "criticality": "high",
                "availability": "known"
            },
            {
                "name": "lifeExpectancy",
                "measure": "quantitative",
                "criticality": "high",
                "availability": "known"
            }
        ]
    },
    "visRecommendations": [
        {
            "widget_name": "MITRE.CIV",
            "dataURI": "http://srv.a2c2.mitre.org:8080/cra/impl/WorldPopDataFeedCacheAdaptor/CraInstanceServlet?requestType=getLatestDataItem",
            "visualizationProperties": {
                "visualizationId": "d3.scatterPlot",
                "visualizationMappings": [
                    {
                        "elementName": "Label",
                        "fieldName": "name"
                    },
                    {
                        "elementName": "Mark X Position",
                        "fieldName": "income"
                    },
                    {
                        "elementName": "Mark Y Position",
                        "fieldName": "lifeExpectancy"
                    }
                ]
            }
        },
        {
            "widget_name": "MITRE.CIV",
            "dataURI": "http://srv.a2c2.mitre.org:8080/cra/impl/WorldPopDataFeedCacheAdaptor/CraInstanceServlet?requestType=getLatestDataItem",
            "visualizationProperties": {
                "visualizationId": "nvd3.barGraph",
                "visualizationMappings": [
                    {
                        "elementName": "Label",
                        "fieldName": "name"
                    },
                    {
                        "elementName": "Bar Series",
                        "fieldName": "income"
                    },
                    {
                        "elementName": "Bar Series",
                        "fieldName": "lifeExpectancy"
                    }
                ]
            }
        }
    ]
}
*/