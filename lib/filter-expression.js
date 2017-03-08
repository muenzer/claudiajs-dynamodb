module.exports.parse = function(data) {
    'use strict';

    var keyExpressionStatements = [];
    var keyConditionExpression;
    var expressionAttributeNames = {};
    var expressionAttributeValues = {};
    Object.keys(data).forEach(function(k) {
      var expressionNameKey = '#' + k;
      var expressionValueKey = ':' + k;
      expressionAttributeNames[expressionNameKey] = k;
      expressionAttributeValues[expressionValueKey] = data[k];
      keyExpressionStatements.push(expressionNameKey + ' = ' + expressionValueKey);
  });
    keyConditionExpression = keyExpressionStatements.join(' and ');
    var expression = {
      FilterExpression: keyConditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
  };

  return expression;
};
