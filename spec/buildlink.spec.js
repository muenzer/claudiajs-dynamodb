var lib = require('../index.js');

describe('helper function to build a pagination link', function () {
  var response;
  var url = 'root/api/';

  beforeEach(function () {
    response = {};
  });

  it('returns a valid link', function () {
    response.LastEvaluatedKey = {id: 'A'};
    var link = lib.buildLink(url, response);
    expect(link).toBe('root/api/?_last=A; rel="next"');
  });

  it('returns a valid link', function () {
    response.LastEvaluatedKey = {id: 'A', sort: 1};
    var link = lib.buildLink(url, response);
    expect(link).toBe('root/api/?_last=%7B%22id%22%3A%22A%22%2C%22sort%22%3A1%7D; rel="next"');
  });

  it('returns a null value when LastEvaluatedKey is not defined', function () {
    var link = lib.buildLink(url, response);
    expect(link).not.toBeDefined();
  });
});
