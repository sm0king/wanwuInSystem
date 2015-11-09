$(function(){
    $(".sign").on('click',function(event) {
        event.preventDefault();
        /* Act on the event */
        var id = $(this).data('id');
        location.href  = './recordMark.html?id='+id;
    });
})
