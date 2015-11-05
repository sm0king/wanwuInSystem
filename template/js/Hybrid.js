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
            win.domNode = domNode;
            domNode.addEventListener('click', function(ev) {
                //判断是iOS 还是Android
                //如果是Android，调用 Android 拍照接口
                if (HybridJS.browser().android) {
                    AndroidJs.execAndroid(win.showPic, function(e) {
                        //失败
                        alert('图片获取失败,失败原因为：' + e);
                    }, "Wanwu", "openCamera", '{["name":"tom","sex":"男","age":"24"]}');
                } else {
                    //如果是iOS，调用iOS拍照接口
                    window.choosePic();
                }
            }, false)
        },
        browser: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return { //移动终端浏览器版本信息
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1 //是否iPad
            };
        },
        getPosition: function(positionDOM) {
            win.positionDOM = positionDOM;
            if (HybridJS.browser().android) {
                AndroidJs.execAndroid(win.showPic, function(e) {
                    //失败
                    alert('获取地理位置错误,失败原因为：' + e);
                }, "Wanwu", "getPositionAndroid", '{["name":"tom","sex":"男","age":"24"]}');
            } else {
                //如果是iOS，调用
                window.getPositionIos();
            }
        }
    };
    win.showPic = function(imgUrl) {
        //成功返回参数
        //imgUrl 为android返回的图片地址
        if (typeof(imgUrl) == "object") {
            imgUrl = imgUrl[0];
        }
        imgUrl = "http://imgcdn.wanwu.com" + imgUrl;
        win.domNode.style.backgroundImage = "url(" + imgUrl + ")";
        win.domNode.dataset.imgUrl = imgUrl;
    }
    win.showPosition = function(position){
        //成功返回地址信息，iOS返回的数据格式为： 123.00,12.00 中间有分号 字符串
        
        if (typeof(position) && position.indexOf(',') != -1) {
            position =  position.split(',');
            var positionData = '{"latitude":"'+position[0]+'","longitude":"'+position[1]+'"}';
        };
        win.positionDOM.dataset.position = positionData || '';
    }
    win.HybridJS = win.AndroidJs
})(window, jQuery);
