const jwt = require('jsonwebtoken')

module.exports = function auth(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).send({ message: 'Access denied' })

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = verified
    next()
  } catch(err) {
    res.status(400).send({ message: 'Invalid token' })
  }
}