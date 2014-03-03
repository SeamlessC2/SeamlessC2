Ext.define('SeamlessC2.view.Dashboard.DashboardSelectPanelView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dash_select_panel',
    width: '100%',
    flex:1,
    border:0,
    defaults: {
        border:0        
    },
    layout: {
        type: 'vbox'
    },
    items: [
    {
        id:'dashboard_layout_select_panel_hdr',
        width:'100%'
    //html updated in controller
    },
    {               
        id:"dashboard_layout_select_panel_img",
        //html updated in controller
         width:'100%',
        height:70
    },    
    {
        xtype:'dashboard_datasource_widget_select',
        height:300, 
        autoScroll:true
    }
    ]
});