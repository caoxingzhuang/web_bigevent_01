// 开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net';
// 拦截所有ajax请求  处理参数
$.ajaxPrefilter(function (params) {
    params.url = baseURL + params.url;

    // 对需要权限的接口配置头信息
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 登陆拦截
    params.complete = function (res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = 'login.html';
        }
    }

})