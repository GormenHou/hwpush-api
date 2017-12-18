var util = require('util'),
    https = require('https'),
    url = require('url'),
    querystring = require('querystring'),
    MessageFormat = require('messageformat');

module.exports = function(pushAPI, data, callback) {
    var mfunc = new MessageFormat('en').
        compile('access_token={0}&nsp_svc={1}&nsp_ts={2}&device_token_list={3}&payload={4}');
    var postData = mfunc({
        0: encodeURIComponent(data.data.access_token),
        1: encodeURIComponent(data.data.nsp_svc),
        2: encodeURIComponent(data.data.nsp_ts),
        3: encodeURIComponent(JSON.stringify(data.data.device_token_list)),
        4: encodeURIComponent(JSON.stringify(data.data.payload))
    });
    var post_option = url.parse(pushAPI);
    post_option.method = 'POST';
    post_option.port = 443;
    post_option.headers = {
     'Content-Type' : 'application/x-www-form-urlencoded',
     'Content-Length' : postData.length
    };
    var post_req = https.request(post_option, function(res){
    
        res.on('data', function(buffer){
            callback(null, buffer.toString(), res);
        });
    });
    post_req.on('error', (e) => {
        callback(e, null, null);
    });
    post_req.write(postData);
    post_req.end();
}