/*

*/
WidgetController = function(){
    this.widget_list=[];
    this.selected_widgets=[];
    this.selection_listeners = [];
    log("Widget Controller Created!");
}
WidgetController.prototype = {

    init:function(){
        log("Initializing Widget Controller");
        this.updateOWFWidgetList();
    },

    getWidgetStore:function(){
        var newlist = [];
        for(i in this.widget_list){
            var item = this.widget_list[i];
            var src = item.value.smallIconUrl;
            if(src.indexOf("http") < 0)
                src = "../owf/"+src;
            newlist.push([item.value.namespace,src,item.value.description,item.value.path,'']);
        }

        var widget_store = Ext.create('Ext.data.ArrayStore', {
            fields: [
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
                name: 'class'
            }
            
            ],
            data: newlist
        });
        return widget_store;
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
                self.widget_list = results;
            } ,
            onFailure: function(err,status){
                log("getOWFWidgetList error! Status Code: " + status
                    + ". Error message: " + err);
            }
        });
    },
    
    getWidgetDataView:function(data){
       var self=this;
      if(typeof(data) === 'undefined' || data == null)
        data = this.getWidgetStore();
      var imageTpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="widget widget_data_view {class}" id="widget_{path}" tabindex="0" style="">',
            '   <div class="thumb-wrap" id="{path}">',
            '       <img src="{icon}" class="thumb" id="widget_img_{path}">',
            '   </div>',
            '   <div class="thumb-text" id="widget_text_{path}">{name}</div>',
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
                    self.selected_widgets=[];
                    for(i in nodes){
                        var widget = nodes[i];
                        log("Widget Selected:"+widget.data.name,widget);
                        self.selected_widgets.push(widget);                        
                    }
                    self.notifySelectionListeners();
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
    launchWidget:function(widget_guid,title,data,ret_funct){
        /*var data = {
                                channel: "Clock Channel",
                                message: "message"
                            };*/

        if(widget_guid != null){
            var dataString = OWF.Util.toString(data);
            OWF.Launcher.launch({
                guid: widget_guid,
                launchOnlyIfClosed: true,
                title: title,
                data: dataString
            }, function(response){
                log(response);
                ret_funct(response);
            });
        }
    },
    addSelectionListener:function(listener){
        this.selection_listeners.push(listener);
    },
    notifySelectionListeners:function(){
        for(i in this.selection_listeners){
            var listener = this.selection_listeners[i];
            listener(this.selected_widgets);
        }
    }

}