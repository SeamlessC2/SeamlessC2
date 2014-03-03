Ext.define('SeamlessC2.view.Dashboard.DashboardSelectView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dash_select',
    width: '100%',
    //height:300,
    flex:1,
    //title: 'Create a Dashboard',
    border:0,
    //autoScroll:true,
    defaults: {
        border:0        
    },
    layout: {
        type: 'vbox'
    },
    items: [
    {
        html:"Select dashboard layout",
        height:30
    },
    {       
        xtype: 'dataview',
        cls:'dash_select',
        id:'dashboard_layout_select',
        itemId:'dashboard_layout_select',
        tpl: Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '<div class="dashpicker-grid" >',
            '<div class="dashpicker-thumb"><img src="{url}" title="{name}"></div>',
           // '<span class="daspicker-name">{name}</span>',
            '</div></tpl>'
            ),
        store: 'S2DashboardImages',
        itemSelector: 'div.dashpicker-thumb',
        width:'100%',
        height:"100%",
        autoScroll:true
    }
    ]
});