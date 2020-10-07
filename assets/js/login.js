$(function () {
    $('#link-reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link-login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 自定义校验规则
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var pwd = $(".reg-box input[name=password]").val();
            if (value !== pwd) {
                return '两次输入密码不一致！';
            }
        }
    });

    // 发起post注册请求
    $('#form-reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form-reg [name=username]').val(),
                password: $('#form-reg [name=password]').val(),
            },
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录', { icon: 6 });
                $('#link-login').click();
            }
        })
    });
    // 登陆请求
    $('#form-login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登陆成功', { icon: 6 });
                //    保存token  未来的接口要使用token
                localStorage.setItem('token', res.token);
                // 跳转
                location.href = 'index.html';
            }
        })
    });
}) 