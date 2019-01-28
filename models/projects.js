var Project = require('../lib/mongo').Project;
var User = require('../lib/mongo').User;
var Blog = require('../lib/mongo').Blog;

module.exports = {
  // 注册一个用户
  create: function create(project) {
    return Project.create(project);
  },

  // 通过项目ID查找项目信息
  getProjectById: function getProjectById(projectId) {
    return Project
      .findOne({_id: projectId})
      .populate({ path: 'Stus',model: 'User' })
      // .addCreatedAt()
      .exec();
  },
      //通过用户ID获取对应项目ID
  getUserProjects_ids: function getUserProjects_ids(user_id) {
    return User
    .findOne({_id: user_id})
    // .populate({ path: 'ProjectID',select: { Name: 1,Author:1 ,IsFiled:1},model: 'Project' ,populate: { path: 'Author', model: 'User' }})
    .exec();
  },
    //通过项目ID获取对应项目信息
  getUserProjects: function getUserProjects(ids) {
    return Project
    .find({ _id:{$in:ids},IsFiled: false },{})
    .populate({ path: 'Author', model: 'User' })
    .exec();
  },
    //获取没有被归档的项目
  getProjects_using: function getProjects_using() {
    return Project
    .find({IsFiled:false})
    .populate({ path: 'Author', model: 'User' })
    .sort({ _id: -1 })
    .exec();
  },
  //获取包括归档的所有项目
  getAllProjects: function getAllProjects() {
    return Project
    .find()
    .populate({ path: 'Author', model: 'User' })
    .sort({ _id: -1 })
    .exec();
  },

  filed: function filed(projectId,dt) {
    return Project
    .update({ _id: projectId },{IsFiled : true , FiledDate: dt})
    .then(function(doc){
      return Blog
      .update({ ProjectID: projectId },{IsFiled : true},{multi : true})
    })

  },

  disfiled: function disfiled(projectId) {
    return Project
    .update({ _id: projectId },{IsFiled : false})
    .then(function(doc){
      return Blog
      .update({ ProjectID: projectId },{IsFiled : false},{multi : true})
    })

  },
  fileAll: function fileAll(dt) {
    return Project
    .update({IsFiled : false},{IsFiled : true , FiledDate: dt},{multi : true})
    .then(function(doc){
      return Blog
      .update({IsFiled : false},{IsFiled : true},{multi : true})
    })
  },
 getCountByProjectName: function getCountByProjectName(ProjectName) {
    return Project.count({Name:ProjectName}).exec();
  }


};