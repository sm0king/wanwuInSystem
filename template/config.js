requirejs.config({
    baseUrl: '../plugs',
    paths: {
        'jquery': 'jquery/jquery',
        "service":"../script/service",
        "back":"../script/back"
    },
    shim: {
        "jquery": {
            exports: "$"
        }
    }
});