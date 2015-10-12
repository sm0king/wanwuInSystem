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
        $("#search").val(key);
        service.manageGetEmployeeList(key,"",function(flag,msg){
           if (flag) {
              var dom = "",img;
              for (var i = 0; i < msg.length; i++) {
                  img = msg[i].img ? msg[i].img : '/diguaApp/images/tuwen.png';
                  dom += '<li class="list-group-item" data-id="'+ msg[i].id +'">'+
                          '<div class="media">'+
                            '<div class="media-left meida-middle w20">'+
                              '<img src="'+ img +'" alt=""></div>'+
                              '<div class="media-body w60">'+
                              '<div>'+ msg[i].name +'</div>'+
                              '<div> '+ msg[i].phone +' </div>'+
                              '<div>'+ msg[i].dpname +'</div></div></div></li>';
              }
              list = '<ul class="list-group">' + dom + '</ul>';
              $("#searchList").html(dom);
           }
        });
    }
    load();
});
