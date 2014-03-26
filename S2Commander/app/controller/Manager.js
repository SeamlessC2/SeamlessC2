
Ext.define('SeamlessC2.controller.Manager', {
    extend: 'Ext.app.Controller',
    stores: ['Alerts','SystemWidgets'],
    models:['AlertsModel'],
    views: ['Manager.MainView','Manager.ToolbarView','Manager.ContentView','Manager.AlertsView'],
    
    onLaunch: function() {//fires after everything is loadedvar store =  this.getS2AlertsStore();
        var alerts =  this.getAlertsStore();
        alerts.load({
            callback: this.onAlertsStoreLoad,
            scope: this
        });
        log("SeamlessC2 Commander Launch Complete");
    },
    preInit:function(){
        //When the Dashboard is created and the page is redirected to this with the widget minimized. But a refresh fixes it.
        //So the dashboard_controller sets a value of new dashboard guid in user preference
        //if that value is there, then this widget refreshes page and clears the pref
        var st = this.getWidgetState();
        var ow= Ext.JSON.decode(OWF.getIframeId());        
        OWF.Preferences.getUserPreference(
        {
            namespace:OWF_NAMESPACE, 
            name:'guid',
            onSuccess:function(pref){
                log("Pref:",pref);
                st.getWidgetState({
                    callback: function(state) {
                        log("State:",state);
                        if(state.x<0 && window.parent.location.href.indexOf(pref.value) > 0){
                            OWF.Preferences.setUserPreference(
                            {
                                namespace:OWF_NAMESPACE,
                                name:'guid',
                                value:'',
                                onSuccess:function(pref){
                                    window.parent.location.reload(true);
                                },
                                onFailure:function(a){
                                    error("Set Preferences",a);
                                }
                            }
                            );
                        }
                         
                        if(!state.active){
                            st.activateWidget({
                                callback:function(isactivated){
                                    log("Widget Activated",isactivated);
                                }
                            });                 
                        }           
                    }
                });
            }, 
            onFailure:function(a){
                error("Set Preferences",a);
            }
        }); 
    },
    onTabSelection: function(idx,button) {
        log(" Tab Pressed: "+idx,button);        
        Ext.getCmp("content_view").layout.setActiveItem(idx);
    },
    
    init: function() {
        var self = this;
        this.preInit();
        this.dashboard_controller = this.getController('S2Dashboard');
        this.dashboard_controller.init();        
        this.datsource_controller = this.getController('S2Datasource');
        this.datsource_controller.init();
        this.tailor_controller = this.getController('Tailor');
        this.tailor_controller.init();
        this.smartcow_controller = this.getController('SmartCow');
        this.smartcow_controller.init();
        var listenerCfg = {
            'launch_widget':function(data){
                scope:self;
            self.launchWidgetCall(data)
                }
        };
        this.application.addListener(listenerCfg);
        
        // We listen for events on toolbar
        this.control({
            //'#dash_btn': {click: self.onButton},
            'toolbar_view button':{
                toolbar_tab_selected:this.onTabSelection
            }            
        });
            
        if(OWF.Util.isRunningInOWF()) {
            this.initOWF();
        }
        log("Initialized SeamlessC2 Commander");        
    },
    updateHeader:function(msg){
        OWF.Eventing.publish(OWF_NAMESPACE+'.S2Header',{html:msg});
    },
    
    //load in dynamic names for the dashboard menu
    onAlertsStoreLoad: function(records, operation, success) {
        var alerts_view = Ext.getCmp("alerts_view");
        var self = this;
        /*
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
       
        log("Alerts load",records);
    },
    alertSelectHandler :function(menuitem,success){
        log("AlertSelected "+success,menuitem);
    },
    updateOWFWidgetList:function(){
        var self = this;

        //get listing off all ozone widgets registered in the system
        //Launch Widget https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-Launcher-API
        OWF.Preferences.findWidgets({ //https://localhost:8443/owf/prefs/widget/listUserAndGroupWidgets
            searchParams: {
                widgetName: '' // show all  //widgetName:  "Channel Listener"  //universalName: 'org.owfgoss.owf.examples.NYSE', //defined in descriptor file
            },
            onSuccess: function(results) {
                var guid = null;
                log("#OWF widgets:"+results.length);
                if(results.length== 0){
                    log("No results");
                }else if(results.length== 1){
                    log("One Result: "+results[0].path);
                }else{
                    // for(var i=0;i<results.length;i++){log("Result: "+results[i].value.namespace,results[i]);};
                    log("system widgets",results);
                }
                self.updateStore(results);
            } ,
            onFailure: function(err,status){
                log("getOWFWidgetList error! Status Code: " + status
                    + ". Error message: " + err);
            }
        });
    },
    updateStore:function(widget_list){
        var self=this;
        var widget_store =  this.getSystemWidgetsStore();
        widget_store.removeAll();//clear the store
        
        //TODO handle non-local widgets
        var newlist = [];
        for(i in widget_list){
            var item = widget_list[i];
            var name = item.value.namespace;
            var guid = item.id;
            var src = item.value.smallIconUrl;
            var style = '';                    
            var isSystemWidget = false;
            var data={};
                    
            //first lets filter if necessary
            if(typeof(WIDGET_FILTER) == 'undefined' || WIDGET_FILTER.length==0 || WIDGET_FILTER.indexOf(name)>=0 ){//environment.js     
        
                if(item.value.url.indexOf("examples") == 0 || item.value.url.indexOf("admin") == 0 ){//local to owf
                    if(src.indexOf("http") < 0)//system widget
                        src = SYSTEM_WIDGET_DIR+src;
                    isSystemWidget = true;
                }
              
                if((isSystemWidget && SHOW_SYSTEM_WIDGETS) || !isSystemWidget){  //environment.js  
                  newlist.push([guid,name,src,item.value.description,item.value.path,style,data]);
                }
            }
        }                
        widget_store.add(newlist);//update teh store with the data
        log("Widget store updated: ", widget_store);
    },
    launchWidgetCall:function(data){
        var self=this;
        log("launch widget call:"+data.name);
        Ext.each(self.system_widgets,function(widget,id){
            if(widget.value.namespace == data.name){
                self.launchWidget(widget.id,data.name,data.data || {});
            }
        });
    },
    launchWidget:function(widget_guid,title,data,ret_funct){
        if(widget_guid != null){
            var dataString = OWF.Util.toString(data);
            OWF.Launcher.launch({
                guid: widget_guid,
                launchOnlyIfClosed: false,
                title: title,
                maximize:true,
                data: dataString
            }, function(response){
                log(response);
                var ow= Ext.JSON.decode(OWF.getIframeId());
                var guid = response.uniqueId;
                if(ret_funct) ret_funct(response);
            });
        }else{
            error("Launch Widget failed for guid:"+widget_guid,data);
        }
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
    initOWF:function(){
        this.updateOWFWidgetList(); // load the available widgets in system
            
        // -----------------------------------
        // Check for launch data
        // -----------------------------------
        var launchData = OWF.Launcher.getLaunchData();
        if (launchData != null) {
            log("Launch Data",launchData);
            var data = OWF.Util.parseJson(launchData);
        }


        // -----------------------------------
        // Retrieve saved state
        // -----------------------------------

        OWF.Preferences.getUserPreference({
            namespace:OWF_NAMESPACE ,
            name: OWF_NAMESPACE+'.S2Commander.widgetstate',
            onSuccess: function (response) {
                if(response.value) {
                    var data = OWF.Util.parseJson(response.value);
                }
            }
        });
            
            
        // -----------------------------------
        // Subscribe to channel
        // -----------------------------------
        OWF.Eventing.subscribe(OWF_EVENT_PREFIX +'S2commander', function (sender, msg, channel) {
            log("Widget Message Recd",msg);
        });


        // -----------------------------------
        // Setup receive intents
        // -----------------------------------
        // Registering for plot intent
        /* OWF.Intents.receive({
            action: 'plot',
            dataType: 'application/vnd.owf.sample.address'
        },function (sender, intent, msg) {
            Map.placeMarker(msg);
        });
        */


        // Registering for intent
        /*
        OWF.Intents.receive({
            action: 'navigate',
            dataType: 'application/vnd.owf.sample.addresses'
        },function (sender, intent, msg) {

            Map.getDirections(msg[0], msg[1]);

        });
         */




        // -----------------------------------
        // Add print button to widget chrome
        // -----------------------------------
        /*
        OWF.Chrome.insertHeaderButtons({
            items: [
                {
                    xtype: 'widgettool',
                    type: 'print',
                    itemId:'print',
                    tooltip:  {
                      text: 'Print Directions!'
                    },
                    handler: function(sender, data) {
                        Map.toggleMapPrintView();
                    }
                }
            ]
        });
*/



        // -----------------------------------
        // Clean up when widget closes
        // -----------------------------------

        var self = this;
        /* 
            this.widgetState = Ozone.state.WidgetState.getInstance({
                onStateEventReceived: function(sender, msg) {
                    var event = msg.eventName;
                    if(event === 'beforeclose') {
                         widgetState.removeStateEventOverrides({
                            event: [event],
                            callback: function() {
                              
                                OWF.Preferences.deleteUserPreference({
                                    namespace: OWF.getInstanceId(),
                                    name: 'widgetstate',
                                    onSuccess: function (response) {
                                        self.widgetState.closeWidget();
                                    }
                                });
                               
                            }
                        }); 

                    }
                    else if(event === 'activate' || event === 'show') {
                    // Map.el.style.display = 'block';
                    }
                    else if(event === 'hide') {
                    // Map.el.style.display = 'none';
                    }
                }
            });

            // override beforeclose event so that we can clean up
            // widget state data
            this.widgetState.addStateEventOverrides({
                events: ['beforeclose']
            });

            // listen for  activate and hide events so that we can
            // hide map object to fix a bug in Google Maps
            this.widgetState.addStateEventListeners({
                events: ['activate', 'hide', 'show']
            });

       */
        
        

        //   var st = this.getWidgetState();
        //   var ow= Ext.JSON.decode(OWF.getIframeId());

        /*    
        Ozone.eventing.getAllWidgets(function(widgetList){ //widgets on current frame
            log("WidgetList",widgetList);
            
           // var proxy = Ozone.eventing.importWidget(widgetList[1].id,function (prox) {
           //         var widget = proxy.sendMessage('{addr:null}');
                // widget.maximize();
                });
            
       // });*/
              
        log("Widget Ready");
        OWF.notifyWidgetReady();
    }
});
