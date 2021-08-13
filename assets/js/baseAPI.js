$(function() {
    $.ajaxPrefilter(function(options) {
        // console.log(options);options就是传入的url参数
        options.url = 'http://www.liulongbin.top:3008' + options.url;

    })
})