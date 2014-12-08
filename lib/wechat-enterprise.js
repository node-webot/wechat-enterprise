'use strict';

var xml2js = require('xml2js');
var ejs = require('ejs');
var Session = require('./session');
var List = require('./list');
var WXBizMsgCrypt = require('wechat-crypto');

/*!
 * 响应模版
 */
var tpl = ['<xml>',
    '<ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>',
    '<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>',
    '<CreateTime><%=createTime%></CreateTime>',
    '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
  '<% if (msgType === "news") { %>',
    '<ArticleCount><%=content.length%></ArticleCount>',
    '<Articles>',
    '<% content.forEach(function(item){ %>',
      '<item>',
        '<Title><![CDATA[<%-item.title%>]]></Title>',
        '<Description><![CDATA[<%-item.description%>]]></Description>',
        '<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic %>]]></PicUrl>',
        '<Url><![CDATA[<%-item.url%>]]></Url>',
      '</item>',
    '<% }); %>',
    '</Articles>',
  '<% } else if (msgType === "music") { %>',
    '<Music>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
      '<MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>',
      '<HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>',
    '</Music>',
  '<% } else if (msgType === "voice") { %>',
    '<Voice>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Voice>',
  '<% } else if (msgType === "image") { %>',
    '<Image>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Image>',
  '<% } else if (msgType === "video") { %>',
    '<Video>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
    '</Video>',
  '<% } else if (msgType === "transfer_customer_service") { %>',
    '<% if (content && content.kfAccount) { %>',
      '<TransInfo>',
        '<KfAccount><![CDATA[<%-content.kfAccount%>]]></KfAccount>',
      '</TransInfo>',
    '<% } %>',
  '<% } else { %>',
    '<Content><![CDATA[<%-content%>]]></Content>',
  '<% } %>',
  '</xml>'].join('');

/*!
 * 编译过后的模版
 */
var compiled = ejs.compile(tpl);

var wrapTpl = '<xml>' +
  '<Encrypt><![CDATA[<%-encrypt%>]]></Encrypt>' +
  '<MsgSignature><![CDATA[<%-signature%>]]></MsgSignature>' +
  '<TimeStamp><%-timestamp%></TimeStamp>' +
  '<Nonce><![CDATA[<%-nonce%>]]></Nonce>' +
'</xml>';

var encryptWrap = ejs.compile(wrapTpl);

var load = function (stream, callback) {
  var buffers = [];
  stream.on('data', function (trunk) {
    buffers.push(trunk);
  });
  stream.on('end', function () {
    callback(null, Buffer.concat(buffers));
  });
  stream.once('error', callback);
};

/*!
 * 将xml2js解析出来的对象转换成直接可访问的对象
 */
var formatMessage = function (result) {
  var message = {};
  if (typeof result === 'object') {
    for (var key in result) {
      if (result[key].length === 1) {
        var val = result[key][0];
        if (typeof val === 'object') {
          message[key] = formatMessage(val);
        } else {
          message[key] = (val || '').trim();
        }
      } else {
        message = result[key].map(formatMessage);
      }
    }
  }
  return message;
};

/*!
 * 将回复消息封装成xml格式
 */
var reply = function (content, fromUsername, toUsername) {
  var info = {};
  var type = 'text';
  info.content = content || '';
  if (Array.isArray(content)) {
    type = 'news';
  } else if (typeof content === 'object') {
    if (content.hasOwnProperty('type')) {
      type = content.type;
      info.content = content.content;
    } else {
      type = 'music';
    }
  }
  info.msgType = type;
  info.createTime = new Date().getTime();
  info.toUsername = toUsername;
  info.fromUsername = fromUsername;
  return compiled(info);
};

