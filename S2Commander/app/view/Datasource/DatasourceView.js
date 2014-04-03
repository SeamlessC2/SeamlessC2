Ext.define('SeamlessC2.view.Datasource.DatasourceView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.datasource_view',
    id:'datasource_view',
    
    flex:1,
    height:300, 
    layout: {
        type: 'accordion'
    },
    items: [
    {
        title:'Datasources',
        xtype: 'datasource_main_content_view'
       
    },
    {
        title: 'Add Datasource',
        xtype:'datasource_select'
    }
    
    ]
});

