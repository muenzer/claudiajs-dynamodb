module.exports = function(body, dynamo, options) {
  var query_expression = require('./query-expression');
  var filter_expression = require('./filter-expression');
  var expand = require('./expand');
  var embed = require('./embed');
  var pluralize = require('pluralize');

  var params = query_expression.parse(body);

  params.TableName = dynamo.tableName;
  params.Limit = 20;

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
      var filter = filter_expression.parse(options.filter);
      params.FilterExpression = filter.FilterExpression;
      if(params.ExpressionAttributeNames) {
        Object.assign(params.ExpressionAttributeNames, filter.ExpressionAttributeNames);
      } else {
        params.ExpressionAttributeNames = filter.ExpressionAttributeNames;
      }

      if(params.ExpressionAttributeValues) {
        Object.assign(params.ExpressionAttributeValues, filter.ExpressionAttributeValues);
      } else {
        params.ExpressionAttributeValues = filter.ExpressionAttributeValues;
      }
    }
  }

  return dynamo.doc.query(params).promise().then(function (response) {
    return response;
  })
  .then(function (response) {
    if(options && options.expand) {
      return expand(response, options, dynamo);
    } else if (options && options.embed) {
      options.embed.relId = pluralize.singular(dynamo.tableName) + 'Id';
      return embed(response, options, dynamo);
    } else {
      return response;
    }
  });
};
