/*
    JS 调用Android / IOS模块.
*/
'use strict';
define(function() {
    var HybridJS = {
        callbackId: Math.floor(Math.random() * 2000000000),
        callbacks: {},
        execAndroid: function(success, fail, service, action, args) {
            var argsJson;
            // argsJson = JSON(args)
            var callbackId = HybridJS.callbackId++;
            if (success || fail) {
                HybridJS.callbacks[callbackId] = {
                    success: success,
                    fail: fail
                };
            }
            WanwuJs.exec(callbackId, service, action, args);
        },
        callbackAndroid: function(callbackId, success, status, argString, keepCallback) {
            var args = new Array();
            args[0] = argString;
            var callback = HybridJS.callbacks[callbackId];
            if (callback) {
                if (success) {
                    callback.success && callback.success.apply(null, args);
                } else if (!success) {
                    callback.fail && callback.fail.apply(null, args);
                }
                // Clear callback if not expecting any more results
                if (!keepCallback) {
                    delete HybridJS.callbacks[callbackId];
                }
            }
        },
        init: function(domNode) {
            domNode.addEventListener('click', function(ev) {
                // $('#hidden_uploadImg_button').click();
                //更换为，调用 Android 拍照接口
                // var ar = new Array();
                HybridJS.execAndroid(function(imgUrl) {
                    //成功返回参数
                    //imgUrl 为android返回的图片地址
                    imgUrl = eval(imgUrl);
                    var imgUrl = "http://imgcdn.wanwu.com" + imgUrl[0];
                    $('._imged')[0].src = imgUrl;
                    $('#_shopLogo').val(imgUrl);
                }, function(e) {
                    //失败
                    alert('图片获取失败,失败原因为：' + e);
                }, "Wanwu", "openCamera", '{["name":"tom","sex":"男","age":"24"]}');
            }, false)
        }
    };
    return HybridJS;
});
