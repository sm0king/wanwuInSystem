$(function() {

    $("#search").on('keyup', function(e) {
        var k = e.keyCode || e.which;
        if (k == 13) {
          var w = service.strCheck($(this).val());
          var url = "./employeeSearch.html?key=" + w;
          back.go(url);
        }
    });

    $('#employeeList').on('click', '.list-group-item', function(e) {
        if (!$(this).hasClass('disabled')) {
          var id, url;
          id = $(this).data('id');
          url = './employeeInfo.html?id=' + id;
          back.go(url);
        } else {
          alert('不能编辑');
        }
    }).on('click','.link-more.conceal',function(){
        var arg = {
            isGroup:    1,
            employeeId: $(this).data('id')
        }
        var _this = $(this);
        _this.addClass('on').removeClass('conceal');
        _this.siblings('.myguys').addClass('have')
        service.manageGetEmployeeList(arg, function(flag, msg) {
            if (flag) {
                var list = madeDom(msg.employeeList);
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

  $("#add").on('click', function() {
    var url = './employeeAdd.html';
    back.go(url);
  });


  // 废弃
  // function loadOld() {
  //   service.manageGetEmployeeList("", "1", "10", "1", function(flag, msg) {
  //     var my = service.getUserInfo();
  //     if (flag) {
  //       var list = "",
  //         dom = "",
  //         img, emp, control;
  //       var dep = msg.departmentList;
  //       for (var i = 0; i < dep.length; i++) {
  //         emp = dep[i].employeeList;
  //         for (var j = 0; j < emp.length; j++) {
  //           if (emp[j].phone == my.phone) {
  //             control = "disabled";
  //           } else {
  //             control = "";
  //           }
  //           img = emp[j].img ? emp[j].img : '/diguaApp/images/tuwen.png';
  //           list += '<li class="list-group-item ' + control + '" data-id="' + emp[j].id + '">' +
  //             '<div class="media">' +
  //             '<div class="media-left meida-middle w20">' +
  //             '<img src="' + img + '" style="max-height:60px;"></div>' +
  //             '<div class="media-body w60">' +
  //             '<div>' + emp[j].name + '</div>' +
  //             '<div> ' + emp[j].phone + ' </div></div></div></li>';
  //         }
  //         dom += '<div class="list-date clearfix bg-warning">' +
  //           '<span>' + (dep[i].departmentName || "暂无部门") + '</span></div><ul class="list-group">' + list + '</ul>';
  //         list = "";
  //       }
  //       $('#employeeList').html(dom);
  //     }
  //   })
  // }

  function madeDom(emp){
      var my = service.getUserInfo();
      var list = "",control,img,guys;
      for (var i = 0; i < emp.length; i++) {
          if (emp[i].phone == my.phone) {
              control = "disabled";
              guys = "";
          } else {
              control = "";
              guys = emp[i].guysNumber ? '<div class="guys-link"><div class="myguys"></div><p class="link-more conceal" data-id="'+ emp[i].id +'" data-num="'+ emp[i].guysNumber +'">点击查看他的'+ emp[i].guysNumber +'个下级</p></div>' : "";
          }
          img = emp[i].img ? emp[i].img : '/diguaApp/images/user.png';
          list += '<li class="list-group-item ' + control + '" data-id="' + emp[i].id + '">' +
              '<div class="media">' +
              '<div class="media-left meida-middle w20">' +
              '<img src="' + img + '" style="max-height:60px;"></div>' +
              '<div class="media-body w60">' +
                  '<div>' + emp[i].name + '</div>' +
                  '<div> ' + emp[i].phone + ' </div>'+
                  '<div> ' + (emp[i].departName || "暂无部门") + ' </div></div></div></li>'+ guys;
      }
      return list;
  }

  function load() {
     var arg = {};
    service.manageGetEmployeeList(arg, function(flag, msg) {
      if (flag) {
        var list = madeDom(msg.employeeList);
        $('#employeeList').html(list);
      }
    });
  }

  load();
})
