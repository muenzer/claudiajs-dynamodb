var embed = function (item, options, dynamo) {
  var scan = require('./scan');

  var localDynamo = Object.assign({}, dynamo);
  localDynamo.tableName = options.embed.relTable;

  var scanOptions = {
    filter: {}
  };
  scanOptions.filter[options.embed.relId] = item.id;
  return scan(localDynamo, scanOptions);
};

module.exports = function (response, options, dynamo) {
  if(response.Items) {
    return Promise.all(response.Items.map(function (item) {
      return embed(item, options, dynamo);
    })).then(function (expansion) {
      expansion.forEach(function (count, index) {
        response.Items[index][options.embed.relLabel] = expansion[index].Items;
      });

      return response;
    });
  } else {
    return embed(response.Item, options, dynamo)
    .then(function (expansion) {
      response.Item[options.embed.relLabel] = expansion.Items;
      return response;
    });
  }
};
