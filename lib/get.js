module.exports = function(key, dynamo, options) {
  var params = {
    TableName : dynamo.tableName,
    Key: key
  };

  return dynamo.doc.get(params).promise()
  .then(function (response) {
    if(options && options.expand) {
      var expand = require('./expand');
      return expand(response, options, dynamo);
    } else if (options && options.embed) {
      var embed = require('./embed');
      var pluralize = require('pluralize');
      options.embed.relId = pluralize.singular(dynamo.tableName) + 'Id';
      return embed(response, options, dynamo);
    } else {
      return response;
    }
  })
  .then(function (response) {
    return response.Item;
  });
};
