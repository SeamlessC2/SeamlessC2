Ext.define('S2SmartCow.store.S2SmartCowTasks', {
    extend: 'Ext.data.Store',
    model:'S2SmartCow.model.S2SmartCowProcessInstanceModel',
    autoLoad: true,
    storeId:'S2SmartCowTasks',
    proxy: {
        type: 'ajax',
        api: {
            read: SMARTCOW_URL+"processInstances/tasks.json?assignee=" //set in controller onload
        },
        reader: {
            type: 'json',
            root: 'processInstance'
            //successProperty: 'success'
        }
    }
   
});