$(function(){

    function loadData(){
        var id = service.getSearch('id');
        console.log(id);
        service.serviceMyRecordDetail(id,function(flag,msg){
            console.log(flag);
            console.log(msg);
            if (flag) {
              var data = msg.result;
              $("#marketName").val(data.shop_name);
              $("#linkman").val(data.consignee);
              $("#phone").val(data.phone);
              $("#street").val(data.address);
              $("#remark").val(data.remark);
              service.serviceGetAddress(data.province_id,function(flag,msg){
                  console.log(flag);
                  console.log(msg);
              });
            }
        });
    }

    loadData();
});
