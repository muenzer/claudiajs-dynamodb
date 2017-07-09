var ApiBuilder = require('claudia-api-builder');
var DynamoDbLocal = require('dynamodb-local');
var lib = require('../index.js');

var api = new ApiBuilder();

var options = {
  database: {
    region: 'local',
  }
};

describe('stock api', function () {
  beforeAll(function (done) {
    DynamoDbLocal.launch(8000, null, ['-inMemory']).then(function (response) {
      done();
    });
  });

  afterAll(function () {
    DynamoDbLocal.stop(8000);
  });

  beforeAll(function (done) {
    lib.config.create('foo', options.database)
    .then(function (response) {
      console.log('table created');
      done();
    });
  });

  beforeAll(function () {
    api = lib.api('foo', api);
  });

  // afterAll(function (done) {
  //   lib.config.distroy(dynamo)
  //   .then(function (response) {
  //     console.log('table deleted');
  //     done();
  //   });
  // });

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
          name: 'foo',
          id: '1'
        }
      }, lambdaContextSpy)
      .then(function () {
        expect(lambdaContextSpy.done).toHaveBeenCalled();
        expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, jasmine.objectContaining({statusCode:200}));
      })
      .then(done, done.fail);
    });

    it('posts a second object', function (done) {
      api.proxyRouter({
        requestContext: {
          resourcePath: '/foo',
          httpMethod: 'POST'
        },
        body: {
          name: 'bar',
        }
      }, lambdaContextSpy)
      .then(function () {
        expect(lambdaContextSpy.done).toHaveBeenCalled();
        expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, jasmine.objectContaining({statusCode:200}));
      })
      .then(done, done.fail);
    });

    it('gets all objects', function (done) {
      api.proxyRouter({
        requestContext: {
          resourcePath: '/foo',
          httpMethod: 'GET'
        }
      }, lambdaContextSpy)
      .then(function () {
        expect(lambdaContextSpy.done).toHaveBeenCalled();
        expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, jasmine.objectContaining({statusCode:200}));
        var body = JSON.parse(lambdaContextSpy.done.calls.argsFor(0)[1].body);
        expect(body.length).toBe(2);
      })
      .then(done, done.fail);
    });

    it('gets all objects with limits', function (done) {
      api.proxyRouter({
        requestContext: {
          resourcePath: '/foo',
          httpMethod: 'GET'
        },
        queryStringParameters: {
          _limit: 1
        }
      }, lambdaContextSpy)
      .then(function () {
        expect(lambdaContextSpy.done).toHaveBeenCalled();
        expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, jasmine.objectContaining({statusCode:200}));
        var body = JSON.parse(lambdaContextSpy.done.calls.argsFor(0)[1].body);
        expect(body.length).toBe(1);
      })
      .then(done, done.fail);
    });

    it('gets an object', function (done) {
      api.proxyRouter({
        requestContext: {
          resourcePath: '/foo/{id}',
          httpMethod: 'GET'
        },
        pathParameters: {
          id: '1'
        }
      }, lambdaContextSpy)
      .then(function () {
        expect(lambdaContextSpy.done).toHaveBeenCalled();
        expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, jasmine.objectContaining({statusCode:200}));
        var body = JSON.parse(lambdaContextSpy.done.calls.argsFor(0)[1].body);
        expect(body.name).toBe('foo');
      })
      .then(done, done.fail);
    });

    it('patches an object', function (done) {
      api.proxyRouter({
        requestContext: {
          resourcePath: '/foo/{id}',
          httpMethod: 'PATCH'
        },
        pathParameters: {
          id: '1'
        },
        body: {
          color: 'red'
        }
      }, lambdaContextSpy)
      .then(function () {
        expect(lambdaContextSpy.done).toHaveBeenCalled();
        expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, jasmine.objectContaining({statusCode:200}));
        var body = JSON.parse(lambdaContextSpy.done.calls.argsFor(0)[1].body);
        expect(body.color).toBe('red');
      })
      .then(done, done.fail);
    });

    it('puts an object', function (done) {
      api.proxyRouter({
        requestContext: {
          resourcePath: '/foo/{id}',
          httpMethod: 'PUT'
        },
        pathParameters: {
          id: '1'
        },
        body: {
          color: 'green'
        }
      }, lambdaContextSpy)
      .then(function () {
        expect(lambdaContextSpy.done).toHaveBeenCalled();
        expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, jasmine.objectContaining({statusCode:200}));
        var body = JSON.parse(lambdaContextSpy.done.calls.argsFor(0)[1].body);
        expect(body.color).toBe('green');
        expect(body.name).toBeUndefined();
      })
      .then(done, done.fail);
    });

    it('deletes an object', function (done) {
      api.proxyRouter({
        requestContext: {
          resourcePath: '/foo/{id}',
          httpMethod: 'DELETE'
        },
        pathParameters: {
          id: '1'
        }
      }, lambdaContextSpy)
      .then(function () {
        expect(lambdaContextSpy.done).toHaveBeenCalled();
        expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, jasmine.objectContaining({statusCode:200}));
        var body = JSON.parse(lambdaContextSpy.done.calls.argsFor(0)[1].body);
        expect(body.id).toBe('1');
      })
      .then(done, done.fail);
    });
  });
});
