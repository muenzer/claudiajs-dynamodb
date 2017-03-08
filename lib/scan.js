module.exports.respond = function(dynamo, options) {
  var filter_expression = require('./filter-expression');

  var params = {
    TableName: dynamo.tableName,
    Limit: 20
  };

  if(options) {
    if(options.index) {
      params.IndexName = options.index;
    }

    if(options.limit) {
      params.Limit = options.limit;
    }

    if(options.last) {
      params.ExclusiveStartKey = options.last;
    }

    if(options.filter) {
      Object.assign(params, filter_expression.parse(options.filter));
    }

  }

  return dynamo.doc.scan(params).promise().then(function (response) {
    return response;
  });
};
