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
        service.serviceGetLocation("",function(flag,msg){
            if (flag) {
                addMarker(msg);
            }else{
                alert("请求不到数据！");
            }
        })
    }

    // 实例化点标记
    function addMarker(allPoi) {

        var todayMaker=[],lastMaker=[],allPoi,todayPoi,lastPoi;

        todayPoi = allPoi.todayLists;
        lastPoi = allPoi.beforeLists;

        var infoWindow = new AMap.InfoWindow({
            size: new AMap.Size(300, 0),
            autoMove: true,
            offset: {x: 0, y: -20}
        });
        for (var i = 0; i < todayPoi.length; i++) {
            var todayItem =  [todayPoi[i].location.longitude,todayPoi[i].location.latitude];
            var markertoday = new AMap.Marker({
                position: todayItem,
                icon: "/diguaApp/images/map-today.png",
                offset: {
                   x: -8,
                   y: -34
                },
                extData : {'id':todayPoi[i].id,'name':todayPoi[i].shop_name}
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

        for (var j = 0; j < lastPoi.length; j++) {
            lastItem = [lastPoi[j].location.longitude,lastPoi[j].location.latitude];
            var markerlast = new AMap.Marker({
                position: lastItem,
                icon: "/diguaApp/images/map-before.png",
                offset: {
                   x: -8,
                   y: -34
                },
                extData : {'id':lastPoi[j].id,'name':lastPoi[j].shop_name}
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
        $("#mapPage").addClass('show');
    }


    // 添加点聚合【暂时不用】
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

    $(window).scroll(function(){
        loadOther();
    });

    function loadOther(){
        var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
        if ($(document).height() <= totalheight) {
            if ($("#load") && $("#load").data('status') == '0') {
                var page  =  parseInt($("#record-list").data('page')) + 1;
                    $("#load").data('status','1');
                    load(page);
            }
        }
    }

    $("#record-list").on('click','#load',function(){
        loadOther();
    })

   function madeDom(data){
        var list = "",
            top = "",
            dom = "",
            title,
            img,
            date,
            time;

        if (data.totalCount === 0) {
            list = '<li class="list-group-item">暂无数据</li>';
        }else {
            if (data.PageNumber == 1) {
                top = '<div class="list-date bg-warning"><span>拜访列表('+ data.totalCount +')</span><i class="glyphicon glyphicon-map-marker point text-right"></i></div>';
            }else {
                top = "";
            }
            for (var i = 0; i < data.result.length; i++) {
                img = data.result[i].shop_url ? data.result[i].shop_url : '/diguaApp/images/tuwen.png';
                time = data.result[i].update_time ? data.result[i].update_time : data.result[i].add_time;
                list += '<li class="list-group-item record-item" data-id="'+ data.result[i].id +'">'+
                        '<div class="media">'+
                        '<div class="media-left meida-middle">'+
                        '<img src="'+img+'" style="max-height:80px"></div>'+
                        '<div class="media-body">'+
                        '<div>'+data.result[i].shop_name+'</div>'+
                        '<div>'+data.result[i].phone+'</div>'+
                        '<div>'+data.result[i].address+'</div>'+
                        '<div>'+time+'</div></div></li>';
            }
            dom = top + '<ul class="list-group">' + list + '</ul>';
            return dom;
        }
   }

   function load(page,pageSize){
     var data = {
       PageNumber: page || 1,
       PageSize: pageSize || 10,
     }
     service.serviceMyRecord(data,function(flag,msg){
        if (flag) {
          $("#load").remove();
          var dom = madeDom(msg);
          var totalPage = Math.ceil(parseInt(msg.totalCount)/parseInt(msg.PageSize));
          if(msg.PageNumber < totalPage){
              dom  = dom + '<li id="load" class="loading list-group-item text-center show">加载更多...</li>';
              $("#record-list").append(dom).data('page',data.PageNumber);
              $("#load").data('status','0');
          }else if(msg.PageNumber == totalPage){
              $("#record-list").append(dom);
          }
        }
     });
   }

   load();
});
