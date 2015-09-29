$(function(){
   function load(){
     service.serviceMyRecord("",1,10,function(flag,msg){
        console.log(flag);
        console.log(msg);
        if (flag) {
          var dom = madeDom(msg);
          $("#record-list").html(dom);
        }
     })
   }

   function madeDom(data){
      var list = "",
          top = "",
          dom = "",
          title,
          img,
          date;

      for (var i = 0; i < data.length; i++) {

        if (i == 0) {
            title = '今天';
        }else if (i == 1) {
            title = '以前';
        }
        top = '<div class="list-date bg-warning"><span>'+title+'('+ data[i].totalCount +')</span></div>';

        if (data[i].totalCount == 0) {
          list = '<ul class="list-group">'+
                  '<li class="list-group-item">'+
                  '暂无数据</li></ul>';
        }else {
          list = "";
          for (var j = 0; j < data[i].result.length; j++) {
              img = data[i].result[j].shop_url ? data[i].result[j].shop_url : '/diguaApp/images/tuwen.png';
              // date = new Date(data[i].result[j].add_time);
              list += '<li class="list-group-item">'+
                      '<div class="media">'+
                      '<div class="media-left meida-middle">'+
                      '<img src="'+img+'" alt=""></div>'+
                      '<div class="media-body">'+
                      '<div>'+data[i].result[j].shop_name+'</div>'+
                      '<div>'+data[i].result[j].phone+'</div>'+
                      '<div>'+data[i].result[j].address+'</div>'+
                      '<div>'+data[i].result[j].add_time+'</div></div></li>';
          }
          list = '<ul class="list-group">' + list + '</ul>';
        }
        dom += top + list ;
      }
      console.log(dom);
      $('#record-list').html(dom);

   }

   load();
})
