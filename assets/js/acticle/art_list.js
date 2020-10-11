$(function () {
    // 定义时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 补零
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的id
        state: '', //文章的状态
    }

    // 获取文章列表
    initTable();
    function initTable() {

        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }

                var htmlStr = template('tpl', res);
                $('tbody').html(htmlStr);
                // 渲染文章列表分页
                readerPage(res.total);
            }
        })
    }

    initCate();
    //  初始化分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                layui.form.render();
            }
        })
    }

    //筛选按钮
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 初始化文章列表
        initTable();
    })

    // 定义分页
    var laypage = layui.laypage;
    function readerPage(total) {
        laypage.render({
            elem: 'pageBox',  //注意，这里的 test1 是 ID，不用加 # 号
            count: total,  //数据总数，从服务端得到
            limit: q.pagesize, //每页几条
            curr: q.pagenum,  //第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 4, 6, 8],
            //触发jump: 分页初始化的时候，页码改变的时候
            jump: function (obj, first) {
                //obj：所有参数所在的对象 first：是否是第一次初始化分页
                // 改变当前页
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 判断，不是第一次初始化分页  才能重新调用初始化文章列表
                if (!first) {
                    // 初始化文章列表
                    initTable();
                }
            }
        });
    }

    //删除
    var layer = layui.layer;
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }

                    layer.msg('删除文章成功');

                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }

            })

            layer.close(index);
        });

    })
})