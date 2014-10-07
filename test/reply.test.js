var expect = require('expect.js');
var reply = require('../').reply;

describe('reply', function () {
  describe('reply text', function () {
    it('reply("text") should ok', function () {
      var result = reply('hello world', 'from', 'to');
      expect(result).to.be.contain('<Content><![CDATA[hello world]]></Content>');
      expect(result).to.be.contain('<MsgType><![CDATA[text]]></MsgType>');
      expect(result).to.be.contain('<ToUserName><![CDATA[to]]></ToUserName>');
      expect(result).to.be.contain('<FromUserName><![CDATA[from]]></FromUserName>');
    });

    it('reply({type: "text", content: content}) should ok', function () {
      var result = reply({type: 'text', content: 'hello world'}, 'from', 'to');
      expect(result).to.be.contain('<Content><![CDATA[hello world]]></Content>');
      expect(result).to.be.contain('<MsgType><![CDATA[text]]></MsgType>');
      expect(result).to.be.contain('<ToUserName><![CDATA[to]]></ToUserName>');
      expect(result).to.be.contain('<FromUserName><![CDATA[from]]></FromUserName>');
    });
  });

  describe('reply music', function () {
    it('reply(object) should ok', function () {
      var result = reply({
        title: "来段音乐吧",
        description: "一无所有",
        musicUrl: "http://mp3.com/xx.mp3",
        hqMusicUrl: "http://mp3.com/xx.mp3"
      }, 'from', 'to');
      expect(result).to.be.contain('<Title><![CDATA[来段音乐吧]]></Title>');
      expect(result).to.be.contain('<MsgType><![CDATA[music]]></MsgType>');
      expect(result).to.be.contain('<Description><![CDATA[一无所有]]></Description>');
      expect(result).to.be.contain('<ToUserName><![CDATA[to]]></ToUserName>');
      expect(result).to.be.contain('<MusicUrl><![CDATA[http://mp3.com/xx.mp3]]></MusicUrl>');
      expect(result).to.be.contain('<HQMusicUrl><![CDATA[http://mp3.com/xx.mp3]]></HQMusicUrl>');
      expect(result).to.be.contain('<FromUserName><![CDATA[from]]></FromUserName>');
    });

    it('reply(object) with type should ok', function () {
      var result = reply({
        type: "music",
        content: {
          title: "来段音乐吧",
          description: "一无所有",
          musicUrl: "http://mp3.com/xx.mp3",
          hqMusicUrl: "http://mp3.com/xx.mp3"
        }
      }, 'from', 'to');
      expect(result).to.be.contain('<Title><![CDATA[来段音乐吧]]></Title>');
      expect(result).to.be.contain('<MsgType><![CDATA[music]]></MsgType>');
      expect(result).to.be.contain('<Description><![CDATA[一无所有]]></Description>');
      expect(result).to.be.contain('<ToUserName><![CDATA[to]]></ToUserName>');
      expect(result).to.be.contain('<MusicUrl><![CDATA[http://mp3.com/xx.mp3]]></MusicUrl>');
      expect(result).to.be.contain('<HQMusicUrl><![CDATA[http://mp3.com/xx.mp3]]></HQMusicUrl>');
      expect(result).to.be.contain('<FromUserName><![CDATA[from]]></FromUserName>');
    });
  });

  describe('reply news', function () {
    var news = [
      {
        title: '你来我家接我吧',
        description: '这是女神与高富帅之间的对话',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://nodeapi.cloudfoundry.com/'
      }
    ];

    it('reply(Array) should ok', function () {
      var result = reply(news, 'from', 'to');
      expect(result).to.be.contain('<ArticleCount>1</ArticleCount>');
      expect(result).to.be.contain('<Title><![CDATA[你来我家接我吧]]></Title>');
      expect(result).to.be.contain('<Description><![CDATA[这是女神与高富帅之间的对话]]></Description>');
      expect(result).to.be.contain('<PicUrl><![CDATA[http://nodeapi.cloudfoundry.com/qrcode.jpg]]></PicUrl>');
      expect(result).to.be.contain('<Url><![CDATA[http://nodeapi.cloudfoundry.com/]]></Url>');
      expect(result).to.be.contain('<MsgType><![CDATA[news]]></MsgType>');
      expect(result).to.be.contain('<ToUserName><![CDATA[to]]></ToUserName>');
      expect(result).to.be.contain('<FromUserName><![CDATA[from]]></FromUserName>');
    });

    it('reply({type: "news", content: news}) should ok', function () {
      var result = reply({type: 'news', content: news}, 'from', 'to');
      expect(result).to.be.contain('<ArticleCount>1</ArticleCount>');
      expect(result).to.be.contain('<Title><![CDATA[你来我家接我吧]]></Title>');
      expect(result).to.be.contain('<Description><![CDATA[这是女神与高富帅之间的对话]]></Description>');
      expect(result).to.be.contain('<PicUrl><![CDATA[http://nodeapi.cloudfoundry.com/qrcode.jpg]]></PicUrl>');
      expect(result).to.be.contain('<Url><![CDATA[http://nodeapi.cloudfoundry.com/]]></Url>');
      expect(result).to.be.contain('<MsgType><![CDATA[news]]></MsgType>');
      expect(result).to.be.contain('<ToUserName><![CDATA[to]]></ToUserName>');
      expect(result).to.be.contain('<FromUserName><![CDATA[from]]></FromUserName>');
    });
  });

  describe('reply image', function () {
    var image = {
      mediaId: 'mediaId'
    };

    it('reply({type: "image", content: image}) should ok', function () {
      var result = reply({type: 'image', content: image}, 'from', 'to');
      expect(result).to.be.contain('<Image><MediaId><![CDATA[mediaId]]></MediaId></Image>');
      expect(result).to.be.contain('<MsgType><![CDATA[image]]></MsgType>');
      expect(result).to.be.contain('<ToUserName><![CDATA[to]]></ToUserName>');
      expect(result).to.be.contain('<FromUserName><![CDATA[from]]></FromUserName>');
    });
  });

  describe('reply voice', function () {
    var voice = {
      mediaId: 'mediaId'
    };

    it('reply({type: "voice", content: voice}) should ok', function () {
      var result = reply({type: 'voice', content: voice}, 'from', 'to');
      expect(result).to.be.contain('<Voice><MediaId><![CDATA[mediaId]]></MediaId></Voice>');
      expect(result).to.be.contain('<MsgType><![CDATA[voice]]></MsgType>');
      expect(result).to.be.contain('<ToUserName><![CDATA[to]]></ToUserName>');
      expect(result).to.be.contain('<FromUserName><![CDATA[from]]></FromUserName>');
    });
  });

  describe('reply video', function () {
    var video = {
      mediaId: 'mediaId',
      thumbMediaId: 'thumbMediaId'
    };

    it('reply({type: "video", content: video}) should ok', function () {
      var result = reply({type: 'video', content: video}, 'from', 'to');
      expect(result).to.be.contain('<Video><MediaId><![CDATA[mediaId]]></MediaId><Title><![CDATA[]]></Title><Description><![CDATA[]]></Description></Video>');
      expect(result).to.be.contain('<MsgType><![CDATA[video]]></MsgType>');
      expect(result).to.be.contain('<ToUserName><![CDATA[to]]></ToUserName>');
      expect(result).to.be.contain('<FromUserName><![CDATA[from]]></FromUserName>');
    });
  });
});
