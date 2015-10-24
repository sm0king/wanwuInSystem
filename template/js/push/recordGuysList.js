$(function(){


    function madeDom(data){
         var list = "",
             top = "",
             dom = "",
             title,
             img,
             date,
             time;
             console.log(data.totalCount);
         if (!data.totalCount) {
             list = '<li class="list-group-item">暂无数据</li>';
         }else {
             if (data.PageNumber == 1) {
                 top = '<div class="list-date bg-warning"><span>拜访列表('+ data.totalCount +')</span><i class="glyphicon glyphicon-map-marker point text-right"></i></div>';
             }else {
                 top = "";
             }
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
         }
         dom = top + '<ul class="list-group">' + list + '</ul>';
        //  console.log(dom);
         return dom;
    }

    function load(page,pageSize) {
        var id = service.getSearch('id');

        var data = {
            taskId: id,
            PageNumber: page || 1,
            PageSize: pageSize || 10,
        }

        service.serviceMyRecord(data,function(flag,msg){
           if (flag) {
               console.log(msg);
             $("#load").remove();
             var dom = madeDom(msg);
             console.log(dom);
             var totalPage = Math.ceil(parseInt(msg.totalCount)/parseInt(msg.PageSize));
             console.log(parseInt(msg.totalCount));
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
})
