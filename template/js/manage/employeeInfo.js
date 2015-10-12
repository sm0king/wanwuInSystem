$(function(){

    $("#search").on('keyup',function(e){
        var k = e.keyCode || e.which;
        if(k == 13){
          window.location.href = "./employeeSearch.html";
        }
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

    function load(argument) {
        var id = service.getSearch('id');
        service.getEmployeeDetail(id,function(flag,msg){
            console.log(flag);
            console.log(msg);
            if (flag) {
              var data = msg.result;
              $("#name").val(data.name);
              $("#phone").val(data.phone);
              $("#email").val(data.email || "无");
              $("#type").html(data.typeName).data('id',data.type);
              $("#depart").html(data.departName).data('id',data.dp_id);
              $("#superior").html(data.parentName).data('id',data.supervisor_id);

              loadPro(function(re){
                $("#provinces").html(re).val(data.province);
              });
              loadCity(data.province,function(re){
                $("#city").html(re).val(data.city);
              });
              loadDist(data.city,function(re){
                $("#district").html(re).val(data.district);
              });

            }
        });
    }
    load();
});
