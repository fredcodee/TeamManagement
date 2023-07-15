const jwt = require('jsonwebtoken')
const User  = require('../models/User')
const config = require('../configs/config');
const userService = require('../services/userServices')




// check if token is valid and if user is admin
const adminAuth = async (req, res, next) => {
    try {
      let token = req.header('Authorization')
      if (!token) {
        return res.status(401).send({ error: 'Token not found.' })
      }

      token = req.header('Authorization').replace('Bearer ', '')
      const decoded = jwt.verify(token, config.jwtSecret)
      
      //Check if user is admin
      const user = await userService.getUserById(decoded._id)
      const check  = await userService.checkUserIsAdmin(user._id)
      if (!user || !check) {
        return res.status(401).send({ error: 'Request Not Authorized.' })
      }
      req.user = user
      next()
    } catch (e) {
      next(e)
    }
  }
  
  const userAuth = async (req, res, next) => {
    try {
      let token = req.header('Authorization')
      if (!token) {
        return res.status(401).send({ error: 'Token not found.' })
      }
      
      token = token.replace('Bearer ', '')
      const decoded = jwt.verify(token, config.jwtSecret)
      const user = await userService.getUserById(decoded._id)
      if (!user) {
        return res.status(401).send({ error: 'Request Not Authorized.' })
      }
      req.user = user
      next()
    } catch (e) {
      next(e)
    }
  }

  
module.exports = {adminAuth , userAuth}