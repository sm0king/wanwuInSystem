(function(win,$){
  win.utils = {
    // 高德地图
    Geo : function(latitude,longitude,callback){
      $.ajax({
        url: 'http://restapi.amap.com/v3/geocode/regeo?parameters',
        type: 'GET',
        dataType: 'json',
        data: {
          key: '8760360d4d0f0a29553680c42977a909',
          location: longitude+','+latitude,
          output: 'jsonp',
          callback: 'location'
        }
      })
      .done(function(result) {
        console.log(result);
        // callback(result);
      })
      .fail(function() {
        console.log("error");
      });
    }
  }
})(window,jQuery);


$(function(){
  $('.navbar-back').on('click touched',function(){
      if ($(this).data('control')) {
        if ($(this).data('control') == 1) {
            history.back(-1);
        }
      }else {
        history.go(-1);
      }
  });
});
