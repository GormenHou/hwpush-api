var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;
var make = util.make;
var extend = require('util')._extend;
var httpsPost = require('./https_post');

/**
 * 推送通知栏消息
 * 详情请见：<http://developer.huawei.com/consumer/cn/service/hms/catalog/huaweipush.html?page=hmssdk_huaweipush_api_reference_s2>
 * Examples:
 * ```
 * data是一个json对象
 * {
 *  device_token_list:[],//必选，不能为空 JSON数值字符串，单次最多只是1000个。例如(未编码前)：["12345xxxxxxxxxxxxx23456","2234567xxxxxxxxxx123456","086200503xxxxxxxxxxxxxxx300CN01"]
 *  payload: {  // 必选，描述投递消息的JSON结构体，描述PUSH消息的：类型、内容、显示、点击动作、报表统计和扩展信息具体参考下面的详细说明。
 *   hps: { //必选，华为Push消息总结构体
 *     msg: { //必选
 *       type: 3, //取值含义和说明: 1 透传异步消息, 3 系统通知栏异步消息; 此处必须是3，应用层如果传别的值，也会被强制覆盖；
 *       body:  { //消息内容。注意：对于透传类的消息可以是字符串，不必是JSON Object。
 *         content: '', //必选， 消息内容体
 *         title: '', //必选，消息标题
 *       },
 *       action: { //消息点击动作
 *         type: 3, //1 自定义行为;2 打开URL;3 打开APP。注意：富媒体消息开放API不支持。 
 *         param: { //关于消息点击动作的参数
 *           intent: '', //Action的type为1的时候表示自定义行为
 *           url: ''  //Action的type为2的时候表示打开URL地址
 *         }
 *       }
 *     }, 
 *     ext: { //扩展信息，含BI消息统计，特定展示风格，消息折叠。
 *       biTag: '',  //设置消息标签，如果带了这个标签，会在回执中推送给CP用于检测某种类型消息的到达率和状态。注意：BigTag不能携带下面几个保留字符：逗号‘，’，竖线‘|’。
 *       icon: '',  //一个公网可以访问的URL地址,用来自定义推送消息在通知栏的图标。
 *       customize: []  //扩展样例：[{"season":"Spring"},{"weather":"raining"}] 说明：这个字段类型必须是JSON Array，里面是key-value的一组扩展信息。
 *     }
 *   }
 *  },
 *  expire_time: ''  //可选
 * }
 * api.pushNCMsg(data, callback);
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {"errcode": 0, "errmsg": "ok"}
 * ```
 * @param {Number} groupId 分组ID
 * @param {Function} callback 回调函数
 */
make(exports, 'pushNcMsg', function (data, callback) {
    var checkRtn = util.checkNCData(data);
    if (!checkRtn) {
        callback( { status: 1, message: '推送数据校验异常   ' } );
    } else if (checkRtn.status === 1) {
        callback(null, checkRtn );
    } else {
        var options = {
            access_token: this.token.accessToken,
            nsp_ts: new Date().getTime(),
            nsp_svc: 'openpush.message.api.send'
        };
        extend(options, data);
        options.payload.hps.msg.type = 3;
        
        var url = this.pushAPI;
        httpsPost(url, util.postJSON(options), wrapper(callback));
    }
  });