(function(win, $) {
    /*
        JS 调用Android / IOS模块.
    */
    win.AndroidJs = {
        callbackId: Math.floor(Math.random() * 2000000000),
        callbacks: {},
        execAndroid: function(success, fail, service, action, args) {
            var argsJson;
            // argsJson = JSON(args)
            var callbackId = AndroidJs.callbackId++;
            if (success || fail) {
                AndroidJs.callbacks[callbackId] = {
                    success: success,
                    fail: fail
                };
            }
            WanwuJs.exec(callbackId, service, action, args);
        },
        callbackAndroid: function(callbackId, success, status, argString, keepCallback) {
            var args = new Array();
            args[0] = argString;
            var callback = AndroidJs.callbacks[callbackId];
            if (callback) {
                if (success) {
                    callback.success && callback.success.apply(null, args);
                } else if (!success) {
                    callback.fail && callback.fail.apply(null, args);
                }
                // Clear callback if not expecting any more results
                if (!keepCallback) {
                    delete AndroidJs.callbacks[callbackId];
                }
            }
        },
        init: function(domNode) {
            domNode.addEventListener('click', function(ev) {
                // $('#hidden_uploadImg_button').click();
                //更换为，调用 Android 拍照接口
                // var ar = new Array();
                AndroidJs.execAndroid(function(imgUrl) {
                    //成功返回参数
                    //imgUrl 为android返回的图片地址
                    imgUrl = eval(imgUrl);
                    var imgUrl = "http://imgcdn.wanwu.com" + imgUrl[0];
                    domNode.style.backgroundImage = 'url('+imgUrl+')';
                    domNode.dataset.imgUrl = imgUrl;
                }, function(e) {
                    //失败
                    alert('图片获取失败,失败原因为：' + e);
                }, "Wanwu", "openCamera", '{["name":"tom","sex":"男","age":"24"]}');

            }, false)
        }
    };
    win.HybridJS = win.AndroidJs
})(window, jQuery);
