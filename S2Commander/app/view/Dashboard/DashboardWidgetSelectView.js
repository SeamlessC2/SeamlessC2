Ext.define('SeamlessC2.view.Dashboard.DashboardWidgetSelectView', {
    extend: 'Ext.Panel',
    alias: 'widget.dashboard_widget_select',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    border: false,
    width:'100%',
    items: [    
    {
        html:"<div class='widget_select_hdr'>Select a widget for this data. <br/><span class='widget_recommended'>Recommended widgets are highlighted</span></div>"
    },     
    {
        xtype: 'dataview',
        cls:'widget_select',
        id:'dashboard_widget_select',
        tpl: Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '<div class="widget widget_data_view {style}" id="widget_{guid}" tabindex="0" >',
            '   <div class="thumb-wrap " id="widget_thumb_{guid}">',
            '       <img src="{icon}" class="thumb" id="widget_img_{guid}">',
            '   </div>',
            '   <div class="thumb-text" id="widget_text_{guid}">{name}</div>',
            '</div>',
            '</tpl>'
            ),
        store:'SystemWidgets',
        width:'100%',
        flex:1,
        autoScroll:true,
        itemSelector: 'div.thumb-wrap',
        emptyText: 'No images available',
        multiSelect: false
        
    }
                
    ]
});
