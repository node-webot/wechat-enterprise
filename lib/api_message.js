var urllib = require('urllib');
var util = require('./util');
var extend = require('util')._extend;
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 发送消息分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
 * 详细请看：http://qydev.weixin.qq.com/wiki/index.php?title=发送接口说明
 * Examples:
 * ```
 * api.send(to, message, callback);
 * ```
 * To:
 * ```
 * {
 *  "touser": "UserID1|UserID2|UserID3",
 *  "toparty": " PartyID1 | PartyID2 ",
 *  "totag": " TagID1 | TagID2 "
 * }
 * ```
 * Message:
 * 文本消息：
 * ```
 * {
 *  "msgtype": "text",
 *  "text": {
 *    "content": "Holiday Request For Pony(http://xxxxx)"
 *  },
 *  "safe":"0"
 * }
 * ```
 * 图片消息：
 * ```
 * {
 *  "msgtype": "image",
 *  "image": {
 *    "media_id": "MEDIA_ID"
 *  },
 *  "safe":"0"
 * }
 * ```
 * 图片消息：
 * ```
 * {
 *  "msgtype": "image",
 *  "image": {
 *    "media_id": "MEDIA_ID"
 *  },
 *  "safe":"0"
 * }
 * ```
 * 语音消息：
 * ```
 * {
 *  "msgtype": "voice",
 *  "voice": {
 *    "media_id": "MEDIA_ID"
 *  },
 *  "safe":"0"
 * }
 * ```
 * 视频消息：
 * ```
 * {
 *  "msgtype": "video",
 *  "video": {
 *    "media_id": "MEDIA_ID"
 *    "title": "Title",
 *    "description": "Description"
 *  },
 *  "safe":"0"
 * }
 * ```
 * 文件消息：
 * ```
 * {
 *  "msgtype": "file",
 *  "file": {
 *    "media_id": "MEDIA_ID"
 *  },
 *  "safe":"0"
 * }
 * ```
 * 图文消息：
 * ```
 * {
 *  "msgtype": "news",
 *  "news": {
 *    "articles":[
 *      {
 *        "title": "Title",
 *        "description": "Description",
 *        "url": "URL",
 *        "picurl": "PIC_URL",
 *      },
 *      {
 *        "title": "Title",
 *        "description": "Description",
 *        "url": "URL",
 *        "picurl": "PIC_URL",
 *      }
 *    ]
 *  },
 *  "safe":"0"
 * }
 * ```
 * MP消息：
 * ```
 * {
 *  "msgtype": "mpnews",
 *  "mpnews": {
 *    "articles":[
 *      {
 *        "thumb_media_id": "id",
 *        "author": "Author",
 *        "content_source_url": "URL",
 *        "content": "Content"
 *        "digest": "Digest description",
 *        "show_cover_pic": "0"
 *      },
 *      {
 *        "thumb_media_id": "id",
 *        "author": "Author",
 *        "content_source_url": "URL",
 *        "content": "Content"
 *        "digest": "Digest description",
 *        "show_cover_pic": "0"
 *      }
 *    ],
 *    "media_id": "id"
 *  },
 *  "safe":"0"
 * }
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode": 0,
 *  "errmsg": "ok",
 *  "invaliduser": "UserID1",
 *  "invalidparty":"PartyID1",
 *  "invalidtag":"TagID1"
 * }
 * ```
 *
 * @param {Object} to 接受消息的用户
 * @param {Object} message 消息对象
 * @param {Function} callback 回调函数
 */
exports.send = function (to, message, callback) {
  this.preRequest(this._send, arguments);
};

/*!
 * 发送消息的未封装版本
 */
exports._send = function (to, message, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=ACCESS_TOKEN
  var url = this.prefix + 'message/send?access_token=' + this.token.accessToken;
  var data = {
    agentid: this.agentid
  };
  extend(data, to);
  extend(data, message);

  urllib.request(url, postJSON(data), wrapper(callback));
};
