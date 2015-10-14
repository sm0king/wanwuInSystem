$(function(){

    function saveDate() {
      var str = service.strCheck;
      var data = {
        shopName : str($("#marketName").val()),
        consignee : str($("#linkman").val()),
        phone : str($("#phone").val()),
        pid : str($('#provinces').val()),
        cid : str($("#city").val()),
        did : str($("#district").val()),
        address : str($("#street").val()),
        scales : str($("#scale").val()),
        state : str($("#state").val()),
        remark : str($("#remark").val()),
        taskId : $("#marketName").data('id')
      };

      var map = {
          city: $("#city").find('option:selected').text(),
          addr: data.address,
      }
      service.getAddressLocal(map,function(re){
        var localArr = re.geocodes[0].location;
        data.local = {
                longitude: localArr.split(',')[0],
                latitude:localArr.split(',')[1]
              };
        service.serviceSaveMyRecord(data,function(flag,msg){
            alert("保存成功");
            window.location.reload();
        });
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
          $("#city").html(re);
          $("#district").html("<option>请选择</option>");
        });
    });

    $("#city").change(function(event) {
        loadDist($(this).val(),function(re){
          $("#district").html(re);
        });
    });

    function loadData(){
        var id = service.getSearch('id');
        service.serviceMyRecordDetail(id,function(flag,msg){
            if (flag) {
              console.log(msg);
              var data = msg.result;
              $("#marketName").val(data.shop_name).data('id',data.id);
              $("#linkman").val(data.consignee);
              $("#phone").val(data.phone);
              $("#street").val(data.address);
              $("#remark").val(data.remark);
              loadPro(function(re){
                $("#provinces").html(re).val(data.province_id);
              });
              loadCity(data.province_id,function(re){
                $("#city").html(re).val(data.city_id);
              });
              loadDist(data.city_id,function(re){
                $("#district").html(re).val(data.district_id);
              });

              // 超市规模
              $("#scale").val(data.scales);
              // 运营状况
              $("#state").val(data.running_state);
              $("#time").html("添加时间  " + data.add_time);
            }
        });
    }

    loadData();
    HybridJS.init(document.getElementById('addImage'));
});
