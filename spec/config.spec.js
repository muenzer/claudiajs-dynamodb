var DynamoDbLocal = require('dynamodb-local');
var config = require('../config.js');
var dynamo;

describe('configure database', function () {
  beforeAll(function (done) {
    DynamoDbLocal.launch(8000, null, ['-inMemory']).then(function (response) {
      done();
    });
  });

  afterAll(function () {
    DynamoDbLocal.stop(8000);
  });

  describe('creates and deletes a table', function () {
    it('create table', function (done) {
      config.create('foo', {region: 'local', stage: 'dev'})
      .then(function (response) {
        expect(response).toBeDefined();
        dynamo = response;

        dynamo.raw.describeTable({TableName: dynamo.tableName}).promise()
        .then(function (response) {
          expect(response.Table.TableName).toBe('dev_foo');
          done();
        })
        .catch(function (error) {
          fail(error);
          done();
        });
      });
    });

    it('uses an existing table', function (done) {
      config.create('foo', {region: 'local', stage: 'dev'})
      .then(function (response) {
        expect(response).toBeDefined();
        dynamo = response;

        dynamo.raw.describeTable({TableName: dynamo.tableName}).promise()
        .then(function (response) {
          expect(response.Table.TableName).toBe('dev_foo');
          done();
        })
        .catch(function (error) {
          fail(error);
          done();
        });
      });
    });

    it('deletes a table', function (done) {
      config.distroy(dynamo).
      then(function (response) {
        expect(response.TableDescription.TableName).toBe('dev_foo');
        done();
      })
      .catch(function (error) {
        fail(error);
        done();
      });
    });
  });
});
