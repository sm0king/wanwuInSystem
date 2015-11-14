$(function(){
    // 搜索跳转
    $("#search").on('keyup',function(e){
        var k = e.keyCode || e.which;
        if(k == 13){
          var w = service.strCheck($(this).val());
          var url = "./departmentSearch.html?key=" + w;
          back.go(url);
        }
    });

    // 详情跳转
    $("#departList").on('click','.depart-box',function(){
        var url = './departmentInfo.html?id='+ $(this).data('id');
        back.go(url);
    });

    $("#add").on('click',function(){
        var url = './departmentAdd.html';
        back.go(url);
    });

    // 滚动加载
    $(window).scroll(function(){
        loadOther();
    });

    function loadOther(){
        var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
        if ($(document).height() <= totalheight) {
            if ($("#load") && $("#load").data('status') == '0') {
                var page  =  parseInt($("#departList").data('page')) + 1;
                    $("#load").data('status','1');
                    load(page);
            }
        }
    }

    $("#departList").on('click','#load',function(){
        loadOther();
    });

    function madeDom(data){
        var list = "",dom = "",img;
        for (var i = 0; i < data.length; i++) {
            dom = "";
            if (data[i].employeeList.employeeList.length > 0 ) {
              for (var j = 0; j < data[i].employeeList.employeeList.length; j++) {
                if (j < 4) {
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
            }else if (data[i].employeeList.charge.length > 0 ) {
                dom = '<li class="depart-list"><img src="' + (data[i].employeeList.charge[0].img || '/diguaApp/images/user.png') +'" >'+
                    '<div class="caption">' + data[i].employeeList.charge[0].name + '</div></li>' + dom;
            }else {
              dom = '<div class="text-center">暂无成员</div>'
            }

            list += '<div class="depart-box" data-id="' + data[i].id + '"><div class="list-date clearfix bg-warning">'+
                    '<span>'+ data[i].name +'</span></div><ul class="depart-inline">' + dom + '</ul></div>';
        }

        return list;
    }

    function load(page,pageSize) {
        var data = {
          page: page || 1,
          PageSize: pageSize || 10,
        }
        service.departmentList(data,function(flag,msg){
            if (flag) {
                $("#load").remove();
                var result = msg.departmentList;
                var list = madeDom(result);
                var totalPage = parseInt(Math.ceil(msg.totalNumber / msg.pageSize));
                if(msg.page < totalPage){
                    list  = list + '<li id="load" class="loading list-group-item text-center show">加载更多...</li>';
                    $("#departList").append(list).data('page',data.page);
                    $("#load").data('status','0');
                }else if(msg.page == totalPage){
                    $("#departList").append(list);
                }
            }else {
                $("#departList").html("<p class='alert alert-danger text-center'>"+msg+"</p>")
            }

        });
    }

    load();

});
