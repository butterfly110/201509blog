//检查必须登陆，不登陆就跳到登陆页
exports.mustLogin = function(req,res,next){
    if(req.session.user){
        next();
    }else{
        req.flash('error','你尚未登录,请登录');
        res.redirect('/users/login');
    }
}

//检查必须未登陆，已登陆的话跳到首页
exports.mustNotLogin = function(req,res,next){
    if(req.session.user){
        req.flash('error','你已经登录');
        res.redirect('/');
    }else{
        next();
    }
}