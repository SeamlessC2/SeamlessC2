Ext.define('SeamlessC2.view.Datasource.DatasourceListGridView', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.datasource_list_grid_view',
    id:'datasource_list_grid_view',
    store: 'S2DatasourceList',
    //title:'Datasources',
    hideHeaders: true,
    width:'100%',
    autoShow:true,
    columns: [
        { header: 'Source',  dataIndex: 'source',flex:1 },
        { header: 'Name',  dataIndex: 'name',flex:3}
    ]
    
});
