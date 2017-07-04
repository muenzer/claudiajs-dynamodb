var AWS = require('aws-sdk');
var DynamoDbLocal = require('dynamodb-local');
var lib = require('../index.js');
var dynamo = {};
var id = null;

describe('DynamoDB interface', function () {
  beforeAll(function (done) {
    DynamoDbLocal.launch(8000).then(function (response) {
      done();
    });
  });

  afterAll(function () {
    DynamoDbLocal.stop(8000);
  });

  beforeEach(function () {
    var dynamoconfig = {
      endpoint: 'http://localhost:8000',
      region: 'someregion',
      accessKeyId: 'test',
      secretAccessKey: 'test'
    };

    dynamo = new lib.dynamo(dynamoconfig);
    dynamo.tableName = 'test';
  });

  it('that creates a table', function (done) {
    var params = {
      TableName: dynamo.tableName,
      AttributeDefinitions: [
      { 'AttributeName': 'name', 'AttributeType': 'S' },
      { 'AttributeName': 'id', 'AttributeType': 'S' },
      { 'AttributeName': 'number', 'AttributeType': 'S' },
      { 'AttributeName': 'sort', 'AttributeType': 'S' },
      ],
      KeySchema: [
      { 'AttributeName': 'name', 'KeyType': 'HASH' },
      { 'AttributeName': 'id', 'KeyType': 'RANGE' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'SecIndex',
          KeySchema: [
            {
              AttributeName: 'number',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'sort',
              KeyType: 'RANGE',
            }
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      ]
    };

    var response = lib.createTable(params, dynamo);

    response.then(function (response) {
      expect(response).toBeDefined();
      done();
    });
  });

  it('creates an item', function (done) {
    dynamo.tableName = 'test';

    var data = {
      name: 'foo',
      number: '5',
      sort: 'A'
    };

    var response = lib.create(data, dynamo);

    //create additional items for pagination test

    data = {
      name: 'bar'
    };

    lib.create(data, dynamo);

    data = {
      name: 'car'
    };

    lib.create(data, dynamo);


    response.then(function (response) {
      id = response.id;
      expect(response.name).toBe('foo');
      done();
    });
  });

  it('scans table', function (done) {
    dynamo.tableName = 'test';

    var response = lib.scan(dynamo);

    response.then(function (response) {
      expect(response.Items[0].name).toBeDefined();
      expect(response.Count).toBe(3);
      done();
    });
  });

  it('scans table with filter', function (done) {
    dynamo.tableName = 'test';

    var options = {
      filter: {id: id}
    };

    var response = lib.scan(dynamo,options);

    response.then(function (response) {
      expect(response.Items[0].name).toBeDefined();
      expect(response.Count).toBe(1);
      done();
    });
  });

  it('scans a table with limits', function (done) {
    dynamo.tableName = 'test';

    var options = {
      limit: 2
    };

    var getFirst = function () {
      return lib.scan(dynamo,options).then(function (response) {
        expect(response.Count).toBe(2);
        expect(response.LastEvaluatedKey).toBeDefined();

        return response.LastEvaluatedKey;
      });
    };

    var getSecond = function (last) {
      options.last = last;

      return lib.scan(dynamo,options).then(function (response) {
        expect(response.Count).toBe(1);
        done();
      });

    };

    getFirst()
    .then(getSecond);
  });

  it('gets an item', function (done) {
    dynamo.tableName = 'test';

    var data = {
      name: 'foo',
      id: id
    };

    var response = lib.get(data, dynamo);

    response.then(function (response) {
      expect(response.name).toBe('foo');
      done();
    });
  });

  it('query a primary key', function (done) {
    dynamo.tableName = 'test';

    var data = {
      name: 'foo'
    };

    var query = function () {
      return lib.query(data, dynamo).then(function (response) {
        expect(Array.isArray(response.Items)).toBeTruthy();
        expect(response.Items[0].name).toBe('foo');
        done();
      });
    };

    query();

  });

  it('query a primary key, that does not return anything', function (done) {
    dynamo.tableName = 'test';

    var data = {
      name: 'bar'
    };

    var response = lib.query(data, dynamo);

    response.then(function (response) {
      expect(Array.isArray(response.Items)).toBeTruthy();
      done();
    });
  });

  it('query a primary key with a filter', function (done) {
    dynamo.tableName = 'test';

    var data = {
      name: 'foo'
    };

    var options = {
      filter: {number: '5'}
    };

    var response = lib.query(data, dynamo, options);

    response.then(function (response) {
      expect(response.Items[0].name).toBe('foo');
      done();
    });
  });

  it('query a secondary index', function (done) {
    dynamo.tableName = 'test';

    var data = {
      number: '5'
    };

    var options = {
      index: 'SecIndex'
    };

    var response = lib.query(data, dynamo, options);

    response.then(function (response) {
      expect(response.Items[0].name).toBe('foo');
      done();
    });
  });

  it('updates an item', function (done) {
    dynamo.tableName = 'test';

    var key = {
      name: 'foo',
      id: id
    };

    var body = {
      name: 'foo',
      id: id,
      size: 5,
      sort: 'B',
      color: 'green'
    };

    var response = lib.update(key, body, dynamo);

    response.then(function (response) {
      expect(response.name).toBe('foo');
      expect(response.size).toBe(5);
      done();
    });
  });

  it('updates an item to remove an attribute', function (done) {
    dynamo.tableName = 'test';

    var key = {
      name: 'foo',
      id: id
    };

    var body = {
      name: 'foo',
      id: id,
      size: null,
      sort: 'B',
      color: 'red'
    };

    var conditional = {
      color: 'green'
    };

    var response = lib.update(key, body, dynamo, conditional);

    response.then(function (response) {
      expect(response.name).toBe('foo');
      expect(response.size).toBeUndefined();
      expect(response.color).toBe('red');
      done();
    })
    .catch(function (error) {
      fail(error);
      done();
    });
  });

  it('updates tries to update an item', function (done) {
    dynamo.tableName = 'test';

    var key = {
      name: 'foo',
      id: id
    };

    var body = {
      name: 'foo',
      id: id,
      size: 10
    };

    var conditional = {
      sort: 'A'
    };

    var response = lib.update(key, body, dynamo, conditional);

    response.catch(function (response) {
      expect(response).toMatch('ConditionalCheckFailedException');
      done();
    });
  });

  it('can not overwrite an item', function (done) {
    dynamo.tableName = 'test';

    var data = {
      name: 'foo',
      id: id
    };

    var options = {
      conditional: 'attribute_not_exists(#name) AND attribute_not_exists(id)',
      attributes: {
        '#name': 'name'
      }
    };

    var response = lib.create(data, dynamo, options);

    response.catch(function (response) {
      expect(response).toMatch('ConditionalCheckFailedException');
      done();
    });
  });

  it('deletes an item', function (done) {
    dynamo.tableName = 'test';

    var key = {
      name: 'foo',
      id: id
    };

    var response = lib.delete(key, dynamo);

    response.then(function (response) {
      expect(response.name).toBe('foo');
      done();
    });
  });

  it('trys to delete a deleted item', function (done) {
    dynamo.tableName = 'test';

    var key = {
      name: 'foo',
      id: id
    };

    var response = lib.delete(key, dynamo);

    response.then(function (response) {
      expect(response).toBe('nothing deleted');
      done();
    });
  });

  it('deletes the table', function (done) {
    var params = {
      TableName: dynamo.tableName,
    };
    dynamo.raw.deleteTable(params, function(err, data) {
      expect(err).toBeNull();
      done();
    });
  });
});
