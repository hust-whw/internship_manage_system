var checkLogin = require('../middlewares/check').checkLogin;
var checkIsBoss = require('../middlewares/check').checkIsBoss;

var express = require('express');
var router = express.Router();


router.get('/param_change', checkLogin,checkIsBoss,function(req, res, next) {
	

	var user_id = req.session.user._id;

	res.render('paramChange');
});

router.get('/unusual_check', checkLogin,checkIsBoss,function(req, res, next) {
	

	var user_id = req.session.user._id;

	res.render('unusualCheck');
});






module.exports = router;