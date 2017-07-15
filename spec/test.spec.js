//Load tests that require the database
var dynamoSpec = require('./dynamo.js');
var apiSpec = require('./api.js');
var configSpec = require('./config.js');
var curdSpec = require('./crud.js');
var relSpec = require('./rel.js');

var lib = require('../lib');

var DynamoDbLocal = require('dynamodb-local');

describe('setup test enviroment', function () {
  beforeAll(function (done) {
    DynamoDbLocal.launch(8000).then(function (response) {
      done();
    });
  });

  afterAll(function () {
    DynamoDbLocal.stop(8000);
  });

  describe('database tests', function () {
    dynamoSpec(lib);
    apiSpec(lib);
    configSpec(lib);
    relSpec(lib);
  });
});
