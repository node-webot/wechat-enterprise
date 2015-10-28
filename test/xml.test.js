var parseString = require('xml2js').parseString;
var xml = '<xml>\
   <ToUserName><![CDATA[toUser]]</ToUserName>\
   <AgentID><![CDATA[toAgentID]]</AgentID>\
   <Encrypt><![CDATA[<xml><ToUserName><![CDATA[toUser]]></ToUserName>\
<FromUserName><![CDATA[FromUser]]></FromUserName>\
<CreateTime>1408090502</CreateTime>\
<MsgType><![CDATA[event]]></MsgType>\
<Event><![CDATA[scancode_push]]></Event>\
<EventKey><![CDATA[6]]></EventKey>\
<ScanCodeInfo><ScanType><![CDATA[qrcode]]></ScanType>\
<ScanResult><![CDATA[http://www.xxx.com?id=ddd&aaa=bbb]]></ScanResult>\
</ScanCodeInfo>\
<AgentID>1</AgentID>\
</xml>]]</Encrypt>\
</xml>';

parseString(xml, function (err, result) {
  console.log(JSON.stringify(result, null, 2));
});
