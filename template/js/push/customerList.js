$(function(){
    $(".panel-head").on('click',function(){
        var id = $(this).data('collapse');
        $('.panel-main').not(document.getElementById(id)).removeClass('in');
        $("#"+id).toggleClass('in');
    });

    $("#search").on('keyup',function(e){
        var k = e.keyCode || e.which;
        if(k == 13){
          var w = service.strCheck($(this).val());
          var url = "/newosadmin/customer/index?keyword=" + w;
          back.go(url);
        }
    });
})
