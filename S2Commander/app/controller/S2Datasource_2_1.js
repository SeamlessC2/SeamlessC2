Ext.define('SeamlessC2.controller.S2Datasource', {
    extend: 'Ext.app.Controller',
    stores: ['S2Datasource','TailorSources'],
    views: ['Datasource.DatasourceView','Datasource.DatasourceMainContentView','Datasource.DatasourceSelectView','Datasource.DatasourceTreeView'],
    
    //fields
    datasources:[], // stored in preferences and loaded
   
    onLaunch: function() {//fires after everything is loaded
        //handle the load of the dashboards
        var store = this.loadDatasourceStore();
        log("Dashboard Controller Launch Complete");
    },
    
    init: function() {        
        var self=this;
        
        //listen for events
        this.control({
            'datasource_list_grid_view': {
                itemclick: self.onSelectDatasource
            },
            'datasource_treeview': {
                scope:self,
                itemclick: self.onTreeSelect
            },
            '#add_datasource_btn':{
                click:this.onAddDatasourceBtn
            }
        /*'datasource_view button':{
                add_datasource_btn:this.onAddDatasourceBtn
            }*/
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
            // Subscribe to channel of dataselector
            OWF.Eventing.subscribe(OWF_EVENT_PREFIX+'dataselector', function(sender, msg, channel){
                scope:self,self.addDatasource(msg);
            });
        }
        log("Initialized Datasource Controller");    
    },
    onTreeSelect:function(view, record, item, index, e, eOpts){
        log("Tree row selected",record);  
        if(record.isLeaf()){
            var source = record.raw.id;
            var name = record.raw.text;
            var obj = record.raw.data;
            var str = '';
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str += p + '::' + obj[p] + '</br>';
                }
            }

             Ext.getCmp('datasource_info_panel').update(
                "<div id='datasource_info_panel_title'>"+source+" : "+name+"</div>"+
                "<div id='datasource_info_panel_data'>"+str+"</div>");
        }else if(record.isExpanded()) {
            record.collapse();
        } else {
            record.expand();
        }

    },
    onAddDatasourceBtn:function(button,e,opts){//type,source
        log("Add datasource btn pressed");
        var tf =  Ext.getCmp('urlInput');
        var datasource=null;
        var data = {};
        if(tf.getValue()){
            datasource = {
                type:'URL',
                data:{
                    Url:tf.getValue()
                },
                source:tf.getValue()
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
                    type:'Tailor',
                    data:data,
                    source:val
                };
            }
        }
        if(datasource != null){
            scope:this,
            this.fireEvent('add_datasource_btn',datasource);
        }            
        
        Ext.getCmp('datasource_view').items.items[0].expand();
        
        this.addDatasource(datasource);
    /*
        this.application.fireEvent('launch_widget',{
            name:DATA_SELECTOR_WIDGET
        });//environment.js
        */
    },
    addDatasource:function (data) {//name,type
        log("Add Datasource",data);
        
        //update the view
        var store = this.getS2DatasourceStore();
        var root = store.getRootNode();
        var newnode = {
            id: data.type,
            text: data.source,
            data:data.data,
            leaf: true
        };
        var parent = root.findChild('text',data.type);
        if(parent==null){
            var node = {//create the type folder for datasource
                id: data.type,
                text: data.type,
                children:[newnode],
                leaf: false
            };
            root.appendChild(node);
        }else{
            if(parent.findChild('text',data.source) != null){
                //Ext.MessageBox.alert('Already ncluded');
                return;
            }
            parent.appendChild(newnode);
        }
        root.expandChildren(true); // Optional: To see what happens
        this.saveDatasourceToPrefs();
    },
    loadDatasourceStore:function(){
        var self=this;
      
        var onFailure = function(error) {
            error("S2 Datasource error getPreferences",error);
        }; 
        //get the user list of dashboards this manages
        OWF.Preferences.getUserPreference({
            namespace: OWF_NAMESPACE,
            name: 'MITRE.SeamlessCommander.DatasourceData',
            onSuccess:function(response){ 
                if(response && response.value){//may be empty or not created
                    var datastore = self.getS2DatasourceStore();
                    var d = Ext.JSON.decode(response.value);  
                    if(d) datastore.setRootNode(d);
                }           
                
            } ,
            onFailure:onFailure
        });         
    },
    getTreeDataRecurse:function(node){
        var newnode = {
            id:node.data.id,
            text:node.data.text,
            data:node.data.data,
            leaf:node.data.leaf
        };
        var self=this;
        if(node.childNodes && node.childNodes.length > 0){
            newnode.children=[];
            node.eachChild(function(child){
                newnode.children.push(self.getTreeDataRecurse(child));
            }); 
        }
        return newnode;
    },
    saveDatasourceToPrefs: function () {
        // var d = '{"text":"root","children":[            { "text": "detention", "leaf": true },            { "text": "homework",  "children": [                { "text": "book report", "leaf": true }            ] }        ]   }';
        // var data = Ext.JSON.decode(d);
        var store = this.getS2DatasourceStore();
        var root= store.getRootNode();
        var root_text = this.getTreeDataRecurse();
        var data = Ext.JSON.encode(root_text);
        OWF.Preferences.setUserPreference({
            namespace:OWF_NAMESPACE,
            name: 'MITRE.SeamlessCommander.DatasourceData',
            value: data,
            onSuccess: function () {
                log("Save to prefs ok",arguments);
            },
            onFailure: function () {
                error("Save to prefs error",arguments)
            }
        });
    }
});


