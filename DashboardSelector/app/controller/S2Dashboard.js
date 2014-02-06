Ext.define('DashboardSelector.controller.S2Dashboard', {
    extend: 'Ext.app.Controller',
    stores: ['S2Dashboard'],
    models:['S2DashboardModel'],
    views: ['MainView','DashPickerView'],
    
    //fields
    dashboards:[], // stored in preferences and loaded
   
    onLaunch: function() {//fires after everything is loaded
        //handle the load of the dashboards
        this.loadDashboardStore();
        log("Dashboard Controller Launch Complete");
    },
    
    init: function() {        
        var self=this;
        
        //listen for events
        
        this.control({
            'dashpicker_view': {
                itemclick: self.dashboardSelectHandler
            },
            '#dashpicker_createbtn': { //wire up the btn to this controller
                click: self.createDashboard //self.launchDashboardCreator  
            }
        });
        if(OWF.Util.isRunningInOWF()) {           
            // Retrieve saved state
            OWF.Preferences.getUserPreference({
                namespace: "MITRESeamlessC2",
                name: 'MITRE.SeamlessCommander.DashboardData',
                onSuccess: function (response) {
                    if(response.value) {
                        var data = OWF.Util.parseJson(response.value);
                        log("User Prefs - MITRE.SeamlessCommander.DashboardData",response);
                    }
                }
            });
            // Subscribe to channel
            OWF.Eventing.subscribe('org.mitre.seamlessc2commander.dashboard', function (sender, msg, channel) {
                log("Dashboard Message Recd",msg);
            });
        }       
        
        log("Initialized Dashboard Controller");    
    },
    loadDashboardStore:function(){
        var self=this;
        var onFailure = function(error) {
            error(error);
        };   
        //load existing dashboards in the system
        var onSuccess = function(obj) {//obj.success obj.results obj.data
            var existing_dashs = obj.data;
            log("OWF Dashboards", existing_dashs);
            
            //get the user list of dashboards this manages
            OWF.Preferences.getUserPreference({
                namespace: "MITRESeamlessC2",
                name: 'MITRE.SeamlessCommander.dashboards',
                onSuccess:function(response){   
                    var newdashs = []; 
                    if(response && response.value){//may be empty or not created
                        //need to remove those dashboards that  may have been removed
                        var user_dashs = OWF.Util.parseJson(response.value); //in user preferences               
                    
                        //see if current dashboard is in prefs
                        for (var i = 0; i < existing_dashs.length; i++) {
                            var exist_dash_guid = existing_dashs[i].guid;
                            for(var j=0;j<user_dashs.length;j++){
                                var user_dash_guid = user_dashs[j].guid;
                                if(user_dash_guid == exist_dash_guid)
                                    newdashs.push(user_dashs[j]);
                            }
                        }                       
                    }
                    self.onS2DashboardStoreLoadFromPrefs(newdashs,self);                    
                } ,
                onFailure:onFailure
            });
            
        };           
                
        Ozone.pref.PrefServer.findDashboards({
            onSuccess:onSuccess,
            onFailure:onFailure
        });
        
        Ozone.pref.PrefServer.getDashboard({
            dashboardId:"f4a334dc-e334-46b5-af0b-e0e69ae359db",
            onSuccess:function(results) {
                self.dashboard = results;
            },
            onFailure:function(results) {
                log("Failure",results);
            }
        });
    },
    createDashboard:function(){
        
        var self=this;
        
        OWF.Preferences.findWidgets({ //https://localhost:8443/owf/prefs/widget/listUserAndGroupWidgets
            searchParams: {
                widgetName: "SeamlessC2" 
            },
            onSuccess: function(results) {
                log("#OWF widgets:"+results.length);
                if(results.length== 0){
                    error("Widget Not Found:" + DATA_SELECTOR_WIDGET_NAME);
                    
                }else if(results.length== 1){
                    log("One Result: ",results[0]);
                    var widget = results[0];
                    
                    var data_select_widget_template = [{
                        "universalName": "MITRE.CIV",
                        "widgetGuid": "59e8803a-d9fc-f841-5ee2-89596c347bde",
                        //  "uniqueId": "da2d2cb1-b427-b842-7802-0bfdef5a5bb2",
                        //   "dashboardGuid": "f4a334dc-e334-46b5-af0b-e0e69ae359db",
                        //    "paneGuid": "28178474-8dea-b000-9348-d6c2d249c7ef",
                        "name": "MITRE.CIV-nvd3.barGraph",
                        "active": false,
                        "x": 0,
                        "y": 101,
                        "minimized": false,
                        "maximized": false,
                        "pinned": false,
                        "collapsed": false,
                        "columnPos": 0,
                        "buttonId": null,
                        "buttonOpened": false,
                        "region": "none",
                        "statePosition": 2,
                        "intentConfig": null,
                        "singleton": false,
                        "floatingWidget": false,
                        "background": false,
                        "zIndex": 19000,
                        "height": 716,
                        "width": "100%"
                    },{
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
                        "width": "100%",
                        "height": 100                        
                    }];
                    var guid ={};
                    guid['width']= "100%"; //NEW_DASHBOARD_SIZE.width;// "100%";//maximize window - this maximizes the widget to fill its window
                    guid['height'] = 100;//NEW_DASHBOARD_SIZE.height;//"100%"; //maximize window
                    guid['x'] = 0;
                    guid['y'] = 0;
                    guid.timestamp = new Date().getTime();                    
                    
                    var widgetStates ={};
                    widgetStates[widget.id] = guid;
                    // second one
                    widgetStates["59e8803a-d9fc-f841-5ee2-89596c347bde"] = {
                        'width':'100%',
                        'height':700,
                        'x':0,
                        'y':101,
                        timestamp:new Date().getTime()
                        }
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
                        "widgets": data_select_widget_template,
                        "defaultSettings": data_select_widget_default_settings            
                    };
    
                    var generatedGUID = OWF.Util.guid();
        
                    //once created reload page to new location (i.e the new dashboard)
                    var success_funct =  function(d){
            
                        var url= OWF.getContainerUrl()+"/#guid=" + generatedGUID;
                        log("New Dashboard URL:"+url);
                       
                        OWF.Preferences.setUserPreference(
                        {
                            namespace:'SeamlessC2.DashboardCreated',
                            name:'guid',
                            value:generatedGUID,
                            onSuccess:function(pref){
                                log("Set Preferences",pref);
                                window.open(url,'_blank' );// <- This is what makes it open in a new window.            
                            //window.parent.location.href= url ;
                            //window.parent.location.reload(true);
                            },
                            onFailure:function(a){
                                error("Set Preferences",a);
                            }
                        }
                        );         
                    }
                    
                    //modify some parameters for the layout
                    var params = {
                        alteredByAdmin: false,
                        // isGroupDashboard: false,
                        //layout: 'desktop',
                        groups: [],
                        isdefault: false,
                        name: "Seamless C2 Dashboard "+generatedGUID,
                        //columnCount: 0,
                        locked:false,
                        //defaultSettings: {},
                        description: 'Automatically generated S2 dashboard -'+generatedGUID,
                        guid: generatedGUID,
                        layoutConfig: basicConfig
                    };
        
                    //create the dashboard
                    OWF.Preferences.createOrUpdateDashboard({
                        json: params,
                        saveAsNew: true,
                        onSuccess: success_funct,
                        onFailure: function(error) {
                            log("dashboard create failure: ", error);
                        },
                        async: true
                    });
                //self.updateDashboardModels(results[0]); // located in dashboard_layouts.js 
                }
            } ,
            onFailure: function(err,status){
                error("findWidgets error! Status Code: " + status
                    + ". Error message: " + err);  
                
            }
        });
        
    },
    //launches the Widget Selector Widget with the data
    launchDashboardCreator:function(){       
        var self=this;
        var ret_funct = ret_funct || function(response){
            log("Default return funct:",response);
        };
        //spawn the widget selector  
        log("Launching Dashboard Creator",DASHBOARDMAKER_WIDGET);
        OWF.Preferences.findWidgets({ //https://localhost:8443/owf/prefs/widget/listUserAndGroupWidgets
            searchParams: {
                widgetName: DASHBOARDMAKER_WIDGET
            },
            onSuccess: function(results) {
                log("#OWF widgets:"+results.length);
                if(results.length== 0){
                    log("No results for widget search:"+DASHBOARDMAKER_WIDGET);
                    error("No widget found: "+DASHBOARDMAKER_WIDGET);
                    return;
                }else if(results.length== 1){
                    log("One Result: "+results[0].path);                    
                }else{
                    for(var i=0;i<results.length;i++){
                        log("Results: "+results[i].value.namespace,results[i]);
                    };
                }
                var widget = results[0];
                
                //launch the widget
                var guid = widget.id;
                var dataString = OWF.Util.toString({});
                
                OWF.Launcher.launch({
                    guid: guid,
                    launchOnlyIfClosed: false,
                    data: dataString
                }, function(widget_info){
                    log(widget_info);
                    self.close();
                    ret_funct(widget_info);
                });
            } ,
            onFailure: function(err,status){
                error("Widget not found:"+DASHBOARDMAKER_WIDGET,err);
            }
        });
      
    },
    onS2DashboardStoreLoadFromPrefs:function (dashboards,self) {
        var dashguid = window.parent.location.href.replace(OWF.getContainerUrl()+"/#guid=","");
        if(dashboards) {
            
            self.dashboards = dashboards;            
            //see if current dashboard is in prefs
            var found=false;
            for(var i=0;i<dashboards.length;i++){
                var dash = dashboards[i];
                if(dash.guid == dashguid) found =true;
            }
            if(!found){
                //get the dashboard info
                self.dashboards.push({
                    name:window.parent.document.title,
                    guid:dashguid
                });
                self.saveDashboardToPrefs();//add to the list
            }
        }else{
            log("No dashboards in user preferences");           
            self.dashboards.push({
                name:window.parent.document.title,
                guid:dashguid
            });
            self.saveDashboardToPrefs();
        }
        
        //add to store
        Ext.each(self.dashboards,function(item,id){
            log("Record:",item);
            var d = Ext.create('DashboardSelector.model.S2DashboardModel', item);
            self.getS2DashboardStore().add(d);
        });
    //var comp = Ext.getCmp("dashpicker_view");
    
    //this.onS2DashboardStoreLoad(store.data.items);
    },
    //they selected a view in the dashboard view
    
    dashboardSelectHandler :function(view, record, row, index, e, eOpts ){
        log('dashboard selected',record);
        
        //they selected a different dashboard, store some config info then relocate
        if(record.data && record.data.name){
            var url= OWF.getContainerUrl()+"/#guid=" + record.data.guid;
            log("New Dashboard URL:"+url);
            OWF.Preferences.setUserPreference(
            {
                namespace:'MITRESeamlessC2',
                name:'MITRE.SeamlessCommander.previousDashboard',
                value:record.data.guid,
                onSuccess:function(pref){
                    log("Set Preferences",pref);
                    //Ext.MessageBox.confirm('Confirm', 'Are you sure ?', function(btn){
                    //  if(btn === 'yes'){
                    
                    window.parent.location.href= url ;
                    window.parent.location.reload(true);                                      
                },
                onFailure:function(a){
                    error("Set Preferences Error",a);
                }
            }
            );   
        }
    },
    saveDashboardToPrefs: function () {
        OWF.Preferences.setUserPreference({
            namespace:"MITRESeamlessC2",
            name: 'MITRE.SeamlessCommander.dashboards',
            value: OWF.Util.toString( this.dashboards ),
            onSuccess: function () {
                log("Save to prefs ok",arguments);
            },
            onFailure: function () {
                error("Save to prefs error",arguments)
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
    }
});


