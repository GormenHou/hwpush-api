'use strict';

/*!
 * 对返回结果的一层封装，如果遇见华为返回的错误，将返回一个错误
 * 参见：http://developer.huawei.com/consumer/cn/service/hms/catalog/huaweipush.html?page=hmssdk_huaweipush_api_reference_s2
 */
exports.wrapper = function (callback) {
  return function (err, data, res) {
    callback = callback || function () {};
    if (err) {
      err.name = 'HwpushAPI' + err.name;
      return callback(err, data, res);
    }
    if (data && data.errcode) {
      err.name = 'HwpushAPIError';
      err.code = data.errcode;
      return callback(err, data, res);
    }
    if (data == null) {
      err = new Error('No data received.');
      err.name = 'HwpushAPIError';
      err.code = -1;
      return callback(err, data, res);
    }
    callback(null, data, res);
  };
};

/*!
 * 对提交参数一层封装，当POST JSON，并且结果也为JSON时使用
 * 对我貌似没啥用
 */
exports.postJSON = function (data) {
  return {
    dataType: 'json',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };
};

exports.make = function (host, name, fn) {
  host[name] = function () {
    this.preRequest(this['_' + name], arguments);
  };
  host['_' + name] = fn;
};

//校验数据格式是否正确
exports.checkNCData = function (data) {
  var rtn = {
    status: 0
  }
  if (data) {
    if (!data.deviceToken && (!data.device_token_list || data.device_token_list.toString() !== '[object Array]' || data.device_token_list.length === 0)) {
      rtn = {
        status: 1,
        message: '推送目标机器的token不存在'
      }
    }
    if (data.deviceToken && data.device_token_list) {
      rtn = {
        status: 1,
        message: 'deviceToken 和 device_token_list不能同时存在'
      }
    }
    if(data.device_token_list && data.device_token_list.length === 1) {
      rtn = {
        status: 1,
        message: '推送目标列表只有一个，请使用deviceToken参数'
      }
    }
    if(data.device_token_list && data.device_token_list.length > 1000) {
      rtn = {
        status: 1,
        message: '单次推送目标列表不能超过1000个'
      }
    }
    if (!data.payload || !data.payload.hps || !data.payload.hps.msg || 
      !data.payload.hps.msg.type || !data.payload.hps.msg.body || 
      !data.payload.hps.msg.body.content || !data.payload.hps.msg.body.title) {
        rtn = {
          status: 1,
          message: '推送的投递消息必选字段缺失'
        }
      }
  } else {
    rtn = {
      status: 1,
      message: '推送消息不存在'
    }
  }
  return rtn;
}