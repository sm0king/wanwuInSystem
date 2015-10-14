$(function(){

    $('#record-list').on('click','.record-item',function(){
        if ($(this).data('id')) {
            var url = './recordEdit.html?id='+$(this).data('id');
            back.go(url);
        }
    });

    // $(".point").on("click", function(){
    //     window.location.href = "./recordMap.html";
    // });
    $("#search").on('keyup',function(e){
        var k = e.keyCode || e.which;
        if(k == 13){
          var w = service.strCheck($(this).val());
          var url = "./recordSearch.html?key=" + w;
          back.go(url);
        }
    });

   function load(){
     service.serviceMyRecord("",1,10,function(flag,msg){
        if (flag) {
          var dom = madeDom(msg);
          $("#record-list").html(dom);
        }
     });
   }

   function madeDom(data){
      var list = "",
          top = "",
          dom = "",
          title,
          img,
          date,
          time;

      for (var i = 0; i < data.length; i++) {

        if (i === 0) {
            title = '今天';
        }else if (i == 1) {
            title = '以前';
        }
        top = '<div class="list-date bg-warning"><span>'+title+'('+ data[i].totalCount +')</span></div>';

        if (data[i].totalCount === 0) {
          list = '<li class="list-group-item">'+
                  '暂无数据</li>';
        }else {
          list = "";
          for (var j = 0; j < data[i].result.length; j++) {
              img = data[i].result[j].shop_url ? data[i].result[j].shop_url : '/diguaApp/images/tuwen.png';
              time = data[i].result[j].update_time ? data[i].result[j].update_time : data[i].result[j].add_time;
              list += '<li class="list-group-item record-item" data-id="'+ data[i].result[j].id +'">'+
                      '<div class="media">'+
                      '<div class="media-left meida-middle">'+
                      '<img src="'+img+'" alt=""></div>'+
                      '<div class="media-body">'+
                      '<div>'+data[i].result[j].shop_name+'</div>'+
                      '<div>'+data[i].result[j].phone+'</div>'+
                      '<div>'+data[i].result[j].address+'</div>'+
                      '<div>'+time+'</div></div></li>';
          }
          list = '<ul class="list-group">' + list + '</ul>';
        }
        dom += top + list ;
      }
      $('#record-list').html(dom);
   }

   load();
});
