var expand = function (item, options, dynamo) {
  var get = require('./get');

  var localDynamo = Object.assign({}, dynamo);
  localDynamo.tableName = options.expand.relTable;

  return get({id: item[options.expand.relId]}, localDynamo);
};

module.exports = function (response, options, dynamo) {
  if(response.Items) {
    return Promise.all(response.Items.map(function (item) {
      return expand(item, options, dynamo);
    })).then(function (expansion) {
      expansion.forEach(function (count, index) {
        response.Items[index][options.expand.relLabel] = expansion[index];
      });
      return response;
    });
  } else {
    return expand(response.Item, options, dynamo)
    .then(function (expansion) {
      response.Item[options.expand.relLabel] = expansion;
      return response;
    });
  }
};
