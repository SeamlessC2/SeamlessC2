Ext.define('S2Alerts.controller.S2Alerts', {
    extend: 'Ext.app.Controller',
    stores: ['S2Alerts'],
    models:['S2AlertsModel'],
    views: ['MainView','S2AlertsView'],
    
    //fields
    
    onLaunch: function() {//fires after everything is loaded
       var store =  this.getS2AlertsStore();
        store.load({
            callback: this.onStoreLoad, 
            scope: this
        });
        log("S2Alerts Controller Launch Complete");                
    },
    
    init: function() {           
        if(OWF.Util.isRunningInOWF()) {
            this.initOWF();
        }
        log("Initialized S2Alerts Controller");
    },
    //load in dynamic names for the dashboard menu
    onStoreLoad: function(records, operation, success) {
        var store =  this.getS2AlertsStore();
        /* var alerts_view = Ext.getCmp("alerts_view");
        var self = this;
       
        Ext.each(records,function(record,id){
            log("Record:",record);
            alerts_view.add({
                xtype:'button',
                width:42,
                height:32,
                cls: 'alerts_btn',
                text:record.get('name'),
                checked: false,
                group: 'theme',
                checkHandler: self.alertSelectHandler,
                data:{
                    name:record.get('name'),
                    guid:record.get('guid')
                }
            });
        });*/
       
        log("Store load",records);
    },
   
    getWidgetState:function(){
        //close widget https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-State-API https://github.com/ozoneplatform/owf/blob/master/web-app/examples/walkthrough/widgets/EventMonitor.html
        var eventMonitor = {};
        var state =Ozone.state.WidgetState;
        eventMonitor.widgetEventingController = Ozone.eventing.Widget.getInstance();
        eventMonitor.widgetState = Ozone.state.WidgetState.getInstance({
            widgetEventingController: eventMonitor.widgetEventingController,
            autoInit: true,
            onStateEventReceived: function(){
            //handle state events
            }
        });

        return eventMonitor.widgetState;
    },
    close:function(){
        this.getWidgetState().closeWidget();
    },
    //setup OWF specifics
    initOWF:function(){
                      
        // Retrieve saved state
        OWF.Preferences.getUserPreference({
            namespace: "MITRESeamlessC2",
            name: 'MITRE.SeamlessCommander.S2AlertsData',
            onSuccess: function (response) {
                if(response.value) {
                    var data = OWF.Util.parseJson(response.value);
                    log("S2AlertsData",response);
                }
            }
        });
            
            
        // Subscribe to channel
        OWF.Eventing.subscribe('org.mitre.seamlessc2commander.alerts', function (sender, msg, channel) {
            log("S2Alerts Message Recd",msg);
        });
    
        // -----------------------------------
        // Check for launch data
        // -----------------------------------
        var launchData = OWF.Launcher.getLaunchData();
        if (launchData != null) {
            log("Launch Data",launchData);
            var data = OWF.Util.parseJson(launchData);    
            if(data && data.alerts){
                this.alerts = data.alerts;
            }
        }

        log("Widget Ready");
        OWF.notifyWidgetReady();
    }
});


