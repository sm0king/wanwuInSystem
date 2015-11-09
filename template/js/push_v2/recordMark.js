$(function(){
    service.getH5Local(function(poi){
        var data = poi.longitude+','+poi.latitude
        service.getNowLocal(data,function(flag,msg){
            if (flag) {
                $("#poiInfo").html(msg.formatted_address);
                $("#poiInput").val(msg.formatted_address);
            }
        })
    });
})
