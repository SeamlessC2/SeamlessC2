Ext.define('SeamlessC2.controller.SmartCow', {
    extend: 'Ext.app.Controller',
    stores: ['SmartCowTasks'],
    models:['SmartCowProcessInstanceModel','SmartCowTaskModel','SmartCowVariablesModel','SmartCowVariableModel'],
    views: ['SmartCow.ProcessInstCard','SmartCow.TaskView'],
    
    //fields
    SmartCowUser:null,
    SmartCowAuth:null,
    SmartCowTaskData:{},
    SmartCowUserTaskStores:[],
    
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
        
        if(this.SmartCowUser != null){
            //store.proxy.api.read=SMARTCOW_PROC_INSTANCES+".json?";//SMARTCOW_USER_PROC_INSTANCES+this.SmartCowUser;
            store.proxy.api.read=SMARTCOW_USER_PROC_INSTANCES+this.SmartCowUser;
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
        var self=this;
        var store =  this.getSmartCowTasksStore();
        log("SmartCOW Store load",records);
        if(records.length > 0){
            var view = Ext.getCmp('smart_cow_proc_inst_card');
        
            Ext.each(store.getRange(), function (record, idx, a) {
                if(record != null ){   
                    Ext.each(record.raw.task, function (task,arr_idx) {
                        if(task.variables){
                            Ext.each(task.variables.variable, function (va, idx2,a) {
                                if(va.name == 'Additional Info 1'){
                                    task.owf_url = va.value;
                                }
                            });
                        }
                    });
                    var taskstore = Ext.create('Ext.data.Store', {
                        id:'smart_cow_tasks_store_'+idx,
                        model: 'SeamlessC2.model.SmartCowTaskModel',
                        data: record.raw.task
                    });
                    self.SmartCowUserTaskStores.push(taskstore);
               
                    var taskview = Ext.create('SeamlessC2.view.SmartCow.TaskView',
                    {
                        title:record.get('key'),                   
                        id:'smart_cow_tasks_view_'+idx,
                        height:300,
                        items: {       
                            xtype: 'dataview',
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="smart-cow-item" id="smart-cow-item_{id}">',
                                '   <div class="smart-cow-title">{name}   Id:{id}</div>',   
                                '   <div class="smart-cow-task-state">State:{state}</div>',                            
                                '   <div class="smart-cow-task-description">{description}</div>',
                                '   <div class="smart-cow-footer">',
                                '       <a href="'+SMARTCOW_URL+'tasks/active/{id}" target="_blank">More info</a>',
                                '<tpl if="owf_url != undefined"><div class="smart-cow-task-go" id="smart-cow-task-go-{id}"><a id="smart-cow-task-go-href_{id}" href="{owf_url}" target="_blank">Go</a></div></tpl>',
                                '       <div class="smart-cow-task-assigned" id="smart-cow-task-assigned-{id}" >Assign</div>',
                                '<div class="smart-cow-date">{duedate:date("F j, Y, g:i a")}</div>',  
                                '   </div>', 
                                '<div class="smart-cow-assign" id="smart-cow-assign_{id}" >',
                                '<div id="smart-cow-assign-title_{id}"></div>',
                                '<ul id="smart-cow-assign-ul_{id}"></ul>',
                                '</div>',
                                '</div></tpl>'
                                ),
                            listeners: {
                                el: {
                                    click: function(cmp){
                                        scope:self;
                                    self.onAssignClick(cmp);
                                    },
                                    delegate: '.smart-cow-task-assigned'
                                }
                            },
                            itemSelector: 'div.smart-cow-task-item',
                            store:taskstore                        
                        }
                    });
                    view.add(taskview);      
                }
            });
            var layout = view.getLayout();           
            layout.setActiveItem(0);
            var next = layout.getNext();
            Ext.getCmp('smart_cow_proc_inst_card_move_next').setDisabled(!layout.getNext());
        }
    },
    onAssignClick: function(cmp) {
        var id = cmp.target.id.substring(cmp.target.id.lastIndexOf("-")+1,cmp.target.id.length);
        Ext.get("smart-cow-assign")
        var ass = Ext.get("smart-cow-assign-title_"+id);
        ass.update("Assign the following dashboards:");
        
        var assul = Ext.get("smart-cow-assign-ul_"+id);       
        var s2dash = this.getController("S2Dashboard");
        var html = '';
        Ext.each(s2dash.dashboards,function(dash,idx){
            html += '<li class="assign_dash_li" guid="'+dash.guid+'">'+dash.name+'</li>';
        });
        assul.update(html);
        Ext.select(".assign_dash_li").on('click', function(cmp,ele){
            var guid = ele.getAttribute("guid");
         
            var url = SMARTCOW_TASKS+id+".json?";
            //store it
            Ext.Ajax.request({
                url: url,
                method: 'GET',          
                headers: {
                    'Content-Type': 'application/json'
                },
                //waitTitle: 'Connecting',
                //waitMsg: 'Sending data...',                                     
                //params: data,
                scope:this,
                jsonData: {},
                success:  function(res){
                    log('assign get ok',res);
                    var task = Ext.JSON.decode(res.responseText);
                    task.variables.variable[0].name="test1";
                    var data = JSON.stringify(task);
                    Ext.Ajax.request({
                        url: url,
                        method: 'POST',          
                        //waitTitle: 'Connecting',
                        //waitMsg: 'Sending data...',                                     
                        params: data,
                        scope:this,
                        success:  function(res){
                            log('assign ok');
                        },                                   
                        failure: function(res){
                            log('assign failure');
                        }
                    });
                    //TODO move to success
                    ass.update('Updated!');
                    assul.update('');
                    var href = Ext.get("smart-cow-task-go-href_"+id);
                    //TODO update href
                },                                   
                failure: function(){
                    log('assign failure');
                }
            });
        });
        log("assign target click",cmp);
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
            namespace: OWF_NAMESPACE,
            name: OWF_NAMESPACE+'.SmartCowData',
            onSuccess: function (response) {
                if(response.value) {
                    var data = OWF.Util.parseJson(response.value);
                    if(data.user){
                        self.SmartCowUser = data.user;
                    }
                    if(data.auth){
                        self.SmartCowAuth = data.auth;
                    }
                    if(data.task_data){
                        self.SmartCowTaskData = data.task_data;
                    }
                    log("SmartCowData",response);
                    self.loadStore();
                }else{
                    self.getUserAndPwd();
                }               
            }            
        });
                        
        // Subscribe to channel
        OWF.Eventing.subscribe(OWF_NAMESPACE+'.smartcow', function (sender, msg, channel) {
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
                        var auth = window.btoa(userText+":"+pwdText); //(unescape(encodeURIComponent(username+":"+pwd)));
                        self.SmartCowUser = userText;
                        self.SmartCowAuth = auth;
                        self.savePreferences();
                    }
                });
            }
        });
    },
    savePreferences:function(){       
        var self=this;
        log("SmartCow Save Preferences",self.SmartCowUser+"  "+self.SmartCowAuth);
        //save in prefs
        OWF.Preferences.setUserPreference({
            namespace:OWF_NAMESPACE,
            name: OWF_NAMESPACE+'.SmartCowData',
            value: Ext.JSON.encode( {
                user:self.SmartCowUser,
                auth:self.SmartCowAuth,
                task_data:self.SmartCowTaskData
            } ),
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


