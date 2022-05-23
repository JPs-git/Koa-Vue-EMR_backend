const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const secretOrkey = require('../../conf/env').secretOrkey
const passport = require('koa-passport')
const bcrypt = require('bcryptjs')

const router = new Router()

// 引入User
const Users = require('../../models/Users')

// 引入Input验证
const validateRegistInput = require('../../validation/register')


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
  const findResult = await Users.find({
    workNumber: ctx.request.body.workNumber,
    isActive: true,
  })
  // console.log(findResult)
  // 查询工号是否已注册
  // 已注册
  if (findResult.length > 0) {
    ctx.status = 403
    ctx.body = { status: 403, data: { workNumber: '此工号已注册' } }
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
    const newUser = new Users({
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
    ctx.body = {}
    ctx.body.data = { success: true }
    ctx.body.status = ctx.status
  }
})

/**
 * @route POST api/users/checkworknum
 * @description 检测工号是否注册接口
 * @access      接口公开
 */
router.post('/checkworknum', async (ctx) => {
  // 查询
  const findResult = await Users.find({
    workNumber: ctx.request.body.workNumber,
    isActive: true,
  })
  if (findResult.length == 0) {
    // 此工号未注册
    ctx.status = 200
    ctx.body = { status: ctx.status, data: { isValid: true } }
  } else {
    // 此工号已注册
    ctx.status = 200
    ctx.body = { status: ctx.status, data: { isValid: false } }
  }
})

/**
 * @route GET api/users/all
 * @description 查询所有users接口
 * @access      接口公开
 */
router.get('/all', async (ctx) => {
  const findResult = await Users.find(
    { isActive: true },
    'name email workNumber permission'
  ).sort('workNumber')

  ctx.status = 200
  ctx.body = { status: ctx.status, data: { findResult } }
})

/**
 * @route POST api/users/modify
 * @description 修改user信息接口
 * @access      接口公开
 */
router.post('/modify', async (ctx) => {
  const { errors, isValid } = validateRegistInput(ctx.request.body)
  // 判断是否合法
  if (!isValid) {
    // 不合法
    ctx.status = 400
    ctx.body = errors
    return
  }
  // 合法
  const update = {}
  ctx.request.body.name && (update.name = ctx.request.body.name)
  ctx.request.body.email && (update.email = ctx.request.body.email)
  ctx.request.body.password && (update.password = ctx.request.body.password)
  ctx.request.body.workNumber &&
    (update.workNumber = ctx.request.body.workNumber)
  ctx.request.body.permission &&
    (update.permission = ctx.request.body.permission)
  ctx.request.body.isActive !== undefined &&
    (update.isActive = ctx.request.body.isActive)
  // 加密
  if (update.password != undefined) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(update.password, salt)
    update.password = hash
  }
  // 存储到数据库
  await Users.findByIdAndUpdate(ctx.request.body._id, update, { new: true })
  // 向客户端返回数据
  ctx.body = {}
  ctx.body.data = { success: true }
  ctx.body.status = ctx.status
})

/**
 * @route POST api/users/login
 * @description 登录接口 返回token
 * @access      接口公开
 */
router.post('/login', async (ctx) => {
  // 查询
  const findResult = await Users.find({
    workNumber: ctx.request.body.workNumber,
    isActive: true,
  })
  if (findResult.length == 0) {
    // 判断没查到
    ctx.status = 404
    ctx.body = { workNumber: '用户不存在！' }
  } else {
    // 查到后验证密码
    const user = findResult[0]
    const password = ctx.request.body.password
    const compaireResult = bcrypt.compareSync(password, user.password)
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
      ctx.body = {
        status: ctx.status,
        data: { success: true, token: 'Bearer ' + token },
      }
    } else {
      // 密码错误
      ctx.status = 200
      ctx.body = {
        status: ctx.status,
        data: { success: false, msg: '密码错误！' },
      }
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
    ctx.status = 200
    ctx.body = {
      status: ctx.status,
      data: {
        id: ctx.state.user.id,
        email: ctx.state.user.email,
        name: ctx.state.user.name,
        workNumber: ctx.state.user.workNumber,
        permission: ctx.state.user.permission,
      },
    }
  }
)

module.exports = router.routes()
