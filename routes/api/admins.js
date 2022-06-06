const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const secretOrkey = require('../../conf/env').secretOrkey
const passport = require('koa-passport')
const bcrypt = require('bcryptjs')

const router = new Router()

// 引入Admin
const Admins = require('../../models/Admins')

// 引入Input验证
const validateRegistInput = require('../../validation/register')

/**
 * @route GET api/admins/test
 * @description 测试接口
 * @access      接口公开
 */
router.get('/test', async (ctx) => {
  ctx.status = 200
  ctx.body = { msg: 'admin ok...' }
})

/**
 * @route GET api/admins
 * @description 查询管理员接口
 * @access      接口公开
 */
router.get('/', async (ctx) => {
  // 计算需要跳过的页数
  const skipNum = ctx.query.pageSize * (ctx.query.currentPage - 1)

  ctx.query.isActive = true
  ctx.query.workNumber = { $ne: 'admin' }
  const findResult = await Admins.find(ctx.query, 'name  workNumber ', {
    limit: ctx.query.pageSize,
    skip: skipNum,
  }).sort('workNumber')
  // 查询总数
  const total = await Admins.count(ctx.query)
  ctx.status = 200
  ctx.body = { status: ctx.status, data: { findResult, total } }
})

/**
 * @route POST api/admins/register
 * @description 注册接口
 * @access      接口公开
 */
router.post('/register', async (ctx) => {
  // 操作数据库
  const findResult = await Admins.find({
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
    const newAdmin = new Admins({
      name: ctx.request.body.name,
      password: ctx.request.body.password,
      workNumber: ctx.request.body.workNumber,
    })

    // 加密

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(newAdmin.password, salt)
    newAdmin.password = hash

    // 存储到数据库
    newAdmin.save()

    // 向客户端返回数据
    ctx.body = {}
    ctx.body.data = { success: true }
    ctx.body.status = ctx.status
  }
})

/**
 * @route POST api/admins/login
 * @description 登录接口
 * @access      接口公开
 */
router.post('/login', async (ctx) => {
  // 查询
  const findResult = await Admins.find({
    workNumber: ctx.request.body.workNumber,
    isActive: true,
  })
  if (findResult.length == 0) {
    // 判断没查到
    ctx.status = 200
    ctx.body = {
      status: ctx.status,
      data: {
        success: false,
        msg: '用户不存在',
      },
    }
  } else {
    // 查到后验证密码
    const admin = findResult[0]
    const password = ctx.request.body.password
    const compaireResult = bcrypt.compareSync(password, admin.password)
    if (compaireResult) {
      // 密码正确 返回token
      const payload = {
        id: admin.id,
        name: admin.name,
        workNumber: admin.workNumber,
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
 * @route POST api/admins/checkworknum
 * @description 检测工号是否注册接口
 * @access      接口公开
 */
router.post('/checkworknum', async (ctx) => {
  // 查询
  const findResult = await Admins.find({
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
 * @route POST api/admins/remove
 * @description 停用管理员接口
 * @access      接口公开
 */
router.post('/remove', async (ctx) => {
  // 查询
  const findResult = await Admins.find({
    workNumber: ctx.request.body.workNumber,
    isActive: true,
  })
  if (findResult.length == 0) {
    // 此工号未注册
    ctx.status = 404
    ctx.body = {
      status: ctx.status,
      data: { success: false, msg: '试图删除的用户不存在' },
    }
  } else {
    // 此工号已注册
    await Admins.findByIdAndUpdate(findResult[0]._id, { isActive: false })
    ctx.status = 200
    ctx.body = { status: ctx.status, data: { success: true } }
  }
})

/**
 * @route GET api/admins/current
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
        name: ctx.state.user.name,
        workNumber: ctx.state.user.workNumber,
      },
    }
  }
)
module.exports = router.routes()
