Ext.define('SeamlessC2.view.Datasource.DatasourceMainContentView', {
    extend: 'Ext.Panel',
    alias: 'widget.datasource_main_content_view',
    layout: {
        type: 'vbox',
        align: 'left'
    },
    border: false,
    width:'100%',
    items: [
    {
        //title:'Datasources',
        width: '100%',
        xtype: 'datasource_list_grid_view', //'datasource_treeview'
        flex:1,
        autoScroll:true
    },
    
    {
        xtype:'datasource_info_view',
        flex:2,
         autoScroll:true
    }
    ]
});
