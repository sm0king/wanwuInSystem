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
            local: $("#point").data('nowpoi')
        };
        if (checkData(data)) {
            service.serviceSaveMyRecord(data,function(flag,msg){
                if (flag) {
                    alert("保存成功");
                    history.go(-1);
                }else {
                    alert(msg);
                }
            });
        }
    }

    function checkData(data){
        if (!data.shopName) {
            alert("请填写超市名称");
            return false;
        }else if(!data.local){
            alert("当前无法定位，添加地址失败");
            return false;
        }else if(data.phone != ""){
            var tel = data.phone;
            var flag = !!tel.match(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
            if (!flag) {
                alert("请填写真实联系电话，如没有请留空!");
                return false;
            }
        }
        return true;
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
         zoom:16
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
       var geolocation, marker;
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
               showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
               panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
               zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
           });
           geolocation.getCurrentPosition(); // 获取当前位置信息
           map.addControl(geolocation);
           AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
           // 地图拖拽前触发
           // map.on( 'dragstart', function(e) {
           // });
       });
     }

     //解析定位结果
     function onComplete(data) {
         var poi = [data.position.lng,data.position.lat];
         geocoder();
         var circle = new AMap.Circle({
                 center: new AMap.LngLat(data.position.lng, data.position.lat), // 当前位置作为圆心位置
                 radius: 300, //半径
                 strokeColor: "#666", //线颜色
                 strokeOpacity: 1, //线透明度
                 strokeWeight: 3, //线粗细度
                 fillColor: "#666", //填充颜色
                 fillOpacity: 0.35//填充透明度
             });
         circle.setMap(map);

         // 地图缓动后触发
         map.on('moveend', function(e) {
             // 逆地理编码
             var lnglat = map.getCenter();
             var lnglatXY = [lnglat.lng,lnglat.lat];
             var flag = circle.contains(lnglatXY);
             if(!flag){
               $("#addrInfo").html("<span class='txt-red'>请在圆圈范围内选择！</span>").data('local',"");
               // alert("请在圆圈范围内选择！");

             }else {
               geocoder();
             }
         });
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
         var savePoi = {
             latitude: poi.coords.longitude,
             latitude: poi.coords.latitude
         }
         $("#point").data('nowpoi',savePoi);
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

    function location(callback){
    	var data={};
    	if(!navigator.geolocation){
    			alert("不支持位置定位");
    	}else {
    			navigator.geolocation.getCurrentPosition(function(pos){
              data = {
                latitude : pos.coords.latitude,
        				longitude : pos.coords.longitude,
              }
              callback(data);
    			});
    	}
    }

    function loadData(){
        loadPro(function(re){
          re = '<option>请选择</option>' + re;
          $("#provinces").html(re);
        });
        $("#city").hide();
        $('#district').hide();
        Mypoint();
    }
    loadData();
    HybridJS.init(document.getElementById('addImage'));
});
