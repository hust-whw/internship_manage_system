var User = require('../lib/mongo').User;
var Blog = require('../lib/mongo').Blog;

module.exports = {
  // 注册一个用户
  create_text: function create_text(blog) {
    return Blog.create(blog);
  },
  create_with_pic: function create_with_pic(blog) {
    return Blog.create(blog);
  },
  create_comment: function create_comment(comment,blogID) {

    return Blog
    .findOne({"_id": blogID}, function(err, doc) {
      console.log(doc)
      doc.Comments.push(comment);
      doc.save();
    })


  },
  zan: function zan(zan,blogID) {

    return Blog
    .findOne({"_id": blogID}, function(err, doc) {
      // console.log(doc)
      doc.Zan.push(zan);
      doc.save();
    })
  },
  zan_check: function zan_check(blogID) {

    return Blog
    .findOne({"_id": blogID},{'Zan':1})
    .exec()
  },
  mark: function mark(mark,blogID) {

    return Blog
    .update({ _id: blogID },mark)
    .exec();
  },
  // getUserBlogs: function getUserBlogs(user_id) {
  //   return Blog
  //   .find({ StudentID: user_id })
  //   .sort({ PostDate: -1 })
  //   .populate({ path: 'ProjectID',select: {  Name: 1 ,Author: 1 },model: 'Project' ,populate: { path: 'Author',select: { Name : 1}, model: 'User'}})
  //   .populate({ path: 'Comments.Author',select: { Name: 1 },model: 'User' })
  //   .exec();
  // },
  getBlogs: function getBlogs(page,ids,is_search) {
    

    return Blog
    .find(((ids.length!=0||is_search==true)?{ StudentID:{$in:ids} ,IsFiled:false }:{IsFiled:false}),null, {skip: (page-1)*3, limit: 3})
    .sort({ _id: -1 })
    .populate({ path: 'StudentID',select: {  Name: 1,Avatar: 1 },model: 'User'})
    .populate({ path: 'ProjectID',select: {  Name: 1 ,Author: 1 },model: 'Project' ,populate: { path: 'Author',select: { Name : 1}, model: 'User'}})
    .populate({ path: 'Comments.Author',select: { Name: 1 , Avatar: 1 , Role : 1 },model: 'User' })

    .exec();
  },
  countBlogs: function countBlogs(ids,is_search) {
    return Blog
    .count(((ids.length!=0||is_search==true)?{ StudentID:{$in:ids},IsFiled:false }:{IsFiled:false}))
    .exec();
  },
  rank: function rank() {
    return Blog
    .aggregate([
    {
      $group : {_id : "$StudentID", num : {$sum : 1}}
    },
    {
      $limit : 5 
    },
    {
      $sort : { num : -1 }
    },
    {
      $lookup:
        {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "stu_msg"
        }
   }])
    .exec();
  },
  getIdByStudentID: function getIdByStudentID(name){
    return User
    .find({ Name: name })
    .select('_id')
    .exec();
  },
  getBlogById: function getBlogById(blogID) {
    return Blog
    .find({_id:blogID,IsFiled:false})
    .populate({ path: 'StudentID',select: {  Name: 1 ,Avatar:1},model: 'User'})
    .populate({ path: 'ProjectID',select: {  Name: 1 ,Author: 1 },model: 'Project' ,populate: { path: 'Author',select: { Name : 1}, model: 'User'}})
    .populate({ path: 'Comments.Author',select: { Name: 1 , Avatar:1 ,Role : 1 },model: 'User' })
    .exec();
  }


};