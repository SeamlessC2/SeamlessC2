
WidgetController = function(){
    this.widget_store = Ext.create('Ext.data.ArrayStore', {
        fields: [
        {
            name:'guid'
        },


        {
            name: 'name'
        },

        {
            name: 'icon'
        },

        {
            name: 'description'
        },
        {
            name: 'path'
        },
        {
            name: 'style'
        },
        {
            name: 'data'
        }
            
        ],
        data: []
    });
    this.selected_widget=null;
    this.widget_recommendations=[];//array of string widget names "WidgetSelector","Channel Shouter"
    this.selection_listeners = [];
    this.data_source_data = {};
    this.system_widgets = [];
    this.show_system_widgets = SHOW_SYSTEM_WIDGETS ;//environment.js
    this.CLOSE_AFTER_SELECTION=false;
    this.launchConfig = OWF.Launcher.getLaunchData();//https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-Launcher-API
    this.OWF_channel = "org.mitre.seamlessc2commander.widgetselector";
    log("Widget Controller Created!");
}
WidgetController.prototype = {

    init:function(){
        //this.showWidgetInfo();
        
        log("Initializing Widget Controller");       
        //get launch configurations       
        if(this.launchConfig != null) {                 
            var launchConfigJson = OWF.Util.parseJson(this.launchConfig);
            log("LaunchConfig",launchConfigJson);
            if(launchConfigJson.channel){
                this.OWF_channel = launchConfigJson.channel;
                log("Subscribing to : "+this.OWF_channel);
            }
            if(launchConfigJson.recommendations){
                this.widget_recommendations = launchConfigJson.recommendations;  
                log("launchConfig Recommendations",this.widget_recommendations);
            }
            if(launchConfigJson.data_source_data){
                this.data_source_data = launchConfigJson.data_source_data;
                log("launchConfig data_source_data", launchConfigJson.data_source_data);
            //Ozone.util.ErrorDlg.show(OWF.Util.toString(this.data_source_data),400,500);
            }
        }
        
        this.updateOWFWidgetList(); // load the available widgets in system
        
        OWF.Eventing.subscribe(this.OWF_channel, this.OWFChannelListener);
    },
    
    getWidget:function(widget_name){
        for(var i=0;i<this.widget_list.length;i++){
            var widget = this.widget_list[i];
            if(widget.value.namespace == widget_name){
                return widget;
            }
        }
        return null;
    },

    updateStore:function(data_source_data,widget_list){
        var self=this;
        var widget_list = widget_list || self.system_widgets;
        var data_source = data_source_data || self.data_source_data;
        
        self.widget_store.removeAll();//clear the store
        
        //TODO handle non-local widgets
        var newlist = [];
        for(i in widget_list){
            var item = widget_list[i];
            var name = item.value.namespace;
            var guid = item.id;
            var src = item.value.smallIconUrl;
            var style = '';                    
            var isSystem = false;
            var data=data_source;
                    
            //first lets filter if necessary
            if(typeof(WIDGET_FILTER) == 'undefined' || WIDGET_FILTER.length==0 || WIDGET_FILTER.indexOf(name)>=0 ){//environment.js            
        
                if(item.value.url.indexOf("examples") == 0 || item.value.url.indexOf("admin") == 0 ){//local to owf
                    if(src.indexOf("http") < 0)//system widget
                        src = "../owf/"+src;
                    isSystem = true;
                }
              
                //only show system widget if flag
                if(!isSystem || (isSystem && self.show_system_widgets)){    
                    var pushed=false;
                    //handle recommendations
                    if(self.widget_recommendations.length > 0){
                        for(i in self.widget_recommendations){
                            var rec_widget = self.widget_recommendations[i];
                            if(rec_widget.name == name){
                                style='widget_recommended';
                                data = rec_widget.data;
                                //TODO HARDCODED
                                //need to make special arrangements for MITRE.CIV which has 'sub' widgets inside it
                                if(name == "MITRE.CIV"){
                                    var newname = name +"-"+data.visualizationProperties.visualizationId;
                                    newlist.push([guid,newname,src,item.value.description,item.value.path,style,data]);
                                    pushed=true;
                                }
                            }
                        }
                    }      
                    if(!pushed)
                        newlist.push([guid,name,src,item.value.description,item.value.path,style,data]);
                }
            }
        }                
        self.widget_store.add(newlist);//update teh store with the data
        //log("Widget store: ", self.widget_store);
    },
    updateOWFWidgetList:function(){
        var self = this;
                
        //Launch Widget https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-Launcher-API
        OWF.Preferences.findWidgets({ //https://localhost:8443/owf/prefs/widget/listUserAndGroupWidgets
            searchParams: {
                widgetName: '' // show all
            //widgetName:  "Channel Listener"
            //universalName: 'org.owfgoss.owf.examples.NYSE', //defined in descriptor file
            },
            onSuccess: function(results) {
                var guid = null;
                log("#OWF widgets:"+results.length);
                if(results.length== 0){
                    log("No results");
                }else if(results.length== 1){
                    log("One Result: "+results[0].path);

                }else{
                    for(var i=0;i<results.length;i++){
                        log("Result: "+results[i].value.namespace,results[i]);
                    };
                }
                self.system_widgets = results;
                self.updateStore({},results);                
               
            } ,
            onFailure: function(err,status){
                log("getOWFWidgetList error! Status Code: " + status
                    + ". Error message: " + err);
            }
        });
    },
    
    //fires after widget is/are selected
    onWidgetsSelected:function(widget){
        log("Launching widget:"+widget.name,widget); 
        this.notifySelectionListeners();                    
        var ret_funct = function(wid){
            log("widget launched",wid);
        };
        this.launchWidget(widget.guid, widget.name, widget.data,ret_funct);
              
        if(this.CLOSE_AFTER_SELECTION)
            this.close();
    },
    notify:function(data){//{type:'source',source:'tailor',value:data_source}
        if(OWF.Util.isRunningInOWF())
            OWF.Eventing.publish(this.OWF_channel,data );      
    },
    getWidgetDataView:function(data){
        var self=this;
        if(typeof(data) === 'undefined' || data == null)
            data = this.widget_store;
        var imageTpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="widget widget_data_view {style}" id="widget_{guid}" tabindex="0" >',
            '   <div class="thumb-wrap" id="widget_thumb_{guid}">',
            '       <img src="{icon}" class="thumb" id="widget_img_{guid}">',
            '   </div>',
            '   <div class="thumb-text" id="widget_text_{guid}">{name}</div>',
            '</div>',
            '</tpl>'
            );

        var widgetPanel = Ext.create('Ext.view.View', {
            store: data,
            tpl: imageTpl,
            itemSelector: 'div.thumb-wrap',
            emptyText: 'No images available',
            multiSelect: false,
            listeners: {
                selectionchange: function(dv, nodes ){                    
                    self.selected_widget = nodes[0].data;
                    log("Widget Selected:"+self.selected_widget.name,self.selected_widget);
                    self.onWidgetsSelected(self.selected_widget);
                }
            }
        });
        
        return widgetPanel;
    },

    getWidgetGridView:function(){
        var pan1 = Ext.create('Ext.grid.Panel', {
            store: this.getWidgetStore(),
            width: 400,
            height: 200,
            title: 'Widgets',
            columns: [
            {
                header: 'Name',
                width: 100,
                sortable: false,
                hideable: false,
                dataIndex: 'name'
            },
            {
                header: 'Image',
                width: 150,
                dataIndex: 'icon',
                renderer: function(value){
                    //themes/common/images/settings/WidgetsIcon.png
                    return '<img src="' + value + '" />';
                }
            },
            {
                header: 'Description',
                flex: 1,
                dataIndex: 'description'
            }
            ,
            {
                header: 'GUID',
                flex: 1,
                dataIndex: 'path'
            }
            ]
        });
        return pan1;
    },
    OWFChannelListener:function(sender, msg){               
        log("msg rec'd:"+msg);
        if(msg && msg.command){
            if(msg.command=='close'){
                this.close();
            }
        }
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
                ret_funct(response);
            });
        }else{
            error("Launch Widget failed for guid:"+widget_guid,data);
        }
    },
    addSelectionListener:function(listener){
        this.selection_listeners.push(listener);
    },
    notifySelectionListeners:function(){
        for(i in this.selection_listeners){
            var listener = this.selection_listeners[i];
            listener(this.selected_widget);
        }
        this.notify({
            type:'widget_selected',
            value:this.selected_widget
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
    showWidgetInfo:function(){
        log("OWF",OWF);
        log("Ozone",Ozone);
        OWF.getOpenedWidgets(function(widget_array){
            log("[Info] OpenedWidgets",widget_array);
        
            log("[Info] Container",OWF.getContainerName());
            log("[Info] ContainerUrl",OWF.getContainerUrl());
            log("[Info] ContainerVersion",OWF.getContainerVersion());
            log("[Info] Theme",OWF.getCurrentTheme());
            log("[Info] DashboardLayout",OWF.getDashboardLayout());
            log("[Info] IframeId",OWF.getIframeId());
            log("[Info] InstanceId",OWF.getInstanceId());
            log("[Info] Url",OWF.getUrl());
            log("[Info] Version",OWF.getVersion());
            log("[Info] WidgetGuid",OWF.getWidgetGuid());
            log("[Info] isDashboardLocked",OWF.isDashboardLocked());
            log("[Info] relayFile",OWF.relayFile);
        });
    }
}