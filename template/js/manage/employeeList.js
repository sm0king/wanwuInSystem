$(function(){

  $("#search").on('keyup',function(e){
      var k = e.keyCode || e.which;
      if(k == 13){
        var w = service.strCheck($(this).val());
        var url = "./employeeSearch.html?key=" + w;
        back.go(url);
      }
  });

  $('#employeeList').on('click','.list-group-item',function(e){
      var id,url;
      id = $(this).data('id');
      url = './employeeInfo.html?id='+id;
      back.go(url);
      console.log(id);

  });

  function load(){
      service.manageGetEmployeeList("","1",function(flag,msg){
          if (flag) {
              var list = "";
              $.each(msg,function(index, el) {
                  var data =  el.result,dom = "",img;
                  for (var i = 0; i < data.length; i++) {
                    img = data[i].img ? data[i].img : '/diguaApp/images/tuwen.png';
                    dom += '<li class="list-group-item" data-id="'+ data[i].id +'">'+
                            '<div class="media">'+
                              '<div class="media-left meida-middle w20">'+
                                '<img src="'+ img +'" alt=""></div>'+
                                '<div class="media-body w60">'+
                                '<div>'+ data[i].name +'</div>'+
                                '<div> '+ data[i].phone +' </div></div></div></li>';
                  }
                  list +='<div class="list-date clearfix bg-warning">'+
                          '<span>'+ el.name +'</span></div><ul class="list-group">'+ dom + '</ul>';
              });
              $('#employeeList').html(list);
          }
      })
  }
  load();
})
