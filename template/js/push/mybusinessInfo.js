$(function(){

    $('#myTabs a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    })

    function load() {
        service.getAchievement("1",function(flag,msg){
            if (msg.result) {
                var data = msg.result;
                $.each(data,function(index, el) {
                    var dom = '<ul class="list-group">'+
                              '<li class="list-group-item">拜访量<span class="badge">'+el.recordNum+'</span></li>'+
                              '<li class="list-group-item">新用户<span class="badge">'+el.regNum+'</span></li>'+
                              '<li class="list-group-item">下单新用户<span class="badge">'+el.buyRegNum+'</span></li>'+
                              '<li class="list-group-item">订单数<span class="badge">'+el.orderNum+'</span></li>'+
                              '<li class="list-group-item">订单金额<span class="badge">'+el.orderMoney+'</span></li></ul>';
                    $("#"+index).html(dom);
                });
            }
        });
    }

    load();

})
