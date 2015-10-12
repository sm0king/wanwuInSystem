$(function(){
    $("#search").on('keyup',function(e){
        var k = e.keyCode || e.which;
        if(k == 13){
          window.location.href = "./departmentSearch.html";
        }
    });
    $('.depart-inline').on('click',function(){
        window.location.href = "./departmentInfo.html";
    });

    function load(argument) {
      // body...
      service.departmentList("","","",function(flag,msg){
          if (flag) {
            console.log(msg);
            $("#departList").html("<p class='text-center'>正在加载中......</p>");
          }else {
            // alert(msg);
            $("#departList").html("<p class='alert alert-danger text-center'>"+msg+"</p>")
          }
      })
    }

    load();

});
