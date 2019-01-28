var checkLogin = require('../middlewares/check').checkLogin;
var checkIsBS = require('../middlewares/check').checkIsBS;
var checkIsBT = require('../middlewares/check').checkIsBT;
var checkIsBoss = require('../middlewares/check').checkIsBoss;
var ProjectModel = require('../models/projects');

var BlogModel = require('../models/blog');
var NoteModel = require('../models/note');
var moment = require('moment');
var dt = moment().locale('zh-cn').format('llll');

var express = require('express');
var router = express.Router();

var multer  = require('multer');
// 文件上传插件
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/images/pictures')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() +'_'+ file.originalname.toLowerCase())
	}
});
var upload = multer({ storage: storage });
// var cpUpload = upload.any();

// var upload = multer({ dest: 'uploads/' })



router.get('/upload',checkLogin, checkIsBS, function(req, res, next) {
	

	var user_id = req.session.user._id;
	ProjectModel.getUserProjects_ids(user_id)
	.then(function (projects_ids) {
		ProjectModel.getUserProjects(projects_ids.ProjectID)
		.then(function (projects) {
			res.render('blogUpload',{
				project:projects?projects:[],
				user:req.session.user,
			});
		});	
		
	})
	.catch(next);
});
router.get('/list', checkLogin  ,function(req, res, next) {
	var name_id = new Array();
	var is_search = false;
	step1();
	function step1(){

		if(req.query.name){
			BlogModel.getIdByStudentID(req.query.name)
			.then(function(ids){

				is_search = true;
				
				for(x in ids){
					name_id.push(ids[x]._id)
				}
				// console.log(name_id)
			})
			.then(step2);	
		}
		else{
			step2()
		}
	}
	// console.log(name)
	function step2(){
		if(req.query.page){
			var page = req.query.page;
			Promise.all([
				BlogModel.getBlogs(page,name_id,is_search),
				BlogModel.countBlogs(name_id,is_search),
				])
			.then(function(result){
				// console.log(result);
				res.send({
					'blog':result[0],
					'page':page,
					'isLastPage': (page-1)*3 + result[0].length == result[1]
				});
			})
			.catch(next);	
		}
		else{
			// console.log('dasa');
			var page = 1;
			Promise.all([
				BlogModel.getBlogs(page,name_id,is_search),
				BlogModel.countBlogs(name_id,is_search),
				])
			.then(function(result){
				console.log(result[0]);
				res.render('blogList',{
					user:req.session.user,
					isLastPage:result[1] <= 3,
					page:page,
					blog:result[0]
				});
			})
			.catch(next);
		}
	}
	
});

router.get('/single', checkLogin  ,function(req, res, next) {
	var blogID = req.query.s;
	// console.log(blogID)
	BlogModel.getBlogById(blogID)
	.then(function(result){

		res.render('blogList',{
			user:req.session.user,
			isLastPage:true,
			page:1,
			blog:result
		});
	})
	.catch(next);


});


var state = 1;
var picUrls = new Array();
router.post('/upload', checkLogin, checkIsBS, upload.any(), function(req, res, next) {
	// console.log(picUrls,state);
	// var temp = req.files[0].path;
	// var url = temp.substr(temp.indexOf('/public/images/pictures/')+24);
	// var url = req.files[0].filename;
	
	// picUrls.push(url);
	// state++;

	if(state == req.body.role){
		var url = req.files[0].filename;

		picUrls.push(url);
		var studentID = req.session.user._id;
		var projectName = req.body.projectName;
		var text = req.body.text;
		var picture = picUrls;

		var blog = {
			StudentID: studentID,
			ProjectID: projectName,
			PostDate: dt,
			Picture: picture,
			Zan:[],
			Mark: 0,
			Content: text,
			GPSParse: 'xx',
			GPSPicture: 'xx',
			Comments:[],
			IsFiled : false
		};
		console.log(blog)
		BlogModel.create_with_pic(blog)
		.then(function (result) {
			state = 1;
			picUrls = new Array();
			res.send('201');
		});
	}else{
		var url = req.files[0].filename;

		picUrls.push(url);
		state++;
		res.send('199');
	}


// console.log(req.files.file);

});

router.post('/upload_text', checkLogin, checkIsBS, function(req, res, next) {
	// console.log(req);
	var studentID = req.session.user._id;
	var projectName = req.body.projectName;
	var text = req.body.text;
	
	var blog = {
		StudentID: studentID,
		ProjectID: projectName,
		PostDate: dt,
		Picture: [],
		Zan:[],
		Mark: 0,
		Content: text,
		GPSParse: 'xx',
		GPSPicture: 'xx',
		Comments:[],
		IsFiled : false
	};
	BlogModel.create_text(blog)
	.then(function (result) {
		res.send('200');
	});
});


router.get('/comment', checkLogin,function(req, res, next) {
	// console.log(req);
	var userID = req.session.user._id;
	var blogID = req.query.blogid;
	var ownerID = req.query.ownerid;
	var content = req.query.content;

	var comment = {
		Author: userID,
		Content: content,
		PostDate: dt,
	};

	var note = {
		Owner: ownerID ,
		HappenedBlog : blogID,
		Author: userID,
		PostDate: dt,
		IsRead: false,
		ReadDate: null,
		Type: 1,
		Content: content
	};
	console.log(note)

	Promise.all([
		BlogModel.create_comment(comment,blogID),
		NoteModel.create(note)
		])
	.then(function (result) {
		res.send(dt);
	})
	.catch(next);
});

router.get('/zan', checkLogin, checkIsBS, function(req, res, next) {
	// console.log(req);
	var userID = req.session.user._id;
	var blogID = req.query.blogid;

	
	BlogModel.zan_check(blogID)
	.then(function (zans) {
		var arr = new Array();
		zans.Zan.forEach(function(value, index, array) {
			arr.push(value.Author.toString())
		}); 
		var is_exist = arr.indexOf(userID)!=-1?true:false; 
		if(is_exist){
			res.send('200');
		}else{
			var zan = {
				Author: userID,
				PostDate: dt,
			};
			BlogModel.zan(zan,blogID)
			.then(function (result) {
				res.send('200');
			});
		}
		
	});

});

router.post('/mark', checkLogin, checkIsBT, function(req, res, next) {
	// console.log(req);
	var userID = req.session.user._id;
	var blogID = req.body.blogid;
	var _mark = req.body.mark;

	var mark = {
		Mark: _mark
	};
	BlogModel.mark(mark,blogID)
	.then(function (result) {
		res.send('200');
	});
});




module.exports = router;