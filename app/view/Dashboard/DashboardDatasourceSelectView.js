Ext.define('SeamlessC2.view.Dashboard.DashboardDatasourceSelectView', {
    extend: 'Ext.Panel',
    alias: 'widget.dashboard_datasource_select',
    layout: {
        type: 'vbox'
        ,
        align: 'center'
    },
    border: false,
    width:'100%',
    items: [
    {
        html: "<div class='sourcePanel'>Select a Tailor Data Source</div>"
    },
    {
        xtype:'combobox',
        id:'dash_tailor_combobox',
        title:'Tailor Sources',
        store: 'TailorSources',
        rootVisible: false,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        listeners:{
            change: function() {
                if (this.getValue() === null) {
                    this.reset();
                }
            }
        }
    },
    {
        html: "",
        height:20
    },
    {
        html: "<div class='sourcePanel'>Add URL Data Source</div>"
    //,bodyStyle: "background: #DFE9F6; border: 0px;"
    },
    {
        xtype: 'textfield',
        id:'dash_urlInput',
        name: 'urlInput',
        label: "Web Address",
        hideLabel: 'true'
    },
    
    {
        xtype:'button',
        title:'Add Datasource',
        id:'dash_add_datasource_btn',
        text:'Add datasource'
    }
    ]
});
