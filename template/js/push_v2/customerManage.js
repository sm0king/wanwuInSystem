$(function(){
    $('.list-group-item .disabled').on('click',function(e){
        e.preventDefault();
    });

    $(".sign").on('click', function(event) {
        event.preventDefault();
        var id = $(this).data('id');
        location.href='/newosadmin/customer/confirmVisit?shopId='+id;
    });
});
