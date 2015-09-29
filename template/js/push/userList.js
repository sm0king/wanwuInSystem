$(function(){
  function load(){
    service.serviceSaveMyCustomers("",1,10,function(flag,msg){
        console.log(flag);
        console.log(msg);
    });
  }
  load();
})
