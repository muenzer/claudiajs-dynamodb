module.exports = function (lib) {
  describe('build full crud api', function () {
    it('retuen api', function () {
      var api = lib.crud(['foo', 'bar']);

      expect(api).toBeDefined();
    });
  });
};
