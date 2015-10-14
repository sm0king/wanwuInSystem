$(function(){
  function load(){
    var info = service.getUserInfo();
    $("#addImage").html('<img src="'+ info.img +'" style="width:34px;height:34px"> >');
    $("#phone").html(info.phone);
    $("#leader").html(info.supervisor_id);
    $("#depart").html(info.dp_id);
  }
  load();
})
