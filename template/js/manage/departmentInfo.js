$(function(){
    function load(argument) {
      // body...
        var id = service.getSearch('id');
        service.departmentDetail(id,function(flag,msg){
            console.log(msg);
            console.log(flag);
        })
    }

    load();
});
