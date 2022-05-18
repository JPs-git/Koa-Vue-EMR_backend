const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const secretOrkey = require('../../conf/env').secretOrkey
const passport = require('koa-passport')
const bcrypt = require('bcryptjs')

const router = new Router()

// 引入User
const User = require('../../models/Users')

// 引入Input验证
const validateRegistInput = require('../../validation/register')
const { has } = require('koa/lib/response')

/**
 * @route GET api/users/test
 * @description 测试接口
 * @access      接口公开
 */
router.get('/test', async (ctx) => {
  ctx.status = 200
  ctx.body = { msg: 'users ok...' }
})

/**
 * @route POST api/users/rigister
 * @description 注册接口
 * @access      接口公开
 */
router.post('/rigister', async (ctx) => {
  // 操作数据库
  const findResult = await User.find({
    workNumber: ctx.request.body.workNumber,
  })
  // console.log(findResult)
  // 查询工号是否已注册
  // 已注册
  if (findResult.length > 0) {
    ctx.status = 403
    ctx.body = { workNumber: '此工号已注册' }
  } else {
    // 未注册
    const { errors, isValid } = validateRegistInput(ctx.request.body)
    // 判断是否合法
    if (!isValid) {
      // 不合法
      ctx.status = 400
      ctx.body = errors
      return
    }
    // 合法
    const newUser = new User({
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      password: ctx.request.body.password,
      workNumber: ctx.request.body.workNumber,
      permission: ctx.request.body.permission,
    })

    // 加密
    
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(newUser.password, salt)
    newUser.password = hash

    // 存储到数据库
    newUser.save()

    // 向客户端返回数据
    ctx.body = newUser
  }
})

/**
 * @route POST api/users/login
 * @description 登录接口 返回token
 * @access      接口公开
 */
router.post('/login', async (ctx) => {
  // 查询
  const findResult = await User.find({
    workNumber: ctx.request.body.workNumber,
  })
  if (findResult.length == 0) {
    // 判断没查到
    ctx.status = 404
    ctx.body = { workNumber: '用户不存在！' }
  } else {
    // 查到后验证密码
    const user = findResult[0]
    const password = ctx.request.body.password
    const compaireResult =  bcrypt.compareSync(password, user.password)
    if (compaireResult) {
      // 密码正确 返回token
      const payload = {
        id: user.id,
        name: user.name,
        workNumber: user.workNumber,
        permission: user.permission,
      }
      const token = jwt.sign(payload, secretOrkey, { expiresIn: 3600 })

      ctx.status = 200
      ctx.body = { success: true, token: 'Bearer ' + token }
    } else {
      // 密码错误
      ctx.status = 403
      ctx.body = { password: '密码错误！' }
    }
  }
})

/**
 * @route GET api/users/current
 * @description 用户信息接口 返回用户信息
 * @access      接口私密 需要token
 */
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  async (ctx) => {
    ctx.body = {
      id: ctx.state.user.id,
      email: ctx.state.user.email,
      name: ctx.state.user.name,
      workNumber: ctx.state.user.workNumber,
      permission: ctx.state.user.permission,
    }
  }
)

module.exports = router.routes()
