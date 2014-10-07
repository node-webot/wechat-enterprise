var querystring = require('querystring');
var xml2js = require('xml2js');

exports.tail = function (token, message, get) {
  var q = {
    timestamp: new Date().getTime(),
    nonce: parseInt((Math.random() * 100000000000), 10)
  };
  if (get) {
    q.echostr = message;
  }
  var s = [token, q.timestamp, q.nonce, message].sort().join('');
  q.msg_signature = require('crypto').createHash('sha1').update(s).digest('hex');
  return querystring.stringify(q);
};

var tpl = '<xml>' +
  '<ToUserName><![CDATA[<%-toUser%>]]></ToUserName>' +
  '<AgentID><![CDATA[<%-toAgentID%>]]></AgentID>' +
  '<Encrypt><![CDATA[<%-msg_encrypt%>]]></Encrypt>' +
'</xml>';

exports.template = require('ejs').compile(tpl);

exports.buildXML = require('ejs').compile('<xml>' +
  '<ToUserName><![CDATA[<%-toUser%>]]></ToUserName>' +
  '<FromUserName><![CDATA[<%-fromUser%>]]></FromUserName>' +
  '<CreateTime><%-new Date().getTime()%></CreateTime>' +
  '<MsgType><![CDATA[text]]></MsgType>' +
  '<Content><![CDATA[<%-content%>]]></Content>' +
  '<MsgId>msgid</MsgId>' +
  '<AgentID>1</AgentID>' +
'</xml>');

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

exports.parse = function (xml, callback) {
  xml2js.parseString(xml, {trim: true}, function (err, result) {
    var xml = formatMessage(result.xml);
    callback(null, xml);
  });
};

exports.postData = function (token, message) {
  var q = {
    timestamp: new Date().getTime(),
    nonce: parseInt((Math.random() * 100000000000), 10)
  };

  var s = [token, q.timestamp, q.nonce, message].sort().join('');
  var signature = require('crypto').createHash('sha1').update(s).digest('hex');
  q.msg_signature = signature;

  var info = {
    msg_encrypt: message,
    toAgentID: 'agentid',
    toUser: 'to_user'
  };

  return {
    xml: exports.template(info),
    querystring: querystring.stringify(q)
  };
};
