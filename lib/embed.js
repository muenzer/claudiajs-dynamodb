module.exports = function (response, options, dynamo) {
  console.log(options);

  var scan = require('./scan');

  return Promise.all(response.Items.map(function (item) {
    dynamo.tableName = options.embed.relTable;
    var scanOptions = {
      filter: {}
    };
    scanOptions.filter[options.embed.relId] = item.id;
    return scan(dynamo, scanOptions);
  })).then(function (expansion) {
    console.log('expansion', expansion[0].Items);
    expansion.forEach(function (count, index) {
      response.Items[index][options.embed.relLabel] = expansion[index].Items;
    });

    return response;
  });

};
