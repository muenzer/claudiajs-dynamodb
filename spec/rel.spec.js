var AWS = require('aws-sdk');
var lib = require('../lib');
var expand = require('../lib/expand');
var embed = require('../lib/embed');
var id = null;
var dynamo = {};

describe('expand function', function () {
  beforeAll(function () {
    var dynamoconfig = {
      endpoint: 'http://localhost:8000',
      region: 'someregion',
      accessKeyId: 'test',
      secretAccessKey: 'test'
    };

    dynamo = new lib.dynamo(dynamoconfig);
  });

  beforeAll(function (done) {
    var params = {
      AttributeDefinitions: [
      { 'AttributeName': 'id', 'AttributeType': 'S' },
      ],
      KeySchema: [
      { 'AttributeName': 'id', 'KeyType': 'HASH' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    };

    params.TableName = 'parents';
    lib.createTable(params, dynamo)
    .then(function (response) {
      params.TableName = 'children';
      return lib.createTable(params, dynamo);
    })
    .then(done);
  });

  beforeAll(function (done) {
    dynamo.tableName = 'parents';

    var data = {
      name: 'foo'
    };

    lib.create(data, dynamo)
    .then(function (response) {
      id = response.id;
    })
    .then(function () {
      console.log(id);
      dynamo.tableName = 'children';
      var data = {
        name: 'bar',
        parentId: id
      };
      return lib.create(data, dynamo);
    })
    .then(done)
    .catch(function (err) {
      console.log(err);
      done();
    });
  });

  it('check parent', function (done) {
    dynamo.tableName = 'parents';
    lib.get({id: id}, dynamo).then(function (response) {
      expect(response.id).toBe(id);
      done();
    });
  });

  it('expands a scan', function (done) {
    dynamo.tableName = 'children';

    var options = {
      expand: {
        relId: 'parentId',
        relTable: 'parents',
        relLabel: 'parent'
      }
    };

    var response = lib.scan(dynamo, options);

    response.then(function (response) {
      console.log('it', response);
      expect(response.Items[0].name).toBeDefined();
      expect(response.Count).toBe(1);
      expect(response.Items[0].parent).toBeDefined();
      expect(response.Items[0].parent.name).toBe('foo');
      expect(dynamo.tableName).toBe('children');
      done();
    });
  });

  it('embeds a scan', function (done) {
    dynamo.tableName = 'parents';

    var options = {
      embed: {
        relId: 'parentId',
        relTable: 'children',
        relLabel: 'children'
      }
    };

    var response = lib.scan(dynamo, options);

    response.then(function (response) {
      console.log('it', response);
      expect(response.Items[0].name).toBeDefined();
      expect(response.Count).toBe(1);
      expect(response.Items[0].children).toBeDefined();
      expect(response.Items[0].children[0].name).toBe('bar');
      expect(dynamo.tableName).toBe('parents');
      done();
    });
  });

  afterAll(function (done) {
    var params = {
      TableName: 'parents',
    };
    dynamo.raw.deleteTable(params, function(err, data) {
      done();
    });
  });

  afterAll(function (done) {
    var params = {
      TableName: 'children',
    };
    dynamo.raw.deleteTable(params, function(err, data) {
      done();
    });
  });
});
