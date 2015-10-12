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
        }
    };
    return HybridJS;
});
