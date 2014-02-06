Ext.define('S2SmartCow.model.S2SmartCowProcessInstanceModel', {
    extend: 'Ext.data.Model',
    fields: [
        "priority",
            "name",
            "processDefinitionId",
            "startTime",
            "endTime",
            "duration",
            "state",
            "key",
            "id",
            "parentId",            
            "process"
    ],
    associations:[
        {type: 'hasMany',model:'S2SmartCowVariables',name:'variables'},
        {type: 'hasMany',model:'S2SmartCowTask',name:'task'}
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
        {
            "priority": null,
            "name": "PR_Basic-3 Jan 2014 22:43:13 GMT",
            "processDefinitionId": "PR_Basic",
            "startTime": 1388788994000,
            "endTime": null,
            "duration": null,
            "state": "pending",
            "key": "PR_Basic",
            "id": "PR_Basic.82",
            "parentId": null,
            "variables": {
                "variable": [
                    {
                        "name": "processInstanceName",
                        "value": "PR_Basic-3 Jan 2014 22:43:13 GMT"
                    }
                ]
            },
            "task": [
                {
                    "assignee": "mhowansky",
                    "createTime": 1389040335000,
                    "state": "Reserved",
                    "activityName": "_4",
                    "priority": 0,
                    "name": "Task 2",
                    "dueDate": null,
                    "description": "",
                    "duration": null,
                    "endTime": null,
                    "processInstanceId": "PR_Basic.82",
                    "processInstanceUrl": null,
                    "progress": null,
                    "variables": null,
                    "id": "84"
                }
            ],
            "process": null
        },
        {
            "priority": null,
            "name": "PR_Basic_V2-7 Jan 2014 16:51:16 GMT",
            "processDefinitionId": "PR_Basic_V2",
            "startTime": 1389113477000,
            "endTime": null,
            "duration": null,
            "state": "pending",
            "key": "PR_Basic_V2",
            "id": "PR_Basic_V2.85",
            "parentId": null,
            "variables": {
                "variable": [
                    {
                        "name": "processInstanceName",
                        "value": "PR_Basic_V2-7 Jan 2014 16:51:16 GMT"
                    }
                ]
            },
            "task": [
                {
                    "assignee": "mhowansky",
                    "createTime": 1389220599000,
                    "state": "Reserved",
                    "activityName": "_3",
                    "priority": 0,
                    "name": "Run Model",
                    "dueDate": null,
                    "description": "Run DS Model",
                    "duration": null,
                    "endTime": null,
                    "processInstanceId": "PR_Basic_V2.85",
                    "processInstanceUrl": null,
                    "progress": null,
                    "variables": null,
                    "id": "92"
                }
            ],
            "process": null
        },
        {
            "priority": null,
            "name": "chiclet-tester-7 Jan 2014 18:10:42 GMT",
            "processDefinitionId": "chiclet-tester",
            "startTime": 1389118243000,
            "endTime": null,
            "duration": null,
            "state": "pending",
            "key": "chiclet-tester",
            "id": "chiclet-tester.88",
            "parentId": null,
            "variables": {
                "variable": [
                    {
                        "name": "processInstanceName",
                        "value": "chiclet-tester-7 Jan 2014 18:10:42 GMT"
                    }
                ]
            },
            "task": [
                {
                    "assignee": "mhowansky",
                    "createTime": 1389118243000,
                    "state": "Reserved",
                    "activityName": "_3",
                    "priority": 0,
                    "name": "Task 1",
                    "dueDate": null,
                    "description": "",
                    "duration": null,
                    "endTime": null,
                    "processInstanceId": "chiclet-tester.88",
                    "processInstanceUrl": null,
                    "progress": null,
                    "variables": null,
                    "id": "89"
                }
            ],
            "process": null
        }
    ]
}
 */