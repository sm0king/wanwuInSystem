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
          taskId : $("#marketName").data('id'),
          local: $("#point").data('nowpoi')
        };
        if (!data.address) {
            alert('请填写详细地址');
            return false;
        }
        if (!data.shopName) {
            alert("请填写超市名称");
        }else if(!data.local){
            alert("当前无法定位，无法添加地址");
        }else{
            service.serviceSaveCustomersDetail(data,function(flag,msg){
                if (flag) {
                    alert("保存成功");
                    history.go(-1);
                }else {
                    alert('保存失败');
                }
            });
        }
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
          showMap();
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

      //实例化地图
      var map = new AMap.Map('mapContainer', {
          resizeEnable: true,
          zoom:16,
      });

      //  地图地址确定
      $("#mapPage").on('click', '.addLocal', function(event) {
          var poi = $("#addrInfo").data('local');
          if (!poi) {
            alert('请在有效范围内选择地址');
          }else {
            var str = poi.lng + ',' + poi.lat;
            var savePoi = {
                longitude: poi.lng,
                latitude: poi.lat
            }
            $("#point").data('nowpoi',savePoi);
            madeAddress(str);
            map.clearMap();
            $("#mapPage").removeClass('show');
          }
      });

      // 取消地图选择
      $("#mapPage").on('click','#cancel',function(){
          map.clearMap();
          $("#mapPage").removeClass('show');
      })

      // 加载地图
      function showMap(){
            $("#mapPage").addClass('show');
            var     startPoi = $("#point").data('nowpoi'),
                showPoi = [startPoi.longitude,startPoi.latitude];
            map.setCenter(showPoi);
            geocoder();
            map.on('moveend', function(e) {
                geocoder();
            });
            var marker = new AMap.Marker({
                position: showPoi
            });
            marker.setMap(map);
        }


        // 地理位置逆编码
        function geocoder() {
            var MGeocoder,lnglatXY;
            var center = map.getCenter();
            lnglatXY = [center.lng,center.lat];
            var poi = {lng:center.lng,lat:center.lat};
            //加载地理编码插件
            AMap.service(["AMap.Geocoder"], function() {
                MGeocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                });
                //逆地理编码
                MGeocoder.getAddress(lnglatXY, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        geocoder_CallBack(result);
                        $("#addrInfo").data('local',poi);
                    }else {
                      console.log('error');
                    }
                });
            });
        }

        // 地理位置逆编码回调
        function geocoder_CallBack(result){
            $("#addrInfo").html(result.regeocode.formattedAddress);
        }

        // 根据地理坐标遍历填充地址选择器
        function showPosition(poi){
            var coords = poi.coords.longitude + ',' + poi.coords.latitude;
            madeAddress(coords);
        }

      function madeAddress(str){
        service.getNowLocal(str,function(flag,msg){
            var proName = msg.addressComponent.province,
                cityName = msg.addressComponent.city,
                districtName = msg.addressComponent.district,
                streetName,
                pid,cid,did;
            $("#tips").hide();
            streetName = msg.addressComponent.township + msg.addressComponent.streetNumber.street + msg.addressComponent.streetNumber.number;
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
              console.log(msg);
              if (flag) {
                var data = msg.result;
                $("#marketName").val(data.shop_name).data('id',data.user_id);
                $("#linkman").val(data.consignee);
                $("#phone").val(data.mobile || data.phone);
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

                $("#point").data('nowpoi',data.position);

                // 超市规模
                $("#scale").val(data.scales);
                // 运营状况
                $("#state").val(data.running_state);
                $("#time").html("注册时间  " + data.add_time);
                $("#addImage").css('background-image','url('+ data.shop_url +')');
                $("#addImage").data('imgUrl',data.shop_url);
              }
          });
      }

      loadData();
      HybridJS.init(document.getElementById('addImage'));
});
