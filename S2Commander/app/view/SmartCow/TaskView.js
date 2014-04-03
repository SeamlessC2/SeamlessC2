//Date Formats: uses javascript Date.parse 
//ISO 8601 date format or UTC whatever
Ext.define('SeamlessC2.view.SmartCow.TaskView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.smart_cow_task_view',
    id:'smart_cow_task_view',
    model:'SeamlessC2.model.SmartCowTaskModel',
    title: 'Tasks'
    
});
