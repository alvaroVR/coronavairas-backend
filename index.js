const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config()

// Import routes
const authRoute = require('./routes/auth')
const requestRoute = require('./routes/requests')

// Connect to db
mongoose.connect(process.env.DB_CONNECT, 
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('connected to db')
)

// Middleware
app.use(express.json())

// Route middlewares
app.use('/api/user', authRoute)
app.use('/api/request', requestRoute)


app.listen(3000, () => console.log('Server running'))