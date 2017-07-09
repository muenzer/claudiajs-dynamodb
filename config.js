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

  return dynamo;
};

module.exports.create = function (route, options) {
  var lib = require('./lib.js');

  var dynamoconfig;

  if(!options) {
    options = {};
  }

  if(!options.region) {
    options.region = 'us-east-1';
  }
  if(options.region === 'local') {
    dynamoconfig = {
      endpoint: 'http://localhost:8000',
      region: 'someregion',
      accessKeyId: 'test',
      secretAccessKey: 'test'
    };
  } else {
    dynamoconfig = {region: options.region};
  }

  var dynamo = new lib.dynamo(dynamoconfig);

  if(options.stage) {
    dynamo.tableName = options.stage + '_' + route;
  } else {
    dynamo.tableName = route;
  }

  return dynamo.raw.describeTable({TableName: dynamo.tableName}).promise()
  .then(function (response) {
    return dynamo;
  })
  .catch(function (error) {
    if(error.code === 'ResourceNotFoundException') {
      if(!options.params) {
        options.params = {
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

      return lib.createTable(options.params, dynamo)
      .then(function (response) {
        return dynamo;
      });
    }
    throw error;
  });
};

module.exports.distroy = function (dynamo) {
  var lib = require('./lib.js');

  var params = {
    TableName: dynamo.tableName
  };

  return lib.deleteTable(params, dynamo);
};
