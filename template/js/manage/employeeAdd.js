$(function(){

  function saveDate() {
    var str = service.strCheck;
    var data = {
      name : str($("#name").val()),
      phone : str($("#phone").val()),
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
    console.log(data);
    service.saveEmployee(data,function(flag,msg){
        if (flag) {
          alert('添加成功');
        }else {
          alert(msg);
        }
    });
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

  function loadData(){
      loadPro(function(re){
        re = '<option>请选择</option>' + re;
        $("#provinces").html(re);
      });
      $("#city").hide();
      $('#district').hide();

      service.getJobs(function(flag,msg){
          // console.log(msg);
          if (flag) {
            var opt = '';
            for (var i = 0; i < msg.result.length; i++) {
              // msg[i]
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
