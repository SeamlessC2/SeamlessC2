Ext.define('SeamlessC2.view.Dashboard.DashboardDatasourceWidgetView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dashboard_datasource_widget_select',
    width: '100%',
    //height:300,
    flex:1,
    id:'dashboard_datasource_widget_select',
    //autoScroll:true,
    defaults: {
        // applied to each contained panel
        border: false
    },
    layout:'card',
    activeItem: 0, // index or id
    tbar: ['->', {
        id: 'dashboard_datasource_widget_move_prev',
        text: '&laquo; Previous',
        handler: function(btn) {
            var layout = btn.up("panel").getLayout();
            layout["prev"]();
             Ext.getCmp('dashboard_datasource_widget_move_prev').setDisabled(true);
             Ext.getCmp('dashboard_datasource_widget_move_next').setDisabled(false);
        },
        disabled:true
    },{
        id: 'dashboard_datasource_widget_move_next',
        text: 'Next &raquo;',
        handler: function(btn) {
            var layout = btn.up("panel").getLayout();
            layout["next"]();
            Ext.getCmp('dashboard_datasource_widget_move_prev').setDisabled(false);
            Ext.getCmp('dashboard_datasource_widget_move_next').setDisabled(true);
        }
    }],
    items: [
    {
        xtype:'dashboard_datasource_select'
    },

    {
        xtype:'dashboard_widget_select'
    }
    ]
});