var respond = function (handler) {
  return function (req, res, next) {
    var message = req.weixin;
    var callback = handler.getHandler(message.MsgType);

    res.reply = function (content) {
      res.writeHead(200);
      // 响应空字符串，用于响应慢的情况，避免微信重试
      if (!content) {
        return res.end();
      }
      var xml = reply(content, message.ToUserName, message.FromUserName);
      var cryptor = req.cryptor || handler.cryptor;
      var wrap = {};
      wrap.encrypt = cryptor.encrypt(xml);
      wrap.nonce = parseInt((Math.random() * 100000000000), 10);
      wrap.timestamp = new Date().getTime();
      wrap.signature = cryptor.getSignature(wrap.timestamp, wrap.nonce, wrap.encrypt);
      res.end(encryptWrap(wrap));
    };

    var done = function () {
      // 如果session中有_wait标记
      if (message.MsgType === 'text' && req.wxsession && req.wxsession._wait) {
        var list = List.get(req.wxsession._wait);
        var handle = list.get(message.Content);
        var wrapper = function (message) {
          return handler.handle ? function(req, res) {
            res.reply(message);
          } : function (info, req, res) {
            res.reply(message);
          };
        };

        // 如果回复命中规则，则用预置的方法回复
        if (handle) {
          callback = typeof handle === 'string' ? wrapper(handle) : handle;
        }
      }

      // 兼容旧API
      if (handler.handle) {
        callback(req, res, next);
      } else {
        callback(message, req, res, next);
      }
    };

    if (req.sessionStore) {
      var storage = req.sessionStore;
      var _end = res.end;
      var openid = message.FromUserName + ':' + message.ToUserName;
      res.end = function () {
        _end.apply(res, arguments);
        if (req.wxsession) {
          req.wxsession.save();
        }
      };
      // 等待列表
      res.wait = function (name, callback) {
        var list = List.get(name);
        if (list) {
          req.wxsession._wait = name;
          res.reply(list.description);
        } else {
          var err = new Error('Undefined list: ' + name);
          err.name = 'UndefinedListError';
          res.writeHead(500);
          res.end(err.name);
          callback && callback(err);
        }
      };

      // 清除等待列表
      res.nowait = function () {
        delete req.wxsession._wait;
        res.reply.apply(res, arguments);
      };

      storage.get(openid, function (err, session) {
        if (!session) {
          req.wxsession = new Session(openid, req);
          req.wxsession.cookie = req.session.cookie;
        } else {
          req.wxsession = new Session(openid, req, session);
        }
        done();
      });
    } else {
      done();
    }
  };
};

/**
 * 微信自动回复平台的内部的Handler对象
 * @param {Object} config 企业号的开发者配置对象
 * @param {Function} handle handle对象
 *
 * config:
 * ```
 * {
 *   token: '',          // 公众平台上，开发者设置的Token
 *   encodingAESKey: '', // 公众平台上，开发者设置的EncodingAESKey
 *   corpId: '',         // 企业号的CorpId
 * }
 * ```
 */
var Handler = function (config, handle) {
  this.config = config;
  this.handlers = {};
  this.handle = handle;
};

/**
 * 设置handler对象
 * 按消息设置handler对象的快捷方式
 *
 * - `text(fn)`
 * - `image(fn)`
 * - `voice(fn)`
 * - `video(fn)`
 * - `location(fn)`
 * - `link(fn)`
 * - `event(fn)`
 * @param {String} type handler处理的消息类型
 * @param {Function} handle handle对象
 */
Handler.prototype.setHandler = function (type, fn) {
  this.handlers[type] = fn;
  return this;
};

['text', 'image', 'voice', 'video', 'location', 'link', 'event'].forEach(function (method) {
  Handler.prototype[method] = function (fn) {
    return this.setHandler(method, fn);
  };
});

/**
 * 根据消息类型取出handler对象
 * @param {String} type 消息类型
 */
Handler.prototype.getHandler = function (type) {
  return this.handle || this.handlers[type] || function (info, req, res, next) {
    next();
  };
};

/**
 * 根据Handler对象生成响应方法，并最终生成中间件函数
 */
