(function(win,$){
  win.utils = {
    // 高德地图
    Geo : function(latitude,longitude,callback){
      $.ajax({
        url: 'http://webapi.amap.com/maps?v=1.3',
        type: 'GET',
        // dataType: 'json',
        data: {key: '8760360d4d0f0a29553680c42977a909'}
      })
      .done(function(result) {
        console.log(result);
        callback(result);
      })
      .fail(function() {
        console.log("error");
      });
    }
  }
})(window,jQuery);
