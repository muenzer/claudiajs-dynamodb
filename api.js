module.exports = function (route, api) {
  // GET    /posts
  // GET    /posts/1
  // POST   /posts
  // PUT    /posts/1
  // PATCH  /posts/1
  // DELETE /posts/1

  var lib = require('./lib.js');
  var config = require('./config.js');

  var root = '/' + route;

  api.addPostDeployConfig(route + 'Table', 'Enter a table name for ' + route + ':', route + 'Table');

  api.get(root, function (request) {
    var dynamo = config.dynamo(route, request);

    var options = lib.querystring(request.queryString);

    return lib.scan(dynamo, options).then(function (response) {
      var url = root;
      var link = lib.buildLink(url, response);
      if(link) {
        return new api.ApiResponse(response.Items, {'link': link});
      } else {
        return response.Items;
      }
    });
  });

  api.get(root + '/{id}', function (request) {
    var dynamo = config.dynamo(route, request);

    var options = lib.querystring(request.queryString);

    var id = decodeURIComponent(request.pathParams.id);

    var key = {
      id: id
    };

    return lib.get(key, dynamo, options);
  });

  api.post(root, function (request) {
    var dynamo = config.dynamo(route, request);

    var data = request.body;
    var options = lib.querystring(request.queryString);

    return lib.create(data, dynamo, options);
  });

  api.put(root + '/{id}', function (request) {
    var dynamo = config.dynamo(route, request);

    var data = request.body;
    var options = lib.querystring(request.queryString);

    var id = decodeURIComponent(request.pathParams.id);

    data.id = id;

    return lib.create(data, dynamo, options);
  });

  api.patch(root + '/{id}', function (request) {
    var dynamo = config.dynamo(route, request);

    var data = request.body;

    var id = decodeURIComponent(request.pathParams.id);

    var key = {
      id: id
    };

    return lib.update(key, data, dynamo);
  });

  api.delete(root + '/{id}', function (request) {
    var dynamo = config.dynamo(route, request);

    var id = decodeURIComponent(request.pathParams.id);

    var key = {
      id: id
    };

    return lib.delete(key, dynamo);
  });

  return api;
};
