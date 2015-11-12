$(function(){
    $("#search").on('keyup',function(e){
        var k = e.keyCode || e.which;
        if(k == 13){
          var w = service.strCheck($(this).val());
          var url = "./departmentSearch.html?key=" + w;
          back.go(url);
        }
    });


    $("#departList").on('click','.depart-box',function(){
        var url = './departmentInfo.html?id='+ $(this).data('id');
        back.go(url);
    });

    $("#add").on('click',function(){
        var url = './departmentAdd.html';
        back.go(url);
    })

    function load(argument) {
      service.departmentList("","","",function(flag,msg){
          if (flag) {
            var data = msg.departmentList;
            var list = "",dom = "",img;
            for (var i = 0; i < data.length; i++) {
                dom = "";
                if (data[i].employeeList.employeeList.length > 0) {
                  for (var j = 0; j < data[i].employeeList.employeeList.length; j++) {
                    if (j < 5) {
                      img = data[i].employeeList.employeeList[j].img ? data[i].employeeList.employeeList[j].img : '/diguaApp/images/user.png';
                      dom += '<li class="depart-list">'+
                             '<img src="' + img +'" >'+
                             '<div class="caption">'+data[i].employeeList.employeeList[j].name+'</div></li>';
                    }
                  }
                  if (data[i].employeeList.charge.length) {
                      dom = '<li class="depart-list"><img src="' + (data[i].employeeList.charge[0].img || '/diguaApp/images/user.png') +'" >'+
                            '<div class="caption">' + data[i].employeeList.charge[0].name + '</div></li>' + dom;
                  }
                }else {
                  dom = '<div class="text-center">暂无成员</div>'
                }

                list += '<div class="depart-box" data-id="' + data[i].id + '"><div class="list-date clearfix bg-warning">'+
                        '<span>'+ data[i].name +'</span></div><ul class="depart-inline">' + dom + '</ul></div>';
            }
            $("#departList").html(list);
          }else {
            $("#departList").html("<p class='alert alert-danger text-center'>"+msg+"</p>")
          }
      })
    }

    load();

});
