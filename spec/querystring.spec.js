var lib = require('../index.js');

describe('A function for parsing query paramters', function() {
  var queryString;
  beforeEach(function () {
    queryString = undefined;
  });
  it('returns an options object', function() {
    queryString = {
      _limit: 2,
      _last: 'abc',
      _expand: 'table'
    };
  	var options = lib.querystring(queryString);
    expect(options).toBeDefined();
    expect(options.limit).toBe('2');
    expect(options.last).toEqual({id: 'abc'});
    expect(options.filter).not.toBeDefined();
  });
  it('returns an options object from encoded parameters', function() {
    queryString = {
      _limit: 2,
      _last: '%7B%22id%22%3A%22A%22%2C%22sort%22%3A1%7D',
      _expand: 'table'
    };
    var options = lib.querystring(queryString);
    expect(options).toBeDefined();
    expect(options.limit).toBe('2');
    expect(options.last).toEqual({id: 'A', sort: 1});
    expect(options.filter).not.toBeDefined();
  });
  it('returns an options object with expand', function() {
    queryString = {
      _expand: 'table'
    };
    var options = lib.querystring(queryString);
    expect(options).toBeDefined();
    expect(options.expand).toBeDefined();
    expect(options.expand.relTable).toBe('tables');
    expect(options.expand.relId).toBe('tableId');
    expect(options.expand.relLabel).toBe('table');
  });
  it('returns an options object with embed', function() {
    queryString = {
      _limit: 2,
      _last: 'abc',
      _embed: 'tables'
    };
    var options = lib.querystring(queryString);
    expect(options).toBeDefined();
    expect(options.embed).toBeDefined();
    expect(options.embed.relTable).toBe('tables');
    expect(options.embed.relId).toBe('tableId');
    expect(options.embed.relLabel).toBe('tables');
  });
  it('returns an options object with filter', function () {
    queryString = {
      id: 'abc',
      color: 'red'
    };
    var options = lib.querystring(queryString);
    expect(options).toBeDefined();
    expect(options.filter).toBeDefined();
    expect(options.filter.id).toBe('abc');
    expect(options.filter.color).toBe('red');
  });
  it('returns an empty object', function() {
    var options = lib.querystring(queryString);
    expect(typeof(options)).toBe('object');
    expect(Object.keys(options).length).toBe(0);
  });
});
