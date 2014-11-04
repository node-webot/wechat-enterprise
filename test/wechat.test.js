var request = require('supertest');
var tail = require('./support').tail;
var postData = require('./support').postData;

var connect = require('connect');
var wechat = require('../');
var cfg = require('./config');
var WXBizMsgCrypt = require('wechat-crypto');

var app = connect();
app.use(connect.query());

var config = {encodingAESKey: cfg.encodingAESKey, token: cfg.token, corpId: cfg.corpid};

app.use('/wechat', wechat(config, function (req, res, next) {
  res.reply('hehe');
}));

describe('wechat.js', function () {
  var cryptor = new WXBizMsgCrypt(cfg.token, cfg.encodingAESKey, cfg.corpid);
  describe('get', function () {
    it('should ok', function (done) {
      var echoStr = 'node rock';
      var _tail = tail(cfg.token, cryptor.encrypt(echoStr), true);
      request(app)
        .get('/wechat?' + _tail)
        .expect(200)
        .expect(echoStr, done);
    });

    it('should not ok', function (done) {
      var echoStr = 'node rock';
      var _tail = tail('fake_token', cryptor.encrypt(echoStr), true);
      request(app)
        .get('/wechat?' + _tail)
        .expect(401)
        .expect('Invalid signature', done);
    });
  });

  describe('post', function () {
    it('should 500', function (done) {
      request(app)
      .post('/wechat')
      .expect(500)
      .expect(/body is empty/, done);
    });

    it('should 401 invalid signature', function (done) {
      var xml = '<xml></xml>';
      var data = postData('fake_token', cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(401)
      .expect('Invalid signature', done);
    });

    it('should 200', function (done) {
      var xml = '<xml></xml>';
      var data = postData(cfg.token, cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200, done);
    });
  });
});
