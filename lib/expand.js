module.exports = function (response, options, dynamo) {
  console.log(options);

  var get = require('./get');

  return Promise.all(response.Items.map(function (item) {
    var localDynamo = Object.assign({}, dynamo);
    localDynamo.tableName = options.expand.relTable;

    return get({id: item[options.expand.relId]}, localDynamo);
  })).then(function (expansion) {
    expansion.forEach(function (count, index) {
      response.Items[index][options.expand.relLabel] = expansion[index];
    });

    return response;
  });

};
