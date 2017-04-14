// 引入express
var express = require('express');
// bodyParser用于解析客户端请求的body中的内容,内部使用JSON编码处理,url编码处理以及对于文件的上传处理.
var bodyParser = require('body-parser');
// 路径解析，得到规范化的路径格式
var path = require('path');
// Mongoose是在node.js异步环境下对mongodb进行便捷操作的对象模型工具
var mongoose = require('mongoose');
// 引入underscore库
var _ = require('underscore');
// 引入mongoose定义整合后的模型文件
var Movie = require('./models/movie');
// 环境变量，默认为3000，可通过PORT=4000 node app.js运行
var port = process.env.PORT || 3000;
// 赋值express函数
var app = express();

// 连接到mongo里的imooc数据库
mongoose.connect('mongodb://localhost/imooc');

// 设置视图文件的根目录
app.set('views', './views/pages');
// 设置视图模板引擎jade
app.set('view engine', 'jade');
// 使用node里的JSON编码处理函数
app.use(bodyParser());
// 定义静态资源引用的根路径
app.use(express.static(path.join(__dirname, 'public')));
// 由于模板语法中会用到moment工具库，这边需要声明
app.locals.moment = require('moment');
// 监听所定义的端口
app.listen(port);

// node控制台里输出log
console.log('imooc started on port ' + port);

// index 首页
app.get('/', function(req, res) {
    // 在Movie里定义的fetch方法，获取所有条目数据
    Movie.fetch(function(err, movies) {
        // 有错误就输出log
        if (err) {
            console.log(err);
        }
        // 没有错误渲染首页index.jade内容，并赋值movies值
        res.render('index', {
            title: 'imooc 首页',
            movies: movies
        })
    })
})

// detail 详情页
app.get('/movie/:id', function(req, res) {
    // 获取路由中带的id值
    var id = req.params.id;

    // 由id值去数据库中查找该id所在条目的记录，然后渲染detail.jade页面，并赋值movies值
    Movie.findById(id, function(err, movie) {
        res.render('detail', {
            title: 'imooc ' + movie.title,
            movie: movie
        })
    })
})

// admin 后台录入页
app.get('/admin/movie', function(req, res) {
    // 渲染admin.jade页面，并将表单数据默认置为空
    res.render('admin', {
        title: 'imooc 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
})

// admin 后台更新页
app.get('/admin/update/:id', function(req, res) {
    // 获取路由中带的id值
    var id = req.params.id;

    // 如果id存在就是更新数据
    if(id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: 'imooc 后台更新页面',
                movie: movie
            })
        })
    }
})

// admin 表单提交处理
app.post('/admin/movie/new', function(req, res) {
    // 获取url所带？后的参数id
    var id = req.body.movie._id;
    // 获取名为movie的表单里生成的json
    var movieObj = req.body.movie;
    var _movie;

    // 先执行如果已存在该电影，后执行创建新记录
    if (id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }

            // underscore库里可以让后者替换前者
            _movie = _.extend(movie, movieObj)

            // 保存到数据库中，保存成功后重定向到id所在详情页
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/movie/' + movie._id)
            })
        })
    }
    else {
        // 按mongoose的模型创建新条目
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })
        // 保存到数据库中，重定向到id所在详情页
        _movie.save(function(err, movie) {
            if(err){
                console.log(err)
            }
            res.redirect('/movie/' + movie._id)
        })
    }
})

// list 后台列表页
app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        })
    })
})

// list 后台删除请求地址
app.delete('/admin/list', function(req, res) {
    // 获取url后？所带参数id
    var id = req.query.id;

    if(id) {
        // 删除操作，完成后返回json
        Movie.remove({_id: id}, function(err, movie) {
            if(err) {
                console.log(err);
            }
            else {
                res.json({success: 1});
            }
        })
    }
})