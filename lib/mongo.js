var config = require('config-lite');
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

// var Mongolass = require('mongolass');
// var mongolass = new Mongolass();
// var Schema = Mongolass.Schema;
// mongolass.connect(config.mongodb);

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
mongoose.set('debug', true)
mongoose.connect(config.mongodb);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
	
// });

var UserSchema = new Schema({
	MemberID: 'String',
	Name: 'String',
	Password: 'String',  
	Avatar: 'String',
	Major:'String',
	Grade:'String',
	Class:'String',
	Phone: 'String',
	QQ: 'String',
	Email: 'String',
	Role: 'Number',
	ProjectID: [{type: Schema.Types.ObjectId}],
	wechatU: 'String'
});
var ProjectSchema = new Schema({
	Name: 'String',
	Author: {type: Schema.Types.ObjectId, ref:'User'},
	PublishedDate: 'String',
	FinishDate: 'String',
	IsFiled: 'Boolean',
	FiledDate: 'String',
	Status: 'Number',
	Stus: [{type: Schema.Types.ObjectId, ref:'User'}],
});

var BlogSchema = new Schema({
	StudentID: {type: Schema.Types.ObjectId, ref:'User'},
	ProjectID: {type: Schema.Types.ObjectId, ref:'User'},
	Picture: [{type: 'String'}],
	Content: 'String',
	PostDate: 'String',
	GPSParse: 'String',
	GPSPicture: 'String',
	Mark:'Number',
	Zan: [{
	Author: {type: Schema.Types.ObjectId,ref:'User'},
	PostDate: 'String'
	}],
  Comments:[{
  	Author: {type: Schema.Types.ObjectId, ref:'User'},
  	Content: 'String',
  	PostDate: 'String'
  }],
  	IsFiled: 'Boolean'
});

var NoteSchema = new Schema({
	Owner:  {type: Schema.Types.ObjectId, ref:'User'},
	HappenedBlog :{type: Schema.Types.ObjectId, ref:'Blog'},
	Author: {type: Schema.Types.ObjectId, ref:'User'},
	PostDate: 'String',
	IsRead: 'Boolean',
	ReadDate: 'String',
	Type: 'Number',
	Content: 'String'
});

// var CommentSchema = new Schema({
//   UserID: { type: Mongolass.Types.ObjectId ,ref:'User'},
//   Content: { type: 'string' },
//   BlogID: { type: Mongolass.Types.ObjectId ,ref:'Blog'}
// });

exports.User = mongoose.model('User',UserSchema);
exports.Project = mongoose.model('Project',ProjectSchema);
exports.Blog = mongoose.model('Blog',BlogSchema);
exports.Note = mongoose.model('Note',NoteSchema);

// exports.Comment = mongoose.model('Comment',CommentSchema);

//     var tank = {name:'something',size:'small'};
//     TankModel.create(tank);



// exports.User = mongolass.model('User', {
//   MemberID: { type: 'string'},
//   Name: { type: 'string' },
//   Password: { type: 'string' },  
//   Avatar: { type: Mongolass.Types.ObjectId },
//   // Phone: { type: 'string', enum: ['m', 'f', 'x'] },
//   Phone: { type: 'string' },
//   QQ: { type: 'string' },
//   Email: { type: 'string' },
//   Role: { type: 'number' },
//   ProjectID: [{type: Mongolass.Types.ObjectId, ref:'Project'}]
// });
// exports.User.index({ MemberID: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一

// exports.Project = mongolass.model('Project',{
//   Name: {type: 'string'},
//   PublishedDate: {type: 'date'},
//   FinishDate: {type: 'date'},
//   IsFiled: {type: 'boolean'},
//   FiledDate: {type: 'date'},
//   Status: {type: 'number'},
//   Stus: [{type: Mongolass.Types.ObjectId, ref:'User'}],
// });
// exports.Project.index({_id: -1 }).exec();// 按创建时间降序查看用户的文章列表
// exports.Project.index({_id: 1 },{ unique: true }).exec();


// exports.Post = mongolass.model('Post', {
//   author: { type: Mongolass.Types.ObjectId },
//   title: { type: 'string' },
//   content: { type: 'string' },
//   pv: { type: 'number' }
// });
// exports.Post.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表


// exports.Comment = mongolass.model('Comment', {
//   author: { type: Mongolass.Types.ObjectId },
//   content: { type: 'string' },
//   postId: { type: Mongolass.Types.ObjectId }
// });
// exports.Post.index({ postId: 1, _id: 1 }).exec();// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
// exports.Post.index({ author: 1, _id: 1 }).exec();// 通过用户 id 和留言 id 删除一个留言


// // 根据 id 生成创建时间 created_at
// mongolass.plugin('addCreatedAt', {
//   afterFind: function (results) {
//     results.forEach(function (item) {
//       item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
//     });
//     return results;
//   },
//   afterFindOne: function (result) {
//     if (result) {
//       result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
//     }
//     return result;
//   }
// });


