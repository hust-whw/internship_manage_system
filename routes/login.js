var express = require('express');
var router = express.Router();
var checkNotLogin = require('../middlewares/check').checkNotLogin;
var UserModel = require('../models/users');



router.get('/', checkNotLogin, function(req, res, next) {
  

  res.render('page-login',{
    title:"LOGIN"
  });

});

// POST /signin 用户登录
router.post('/', checkNotLogin ,function(req, res, next) {
// req.session.u = 'ddd';
  // console.log(req.body)
  // console.log(req.fields)
  var usn = req.body.username;
  var psw = req.body.password;

  UserModel.getUserByName(usn,req.session.u)
    .then(function (user) {
      // console.log(user);
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('back');
      }
     // 检查密码是否匹配
     // if (sha1(password) !== user.password) {
      // console.log(user.Password)
      // console.log(psw)
     if (psw !== user.Password) {
        req.flash('error', '用户名或密码错误');
        return res.redirect('back');
      }
      req.flash('success', '登陆成功');
      // 用户信息写入 session
      delete user.Password;
      req.session.user = user;
      // 跳转到主页
      switch(req.session.user.Role){
        case 0:
        res.redirect('/data/student');
        break;

        case 1:
        res.redirect('/blog/list');
        break;

        case 2:
        res.redirect('/blog/list');
        break;

        default:
        res.redirect('/blog/list');
        break;
      }
    })
    .catch(next);


});

module.exports = router;