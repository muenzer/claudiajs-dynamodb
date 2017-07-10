var DynamoDbLocal = require('dynamodb-local');
var config = require('../config.js');
var dynamo;

describe('configure', function () {
  beforeAll(function (done) {
    DynamoDbLocal.launch(8000, null, ['-inMemory']).then(function (response) {
      done();
    });
  });

  afterAll(function () {
    DynamoDbLocal.stop(8000);
  });

  describe('returns a dynamo handle', function () {
    it('without a request', function () {
      dynamo = config.dynamo('foo', {});
      expect(dynamo.tableName).toBe('foo');
      expect(dynamo.raw.config.region).toBe('someregion');
    });

    it('with a function arn', function () {
      var request = {
        lambdaContext: {
          invokedFunctionArn: 'arn:aws:lambda:us-east-1:12345:function:somefunction:latest'
        }
      };
      dynamo = config.dynamo('foo', request);
      expect(dynamo.tableName).toBe('foo');
      expect(dynamo.raw.config.region).toBe('us-east-1');
    });

    it('with an env variable', function () {
      var request = {
        lambdaContext: {
          invokedFunctionArn: 'arn:aws:lambda:us-east-1:12345:function:somefunction:latest'
        },
        env: {
          fooTable: 'foo_dev'
        }
      };
      dynamo = config.dynamo('foo', request);
      expect(dynamo.tableName).toBe('foo_dev');
      expect(dynamo.raw.config.region).toBe('us-east-1');
    });
  });

  describe('creates and deletes a table', function () {
    it('create table', function (done) {
      var request = {
        env: {
          fooTable: 'foo_dev'
        }
      };
      dynamo = config.dynamo('foo', request);

      config.create(dynamo)
      .then(function (response) {
        expect(response).toBeDefined();

        dynamo.raw.describeTable({TableName: dynamo.tableName}).promise()
        .then(function (response) {
          expect(response.Table.TableName).toBe('foo_dev');
          done();
        })
        .catch(function (error) {
          fail(error);
          done();
        });
      });
    });

    it('deletes a table', function (done) {
      config.destroy(dynamo).
      then(function (response) {
        expect(response.TableDescription.TableName).toBe('foo_dev');
        done();
      })
      .catch(function (error) {
        fail(error);
        done();
      });
    });
  });
});
