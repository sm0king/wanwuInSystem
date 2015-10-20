$(function(){

    //实例化地图
    var map = new AMap.Map('mapContainer', {
        resizeEnable: true,
        zoom:9
    });

    $('#record-list').on('click','.record-item',function(){
        if ($(this).data('id')) {
            var url = './recordEdit.html?id='+$(this).data('id');
            back.go(url);
        }
    });

    $("#record-list").on("click",'.point',function(){
        showMap();
    });

    // 取消地图
    $("#mapPage").on('click','#cancel',function(){
        map.clearMap();
        $("#mapPage").removeClass('show');
    })

    // 加载地图
    function showMap(){
        $("#mapPage").addClass('show');
        addMarker();
    }

    // 实例化点标记
    function addMarker() {

        var todayMaker=[],lastMaker=[],allPoi,todayPoi,lastPoi;

        allPoi = $("#record-list").data('localArr');
        todayPoi = allPoi.today;
        lastPoi = allPoi.last;

        var infoWindow = new AMap.InfoWindow({
            size: new AMap.Size(300, 0),
            autoMove: true,
            offset: {x: 0, y: -20}
        });
        for (var i = 0; i < todayPoi.length; i++) {
            var todayItem =  [todayPoi[i].longitude,todayPoi[i].latitude];
            var markertoday = new AMap.Marker({
                position: todayItem,
                icon: "http://webapi.amap.com/images/marker_sprite.png",
                offset: {
                   x: -8,
                   y: -34
                },
                extData : {'id':todayPoi[i].id,'name':todayPoi[i].name}
            });
            markertoday.setMap(map);
        //    todayMaker.push(markertoday);
            markertoday.on( "click", function(e) {
                var thisData = this.Rd.extData;
                var inforWindow = new AMap.InfoWindow({
                     autoMove: true,
                     content: "<a href='./recordEdit.html?id="+ thisData.id +"'>"+ thisData.name +"</a>"
                 });
                inforWindow.open(map, [e.lnglat.lng, e.lnglat.lat]);
            });
        }

        // console.log(lastPoi);
        for (var j = 0; j < lastPoi.length; j++) {
            lastItem = [lastPoi[j].longitude,lastPoi[j].latitude];
            var markerlast = new AMap.Marker({
                position: lastItem,
                icon: "http://webapi.amap.com/images/3.png",
                offset: {
                   x: -8,
                   y: -34
                },
                extData : {'id':lastPoi[j].id,'name':lastPoi[j].name}
            });
            markerlast.setMap(map);
            markerlast.on( "click", function(e) {
                var thisData = this.Rd.extData;
                var inforWindow = new AMap.InfoWindow({
                     autoMove: true,
                     content: "<a href='./recordEdit.html?id="+ thisData.id +"'>"+ thisData.name +"</a>"
                 });
                inforWindow.open(map, [e.lnglat.lng, e.lnglat.lat]);
            });

            // lastMaker.push(markerlast);
        }
        // addCluster(todayMaker,0);
        // addCluster(lastMaker,1);
    }


    // 添加点聚合
    function addCluster(arr,tag) {
      if (tag == 1) {
        var sts = [{
          url: "http://developer.amap.com/wp-content/uploads/2014/06/1.png",
          size: new AMap.Size(32, 32),
          offset: new AMap.Pixel(-16, -30)
        }, {
          url: "http://developer.amap.com/wp-content/uploads/2014/06/2.png",
          size: new AMap.Size(32, 32),
          offset: new AMap.Pixel(-16, -30)
        }, {
          url: "http://developer.amap.com/wp-content/uploads/2014/06/3.png",
          size: new AMap.Size(48, 48),
          offset: new AMap.Pixel(-24, -45),
          textColor: '#CC0066'
        }];
        map.plugin(["AMap.MarkerClusterer"], function () {
          cluster = new AMap.MarkerClusterer(map, arr, {
            styles: sts
          });
        });
      } else {
        map.plugin(["AMap.MarkerClusterer"], function () {
          cluster = new AMap.MarkerClusterer(map, arr);
        });
      }
      var newCenter = map.setFitView();
    }

    $("#search").on('keyup',function(e){
        var k = e.keyCode || e.which;
        if(k == 13){
          var w = service.strCheck($(this).val());
          var url = "./recordSearch.html?key=" + w;
          back.go(url);
        }
    });

   function madeDom(data){
      var list = "",
          top = "",
          dom = "",
          title,
          img,
          date,
          time,
          localArr = {},
          todayLocal = [],
          lastLocal = [];
      for (var i = 0; i < data.length; i++) {

        if (i === 0) {
            title = '今天';
        }else if (i === 1) {
            title = '以前';
        }
        top = '<div class="list-date bg-warning"><span>'+title+'('+ data[i].totalCount +')</span><i class="glyphicon glyphicon-map-marker point text-right"></i></div>';

        if (data[i].totalCount === 0) {
            list = '<li class="list-group-item">'+
                    '暂无数据</li>';
        }else {
            list = "";
            for (var j = 0; j < data[i].result.length; j++) {
                img = data[i].result[j].shop_url ? data[i].result[j].shop_url : '/diguaApp/images/tuwen.png';
                time = data[i].result[j].update_time ? data[i].result[j].update_time : data[i].result[j].add_time;
                list += '<li class="list-group-item record-item" data-id="'+ data[i].result[j].id +'">'+
                        '<div class="media">'+
                        '<div class="media-left meida-middle">'+
                        '<img src="'+img+'" style="max-height:80px"></div>'+
                        '<div class="media-body">'+
                        '<div>'+data[i].result[j].shop_name+'</div>'+
                        '<div>'+data[i].result[j].phone+'</div>'+
                        '<div>'+data[i].result[j].address+'</div>'+
                        '<div>'+time+'</div></div></li>';
                if (data[i].result[j].location) {
                    var local = eval('('+ data[i].result[j].location +')');
                    if (local.longitude && local.latitude) {
                        local.id = data[i].result[j].id;
                        local.name = data[i].result[j].shop_name;
                        if (i === 0) {
                            todayLocal.push(local);
                        }else {
                            lastLocal.push(local);
                        }
                    }
                }
          }

          list = '<ul class="list-group">' + list + '</ul>';
        }
        dom += top + list ;
      }

        localArr  = {
            today : todayLocal,
            last : lastLocal
        }
        $('#record-list').html(dom).data('localArr',localArr);
   }

   function load(){
     service.serviceMyRecord("",1,10,function(flag,msg){
        if (flag) {
          var dom = madeDom(msg);
          $("#record-list").html(dom);
        }
     });
   }

   load();
});
