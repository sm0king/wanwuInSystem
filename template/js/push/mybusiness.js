$(function(){
    function load() {
        service.getAchievement("",function(flag,msg){
            console.log(flag);
            console.log(msg);
            if (msg.result) {
                var data = msg.result;
                $("#recommend_code").html(data.recommend_code);
                $("#recordNum").html(data.recordNum);
                $("#regNum").html(data.regNum);
                $("#orderNum").html(data.orderNum);
                $("#orderMoney").html(data.orderMoney);
            }
        });
    }

    load();
})
