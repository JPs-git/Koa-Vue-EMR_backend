const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 实例化模板
const PatientSchema = new Schema({
  recordNum: {
    type: String,
    required: true,
  },
  healthCardNum: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: 'female'
  },
  birthdate: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  ageMonth: {
    type: Number,
    default: null,
  },
  birthWeight: {
    type: Number,
    default: null,
  },
  admissionWeight: {
    type: Number,
    default: null,
  },
  birthProvince: {
    type: String,
    default: ''
  },
  birthCity: {
    type: String,
    default: ''
  },
  birthArea: {
    type: String,
    default: ''
  },
  originProvince: {
    type: String,
    default: ''
  },
  oringinCity: {
    type: String,
    default: ''
  },
  originArea: {
    type: String,
    default: ''
  },
  addrProvince: {
    type: String,
    default: ''
  },
  addrCity: {
    type: String,
    default: ''
  },
  addrArea: {
    type: String,
    default: ''
  },
  accountProvince: {
    type: String,
    default: ''
  },
  accountCity: {
    type: String,
    default: ''
  },
  accountArea: {
    type: String,
    default: ''
  },
  ethnicity: {
    type: String,
    default: ''
  },
  idCardNum: {
    type: String,
    default: ''
  },
  job: {
    type: String,
    default: ''
  },
  marriage: {
    type: String,
    default: ''
  },
  phone: {
    type: Number,
    default: ''
  },
  zip: {
    type: Number,
    default: 000000,
  },
  email: {
    type: String,
    default: '',
  },
  workPlace: {
    type: String,
    default: '',
  },
  workPhone: {
    type: Number,
    default: '',
  },
  workZip: {
    type: Number,
    default: 000000,
  },
  contact: {
    type: String,
    default: '',
  },
  contactRelationship: {
    type: String,
    default: '',
  },
  contactAddress: {
    type: String,
    default: '',
  },
  contactPhone: {
    type: String,
    default: '',
  },
  admissionRoute: {
    type: String,
    default: ''
  },
  admissionDate: {
    type: String,
    default: '',
  },
  admissionDepartment: {
    type: String,
    default: '',
  },
  ward: {
    type: String,
    default: '',
  },
  dischargeDate: {
    type: String,
    default: '',
  },
  dischargeDepartment: {
    type: String,
    default: '',
  },
  totalDays: {
    type: Number,
    default: 0,
  },
  diagnosis: {
    type: String,
    default: ''
  },
  diseaseNum: {
    type: String,
    default: ''
  },
  allergies: {
    type: String,
    default: '',
  },
  bloodTypeABO: {
    type: String,
    default: '',
  },
  bloodTypeRh: {
    type: String,
    default: '',
  },
  autopsy: {
    type: Boolean,
    default: false,
  },
  attendingName: {
    type: String,
    default: ''
  },
  resNurseName: {
    type: String,
    default: ''
  },

  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Patient = mongoose.model('patients', PatientSchema)
