// var AWS = require('aws-sdk');
// var lib = require('../index.js');
// var dynamo = {};
// var apiHelper = require('../api.js');
//
// var dynamoconfig = {
//   endpoint: 'http://localhost:8000',
//   region: 'someregion',
//   accessKeyId: 'test',
//   secretAccessKey: 'test'
// };
//
// dynamo = new lib.dynamo(dynamoconfig);
// dynamo.tableName = 'test';
//
// var api = apiHelper('test', dynamo);
//
//
// describe('stock api', function () {
//   beforeEach(function () {
//
//   });
//
//   it('that creates a table', function (done) {
//     var params = {
//       TableName: dynamo.tableName,
//       AttributeDefinitions: [
//       { 'AttributeName': 'id', 'AttributeType': 'S' },
//       ],
//       KeySchema: [
//       { 'AttributeName': 'id', 'KeyType': 'HASH' },
//       ],
//       ProvisionedThroughput: {
//         ReadCapacityUnits: 1,
//         WriteCapacityUnits: 1
//       },
//     };
//
//     var response = lib.createTable(params, dynamo);
//
//     response.then(function (response) {
//       expect(response).toBeDefined();
//       done();
//     });
//   });
//
//   describe('checks api functions', function () {
//     var lambdaContextSpy;
//
//     beforeEach(function () {
//       lambdaContextSpy = jasmine.createSpyObj('lambdaContext', ['done']);
//     });
//
//     describe('gets an object', function () {
//       api.proxyRouter({
//         requestContext: {
//           resourcePath: '/foo',
//           httpMethod: 'GET'
//         },
//         queryString: {
//           id: '1'
//         }
//       }, lambdaContextSpy);
//     });
//   });
//
//   it('deletes the table', function (done) {
//     var params = {
//       TableName: dynamo.tableName,
//     };
//     dynamo.raw.deleteTable(params, function(err, data) {
//       expect(err).toBeNull();
//       done();
//     });
//   });
// });
