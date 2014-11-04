# 新手上路
## Prerequirements
- 前往[微信](https://qy.weixin.qq.com/)申请企业号
- 得到`CorpID`、`Token`和`EncodingAESKey`

## Installation

```sh
$ npm install wechat-enterprise
```

## Usage
```
var wechat = require('wechat-enterprise');
var app = express();
app.use(connect.query());

var config = {
  token: 'YOUR Token',
  encodingAESKey: 'YOUR EncodingAESKey',
  corpId: 'YOUR CorpID'
};

app.use('/corp', wechat(config, function (req, res, next) {
  res.writeHead(200);
  res.end('hello node api');
}));

// 或者
app.use('/corp', wechat(config, wechat.text(function (message, req, res, next) {
  // TODO
}).location(function (message, req, res, next) {
  // TODO
})));

// 或者
app.use('/corp', wechat(config)
  .text(function (message, req, res, next) {
    // TODO
  })
  .location(function (message, req, res, next) {
    // TODO
  })
  .event(function (message, req, res, next) {
    // TODO
  })
  .middleware());
```
## 响应用户
调用`res.reply()`方法响应用户。类似`res.end()`。

```
function (message, req, res, next) {
  // 响应文字
  res.reply('hehe');
  res.reply({type: "text", content: 'content'});
  // 响应音乐
  res.reply({
    type: "music",
    content: {
      title: "来段音乐吧",
      description: "一无所有",
      musicUrl: "http://mp3.com/xx.mp3",
      hqMusicUrl: "http://mp3.com/xx.mp3"
    }
  });
  // 响应图文消息
  res.reply([
    {
      title: '你来我家接我吧',
      description: '这是女神与高富帅之间的对话',
      picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
      url: 'http://nodeapi.cloudfoundry.com/'
    }
  ]);
  // 响应图片
  res.reply({
    type: "image",
    content: {
      mediaId: 'mediaId'
    }
  });
  // 响应图片
  res.reply({
    type: "image",
    content: {
      mediaId: 'mediaId'
    }
  });
  // 响应声音
  res.reply({
    type: "voice",
    content: {
      mediaId: 'mediaId'
    }
  });
  // 响应视频
  res.reply({
    type: "video",
    content: {
      mediaId: 'mediaId',
      thumbMediaId: 'thumbMediaId'
    }
  });
}
```

## 调用API

```
// 构造实例
var api = new API('YOUR CorpID', 'YOUR CorpSecret', 'YOUR Agent');
api.getUser('userid', function (err, data, res) {
  // response
});
```

无需尝试处理access token。

## 集群Access Token管理
请修改saveToken和getToken两个方法：

```
var api = new API('corpid', 'secret', 'agentid', function (callback) {
  // 传入一个获取全局token的方法
  fs.readFile('access_token.txt', 'utf8', function (err, txt) {
    if (err) {return callback(err);}
    callback(null, JSON.parse(txt));
  });
}, function (token, callback) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
  fs.writeFile('access_token.txt', JSON.stringify(token), callback);
});
```
