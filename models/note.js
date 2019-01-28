var marked = require('marked');
var Note = require('../lib/mongo').Note;

module.exports = {
  // 创建一个留言
  create: function create(note) {
    return Note.create(note);
  },

  // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
  getNotes: function getNotes(userID) {
    return Note
      .find({ Owner: userID })
      .populate({ path: 'Author', model: 'User' })
      .populate({ path: 'HappenedBlog', model: 'Blog' })
      .sort({ _id: -1 })
      .exec();
  },

  // 通过文章 id 获取该文章下未读留言数
  getNoteCount: function getCommentsCount(userID) {
    return Note.count({ Owner: userID , IsRead : false}).exec();
  },

  isRead: function isRead(userID) {
    return Note
    .update({ Owner: userID },{IsRead : true , ReadDate: new Date()},{multi : true})
    .exec();
  }
};