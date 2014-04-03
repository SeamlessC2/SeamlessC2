Ext.define('SeamlessC2.view.Manager.AlertsCardView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.alerts_card_view',    
    id:'alerts_card_view',
    width: '100%',
    //height:300,
    flex:1,
    title: 'Alerts',
    //autoScroll:true,
    defaults: {
        // applied to each contained panel
        border: false
    },
    layout:'card',
    activeItem: 0, // index or id
    navigate:function( direction){
        var layout = this.getLayout();
        layout[direction]();
        Ext.getCmp('alerts_move_prev').setDisabled(!layout.getPrev());
        Ext.getCmp('alerts_move_next').setDisabled(!layout.getNext());
    },
    tbar: ['->', {
        id: 'alerts_move_prev',
        text: '&laquo; Previous',
        disabled: true,
        handler: function(btn) {
           btn.up("panel").navigate("prev");
        }
    },{
        id: 'alerts_move_next',
        text: 'Next &raquo;',
        disabled: true,
        handler: function(btn) {
                btn.up("panel").navigate("next");
            }
    }],
    store:'Alerts'
});
