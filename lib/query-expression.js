var objectMerge = require('object-merge');

module.exports.parse = function(data) {
    'use strict';

    var keyExpressionStatements = [];
    var keyConditionExpression;
    var expressionAttributeNames = {};
    var expressionAttributeValues = {};
    var raw = {};

    if(!Array.isArray(data)) {
      Object.keys(data).forEach(function (k) {
        if(k.substring(0,4) == 'raw.') {
          raw[k.substring(4,k.length)] = data[k]
        } else {
          var expressionNameKey = '#' + k;
          var expressionValueKey = ':' + k;
          expressionAttributeNames[expressionNameKey] = k;
          expressionAttributeValues[expressionValueKey] = data[k];
          keyExpressionStatements.push(expressionNameKey + ' = ' + expressionValueKey);
        }
      });
    } else if (Array.isArray(data)) {
      data.forEach(function (k) {
        var expressionNameKey = '#' + k.attribute;
        var expressionValueKey = ':' + k.attribute;
        expressionAttributeNames[expressionNameKey] = k.attribute;
        expressionAttributeValues[expressionValueKey] = k.value;
        if(k.operator == 'begins_with') {
          keyExpressionStatements.push('begins_with(' + expressionNameKey + ',' + expressionValueKey + ")");
        } else {
          keyExpressionStatements.push(expressionNameKey + ' ' + k.operator + ' ' + expressionValueKey);
        }
      });
    }

    keyConditionExpression = keyExpressionStatements.join(' and ');
    var expression = {
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
  };

  return objectMerge(expression, raw);
};
