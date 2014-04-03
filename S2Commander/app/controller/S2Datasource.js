Ext.define('SeamlessC2.controller.S2Datasource', {
    extend: 'Ext.app.Controller',
    stores: ['S2DatasourceList','TailorSources'],
    views: ['Datasource.DatasourceView','Datasource.DatasourceMainContentView','Datasource.DatasourceInfoView','Datasource.DatasourceSelectView','Datasource.DatasourceListGridView'],
    
    //fields
    datasources:[], // stored in preferences and loaded
   
    onLaunch: function() {//fires after everything is loaded
        var store = this.loadDatasourceStore();
        log("Datasource Controller Launch Complete");
    },
    
    init: function() {        
        var self=this;
        
        //listen for events
        this.control({
            'datasource_list_grid_view': {
                itemclick: self.onSelectDatasource
            },
            '#add_datasource_btn':{
                click:this.onAddDatasourceBtn
            },
            '#datasource_widget_select':{
                selectionchange: function(dv, selections){
                    log("Intent Selection",selections);
                    var widget =selections[0].data;
                        //TODO select from intents
                        self.onWidgetIntentSelect(widget,self.selectedDatasource);                 
                }
            }
        });
        if(OWF.Util.isRunningInOWF()) {           
            // Retrieve saved state
            OWF.Preferences.getUserPreference({
                namespace: OWF_NAMESPACE,
                name: OWF_NAMESPACE+'.DatasourcePrefs',
                onSuccess: function (response) {
                    if(response.value) {
                        var data = OWF.Util.parseJson(response.value);
                        log("User Prefs -"+ OWF_NAMESPACE+".DatasourcePrefs",response);
                    }
                }
            });
            
            //see if this is a new dashboard with some passed in data
            OWF.Preferences.getUserPreference({
                namespace:OWF_NAMESPACE,
                name:OWF_NAMESPACE+'.dashboard_created_data',
                onSuccess: function (response) {
                    if(response.value) {
                        response.value.replace("undefined","null");
                        var resp = Ext.JSON.decode(response.value);
                        log("User Prefs -"+ OWF_NAMESPACE+'.dashboard_created_data',response);
                        var href = window.parent.location.href;
                        var page_guid = href.substring(href.indexOf("#guid=")+6, href.length);
                        if(resp.guid && resp.guid == page_guid){
                            var data = resp.data.step_data;
                            if(data){
                                for(var idx in data){
                                    var item = data[idx];
                                    var datasource = {};
                                    if(item.datasource){
                                        datasource.source=item.datasource.source;
                                        datasource.data=item.datasource.data;
                                        datasource.name=item.datasource.name;
                                        self.addDatasource(datasource);
                                    };                                    
                                    if(item.widget)
                                        self.onWidgetIntentSelect(item.widget,datasource)
                                    log(datasource);
                                }
                            }
                        }
                    }
                    //clear the prefs
                    /* TODO CIV doesnt store yet
                    OWF.Preferences.setUserPreference({
                        namespace:OWF_NAMESPACE,
                        name:OWF_NAMESPACE+'.dashboard_created_data',
                        value:'',
                        onSuccess:function(pref){
                            log("Set Preferences",pref);
                        },
                        onFailure:function(a){
                            error("Set Preferences",a);
                        }
                    });*/                        
                }
            });
            
        }
        
        log("Initialized Datasource Controller");    
    },
    onWidgetIntentSelect:function(widget,datasource){
        if(widget.intents && widget.intents.receive[0]){
            var intent = widget.intents.receive[0];
            var channel = intent.dataTypes[0];
            //send data accross channel to widget
            var params =datasource;
                        
            //need to make special arrangements for MITRE.CIV which has 'sub' widgets inside it
            if(widget.name == "MITRE.CIV"){
                params =  {
                    "widget_name":"MITRE.CIV", 
                    "dataURI":"https://localhost:8443/ComposableInformationVisualization/json/nations.json",//"http://localhost:8080/cra/impl/WorldPopDataFeedAdaptor/CraInstanceServlet?requestType=getLatestDataItem",
                    "visualizationProperties":{
                        "visualizationId":"nvd3.barGraph",
                        "visualizationMappings":[{
                            "elementName":"Label",
                            "fieldName":"name"
                        },{
                            "elementName":"Bar Series",
                            "fieldName":"population"
                        },{
                            "elementName":"Bar Series",
                            "fieldName":"lifeExpectancy"
                        }]
                    }
                }
            }
                                
            OWF.Eventing.publish(channel,params);
        }    
    },
    onSelectDatasource:function(view, record, row, index, e, eOpts){
        log('datasource selected',record);
        var panel = Ext.getCmp('datasource_info_panel');
        if(record.data){
            this.selectedDatasource = record.data;
            var str = '';
            var obj = record.data.data;
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str += '['+p + ']:' + obj[p] + '</br>';
                }
            }
            panel.update(
                "<div id='datasource_info_panel_title'>"+record.data.source+" : "+record.data.name+"</div>"+
                "<div id='datasource_info_panel_data'>"+str+"</div>");
            Ext.getCmp('datasource_info_view').show();
        }else{
            panel.update("Infomation is missing");
        }
    },
    onAddDatasourceBtn:function(button,e,opts){//type,source
        log("Add datasource btn pressed");
        var tf =  Ext.getCmp('urlInput');
        var datasource=null;
        var data = {};
        if(tf.getValue()){
            datasource = {
                source:'URL',
                data:{
                    Url:tf.getValue()
                },
                name:tf.getValue()
            };
        }else {
            tf =  Ext.getCmp('tailor_combobox');
            var val = tf.getValue();
            if(val){
                var store = this.getTailorSourcesStore();
                Ext.each(store.getRange(), function (record, idx, a) {
                    if(record != null ){   
                        if(record.data.name == val){
                            data = record.data;
                        }
                    }
                });
                datasource = {
                    source:'Tailor',
                    data:data,
                    name:val
                };
            }
        }
        if(datasource != null){
            scope:this,
            this.fireEvent('add_datasource_btn',datasource);
        }            
        
        //open the datasource accordion
        Ext.getCmp('datasource_view').items.items[0].expand();
        
        this.addDatasource(datasource);
    },
    addDatasource:function (data) {//name,type
        log("Add Datasource",data);
        var store = this.getS2DatasourceListStore();
        store.add(data);
        this.saveDatasourceToPrefs();
    },
    loadDatasourceStore:function(){
        var self=this;
      
        var onFailure = function(error) {
            error("S2 Datasource error getPreferences",error);
        }; 
        
        OWF.Preferences.getUserPreference({
            namespace: OWF.getInstanceId(),
            name: OWF_NAMESPACE+'DatasourceData',
            onSuccess:function(response){ 
                if(response && response.value){//may be empty or not created
                    var datastore = self.getS2DatasourceListStore();//self.getS2DatasourceStore();
                    var d = Ext.JSON.decode(response.value);  
                    Ext.each(d,function (record, idx, a) {
                        datastore.add(record);
                    });                    
                }                           
            } ,
            onFailure:onFailure
        });         
    },
    saveDatasourceToPrefs: function () {
        var store = this.getS2DatasourceListStore(); //this.getS2DatasourceStore();
        var list = [];
        Ext.each(store.getRange(), function (record, idx, a) {
            list.push(record.data);
        });
        var data = Ext.JSON.encode(list);
        this.saveToPrefs(data);
    },
    saveToPrefs:function(data,success_funct,fail_funct){
        OWF.Preferences.setUserPreference({
            namespace:OWF.getInstanceId(),
            name: OWF_NAMESPACE+'DatasourceData',
            value: data,
            onSuccess: function () {
                log("Save to prefs ok",arguments);
                if(success_funct) success_funct(arguments);
            },
            onFailure: function () {
                error("Save to prefs error",arguments);
                if(fail_funct) fail_funct(arguments);
            }
        });
    }
});


