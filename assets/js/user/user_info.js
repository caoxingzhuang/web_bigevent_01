$(function () {
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度1-6位之间";
            }
        }
    });

    initUserInfo();
    var layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 

                form.val('formUserInfo', res.data);
            }
        })
    }
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    //提交修改信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败！');
                }
                layer.msg('用户信息修改成功！');
                window.parent.getUserInfo();
            }
        })
    })
})