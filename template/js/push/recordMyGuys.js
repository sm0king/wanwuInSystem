$(function(){
    var dpList;

    $("#departList").on('click','.list-group-item',function(){
        var id = $(this).data('id'),emp = "";
        for (var i = 0; i < dpList.length; i++) {
            if (dpList[i].dp_id == id) {
                for (var j = 0; j < dpList[i].result.length; j++) {
                    emp += '<li class="list-group-item" data-id="'+ dpList[i].result[j].id +'">'+ dpList[i].result[j].name +'<span class="mrl10">今日 '+ dpList[i].result[j].count +'</span></li>';
                }
            }
        }
        var h = $(window).height() - 130 ;
        $("#empList").css('height',h).html(emp).show();
    });

    $("#myRecord").on('click',function(){
        back.go('./recordList.html');
    });

    $("#empList").on('click','.list-group-item',function(){
        var id = $(this).data('id');
        var url = './recordGuysList.html?id='+id;
        back.go(url);
    });

    function load(){
        service.getMyRecordList(function(flag,msg){
            if (flag) {
                $("#today").html("今日 " + msg.counts.todayCount);
                $("#total").html("总计 " +msg.counts.totalCount);
                dpList = msg.result,dom = "";
                for (var i = 0; i < dpList.length; i++) {
                    dom += '<li class="list-group-item" data-id= "'+ dpList[i].dp_id +'">'+ dpList[i].dp_name +'</li>'
                }
                $("#departList").html(dom);
            }
        });
    }
    load();
})
