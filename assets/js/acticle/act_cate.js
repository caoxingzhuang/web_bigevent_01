$(function () {
    initArtCateList();

    // 初始化文章分类

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {

                if (res.status !== 0) {
                    return layui.layer.msg('获取文章失败')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    var layer = layui.layer;
    var indexAdd = null;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            // 弹出层样式
            type: 1,
            // 高宽
            area: ['500px', '250px'],
            // 标题
            title: '添加文章分类',
            // 内容
            content: $('#dialog-add').html(),
        });
    })

    // 添加文章分类
    $('body').on('submit', '#form-add', function (e) {

        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('添加文章成功');
                initArtCateList();
                //关闭弹出层
                layer.close(indexAdd);
            }
        })
    })

    var indexEdit = null;
    // 编辑功能
    // var editAdd = null;
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            // 弹出层样式
            type: 1,
            // 高宽
            area: ['500px', '250px'],
            // 标题
            title: '修改文章分类',
            // 内容
            content: $('#dialog-edit').html(),
        });

        // 获取id  发送ajax获取数据  渲染到页面

        var Id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                layui.form.val('form-edit', res.data);
            }
        })
    });


    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg('修改文章成功');
                //关闭弹出层
                layer.close(indexEdit);
                console.log(indexEdit);
            }
        })
    })

    // 删除

    $('tbody').on('click', '#btn-delete', function () {
        var id = $(this).attr('data-id');

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('删除成功');
                    initArtCateList();
                    layer.close(index);
                }
            })


        });
    })

})