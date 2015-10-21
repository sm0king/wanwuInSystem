$(function(){

  $('.cancel').on('click',function(){
      history.back(-1);
  });

  $("#search").on('keyup',function(e){
      var k = e.keyCode || e.which;
      if(k == 13){
        var w = service.strCheck($(this).val());
        load(w);
      }
  });

  $('#searchList').on('click','.user-item',function(){
      if ($(this).data('id')) {
          var url = './myUserInfo.html?id='+$(this).data('id');
          back.go(url);
      }
  });

  $(window).scroll(function(){
      loadOther();
  });

  function loadOther(){
      var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
      if ($(document).height() <= totalheight) {
        //   if ($("#load").data('status') == 1 && $("#userList").data('page') != 0) {
        //       var page  =  parseInt($("#userList").data('page')) + 1;
        //       $("#load").data('status','0');
        //       load("",page);
        //   }else {
        //       $("#load").removeClass('show');
        //   }
          if ($("#load") && $("#load").data('status') == '0') {
              var page  =  parseInt($("#searchList").data('page')) + 1;
                  $("#load").data('status','1');
                  load("",page);
          }
      }
  }


  function madeDom(result){
    var list="",dom="",img,phone;
    for (var i = 0; i < result.length; i++) {
      img = result[i].shop_url ? result[i].shop_url : '/diguaApp/images/tuwen.png';
      phone = result[i].phone || result[i].mobile;
      list += '<li class="list-group-item user-item" data-id="'+ result[i].user_id +'">'+
              '<div class="media">'+
              '<div class="media-left meida-middle">'+
              '<img src="'+ img +'" style="max-height:80px;"></div>'+
              '<div class="media-body">'+
              '<div>'+ (result[i].shop_name || "") +'</div>'+
              '<div>'+ phone +'</div>'+
              '<div>'+ (result[i].address || "") +'</div>'+
              '<div>'+ result[i].add_time +'</div>';
    }
    dom = '<ul class="list-group">'+list+'</ul>';
    return dom;
  }

  function load(word,page,pageSize) {
        var data = {
            PageNumber: page || 1,
            PageSize: pageSize || 5,
        }
        data.keywords = word ? word : service.getSearch('key');
        $("#search").val(data.keywords);
        service.serviceGetMyCustomers(data,function(flag,msg){
            if (flag) {
              $("#load").remove();
              var dom = madeDom(msg.result);
              var totalPage = Math.ceil(parseInt(msg.totalCount)/parseInt(msg.PageSize));
                if(msg.PageNumber < totalPage){
                    dom  = dom + '<li id="load" class="loading list-group-item text-center show">加载更多...</li>';
                    $("#searchList").append(dom).data('page',data.PageNumber);
                    $("#load").data('status','0');
                }else if(msg.PageNumber == totalPage){
                    $("#searchList").append(dom);
                }
            }
        });
  }

  load();
});
