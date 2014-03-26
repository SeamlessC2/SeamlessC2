//GLOBAL VARIABLES
var LOCAL_8443_URL = "https://localhost:8443/";
var LOCAL_8080_URL = "http://localhost:8080/";

var DEBUG_LOCAL = true;
var LOGGER_ENABLED = false;
var CONSOLE_ENABLED = true;
var OWF_NAMESPACE = "MITRESeamlessC2"; // for the user preferences that are stored in OWF
var OWF_EVENT_PREFIX = "org.mitre.seamlessc2.";

Ext.Ajax.useDefaultXhrHeader = false; //for cross side scripting xxs http://stackoverflow.com/questions/10830334/ext-ajax-request-sending-options-request-cross-domain-when-jquery-ajax-sends-get
Ext.Loader.setConfig({
                enabled:true,
                disableCaching: false //debugging
            });

//OWF SETUP
var owf_running = OWF.Util.isRunningInOWF(); //https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Creating-a-Widget                    
//The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
OWF.relayFile = 'https://localhost:8443/owf/js/eventing/rpc_relay.uncompressed.html';
OWF.relayFile = 'owf/js/eventing/rpc_relay.uncompressed.html';

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
    str = "[S2Header]:"+str;
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
    str = "[S2Header](ERROR):"+str;
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
    Ext.MessageBox.S2Header(str);
    throw(str);
}