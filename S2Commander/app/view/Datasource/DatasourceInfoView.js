Ext.define('SeamlessC2.view.Datasource.DatasourceInfoView', {
    extend: 'Ext.Panel',
    alias: 'widget.datasource_info_view',
    id: 'datasource_info_view',
    layout: {
        type: 'vbox',
        align: 'left'
    },
    hidden:true,
    border: false,
    width:'100%',
    items: [
    {
        html: "<div class='datasource_info_panel_title'>Datasource Information</div>"
    },    
    {
        id:'datasource_info_panel',
        xtype: 'box',
        width: '100%',
        html: "Click on a datasource above" //assigned in controller
    },
    {
        html: "<br/><div class='datasource_info_panel_title'>Send to Widgets</div>"
    },
    {
        id:'datasource_widget_assigned_panel',
        xtype: 'box',
        width: '100%',
        html: "" //assigned in controller
    },
    
    {
        xtype: 'dataview',
        cls:'datasource_widget_select',
        id:'datasource_widget_select',
        tpl: Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            //'<div class="datasource_widget" id="datasource_widget_widget_{guid}" tabindex="0" >',
            '   <div class="datasource_widget_thumb-wrap" id="widget_thumb_{guid}">',
            '       <img src="{icon}" class="datasource_widget_thumb" id="widget_img_{guid}">',
            '   </div>',
            '   <div class="datasource_widget_assigned_text" id="datasource_widget_assigned_text_{guid}">{name}</div>',
         //   '   <div class="datasource_widget_assigned_intent" >Actions/Intents:<ul id="datasource_widget_assigned_intent_{guid}"><tpl for="intents.receive"><li class="datasource-intent">{action}</li></tpl><ul></div>',
           // '</div>',
            '</tpl>'
            ),
        store:'SystemWidgets',
        width:'100%',
        flex:1,
        autoScroll:true,
        itemSelector: '.datasource_widget_thumb-wrap',
        emptyText: 'No widgets available',
        multiSelect: false
       /* listeners: {
            el: {
                click: function(cmp){
                    //this.fireEvent('datasource_intent_select',cmp);
                },
                delegate: '.datasource-intent'
            }
        }*/
        
    }
    /*
    {
        xtype: 'dataview',
        cls:'widget_select',
        id:'dashboard_widget_select',
        title:'Widget Selector',
        tpl: Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '<div class="widget widget_data_view" id="widget_{guid}" tabindex="0" >',
            '   <div class="thumb-wrap {style}" id="widget_thumb_{guid}">',
            '       <img src="{icon}" class="thumb" id="widget_img_{guid}">',
            '   </div>',
            '   <div class="thumb-text" id="widget_text_{guid}">{name}</div>',
            '   <div class="thumb-text" id="widget_text_{guid}">{intents}</div>',
            '</div>',
            '</tpl>'
            ),
        store:'SystemWidgets',
        width:'100%',
        flex:1,
        autoScroll:true,
        itemSelector: 'div.thumb-wrap',
        emptyText: 'No images available',
        multiSelect: false
        
    }*/
    ]
});
