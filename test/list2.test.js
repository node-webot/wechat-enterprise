var List = require('../').List;
var postData = require('./support').postData;
var request = require('supertest');
var buildXML = require('./support').buildXML;
var parse = require('./support').parse;
var WXBizMsgCrypt = require('../lib/msg_crypto');
var cfg = require('./config');
var expect = require('expect.js');

var connect = require('connect');
var wechat = require('../');

var app = connect();
app.use(connect.query());
app.use(connect.cookieParser());
app.use(connect.session({secret: 'keyboard cat', cookie: {maxAge: 60000}}));

var config = {encodingAESKey: cfg.encodingAESKey, token: cfg.token, corpId: cfg.corpid};

app.use('/wechat', wechat(config, function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var info = req.weixin;
  if (info.Content === 'list') {
    res.wait('view');
  }
}));

describe('list', function() {
  it('should ok with list', function (done) {
    var cryptor = new WXBizMsgCrypt(cfg.token, cfg.encodingAESKey, cfg.corpid);

    List.add('view', [
      ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
    ]);
    var info = {
      fromUser: 'test',
      toUser: 'test',
      type: 'text',
      content: 'list'
    };

    var xml = buildXML(info);
    var data = postData(cfg.token, cryptor.encrypt(xml));
    request(app)
    .post('/wechat?' + data.querystring)
    .send(data.xml)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }

      var body = res.text.toString();
      parse(body, function (err, result) {
        var message = cryptor.decrypt(result.Encrypt).message;
        expect(message).to.contain('回复c查看我的性取向');
        var info = {
          fromUser: 'test',
          toUser: 'test',
          type: 'text',
          content: 'c'
        };
        var xml = buildXML(info);
        var data = postData(cfg.token, cryptor.encrypt(xml));

        request(app)
        .post('/wechat?' + data.querystring)
        .send(data.xml)
        .expect(200)
        .end(function(err, res){
          if (err) {
            return done(err);
          }
          var body = res.text.toString();
          parse(body, function (err, result) {
            var message = cryptor.decrypt(result.Encrypt).message;
            expect(message).to.contain('这样的事情怎么好意思告诉你啦');
            done();
          });
        });
      });
    });
  });
});
