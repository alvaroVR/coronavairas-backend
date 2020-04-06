const router = require('express').Router()
const authToken = require('./verifyToken')
const Request = require('../models/Request')
const User = require('../models/User')
// Require validations... (TO DO)

router.get('/', authToken, async(req, res) => {
  try {
    const requests = await Request.find()
    res.json(requests)
  } catch (err) {
    res.status(500).send({message: err.message})
  }
})

router.get('/makersQueue', authToken, async(req, res) => {
  try {
    const requests = await Request.find({
      type: "Solicitud",
      category: ["Mascarillas", "Viseras"]
    }).populate('user').exec()
    
    res.json(requests)
  } catch (err) {
    res.status(500).send({message: err.message})
  }
})

router.post('/new', authToken, async(req, res) => {
  // Add validations (TO DO) ALV PLZ XD

  try {
    const newRequest = new Request({
      type: req.body.type,
      category: req.body.category,
      detail: req.body.detail,
      amount: req.body.amount,
      role: req.user.role,
      user: req.user._id
    })
    request = await newRequest.save()
    res.send(request)
  } catch(err) {
    res.status(400).send({ message: err.message })
  }
})

router.post('/acceptedRequest', authToken, async(req, res) => {
  // Add validations (TO DO) ALV PLZ XD

  // check if email exist
  const currRequest = await Request.findById(req.body._id)

  try {
    const acceptedRequest = {
      user_id: req.user._id,
      amount: req.body.amount,
      note: req.body.note
    } 
    currRequest.acceptedRequest.push(acceptedRequest)
    const saved = await currRequest.save()
    res.send(saved)
  } catch(err) {
    res.send(err)
  }
})

module.exports = router