$(function(){
  $("#sign-out").on('click',function(){
      window.localStorage.removeItem('userInfo');
      window.location.href = '/diguaApp/index.html';
  })
})
