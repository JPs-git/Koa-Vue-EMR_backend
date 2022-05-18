const koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyparser = require('koa-bodyparser')
const passport = require('koa-passport')

// 实例化koa
const app = new koa()
const router = new Router()

app.use(bodyparser())
app.use(passport.initialize())
app.use(passport.session())

// 回调到conf文件中 passport.js
require('./conf/passport')(passport)

// 引入路由文件
const users = require('./routes/api/users')
const patients = require('./routes/api/patients')

// 根路由
router.get('/', async (ctx) => {
  ctx.body = { msg: '测试成功！koa准备就绪！' }
})

//配置路由地址
router.use('/api/users', users)
router.use('/api/patients', patients)

// 配置路由
app.use(router.routes()).use(router.allowedMethods())

//config
const db = require('./conf/env').dbURL

//连接数据库
//mongoose.connect('mongodb://数据库ip:端口号/数据库名'，{useMongoClient: true})
//  - 端口默认27017可省略
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB connected...')
  })
  .catch((err) => {
    console.log(err)
  })

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server started on ${port}`)
})
