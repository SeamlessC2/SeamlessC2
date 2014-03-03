Ext.define('SeamlessC2.view.Datasource.DatasourceView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.datasource_view',
    id:'datasource_view',
    
    width:160,
    height:300, 
    layout: {
        type: 'accordion'
    },
    items: [
    {
        title:'Datasources',
        xtype: 'datasource_treeview'
       
    },
    {
        title: 'Add Datasource',
        xtype:'datasource_select'
    }
    ]
});

