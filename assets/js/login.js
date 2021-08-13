$(function() {
    //登录，注册页面的显示与隐藏
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    });
    //自定义表单密码框的验证
    var form = layui.form;
    //注册结果显示，想要使用layui的方法必须先获取
    var layer = layui.layer;
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });
    //注册页面时发起ajax请求
    $("#form_reg").on('submit', function(e) {
        e.preventDefault();
        // console.log(123);
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
            repassword: $('#form_reg [name=repassword]').val(),
        };
        // console.log(data);
        $.post('/api/reg', data, function(res) {
            // console.log(res);
            //res.code不为0，注册失败，弹出信息
            if (res.code !== 0) {
                return layer.msg(res.message)
            }
            //注册成功，弹出信息
            layer.msg('注册成功，请登录');
            //注册成功之后直接将利用注册按钮跳转到登录页面
            $('#link_login').click();
        })
    });
    //登录页面发起post请求
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功');
                //登录成功之后需要将res返回的 token 属性值保存，后续访问需要权限的缺口需要使用
                localStorage.setItem('token', res.token);
                location.href = '/index.html'
            }

        })
    })
})