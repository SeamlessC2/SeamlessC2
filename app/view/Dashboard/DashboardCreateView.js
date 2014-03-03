Ext.define('SeamlessC2.view.Dashboard.DashboardCreateView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dash_create',
    width: '100%',
    //height:300,
    flex:1,
    title: 'Create a Dashboard',
    id:'dashboard_create',
    //autoScroll:true,
    defaults: {
        // applied to each contained panel
        border: false
    },
    layout:'card',
    activeItem: 0, // index or id
    tbar: ['->', {
        id: 'dashboard_create_move_prev',
        text: '&laquo; Previous',
        disabled: true
    },{
        id: 'dashboard_create_move_next',
        text: 'Next &raquo;',
        disabled: true
    }],
    items: [
    {
        xtype:'dash_select'
    },

    {
        xtype:'dash_select_panel'
    },  

    {
        xtype:'panel',
        width: '100%',
        flex:1,
        border:0,
        defaults: {
            border:0        
        },
        layout: {
            type: 'vbox'
        },
        items: [
        {
            html:'',
            width:'100%',
            flex:.1                    
        },
        {
            xtype:'button',
            id:'dashpicker_createbtn',
            //width:'100%',
            height:20,
            cls: 'dash_finish_btn',
            text:'Create Dashboard',
            align:'center'
        },    
        {
            html:'',
            width:'100%',
            flex:.8
        }
        ]
    }
    ]
});