var request = require('supertest');
var template = require('./support').template;
var support = require('./support');
var expect = require('expect.js');

var connect = require('connect');
var wechat = require('../');

var List = require('../').List;

var app = connect();
app.use(connect.query());
app.use(connect.cookieParser());
app.use(connect.session({secret: 'keyboard cat', cookie: {maxAge: 60000}}));

var cfg = require('./config');
var config = {encodingAESKey: cfg.encodingAESKey, token: cfg.token, corpId: cfg.corpid};

app.use('/wechat', wechat(config, wechat.text(function (info, req, res, next) {
  if (info.Content === 'list') {
    res.wait('view', function (err) {
      expect(err).to.not.be.ok();
    });
  } else if (info.Content === 'undefinedlist') {
    res.wait('undefined', function (err) {
      expect(err).to.be.ok();
    });
  } else {
    res.reply('hehe');
  }
})));

describe('wechat.js', function () {
  before(function () {
    List.add('view', [
      ['回复{a}查看我的性别', function (info, req, res) {
        res.reply('我是个妹纸哟');
      }],
      ['回复{b}查看我的年龄', function (info, req, res) {
        res.reply('我今年18岁');
      }],
      ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -'],
      ['回复{nowait}退出问答', function (info, req, res) {
        res.nowait('thanks');
      }]
    ]);
  });

  describe('talk', function () {
    var cryptor = new wechat.WXBizMsgCrypt(cfg.token, cfg.encodingAESKey, cfg.corpid);

    it('should reply hehe when not trigger the list', function (done) {
      var info = {
        fromUser: 'test',
        toUser: 'test',
        type: 'text',
        content: 'a'
      };

      var xml = support.buildXML(info);
      var data = support.postData(cfg.token, cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var body = res.text.toString();
        support.parse(body, function (err, result) {
          var message = cryptor.decrypt(result.Encrypt).message;
          expect(message).to.contain('<Content><![CDATA[hehe]]></Content>');
          done();
        });
      });
    });

    it('should reply the list when trigger the list', function (done) {
      var info = {
        fromUser: 'test',
        toUser: 'test',
        type: 'text',
        content: 'list'
      };

      var xml = support.buildXML(info);
      var data = support.postData(cfg.token, cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var body = res.text.toString();
        support.parse(body, function (err, result) {
          var message = cryptor.decrypt(result.Encrypt).message;
          expect(message).to.contain('<Content><![CDATA[回复a查看我的性别\n回复b查看我的年龄\n回复c查看我的性取向\n回复nowait退出问答]]></Content>');
          done();
        });
      });
    });

    it('should reply with list', function (done) {
      var info = {
        fromUser: 'test',
        toUser: 'test',
        type: 'text',
        content: 'a'
      };

      var xml = support.buildXML(info);
      var data = support.postData(cfg.token, cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var body = res.text.toString();
        support.parse(body, function (err, result) {
          var message = cryptor.decrypt(result.Encrypt).message;
          expect(message).to.contain('<Content><![CDATA[我是个妹纸哟]]></Content>');
          done();
        });
      });
    });

    it('should reply with list also', function (done) {
      var info = {
        fromUser: 'test',
        toUser: 'test',
        type: 'text',
        content: 'b'
      };

      var xml = support.buildXML(info);
      var data = support.postData(cfg.token, cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var body = res.text.toString();
        support.parse(body, function (err, result) {
          var message = cryptor.decrypt(result.Encrypt).message;
          expect(message).to.contain('<Content><![CDATA[我今年18岁]]></Content>');
          done();
        });
      });
    });

    it('should reply with text', function (done) {
      var info = {
        fromUser: 'test',
        toUser: 'test',
        type: 'text',
        content: 'c'
      };

      var xml = support.buildXML(info);
      var data = support.postData(cfg.token, cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var body = res.text.toString();
        support.parse(body, function (err, result) {
          var message = cryptor.decrypt(result.Encrypt).message;
          expect(message).to.contain('<Content><![CDATA[这样的事情怎么好意思告诉你啦- -]]></Content>');
          done();
        });
      });
    });

    it('should reply with default handle', function (done) {
      var info = {
        fromUser: 'test',
        toUser: 'test',
        type: 'text',
        content: 'd'
      };

      var xml = support.buildXML(info);
      var data = support.postData(cfg.token, cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var body = res.text.toString();
        support.parse(body, function (err, result) {
          var message = cryptor.decrypt(result.Encrypt).message;
          expect(message).to.contain('<Content><![CDATA[hehe]]></Content>');
          done();
        });
      });
    });

    it('should reply 500 when undefined list', function (done) {
      var info = {
        fromUser: 'test',
        toUser: 'test',
        type: 'text',
        content: 'undefinedlist'
      };

      var xml = support.buildXML(info);
      var data = support.postData(cfg.token, cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(500)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        expect(body).to.be.contain('UndefinedListError');
        done();
      });
    });

    it('should reply 500 when undefined list', function (done) {
      var info = {
        fromUser: 'test',
        toUser: 'test',
        type: 'text',
        content: 'nowait'
      };

      var xml = support.buildXML(info);
      var data = support.postData(cfg.token, cryptor.encrypt(xml));
      request(app)
      .post('/wechat?' + data.querystring)
      .send(data.xml)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var body = res.text.toString();
        support.parse(body, function (err, result) {
          var message = cryptor.decrypt(result.Encrypt).message;
          expect(message).to.contain('<Content><![CDATA[thanks]]></Content>');
          done();
        });
      });
    });
  });
});
