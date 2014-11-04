var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/**
 * 创建部门
 * 详细请看：http://qydev.weixin.qq.com/wiki/index.php?title=管理部门
 *
 * Examples:
 * ```
 * api.createDepartment(name, opts, callback);
 * ```
 * Opts:
 * - `parentid`, 父部门id，根部门id为1
 * - `order`，在父部门中的次序。从1开始，数字越大排序越靠后
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
 *  "errmsg": "created",
 *  "id": 2
 * }
 * ```
 * @param {String} name 部门名字
 * @param {Object} opts 选项
 * @param {Function} callback 回调函数
 */
exports.createDepartment = function (name, opts, callback) {
  this.preRequest(this._createDepartment, arguments);
};

/*!
 * 创建部门的未封装版本
 */
exports._createDepartment = function (name, opts, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/department/create?access_token=ACCESS_TOKEN
  var url = this.prefix + 'department/create?access_token=' + this.token.accessToken;
  var data = {
    name: name
  };
  if (typeof opts === 'object') {
    data.parentid = Number(opts.parentid) || 1;
    data.order = Number(opts.order) || 1;
  } else {
    data.parentid = Number(opts);
  }

  urllib.request(url, postJSON(data), wrapper(callback));
};

/**
 * 更新部门
 *
 * Examples:
 * ```
 * var opts = {name: 'new name', parentid: 1, order: 5};
 * api.updateDepartment(id, opts, callback);
 * ```
 *
 * Opts:
 * - `name`, 新的部门名字。可选
 * - `parentid`, 父部门id，根部门id为1。可选
 * - `order`，在父部门中的次序。从1开始，数字越大排序越靠后。可选，默认为1
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
 *  "errmsg": "updated"
 * }
 * ```
 * @param {Number} id 部门ID
 * @param {Object} opts 选项
 * @param {Function} callback 回调函数
 */
exports.updateDepartment = function (id, opts, callback) {
  this.preRequest(this._updateDepartment, arguments);
};

/*!
 * 更新部门的未封装版本
 */
exports._updateDepartment = function (id, opts, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/department/update?access_token=ACCESS_TOKEN
  var url = this.prefix + 'department/update?access_token=' + this.token.accessToken;
  var data = {
    id: Number(id)
  };
  if (typeof opts === 'object') {
    if (opts.name) {
      data.name = opts.name;
    }
    if (opts.parentid) {
      data.parentid = Number(opts.parentid);
    }
    if (opts.order) {
      data.order = Number(opts.order) || 1;
    }
  } else {
    data.name = opts;
  }

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
