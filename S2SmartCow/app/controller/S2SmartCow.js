Ext.define('S2SmartCow.controller.S2SmartCow', {
    extend: 'Ext.app.Controller',
    stores: ['S2SmartCowTasks'],
    models:['S2SmartCowProcessInstanceModel','S2SmartCowTaskModel','S2SmartCowVariablesModel','S2SmartCowVariableModel'],
    views: ['MainView','TasksView'],
    
    //fields
    SmartCowUser:null,//passed in on widget
    
    onLaunch: function() {//fires after everything is loaded
        this.loadStore();
        log("SmartCow Controller Launch Complete");                
    },
    
    init: function() {           
        if(OWF.Util.isRunningInOWF()) {
            this.initOWF();
        }
        log("Initialized SmartCow Controller");
    },
    loadStore:function(){
        var store =  this.getS2SmartCowTasksStore();
        
        this.SmartCowUser= "mhowansky";//TODO remove
        if(this.SmartCowUser != null)
            store.proxy.api.read=store.proxy.api.read+this.SmartCowUser;
        store.load({
            callback: this.onStoreLoad, 
            scope: this
        });
    },
    //load in dynamic names for the dashboard menu
    onStoreLoad: function(records, operation, success) {
        var store =  this.getS2SmartCowTasksStore();
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
    // Retrieve all assigned active tasks for a specified assignee
    getUserTasks:function (user,callback){
        var restURI = SMARTCOW_URL+"processInstances/tasks.json?assignee=" + user;
        
        Ext.Ajax.request({
            method: "GET",
            //withCredentials: true,
            //useDefaultXhrHeader: false,
            url: restURI,
            success: function(response){
                //log("Success! Response: ", response.responseText);
                var data =  Ext.JSON.decode(response.responseText);
                log("SmartCow UserTasks - ProcessInstance for "+user, data);
            /*
                var pIs = data.processInstances.processInstance
                //if there is only one instance (object) , convert it to an array
                if (pIs.length == undefined){
                    pIs = [pIs]
                }				
                pIs.forEach(function(pi){
                    var wfName  = pi.processDefinitionId
                    var taskName = pi.task.name
                });
       */
            },
            failure: function(response){
                log("getUserTasks failed for url:"+restURI, response);
            },
            callback: callback
           
        });
    },

    //Retrieve all active unassigned tasks for which a user is an eligible candidate. This includes both tasks for which the user is directly a candidate,
    // via the candidateUser element in the process XML,
    // or indirectly, via the user's membership in a group, as indicated by a candidateGroup element.
    getAvailableTasks:function(user){
        var restURI = SMARTCOW_URL+"processInstances/tasks.json?candidate=" + user
        $.ajax({
            url: restURI,
            contentType:"application/xml;",
            type:"GET",			
            dataType:"xml",
            success:function(data) {
                data = jQuery.parseJSON(xml2json(data).replace("undefined", ''))
                console.log(data);
				
				
                var pIs = data.processInstances.processInstance
                //if there is only one instance (object) , convert it to an array
                if ((pIs != undefined)){
                    if (pIs.length == undefined){
                        pIs = [pIs]
                    }
                    var tasksHTML = ""
				
                    pIs.forEach(function(pi){
                        var wfName  = pi.processDefinitionId
                        var taskName = pi.task.name
                        tasksHTML += (wfName + ": " + taskName + "<br>")
                    });
                    $( "#availTasks").html(tasksHTML)
					
                }
				
				
				
			   
            },
            error:function(jqXHR, textStatus, errorThrown ){
                console.log("failure");
                console.log(errorThrown);
                console.log(jqXHR);
                console.log(textStatus);
            }
        });


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
            name: 'MITRE.SeamlessCommander.SmartCowData',
            onSuccess: function (response) {
                if(response.value) {
                    var data = OWF.Util.parseJson(response.value);
                    log("SmartCowData",response);
                }
            }
        });
            
            
        // Subscribe to channel
        OWF.Eventing.subscribe('org.mitre.seamlessc2commander.smartcow', function (sender, msg, channel) {
            log("SmartCow Message Recd",msg);
        });
    
        // -----------------------------------
        // Check for launch data
        // -----------------------------------
        var launchData = OWF.Launcher.getLaunchData();
        if (launchData != null) {
            log("Launch Data",launchData);
            var data = OWF.Util.parseJson(launchData);    
            if(data && data.user){
                this.SmartCowUser = data.user;
            }
        }

        log("Widget Ready");
        OWF.notifyWidgetReady();
    }
});


