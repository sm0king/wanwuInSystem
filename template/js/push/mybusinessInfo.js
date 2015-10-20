$(function(){

    $('#myTabs a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    })

    function load() {
        service.singleEmployeeDtCount(function(flag,msg){
            if (flag) {
                var data = msg.countData;
                $.each(data,function(index, el) {
                    var dom = '<ul class="list-group">'+
                              '<li class="list-group-item">拜访量<span class="badge">'+el.recordNumber+'</span></li>'+
                              '<li class="list-group-item">新用户<span class="badge">'+el.newUser+'</span></li>'+
                              '<li class="list-group-item">下单新用户<span class="badge">'+el.newOrderedUser+'</span></li>'+
                              '<li class="list-group-item">新增订单数<span class="badge">'+el.newOrder+'</span></li>'+
                              '<li class="list-group-item">新增订单金额<span class="badge">￥'+el.newOrderAmount+'</span></li>'+
                              '<li class="list-group-item">取消订单数<span class="badge">'+el.canceledOrder+'</span></li>'+
                              '<li class="list-group-item">取消订单金额<span class="badge">￥'+el.canceledOrderAmount+'</span></li></ul>';
                    $("#"+index).html(dom);
                });
            }
        });
    }

    load();

})
