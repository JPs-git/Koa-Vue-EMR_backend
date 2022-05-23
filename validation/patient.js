const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateNewPatientInput(data){
  let errors = {}


  return {
    errors,
    isValid: isEmpty(errors)
  }
}