var expect = require('expect.js');
var config = require('./config');
var API = require('../').API;

var puling = 'ofL4cs7hr04cJIcu600_W-ZwwxHg';

describe('valid corpid', function () {
  var api = new API(config.corpid, config.corpsecret);
  before(function (done) {
    api.getAccessToken(done);
  });

  it('getUser should not ok', function (done) {
    api.getUser(puling, function (err, data, res) {
      expect(err).to.be.ok();
      expect(err).to.have.property('name', 'WeChatAPIError');
      expect(err).to.have.property('message', 'userid not found');
      done();
    });
  });
});
