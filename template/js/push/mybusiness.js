$(function(){
    function load() {
        service.singleEmployeeDtCount(function(flag,msg){
            if (flag) {
                var data = msg.countData.oneDay;
                $("#recommend_code").html(msg.recommendCode);
                $("#recordNum").html(data.recordNumber);
                $("#regNum").html(data.newUser);
                $("#orderNum").html(data.newOrder);
                $("#orderMoney").html(data.newOrderAmount);
            }
        });
    }
    load();
})
