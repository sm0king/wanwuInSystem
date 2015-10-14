$(function(){

    function saveDate(){
      var data = {};
      var str = service.strCheck,id = service.getSearch('id');
      data = {
        dpId:id,
        departmentName:str($("#departName").val()),
        headImage : $("#addImage").data('imgUrl') || '/diguaApp/images/tuwen.png',
        departmentNotice:str($("#notice").text()),
        chargeId:$("#leader").data('id'),
        isEditSubDepartmentNotice:$("#notice").data('flag'),
      }
      if (checkData(data)) {
        service.departmentUpdate(data,function(flag,msg){
            if (flag) {
              alert('编辑成功');
              // var url = './departmentList.html';
              // back.go(url);
              history.go(-1);
            }else {
              alert(msg);
            }
        });
      }
    }


    function checkData(data){
        if (data.departmentName == "") {
           alert('请填写部门名称');
           return false;
        }
        if (!data.chargeId) {
          alert('请选择部门负责人');
          return false;
        }
        return true;
    }

    $("#save").on('click',function(){
        saveDate();
    })

    $("#noticeList").on('click',function(){
        $('#noticePanel').find('textarea').val($("#notice").html());
        $("#noticePanel").show();
    });

    $("#noticePanel").on('click','#addNotice',function(){
        if ($('#noticePanel').find('input[type="checkbox"]').prop("checked")) {
            $('#notice').data('flag','1');
        }else {
            $('#notice').data('flag','0');
        }
        $("#notice").html($('#noticePanel').find('textarea').val());
        $("#noticePanel").hide();
    });

    $("#noticePanel").on('click','#cancel',function(){
        $('#noticePanel').find('textarea').val($("#notice").html());
        $("#noticePanel").hide();
    });

    $("#leader").on('click',function(){
        var id = service.getSearch('id');
        service.departmentEmployeeList(id,"","1","10",function(flag,msg){
            if (flag) {
              var list = msg.employeeList;
              var dom = "",img;
              for (var i = 0; i < list.length; i++) {
                  img = list[i].img ? list[i].img : "/diguaApp/images/tuwen.png";
                  dom += '<li class="list-group-item employee-item" data-id="'+ (list[i].user_id || list[i].id)+'">'+
                        '<div class="media">'+
                          '<div class="media-left meida-middle w20">'+
                            '<img src="'+img+'" alt=""></div>'+
                          '<div class="media-body w60">'+
                            '<div class="employee-name">'+list[i].name+'</div>'+
                            '<div>'+list[i].phone+'</div>'+
                            '<div>'+(list[i].departmentName || "暂无部门")+'</div>'+
                        '</div></div></li>';
              }
              dom = '<ul class="list-group">' + dom + '</ul>';
              $("#searchList").html(dom);
            }else {
              $("#searchList").html('<div class="alert alert-danger">'+msg+'</div>');
            }
            $("#searchPanel").show();
        });
    });

    $(".cancel").on('click',function(){
      $("#searchList").html("");
      $("#searchPanel").hide();
    });

    $('#searchList').on('click','.list-group-item',function(e){
        $("#leader").html($(this).find('.employee-name').text()).data('id',$(this).data('id'));
        $("#searchList").html("");
        $("#searchPanel").hide();
        return false;
    });

    function load(argument) {
        var id = service.getSearch('id');
        service.departmentDetail(id,function(flag,msg){
            if (flag) {
              console.log(msg);
                $("#departName").val(msg.name || "");
                $("#notice").html(msg.department_notice || "");
                service.departmentEmployeeList(id,msg.charge_employee_id,'1','10',function(status,data){
                    if (status) {
                        var empList = data.employeeList;
                        var dom = "",img;
                        if (empList.length) {
                          for (var i = 0; i < empList.length; i++) {
                              img = empList[i].img ? empList[i].img : '/diguaApp/images/tuwen.png';
                              dom += '<li class="depart-list">'+
                                      '<img src="'+img+'">'+
                                      '<div class="caption">' + empList[i].name + '</div></li>';
                          }
                        }else {
                          dom = '<div class="text-center">暂无成员</div>';
                        }
                        $("#departEmployee").html(dom);
                        $("#leader").html(msg.chargeEmployeeName).data('id',msg.charge_employee_id);
                        $("#creatTime").html('由 '+ msg.createPersionName + ' 在 ' + msg.create_time + ' 创建');

                    }else {
                      console.log(data);
                      $("#departEmployee").html(data);
                    }
                });
            }else {
              console.log(msg);
              alert(msg);
            }
        });

    }

    load();
    HybridJS.init(document.getElementById('addImage'));
});
