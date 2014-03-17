Ext.define('SeamlessC2.controller.SmartCow', {
    extend: 'Ext.app.Controller',
    stores: ['SmartCowTasks'],
    models:['SmartCowProcessInstanceModel','SmartCowTaskModel','SmartCowVariablesModel','SmartCowVariableModel'],
    views: ['SmartCow.TasksView'],
    
    //fields
    SmartCowUser:null,//passed in on widget
    
    onLaunch: function() {//fires after everything is loaded
        log("SmartCow Controller Launch Complete");                
    },
    
    init: function() {           
        if(OWF.Util.isRunningInOWF()) {
            this.initOWF();
        }
        log("Initialized SmartCow Controller");
    },
    loadStore:function(){
        var store =  this.getSmartCowTasksStore();
        
        //this.SmartCowUser= "bdoyle";//TODO remove
       // this.SmartCowAuth= "YmRveWxlOmJyaWFu";//TODO remove
        if(this.SmartCowUser != null){
            store.proxy.api.read=store.proxy.api.read+this.SmartCowUser;
        }
        if(this.SmartCowAuth != null){
            store.proxy.headers ={
                Authorization: "Basic "+this.SmartCowAuth // decodeURIComponent(escape(window.atob(this.SmartCowAuth)))
            };
            store.load({
                callback: this.onStoreLoad, 
                scope: this
            });
        }
    },
    //load in dynamic names for the dashboard menu
    onStoreLoad: function(records, operation, success) {
        var store =  this.getSmartCowTasksStore();
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
                log(data);
				
				
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
                    $( "#availTasks").html(tasksHTML);					
                }
            },
            error:function(jqXHR, textStatus, errorThrown ){
                log("failure");
                log(errorThrown);
                log(jqXHR);
                log(textStatus);
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
        var self = this;
        // Retrieve saved state
        OWF.Preferences.getUserPreference({
            namespace: "MITRESeamlessC2",
            name: 'MITRE.SeamlessCommander.SmartCowData',
            onSuccess: function (response) {
                if(response.value) {
                    var data = OWF.Util.parseJson(response.value);
                    if(data.user){
                        self.SmartCowUser = data.user;
                    }
                    if(data.auth){
                        self.SmartCowAuth = data.auth;
                    }
                    log("SmartCowData",response);
                    self.loadStore();
                }else{
                    self.getUserAndPwd();
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
    },
    getUserAndPwd:function(){
        var self = this;
        Ext.Msg.prompt('SmartCow Credentials', "Enter your SmartCow Username: ", function(btnTxt,
            userText) {
            if (btnTxt == 'ok') {
                Ext.Msg.prompt('SmartCow Credentials', "Enter your SmartCow Password: ", function(btnTxt,
                    pwdText) {
                    if (btnTxt == 'ok') {
                        self.saveUserAndPwd(userText,pwdText);
                    }
                });
            }
        });
    },
    saveUserAndPwd:function(username,pwd){
        var auth = window.btoa(username+":"+pwd); //(unescape(encodeURIComponent(username+":"+pwd)));
        this.SmartCowUser = username;
        this.SmartCowAuth = auth;
        var self=this;
        log("SmartCow Save auth",username+"  "+auth);
        //save in prefs
        OWF.Preferences.setUserPreference({
            namespace:"MITRESeamlessC2",
            name: 'MITRE.SeamlessCommander.SmartCowData',
            value: Ext.JSON.encode( {user:username,auth:auth} ),
            onSuccess: function () {
                log("Save to prefs ok",arguments);
                self.loadStore();
            },
            onFailure: function () {
                error("Save to prefs error",arguments)
            }
        });
        
    }
});


