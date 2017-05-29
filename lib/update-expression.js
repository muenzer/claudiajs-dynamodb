module.exports.parse = function(data) {
    'use strict';

    var setExpressionStatements = [];
    var removeExpressionStatements = [];
    var updateExpression = '';
    var expressionAttributeNames = {};
    var expressionAttributeValues = {};
    Object.keys(data).forEach(function(k) {
      var expressionNameKey = '#' + k;
      expressionAttributeNames[expressionNameKey] = k;
      if(data[k]) {
        var expressionValueKey = ':' + k;
        expressionAttributeValues[expressionValueKey] = data[k];
        setExpressionStatements.push(expressionNameKey + ' = ' + expressionValueKey);
      } else {
        removeExpressionStatements.push(expressionNameKey);
      }
  });
    if(setExpressionStatements.length) {
      updateExpression = updateExpression + 'SET ' + setExpressionStatements.join(', ');
    }
    if(removeExpressionStatements.length) {
      updateExpression = updateExpression + ' REMOVE ' + removeExpressionStatements.join(', ');
    }
    var expression = {
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
  };

  return expression;
};
