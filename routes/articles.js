var express = require('express');
var auth = require('../auth');
var markdown = require('markdown').markdown;
var path = require('path');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage })
//返回一个路由的实例
var router = express.Router();
router.get('/list/:pageNum/:pageSize',auth.mustLogin, function(req, res, next) {
    var pageNum = parseInt(req.params.pageNum);
    var pageSize = parseInt(req.params.pageSize);
    var query = {};
    if(req.query.keyword){
        req.session.keyword = req.query.keyword;
        query['title'] = new RegExp(req.query.keyword,'i');
    }
    Model('Article').count(query,function(err,count){
        Model('Article').find(query).skip((pageNum-1)*pageSize).limit(pageSize).sort({createAt:-1}).populate('user').exec(function(err,articles){
            articles.forEach(function (article) {
                article.content = markdown.toHTML(article.content);
            });
            res.render('index',{
                articles:articles,
                keyword:req.query.keyword,
                pageNum:pageNum,
                pageSize:pageSize,
                totalPage:Math.ceil(count/pageSize)
            });
        });
    });

});

//添加文章
router.get('/add',auth.mustLogin, function(req, res, next) {
    res.render('article/add',{article:{}});
});
router.post('/add',auth.mustLogin,upload.single('img'), function(req, res, next) {
    var article = req.body;
    var _id = req.body._id;
    if(req.file){
        article.img = path.join('/uploads',req.file.filename);
    }
    if(_id){//修改
        var update = {
            title:article.title,content:article.content
        }
        if(article.img){
            update.img = article.img;
        }
        Model('Article').findByIdAndUpdate(_id,{$set:update},function(err,doc){
            if(err){
                console.error(err);
                req.flash('error','更新文章失败');
                return res.redirect('back');//回退到上一个页面
            }else{
                res.redirect('/articles/detail/'+_id);
            }
        })
    }else{
        var user = req.session.user;
        article.user = user._id;
        delete article._id;
        new Model('Article')(article).save(function(err,article){
            if(err){
                req.flash('error','文章发表失败');
                return res.redirect('back');//回退到上一个页面
            }else{
                req.flash('success','文章发表成功');
                res.redirect('/');
            }
        })
    }

});
router.get('/detail/:_id', function(req, res, next) {
    var _id = req.params._id;
    Model('Article').findById(_id,function(err,article){
        if(err && !article){
            req.flash('error','文章不存在');
            return res.redirect('back');//回退到上一个页面
        }else{
            article.content = markdown.toHTML(article.content);
            res.render('article/detail',{article:article});
        }

    })
});
router.get('/edit/:_id', function(req, res, next) {
    var _id = req.params._id;
    Model('Article').findById(_id,function(err,article){
        if(err && !article){
            req.flash('error','文章不存在');
            return res.redirect('back');//回退到上一个页面
        }else{
            res.render('article/add',{article:article});
        }

    })
});

router.get('/delete/:_id', function(req, res, next) {
    var _id = req.params._id;
    Model('Article').findByIdAndRemove(_id,function(err,result){
        if(err ){
            req.flash('error','删除文章失败');
            return res.redirect('back');//回退到上一个页面
        }else{
            res.redirect('/');
        }
    })
});
module.exports = router;