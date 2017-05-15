module.exports = function(dynamo, options) {
  var filter_expression = require('./filter-expression');
  var expand = require('./expand');
  var embed = require('./embed');
  var pluralize = require('pluralize');

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

  return dynamo.doc.scan(params).promise()
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
