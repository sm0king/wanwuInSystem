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
        remark : str($("#remark").val())
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
            back.to('./recordList.html');
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
    }
    loadData();
    HybridJS.init(document.getElementById('addImage'));
});
