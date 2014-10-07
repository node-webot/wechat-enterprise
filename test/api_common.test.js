var expect = require('expect.js');
var urllib = require('urllib');
var muk = require('muk');
var config = require('./config');
var API = require('../').API;

describe('common.js', function () {
  describe('mixin', function () {
    it('should ok', function () {
      API.mixin({sayHi: function () {}});
      expect(API.prototype).to.have.property('sayHi');
    });

    it('should not ok when override method', function () {
      var obj = {sayHi: function () {}};
      expect(API.mixin).withArgs(obj).to.throwException(/Don't allow override existed prototype method\./);
    });
  });

  describe('getAccessToken', function () {
    it('should ok', function (done) {
      var api = new API(config.corpid, config.corpsecret);
      api.getAccessToken(function (err, token) {
        expect(err).not.to.be.ok();
        expect(token).to.only.have.keys('accessToken');
        done();
      });
    });

    it('should not ok', function (done) {
      var api = new API('corpid', 'corpsecret');
      api.getAccessToken(function (err, token) {
        expect(err).to.be.ok();
        expect(err).to.have.property('name', 'WeChatAPIError');
        expect(err).to.have.property('code', 40013);
        expect(err).to.have.property('message', 'invalid corpid');
        done();
      });
    });

    describe('mock urllib err', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          var err = new Error('Urllib Error');
          err.name = 'UrllibError';
          callback(err);
        });
      });

      after(function () {
        muk.restore();
      });

      it('should get mock error', function (done) {
        var api = new API('appid', 'secret');
        api.getAccessToken(function (err, token) {
          expect(err).to.be.ok();
          expect(err.name).to.be('WeChatAPIUrllibError');
          expect(err.message).to.be('Urllib Error');
          done();
        });
      });
    });

    describe('mock token', function () {
      before(function () {
        muk(urllib, 'request', function (url, args, callback) {
          process.nextTick(function () {
            callback(null, {"access_token": "ACCESS_TOKEN","expires_in": 7200});
          });
        });
      });
      after(function () {
        muk.restore();
      });

      it('should ok', function (done) {
        var api = new API('appid', 'secret');
        api.getAccessToken(function (err, token) {
          expect(err).to.not.be.ok();
          expect(token).to.have.property('accessToken', 'ACCESS_TOKEN');
          done();
        });
      });
    });
  });
});
