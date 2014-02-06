Ext.define('S2Alerts.view.MainView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.main_view',    
    //title: 'Seamless C2',
    border:0,
    defaults: {
        border:0        
    },
    autoScroll:true,
    flex:1,
    height:400,
    items: [
        {xtype:'alerts_view'}
    ]
});