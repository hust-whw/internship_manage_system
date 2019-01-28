var checkLogin = require('../middlewares/check').checkLogin;
var checkIsBT = require('../middlewares/check').checkIsBT;
var checkIsBoss = require('../middlewares/check').checkIsBoss;
var UserModel = require('../models/users');
var ProjectModel = require('../models/projects');
var BlogModel = require('../models/blog');

var express = require('express');
var router = express.Router();
var async = require('async');
var multer  = require('multer');
// 文件上传插件
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/excels')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() +'_'+ file.originalname.toLowerCase())
  }
});
var upload = multer({ storage: storage });



router.get('/list',checkLogin,checkIsBT ,function(req, res, next) {
	

	var user_id = req.session.user._id;
	UserModel.getAllStudents()
	.then(function (student) {

		res.render('studentsList',{
			student:student,
			user:req.session.user
		});
	})
	.catch(next);
});

router.get('/rank',checkLogin, function(req, res, next) {
	

	var user_id = req.session.user._id;
	BlogModel.rank()
	.then(function (result) {
		// console.log(result)
		// console.log(result[0].stu_msg[0])
		

		result.forEach(function(item,index){  
			item.Name = item.stu_msg[0].Name; 
			delete item.stu_msg;
			console.log(item)  
		}); 

		res.render('studentsRank',{
			user:req.session.user,
			result:result
		});
	})
	.catch(next);
});

router.get('/add',checkLogin, checkIsBT,function(req, res, next) {
	

	var user_id = req.session.user._id;
	ProjectModel.getProjects_using()
	.then(function (projects) {

		res.render('studentAdd',{
			user:req.session.user,
			project:projects,
			title:"PROFILE"
		});
	})
	.catch(next);
});


router.post('/add',checkLogin, checkIsBT ,function(req, res, next) {
	

	var user_id = req.session.user._id;
	var name = req.body.name;
	var number = req.body.number;
	var projectID = req.body.projectID;

	var user = {
		'MemberID': number,
		'Name': name,
		'Password': '123456' ,  
		'Avatar': '/assets/img/avatar.jpg' ,
		'Major':null,
		'Grade':null,
		'Class':null,
		'Phone':'tel',
		'QQ':'qq',
		'Email':'email',
		'Role': 2,
		'ProjectID':[projectID,]//585c9d320af8b727f7ca3e5c;585c9d5174019d28011762cd
	};

	UserModel.studentAdd(user)
	.then(function(result){
		console.log(result);
		res.send('200');  
	});
  // res.send('200');
});
router.post('/check_stu',checkLogin, checkIsBT ,function(req, res, next) {
	

	var user_id = req.session.user._id;
	var MemberID = req.body.MemberID;

	UserModel.check_stu(MemberID)
	.then(function(num){
		res.send({num:num.length,name:num.length?num[0].Name:''});  
	});
  // res.send('200');
});


router.post('/del',checkLogin, checkIsBT ,function(req, res, next) {
	

	var user_id = req.session.user._id;
	var userID = req.body.userID;
	UserModel.studentDelete(userID)
	.then(function (result) {

		res.send('200');
	})
	.catch(next);
});

router.post('/ref',checkLogin, checkIsBT ,function(req, res, next) {
	

	var user_id = req.session.user._id;
	var userID = req.body.userID;
	UserModel.studentRefresh(userID)
	.then(function (result) {

		res.send('200');
	})
	.catch(next);
});


router.post('/get_msg',checkLogin, function(req, res, next) {
	

	var user_id = req.session.user._id;
	var userID = req.body.userID;
	
	UserModel.getUserById(userID)
	.then(function (user) {
		// console.log(user)
		delete user.Password;
		res.send(user);
	})
	.catch(next);
});


router.get('/import',checkLogin,checkIsBT , function(req, res, next) {

	var user_id = req.session.user._id;
	
	res.render('studentImport',{
		user:req.session.user
	});
});

