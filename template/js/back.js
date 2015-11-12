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
(function(window,$){

    /*显示主的DIV*/
    function _showMainDiv() {
        if ($("#load_mask_div").length == 0) {
            $('body').append(getMaskDiv(), getMessageMainDiv());
        } else {
            $('#Message_Text,#load_mask_div').show();
        }
    }

    /*关闭所有的*/
    function _closeWinDiv() {
        $('#Message_Text,#load_mask_div').each(function (index, item) {
            $(item).remove();
        });
    }

    /*内容展示层*/
    function getMessage_TextDiv(_str) {
        var Text = $('<div id="Text">' + _str + '</div>');
        var cssStr = { 'font-size': '14px', 'padding': '15px 10px' , 'font-weight':'500'};
        return Text.css(cssStr);
    }

    /*关闭Alert窗口事件*/
    function BindCloseMessageEven() {
        $("#close").click(function () {
            _closeWinDiv();
        });
    }

    /*关闭确认提示框事件【存在callback】*/
    function BindCloseConfirmEven(leftCallback, rightCallback) {
        $("#Confirm_leftButton").click(function () {
            _closeWinDiv();
            (leftCallback && typeof(leftCallback) === "function") && leftCallback();
        });
        $("#Confirm_rightButton").click(function () {
            _closeWinDiv();
            (rightCallback && typeof(rightCallback) === "function") && rightCallback();
        });
    }

    /*关闭按钮*/
    function getMessage_closeButton() {
        var closeButton = $('<a id="close"></a>');
        var cssStr = {
            'font-size': '13px'
        };
        var pDom = $('<p>').css({
            'border-top': '1px solid #CCCCCC',
            'line-height': '40px',
            'color': '#337Ab7'
        }).text("关闭");
        return closeButton.css(cssStr).append(pDom);
    }

    /*确认框左边按钮*/
    function getConfirm_leftButton(_str) {
        var Confirm_leftButton = $('<a id="Confirm_leftButton">' + '</a>');
        var cssStr = {
            'font-size': '13px',
            'float': 'right',
            'border-left': '1px solid #CCCCCC',
            'width': '49%',
			'border-top': '1px solid #CCCCCC',
            'line-height': '40px',
            'color': '#337Ab7'
        };
        var pDom = $('<p>').css({
            'line-height': '40px'
        }).text(_str);
        return Confirm_leftButton.css(cssStr).append(pDom);
    }

    /*确认框右边的*/
    function getConfirm_rightButton(_str) {
        var Confirm_rightButton = $('<a id="Confirm_rightButton">' + '</a>');
        var cssStr = {
            'font-size': '13px',
            'float': 'right',
            'width': '49%',
			'border-top': '1px solid #CCCCCC',
            'line-height': '40px',
            'color': '#337Ab7'
        };
        var pDom = $('<p>').css({
            'line-height': '40px'
        }).text(_str);
        return Confirm_rightButton.css(cssStr).append(pDom);
    }

    /*body第一层的DIV*/
    function getMessageMainDiv() {
        var Message_Text = $('<div id="Message_Text"></div>');
        var cssStr = {
            'background': '#FFFFFF',
            'border-radius': '8px',
            'left': '50%',
            'position': 'fixed',
            'top': '40%',
            'width': '70%',
            'margin-left': '-35%',
            'text-align': 'center',
            "box-sizing": "content-box",
            'z-index': '999999999'
        };
        return Message_Text.css(cssStr);
    }

    /*遮罩层*/
    function getMaskDiv() {
        var _maskDiv = $('<div id="load_mask_div"></div>');
        return _maskDiv.css({
            'display': 'block',
            'position': 'fixed',
            'width': '100%',
            'height': '100%',
            'background-color': '#000000',
            'top': '0',
            'left': '0',
            'opacity': '.6',
            'z-index': '999999998'
        }).click(function () {
            _closeWinDiv();
        });
    }

    var control = {
        /**
         * 弹出窗
         */
        alert : function(text){
            _showMainDiv();
            $('#Message_Text').append(getMessage_TextDiv(text), getMessage_closeButton());
            BindCloseMessageEven();
        },

        /**
         * 自动消失信息提示
         * @param  {[type]} text      [提示文案]
         * @param  {[type]} closeTime [消失时间]
         */
        tip : function (text, closeTime) {
            _showMainDiv();
            $('#Message_Text').empty().append(getMessage_TextDiv(text, closeTime));
            var hrefThis = this;
            setTimeout(function () {
                _closeWinDiv();
            }, closeTime);
        },

        /**
         * 确认提示框
         * @param  {[type]} text          [提示文案]
         * @param  {[type]} leftButton    [左边按钮文案]
         * @param  {[type]} rightButton   [右边按钮文案]
         * @param  {[type]} leftCallback  [左边按钮点击事件回调]
         * @param  {[type]} rightCallback [右边按钮点击事件回调]
         */
        confirm : function (text, leftButton, rightButton, leftCallback, rightCallback) {
            _showMainDiv();
            $('#Message_Text').empty().append(getMessage_TextDiv(text), getConfirm_leftButton(leftButton), getConfirm_rightButton(rightButton));
            BindCloseConfirmEven(leftCallback, rightCallback);
        }
    };

	window.Msg = control;
})(window,jQuery);
