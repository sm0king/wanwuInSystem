$(function(){
    function saveDate(argument) {
      var str = service.strCheck;
      var data = {
        shopName : str($("#marketName").val()),
        consiness : str($("#linkman").val()),
        phone : str($("#phone").val()),
        pid : str($('#provinces').val()),
        cid : str($("#city").val()),
        did : str($("#district").val()),
        address : str($("#street").val()),
        scales : str($("#scales").val()),
        state : str($("#state").val()),
        remark : str($("#remark").val())
      };
      console.log(data);
      service.serviceSaveMyRecord(data,function(flag,msg){
          console.log(flag);
          console.log(msg);
      });
    }

    $("#save").on('click',function(){
        saveDate();
    });
});
