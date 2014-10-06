var querystring = require('querystring');
var request = require('supertest');
var template = require('./support').template;
var tail = require('./support').tail;

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
  // 微信输入信息都在req.weixin上
  var info = req.weixin;
  // 回复屌丝(普通回复)
  if (info.FromUserName === 'diaosi') {
    res.reply('hehe');
  } else if (info.FromUserName === 'test') {
    res.reply({
      content: 'text object',
      type: 'text'
    });
  } else if (info.FromUserName === 'hehe') {
    res.reply({
      title: "来段音乐吧<",
      description: "一无所有>",
      musicUrl: "http://mp3.com/xx.mp3?a=b&c=d",
      hqMusicUrl: "http://mp3.com/xx.mp3?foo=bar"
    });
  } else if (info.FromUserName === 'cs') {
    res.transfer2CustomerService();
  } else if (info.FromUserName === 'kf') {
    res.transfer2CustomerService('test1@test');
  } else {
  // 回复高富帅(图文回复)
    res.reply([
      {
        title: '你来我家接我吧',
        description: '这是女神与高富帅之间的对话',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://nodeapi.cloudfoundry.com/'
      }
    ]);
  }
}));

describe('wechat.js', function () {
  it('should ok', function (done) {
    var _tail = tail(token);
    console.log(_tail);
    request(app)
      .get('/wechat' + _tail)
      .expect(200)
      .expect('Invalid signature', done);
  });
});
