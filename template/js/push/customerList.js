$(function(){
    $(".panel-head").on('click',function(){
        var id = $(this).data('collapse');
        $('.panel-main').not(document.getElementById(id)).removeClass('in');
        $("#"+id).toggleClass('in');
    })
})
