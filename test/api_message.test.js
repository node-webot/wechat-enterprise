var expect = require('expect.js');
var config = require('./config');
var API = require('../').API;

describe('message', function () {
  var api = new API(config.corpid, config.corpsecret, 1);

  before(function (done) {
    api.getAccessToken(done);
  });

  it('send message should ok', function (done) {
    var to = {
      "touser": "@all"
    };
    var message = {
      "msgtype": "text",
      "text": {
        "content": "Holiday Request For Pony(http://xxxxx)"
      },
      "safe": "0"
    };
    api.send(to, message, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errmsg', 'ok');
      done();
    });
  });
});
