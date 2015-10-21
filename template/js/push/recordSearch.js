$(function(){

  $('.cancel').on('click',function(){
      history.back(-1);
  });

  $("#search").on('keyup',function(e){
      var k = e.keyCode || e.which;
      if(k == 13){
        var w = service.strCheck($(this).val());
        $("#record-list").html("");
        load(w);
      }
  });

  $('#record-list').on('click','.record-item',function(){
      if ($(this).data('id')) {
          var url = './recordEdit.html?id='+$(this).data('id');
          back.go(url);
      }
  });

  $(window).scroll(function(){
      loadOther();
  });

  function loadOther(){
      var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
      if ($(document).height() <= totalheight) {
          if ($("#load") && $("#load").data('status') == '0') {
              var page  =  parseInt($("#record-list").data('page')) + 1;
                  $("#load").data('status','1');
                  load("",page);
          }
      }
  }

  $("#record-list").on('click','#load',function(){
      loadOther();
  })

  function madeDom(data){
       var list = "",
           top = "",
           dom = "",
           title,
           img,
           date,
           time;
       if (data.totalCount === 0) {
           list = '<li class="list-group-item">暂无数据</li>';
       }else {
           for (var i = 0; i < data.result.length; i++) {
               img = data.result[i].shop_url ? data.result[i].shop_url : '/diguaApp/images/tuwen.png';
               time = data.result[i].update_time ? data.result[i].update_time : data.result[i].add_time;
               list += '<li class="list-group-item record-item" data-id="'+ data.result[i].id +'">'+
                       '<div class="media">'+
                       '<div class="media-left meida-middle">'+
                       '<img src="'+img+'" style="max-height:80px"></div>'+
                       '<div class="media-body">'+
                       '<div>'+data.result[i].shop_name+'</div>'+
                       '<div>'+data.result[i].phone+'</div>'+
                       '<div>'+data.result[i].address+'</div>'+
                       '<div>'+time+'</div></div></li>';
           }
           dom = '<ul class="list-group">' + list + '</ul>';
           return dom;
       }
  }

  function load(word,page,pageSize){
      var data = {
        PageNumber: page || 1,
        PageSize: pageSize || 10,
      }
      data.keywords = word ? word : service.getSearch('key');
      $("#search").val(data.keywords);
      service.serviceMyRecord(data,function(flag,msg){
         if (flag) {
             $("#load").remove();
             var dom = madeDom(msg);
             var totalPage = Math.ceil(parseInt(msg.totalCount)/parseInt(msg.PageSize));
             if(msg.PageNumber < totalPage){
                 dom  = dom + '<li id="load" class="loading list-group-item text-center show">加载更多...</li>';
                 $("#record-list").append(dom).data('page',data.PageNumber);
                 $("#load").data('status','0');
             }else if(msg.PageNumber == totalPage){
                 $("#record-list").append(dom);
             }
         }
      });
  }
  load();
});
