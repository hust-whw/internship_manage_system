var express = require('express');
var router = express.Router();
var UserModel = require('../models/users');

var OAuth = require('../wechatjs/wechat/oauth.js');
var client = new OAuth('wx71e215af5551f27f', 'f984b69e27b6fe04e22af1d88826f50f');

var CODE = "";


router.get('/', function(req, res, next) {

	CODE = req.query.code;
	client.getAccessToken(CODE, function (err, result){
		var accessToken = result.data.access_token;
		var usrid = result.data.openid;  
		console.log(accessToken)
		console.log(usrid)
		UserModel.getUserByWechat(usrid)
		.then(function (user) {
			if (!user) {
				return res.redirect('/logout');
			}else{
				delete user.Password;
				req.session.user = user;
				return res.redirect('/login');
			}
		});
		req.session.t = accessToken;
		req.session.u = usrid;
	});


});



module.exports = router;

