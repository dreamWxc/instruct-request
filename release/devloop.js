"use strict";
exports.__esModule = true;
var index_1 = require("./index");
// 创建请求对象
var request = index_1["default"].create({
    method: 'POST',
    baseURL: 'http://192.168.2.67:8086/',
    responseCode: [200],
    codeKey: 'code',
    message: {}
});
index_1.TipPlugin.register(request);
// 注册插件
index_1.CachePlugin.register(request, {
    storage: 'local'
});
var verification = index_1.VerificationPlugin.register(request, {
    rules: {
        isMan: function () {
            return true;
        }
    },
    formats: {
        name: function (value, option) {
            console.log(option);
            return '123123-' + value;
        }
    },
    tip: 'info'
});
function toRequest() {
    request.$request({
        url: 'jhTrade/jhTradeList?current=1&size=200',
        tip: true,
        data: {
            status: "WAIT_SELLER_SEND_GOODS",
            checkStatus: 13
        },
        headers: {
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzYwNTM3NjksInVzZXJuYW1lIjoiYWRtaW4ifQ.AuTNg5RyiWOUS7J_k_iA1D83jVZQucEPK-dSFiiUv6w'
        }
    }).then(function (data) {
        data.msg = '我是呗更新的缓存';
        // data.cache()
    });
}
setTimeout(function () {
    toRequest();
}, 5000);
// request.extend('cache')().id('12').data(1).update();
/*

*/
