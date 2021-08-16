$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/cate/list',
            success: function(res) {
                console.log(res);
                //利用模板引擎快速渲染页面
                var strhtml = template('tpl-table', res);
                $('tbody').html(strhtml)
            }
        })
    };

    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        //打开弹出层会返回一个index值，用index值可以实现当添加完成之后关闭弹出层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            //不直接渲染，在html中用script渲染弹出层的页面
            content: $('#dialog-add').html()
        })
    });
    //通过事件委托发起【添加分类】弹出框的提交事件，在这里事件绑定给body
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        //发起请求添加文章；
        $.ajax({
            method: 'post',
            url: '/my/cate/add',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg('添加图书失败')
                }
                //渲染页面
                initArtCateList();
                //成功之后弹出提示
                layer.msg('添加文章成功')
                layer.close(indexAdd)
            }
        })
    });
    //点击修改按钮弹出弹出层
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        // alert(123)
        //打开弹出层会返回一个index值，用index值可以实现当添加完成之后关闭弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            //不直接渲染，在html中用script渲染弹出层的页面
            content: $('#dialog-edit').html()
        });
        //点开之后这个弹出框显示该条文章的信息
        var id = $(this).attr('data-id');
        // console.log(id);
        $.ajax({
            method: 'get',
            url: '/my/cate/info?id=' + id,
            success: function(res) {
                console.log(res);
                form.val('form-edit', res.data)
            }
        })
    });


    //通过事件委托发起【修改】弹出框的提交事件，在这里事件绑定给tbody
    // $('tbody').on('submit', '#form-edit', function(e) {
    //     e.preventDefault();

    // })

})