$(function(){
    $("#search").on('keyup',function(e){
        var k = e.keyCode || e.which;
        if(k == 13){
          var w = service.strCheck($(this).val());
          var url = location.pathname +"?keyword=" + w;
          back.go(url);
        }
    });
})
