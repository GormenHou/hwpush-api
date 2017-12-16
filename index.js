'use strict';

var API = require('./lib/api_common');
// 通知栏消息推送
API.mixin(require('./lib/api_ncmsg'));
// 透传消息推送
API.mixin(require('./lib/api_transmsg'));
module.exports = API;
