const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 实例化模板
const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  //头像
  avatar:{
    type: String,
  },
  date:{
    type: Date,
    default: Date.now
  }
})

module.exports = User = mongoose.model('users', UserSchema)