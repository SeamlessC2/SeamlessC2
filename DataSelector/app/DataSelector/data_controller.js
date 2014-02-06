/*var data_controller = null;

owfdojo.addOnLoad(function() {
    OWF.ready(function(){
        dashboard_controller = new DashboardController();
        dashboard_controller.init();
    });
});
 */
DataController = function(){ 
    this.tailor_data_store = Ext.create('Ext.data.Store', {
        fields: [],//['name', 'Url','format'],
        data: []
    });
    this.selected_datasource = null;
    this.selection_listeners = [];
    this.LAUNCH_WIDGET_CONTROLLER = false;//launches the widget controller widget after selection
    this.OWF_channel = "org.mitre.seamlessc2commander.dataselector";
    log("Data Controller Created!");
}
DataController.prototype = {

    init:function(){
        var self=this;
        var st = this.getWidgetState();
        var ow= Ext.JSON.decode(OWF.getIframeId());
        OWF.Eventing.subscribe(this.OWF_channel, this.OWFChannelListener);
        //When the Dashboard is created and the page is redirected to this with the widget minimized. But a refresh fixes it.
        //So the dashboard_controller sets a value of new dashboard guid in user preference
        //if that value is there, then this widget refreshes page and clears the pref
        OWF.Preferences.getUserPreference(
        {
            namespace:'SeamlessC2.DashboardCreated', 
            name:'guid',
            onSuccess:function(pref){
                log("Pref:",pref);
                st.getWidgetState({
                    callback: function(state) {
                        log("State:",state);
                        if(state.x<0 && window.parent.location.href.indexOf(pref.value) > 0){
                            OWF.Preferences.setUserPreference(
                            {
                                namespace:'MITRE.DataSelector',
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
                            });      //owf-widget-debug.js line 20092                        
                        }           
                    }
                });
            }, 
            onFailure:function(a){
                error("Set Preferences",a);
            }
        }); 
       
        this.loadTailorData();
        log("Initialized Data Controller");
    },
    loadTailorData:function(){
        var self=this;
        Ext.Ajax.useDefaultXhrHeader = false; //for cross side scripting xxs http://stackoverflow.com/questions/10830334/ext-ajax-request-sending-options-request-cross-domain-when-jquery-ajax-sends-get
        Ext.Ajax.request({
            //withCredentials: true,
            //        useDefaultXhrHeader: false,
            url: TAILOR_8080_URL+"tailorcore/sources.json",//DATASOURCES_URL,//environment.js
            success: function(response){
                log("Tailor Response: ", response.responseText);
                var responseObject =  Ext.JSON.decode(response.responseText);
                self.tailor_data_store.add(responseObject);//update the store with the data
                log("Tailor store: ", self.tailor_data_store);
            },
            failure: function(response){
                error(url+ " DataSource FAILURE. Response: ", response);
            }
        });
    },    
    getTailorPanel: function(){
        var self= this;
        var tailorAddButton = Ext.create('Ext.button.Button', {
            //id: 'source_add_button'+sourceNumber,
            //class: 'add_button',
            text: 'Add',
            bodyStyle: 'padding: 10px;',
            //height: 20,
            width: 50,
            handler: function(button){
                var tf =  tailorForm.getComponent('tailor_combobox');
                var datasource = tf.getValue();
                //var store = tf.getStore();
                //var record = tf.findRecordByValue(tf.getValue());
                // var index = tf.getStore().indexOf(record);
                self.tailorSourceSelected(datasource);
            }
        });
        
        var combobox = Ext.create('Ext.form.ComboBox', {
            //fieldLabel: 'Choose State',
            id: "tailor_combobox",
            store: self.tailor_data_store,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            width: 205
        });
        
        var tailorForm = Ext.create('Ext.Panel', {
            width: 300,
            height: 110,
            layout: {
                type: 'vbox',
                align: 'center'
            },
            border: false,
            items: [
            {
                html: "<div class='sourcePanel'>Tailor Data Source</div>",
                bodyStyle: "background: #DFE9F6; border: 0px;"
            },
            combobox,
            tailorAddButton
            ]
        });
        
        return tailorForm;
    },    
    getURLPanel:function(){
        var self = this;
        var urlButton = Ext.create('Ext.button.Button', {
            //id: 'source_add_button'+sourceNumber,
            //class: 'add_button',
            text: 'Add',
            bodyStyle: 'padding: 10px;',
            //height: 20,
            width: 50,
            handler: function(){
                var tf =  urlPanel.getComponent('urlInput');
                var datasource = tf.getValue();
                self.urlSourceSelected(datasource);
            }
        });


        var urlPanel = Ext.create('Ext.Panel', {
            width: 300,
            height: 110,
            layout: {
                type: 'vbox',
                align: 'center'
            },
            border: false,
            items: [
            {
                html: "<div class='sourcePanel'>URL Data Source</div>",
                bodyStyle: "background: #DFE9F6; border: 0px;"
            },
            {
                xtype: 'textfield',
                id:'urlInput',
                name: 'urlInput',
                label: "Web Address",
                hideLabel: 'true',
                //height: 40,
                width: 200
            },
            urlButton
            ]
        });

        
        return urlPanel;
    },
    
    getNoSourcePanel:function(){
        var self = this;
        var noSourceButton = Ext.create('Ext.button.Button', {
            id: 'nosource_add_button',
            text: 'Add',
            bodyStyle: 'padding: 10px;',
            //height: 20,
            width: 50,
            handler: function(){
                self.noSourceSelected();
            }
        });


        var noSourcePanel = Ext.create('Ext.Panel', {
            width: 300,
            height: 80,
            layout: {
                type: 'vbox',
                align: 'center'
            },
            border: false,
            items: [
            {
                html: "<div class='sourcePanel'>No Source</div>",
                bodyStyle: "background: #DFE9F6; border: 0px;"
            },            
            noSourceButton
            ]
        });

        
        return noSourcePanel;
    },
    //the main panel
    getSelectionPanel:function(){
        var self=this;
        var tailor_panel =this.getTailorPanel();
        var url_panel = this.getURLPanel();
        var noSourcePanel = this.getNoSourcePanel();
       
        
        var source_choice = Ext.create('Ext.Panel', {
            id: "source_choice1",
            width:300,
            height:400,
            layout: {                
                type: 'vbox',
                align: 'center'
            },
            border: false,
            defaults: {
                cls: 'round-corners'
            },
            items: [            
            tailor_panel,            
            {
                html: "or",
                style: "text-align: center",
                border: false
            },
            url_panel,            
            {
                html: "or",
                style: "text-align: center",
                border: false
            },
            noSourcePanel
            ]
        });
        
        var main_panel = Ext.create('Ext.Panel', {
            id: "source_choice",
            width:400,
            height:400,
            border: false,
            defaults: {
                cls: 'round-corners'
            },
            flex: 1,
            //autoScroll:true,
            items: [source_choice
            ]
        });
        return main_panel;
    },
    
    tailorSourceSelected:function(data_source){
        this.selected_datasource = {
            type:'source',
            source:'tailor',
            value:data_source
        };
        this.notify(this.selected_datasource);
              
        var url = TAILOR_8080_URL+"tailorcore/recommendations.json";
        log("TAILOR Selected Datasource: ",data_source);
        log("Making request for Tailor to "+url);
        var params = {
            activityType: "Monitoring",
            dataSource: data_source
        };
        this.getRecommendationsAJAX(url,params,this.processRecommendationsCallback);
    },
    
    urlSourceSelected:function(input_url){
        log("url input value: ", input_url);
        
        this.selected_datasource = {
            type:'source',
            source:'url',
            value:input_url
        };
        this.notify(this.selected_datasource);
        
      
        if (input_url.length > 0){
            log("making Url Data Source request: "+input_url);
            var params={};
            this.getRecommendationsAJAX(input_url,params,this.processRecommendationsCallback);
        }else{//EMPTY
            this.noSourceSelected();
        }
    },
    noSourceSelected:function(){
       this.selected_datasource = {
            type:'source',
            source:'nosource',
            value:null
        };
        this.notify(this.selected_datasource);
        
        if(this.LAUNCH_WIDGET_CONTROLLER){
            this.generateWidgetSelector([]);
        }
    },
   
    
    getRecommendationsAJAX:function(url,params,callback){
        log("AJAX Call:"+url);
        var self=this;
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
                    callback(self,data);
                };
            }
        });
    },

    processRecommendationsCallback:function(self,data){        
        //see if there are any recommendations
        var widget_recommendations =[];
        var recs = data["visRecommendations"];
        log("visRecommendations",recs);
        if(typeof(recs) !== 'undefined' && recs != null && recs.length>0){
            //remodel        
            for (i in recs){
                var rec = recs[i];
                log("Recommendation", rec);
                widget_recommendations.push({
                    name:rec.widget_name,
                    data:rec
                });
            }
        }        
        self.notifySelectionListeners({source:self.selected_datasource,widget_recommendations:widget_recommendations});
        if(self.LAUNCH_WIDGET_CONTROLLER){
            self.generateWidgetSelector(widget_recommendations,data);
        }
    },
    
    //launches the Widget Selector Widget with the data
    generateWidgetSelector:function(widget_recommendations,data,ret_funct){
        var self=this;
        var data = data || {};
        var ret_funct = ret_funct || function(response){
            log("Default return funct:",response);
        };
        //spawn the widget selector  
        log("Launching Widget Selector",widget_recommendations);
        OWF.Preferences.findWidgets({ //https://localhost:8443/owf/prefs/widget/listUserAndGroupWidgets
            searchParams: {
                widgetName: WIDGET_SELECTOR_NAME
            },
            onSuccess: function(results) {
                log("#OWF widgets:"+results.length);
                if(results.length== 0){
                    log("No results for widget search:"+WIDGET_SELECTOR_NAME);
                    throw("No widget found: "+WIDGET_SELECTOR_NAME);
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
                var dataString = OWF.Util.toString({
                    "recommendations":widget_recommendations,
                    "data_source_data":data
                });
                
                OWF.Launcher.launch({
                    guid: guid,
                    launchOnlyIfClosed: false,
                    data: dataString
                }, function(widget_info){
                    log(widget_info);
                    ret_funct(widget_info);
                });
            } ,
            onFailure: function(err,status){
                error("Widget not found:"+WIDGET_SELECTOR_NAME,err);
            }
        });
      
    },
    notify:function(data){//{type:'source',source:'tailor',value:data_source}
        if(OWF.Util.isRunningInOWF())
            OWF.Eventing.publish(this.OWF_channel, data);      
    },
    addSelectionListeners:function(listener){
        this.selection_listeners.push(listener);
    },
    notifySelectionListeners:function(data){//{source:self.selected_datasource,widget_recommendations:widget_recommendations}
        for(i in this.selection_listeners){
            var listener = this.selection_listeners[i];
            listener(data);
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
    OWFChannelListener:function(sender, msg){               
        log("msg rec'd:"+msg);
        if(msg && msg.command){
            if(msg.command=='close'){
                this.close();
            }
        }
    },
    close:function(){
        this.getWidgetState().closeWidget();
    }
}
