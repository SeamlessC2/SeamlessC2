var initSeamlessC2 = function(){           
    Ext.application({
        requires: ['Ext.container.Viewport'],    
        name: 'SeamlessC2',
        appFolder: 'app',
        controllers: [
        'Manager'
        ],
        launch: function() {                                
            Ext.create('Ext.container.Viewport', {
                id: "main-panel",
                defaults: {
                    border:false
                },
                width: '100%',
                height: '100%',                   
                items: [
                {
                    xtype: 'mainview'
                }
                ]
            });
        }
    });
};

owfdojo.addOnLoad(function() {   
    //OWF.relayFile = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';
    
    if(OWF.Util.isRunningInOWF()) {
        OWF.ready(function(){            
            initSeamlessC2();
        });
    }
});


           
