$(function(){

      function saveDate(){
        var data = {};
        var str = service.strCheck,id = service.getSearch('id');
        data = {
          departmentName:str($("#departName").val()),
          headImage : $("#addImage").data('imgUrl') || '/diguaApp/images/department.png',
          departmentNotice:str($("#notice").text()),
          chargeId:$("#leader").data('id'),
          isEditSubDepartmentNotice:$("#notice").data('flag')||'0',
        }
        if (checkData(data)) {
          service.departmentUpdate(data,function(flag,msg){
              if (flag) {
                Msg.alert('添加成功');
                history.go(-1);
              }else {
                alert(msg);
              }
          });
        }
      }

      function checkData(data){
          if (data.departmentName == "") {
             Msg.alert('请填写部门名称');
             return false;
          }
          if (!data.chargeId) {
            Msg.alert('请选择部门负责人');
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
          service.manageGetEmployeeList("","1","10","0",function(flag,msg){
              if (flag) {
                var list = msg.employeeList;
                var dom = "",img;
                for (var i = 0; i < list.length; i++) {
                    img = list[i].img ? list[i].img : "/diguaApp/images/user.png";
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
      HybridJS.init(document.getElementById('addImage'));
})
