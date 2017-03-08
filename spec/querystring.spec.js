var query = require('../lib/querystring.js');

describe("A function for parsing query paramters", function() {
  var queryString;
  beforeEach(function () {
    queryString = undefined;
  });
  it("returns an options object", function() {
    queryString = {
      limit: 2,
      last: "abc"
    };
  	var options = query.parse(queryString);
    expect(options).toBeDefined();
    expect(options.limit).toBe('2');
    expect(options.last).toBe('abc');
    expect(options.filter).not.toBeDefined();
  });
  it("returns an empty object", function() {
    var options = query.parse(queryString);
    expect(typeof(options)).toBe('object');
    expect(Object.keys(options).length).toBe(0);
  });
  it("returns an empty object when given a queryString without useable values", function() {
    queryString = {
      foo: "bar"
    };
    var options = query.parse(queryString);
    expect(typeof(options)).toBe('object');
    expect(Object.keys(options).length).toBe(0);
  });
});
