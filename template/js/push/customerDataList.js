$(function(){

    $("#depart").on('change',function(){
        var dpId = $(this).val();
        var data = {};
        data.dpId = dpId;
        service.getSubDepartmentList(data,function(flag,msg){
            if (flag) {
                var re = msg.result[0],
                    emList = re.result;
                var employ ='<option value="0">所有人</option>';
                for (var i = 0; i < emList.length; i++) {
                    employ += '<option value="'+ emList[i].id +'">'+ emList[i].name +'</option>'
                }
                $('#employ').html(employ);
            }
        });
    });

    $(".sort-item a").on('click',function(){
        var dpId = $("#depart").val(),
            taskId = $("#employ").val(),
            sort = $(this).data('sort'),
            field = $(this).data('field');
        location.href = '/newosadmin/customer/getCustomerData?dpId='+ dpId +'&taskId='+ taskId +'&sort='+ sort +'&field='+field;
    });

    $("#searchSome").on('click',function(){
        var dpId= $("#depart").val() || "",
            taskId = $('#employ').val() || "";
            location.href = '/newosadmin/customer/getCustomerData?dpId='+ dpId +'&taskId=' + taskId;
    });

    $("#search").on('keyup',function(e){
        var k = e.keyCode || e.which;
        if(k == 13){
          var w = service.strCheck($(this).val());
          var url = "/newosadmin/customer/getCustomerData?keyword=" + w;
          back.go(url);
        }
    });

    function load(){
        service.getSubDepartmentList({},function(flag,msg){
            if (flag) {
                if (msg.result.length) {
                    var depart = '<option value="0">所有部门</option>',employ='<option value="0">所有人</option>';
                    for (var i = 0; i < msg.result.length; i++) {
                        depart += '<option value="'+ msg.result[i].dp_id +'">'+ msg.result[i].dp_name +'</option>'
                    }
                    $("#depart").html(depart);
                }else {
                    $("#screenBox").remove();
                }
            }
        });
    }
    load();
})
