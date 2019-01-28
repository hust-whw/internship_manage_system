var User = require('../lib/mongo').User;

module.exports = {
  // 注册一个用户
  create: function create(user) {
    return User.create(user);
  },
  import: function _import(users) {
    return User.insertMany(users);
  },
  pswReset: function pswReset(userID,newPsw) {
    return User
      .update({ _id: userID },{Password: newPsw})
      .exec();
  },
  alter: function alter(userID,data) {
    return User
      .update({ _id: userID },data)
      .exec();
  },
  avatar_alter: function avatar_alter(userID,data) {
    return User
      .update({ _id: userID },data)
      .exec();
  },
  // 通过用户名获取用户信息
  getUserByName: function getUserByName(username,u) {
    return User
      .findOne({ MemberID: username })
      .exec(function (err, user) {
        if (user) {
              user.wechatU = u;
            
              user.save();
           }
        else{
          
        }

    });
  },
  getUserByWechat: function getUserByWechat(u) {
    return User
      .findOne({ wechatU: u })
      .exec();
  },
  getUserById: function getUserByName(userID) {
    return User
      .findOne({ _id: userID })
      .exec();
  },

  getAll: function getAll() {
    return User
      .find()
      // .addCreatedAt()
      .populate({ path: 'ProjectID', model: 'Project' })
      .exec();
  },

  getAllStudents: function getAllStudents() {
    return User
      .find({ Role: 2 })
      .sort({ _id: -1 })
      .populate({ path: 'ProjectID', model: 'Project' })
      .exec();
  },

  getAllTeachers: function getAllTeachers() {
    return User
      .find({ Role: 1 })
      .sort({ _id: -1 })
      .populate({ path: 'ProjectID', model: 'Project' })
      .exec();
  },
  studentDelete: function studentDelete(userID) {
    return User
      .remove({ _id: userID })
      .exec();
  },
  studentRefresh: function studentRefresh(userID) {
    return User
      .update({ _id: userID },{Password: '123456'})
      .exec();
  },
  studentAdd: function studentAdd(user) {
    // console.log(user);
    return User
    .find({MemberID: user.MemberID})
    .exec(function (err, user1) {
        if (user1.length == 1) {
            if(user1[0].ProjectID.indexOf(user.ProjectID[0]) == -1){
              user1[0].ProjectID.push(user.ProjectID[0])
              user1[0].save();
            }else{
              
            }
        }
        else{
          User.create(user);
        }

    });
  },
  teacherDelete: function teacherDelete(userID) {
    return User
      .remove({ _id: userID })
      .exec();
  },
  teacherRefresh: function teacherRefresh(userID) {
    return User
      .update({ _id: userID },{Password: '123456'})
      .exec();
  },
  teacherAdd: function teacherAdd(user) {
    // console.log(user);
    return User
    .find({MemberID: user.MemberID})
    .exec(function (err, user1) {
        if (user1.length == 1) {
            
        }
        else{
          User.create(user);
        }

    });
  },
  check_stu: function check_stu(MemberID) {
    return User
      .find({ MemberID: MemberID })
      .exec();
  },
  check_tea: function check_tea(MemberID) {
    return User
      .find({ MemberID: MemberID  })
      .exec();
  }

};