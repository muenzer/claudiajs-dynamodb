var AWS = require('aws-sdk');
var dynamo = {};
var id = null;

describe("DynamoDB interface", function () {
  beforeEach(function () {
    var dynamoconfig = {
      endpoint: "http://localhost:8000",
      region: "someregion",
      accessKeyId: "test",
      secretAccessKey: "test"
    };

    var dynamodb = new AWS.DynamoDB(dynamoconfig);
    dynamo.raw = dynamodb;
    dynamo.doc = new AWS.DynamoDB.DocumentClient({service:dynamodb});
    dynamo.tableName = "test";
  });

  it("that creates a table", function (done) {
    var params = {
      TableName: dynamo.tableName,
      AttributeDefinitions: [
      { "AttributeName": "name", "AttributeType": "S" },
      { "AttributeName": "id", "AttributeType": "S" },
      { "AttributeName": "number", "AttributeType": "S" },
      { "AttributeName": "sort", "AttributeType": "S" },
      ],
      KeySchema: [
      { "AttributeName": "name", "KeyType": "HASH" },
      { "AttributeName": "id", "KeyType": "RANGE" }
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

    var lib = require('../lib/create-table');

    var response = lib.respond(params, dynamo);

    response.then(function (response) {
      expect(response).toBeDefined();
      done();
    });
  });

  it("creates an item", function (done) {
    var lib = require('../lib/create');
    dynamo.tableName = "test";

    var data = {
      name: "foo",
      number: "5",
      sort: "A"
    };

    var response = lib.respond(data, dynamo);

    //create additional items for pagination test

    data = {
      name: "bar"
    };

    lib.respond(data, dynamo);

    data = {
      name: "car"
    };

    lib.respond(data, dynamo);


    response.then(function (response) {
      id = response.id;
      expect(response.name).toBe('foo');
      done();
    });
  });

  it("scans table", function (done) {
    var lib = require('../lib/scan');
    dynamo.tableName = "test";

    var response = lib.respond(dynamo);

    response.then(function (response) {
      expect(response.Items[0].name).toBeDefined();
      expect(response.Count).toBe(3);
      done();
    });
  });

  it("scans table with filter", function (done) {
    var lib = require('../lib/scan');
    dynamo.tableName = "test";

    var options = {
      filter: {id: id}
    };

    var response = lib.respond(dynamo,options);

    response.then(function (response) {
      expect(response.Items[0].name).toBeDefined();
      expect(response.Count).toBe(1);
      done();
    });
  });

  it("scans a table with limits", function (done) {
    var lib = require('../lib/scan');
    dynamo.tableName = "test";

    var options = {
      limit: 2
    };

    var response = lib.respond(dynamo,options);

    response.then(function (response) {
      expect(response.Count).toBe(2);
      expect(response.LastEvaluatedKey).toBeDefined();

      options.last = response.LastEvaluatedKey;

      var response2 = lib.respond(dynamo,options);

      response2.then(function (response) {
        expect(response.Count).toBe(1);
        done();
      });
    });
  });

  it("gets an item", function (done) {
    var lib = require('../lib/get');
    dynamo.tableName = "test";

    var data = {
      name: "foo",
      id: id
    };

    var response = lib.respond(data, dynamo);

    response.then(function (response) {
      expect(response.name).toBe('foo');
      done();
    });
  });

  it("query a primary key", function (done) {
    var lib = require('../lib/query');
    dynamo.tableName = "test";

    var data = {
      name: "foo"
    };

    var response = lib.respond(data, dynamo);

    response.then(function (response) {
      expect(Array.isArray(response.Items)).toBeTruthy();
      expect(response.Items[0].name).toBe('foo');
      done();
    });
  });

  it("query a primary key, that doesn't return anything", function (done) {
    var lib = require('../lib/query');
    dynamo.tableName = "test";

    var data = {
      name: "bar"
    };

    var response = lib.respond(data, dynamo);

    response.then(function (response) {
      expect(Array.isArray(response.Items)).toBeTruthy();
      done();
    });
  });

  it("query a primary key with a filter", function (done) {
    var lib = require('../lib/query');
    dynamo.tableName = "test";

    var data = {
      name: "foo"
    };

    var options = {
      filter: {number: '5'}
    };

    var response = lib.respond(data, dynamo, options);

    response.then(function (response) {
      expect(response.Items[0].name).toBe('foo');
      done();
    });
  });

  it("query a secondary index", function (done) {
    var lib = require('../lib/query');
    dynamo.tableName = "test";

    var data = {
      number: "5"
    };

    var options = {
      index: 'SecIndex'
    };

    var response = lib.respond(data, dynamo, options);

    response.then(function (response) {
      expect(response.Items[0].name).toBe('foo');
      done();
    });
  });

  it("updates an item", function (done) {
    var lib = require('../lib/update');
    dynamo.tableName = "test";

    var key = {
      name: "foo",
      id: id
    };

    var body = {
      name: "foo",
      id: id,
      size: 5,
      sort: "B"
    };

    var response = lib.respond(key, body, dynamo);

    response.then(function (response) {
      expect(response.name).toBe('foo');
      expect(response.size).toBe(5);
      done();
    });
  });

  it("can't overwrite an item", function (done) {
    var lib = require('../lib/create');
    dynamo.tableName = "test";

    var data = {
      name: "foo",
      id: id
    };

    var options = {
      conditional: 'attribute_not_exists(#name) AND attribute_not_exists(id)',
      attributes: {
        '#name': 'name'
      }
    };

    var response = lib.respond(data, dynamo, options);

    response.catch(function (response) {
      expect(response).toMatch('ConditionalCheckFailedException');
      done();
    });
  });

  it("deletes the table", function (done) {
    var params = {
      TableName: dynamo.tableName,
    };
    dynamo.raw.deleteTable(params, function(err, data) {
      expect(err).toBeNull();
      done();
    });
  });
});
