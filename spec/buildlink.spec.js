var lib = require('../index.js');

describe("helper function to build a pagination link", function () {
  var response;
  var url = 'root/api/';

  beforeEach(function () {
    response = {};
  });

  it("returns a valid link", function () {
    response.LastEvaluatedKey = 'A';
    var link = lib.buildLink(url, response);
    expect(link).toBe('root/api/?last=A; rel="next"');
  });

  it("returns a null value when LastEvaluatedKey is not defined", function () {
    var link = lib.buildLink(url, response);
    expect(link).not.toBeDefined();
  });
});
