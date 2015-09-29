$(function(){

  $('.cancel').on('click',function(){
      history.back(-1);
  });

  $("#search").on('keyup',function(e){
      var k = e.keyCode || e.which;
      if(k == 13){
        var w = service.strCheck($(this).val());
        load(w);
      }
  });

  function load(word){
      var key = word ? word : service.getSearch('key');
      console.log(key);
      $("#search").val(key);
      service.serviceMyRecord(key,1,10,function(flag,msg){
          console.log(flag);
          console.log(msg);
         if (flag) {
          //  var dom = madeDom(msg);
          //  $("#record-list").html(dom);
         }
      });
  }
  load();
});
