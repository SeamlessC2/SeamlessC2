Ext.define('SeamlessC2.store.SystemWidgets', {
    extend: 'Ext.data.ArrayStore',
    storeId:'SystemWidgets',
    fields: ['guid','name','icon','description','path','style','data','intents' ],
    data: [] //filled by controller
});