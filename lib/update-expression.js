module.exports.parse = function(data, conditions) {
  'use strict';

  var setExpressionStatements = [];
  var removeExpressionStatements = [];
  var conditionExpressionStatements = [];
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

  if(conditions) {
    Object.keys(conditions).forEach(function(k) {
      var expressionNameKey = '#con_' + k;
      expressionAttributeNames[expressionNameKey] = k;
      var expressionValueKey = ':con_' + k;
      if(typeof(conditions[k]) !== 'object') {
        expressionAttributeValues[expressionValueKey] = conditions[k];
        conditionExpressionStatements.push(expressionNameKey + ' = ' + expressionValueKey);
      }
      if (typeof(conditions[k]) === 'object') {
        expressionAttributeValues[expressionValueKey] = conditions[k].value;
        conditionExpressionStatements.push(expressionNameKey + ' ' + conditions[k].operator + ' ' + expressionValueKey);
      }
    });
  }

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

  if(conditionExpressionStatements.length) {
    expression.ConditionExpression = conditionExpressionStatements.join(' and ');
  }

  return expression;
};
