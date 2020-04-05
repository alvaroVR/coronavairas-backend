const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../validation')

// Register
router.post('/register', async(req, res) => {
  // Validate data
  const {error} = registerValidation(req.body)
  if ( error ) return res.status(400).send({ message: error.details[0].message})

  // Checking if user is already in the database
  const emailExist = await User.findOne({
    email: req.body.email
  })
  if ( emailExist ) return res.status(401).send({ message: 'email already in use' })

  // Hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  
  // Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    institution: req.body.institution
  })
  try {
    const savedUser = await user.save()
    res.send(savedUser)
  } catch(err) {
    res.status(400).json({ message: err })
  }
})

// Login
router.post('/login', async(req, res) => {
  // Validate data
  const {error} = loginValidation(req.body)
  if ( error ) return res.status(400).send({ message: error.details[0].message})

  // check if email exist
  const user = await User.findOne({
    email: req.body.email
  })
  if ( !user ) return res.status(401).send({ message: 'Email is not found' })

  // Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if ( !validPass ) return res.status(400).send({ message: 'Invalid password' })

  // Create/Assign token
  tokenData = { _id: user._id, email: user.email }
  const accessToken = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
  const refreshToken = jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET)
  user.refreshToken = refreshToken // Se asigna el refresh token del user en mongo

  try {
    await user.save()
    res.send({ 
      _id: user._id, 
      email: user.email, 
      accessToken: accessToken, 
      refreshToken: refreshToken 
    })
  } catch(err) {
    return res.status(400).send({ message: err })
  }

})

// Using renew token
router.get('/renewToken', async(req, res) => {
  const refreshToken = req.body.refreshToken
  if (refreshToken == null) return res.sendStatus(401)

  try{
    userData = await User.findById(req.body._id)
    if (userData.refreshToken !== refreshToken) return res.status(403).send({ message: 'Invalid token'})
  
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      // const accessToken = generateAccessToken({ name: user.name })
      tokenData = { _id: user._id, email: user.email }
      const accessToken = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
  
      res.json({ accessToken: accessToken })
    })
  } catch(err) {
    res.status(400).send({message: 'Authentication error.'})
  }
  
})

module.exports = router