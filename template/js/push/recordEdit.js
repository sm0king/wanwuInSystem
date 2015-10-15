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
            history.go(-1);
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

    // 地理定位
    $("#point").on('click',function(){
        showMap();
    });

    $("#mapPage").on('click', '.addLocal', function(event) {
      /* Act on the event */
        if (!$("#addrInfo").data('local')) {
          Mypoint();
          $("#mapPage").removeClass('show');
        }
    });
    // HTML5 地理位置定位
    function Mypoint(){
      console.log('sss');
     var data={};
     if(!navigator.geolocation){
         alert("不支持位置定位");
     }else {
        navigator.geolocation.getCurrentPosition(showPosition);
        $("#tips").show();
     }
    }

    function showMap(){
      $("#mapPage").addClass('show');
      var map, geolocation, marker;
      //加载地图
      map = new AMap.Map('mapContainer', {
          resizeEnable: true,
          zoom:18
      });
      map.plugin('AMap.Geolocation', function() {
          geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,//是否使用高精度定位，默认:true
              timeout: 10000,          //超过10秒后停止定位，默认：无穷大
              maximumAge: 0,           //定位结果缓存0毫秒，默认：0
              convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
              showButton: true,        //显示定位按钮，默认：true
              buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
              buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
              //- markerOptions: new AMap.Marker(),
              showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
              circleOptions: new AMap.Circle({radius:50}),
              panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
              zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          geolocation.getCurrentPosition();
          map.addControl(geolocation);
          // console.log(map.getCenter());
          AMap.event.addListener(geolocation, 'complete', onComplete);
          map.getCity(function(result){
            console.log(result);
          })
      });

      // map.on( 'dragstart', function(e) {
      //   //- addMarker();
      //   marker && marker.setMap(null);
      // });
      // map.on( 'dragend', function(e) {
      //   addMarker();
      // });
      // 实例化点标记
      // function addMarker() {
      //   marker = new AMap.Marker({
      //     icon: "http://webapi.amap.com/images/marker_sprite.png",
      //     position: map.getCenter()
      //   });
      //   marker.setMap(map);
      // }
    }

    //解析定位结果
    function onComplete(data) {
        // map.setZoom(18);
        // console.log(data);
    }

    // 根据地理坐标遍历填充地址选择器
    function showPosition(poi){
        var coords = poi.coords.longitude + ',' + poi.coords.latitude;
        service.getNowLocal(coords,function(flag,msg){
            var proName = msg.addressComponent.province,
                cityName = msg.addressComponent.city,
                districtName = msg.addressComponent.district,
                streetName = msg.addressComponent.township + msg.addressComponent.streetNumber.street,
                pid,cid,did;
            $("#tips").hide();
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

    function loadData(){
        var id = service.getSearch('id');
        service.serviceMyRecordDetail(id,function(flag,msg){
            if (flag) {
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
              $("#addImage").css('background-image','url('+ data.shop_url +')');
            }
        });
    }

    loadData();
    HybridJS.init(document.getElementById('addImage'));
});
