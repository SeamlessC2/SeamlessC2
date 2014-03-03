Ext.define('SeamlessC2.controller.S2Dashboard', {
    extend: 'Ext.app.Controller',
    stores: ['S2Dashboard','S2DashboardImages'],
    models:['S2DashboardModel'],
    views: [ 'Dashboard.DashPickerMainView', 'Dashboard.DashPickerView','Dashboard.DashboardSelectView','Dashboard.DashboardCreateView','Dashboard.DashboardDatasourceWidgetView','Dashboard.DashboardSelectPanelView','Dashboard.DashboardDatasourceSelectView','Dashboard.DashboardWidgetSelectView' ],

    //fields
    dashboards:[], // stored in preferences and loaded
    select_info:null,
    layout_info:[{
        id:'1',
        layout:'basic',
        steps:1
    },{
        id:'2',
        layout:'h1',
        steps:2
    },{
        id:'3',
        layout:'v1',
        steps:2
    },{
        id:'4',
        layout:'h1v2',
        steps:3
    },{
        id:'5',
        layout:'v2h1',
        steps:3
    },
    {
        id:'6',
        layout:'v1h2',
        steps:3
    },{
        id:'7',
        layout:'h2v1',
        steps:3
    },{
        id:'8',
        layout:'v2h2',
        steps:4
    }],//info about structures of layout
    
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
                click: self.onS2DashboardCreate
            },
            '#dashboard_layout_select': {
                selectionchange: function(view, nodes){
                    if(nodes.length == 0) return;
                    log("Dashboard selected",nodes);
                    self.select_info = {
                        layout_selected:null,
                        cur_step:1,
                        step_data:{
                            '1':{
                                datasource:null,
                                widget:null
                            }
                        }
                    };
                    self.select_info.layout_selected =self.layout_info[parseInt(nodes[0].data.name)-1]; 
                    var lay = Ext.getCmp("dashboard_create").getLayout();
                    self.updateDatasourceSelectView();
                    
                    lay.setActiveItem(1); 
                    Ext.getCmp('dashboard_create_move_prev').setDisabled(false);
                    Ext.getCmp('dashboard_create_move_next').setDisabled(false);
                }
            },
            '#dashboard_create_move_prev':{
                click: function(btn) {
                    var layout = btn.up("panel").getLayout();     
                    if(self.select_info.cur_step > self.select_info.layout_selected.steps){
                        layout.setActiveItem(1);
                    }
                    self.select_info.cur_step -= 1;  
                    if(self.select_info.cur_step == 0){
                        layout.setActiveItem(0);
                        Ext.getCmp('dashboard_create_move_prev').setDisabled(true);
                    }else{
                        Ext.getCmp('dashboard_create_move_next').setDisabled(false);
                        //reset the datatsource selector
                        self.updateDatasourceSelectView();
                    }                   
                }
            },
            '#dashboard_create_move_next':{
                click: function(btn) {
                    var layout = btn.up("panel").getLayout();
                    if(self.select_info.cur_step == 0){
                        layout.setActiveItem(1);
                        Ext.getCmp('dashboard_create_move_prev').setDisabled(false);
                    }
                    self.select_info.cur_step += 1;                     
                    
                    if(self.select_info.cur_step <= self.select_info.layout_selected.steps){                        
                        Ext.getCmp('dashboard_create_move_next').setDisabled(false);
                        if(!self.select_info.step_data[self.select_info.cur_step])
                            self.select_info.step_data[self.select_info.cur_step] = {
                                datasource:null,
                                widget:null
                            };
                        //reset the datatsource selector
                        self.updateDatasourceSelectView();
                    }else{
                        Ext.getCmp('dashboard_create_move_next').setDisabled(true);
                        layout.setActiveItem(2); 
                        log('Selected Info',self.select_info);
                    }                           
                }
            },
            'dashboard_datasource_select button':{
                click:function(btn,e,eOpts){                    
                    log("Add datasource btn pressed");
                    
                    //get input values
                    var tf =  Ext.getCmp('dash_urlInput');
                    var datasource=null;
                    if(tf.getValue()){
                        datasource = {
                            type:'URL',
                            source:tf.getValue()
                        };
                    }else {
                        tf =  Ext.getCmp('dash_tailor_combobox');
                        if(tf.getValue()){
                            datasource = {
                                type:'Tailor',
                                source:tf.getValue()
                            };
                            
                            //handle recommendations by updating model
                            var params = {
                                activityType: "Monitoring",
                                dataSource: datasource.source
                            };
                            var tailorController = self.getController("Tailor");                            
                            tailorController.getRecommendations(self,params,self.processRecommendationsCallback);                            
                        }
                    }                    
                    self.select_info.step_data[self.select_info.cur_step].datasource = datasource;                        
                        
                    //show widget selector
                    Ext.getCmp('dashboard_datasource_widget_select').getLayout().setActiveItem(1);   
                    Ext.getCmp('dashboard_datasource_widget_move_next').setDisabled(true);
                    Ext.getCmp('dashboard_datasource_widget_move_prev').setDisabled(false);
                }
            },                
            '#dashboard_widget_select': {
                selectionchange: function(view, nodes ){ 
                    if(nodes.length > 0){
                        var selected_widget = nodes[0].data;
                        log("Widget Selected:"+selected_widget.name,selected_widget);
                        self.select_info.step_data[self.select_info.cur_step].widget = selected_widget;                           
                    }
                }
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
    processRecommendationsCallback:function(data,self){ 
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
        
        //update store with recommendations
        var widget_store = Ext.StoreManager.lookup('SystemWidgets'); 
            
        //set the style value in the store if it is recommended
        if(widget_recommendations.length > 0){
            for(i in widget_recommendations){
                var rec_widget = widget_recommendations[i];
                
                Ext.each(widget_store.getRange(), function (record, idx, a) {
                    if(rec_widget.name == record.data.name){
                        record.data.style='widget_recommended';
                    /*  data = rec_widget.data;
                        //TODO HARDCODED
                        //need to make special arrangements for MITRE.CIV which has 'sub' widgets inside it
                       if(record.data.name == "MITRE.CIV"){
                            var newname = record.data.name +"-"+data.visualizationProperties.visualizationId;
                            newlist.push([guid,newname,src,item.value.description,item.value.path,style,data]);
                            pushed=true;
                        }*/
                    }else{
                        record.data.style='';//clear
                    }
                });
            }
        }
        Ext.getCmp('dashboard_widget_select').refresh();
                            
    },
    updateDatasourceSelectView:function(){
        var self=this;
        //update the image and text for the datasource select step
        var hdr = Ext.getCmp('dashboard_layout_select_panel_hdr');
        hdr.update('<div class="dashboard_layout_select_panel_hdr" >Step '+self.select_info.cur_step +' of ('+(self.select_info.layout_selected.steps+1)+') <br/> Select your data source and widget for the green area.</div>')
        var img = Ext.getCmp('dashboard_layout_select_panel_img');
        img.update('<div class="dashboard_layout_select_panel_thumb"><img id="dashboard_layout_select_panel_img" src="resources/images/Grid'+self.select_info.layout_selected.id+'_'+self.select_info.cur_step+'.png"></div>');
        
        //reset datasource fields
        Ext.getCmp('dash_tailor_combobox').reset();
        Ext.getCmp('dash_urlInput').setValue('');
        
        var widget = null;
        if(self.select_info.step_data[self.select_info.cur_step]){
            var info = self.select_info.step_data[self.select_info.cur_step];
            if(info.datasource && info.datasource.type == 'URL'){
                Ext.getCmp('dash_urlInput').setValue(info.datasource.source);
            }
            else if(info.datasource && info.datasource.type == 'Tailor'){
                Ext.getCmp('dash_tailor_combobox').select(info.datasource.source);
            }
            
            if(info.widget){
                widget = info.widget;
            }
        }
                
        //clear widget recommendations
        var widget_store = Ext.StoreManager.lookup('SystemWidgets');
        Ext.each(widget_store.getRange(), function (record, idx, a) {
            record.data.style='';
        });
        //clear the selections
        Ext.getCmp('dashboard_widget_select').getSelectionModel().deselectAll();

        Ext.each(widget_store.getRange(), function (record, idx, a) {
            if(widget != null && widget.name == record.data.name){
                Ext.getCmp('dashboard_widget_select').getSelectionModel().select(record);            
            }
        });
        Ext.getCmp('dashboard_widget_select').refresh();
        //show data source
        Ext.getCmp('dashboard_datasource_widget_move_prev').setDisabled(true);
        Ext.getCmp('dashboard_datasource_widget_move_next').setDisabled(false);
        Ext.getCmp('dashboard_datasource_widget_select').getLayout().setActiveItem(0);
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
    /* if setup for loading from json file
        var store =  this.getDashboardStore();
         store.load({
            callback: this.onDashboardStoreLoad,
            scope: this
        });*/

    },
    //load in dynamic names for the dashboard menu from the store
    /*
    onS2DashboardStoreLoad: function(records, operation, success) {
        var picker = Ext.getCmp("dashpicker_view");
        var self = this;
        Ext.each(records,function(record,id){
            log("Record:",record);
            picker.addDashboard({
                text:record.get('name'),
                checked: false,
                group: 'theme',
                checkHandler: self.dashboardSelectHandler,
                data:{
                    name:record.get('name'),
                    guid:record.get('guid')
                }
            });
        });
        log("Dashboard view loaded",records);
    },*/
    onS2DashboardCreate:function(btn, e, eOpts){
        log("Dashboard Create");
        var self=this;

        OWF.Preferences.findWidgets({
            searchParams: {
                widgetName: "SeamlessC2"
            },
            onSuccess: function(results) {
                log("#OWF widgets:"+results.length);
                if(results.length== 0){
                    error("Widgets Not Found:" + SeamlessC2);

                }else if(results.length== 1){
                    log("One Result: ",results[0]);
                    var s2widget = results[0];

                    var map_widget = self.getDashboardWidgetTemplate("org.owfgoss.owf.examples.GoogleMaps","d182002b-3de2-eb24-77be-95a7d08aa85b","org.owfgoss.owf.examples.GoogleMaps",'100%',700,0,100,1);

                    //self.getDashboardWidgetTemplate(widget.value.universalName,widget.id,widget.value.namespace,'100%',100,0,0);

                    var header_widget = self.getDashboardWidgetTemplate("Channel Shouter","eb5435cf-4021-4f2a-ba69-dde451d12551","Channel Shouter",'100%','100%',0,0);
                    var footer_widget = self.getDashboardWidgetTemplate("Channel Listener","ec5435cf-4021-4f2a-ba69-dde451d12551","Channel Listener",'100%','100%',0,0);
                    var command_widget = self.getDashboardWidgetTemplate(s2widget.value.namespace,s2widget.path,s2widget.value.universalName,'100%','100%',0,0);
                    var basicConfig =self.getFitLayoutTemplate(command_widget,header_widget,footer_widget,map_widget);

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
            var d = Ext.create('SeamlessC2.model.S2DashboardModel', item);
            self.getS2DashboardStore().add(d);
        });
        var comp = Ext.getCmp("dashpicker_view");
    ;
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
    getDashboardWidgetTemplate:function(universalName,widgetGuid,name,width,height,x,y){
        var template =
        {
            "universalName": universalName,
            "widgetGuid": widgetGuid,
            "name": name,
            "active": true,
            "x": x,
            "y": y,
            //"zIndex": 19020,
            "minimized": false,
            "maximized": false,
            "pinned": false,
            "collapsed": false,
            "columnPos": 0,
            "buttonId": "",
            "buttonOpened": "",
            "region": "none",
            "statePosition": 1,
            "intentConfig": null,
            "singleton": false,
            "floatingWidget": false,
            "background": false,
            "height": height,
            "width": width
        }
        return template;
    },
    getFitLayoutTemplate:function(s2_widget,header_widget,footer_widget,content1_widget){
        var template =
        {
            "xtype": "container",
            "cls": "hbox ",
            "layout": {
                "type": "hbox",
                "align": "stretch"
            },
            "flex": 1,
            "items": [{
                "xtype": "fitpane",
                "cls": "left",
                "htmlText": "20%",
                "items": [],
                "widgets": [s2_widget],
                "paneType": "fitpane",
                "defaultSettings": {},
                "flex": 0.20
            },
            {
                "xtype": "dashboardsplitter"
            },
            {
                "xtype": "container",
                "cls": "vbox right",
                "layout": {
                    "type": "vbox",
                    "align": "stretch"
                },
                "items": [
                {
                    "xtype": "fitpane",
                    "cls": "top",
                    "htmlText": "5%",
                    "items": [],
                    "widgets": [header_widget],
                    "paneType": "fitpane",
                    "flex": 0.05,
                    "defaultSettings": {}
                },
                {
                    "xtype": "dashboardsplitter"
                },
                {
                    "xtype": "container",
                    "cls": "vbox bottom",
                    "layout": {
                        "type": "vbox",
                        "align": "stretch"
                    },
                    "items": [
                    {
                        "xtype": "fitpane",
                        "cls": "top",
                        "htmlText": "95%",
                        "items": [],
                        "widgets": [content1_widget],
                        "paneType": "fitpane",
                        "flex": 0.95,
                        "defaultSettings": {}
                    }
                    /*,
                {
                    "xtype": "dashboardsplitter"
                },
                {
                    "xtype": "fitpane",
                    "cls": "bottom",
                    "htmlText": "5%",
                    "items": [footer_widget],
                    "paneType": "fitpane",
                    "flex": 0.05,
                    "widgets": [],
                    "defaultSettings": {}
                }*/
                    ],
                    "flex": 0.95
                }
                ],
                "htmlText": "80%",
                "flex": 0.80
            }]
        };
        return template;
    }
});


