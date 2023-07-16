const jwt = require('jsonwebtoken')
const config = require('../configs/config');
const userService = require('../services/userServices')

  const userAuth = async (req, res, next) => {
    try {
      let token = req.header('Authorization')
      if (!token) {
        return res.status(401).send({ error: 'Token not found.' })
      }
      
      token = token.replace('Bearer ', '')
      const decoded = jwt.verify(token, config.jwtSecret)
      const user = await userService.getUserById(decoded.id)
      if (!user) {
        return res.status(401).send({ error: 'Request Not Authorized.' })
      }
      req.user = user
      next()
    } catch (e) {
      next(e)
    }
  }

  
module.exports = {userAuth}