$(function(){
  function load(){
      service.manageGetEmployeeList("",function(flag,msg){
          console.log(flag,msg);
      })
  }
  load();
})
