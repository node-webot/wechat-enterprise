var wechat = require('./lib/wechat-enterprise');
wechat.List = require('./lib/list');
var API = require('./lib/api_common');
// 部门管理
API.mixin(require('./lib/api_department'));
// 媒体管理（上传、下载）
API.mixin(require('./lib/api_media'));
// 菜单管理
API.mixin(require('./lib/api_menu'));
// 消息发送
API.mixin(require('./lib/api_message'));
// 标签管理
API.mixin(require('./lib/api_tag'));
// 用户管理
API.mixin(require('./lib/api_user'));

wechat.API = API;
wechat.util = require('./lib/util');
module.exports = wechat;
