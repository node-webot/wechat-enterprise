/**
 * 详细请看：http://qydev.weixin.qq.com/wiki/index.php?title=管理部门
 */
var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 创建部门
 *
 * ```
 * Examples:
 * ```
 * api.createDepartment(name, id, callback);
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
 *  "errmsg": "created",
 *  "id": 2
 * }
 * ```
 * @param {String} name 部门名字
 * @param {Number} parentid 上级部门ID
 * @param {Function} callback 回调函数
 */
exports.createDepartment = function (name, parentid, callback) {
  this.preRequest(this._createDepartment, arguments);
};

/*!
 * 创建部门的未封装版本
 */
exports._createDepartment = function (name, parentid, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/department/create?access_token=ACCESS_TOKEN
  var url = this.prefix + 'department/create?access_token=' + this.token.accessToken;
  var data = {
    name: name,
    parentid: Number(parentid)
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 更新部门
 *
 * Examples:
 * ```
 * api.updateDepartment(id, name, callback);
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
 * @param {Number} id 部门ID
 * @param {String} name 部门新名字
 * @param {Function} callback 回调函数
 */
exports.updateDepartment = function (id, name, callback) {
  this.preRequest(this._updateDepartment, arguments);
};

/*!
 * 更新部门的未封装版本
 */
exports._updateDepartment = function (id, name, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/department/update?access_token=ACCESS_TOKEN
  var url = this.prefix + 'department/update?access_token=' + this.token.accessToken;
  var data = {
    name: name,
    id: Number(id)
  };
  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 删除部门
 *
 * Examples:
 * ```
 * api.deleteDepartment(id, callback);
 * api.deleteDepartment([id1, id2], callback);
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
 * @param {Number/Array} id 部门ID
 * @param {Function} callback 回调函数
 */
exports.deleteDepartment = function (id, callback) {
  this.preRequest(this._deleteDepartment, arguments);
};

/*!
 * 删除部门的未封装版本
 */
exports._deleteDepartment = function (id, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/department/delete?access_token=ACCESS_TOKEN&id=1&id=2
  var url = this.prefix + 'department/delete?access_token=' + this.token.accessToken;
  var opts = {dataType: 'json', data: {id: id}};
  urllib.request(url, opts, wrapper(callback));
};

/**
 * 查看所有部门
 *
 * Examples:
 * ```
 * api.getDepartments(callback);
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
 *  "errmsg": "ok",
 *  "department": [
 *    {
 *      "id": 1,
 *      "name": "广州研发中心",
 *      "parentid": 0
 *    },
 *    {
 *      "id": 2
 *      "name": "邮箱产品部",
 *      "parentid": 1
 *    }
 *  ]
 * }
 * ```
 * @param {Function} callback 回调函数
 */
exports.getDepartments = function (callback) {
  this.preRequest(this._getDepartments, arguments);
};

/*!
 * 获取部门列表的未封装版本
 */
exports._getDepartments = function (callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=ACCESS_TOKEN
  var url = this.prefix + 'department/list?access_token=' + this.token.accessToken;
  urllib.request(url, {dataType: 'json'}, wrapper(callback));
};
