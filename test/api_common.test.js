var expect = require('expect.js');
var config = require('./config');
var API = require('../').API;

describe('common.js', function () {
  describe('getAccessToken', function () {
    it('should ok', function (done) {
      var api = new API(config.cropid, config.cropsecret);
      api.getAccessToken(function (err, token) {
        expect(err).not.to.be.ok();
        expect(token).to.only.have.keys('accessToken');
        done();
      });
    });

    it('should not ok', function (done) {
      var api = new API('appid', 'secret');
      api.getAccessToken(function (err, token) {
        expect(err).to.be.ok();
        expect(err).to.have.property('name', 'WeChatAPIError');
        expect(err).to.have.property('code', 40013);
        expect(err).to.have.property('message', 'invalid corpid');
        done();
      });
    });
  });
});
