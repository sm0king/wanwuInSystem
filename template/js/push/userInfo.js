$(function(){

      function saveDate() {
        var str = service.strCheck;
        var data = {
          shopName : str($("#marketName").val()),
          shopLogo : $("#addImage").data('imgUrl') || '/diguaApp/images/tuwen.png',
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
        if (!data.address) {
            alert('请填写详细地址');
            return false;
        }
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
          service.serviceSaveCustomersDetail(data,function(flag,msg){
              if (flag) {
                  alert('保存成功');
                  history.go(-1);
              }
          });
        });
      }

      $("#save").on('click',function(){
          saveDate();
      });

      function madeOption(data) {
          var pro = data.regions,
              opt = "";
          for (var i = 0; i < data.length; i++) {
            opt += '<option value="'+ data[i].regionId +'">'+ data[i].regionName +'</option>';
          }

          return  opt;
      }

      function loadPro(call){
        // 省列表
        service.serviceGetAddress("",function(flag,msg){
            if (flag) {
              var opt = madeOption(msg.regions);
              call(opt);
            }
        });
      }

      function loadCity(pid,call){
        // 市列表
        service.serviceGetAddress(pid,function(flag,msg){
            if (flag) {
              var opt = madeOption(msg.regions);
              call(opt);
            }
        });
      }

      function loadDist(cid,call){
        // 区列表
        service.serviceGetAddress(cid,function(flag,msg){
            if (flag) {
              var opt = madeOption(msg.regions);
              call(opt);
            }
        });
      }

      /**
       * 地理定位
       */
      $("#point").on('click',function(){
          Mypoint();
      })

      function Mypoint(){
       var data={};
       if(!navigator.geolocation){
           alert("不支持位置定位");
       }else {
          navigator.geolocation.getCurrentPosition(showPosition);
          $("#tips").show();
       }
      }

      function showPosition(poi){
          var coords = poi.coords.longitude + ',' + poi.coords.latitude;
          service.getNowLocal(coords,function(flag,msg){
              var proName = msg.addressComponent.province,
                  cityName = msg.addressComponent.city,
                  districtName = msg.addressComponent.district,
                  streetName = msg.addressComponent.township + msg.addressComponent.streetNumber.street,
                  pid,cid,did;
              $("#tips").hide()
              service.serviceGetAddress("",function(p_flag,p_msg){
                  if (p_flag) {
                       for (var i = 0; i < p_msg.regions.length; i++) {
                           if (p_msg.regions[i].regionName == proName) {
                               pid = p_msg.regions[i].regionId;
                               $("#provinces").val(pid);
                               service.serviceGetAddress(pid,function(c_flag,c_msg){
                                   if (c_flag) {
                                       for (var j = 0; j < c_msg.regions.length; j++) {
                                         if (c_msg.regions[j].regionName == cityName) {
                                             cid = c_msg.regions[j].regionId;
                                             $("#city").html(madeOption(c_msg.regions)).val(cid).show();
                                             service.serviceGetAddress(cid,function(d_flag,d_msg){
                                                 if (d_flag) {
                                                   for (var s = 0; s < d_msg.regions.length; s++) {
                                                       if (d_msg.regions[s].regionName == districtName) {
                                                           did = d_msg.regions[s].regionId;
                                                           $("#district").html(madeOption(d_msg.regions)).val(did).show();
                                                           $("#street").val(streetName);
                                                       }
                                                   }
                                                 }
                                             });
                                         }
                                       }

                                   }
                               });
                           }

                       }
                  }
              });
          })
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
          service.serviceGetMyCustomersDetail(id,function(flag,msg){
              if (flag) {
                var data = msg.result;
                $("#marketName").val(data.shop_name).data('id',data.user_id);
                $("#linkman").val(data.consignee);
                $("#phone").val(data.phone || data.mobile);
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
                $("#time").html("注册时间  " + data.add_time);
              }
          });
      }

      loadData();
      HybridJS.init(document.getElementById('addImage'));
});
