$(function() {

  function saveDate() {
    var str = service.strCheck,
      id = service.getSearch('id');
    var data = {
      name: str($("#name").val()),
      phone: str($("#phone").val()),
      img: $("#addImage").data('imgUrl') || '/diguaApp/images/user.png',
      email: str($("#email").val()),
      pid: str($('#provinces').val()),
      cid: str($("#city").val()),
      did: str($("#district").val()),
      type: $("#type").val(),
      parent_id: $("#superior").data('id') || "",
      dp_id: $("#depart").data('id') || "",
      pushFun: $("#pushFun").prop("checked") ? 1 : 0,
      shipFun: $("#shipFun").prop("checked") ? 1 : 0,
      manageFun: $("#manageFun").prop('checked') ? 1 : 0,
      employeeCURD: $("#employeeCURD").prop('checked') ? 1 : 0,
      firmFun: $("#firmFun").prop('checked') ? 1 : 0,
      taskId: id
    };

    if (checkData(data)) {
      service.saveEmployee(data, function(flag, msg) {
        if (flag) {
          alert('修改成功');
          history.go(-1);
        } else {
          alert(msg);
        }
      });
    }
  }

  // 数据格式验证
  function checkData(data) {
    if (!data.name) {
      alert("请填写姓名！");
      return false;
    } else if (!data.phone) {
      alert("请填写手机号！");
      return false;
    } else if (data.phone != "") {
      var tel = data.phone;
      var flag = !!tel.match(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
      if (!flag) {
        alert("请填写真实联系电话!");
        return false;
      }
    }
    return true;
  }

  $("#save").on('click', function() {
    saveDate();
  });

  function loadPro(call) {
    // 省列表
    service.serviceGetAddress("", function(flag, msg) {
      if (flag) {
        var pro = msg.regions,
          opt = "",
          sel = "";
        for (var i = 0; i < pro.length; i++) {
          opt += '<option value="' + pro[i].regionId + '" ' + sel + '>' + pro[i].regionName + '</option>';
        }
        call(opt);
      }
    });
  }

  function loadCity(pid, call) {
    // 市列表
    service.serviceGetAddress(pid, function(flag, msg) {
      if (flag) {
        var city = msg.regions,
          opt = "",
          sel = "";
        for (var i = 0; i < city.length; i++) {
          opt += '<option value="' + city[i].regionId + '" ' + sel + '>' + city[i].regionName + '</option>';
        }
        call(opt);
      }
    });
  }

  function loadDist(cid, call) {
    // 区列表
    service.serviceGetAddress(cid, function(flag, msg) {
      if (flag) {
        var dit = msg.regions,
          opt = "",
          sel = "";
        for (var i = 0; i < dit.length; i++) {
          opt += '<option value="' + dit[i].regionId + '" ' + sel + '>' + dit[i].regionName + '</option>';
        }
        call(opt);
      }
    });
  }

  $("#provinces").change(function(event) {
    loadCity($(this).val(), function(re) {
      re = '<option>请选择</option>' + re;
      $("#city").html(re).show();
      $("#district").html("<option>请选择</option>");
    });
  });

  $("#city").change(function(event) {
    loadDist($(this).val(), function(re) {
      re = '<option>请选择</option>' + re;
      $("#district").html(re).show();
    });
  });

  // 上级列表生成
  function madeLeaderDom(emp){
      var my = service.getUserInfo();
      var list = "",control,img,guys;
      for (var i = 0; i < emp.length; i++) {
          if (emp[i].phone == my.phone) {
              guys = "";
          } else {
              guys = emp[i].guysNumber ? '<div class="guys-link"><div class="myguys"></div><p class="link-more conceal" data-id="'+ emp[i].id +'" data-num="'+ emp[i].guysNumber +'">点击查看他的'+ emp[i].guysNumber +'个下级</p></div>' : "";
          }
          img = emp[i].img ? emp[i].img : '/diguaApp/images/user.png';
          list += '<li class="list-group-item employee-item" data-id="' + emp[i].id + '">' +
              '<div class="media">' +
              '<div class="media-left meida-middle px60">' +
              '<img src="' + img + '"></div>' +
              '<div class="media-body">' +
                  '<div class="employee-name">' + emp[i].name + '</div>' +
                  '<div> ' + emp[i].phone + ' </div>'+
                  '<div> ' + (emp[i].departName || "暂无部门") + ' </div></div></div></li>'+ guys;
      }
      return list;
  }

  // 上级列表
  $("#superior").on('click', function(event) {
    service.manageGetEmployeeList({pageSize:10000}, function(flag, msg) {
      if (flag) {
        var list = msg.employeeList;
        var dom = "",
          img;
        dom = madeLeaderDom(list);
        dom = '<ul class="list-group">' + dom + '</ul>';
        $("#searchList").html(dom);
      } else {
        $("#searchList").html('<div class="alert alert-danger">' + msg + '</div>');
      }
      $(".z-panel").show();
    });
  });

  $("#searchList").on('click','.link-more.conceal',function(){
      var arg = {
          isGroup:    1,
          employeeId: $(this).data('id'),
          pageSize: $(this).data('num')
      }
      var _this = $(this);
      _this.addClass('on').removeClass('conceal');
      _this.siblings('.myguys').addClass('have')
      service.manageGetEmployeeList(arg, function(flag, msg) {
          if (flag) {
              var list = madeLeaderDom(msg.employeeList);
              _this.siblings('.myguys').html(list);
              _this.html("收起下级列表");
          }
      })
  }).on('click','.link-more.on',function(){
      $(this).siblings('.myguys').html("");
      $(this).html("点击查看他的"+$(this).data('num')+"个下级");
      $(this).addClass('conceal').removeClass('on');
      $(this).siblings('.myguys').removeClass('have')
  });


  // 部门列表
  $("#depart").on('click', function(event) {
    service.departmentList({pageSize:10000}, function(flag, msg) {
      if (flag) {
        var dom = "",
          img;
        var list = msg.departmentList;
        for (var i = 0; i < list.length; i++) {
          img = list[i].img ? list[i].img : "/diguaApp/images/department.png";
          dom += '<li class="list-group-item depart-item" data-id="' + (list[i].user_id || list[i].id) + '">' +
            '<div class="media">' +
            '<div class="media-left meida-middle w20">' +
            '<img src="' + img + '" alt=""></div>' +
            '<div class="media-body w60">' +
            '<div class="depart-name">' + list[i].name + '</div>' +
            '<div>' + (list[i].create_user || "未知负责人") + '</div>' +
            '</div></div></li>';
        }
        dom = '<ul class="list-group">' + dom + '</ul>';
        $("#searchList").html(dom);
      } else {
        $("#searchList").html('<div class="alert alert-danger">' + msg + '</div>');
      }
      $(".z-panel").show();
    });
  });

  $(".cancel").on('click', function() {
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

  $('#searchList').on('click', '.list-group-item', function(e) {
    e.preventDefault();
    if ($(this).hasClass('employee-item')) {
      $("#superior").html($(this).find('.employee-name').text()).data('id', $(this).data('id'));
      $("#searchList").html("");
      $(".z-panel").hide();
    } else if ($(this).hasClass('depart-item')) {
      $("#depart").html($(this).find('.depart-name').text()).data('id', $(this).data('id'));
      $("#searchList").html("");
      $(".z-panel").hide();
    }
    return false;
  });

  $("#del").on('click', function() {
    if (confirm('确认删除员工吗? 删除后将无法恢复，相关数据也会一并清除。')) {
      var id = $(this).data('id');
      service.delEmployee(id, function(flag, msg) {
        if (flag) {
          alert("删除成功");
          back.go('./employeeList.html');
        } else {
          alert(msg);
          back.go('./employeeList.html');
        }
      })
    }
  })

  function load(argument) {
    var id = service.getSearch('id');
    service.getEmployeeDetail(id, function(flag, msg) {
      if (flag) {
        var data = msg.result;
        $("#name").val(data.name);
        $("#phone").val(data.phone);
        $("#email").val(data.email || "无");
        $("#type").html(data.typeName).data('id', data.type);
        $("#depart").html(data.departName).data('id', data.dp_id);
        $("#superior").html(data.parentName).data('id', data.supervisor_id);
        $("#addImage").css('background-image', 'url(' + data.img + ')');
        loadPro(function(re) {
          $("#provinces").html(re).val(data.province);
        });
        loadCity(data.province, function(re) {
          $("#city").html(re).val(data.city);
        });
        loadDist(data.city, function(re) {
          $("#district").html(re).val(data.district);
        });

        var open = data.open_function;
        $.each(open, function(index, el) {
          if (el == "0") {
            open[index] = false;
          } else {
            open[index] = true;
          }
        });
        $("#pushFun").prop('checked', open.pushFunction);
        $("#shipFun").prop('checked', open.shippingFunction);
        $("#manageFun").prop('checked', open.managementFunction);
        if (open.managementFunction) {
            $("#employeeCURD").prop('checked', open.employeeCURD).parents('.list-group-item').removeClass('hide');
        }
        $("#firmFun").prop('checked', open.firmFunction);
        $("#del").data('id', id);
        service.getJobs(function(flag, msg) {
          if (flag) {
            var opt = '';
            for (var i = 0; i < msg.result.length; i++) {
              opt += '<option value="' + msg.result[i].id + '">' + msg.result[i].name + '</option>';
            }
            opt = '<option value="0">请选择</option>' + opt;
            $("#type").html(opt).val(data.type);
          }
        });
      }
    });

  }
  load();
  HybridJS.init(document.getElementById('addImage'));
});
