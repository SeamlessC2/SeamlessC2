Ext.define('SeamlessC2.store.S2DashboardImages', {
    extend: 'Ext.data.Store',
    fields: ['name', 'url'],
    autoLoad: true,
    storeId:'S2Dashboard',
 
    data: [
        {name: '1',url: 'resources/images/Grid1.png'},
        {name: '2',url: 'resources/images/Grid2.png'},
        {name: '3',url: 'resources/images/Grid3.png'},
        {name: '4',url: 'resources/images/Grid4.png'},
        {name: '5',url: 'resources/images/Grid5.png'},
        {name: '6',url: 'resources/images/Grid6.png'},
        {name: '7',url: 'resources/images/Grid7.png'},
        {name: '8',url: 'resources/images/Grid8.png'}
        
    ]
   
});