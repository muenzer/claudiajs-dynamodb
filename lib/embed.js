module.exports = function (response, options, dynamo) {
  console.log(options);

  var scan = require('./scan');

  return Promise.all(response.Items.map(function (item) {
    var localDynamo = Object.assign({}, dynamo);
    localDynamo.tableName = options.embed.relTable;

    var scanOptions = {
      filter: {}
    };
    scanOptions.filter[options.embed.relId] = item.id;
    return scan(localDynamo, scanOptions);
  })).then(function (expansion) {
    expansion.forEach(function (count, index) {
      response.Items[index][options.embed.relLabel] = expansion[index].Items;
    });

    return response;
  });

};
