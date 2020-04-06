const mongoose = require('mongoose')
const User = require('../models/User')

const requestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum : ['Solicitud', 'Donacion'],
    required: true
  },
  category: {
    type: String,
    enum : ['Mascarillas', 'Viseras', 'Filamentos'],
    required: true
  },
  detail: {
    type: String,
  },
  amount: {
    type: Number,
    min: 1,
    max: 9999
  },
  user: {
    type: Object,
    ref: 'User',
    foreignField: '_id',
    required: true
  },
  role: {
    type: String,
    enum : ['Solicitante', 'Maker', 'Patrocinador'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  acceptedRequest: [
    {
      user_id: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true,
        min: 1
      },
      note: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
})

module.exports = mongoose.model('Request', requestSchema)