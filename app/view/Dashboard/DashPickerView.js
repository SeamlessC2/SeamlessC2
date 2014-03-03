Ext.define('SeamlessC2.view.Dashboard.DashPickerView', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.dashpicker_view',
    id:'dashpicker_view',
    store: 'S2Dashboard',
    title:'Dashboards',
    hideHeaders: true,
    columns: [
        { header: 'Go To Dashboard',  dataIndex: 'name' },
        {}
    ],
    width:'100%'
    
});