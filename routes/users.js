var express = require('express');
var auth = require('../auth');
//返回一个路由的实例
var router = express.Router();

//用户注册
router.get('/reg',auth.mustNotLogin, function(req, res, next) {
  res.render('user/reg',{title:'用户注册'});
});

router.post('/reg',auth.mustNotLogin, function(req, res, next) {
  var user = req.body;
  if(user.password != user.repassword){
    req.flash('error','密码和确认密码不一致');
    return res.redirect('back');//回退到上一个页面
  }
  delete user.repassword;
  user.password = blogUtil.md5(user.password);
  user.avatar = "https://secure.gravatar.com/avatar/"+blogUtil.md5(user.email)+"?s=48";
  new Model('User')(user).save(function(err,doc){
    if(err){
      req.flash('error','注册用户失败');
      return res.redirect('back');//回退到上一个页面
    }else{
      req.session.user = doc;

      req.flash('success','注册成功');
      req.flash('success','欢迎光临');
      res.redirect('/');
    }
  });
});

//用户登陆
router.get('/login',auth.mustNotLogin, function(req, res, next) {
  res.render('user/login',{title:'用户登录'});
});
router.post('/login',auth.mustNotLogin, function(req, res, next) {
  if(req.body){
    var user = req.body;
    user.password = blogUtil.md5(user.password);
    Model('User').findOne(user,function(err,doc){
      if(err){
        req.flash('error','登录查询失败');
        return res.redirect('back');//回退到上一个页面
      }else{
        req.session.user = doc;
        req.flash('success','登录成功');
        req.flash('success','欢迎光临');
        res.redirect('/');
      }
    });
  }else{
    req.flash('error','填写信息不完整');
    return res.redirect('back');//回退到上一个页面
  }

});

//用户退出
router.get('/logout',auth.mustLogin,function(req, res, next) {
  req.session.user = null;
 res.redirect('/');
});

module.exports = router;
