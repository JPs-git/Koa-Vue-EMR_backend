const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const secretOrkey = require('../../conf/env').secretOrkey
const passport = require('koa-passport')
const bcrypt = require('bcryptjs')

const router = new Router()

// 引入Patients
const Patients = require('../../models/Patients')

// 引入Input验证
const validateNewPatientInput = require('../../validation/patient')
const { find } = require('../../models/Patients')

/**
 * @route GET api/patients/test
 * @description 测试接口
 * @access      接口公开
 */
router.get('/test', async (ctx) => {
  ctx.status = 200
  ctx.body = { msg: 'patients ok...' }
})

/**
 * @route POST api/patients
 * @description 新增病人接口
 * @access      接口公开
 */
router.post('/', async (ctx) => {
  // 验证
  const { errors, isValid } = validateNewPatientInput(ctx.request.body)
  if (!isValid) {
    // 不合法
    ctx.status = 400
    ctx.body = {
      status: ctx.status,
      data: {
        errors,
      },
    }
  } else {
    // 合法

    // 查询病案号是否重复
    const findResult = await Patients.find({
      recordNum: ctx.request.body.recordNum,
    })
    if (findResult.length > 0) {
      // 已经重复
      ctx.status = 400
      ctx.body = {
        status: ctx.status,
        data: {
          success: false,
          msg: '该病案号已使用过！',
        },
      }
    } else {
      // 存入数据库
      const newPatient = new Patients()
      const body = ctx.request.body
      Object.keys(body).forEach((key) => {
        newPatient[key] = body[key]
      })
      await newPatient.save()
      ctx.status = 200
      ctx.body = {
        status: ctx.status,
        data: {
          success: true,
        },
      }
    }
  }
})

/**
 * @route GET api/patients
 * @description 查询病人接口
 * @access      接口公开
 */
router.get('/', async (ctx) => {
  // 计算需要跳过的页数
  const skipNum = ctx.query.pageSize * (ctx.query.currentPage - 1)

  ctx.query.isActive = true
  const findResult = await Patients.find(ctx.query, null, {
    limit: ctx.query.pageSize,
    skip: skipNum,
  })
  // 查询总数
  const total = await Patients.count({})
  ctx.status = 200
  ctx.body = { status: ctx.status, data: { findResult, total } }
})

module.exports = router.routes()
