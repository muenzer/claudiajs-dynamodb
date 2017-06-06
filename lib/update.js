module.exports = function(key, body, dynamo, conditions) {
  var update_expression = require('./update-expression');

  var params = {
    TableName : dynamo.tableName,
    Key: key,
    ReturnValues: 'ALL_NEW'
  };

  Object.keys(key).forEach(function(keyName) {
    delete body[keyName];
  });

  body.UpdatedAt = new Date().getTime();

  Object.assign(params, update_expression.parse(body, conditions));

  return dynamo.doc.update(params).promise().then(function (response) {
    return response.Attributes;
  });
};
