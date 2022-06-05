const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 实例化模板
const AdminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  // 工号
  workNumber: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
})

module.exports = Admin = mongoose.model('admins', AdminSchema)
