$(function () {
    var form = layui.form;
    // 密码校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        somepwd: function (value) {
            var v2 = $('[name=oldPwd]').val();
            if (value === v2) {
                return '新旧密码不能相同';
            }
        },
        repwd: function (value) {
            var v3 = $('[name=newPwd]').val();
            if (value !== v3) {
                return '两次输入密码不一致'
            }
        }
    });

    // 修改密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layer.msg('密码修改成功');
                $('.layui-form')[0].reset();
            }
        })
    })
})