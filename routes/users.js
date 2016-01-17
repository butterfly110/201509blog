var express = require('express');
//返回一个路由的实例
var router = express.Router();

router.use(function(req,res,next){
  console.log('user use');
  next();
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/hello', function(req, res, next) {
  res.setHeader('Content-Length','5');
  res.send('hello');
});

module.exports = router;