router.post('/check',checkLogin,checkIsBT ,upload.any(), function(req, res, next) {

	var xlsx = require('node-xlsx');
	var fs = require('fs');
	var dgram = require('dgram');
	var user_id = req.session.user._id;
	var path = req.files[0].path;



	var obj = xlsx.parse(path);
	// console.log(JSON.stringify(obj[0].data));
	console.log(obj[0].data);
	var main_column = obj[0].data[0].indexOf('学号');
	var name_column = obj[0].data[0].indexOf('姓名');
	var major_column = obj[0].data[0].indexOf('专业');
	var grade_column = obj[0].data[0].indexOf('年级');
	var class_column = obj[0].data[0].indexOf('班级');
	var phone_column = obj[0].data[0].indexOf('TEL');
	var qq_column = obj[0].data[0].indexOf('QQ');
	var email_column = obj[0].data[0].indexOf('EMAIL');


	var num_all = obj[0].data.length-1;
	var num_ready = 0;
	var num_success = 0;
	var num_error = 0;

	// console.log(num_all)
	
	
	async.waterfall([
		function(callback){
			var arr = new Array();
			var err_arr = new Array();
			
			callback(null, arr,err_arr);
		},
		function(arr,err_arr,callback){
			
			obj[0].data.forEach(function(item,i){
				if(i==0){

				}else{
					if(item[main_column]==null){
						num_error++;
						num_ready++;
						err_arr.push({
							i:i+1,
							type:'学号缺失',
							data:item
						});
						if(num_ready==obj[0].data.length-1){
							callback(null, arr, err_arr)
						}

					}else{
						UserModel.check_stu(item[main_column])
						.then(function(num){
							num_ready++;
							// console.log(num.length);
							if(num.length!=0){
								num_error++;
								err_arr.push({
									i:i+1,
									type:'学号重复',
									data:item
								});

							}else{

								var user = {
									'MemberID': item[main_column],
									'Name': '',
									'Password': '123456' ,  
									'Avatar': '/assets/img/avatar.jpg' ,
									'Major':major_column!=-1?item[major_column]:null,
									'Grade':grade_column!=-1?item[grade_column]:null,
									'Class':class_column!=-1?item[class_column]:null,
									'Phone':phone_column!=-1?item[phone_column]:null,
									'QQ':qq_column!=-1?item[qq_column]:null,
									'Email':email_column!=-1?item[email_column]:null,
									'Role': 2,
									'ProjectID':[]
								};

								arr.push(user);
							}
							if(num_ready==obj[0].data.length-1){
								callback(null, arr, err_arr)
							}
						});
					}
				}	
			})			
		},
		function(arr, err_arr, callback){
			// console.log(arr);
			// console.log(err_arr);

			callback(null, arr, err_arr)
		},
		function(arr,err_arr, callback){
			// console.log(arr.length)
			
				fs.unlinkSync(path);
				var returnData = {
					"all":num_all,
					"is_no_main":main_column==-1,
					"is_error":err_arr.length>0,
					"err_arr":err_arr
				} 
				setTimeout(function(){
					callback(null, returnData)
				}, 10 );

			
			
		}
		], function (err, result) {

			res.send(result); 
			// console.log(result);
		});


});



router.post('/import',checkLogin,checkIsBT ,upload.any(), function(req, res, next) {

	var xlsx = require('node-xlsx');
	var fs = require('fs');
	var dgram = require('dgram');
	var user_id = req.session.user._id;
	var path = req.files[0].path;

	var obj = xlsx.parse(path);
	// console.log(JSON.stringify(obj[0].data));
	console.log(obj[0].data);
	var main_column = obj[0].data[0].indexOf('学号');
	var name_column = obj[0].data[0].indexOf('姓名');
	var major_column = obj[0].data[0].indexOf('专业');
	var grade_column = obj[0].data[0].indexOf('年级');
	var class_column = obj[0].data[0].indexOf('班级');
	var phone_column = obj[0].data[0].indexOf('TEL');
	var qq_column = obj[0].data[0].indexOf('QQ');
	var email_column = obj[0].data[0].indexOf('EMAIL');

	var arr = new Array();

	obj[0].data.forEach(function(item,i){
		if(i==0){

		}else{
			var user = {
				'MemberID': item[main_column],
				'Name': '',
				'Password': '123456' ,  
				'Avatar': '/assets/img/avatar.jpg' ,
				'Major':major_column!=-1?item[major_column]:null,
				'Grade':grade_column!=-1?item[grade_column]:null,
				'Class':class_column!=-1?item[class_column]:null,
				'Phone':phone_column!=-1?item[phone_column]:null,
				'QQ':qq_column!=-1?item[qq_column]:null,
				'Email':email_column!=-1?item[email_column]:null,
				'Role': 2,
				'ProjectID':[]
			};
			arr.push(user);
		}	
	})			

	UserModel.import(arr)
	.then(function(result){
		fs.unlinkSync(path);

		res.send("200");

	});	

});



module.exports = router;