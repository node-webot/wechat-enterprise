var request = require('supertest');
var tail = require('./support').tail;
var postData = require('./support').postData;

var connect = require('connect');
var wechat = require('../');
var WXBizMsgCrypt = require('../lib/msg_crypto');

var app = connect();
app.use(connect.query());
var token = 'WMzxFqFFVKcIwOrDn7Ke5eTBA2LER';
var encodingAESKey = 'NDhmYjU2ZWIxMGZmZWIxM2ZjMGVmNTUxYmJjYTNiMWI';
var corpid = 'wx20d578aedfdf58fa';

var config = {encodingAESKey: encodingAESKey, token: token, corpId: corpid};

app.use('/wechat', wechat(config, function (req, res, next) {
  res.reply('hehe');
}));

describe('wechat.js', function () {
  describe('get', function () {
    it('should ok', function (done) {
      var echoStr = 'node rock';
      var cryptor = new WXBizMsgCrypt(token, encodingAESKey, corpid);
      var _tail = tail(token, cryptor.encrypt(echoStr), true);
      request(app)
        .get('/wechat?' + _tail)
        .expect(200)
        .expect(echoStr, done);
    });

    it('should not ok', function (done) {
      var echoStr = 'node rock';
      var cryptor = new WXBizMsgCrypt(token, encodingAESKey, corpid);
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
      var cryptor = new WXBizMsgCrypt(token, encodingAESKey, corpid);
      var xml = '<xml></xml>';
      var data = postData('fake_token', cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(401)
      .expect('Invalid signature', done);
    });

    it('should 200', function (done) {
      var cryptor = new WXBizMsgCrypt(token, encodingAESKey, corpid);
      var xml = '<xml></xml>';
      var data = postData(token, cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200, done);
    });
  });
});
