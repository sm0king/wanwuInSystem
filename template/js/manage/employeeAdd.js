$(function(){

  function saveDate() {
    var str = service.strCheck;
    var data = {
      name : str($("#name").val()),
      phone : str($("#phone").val()),
      img : $("#addImage").data('imgUrl') || '/diguaApp/images/user.png',
      email : str($("#email").val()),
      pid : str($('#provinces').val()),
      cid : str($("#city").val()),
      did : str($("#district").val()),
      type : $("#type").val(),
      parent_id : $("#superior").data('id') || "",
      dp_id : $("#depart").data('id') || "",
      pushFun : $("#pushFun").prop("checked")? 1:0,
      shipFun : $("#shipFun").prop("checked")? 1:0,
      manageFun : $("#manageFun").prop('checked')? 1:0,
      employeeCURD : $("#employeeCURD").prop('checked')? 1:0,
      firmFun : $("#firmFun").prop('checked')? 1:0
    };

    if (checkData(data)) {
        service.saveEmployee(data,function(flag,msg){
            if (flag) {
              alert('添加成功');
              history.go(-1);
            }else {
              alert(msg);
            }
        });
    }
  }

    // 数据格式验证
    function checkData(data){
        if (!data.name) {
            alert("请填写姓名！");
            return false;
        }else if(!data.phone){
            alert("请填写手机号！");
            return false;
        }else if(data.phone != ""){
            var tel = data.phone;
            var flag = !!tel.match(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
            if (!flag) {
                alert("请填写真实联系电话!");
                return false;
            }
        }
        return true;
    }

  $("#save").on('click',function(){
      saveDate();
  });

  function loadPro(call){
    // 省列表
    service.serviceGetAddress("",function(flag,msg){
        if (flag) {
          var pro = msg.regions,
              opt = "",
              sel = "";
          for (var i = 0; i < pro.length; i++) {
            opt += '<option value="'+ pro[i].regionId +'" '+ sel +'>'+ pro[i].regionName +'</option>';
          }
          call(opt);
        }
    });
  }

  function loadCity(pid,call){
    // 市列表
    service.serviceGetAddress(pid,function(flag,msg){
        if (flag) {
          var city = msg.regions,
              opt = "",
              sel = "";
          for (var i = 0; i < city.length; i++) {
            opt += '<option value="'+ city[i].regionId +'" '+ sel +'>'+ city[i].regionName +'</option>';
          }
          call(opt);
        }
    });
  }

  function loadDist(cid,call){
    // 区列表
    service.serviceGetAddress(cid,function(flag,msg){
        if (flag) {
          var dit = msg.regions,
              opt = "",
              sel = "";
          for (var i = 0; i < dit.length; i++) {
            opt += '<option value="'+ dit[i].regionId +'" '+ sel +'>'+ dit[i].regionName +'</option>';
          }
          call(opt);
        }
    });
  }

  $("#provinces").change(function(event) {
      loadCity($(this).val(),function(re){
        re = '<option>请选择</option>' + re;
        $("#city").html(re).show();
        $("#district").html("<option>请选择</option>");
      });
  });

  $("#city").change(function(event) {
      loadDist($(this).val(),function(re){
        re = '<option>请选择</option>' + re;
        $("#district").html(re).show();
      });
  });

  // 上级列表
  $("#superior").on('click',function(event) {
    service.manageGetEmployeeList({},function(flag,msg){
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
        $(".z-panel").show();
    });
  });

  // 部门列表
  $("#depart").on('click',function(event) {
      var data = {
        PageNumber: page || 1,
        PageSize: pageSize || 10,
      }
    service.departmentList(data,function(flag,msg){
        if (flag) {
          var dom = "",img;
          var list = msg.departmentList;
          for (var i = 0; i < list.length; i++) {
              img = list[i].img ? list[i].img : "/diguaApp/images/department.png";
              dom += '<li class="list-group-item depart-item" data-id="'+ (list[i].user_id || list[i].id)+'">'+
                    '<div class="media">'+
                      '<div class="media-left meida-middle w20">'+
                        '<img src="'+img+'" alt=""></div>'+
                      '<div class="media-body w60">'+
                        '<div class="depart-name">'+list[i].name+'</div>'+
                        '<div>'+(list[i].create_user || "未知负责人")+'</div>'+
                    '</div></div></li>';
          }
          dom = '<ul class="list-group">'+ dom +'</ul>';
          $("#searchList").html(dom);
        }else {
          $("#searchList").html('<div class="alert alert-danger">'+msg+'</div>');
        }
        $(".z-panel").show();
    });
  });

  $(".cancel").on('click',function(){
    $("#searchList").html("");
    $(".z-panel").hide();
  });

  $("#manageFun").on('click',function(){
      if ($(this).prop('checked')) {
          $("#employeeCURD").parents('.list-group-item').removeClass('hide');
      }else {
          $("#employeeCURD").prop('checked',false).parents('.list-group-item').addClass('hide');
      }
  });

  $('#searchList').on('click','.list-group-item',function(e){
      e.preventDefault();
      if ($(this).hasClass('employee-item')) {
          $("#superior").html($(this).find('.employee-name').text()).data('id',$(this).data('id'));
          $("#searchList").html("");
          $(".z-panel").hide();
      }else if ($(this).hasClass('depart-item')) {
          $("#depart").html($(this).find('.depart-name').text()).data('id',$(this).data('id'));
          $("#searchList").html("");
          $(".z-panel").hide();
      }
      return false;
  });

  function loadData(){
      loadPro(function(re){
        re = '<option>请选择</option>' + re;
        $("#provinces").html(re);
      });
      $("#city").hide();
      $('#district').hide();

      service.getJobs(function(flag,msg){
          if (flag) {
            var opt = '';
            for (var i = 0; i < msg.result.length; i++) {
              opt += '<option value="'+msg.result[i].id+'">'+msg.result[i].name+'</option>';
            }
            opt = '<option value="0">请选择</option>' + opt;
            $("#type").html(opt);
          }
      });
  }
  loadData();
    HybridJS.init(document.getElementById('addImage'));
})
