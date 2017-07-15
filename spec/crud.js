module.exports = function () {
  var crud = require('../crud.js');

  describe('build full crud api', function () {
    it('retuen api', function () {
      var api = crud(['foo', 'bar']);

      expect(api).toBeDefined();
    });
  });
};
