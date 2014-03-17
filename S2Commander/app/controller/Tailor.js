Ext.define('SeamlessC2.controller.Tailor', {
    extend: 'Ext.app.Controller',

    stores: ['TailorRecommendations','TailorSources'],
    models:['TailorRecommendationsModel','TailorSourcesModel'],
    views: [
    //'Manager.MainView'
    ],
   
    onLaunch: function() {//fires after everything is loaded
        
        var tailordata =  this.getTailorSourcesStore();
        tailordata.load({
            callback: this.onTailorSourcesStoreLoad,
            scope: this
        });
        log("Tailor Controller Launch Complete");
    },
    getRecommendations:function(self,params,callback){
        var url = TAILOR_RECOMMENDATIONS_URL;//environment.js
        log("AJAX Call:"+url);
        Ext.Ajax.request({
            method: "GET",
            url: url,
            params: params,
            success: function(response){
                log("AJAX Success! Response: ", response);
            },
            failure: function(response){
                error("AJAX  Failure. Response: ", response);
            },
            callback: function(original, successBool,ajax_response){
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
                {
                    scope:self,
                    callback(data,self);
                }
            }
        });
    },
    init: function() {
        
        if(OWF.Util.isRunningInOWF()) {
           
            // -----------------------------------
            // Retrieve saved state
            // -----------------------------------

            OWF.Preferences.getUserPreference({
                namespace: "MITRESeamlessC2",
                name: 'MITRE.SeamlessCommander.TailorData',
                onSuccess: function (response) {
                    if(response.value) {
                        var data = OWF.Util.parseJson(response.value);
                        log("TailorData",response);
                    }
                }
            });
            
            
            // -----------------------------------
            // Subscribe to channel
            // -----------------------------------
            OWF.Eventing.subscribe('org.mitre.seamlessc2commander.tailor', function (sender, msg, channel) {
                log("Tailor Message Recd",msg);
            });

            var self = this;
        }
        log("Initialized Tailor Controller");
    },
    //
    onTailorSourcesStoreLoad: function(records, operation, success) {       
        log("TailorSourcesStoreLoad",records);
    }
});
