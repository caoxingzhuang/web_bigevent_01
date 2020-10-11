$(function () {

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    initEditor();
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

    // 选择上传图片
    $('#btnImage').on('click', function () {
        $('#file').click();
    });

    $('#file').on('change', function (e) {
        // console.log(e.target.files);
        var file = e.target.files[0];
        if (file.length === 0) {
            return layer.msg('请选择用户头像！')
        }
        // 选择成功 修改图片
        // 1. 拿到用户选择的文件
        // var file = e.target.files[0];
        // 2. 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 3. 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    });

    // 设置状态 
    var state = '已发布';

    // $('#btnsave1').on('click', function () {
    //     state = '已发布';

    // })

    $('#btnSave2').on('click', function () {
        state = '草稿';

    })


    // 发表文章   监听事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 创建对象  收集数据
        var fd = new FormData(this);

        fd.append('state', state);

        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);

                pubLishArticle(fd);
            })
    });

    function pubLishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('文章提交成功 跳转中...');
                // 跳转页面  去除bug
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 1500)
            }
        })
    }
})