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

  $('#record-list').on('click','.record-item',function(){
      if ($(this).data('id')) {
          var url = './recordEdit.html?id='+$(this).data('id');
          back.go(url);
      }
  });

  function load(word){
      var key = word ? word : service.getSearch('key');
      $("#search").val(key);
      service.serviceMyRecord(key,1,10,function(flag,msg){
         if (flag) {
            var list = "";
            for (var i = 0; i < msg.result.length; i++) {
                img = msg.result[i].shop_url ? msg.result[i].shop_url : '/diguaApp/images/tuwen.png';
                list += '<li class="list-group-item record-item" data-id="'+ msg.result[i].id +'">'+
                        '<div class="media">'+
                        '<div class="media-left meida-middle">'+
                        '<img src="'+img+'" style="max-height:80px"></div>'+
                        '<div class="media-body">'+
                        '<div>'+msg.result[i].shop_name+'</div>'+
                        '<div>'+msg.result[i].phone+'</div>'+
                        '<div>'+msg.result[i].address+'</div>'+
                        '<div>'+msg.result[i].add_time+'</div></div></li>';
            }
            list = '<ul class="list-group">' + list + '</ul>';
            $("#record-list").html(list);
         }
      });
  }
  load();
});
