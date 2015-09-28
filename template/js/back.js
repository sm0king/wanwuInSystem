(function(win,$){
    win.back = {
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
            if (window.page && window.page.length > 1) {
                window.page.push(location.pathname + location.search);
            }else{
                window.page = [location.pathname + location.search];
            }
            window.location.href = url;
        }
    };
})(window,jQuery);
