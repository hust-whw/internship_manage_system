var checkLogin = require('../middlewares/check').checkLogin;
var checkIsBoss = require('../middlewares/check').checkIsBoss;

var express = require('express');
var router = express.Router();


router.get('/student', checkLogin,checkIsBoss,function(req, res, next) {
	

	var user_id = req.session.user._id;

	res.render('chart');
});







module.exports = router;