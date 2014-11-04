var querystring = require('querystring');
var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 创建成员
 * 详细请看：http://qydev.weixin.qq.com/wiki/index.php?title=管理成员
 *
 * Examples:
 * ```
 * api.createUser(user, callback);
 * ```
 * User:
 * ```
 * {
 *   "userid": "zhangsan",
 *   "name": "张三",
 *   "department": [1, 2],
 *   "position": "产品经理",
 *   "mobile": "15913215421",
 *   "gender": 1,
 *   "tel": "62394",
 *   "email": "zhangsan@gzdev.com",
 *   "weixinid": "zhangsan4dev"
 * }
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "errcode": 0,
 *   "errmsg": "created"
 * }
 * ```
 * @param {Object} user 成员信息
 * @param {Function} callback 回调函数
 */
exports.createUser = function (user, callback) {
  this.preRequest(this._createUser, arguments);
};

/*!
 * 创建成员的未封装版本
 */
exports._createUser = function (user, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/user/create?access_token=ACCESS_TOKEN
  var url = this.prefix + 'user/create?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(user), wrapper(callback));
};

/**
 * 更新成员
 *
 * Examples:
 * ```
 * api.updateUser(user, callback);
 * ```
 * User:
 * ```
 * {
 *   "userid": "zhangsan",
 *   "name": "李四",
 *   "department": [1],
 *   "position": "后台工程师",
 *   "mobile": "15913215421",
 *   "gender": 1,
 *   "tel": "62394",
 *   "email": "zhangsan@gzdev.com",
 *   "weixinid": "lisifordev",
 *   "enable": 1
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
 *  "errmsg": "updated"
 * }
 * ```
 * @param {Object} user 成员信息
 * @param {Function} callback 回调函数
 */
exports.updateUser = function (user, callback) {
  this.preRequest(this._updateUser, arguments);
};

/*!
 * 更新成员的未封装版本
 */
exports._updateUser = function (user, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/user/update?access_token=ACCESS_TOKEN
  var url = this.prefix + 'user/update?access_token=' + this.token.accessToken;
  urllib.request(url, postJSON(user), wrapper(callback));
};

/**
 * 删除成员
 *
 * Examples:
 * ```
 * api.deleteUser(id, callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode": 0,
 *  "errmsg": "deleted"
 * }
 * ```
 * @param {Number} id 成员ID
 * @param {Function} callback 回调函数
 */
exports.deleteUser = function (id, callback) {
  this.preRequest(this._deleteUser, arguments);
};

/*!
 * 删除成员的未封装版本
 */
exports._deleteUser = function (id, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/user/delete?access_token=ACCESS_TOKEN&userid=lisi
  var url = this.prefix + 'user/delete?access_token=' + this.token.accessToken;
  var opts = {dataType: 'json', data: {userid: id}};
  urllib.request(url, opts, wrapper(callback));
};

/**
 * 获取成员
 *
 * Examples:
 * ```
 * api.getUser(id, callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "errcode": 0,
 *   "errmsg": "ok",
 *   "userid": "zhangsan",
 *   "name": "李四",
 *   "department": [1, 2],
 *   "position": "后台工程师",
 *   "mobile": "15913215421",
 *   "gender": 1,
 *   "tel": "62394",
 *   "email": "zhangsan@gzdev.com",
 *   "weixinid": "lisifordev",
 *   "avatar": "http://wx.qlogo.cn/mmopen/ajNVdqHZLLA3WJ6DSZUfiakYe37PKnQhBIeOQBO4czqrnZDS79FH5Wm5m4X69TBicnHFlhiafvDwklOpZeXYQQ2icg/0",
 *   "status": 1
 * }
 * ```
 * @param {Number} id 成员ID
 * @param {Function} callback 回调函数
 */
exports.getUser = function (id, callback) {
  this.preRequest(this._getUser, arguments);
};

/*!
 * 获取成员的未封装版本
 */
exports._getUser = function (id, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&userid=lisi
  var url = this.prefix + 'user/get?access_token=' + this.token.accessToken;
  var opts = {dataType: 'json', data: {userid: id}};
  urllib.request(url, opts, wrapper(callback));
};

/**
 * 获取部门成员
 *
 * Examples:
 * ```
 * api.getDepartmentUsers(departmentId, fetchChild, status, callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "errcode": 0,
 *   "errmsg": "ok",
 *   "userlist": [
 *     {
 *       "userid": "zhangsan",
 *       "name": "李四"
 *     }
 *   ]
 * }
 * ```
 * @param {Number} departmentId 部门ID
 * @param {Number} fetchChild 值：1/0，是否递归获取子部门下面的成员
 * @param {Number} status 0获取全部员工，1获取已关注成员列表，2获取禁用成员列表，4获取未关注成员列表。status可叠加
 * @param {Function} callback 回调函数
 */
exports.getDepartmentUsers = function (departmentId, fetchChild, status, callback) {
  this.preRequest(this._getDepartmentUsers, arguments);
};

/*!
 * 获取部门成员的未封装版本
 */
exports._getDepartmentUsers = function (departmentId, fetchChild, status, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=ACCESS_TOKEN&department_id=1&fetch_child=0&status=0
  var url = this.prefix + 'user/simplelist?access_token=' + this.token.accessToken;
  var opts = {
    dataType: 'json',
    data: {
      department_id: departmentId,
      fetch_child: fetchChild,
      status: status
    }
  };
  urllib.request(url, opts, wrapper(callback));
};

/**
 * 根据Code获取用户ID
 *
 * 详情：http://qydev.weixin.qq.com/wiki/index.php?title=根据code获取成员信息
 * Examples:
 * ```
 * api.getUserIdByCode(code, callback);
 * ```
 *
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *   "UserId": "USERID"
 * }
 * ```
 * @param {String} code OAuth授权获取的code
 * @param {Function} callback 回调函数
 */
exports.getUserIdByCode = function (code, callback) {
  this.preRequest(this._getUserIdByCode, arguments);
};

/*!
 * 获取成员的未封装版本
 */
exports._getUserIdByCode = function (code, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=ACCESS_TOKEN&code=CODE&agentid=AGENTID
  var url = this.prefix + 'user/getuserinfo?access_token=' + this.token.accessToken;
  var opts = {
    dataType: 'json',
    data: {
      code: code,
      agentid: this.agentid
    }
  };
  urllib.request(url, opts, wrapper(callback));
};

/**
 * 获取授权页面的URL地址
 * @param {String} redirect 授权后要跳转的地址
 * @param {String} state 开发者可提供的数据
 * @param {String} scope 作用范围，值为snsapi_userinfo和snsapi_base，前者用于弹出，后者用于跳转
 */
exports.getAuthorizeURL = function (redirect, state, scope) {
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  var info = {
    appid: this.corpid,
    redirect_uri: redirect,
    response_type: 'code',
    scope: scope || 'snsapi_base',
    state: state || ''
  };

  return url + '?' + querystring.stringify(info) + '#wechat_redirect';
};
