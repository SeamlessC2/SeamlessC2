/*
required: dashboard_layout.js after this file

To use:
var dashboard_controller = null;

owfdojo.addOnLoad(function() {
    OWF.ready(function(){
        dashboard_controller = new DashboardController();
        dashboard_controller.init();
    });
});
 */
DashboardController = function(){ 
    this.selected_dashboard_id = 0;
    this.selected_dashboard_name = '';
    this.dashboardDict = {};
    log("Dashboard Controller Created!");
}
DashboardController.prototype = {

    init:function(){
        this.createDashboardModels();
        log("Initializing Dashboard Controller");       
    },
    
    getDashboardLayoutStore:function(){
        var data = [];
        for(var i = 1; i<9; i++){            
            data.push([i,'resources/images/Grid'+i+'_grey.png','']);
        }

        var layout_store = Ext.create('Ext.data.ArrayStore', {
            fields: [
            {
                name: 'id'
            },

            {
                name: 'src'
            },

            {
                name: 'style'
            }
            ],
            data: data
        });
        return layout_store;
    },
    getDashboardLayoutDataView:function(data){
        var self=this;
        if(typeof(data) === 'undefined' || data == null)
            data = this.getDashboardLayoutStore();
        var imageTpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="dashboard-data-view {style}" id="dashboard_{id}" style="">',
            '   <div class="thumb-wrap" >',
            '       <img src="{src}" class="dashboard-thumb" id="dash_img_{id}">',
            '   </div>',
            '</div>',
            '</tpl>'
            );

        var layoutDataViewPanel = Ext.create('Ext.view.View', {
            store: data,
            tpl: imageTpl,
            layout: {
                type: 'vbox',
                align: 'center'
            //defaultMargins: '0, 10'
            },
            width:540,
            itemSelector: 'div.thumb-wrap',
            emptyText: 'No images available',
            multiSelect: false,
            listeners: {
                selectionchange: function(dv, nodes ){                    
                    for(i in nodes){
                        var dash = nodes[i];
                        log("Dashboard Selected:"+dash.data.id,dash);
                        self.selected_dashboard_id = dash.data.id - 1; //array index                        
                    }
                //self.notifySelectionListeners();
                }
            }
        });
        var createDashBtn = Ext.create('Ext.Button', {
            text: 'Create Dashboard',
            handler: function(button){
                self.createBtnAction(button,self);
            }
        });
        self.dashboard_chooser_panel = Ext.create('Ext.Panel', {
            layout: {
                type: 'vbox',
                align: 'center'
            //defaultMargins: '0, 10'
            },
            border: false,            
            defaults: {
                border: false
            },
            width: 128*4,
            height: 500,//128 *2
            items: [
            layoutDataViewPanel,
            {
                xtype: 'textfield',
                itemId:'tf_name',
                name: 'tf_name',
                fieldLabel: 'Dashboard Name',
                allowBlank: false  // requires a non-empty value
            },
            createDashBtn
            ]
        });
        
        return self.dashboard_chooser_panel;
    },
    
    createBtnAction:function(button,self) {
        var tf =  self.dashboard_chooser_panel.getComponent('tf_name');
        var name = tf.getValue();
        
        //TODO - validate name doesnt already exist
        
        self.selected_dashboard_name= name;
        self.createDashboard(name);
                
    },
    createDashboard:function(name,description,layoutConfig,success_funct){
        
        var layout = layoutConfig || this.dashboardDict[this.selected_dashboard_id]; // see dashboard_layouts.js
                
        var generatedGUID = OWF.Util.guid();
        
        //once created reload page to new location (i.e the new dashboard)
        var funct = success_funct || function(d,e,f){
            
            var url= OWF.getContainerUrl()+"/#guid=" + generatedGUID;
            log("New Dashboard URL:"+url);
            OWF.Preferences.setUserPreference(
            {
                namespace:'SeamlessC2.DashboardCreated',
                name:'guid',
                value:generatedGUID,
                onSuccess:function(pref){
                    log("Set Preferences",pref);
                    window.parent.location.href= url ;
                    window.parent.location.reload(true);
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
            name: name || "Seamless C2 Dashboard "+generatedGUID,
            //columnCount: 0,
            locked:false,
            //defaultSettings: {},
            description: description || 'Automatically generated dashboard -'+generatedGUID,
            guid: generatedGUID,
            layoutConfig: layout
        };
        
        //create the dashboard
        OWF.Preferences.createOrUpdateDashboard({
            json: params,
            saveAsNew: true,
            onSuccess: funct,
            onFailure: function(error) {
                log("dashboard create failure: ", error);
            },
            async: true
        });
    },
        
    //creates a dictionary of dashboard models
    //generated from exporting dashboard from owf
    createDashboardModels:function(){
        var self=this;
        OWF.Preferences.findWidgets({ //https://localhost:8443/owf/prefs/widget/listUserAndGroupWidgets
            searchParams: {
                widgetName: DATA_SELECTOR_WIDGET_NAME 
            },
            onSuccess: function(results) {
                log("#OWF widgets:"+results.length);
                if(results.length== 0){
                    error("Widget Not Found:" + DATA_SELECTOR_WIDGET_NAME);
                    
                }else if(results.length== 1){
                    log("One Result: ",results[0]);
                    self.updateDashboardModels(results[0]); // located in dashboard_layouts.js 
                }
            } ,
            onFailure: function(err,status){
                error("findWidgets error! Status Code: " + status
                    + ". Error message: " + err);  
                
            }
        });
    }    

}
