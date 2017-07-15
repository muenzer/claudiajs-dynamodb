module.exports.dynamo = function (route, request) {
  var lib = require('./lib.js');

  var dynamoconfig;

  if(request.lambdaContext && request.lambdaContext.invokedFunctionArn) {
    var region = request.lambdaContext.invokedFunctionArn.split(':')[3];
    dynamoconfig = {region: region};
  } else {
    dynamoconfig = {
      endpoint: 'http://localhost:8000',
      region: 'someregion',
      accessKeyId: 'test',
      secretAccessKey: 'test'
    };
  }

  var dynamo = new lib.dynamo(dynamoconfig);

  if(request.env && request.env[route + 'Table']) {
    dynamo.tableName = request.env[route + 'Table'];
  } else {
    dynamo.tableName = route;
  }

  if(request.env && request.env.dbConfig) {
    dynamo.config = request.env.dbConfig;
  }

  return dynamo;
};

module.exports.create = function (dynamo) {
  var lib = require('./lib.js');

  return dynamo.raw.describeTable({TableName: dynamo.tableName}).promise()
  .then(function (response) {
    return dynamo.tableName + ' already exists';
  })
  .catch(function (error) {
    if(error.code === 'ResourceNotFoundException') {
      var config;
      var params;

      if(dynamo.config) {
        var path = require('path');
        config = require(path.resolve(process.cwd(), dynamo.config));
        params = config[dynamo.tableName];
      }

      if(!params) {
        params = {
          TableName: dynamo.tableName,
          AttributeDefinitions: [
            { 'AttributeName': 'id', 'AttributeType': 'S' },
          ],
          KeySchema: [
            { 'AttributeName': 'id', 'KeyType': 'HASH' },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        };
      }

      return lib.createTable(params, dynamo)
      .then(function (response) {
        return dynamo.tableName + ' created';
      });
    }
    throw error;
  });
};

module.exports.destroy = function (dynamo) {
  var lib = require('./lib.js');

  var params = {
    TableName: dynamo.tableName
  };

  return lib.deleteTable(params, dynamo);
};
