module.exports.parse = function(data) {
    'use strict';

    var updateExpressionStatements = [];
    var updateExpression;
    var expressionAttributeNames = {};
    var expressionAttributeValues = {};
    Object.keys(data).forEach(function(k) {
      var expressionNameKey = '#' + k;
      var expressionValueKey = ':' + k;
      expressionAttributeNames[expressionNameKey] = k;
      expressionAttributeValues[expressionValueKey] = data[k];
      updateExpressionStatements.push(expressionNameKey + ' = ' + expressionValueKey);
  });
    updateExpression = 'set ' + updateExpressionStatements.join(', ');
    var expression = {
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
  };

  return expression;
};