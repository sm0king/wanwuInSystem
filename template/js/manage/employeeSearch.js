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

    $('#searchList').on('click','.list-group-item',function(e){
        var id,url;
        id = $(this).data('id');
        url = './employeeInfo.html?id='+id;
        back.go(url);
    });

    function load(word){
        var data = {};
        data.phone = word ? word : service.getSearch('key') || "";
        $("#search").val(data.phone);
          service.manageGetEmployeeList(data,function(flag,msg){
             if (flag) {
                // console.log(msg);
                var dom = "",img;
                var data = msg.employeeList;
                if (data.length) {
                  for (var i = 0; i < data.length; i++) {
                      img = data[i].img ? data[i].img : '/diguaApp/images/tuwen.png';
                      dom += '<li class="list-group-item" data-id="'+ data[i].id +'">'+
                              '<div class="media">'+
                                '<div class="media-left meida-middle w20">'+
                                  '<img src="'+ img +'" style="max-height:60px;"></div>'+
                                  '<div class="media-body w60">'+
                                  '<div>'+ data[i].name +'</div>'+
                                  '<div> '+ data[i].phone +' </div>'+
                                  '<div>'+ (data[i].departmentName || "暂无部门") +'</div></div></div></li>';
                  }
                }else {
                  dom = '<p class="alert alert-danger text-center">没有该员工</p>'
                }
                list = '<ul class="list-group">' + dom + '</ul>';
                $("#searchList").html(dom);
             }else{
               $("#searchList").html("<p class='alert alert-danger text-center'>"+msg+"</p>");
             }
          });
    }
    load();
});
