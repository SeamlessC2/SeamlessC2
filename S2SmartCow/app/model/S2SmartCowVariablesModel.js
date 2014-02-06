Ext.define('S2SmartCow.model.S2SmartCowVariablesModel', {
    extend: 'Ext.data.Model',
    belongsTo:'S2SmartCowProcessInstanceModel',
    fields: [],
    hasMany  : {model: 'S2SmartCowVariableModel', name: 'variable'}
});