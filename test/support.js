var querystring = require('querystring');

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
