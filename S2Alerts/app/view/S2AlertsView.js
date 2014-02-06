 //Date Formats: uses javascript Date.parse 
 //ISO 8601 date format or UTC whatever
Ext.define('S2Alerts.view.S2AlertsView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.alerts_view',
    id:'alerts_view',
    store:'S2Alerts',
    title: 'Alerts',
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
        store: 'S2Alerts',
        itemSelector: 'div.alert-item'
    }
    /*,
    dockedItems: [{
        dock: 'bottom',
        xtype: 'pagingtoolbar',
        store: 'S2Alerts',
        pageSize: 25,
        displayInfo: true,
        displayMsg: 'Alerts {0} - {1} of {2}',
        emptyMsg: 'No alerts to display'
    }]*/
});