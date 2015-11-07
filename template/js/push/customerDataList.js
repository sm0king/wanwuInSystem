$(function(){

    // 下拉联动
    $("#depart").on('change',function(){
        var dpId = $(this).val();
        var data = {};
        data.dpId = dpId;
        service.getSubDepartmentList(data,function(flag,msg){
            if (flag) {
                // var re = msg.result[0],
                //     emList = re.result;
                // var employ ='<option value="0">所有人</option>';
                // for (var i = 0; i < emList.length; i++) {
                //     employ += '<option value="'+ emList[i].id +'">'+ emList[i].name +'</option>'
                // }
                var employ ='<option value="0">所有人</option>';
                for (var i = 0; i < msg.result.length; i++) {
                    var re = msg.result[i],
                        emList = re.result;
                    for (var i = 0; i < emList.length; i++) {
                        employ += '<option value="'+ emList[i].id +'">'+ emList[i].name +'</option>'
                    }
                }
                $('#employ').html(employ);
            }
        });
    });

    // 排序
    $(".sort-item a").on('click',function(){
        var dpId = $("#depart").val(),
            taskId = $("#employ").val(),
            sort = $(this).data('sort'),
            field = $(this).data('field');
        location.href = '/newosadmin/customer/getCustomerData?dpId='+ dpId +'&taskId='+ taskId +'&sort='+ sort +'&field='+field;
    });

    // 下拉筛选
    $("#searchSome").on('click',function(){
        var dpId= $("#depart").val() || "",
            taskId = $('#employ').val() || "";
            location.href = '/newosadmin/customer/getCustomerData?dpId='+ dpId +'&taskId=' + taskId;
    });

    // 搜索框
    $("#search").on('keyup',function(e){
        var k = e.keyCode || e.which;
        if(k == 13){
          var w = service.strCheck($(this).val());
          var url = "/newosadmin/customer/getCustomerData?keyword=" + w;
          back.go(url);
        }
    });

    //实例化地图
    var map = new AMap.Map('mapContainer', {
        resizeEnable: true,
        zoom:9
    });

    $("#customerData").on("click",'.point',function(){
        showMap();
    });

    // 取消地图
    $("#mapPage").on('click','#cancel',function(){
        map.clearMap();
        $("#mapPage").removeClass('show');
    })

    // 加载地图
    function showMap(){
        var data = {};
        data.dpId = $("#depart").val();
        data.taskId = $("#employ").val();
        service.getCustomerLocation(data,function(flag,msg){
            if (flag) {
                addMarker(msg);
            }else{
                alert("请求不到数据！");
            }
        })
    }

    // 实例化点标记
    function addMarker(allPoi) {
        var infoWindow = new AMap.InfoWindow({
            size: new AMap.Size(300, 0),
            autoMove: true,
            offset: {x: 0, y: -20}
        });

        for (var i = 0; i < allPoi.length; i++) {
            var item =  [allPoi[i].location.longitude,allPoi[i].location.latitude];
            var markerPoi = new AMap.Marker({
                position: item,
                icon: "/diguaApp/images/map-today.png",
                extData : {'id':allPoi[i].id,'name':allPoi[i].shop_name}
            });
            markerPoi.setMap(map);
            markerPoi.on( "click", function(e) {
                var thisData = this.Rd.extData;
                var inforWindow = new AMap.InfoWindow({
                     autoMove: true,
                     content: "<a href='/newosadmin/customer/visitShopDetail?shopId="+ thisData.id +"&isAdmin=1'>"+ thisData.name +"</a>"
                 });
                inforWindow.open(map, [e.lnglat.lng, e.lnglat.lat]);
            });
        }
        $("#mapPage").addClass('show');
    }



    function load(){
        var val_dpId = service.getSearch('dpId') || "0",
            val_taskId = service.getSearch('taskId') || "0";
        service.getSubDepartmentList({},function(flag,msg){
            if (flag) {
                if (msg.result.length) {
                    var depart = '<option value="0">所有部门</option>',employ='<option value="0">所有人</option>';
                    for (var i = 0; i < msg.result.length; i++) {
                        depart += '<option value="'+ msg.result[i].dp_id +'">'+ msg.result[i].dp_name +'</option>'
                    }
                    $("#depart").html(depart).val(val_dpId);

                    var data = {};
                    data.dpId = val_dpId;
                    service.getSubDepartmentList(data,function(flag,msg){
                        if (flag) {
                            var employ ='<option value="0">所有人</option>';
                            for (var i = 0; i < msg.result.length; i++) {
                                var re = msg.result[i],
                                    emList = re.result;
                                for (var i = 0; i < emList.length; i++) {
                                    employ += '<option value="'+ emList[i].id +'">'+ emList[i].name +'</option>'
                                }
                            }
                            $('#employ').html(employ).val(val_taskId);
                        }
                    });
                }else {
                    $("#screenBox").remove();
                }
            }
        });
    }
    load();
})
