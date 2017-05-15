module.exports = function (response, options, dynamo) {
  console.log(options);

  var get = require('./get');

  return Promise.all(response.Items.map(function (item) {
    dynamo.tableName = options.expand.relTable;
    return get({id: item[options.expand.relId]}, dynamo);
  })).then(function (expansion) {
    expansion.forEach(function (count, index) {
      response.Items[index][options.expand.relLabel] = expansion[index];
    });

    return response;
  });

};
