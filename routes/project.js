var checkLogin = require('../middlewares/check').checkLogin;
var checkIsBT = require('../middlewares/check').checkIsBT;
var checkIsBS = require('../middlewares/check').checkIsBS;
var checkIsBoss = require('../middlewares/check').checkIsBoss;
var UserModel = require('../models/users');
var ProjectModel = require('../models/projects');
var moment = require('moment');
var dt = moment().locale('zh-cn').format('llll');

var express = require('express');
var router = express.Router();


router.get('/list', checkLogin, checkIsBT ,function(req, res, next) {

  // var projectIds = req.session.user.ProjectID;
  var user_id = req.session.user._id;
  // console.log(user_id)
  ProjectModel.getAllProjects()
  .then(function (projects) {
    // console.log(projects);
    res.render('projectList',{
      
      title:"PROJECTLIST",
      user: req.session.user,
      project: projects,
      author:projects.Author
    });
  })
  .catch(next);

  
});


router.get('/add',checkLogin, checkIsBT ,function(req, res, next) {
  Promise.all([
    UserModel.getAllTeachers(),// 获取文章信息
    // CommentModel.getComments(postId),// 获取该文章所有留言
    // PostModel.incPv(postId)// pv 加 1
  ])
  .then(function (result) {
    
    res.render('projectAdd',{
      user:req.session.user,
      
      teacher:result[0]
    
    });

  })
  .catch(next);


 });



router.post('/add',checkLogin,checkIsBT , function(req, res, next) {
  

    var user_id = req.session.user._id;
    var name = req.body.name;
    var teacherID = req.body.teacher;
 


   var project = {
    Name: name,
    Author: teacherID,
  PublishedDate: dt,
  FinishDate: dt,
  IsFiled: false,
  FiledDate: dt,
  Status: 1,
  Stus: []
  };

   ProjectModel.create(project)
  .then(function(result){
     res.send('200');
  });
});

router.post('/check',checkLogin, checkIsBT ,function(req, res, next) {
  

  var user_id = req.session.user._id;
  var Name = req.body.name;

  ProjectModel.getCountByProjectName(Name)
  .then(function(num){
    res.send(num.toString());  
  });
});

router.post('/file',checkLogin,checkIsBT , function(req, res, next) {
  

    var user_id = req.session.user._id;
    var projectID = req.body.projectID;
 

  ProjectModel.filed(projectID,dt)
  .then(function(result){
     res.send('200');
  });
});

router.post('/disfile',checkLogin, checkIsBT ,function(req, res, next) {
  

    var user_id = req.session.user._id;
    var projectID = req.body.projectID;
 
    
  ProjectModel.disfiled(projectID)
  .then(function(result){
     res.send('200');
  });
});

router.post('/fileall',checkLogin, checkIsBT ,function(req, res, next) {
  

    var user_id = req.session.user._id;
 
    

  ProjectModel.fileAll(dt)
  .then(function(result){
     res.send('200');
  });
});

module.exports = router;