$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    });
    initUserInfo();
    //封装函数 initUserInfo初始化用户信息
    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                form.val('formUserInfo', res.data);
            }
        })
    };
    //点击重置表单，先阻止默认提交行为，然后在更新表单信息
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    });
    //修改用户信息，给表单天添加监听事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'put',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('修改用户信息失败')
                }
                layer.msg('修改用户信息成功')
                    //user.info相当于index页面来说是子页面，
                    // 调用父页面得到函数采用window.parent.方法
                window.parent.getUserInfo();
            }
        })
    })

})