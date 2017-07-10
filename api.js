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

  // api.addPostDeployStep('databaseConfig', function (options, lambdaDetails, utils) {
  // 	'use strict';
  // 	var config = options['dbConfig'];
  // 	if (!config) {
  // 		return;
  // 	}
  //
  //   var tables = require('./' + options['dbConfig']);
  //
  //   var dynamodb = new utils.AWS.DynamoDB({region: lambdaDetails.region});
  //
  //   var createTables = tables.map(function (params) {
  //     return dynamodb.createTable(params).promise();
  //   });
  //
  //   return Promise.all(createTables)
  //   .then(function () {
  //     return 'tables created';
  //   })
  //   .catch(function () {
  //     return 'table creation failed';
  //   });
  // });

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

  api.post(root + '/seed', function (request) {
    if(!request.env || !request.env.test) {
      throw('Seed is not enabled');
    }

    var dynamo = config.dynamo(route, request);

    var data = request.body.items;

    return lib.seed(data, dynamo);
  });

  api.post(root + '/reseed', function (request) {
    if(!request.env || !request.env.test) {
      throw('Reseed is not enabled');
    }

    var dynamo = config.dynamo(route, request);

    var data = request.body.items;

    return lib.config.destroy(dynamo)
    .then(function (response) {
      return lib.config.create(dynamo);
    }).then(function (response) {
      return lib.seed(data, dynamo);
    });
  });

  api.post(root + '/createtable', function (request) {
    if(!request.env || !request.env.test) {
      throw('Create table is not enabled');
    }

    var dynamo = config.dynamo(route, request);

    return lib.config.create(dynamo);
  });

  return api;
};
