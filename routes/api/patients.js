const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const secretOrkey = require('../../conf/env').secretOrkey
const passport = require('koa-passport')
const bcrypt = require('bcryptjs')

const router = new Router()

// 引入Patients
const Patient = require('../../models/Patients')

// 引入Input验证
const validateRegistInput = require('../../validation/register')

/**
 * @route GET api/patients/test
 * @description 测试接口
 * @access      接口公开
 */
 router.get('/test', async (ctx) => {
  ctx.status = 200
  ctx.body = { msg: 'patients ok...' }
})

 module.exports = router.routes()
