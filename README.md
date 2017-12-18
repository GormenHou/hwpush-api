# hwpush-api
根据截止到2017-12-13 华为官方文档 实现的华为推送服务，node端使用的包。请求的是华为官方提供的标准的Restful接口，请求是URL-Encoding格式，应答为JSON格式。

提供了一个调用华为推送的方法。

# Installation
using npm:

``` bash
npm install -save hwpush-api
```

In Node.js


``` bash
var API = require('hwpush-api');
var token;

var api = new API('your appid', 'your appsecret', function(callback) {
  if(this.token) {
    callback(null, this.token);
  }
}, function(token, callback) {
  this.token = token;
  callback(null, this.token);
});

api.getAccessToken(function(err, token) {
  this.token = token;
  if(err) {
    console.log(err);
  }
  if(token) {
    console.log('get token -> %j', token);
  }
});

//给单个用户发送通知
var data_device = {
    deviceToken:'12345678901234561234567890123456',
    payload: {
        hps: {
            msg: {
                type: 3,
                body:  {
                    content: 'hello world content',
                    title: 'hello world title' 
                },
                action: {
                    "type": 3,
                    "param": {
                        "appPkgName": "com.your.appname"
                    }
                }
            }
        }
    }
}
api.pushNcMsg(data_device ,function(err, result) {
    console.log('api_ncmsg_single_user result -> %j ', result);
});

//给多个用户发送通知，最多一千个
var data_device_list = {
    device_token_list:['12345678901234561234567890123456', '12345678901234561234567890123467'],
    payload: {
        hps: {
            msg: {
                type: 3,
                body:  {
                    content: 'hello world content',
                    title: 'hello world title' 
                },
                action: {
                    "type": 3,
                    "param": {
                        "appPkgName": "com.your.appname"
                    }
                }
            }
        }
    }
}
api.pushNcMsg(data_device_list ,function(err, result) {
    console.log('api_ncmsg_multi_user result -> %j ', result);
});

```

