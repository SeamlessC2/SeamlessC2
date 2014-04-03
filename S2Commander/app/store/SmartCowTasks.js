Ext.define('SeamlessC2.store.SmartCowTasks', {
    extend: 'Ext.data.Store',
    model:'SeamlessC2.model.SmartCowProcessInstanceModel',
    //autoLoad: true,
    storeId:'SmartCowTasks',
    proxy: {
        type: 'ajax',
        api: {
            read: '' //set in controller onload
        },
        reader: {
            type: 'json',
            root: 'processInstance'
        //successProperty: 'success'
        }
    }
});