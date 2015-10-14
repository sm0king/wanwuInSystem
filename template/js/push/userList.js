$(function(){

  $("#search").on('keyup',function(e){
      var k = e.keyCode || e.which;
      if(k == 13){
        var w = service.strCheck($(this).val());
        var url = "./myUserSearch.html?key=" + w;
        back.go(url);
      }
  });

  $('#userList').on('click','.user-item',function(){
      if ($(this).data('id')) {
          var url = './myUserInfo.html?id='+$(this).data('id');
          back.go(url);
      }
  });

  function madeDom(result){
    var list="",dom="",img,phone;
    for (var i = 0; i < result.length; i++) {
      img = result[i].shop_url ? result[i].shop_url : '/diguaApp/images/tuwen.png';
      phone = result[i].phone || result[i].mobile;
      list += '<li class="list-group-item user-item" data-id="'+ result[i].user_id +'">'+
              '<div class="media">'+
              '<div class="media-left meida-middle">'+
              '<img src="'+ img +'" alt=""></div>'+
              '<div class="media-body">'+
              '<div>'+ (result[i].shop_name || "") +'</div>'+
              '<div>'+ phone +'</div>'+
              '<div>'+ (result[i].address || "") +'</div>'+
              '<div>'+ result[i].add_time +'</div>';
    }
    dom = '<ul class="list-group">'+list+'</ul>';
    $("#userList").html(dom);
  }

  function load(){
    service.serviceGetMyCustomers("",1,10,function(flag,msg){
        if (flag) {
          madeDom(msg.result);
        }
    });
  }
  load();
});
