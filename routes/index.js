var express = require('express');
var markdown = require('markdown').markdown;
//返回一个路由的实例
var router = express.Router();


router.get('/', function(req, res, next) {
  res.redirect('/articles/list/1/2');
});
module.exports = router;
