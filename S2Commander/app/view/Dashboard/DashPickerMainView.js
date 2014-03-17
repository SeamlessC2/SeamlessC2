Ext.define('SeamlessC2.view.Dashboard.DashPickerMainView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dash_picker_main_view',
    width: '100%',
    //height:300,
    border:0,    
    defaults: {
        border:0        
    },
    autoScroll: true,
    layout: {
        type: 'accordion'
    },
    items: [
    {
        xtype: 'dashpicker_view',
        title:'Goto a Dashboard'
    },
    {
        xtype: 'dash_create',
        title:'Create a Dashboard'
    }
    ]
});