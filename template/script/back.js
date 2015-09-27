/*
后退模块，存储后退信息
*/
'use strict';
//加载配置模块。
requirejs.config({
    baseUrl: '/js',
    paths: {
        'config': 'config',
    }
});
require(['config'], function() {
    define(['jquery'], function() {
        //
        var back = {
            //
            /*
            跳转到上一页
            */
            to: function() {
                if (window.page && window.page.length < 1) {
                    window.location.href = '/';
                }else{
                    window.location.href = window.page.pop();
                }
            },
            /*
                跳转到指定url
            */
            go: function(url) {
                if (window.page && window.page.length < 1) {
                    window.page.push(location.pathname + location.search);
                }else{
                    window.page = [location.pathname + location.search];
                }
            }
        };
        return back;
    });
})