const mongoose = require('mongoose')
const { stringify } = require('querystring')
const Schema = mongoose.Schema

// 实例化模板
const PatientSchema = new Schema({
  recordNum: {
    type: Number,
    required: true,
  },
  healthCardNum: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birthdate: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
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
    required: true,
  },
  birthCity: {
    type: String,
    required: true,
  },
  birthArea: {
    type: String,
    required: true,
  },
  originProvince: {
    type: String,
    required: true,
  },
  oringinCity: {
    type: String,
    required: true,
  },
  originArea: {
    type: String,
    required: true,
  },
  addrProvince: {
    type: String,
    required: true,
  },
  addrCity: {
    type: String,
    required: true,
  },
  addrArea: {
    type: String,
    required: true,
  },
  accountProvince: {
    type: String,
    required: true,
  },
  accountCity: {
    type: String,
    required: true,
  },
  accountArea: {
    type: String,
    required: true,
  },
  ethnicity: {
    type: String,
    required: true,
  },
  idCardNum: {
    type: String,
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
  marriage: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
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
    required: true,
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
    required: true,
  },
  diseaseNum: {
    type: String,
    required: true,
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
    required: true,
  },
  resNurseName: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Patient = mongoose.model('patients', PatientSchema)
