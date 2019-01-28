var checkLogin = require('../middlewares/check').checkLogin;
var UserModel = require('../models/users');

var express = require('express');
var router = express.Router();


router.get('/', checkLogin,function(req, res, next) {
	// console.log(req.session.user);

	
	res.render('profile',{
		user:req.session.user,
	});

});

router.post('/psw_reset', checkLogin,function(req, res, next) {	
	var newPsw = req.body.psw1;
	var psw2 = req.body.psw2;
	var userID = req.session.user._id;
	UserModel.pswReset(userID,newPsw)
	.then(function (result) {
		res.send('200');
	});
});

router.post('/alter',checkLogin, function(req, res, next) {
	var _userID = req.session.user._id;
	var data = req.body.MSG;
	var userID = req.body.userID;

	// console.log(userID)

	UserModel.alter(userID,data)
	.then(function (result) {
		UserModel.getUserById(userID)
		.then(function(user){
			delete user.Password;
			req.session.user = user;
			res.send('200');
		});	
	});
});

router.post('/altered',checkLogin, function(req, res, next) {
	var _userID = req.session.user._id;
	var data = req.body.MSG;
	var userID = req.body.userID;

	console.log(userID)

	UserModel.alter(userID,data)
	.then(function (result) {
		// UserModel.getUserById(userID)
		// .then(function(user){
		// 	delete user.Password;
		// 	req.session.user = user;
			res.send('200');
		// });	
	});
});

router.get('/avatar_clip',checkLogin, function(req, res, next) {
	var userID = req.session.user._id;

	

	res.render('avatarChange',{
		user:req.session.user
	});
});

router.post('/avatar_change', checkLogin,function(req, res, next) {
	var userID = req.session.user._id;
	var base_64 = req.body.base;

	var data = {
		Avatar : base_64
	}

	UserModel.avatar_alter(userID,data)
	.then(function(user){
		req.session.user.Avatar = base_64;
		res.send('200');
	});
});





module.exports = router;