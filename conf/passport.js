const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const secretOrKey = require('./env').secretOrkey
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = secretOrKey

const mongoose = require('mongoose')
const User = require('../models/Users')


module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      // console.log(jwt_payload)
      const user = await User.findById(jwt_payload.id)
      if(user){
        // 如果有用户信息
        return(done(null, user))
      }else{
        // 没有用户信息
        return(done(null, false))
      }
    })
  )
}
