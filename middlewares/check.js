module.exports = {
	checkLogin: function checkLogin(req, res, next) {
		if (!req.session.user) {
			req.flash('error', '未登录'); 
			return res.redirect('/login');
		}
		next();
	},

	checkNotLogin: function checkNotLogin(req, res, next) {
		if (req.session.user) {
			req.flash('error', '已登录'); 
			switch(req.session.user.Role){
				case 0:
				return res.redirect('/data/student');
				break;

				case 1:
				return res.redirect('/blog/list');
				break;

				case 2:
				return res.redirect('/blog/list');
				break;

				default:
				return res.redirect('/blog/list');
				break;
			}
			
		}
		next();
	},

	checkIsStu: function checkIsStu(req, res, next) {
		if (req.session.user.Role==2) {
			
		}else{
			req.flash('error', '非法'); 
			return res.redirect('/login');
		}
		next();
	},
	checkIsTea: function checkIsTea(req, res, next) {
		if (req.session.user.Role==1) {
			
		}else{
			req.flash('error', '非法'); 
			return res.redirect('/login');
		}
		next();
	},
	checkIsBoss: function checkIsBoss(req, res, next) {
		if (req.session.user.Role==0) {
			
		}else{
			req.flash('error', '非法'); 
			return res.redirect('/login');
		}
		next();
	},
	checkIsBS: function checkIsBS(req, res, next) {
		if (req.session.user.Role==0||req.session.user.Role==2) {
			
		}else{
			req.flash('error', '非法'); 
			return res.redirect('/login');
		}
		next();
	},
	checkIsBT: function checkIsBT(req, res, next) {
		if (req.session.user.Role==0||req.session.user.Role==1) {
			
		}else{
			req.flash('error', '非法'); 
			return res.redirect('/login');
		}
		next();
	}
};

