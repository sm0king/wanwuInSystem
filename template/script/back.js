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
            /*
            跳转到上一页
            */
            to: function() {
                var page = getPage();
                if (page.length < 1) {
                    window.location.href = '/';
                } else {
                    window.location.href = page.pop();
                }
                //更新存储信息。
                this.setPage(page);
            },
            /*
                跳转到指定url
            */
            go: function(url, add) {
                if (add) {
                    //新版，将url存储起来，该url可以被用来后退。
                    var page = getPage();
                    if (page.length > 1) {
                        page.push(url);
                    } else {
                        page = [url];
                    }
                    this.setPage(page);
                }
                window.location.href = url;
            },
            getPage: function() {
                //获取当前存储的内容
                var page = window.localStorage.getItem('page');
                return page ? page.split(',') : [];
            },
            setPage: function(urlArr) {
                //存储url
                window.localStorage.setItem('page', urlArr);
            }
        };
        return back;
    });
})
