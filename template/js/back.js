(function(win, $) {
    win.back = {
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
        getPage:function(){
            //获取当前存储的内容
            var page = window.localStorage.getItem('page');
            return page ? page.split(','):[];
        },
        setPage:function(urlArr){
            //存储url
            window.localStorage.setItem('page',urlArr);
        }
    };

    $('.navbar-back').on('click touched', function() {
        if ($(this).data('control')) {
            if ($(this).data('control') == 1) { 
                back.to();
            }
        } else {
            history.go(-1);
        }
    });

    // if (!window.localStorage.getItem('userInfo')) {
    //     window.location.href = "/diguaApp/index.html";
    // }
})(window, jQuery);
