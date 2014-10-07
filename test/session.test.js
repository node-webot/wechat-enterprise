var request = require('supertest');
var template = require('./support').template;
var support = require('./support');
var expect = require('expect.js');

var connect = require('connect');
var wechat = require('../');
var cfg = require('./config');

var app = connect();
app.use(connect.query());
app.use(connect.cookieParser());
app.use(connect.session({secret: 'keyboard cat', cookie: {maxAge: 60000}}));

var config = {encodingAESKey: cfg.encodingAESKey, token: cfg.token, corpId: cfg.corpid};

app.use('/wechat', wechat(config, wechat.text(function (info, req, res, next) {
  if (info.Content === '=') {
    req.wxsession.text = req.wxsession.text || [];
    var exp = req.wxsession.text.join('');
    res.reply('result: ' + eval(exp));
  } else if (info.Content === 'destroy') {
    req.wxsession.destroy();
    res.reply('销毁会话');
  } else {
    req.wxsession.text = req.wxsession.text || [];
    req.wxsession.text.push(info.Content);
    res.reply('收到' + info.Content);
  }
})));

describe('wechat.js', function () {
  describe('session', function () {
    var cryptor = new wechat.WXBizMsgCrypt(cfg.token, cfg.encodingAESKey, cfg.corpid);

    it('should ok', function (done) {
      var info = {
        fromUser: 'test',
        toUser: 'test',
        type: 'text',
        content: '1'
      };
      var xml = support.buildXML(info);
      var data = support.postData(cfg.token, cryptor.encrypt(xml));

      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        support.parse(body, function (err, result) {
          var message = cryptor.decrypt(result.Encrypt).message;
          expect(message).to.contain('<Content><![CDATA[收到1]]></Content>');
          done();
        });
      });
    });

    it('should ok', function (done) {
      var info = {
        fromUser: 'test',
        toUser: 'test',
        type: 'text',
        content: '+'
      };
      var xml = support.buildXML(info);
      var data = support.postData(cfg.token, cryptor.encrypt(xml));

      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        support.parse(body, function (err, result) {
          var message = cryptor.decrypt(result.Encrypt).message;
          expect(message).to.contain('<Content><![CDATA[收到+]]></Content>');
          done();
        });
      });
    });

    it('should ok', function (done) {
      var info = {
        fromUser: 'test',
        toUser: 'test',
        type: 'text',
        content: '1'
      };
      var xml = support.buildXML(info);
      var data = support.postData(cfg.token, cryptor.encrypt(xml));

      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        support.parse(body, function (err, result) {
          var message = cryptor.decrypt(result.Encrypt).message;
          expect(message).to.contain('<Content><![CDATA[收到1]]></Content>');
          done();
        });
      });
    });

    it('should ok', function (done) {
      var info = {
        fromUser: 'test',
        toUser: 'test',
        type: 'text',
        content: '='
      };
      var xml = support.buildXML(info);
      var data = support.postData(cfg.token, cryptor.encrypt(xml));

      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        support.parse(body, function (err, result) {
          var message = cryptor.decrypt(result.Encrypt).message;
          expect(message).to.contain('<Content><![CDATA[result: 2]]></Content>');
          done();
        });
      });
    });

    it('should destroy session', function (done) {
      var info = {
        fromUser: 'test',
        toUser: 'test',
        type: 'text',
        content: 'destroy'
      };
      var xml = support.buildXML(info);
      var data = support.postData(cfg.token, cryptor.encrypt(xml));

      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        support.parse(body, function (err, result) {
          var message = cryptor.decrypt(result.Encrypt).message;
          expect(message).to.contain('<Content><![CDATA[销毁会话]]></Content>');

          var info = {
            fromUser: 'test',
            toUser: 'test',
            type: 'text',
            content: '='
          };
          var xml = support.buildXML(info);
          var data = support.postData(cfg.token, cryptor.encrypt(xml));

          request(app)
          .post('/wechat?' + data.querystring)
          .send(data.xml)
          .expect(200)
          .end(function(err, res){
            if (err) return done(err);
            var body = res.text.toString();
            support.parse(body, function (err, result) {
              var message = cryptor.decrypt(result.Encrypt).message;
              expect(message).to.contain('<Content><![CDATA[result: undefined]]></Content>');
              done();
            });
          });
        });
      });
    });
  });
});
