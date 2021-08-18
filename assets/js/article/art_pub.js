$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor()
        //封装函数初始化分类下拉框
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/cate/list',
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg('获取分类列表失败')
                }
                var strhtml = template('tpl-cate', res)
                $('[name=cate_id]').html(strhtml)
                    // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')
        // 2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options);
    //点击选择封面，触发事件处理函数
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click();
        })
        //监听文件选择框的change事件（将用户选择的图片设置为裁剪区域的图片）
    $('#coverFile').on('change', function(e) {
        var file = e.target.files[0]
        console.log(file);
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
            // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 定义文章的发布状态：
    var art_state = null;
    //当我们点击草稿的时候
    $('#btnSave').on('click', function() {
        art_state = '草稿';
    })
    $('#btnPublish').on('click', function() {
            art_state = '已发布';
        })
        //1.注册表单的提交事件（在这里发布和重置按钮都可以提交）
    $('#form-pub').on('submit', function(e) {
            //2.阻止默认行为
            e.preventDefault();
            // 3. 基于 form 表单，快速创建一个 FormData 对象（里面有三个提交需要的数据 title,cate_id,content）
            var fd = new FormData($(this)[0])
                // console.log(fd); //打印不出来，需要循环
                // 4. 将文章的发布状态，存到 fd 中（追加一个数据 state）
            fd.append('state', art_state)
                //用来查看fd里面储存的数据
                // fd.forEach(function(k, v) {
                //     console.log(v, k);
                // })
                // 将封面裁剪过后的图片，输出为一个文件对象（cover_img）
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    // 5. 将文件对象，存储到 fd 中
                    fd.append('cover_img', blob);
                    //调用函数
                    publishArticle(fd);
                });
        })
        //6.发起发布文章的ajax请求   
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('文章发布失败')
                }
                layer.msg('文章发布成功');
                location.href = '/article/art_list.html'
            }
        })
    }
})