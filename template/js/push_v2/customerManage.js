$(function(){
    $('.list-group-item .disabled').on('click',function(e){
        e.preventDefault();
    });

    $(".sign").on('click', function(event) {
        event.preventDefault();
        location.href='./recordMark.html';
    });
    $(".address").on('click', function(event) {
        event.preventDefault();
        var lng = $(this).data('lng'),
            lat = $(this).data('lat');
            console.log(lng);
            console.log(lat);
    });
});
