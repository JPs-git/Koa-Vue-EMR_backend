const bcrypt = require('bcryptjs/dist/bcrypt')
const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const secretOrkey = require('../../conf/env').secretOrkey
const passport = require('koa-passport')

const router = new Router()

// 引入User
const User = require('../../models/Users')

// 引入Input验证
const validateRegistInput = require('../../validation/register')

/**
 * @route GET api/users/
 * @description 测试接口
 * @access      接口公开
 */
router.get('/', async (ctx) => {
  ctx.status = 200
  ctx.body = { msg: 'users ok...' }
})

/**
 * @route POST api/users/
 * @description 注册接口
 * @access      接口公开
 */
router.post('/', async (ctx) => {
  ctx.status = 200
  ctx.body = { msg: 'users POST ok...' }

  // 操作数据库
  const findResult = await User.find({ email: ctx.request.body.email })
  // console.log(findResult)
  // 查询邮箱是否已注册
  // 已注册
  if (findResult.length > 0) {
    ctx.status = 403
    ctx.body = { email: '邮箱已被占用' }
  } else {
    // 未注册
    const {errors, isValid} = validateRegistInput(ctx.request.body)
    // 判断是否合法
    if(!isValid){
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
    })

    //加密
    await bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        // console.log(hash)
        newUser.password = hash
        // console.log('加密完成！')

        // 存到数据库
        newUser
          .save()
          .then((user) => {
            ctx.body = user
            // console.log('存储完成！')
            console.log(newUser.password)
          })
          .catch((err) => {
            console.log(err)
          })
      })
    })

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
  const findResult = await User.find({ email: ctx.request.body.email })
  if (findResult.length == 0) {
    // 判断没查到
    ctx.status = 404
    ctx.body = { email: '用户不存在！' }
  } else {
    // 查到后验证密码
    const user = findResult[0]
    const password = ctx.request.body.password
    const compaireResult = await bcrypt.compare(password, user.password)
    if (compaireResult) {
      // 密码正确 返回token
      const payload = { id: user.id, name: user.name }
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
 * @access      接口私密
 */
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  async (ctx) => {
    ctx.body = {
      id: ctx.state.user.id,
      email: ctx.state.user.email,
      name: ctx.state.user.name,
    }
  }
)

module.exports = router.routes()
