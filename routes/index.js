var express = require('express');
//返回一个路由的实例
var router = express.Router();


router.get('/', function(req, res, next) {
  Model('Article').find({}).populate('user').exec(function(err,articles){
    console.log(articles[0].user.avatar);
    res.render('index',{ title: '欢迎光临我的博客',articles:articles });
  });
});
module.exports = router;
