$(function(){
    function load(argument) {
        var id = service.getSearch('id');
        service.getEmployeeDetail(id,function(flag,msg){
            console.log(flag);
            console.log(msg);
            if (flag) {
              var data = msg.result;
              $("#name").val(data.name);
              $("#phone").val(data.phone);
              $("#email").val(data.email || "无");
              $("#type").html(data.typeName).data('id',data.type);
              $("#depart").html(data.departName).data('id',data.dp_id);
              $("#superior").html(data.parentName).data('id',data.supervisor_id);
            }
        });
    }
    load();
});
