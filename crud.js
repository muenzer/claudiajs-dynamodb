module.exports = function (routes) {
  var ApiBuilder = require('claudia-api-builder');
  var apiCreate = require('./api');

  var api = new ApiBuilder();

  for (var i = 0, len = routes.length; i < len; i++) {
    api = apiCreate(routes[i], api);
  }

  api.addPostDeployConfig('mode', 'Set mode: ', 'mode');

  return api;
};
