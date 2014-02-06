Ext.define('S2SmartCow.view.MainView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.main_view',
    width: '100%',
    height:300,
    //title: 'Seamless C2',
    border:0,
    
    defaults: {
        border:0        
    },
    layout: {
        type: 'vbox'
    },
    items: [
        {xtype:'tasks_view'}
    ]
});