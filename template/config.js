requirejs.config({
    baseUrl: '../plugs',
    paths: {
        'jquery': 'jquery/jquery',
        "service":"../script/service",
        "back":"../script/back",
        "md5":"md5"
    },
    shim: {
        "jquery": {
            exports: "$"
        },
        "md5":{
            exports:"md5"
        }
    }
});