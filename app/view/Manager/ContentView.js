Ext.define('SeamlessC2.view.Manager.ContentView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.content_view',
    id: 'content_view',
    width: '100%',
    flex:1,
    //height:'100%',// 300,//258,
    border:0,
    cls:'content_view',
    defaults: {
        border:0
    },
    layout: {
        type: 'card'
    },
    items: [ 
        {html:"Welcome to Seamless C2"},
        {xtype:'dash_picker_main_view' } ,
        {xtype:'datasource_view' } ,
        {xtype:'smart_cow_tasks_view'},
        {xtype: 'alerts_view'}
    ]
});