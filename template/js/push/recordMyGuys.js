$(function(){
    function load(){
        service.getMyRecordList(function(flag,msg){

            if (flag) {
                $("#today").html("今日 " + msg.counts.todayCount);
                $("#total").html("总计 " +msg.counts.totalCount);

                var dpList = msg.result,dom = "";
                for (var i = 0; i < dpList.length; i++) {
                    dom += '<li class="list-group-item" data-id= "'+ dpList[i].dp_id +'">'+ dpList[i].dp_name +'</li>'
                }
                $("#departList").html(dom);
            }
        });
    }
    load();
})
