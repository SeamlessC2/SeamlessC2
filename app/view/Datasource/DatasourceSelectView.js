Ext.define('SeamlessC2.view.Datasource.DatasourceSelectView', {
    extend: 'Ext.Panel',
    alias: 'widget.datasource_select',
    layout: {
        type: 'vbox'
        ,align: 'center'
    },
    border: false,
    width:'100%',
    items: [
    {
        html: "<div class='sourcePanel'>Select a Tailor Data Source</div>"
    },
    /*
    {
        xtype: 'dataview',
        cls:'tailor_select',
        id:'tailor_select',
        tpl: Ext.create('Ext.XTemplate',
            '<tpl for="."><div class="tailor_grid">',
            '<div class="tailor_grid_desc"><a href="{Url}" target="_blank">view</a>',
            '<div class="tailor_grid_name" >{name}</div>',
            '</div></tpl>'
            ),
        store: 'TailorSources',
        itemSelector: 'div.tailor_grid',
        width:'100%',
        height:100,
        autoScroll:true
    },*/
    
    {
        xtype:'combobox',
        id:'tailor_combobox',
        title:'Tailor Sources',
        store: 'TailorSources',
        rootVisible: false,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name'
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
        id:'urlInput',
        name: 'urlInput',
        label: "Web Address",
        hideLabel: 'true'
    },
    
    {
        xtype:'button',
        title:'Add Datasource',
        id:'add_datasource_btn',
        text:'Add datasource'
    }
    ]
});
