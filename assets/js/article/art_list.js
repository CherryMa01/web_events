$(function() {
    var layer = layui.layer;
    var form = layui.form;
    //渲染分页需要调用的函数
    var laypage = layui.laypage;
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
            pagenum: 1, // 页码值，默认请求第一页的数据
            pagesize: 2, // 每页显示几条数据，默认每页显示2条
            cate_id: '', // 文章分类的 Id
            state: '' // 文章的发布状态
        }
        // 调用获取列表区域的函数
    initTable();
    //调用分类下拉框函数
    initCate()
        //定义时间过滤器
    template.defaults.imports.dateFormat = function(date) {
        var dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var h = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var s = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
    };
    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //封装获取列表区域的函数
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var strhtml = template('tpl-table', res)
                $('tbody').html(strhtml);
                //获取完列表之后执行函数渲染分页
                renderPage(res.total);
            }
        })
    };
    //封装函数发请求获取【分类下拉框的选项】
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/cate/list',
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('获取分类信息失败')
                }
                //调用模板引擎函数
                var strhtml = template('tpl-cate', res)
                $('[name=cate_id]').html(strhtml);
                //虽然通过模板引擎渲染页面，但是layui表单接收不到这个信息，所以需要调用form.render()
                form.render()
            }
        })
    };
    //为筛选表单绑定提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取筛选条件的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //为查询参数对象中的Q重新赋值
        q.cate_id = cate_id;
        q.state = state;
        // 调用获取列表区域的函数
        initTable();
    });
    //渲染分页区域
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            //设置分页区域的其他实现效果
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                // console.log(obj.curr);
                //当发生页面切换（点击页码的时候），将最新的页码赋值到查询参数q的pagenum中
                q.pagenum = obj.curr;
                //当切换每条显示数据时，将最新的条目数赋值给查询参数q的pagesize
                q.pagesize = obj.limit;
                if (!first) {
                    // 调用获取列表区域的函数
                    initTable();
                }
            }
        })
    }
    //删除按钮功能实现
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length;
        // console.log(123);
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'delete',
                url: '/my/article/info?id=' + id,
                success: function(res) {
                    if (res.code !== 0) {
                        return layer.msg('删除信息失败')
                    }
                    layer.msg('删除信息成功');
                    layer.close(index);
                    //注意点：bug:如果我们将当前的页面删除完了之后，页码虽然会有更新，但是跳转到的相应页面并没有更新文章内容,所以需要进行判断
                    //1.如果点击删除，当前删除个数不等于1，意思是还有数据，那么页码值不变化，、
                    // 2.如果删除按钮的个数等于1，说明删除成功之后页面就没有数据了，此时页码值需要减1；
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })
        })
    })
})