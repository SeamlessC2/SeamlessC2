Ext.define('S2Alerts.store.S2Alerts', {
    extend: 'Ext.data.Store',
    model:'S2Alerts.model.S2AlertsModel',
    autoLoad: true,

    proxy: {
        type: 'ajax',
        api: {
            read: 'data/alerts.json'
        },
        reader: {
            type: 'json',
            root: 'alerts',
            successProperty: 'success'
        }
    }
});