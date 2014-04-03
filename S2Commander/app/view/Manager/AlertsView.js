 //Date Formats: uses javascript Date.parse 
 //ISO 8601 date format or UTC whatever
Ext.define('SeamlessC2.view.Manager.AlertsView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.alerts_view',
    id:'alerts_view',
    store:'Alerts',
    title: 'Alerts',
    autoScroll:true,
    items: {       
        xtype: 'dataview',
        tpl: Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '<div class="alert-item">',
          '<div class="alert-title">{name}</div>',
          '<div class="alert-date">{date:date("F j, Y, g:i a")}</div>',
         //   '<a href="http://sencha.com/forum/showthread.php?t={topicId}&p={postId}" target="_blank">{title}</a></h3>',
            '<div class="alert-msg">{msg}</div>',
            '</div></tpl>'
            ),
        store: 'Alerts',
        itemSelector: 'div.alert-item'
    }
});