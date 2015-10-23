$(function(){

  $('#login-btn').on('click',function(){
      if (checkForm()) {
        var phoneNum = $('#inputTel').val(),
            password = $('#inputPassword').val();
        service.userLogin(phoneNum,0,password,"",function(re,reMsg){
            if (!re) {
              $('#msg').addClass('alert-danger').removeClass('alert-success').removeClass('hide').html(reMsg);
            }else {
              $('#msg').removeClass('alert-danger').addClass('alert-success').removeClass('hide').html("登录成功");
                getUserRight(function(dom){
                  if (dom) {
                    setTimeout(function(){
                      $('#main').removeClass('hide');
                      $('#login').remove();
                      $('.main').html(dom);
                    },1000);
                  };
                })
            }
            hideAlert();
        });
      }
      return false;
  });

  $('#main').on('click','.no-right',function(){
      alert('你没有相关权限');
  });

  function madeDom(data,isChild){
    var menu = "",list = "",myclass = "",url,status = "";
    for (var i = 0; i < data.length; i++) {
      url = service.getBusinessUrl(data[i].title,isChild);
      if (url != 'javascript:;') {
        list += '<a href="'+ url +'">'+
                '<li class="list-group-item info-item '+ myclass +'">'+ data[i].title;
        if (data[i].isNum) {
          list += '<span class="badge">'+data[i].isNum+'</span>';
        };
        list +='</li></a>';
      }
      // myclass = url == 'javascript:;' ? 'no-right' : "";
      // status = url == 'javascript:;' ? '<span class="text-right right-content txt-red">暂未开通</span>' : "";
      // list += '<a href="'+ url +'">'+
      //         '<li class="list-group-item info-item '+ myclass +'">'+ data[i].title +
      //         status + '</li></a>';
    }
    menu = '<ul class="list-group">'+list+'</ul>';
    return menu;
  }

  function hideAlert(){
      setTimeout(function(){
        $('#msg').addClass('hide');
      },2000);
  }

  function checkForm(){
    if($('#inputTel').val().length == 11  && !isNaN($('#inputTel').val())){
      var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[6|7|8]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if (reg.test($('#inputTel').val())) {
        if ($('#inputPassword').val() == 0) {
          alert('密码不能为空');
          $('#inputPassword').focus();
          return false;
        }else {
          return true;
        }
      }else {
        alert('手机号格式不正确');
        $('#inputTel').focus();
        return false;
      }
    }else if($('#inputTel').val() == 0){
      alert('手机号不能为空');
      $('#inputTel').focus();
      return false;
    }else{
      alert('手机号格式不正确');
      $('#inputTel').focus();
      return false;
    }
  }
  function getUserRight(callback){
    service.getMyMessage(function(isTrue,rightData,isChild){
      if (isTrue) {
        var dom = madeDom(rightData,isChild);
        callback(dom)
      }else{
        rightData && alert(rightData);
        callback(false);
      }
    })
  }
  function load() {
    if (window.location.hostname == 'www.wanwu.com') {
      $('#titleName').html('地瓜');
    };
    if (window.localStorage.getItem('userInfo')) {
        $('#login').remove();
        $('#main').removeClass('hide');
        var data = service.getUserInfo(),menu ="",list="",myclass="",url;
        /*
          //废弃，用户权限相关信息不再存储在本地存储，而是每次页面加载的时候进行请求。
          if (data.rights.length > 0) {
            var dom = madeDom(data.rights);
            $('.main').html(dom);
          }
        */
        getUserRight(function(dom){
          if (dom) {
            $('.main').html(dom)
          };
        })
    }else {
        $('#main').addClass('hide');
        $('#login').removeClass('hide');
    }
  }
  load();
});
