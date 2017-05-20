var ApiBuilder = require('claudia-api-builder');
var AWS = require('aws-sdk');
var lib = require('../index.js');
var dynamo = {};

var dynamoconfig = {
  endpoint: 'http://localhost:8000',
  region: 'someregion',
  accessKeyId: 'test',
  secretAccessKey: 'test'
};

var dynamo = new lib.dynamo(dynamoconfig);
dynamo.tableName = 'test';

var api = new ApiBuilder();
api = lib.api('foo', api, dynamo);


describe('stock api', function () {
  beforeAll(function () {
    var dynamoconfig = {
      endpoint: 'http://localhost:8000',
      region: 'someregion',
      accessKeyId: 'test',
      secretAccessKey: 'test'
    };

    var dynamo = new lib.dynamo(dynamoconfig);
    dynamo.tableName = 'test';

    var api = new ApiBuilder();
    api = lib.api('foo', api, dynamo);
  });

  beforeAll(function (done) {
    var params = {
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

    var response = lib.createTable(params, dynamo);

    response.then(function (response) {
      done();
    });
  });

  afterAll(function (done) {
    var params = {
      TableName: dynamo.tableName,
    };
    dynamo.raw.deleteTable(params, function(err, data) {
      done();
    });
  });

  describe('checks api functions', function () {
    var lambdaContextSpy;

    beforeEach(function () {
      lambdaContextSpy = jasmine.createSpyObj('lambdaContext', ['done']);
    });

    it('posts an object', function (done) {
      api.proxyRouter({
        requestContext: {
          resourcePath: '/foo',
          httpMethod: 'POST'
        },
        body: {
          name: 'foo'
        }
      }, lambdaContextSpy)
      .then(function () {
        console.log(lambdaContextSpy.done);
        expect(lambdaContextSpy.done).toHaveBeenCalled();
        expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, jasmine.objectContaining({statusCode:200}));
      })
      .then(done, done.fail);
    });

    it('gets an object', function (done) {
      api.proxyRouter({
        requestContext: {
          resourcePath: '/foo',
          httpMethod: 'GET'
        },
        queryString: {
          id: '1'
        }
      }, lambdaContextSpy)
      .then(function () {
        expect(lambdaContextSpy.done).toHaveBeenCalled();
        expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, jasmine.objectContaining({statusCode:200}));
      })
      .then(done, done.fail);
    });
  });
});
