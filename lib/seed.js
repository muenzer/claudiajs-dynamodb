module.exports = function (data, dynamo) {
  var create = require('./create');

  var seeds = data.map(function (item) {
    return create(item, dynamo);
  });

  return Promise.all(seeds)
  .then(function (response) {
    return response.length;
  });
};
