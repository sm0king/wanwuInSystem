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
      if (!$(this).hasClass('disabled')) {
        var id,url;
        id = $(this).data('id');
        url = './employeeInfo.html?id='+id;
        back.go(url);
      }else {
        alert('不能编辑');
      }
  });

  $("#add").on('click',function(){
      var url = './employeeAdd.html';
      back.go(url);
  });

  function load(){
      service.manageGetEmployeeList("","1","10","1",function(flag,msg){
          var  my = service.getUserInfo();
          if (flag) {
              var list = "",dom="",img,emp,control;
              var dep = msg.departmentList;
              for (var i = 0; i < dep.length; i++) {
                emp = dep[i].employeeList;
                for (var j = 0; j < emp.length; j++) {
                  if (emp[j].phone == my.phone ) {
                      control = "disabled";
                  }else {
                      control = "";
                  }
                  img = emp[j].img ? emp[j].img : '/diguaApp/images/tuwen.png';
                  list += '<li class="list-group-item '+ control +'" data-id="'+ emp[j].id +'">'+
                          '<div class="media">'+
                            '<div class="media-left meida-middle w20">'+
                              '<img src="'+ img +'" alt=""></div>'+
                              '<div class="media-body w60">'+
                              '<div>'+ emp[j].name +'</div>'+
                              '<div> '+ emp[j].phone +' </div></div></div></li>';
                }
                dom += '<div class="list-date clearfix bg-warning">'+
                        '<span>'+ (dep[i].departmentName || "暂无部门") +'</span></div><ul class="list-group">'+ list + '</ul>';
                list = "";
              }
              $('#employeeList').html(dom);
          }
      })
  }
  load();
})
