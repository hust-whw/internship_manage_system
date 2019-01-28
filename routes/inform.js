var checkLogin = require('../middlewares/check').checkLogin;
var NoteModel = require('../models/note');

var express = require('express');
var router = express.Router();


router.get('/', checkLogin,function(req, res, next) {

	res.locals.note_num = 0;
	var userID = req.session.user._id;


	Promise.all([
    NoteModel.getNotes(userID),// 获取所有通知
    NoteModel.isRead(userID),// 将读过的通知改变状态
    // PostModel.incPv(postId)// pv 加 1
  ])
  .then(function (result) {
    console.log(result[0])
    res.render('informList',{
      user: req.session.user,
     	note:result[0]
    });

  })
  .catch(next);
});







module.exports = router;