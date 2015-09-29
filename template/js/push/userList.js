$(function(){

  $("#search").on('keyup',function(e){
      var k = e.keyCode || e.which;
      if(k == 13){
        var w = service.strCheck($(this).val());
        var url = "./myUserSearch.html?key=" + w;
        back.go(url);
      }
  });

  function madeDom(result){
    var list="",dom="",img,phone;
    for (var i = 0; i < result.length; i++) {
      // result[i];
      img = result[i].shop_url ? result[i].shop_url : '/diguaApp/images/tuwen.png';
      phone = result[i].phone || result[i].mobile;
      list += '<li class="list-group-item" data-id="">'+
              '<div class="media">'+
              '<div class="media-left meida-middle">'+
              '<img src="'+ img +'" alt=""></div>'+
              '<div class="media-body">'+
              '<div>'+ result[i].shop_name +'</div>'+
              '<div>'+ phone +'</div>'+
              '<div>'+ result[i].address +'</div>'+
              '<div>'+ result[i].add_time +'</div>';
    }
    dom = '<ul class="list-group">'+list+'</ul>';
    $("#userList").html(dom);
  }

  function load(){
    service.serviceSaveMyCustomers("",1,10,function(flag,msg){
        // console.log(flag);
        // console.log(msg);
        if (flag) {
          madeDom(msg.result);
        }

    });
  }
  load();
});
