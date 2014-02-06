Ext.define('S2SmartCow.model.S2SmartCowVariableModel', {
    extend: 'Ext.data.Model',
     belongsTo: 'S2SmartCowVariablesModel',
    fields: [
                   "name",
                        "value"             
    ]      
});
