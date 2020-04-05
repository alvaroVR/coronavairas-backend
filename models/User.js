const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre debe tener entre 6 y 255 caracteres'],
    min: 6,
    max: 255
  },
  email: {
    type: String,
    required: [true, 'El correo debe tener entre 6 y 255 caracteres'],
    max: 255,
    min: 6
  },
  password: {
    type: String,
    required: [true, 'Debe ingresar una contraseña de al menos 6 caracteres'],
    max: 1024,
    min: 6
  },
  role: {
    type: String,
    required: true,
    enum : ['Solicitante', 'Maker', 'Patrocinador', 'Admin'], 
    default: 'Solicitante' 
  },
  institution: {
    type: String,
    required: false,
    default: ''
  },
  refreshToken: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model('User', userSchema)