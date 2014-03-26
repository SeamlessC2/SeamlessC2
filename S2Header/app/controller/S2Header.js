Ext.define('S2Header.controller.S2Header', {
    extend: 'Ext.app.Controller',
    views: ['MainView'],
    
    onLaunch: function() {//fires after everything is loaded
        log("S2Header Controller Launch Complete");                
    },
    
    init: function() {           
        if(OWF.Util.isRunningInOWF()) {
            this.initOWF();
        }
        log("Initialized S2Header Controller");
    },
    setMessage:function(msg){//updates teh html for the view
        log("Set Header Message: "+msg);
        var view = Ext.getCmp("s2_header_html").update(msg);
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
        var self = this;   
        // Retrieve saved state
        OWF.Preferences.getUserPreference({
            namespace: OWF_NAMESPACE,
            name: 'MITRE.SeamlessCommander.S2HeaderData',
            onSuccess: function (response) {
                if(response.value) {
                    var data = OWF.Util.parseJson(response.value);
                    log("S2HeaderData",response);
                }
            }
        });
            
            
        // Subscribe to channel
        OWF.Eventing.subscribe(OWF_NAMESPACE+'.S2Header', function (sender, msg, channel) {
            log("S2Header Message Recd",msg);
            self.setMessage(msg.html);
        });
    
        // -----------------------------------
        // Check for launch data
        // -----------------------------------
        var launchData = OWF.Launcher.getLaunchData();
        if (launchData != null) {
            log("Launch Data",launchData);
            var data = OWF.Util.parseJson(launchData);    
            if(data && data.msg){
                self.setMessage(data.msg);
            }
        }
        log("Widget Ready");
        OWF.notifyWidgetReady();
    }
});


