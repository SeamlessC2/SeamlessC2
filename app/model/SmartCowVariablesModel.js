Ext.define('SeamlessC2.model.SmartCowVariablesModel', {
    extend: 'Ext.data.Model',
    belongsTo:'SmartCowProcessInstanceModel',
    fields: [],
    hasMany  : {model: 'SmartCowVariableModel', name: 'variable'}
});