Handler.prototype.middlewarify = function () {
  var that = this;
  var config = this.config;
  that.cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.corpId);
  var _respond = respond(this);

  return function (req, res, next) {
    var method = req.method;
    var signature = req.query.msg_signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var cryptor = req.cryptor || that.cryptor;

    if (method === 'GET') {
      var echostr = req.query.echostr;
      if (signature !== cryptor.getSignature(timestamp, nonce, echostr)) {
        res.writeHead(401);
        res.end('Invalid signature');
        return;
      }
      var result = cryptor.decrypt(echostr);
      // TODO 检查corpId的正确性
      res.writeHead(200);
      res.end(result.message);
    } else if (method === 'POST') {
      load(req, function (err, buf) {
        if (err) {
          return next(err);
        }
        var xml = buf.toString('utf-8');
        if (!xml) {
          var emptyErr = new Error('body is empty');
          emptyErr.name = 'Wechat';
          return next(emptyErr);
        }
        xml2js.parseString(xml, {trim: true}, function (err, result) {
          if (err) {
            err.name = 'BadMessage' + err.name;
            return next(err);
          }
          var xml = formatMessage(result.xml);
          var encryptMessage = xml.Encrypt;
          if (signature !== cryptor.getSignature(timestamp, nonce, encryptMessage)) {
            res.writeHead(401);
            res.end('Invalid signature');
            return;
          }
          var decrypted = cryptor.decrypt(encryptMessage);
          var messageWrapXml = decrypted.message;
          if (messageWrapXml === '') {
            res.writeHead(401);
            res.end('Invalid corpid');
            return;
          }
          req.weixin_xml = messageWrapXml;
          xml2js.parseString(messageWrapXml, {trim: true}, function (err, result) {
            if (err) {
              err.name = 'BadMessage' + err.name;
              return next(err);
            }
            req.weixin = formatMessage(result.xml);
            _respond(req, res, next);
          });
        });
      });
    } else {
      res.writeHead(501);
      res.end('Not Implemented');
    }
  };
};

/**
 * 根据口令
 *
 * Examples:
 * 使用wechat作为自动回复中间件的三种方式
 * ```
 * wechat(config, function (req, res, next) {});
 *
 * wechat(config, wechat.text(function (message, req, res, next) {
 *   // TODO
 * }).location(function (message, req, res, next) {
 *   // TODO
 * }));
 *
 * wechat(config)
 *   .text(function (message, req, res, next) {
 *     // TODO
 *   }).location(function (message, req, res, next) {
 *    // TODO
 *   }).middleware();
 * ```
 * 静态方法
 *
 * - `text`，处理文字推送的回调函数，接受参数为(text, req, res, next)。
 * - `image`，处理图片推送的回调函数，接受参数为(image, req, res, next)。
 * - `voice`，处理声音推送的回调函数，接受参数为(voice, req, res, next)。
 * - `video`，处理视频推送的回调函数，接受参数为(video, req, res, next)。
 * - `location`，处理位置推送的回调函数，接受参数为(location, req, res, next)。
 * - `link`，处理链接推送的回调函数，接受参数为(link, req, res, next)。
 * - `event`，处理事件推送的回调函数，接受参数为(event, req, res, next)。
 * @param {Object} config 企业号的开发者配置对象
 * @param {Function} handle 生成的回调函数，参见示例
 */
var middleware = function (config, handle) {
  if (arguments.length === 1) {
    return new Handler(config);
  }

  if (handle instanceof Handler) {
    handle.config = config;
    return handle.middlewarify();
  } else {
    return new Handler(config, handle).middlewarify();
  }
};

['text', 'image', 'voice', 'video', 'location', 'link', 'event'].forEach(function (method) {
  middleware[method] = function (fn) {
    return (new Handler())[method](fn);
  };
});

middleware.reply = reply;
middleware.encryptWrap = encryptWrap;
middleware.toXML = compiled;

module.exports = middleware;
