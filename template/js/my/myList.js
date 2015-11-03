$(function(){
  $("#sign-out").on('click',function(){
      window.localStorage.removeItem('userInfo');
      window.location.href = '/diguaApp/index.html';
  });

  function load(){
    var code = service.getUserInfo()['code'];
    $('#recommend_code').html(code);
  }
  
  load();
})
