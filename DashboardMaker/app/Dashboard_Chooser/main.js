var widget_controller = null;
var dashboard_controller = null;
owfdojo.addOnLoad(function() {
    OWF.ready(function(){
        widget_controller = new WidgetController();
        widget_controller.init();
        
        dashboard_controller = new DashboardController();
        dashboard_controller.init();
    

        var main_banner = generateBannerPanel("Select Layout ", "<div style='text-align: center' class='centered'>Select a layout for your new Dashboard</div>");

        var dashchooser = dashboard_controller.getDashboardLayoutDataView();
        var main_panel = Ext.create('Ext.Panel', {
            id: "main_panel",
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: false,
            defaults: {
                border:false
            },
            items: [
            main_banner,
            dashchooser,
            {
                html: "", 
                height: 20
            }
            ]
        });

        Ext.application({
            name: 'DataComposer',
            launch: function() {
                Ext.create('Ext.container.Viewport', {
                    id: "dashboard_chooser",
                    layout: 'card',
                    //width: 600,
                    //height: 350,
                    border: false,
                    items: [
                        main_panel
                    ]
                });            
            }
        });
    });
});
//OWF.Eventing.publish("hello", "world");
/*
var getPrefSuccess = function(successObject) {
	log("Success in getting: ", successObject);
	if (successObject) {
		if (successObject.value) {
			var data = Ext.JSON.decode(successObject.value);
			log("Sending to name: ", data[0]);
			log("Sending message: ", data[1]);

			OWF.Eventing.publish(data[0], data[1]);
		}
	}
}

var getPrefFailure = function(error) {
	log("Error in getting: ", error);
}

for(var i = 0; i<4; i++){
	Ozone.pref.PrefServer.getUserPreference(
		{	
			namespace:'dashboardbuilder.seamlessc2.mitre.org', 
			 name:'data'+i,
			 onSuccess:getPrefSuccess, 
			 onFailure:getPrefFailure
		}
	);
}
*/

/*
var setPrefSuccess = function(successObject) {
	log("Success in setting: ", successObject);
}

var setPrefFailure = function(error) {
	log("Error in setting: ", error);
}


Ozone.pref.PrefServer.setUserPreference(
	{	
		namespace:'dashboardbuilder.seamlessc2.mitre.org', 
		 name:'testPreference',
		 value: Ext.JSON.encode(["hello", "world"]),
		 onSuccess:setPrefSuccess, 
		 onFailure:setPrefFailure
	}
);


var getPrefSuccess = function(successObject) {
	log("Success in getting: ", successObject);
	log("Value is: ", Ext.JSON.decode(successObject.value));
	
	//OWF.Eventing.publish(dataName, dataSet);
}

var getPrefFailure = function(error) {
	log("Error in getting: ", error);
}


Ozone.pref.PrefServer.getUserPreference(
	{	
		namespace:'dashboardbuilder.seamlessc2.mitre.org', 
		 name:'testPreference',
		 onSuccess:getPrefSuccess, 
		 onFailure:getPrefFailure
	}
);
*/


log("main.js loaded");

/*
 
 var source_selector = generateSourceSelector();

Ext.application({
    name: 'DataComposer',
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                //widget_chooser_panel,
                source_selector
//                example_panel1
                //example_panel2,
                //example_panel4,
            ]
        });
            
    }
});

*/