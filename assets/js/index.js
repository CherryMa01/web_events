$(function() {
    // alert(123)
    getUserInfo();
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
        // alert(123);
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1. 退出登录需要清空本地存储中的 token（登录的时候保存了token）
            localStorage.removeItem('token')
                // 2. 重新跳转到登录页面
            location.href = '/login.html'
                // 关闭 confirm 询问框
            layer.close(index);
        })
    })

});
//封装获取用户信息的函数
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        //配置请求头信息，这个可以在baseAPI里面统一设置，就不用重复操作了
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.code !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //渲染页面
            renderAvatar(res.data);
        },
        //ajax发起请求，回调函数有三个：1.success(成功时调用);
        // 2.error(成功时调用);3.complete(无论成功失败都会调用)
        // complete: function(res) {
        //     // console.log(123);
        //     // console.log(res);
        //     if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1. 退出登录需要清空本地存储中的 token（登录的时候保存了token）
        //         localStorage.removeItem('token')
        //             // 2. 重新跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
};

function renderAvatar(user) {
    //获取用户名
    var name = user.nickname || user.username;
    //根据获取的内容设置欢迎文本
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name)
        //按需渲染头像
        //1.渲染图片头像（有图片头像的情况下）
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //2.渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase(); //用户名或者昵称的第一个大写字母
        $('.text-avatar').html(first).show();
    }
}