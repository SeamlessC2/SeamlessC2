Ext.define('SeamlessC2.view.Datasource.DatasourceTreeView', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.datasource_treeview',
    id:'datasource_treeview',
    title:'Datasources',
    store: 'S2Datasource',
    rootVisible: false
});
