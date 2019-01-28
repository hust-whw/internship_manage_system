// var checkLogin = require('../middlewares/check').checkLogin;
// var checkNotLogin = require('../middlewares/check').checkNotLogin;
var NoteModel = require('../models/note');

module.exports = function (app) {
	app.get('/', function (req, res) {
		res.redirect('/login');
	});

  app.use(function (req, res, next) {
    if(req.session.user){
      // console.log('dddd')
      var user_id = req.session.user._id;
      NoteModel.getNoteCount(user_id)
      .then(function (num) {
          app.locals.note_num = num;
      });
    }
    else{

    }
    next();
  });
	// app.use('/home', require('./home'));
	app.use('/login', require('./login'));
  app.use('/logout', require('./logout'));
  app.use('/profile', require('./profile'));
  app.use('/project', require('./project'));
  app.use('/blog', require('./blog'));
  app.use('/student', require('./student'));
  app.use('/teacher', require('./teacher'));
  app.use('/data', require('./data'));
  app.use('/inform', require('./inform'));
  app.use('/wechatoauth', require('./wechatoauth.js'));
  app.use('/param', require('./param.js'));

  // 404 page
  app.use(function (req, res) {
  	if (!res.headersSent) {
  		res.render('404');
  	}
  });




};