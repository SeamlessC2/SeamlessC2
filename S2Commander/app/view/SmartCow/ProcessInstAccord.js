Ext.define('SeamlessC2.view.SmartCow.ProcessInstAccord', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.smart_cow_proc_inst_accord',
    id:'smart_cow_proc_inst_accord',
    store: 'SmartCowTasks',
    title:'User Tasks',
    width: '100%',
    border:0,    
    defaults: {
        border:0        
    },
    autoScroll: true,
    layout: {
        type: 'accordion'
    },
    items: []
});