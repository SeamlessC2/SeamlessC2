Ext.define('S2SmartCow.view.TasksView', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tasks_view',
    id:'tasks_view',
    store: 'S2SmartCowTasks',
    title:'User Process Instances',
    hideHeaders: false,
    autoShow:true,
    columns: [
        { header: 'Name',  dataIndex: 'name' },
        { header: 'Key',  dataIndex: 'key' },
        { header: 'State',  dataIndex: 'state' },
        { header: 'startTime',  dataIndex: 'startTime' },
        { header: 'endTime',  dataIndex: 'endTime' },
        { header: 'State',  dataIndex: 'state' }
    ]
    
});


/*
 {
    "processInstance": [
        {
            "priority": null,
            "name": "PR_Basic-21 Oct 2013 17:10:29 GMT",
            "processDefinitionId": "PR_Basic",
            "startTime": 1382375431000,
            "endTime": null,
            "duration": null,
            "state": "pending",
            "key": "PR_Basic",
            "id": "PR_Basic.54",
            "parentId": null,
            "variables": {
                "variable": [
                    {
                        "name": "processInstanceName",
                        "value": "PR_Basic-21 Oct 2013 17:10:29 GMT"
                    }
                ]
            },
            "task": [
                {
                    "assignee": "mhowansky",
                    "createTime": 1382375431000,
                    "state": "Reserved",
                    "activityName": "_2",
                    "priority": 0,
                    "name": "Task 1",
                    "dueDate": null,
                    "description": "",
                    "duration": null,
                    "endTime": null,
                    "processInstanceId": "PR_Basic.54",
                    "processInstanceUrl": null,
                    "progress": null,
                    "variables": null,
                    "id": "55"
                }
            ],
            "process": null
        },
        ...
    ]
}
 */