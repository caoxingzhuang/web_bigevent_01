$(function () {
    getUserInfo();

    // 退出功能
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('token');
            location.href = 'login.html';
            layer.close(index);
        });
    })
})
// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 请求成功  渲染用户头像信息
            renderAvatar(res.data);
        },
        // 么有登录禁止访问后台页面
        // complete: function (res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token');
        //         location.href = 'login.html';
        //     }
        // }

    })
};
// 渲染用户
function renderAvatar(user) {
    // 用户名
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp' + name);
    // 渲染头像
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.user-avatar').hide();

    } else {
        // 没有头像
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.user-avatar').show().html(text);

    }
}