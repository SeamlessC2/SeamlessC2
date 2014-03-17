Ext.define('SeamlessC2.controller.S2Dashboard', {
    extend: 'Ext.app.Controller',
    stores: ['S2Dashboard','S2DashboardImages'],
    models:['S2DashboardModel'],
    views: [ 'Dashboard.DashPickerMainView', 'Dashboard.DashPickerView','Dashboard.DashboardSelectView','Dashboard.DashboardCreateView','Dashboard.DashboardDatasourceWidgetView','Dashboard.DashboardSelectPanelView','Dashboard.DashboardDatasourceSelectView','Dashboard.DashboardWidgetSelectView' ],

    //fields
    dashboards:[], // stored in preferences and loaded
    select_info:null, //info about the selections
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
    },
    onS2DashboardCreate:function(btn, e, eOpts){
        log("Creating dashboard",this.select_info );
        var self=this;

        OWF.Preferences.findWidgets({
            searchParams: {
                widgetName: ""
            },
            onSuccess: function(results) {
                log("#OWF widgets:"+results.length);
                if(results.length== 0 || results.length== 1){
                    error("Widgets Not Found:" + S2COMMANDER_WIDGET + "  "+S2HEADER_WIDGET);//environment.js

                }else {

                    log("Results: ",results);
                    var s2widget = null;
                    var s2header_widget = null
                    for(var i=0;i<results.length;i++)
                    {
                        if(results[i].value.namespace == S2COMMANDER_WIDGET){
                            s2widget = results[i];
                        }
                        if(results[i].value.namespace == S2HEADER_WIDGET){
                            s2header_widget=results[i];
                        }
                        //check other widgets
                        for(var idx in self.select_info.step_data)
                        {
                            var item = self.select_info.step_data[idx].widget;
                            if(item.name == results[i].value.namespace) self.select_info.step_data[idx].widget_info = results[i];
                        }
                    }
                    if(s2widget == null){
                        error("Widget Not Found:" + S2COMMANDER_WIDGET);
                        return;
                    }
                    if(s2header_widget == null){
                        error("Widget Not Found:" + S2HEADER_WIDGET);
                        return;
                    }
                    //TODO check other widgets
                    /*for(var idx in self.select_info.step_data)
                        {
                            self.select_info.step_data[idx].widget_found = true;
                        }if(!found){
                            error("Widgets Not Found:");
                            return;
                        }
                     */

                    //var map_widget = self.getDashboardWidgetTemplate("org.owfgoss.owf.examples.GoogleMaps","d182002b-3de2-eb24-77be-95a7d08aa85b","org.owfgoss.owf.examples.GoogleMaps",'100%',700,0,100,1);

                    //self.getDashboardWidgetTemplate(widget.value.universalName,widget.id,widget.value.namespace,'100%',100,0,0);

                    var header_widget = self.getDashboardWidgetTemplate(s2header_widget);
                    var command_widget = self.getDashboardWidgetTemplate(s2widget);

                    var config =self.getConfig(self.select_info,command_widget,header_widget);

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
                        layoutConfig: config
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
            //log("Record:",item);
            var d = Ext.create('SeamlessC2.model.S2DashboardModel', item);
            self.getS2DashboardStore().add(d);
        });
        var comp = Ext.getCmp("dashpicker_view");

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
    
    getConfig:function(info,command_widget,header_widget){
        var layout = info.layout_selected.layout;
        var template = null;
        switch (layout){
            case 'h1':
                var widget1 = info.step_data[1].widget_info;
                var widget2 = info.step_data[2].widget_info;
                template = this.getH1LayoutTemplate(command_widget,header_widget,this.getDashboardWidgetTemplate(widget1.value.namespace,widget1.id),this.getDashboardWidgetTemplate(widget2.value.namespace,widget2.id));
                break;
            case 'v1':
                var widget1 = info.step_data[1].widget_info;
                var widget2 = info.step_data[2].widget_info;
                template = this.getV1LayoutTemplate(command_widget,header_widget,this.getDashboardWidgetTemplate(widget1.value.namespace,widget1.id),this.getDashboardWidgetTemplate(widget2.value.namespace,widget2.id));
                break;
            case 'h1v2':
                var widget1 = info.step_data[1].widget_info;
                var widget2 = info.step_data[2].widget_info;
                var widget3 = info.step_data[3].widget_info;
                template = this.getH1V2LayoutTemplate(command_widget,header_widget,this.getDashboardWidgetTemplate(widget1),this.getDashboardWidgetTemplate(widget2),this.getDashboardWidgetTemplate(widget3));
                break;
            case 'v2h1':
                var widget1 = info.step_data[1].widget_info;
                var widget2 = info.step_data[2].widget_info;
                var widget3 = info.step_data[3].widget_info;
                template = this.getV2H1LayoutTemplate(command_widget,header_widget,this.getDashboardWidgetTemplate(widget1),this.getDashboardWidgetTemplate(widget2),this.getDashboardWidgetTemplate(widget3));
                break;
            case 'v1h2':
                var widget1 = info.step_data[1].widget_info;
                var widget2 = info.step_data[2].widget_info;
                var widget3 = info.step_data[3].widget_info;
                template = this.getV1H2LayoutTemplate(command_widget,header_widget,this.getDashboardWidgetTemplate(widget1),this.getDashboardWidgetTemplate(widget2),this.getDashboardWidgetTemplate(widget3));
                break;
            case 'h2v1':
                var widget1 = info.step_data[1].widget_info;
                var widget2 = info.step_data[2].widget_info;
                var widget3 = info.step_data[3].widget_info;
                template = this.getH2V1LayoutTemplate(command_widget,header_widget,this.getDashboardWidgetTemplate(widget1),this.getDashboardWidgetTemplate(widget2),this.getDashboardWidgetTemplate(widget3));
                break;
            case 'v2h2':
                var widget1 = info.step_data[1].widget_info;
                var widget2 = info.step_data[2].widget_info;
                var widget3 = info.step_data[3].widget_info;
                var widget4 = info.step_data[4].widget_info;
                template = this.getV2H2LayoutTemplate(command_widget,header_widget,this.getDashboardWidgetTemplate(widget1),this.getDashboardWidgetTemplate(widget2),this.getDashboardWidgetTemplate(widget3),this.getDashboardWidgetTemplate(widget4));
                break;

            default://basic
                var widget = info.step_data[1].widget_info;
                template = this.getBasicLayoutTemplate(command_widget,header_widget,this.getDashboardWidgetTemplate(widget.value.namespace,widget.id));
        }
        return template;
    },
    getDashboardWidgetTemplate:function(widget,name,width,height,x,y){
        var template;
        if(widget.id && widget.value.namespace){
            var widgetGuid = widget.id; 
            var universalName = widget.value.namespace;
            template =
            {
                "universalName": universalName,
                "widgetGuid": widgetGuid,
                "name": name || universalName || '' ,
                "active": true,
                "x":x || 0,
                "y":y || 0,
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
                "height": height || '100%',
                "width": width || '100%'
            }
        }
        return template;
    },
    getFramework:function(s2_widget,header_widget,content){ // the basic layout with s2 widget and header
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
                    "items": content,
                    "flex": 0.95
                }
                ],
                "htmlText": "80%",
                "flex": 0.80
            }]
        };
        return template;
    },
    getBasicLayoutTemplate:function(s2_widget,header_widget,content1_widget){
        var content = [{
            "xtype": "fitpane",
            "cls": "top",
            "htmlText": "95%",
            "items": [],
            "widgets": [content1_widget],
            "paneType": "fitpane",
            "flex": 0.95,
            "defaultSettings": {}
        }] ;
        return this.getFramework(s2_widget,header_widget,content);
    },
    getV1LayoutTemplate:function(s2_widget,header_widget,content1_widget,content2_widget){
        var content = [{
            "xtype": "fitpane",
            "cls": "top",
            "flex": 1,
            "htmlText": "50%",
            "items": [],
            "widgets": [content1_widget],
            "paneType": "fitpane",
            "defaultSettings": {}
        },
        {
            "xtype": "dashboardsplitter"
        },
        {
            "xtype": "fitpane",
            "cls": "bottom",
            "flex": 1,
            "htmlText": "50%",
            "items": [],
            "paneType": "fitpane",
            "widgets": [content2_widget],
            "defaultSettings": {}
        }];
        return this.getFramework(s2_widget,header_widget,content);
    },
    getH1LayoutTemplate:function(s2_widget,header_widget,content1_widget,content2_widget){
        var layout = this.getV1LayoutTemplate(s2_widget,header_widget,content1_widget,content2_widget);
        layout.items[2].items[2].layout.type="hbox";
        layout.items[2].items[2].items[0].cls = "left";
        layout.items[2].items[2].items[2].cls = "right";
        return layout;
    },
    getH1V2LayoutTemplate:function(s2_widget,header_widget,content1_widget,content2_widget,content3_widget){
        var content = [
        {
            "xtype": "fitpane",
            "cls": "left",
            "flex": 1,
            "htmlText": "50%",
            "items": [],
            "widgets": [content1_widget],
            "paneType": "fitpane",
            "defaultSettings": {}
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
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "widgets": [content2_widget],
                "paneType": "fitpane",
                "defaultSettings": {}
            },
            {
                "xtype": "dashboardsplitter"
            },
            {
                "xtype": "fitpane",
                "cls": "bottom",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "paneType": "fitpane",
                "widgets": [content3_widget],
                "defaultSettings": {}
            }
            ],
            "flex": 1
        }
        ];
        var layout = this.getFramework(s2_widget,header_widget,content);
        layout.items[2].items[2].cls = "hbox bottom";
        layout.items[2].items[2].layout.type = "hbox";
        return layout;
    },
    getV1H2LayoutTemplate:function(s2_widget,header_widget,content1_widget,content2_widget,content3_widget){
        var content = [
        {
            "xtype": "fitpane",
            "cls": "top",
            "flex": 1,
            "htmlText": "50%",
            "items": [],
            "widgets": [content1_widget],
            "paneType": "fitpane",
            "defaultSettings": {}
        },
        {
            "xtype": "dashboardsplitter"
        },
        {
            "xtype": "container",
            "cls": "hbox bottom",
            "layout": {
                "type": "hbox",
                "align": "stretch"
            },
            "items": [
            {
                "xtype": "fitpane",
                "cls": "left",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "widgets":  [content2_widget],
                "paneType": "fitpane",
                "defaultSettings": {}
            },
            {
                "xtype": "dashboardsplitter"
            },
            {
                "xtype": "fitpane",
                "cls": "right",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "paneType": "fitpane",
                "widgets": [content3_widget],
                "defaultSettings": {}
            }
            ],
            "flex": 1
        }
        ];
        var layout = this.getFramework(s2_widget,header_widget,content);
        return layout;
    },
    getH2V1LayoutTemplate:function(s2_widget,header_widget,content1_widget,content2_widget,content3_widget){
        var content = [        
        {
            "xtype": "container",
            "cls": "hbox top",
            "layout": {
                "type": "hbox",
                "align": "stretch"
            },
            "items": [
            {
                "xtype": "fitpane",
                "cls": "left",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "widgets":  [content1_widget],
                "paneType": "fitpane",
                "defaultSettings": {}
            },
            {
                "xtype": "dashboardsplitter"
            },
            {
                "xtype": "fitpane",
                "cls": "right",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "paneType": "fitpane",
                "widgets": [content2_widget],
                "defaultSettings": {}
            }
            ],
            "flex": 1
        },
        {
            "xtype": "dashboardsplitter"
        },
        {
            "xtype": "fitpane",
            "cls": "bottom",
            "flex": 1,
            "htmlText": "50%",
            "items": [],
            "widgets": [content3_widget],
            "paneType": "fitpane",
            "defaultSettings": {}
        }
        ];
        var layout = this.getFramework(s2_widget,header_widget,content);
        return layout;
    },
    getV2H2LayoutTemplate:function(s2_widget,header_widget,content1_widget,content2_widget,content3_widget,content4_widget){
        var content = [        
        {
            "xtype": "container",
            "cls": "hbox top",
            "layout": {
                "type": "hbox",
                "align": "stretch"
            },
            "items": [
            {
                "xtype": "fitpane",
                "cls": "left",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "widgets": [content1_widget],
                "paneType": "fitpane",
                "defaultSettings": {}
            },
            {
                "xtype": "dashboardsplitter"
            },
            {
                "xtype": "fitpane",
                "cls": "right",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "paneType": "fitpane",
                "widgets": [content2_widget],
                "defaultSettings": {}
            }
            ],
            "flex": 1
        },
        {
            "xtype": "dashboardsplitter"
        },
        {
            "xtype": "container",
            "cls": "hbox bottom",
            "layout": {
                "type": "hbox",
                "align": "stretch"
            },
            "items": [
            {
                "xtype": "fitpane",
                "cls": "left",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "widgets": [content3_widget],
                "paneType": "fitpane",
                "defaultSettings": {}
            },
            {
                "xtype": "dashboardsplitter"
            },
            {
                "xtype": "fitpane",
                "cls": "right",
                "flex": 1,
                "htmlText": "50%",
                "items": [],
                "paneType": "fitpane",
                "widgets":  [content4_widget],
                "defaultSettings": {}
            }
            ],
            "flex": 1
        }
        ];
        var layout = this.getFramework(s2_widget,header_widget,content);
        return layout;
    }

});


