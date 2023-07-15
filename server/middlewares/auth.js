const jwt = require('jsonwebtoken')
const User  = require('../models/User')




// check if token is valid and if user is admin
const adminAuth = async (req, res, next) => {
    try {
      let token = req.header('Authorization')
      if (!token) {
        return res.status(401).send({ error: 'Token not found.' })
      }

      token = req.header('Authorization').replace('Bearer ', '')
      const decodedToken = jwt.decode(token, { complete: true })
      const phoneNumber = decodedToken.payload.preferred_username
  
      // Check if user is admin
      // const user = await User.findOne({ phoneNumber })
      // if (!user || !user.organization_admin) {
      //   return res.status(401).send({ error: 'Request Not Authorized.' })
      // }
  
      // Verify token with Keycloak
      // const checkKeycloak = await keycloak.isTokenValid(token)
      // if (!checkKeycloak) {
      //   return res.status(401).send({ error: 'Request Not Authorized.' })
      // }
  
      // req.admin = user.organization_admin
      // req.user = user
      // next()
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
      const decodedToken = jwt.decode(token, { complete: true })
      const phoneNumber = decodedToken.payload.preferred_username
  
      // Find user by phone number
      // const user = await User.findOne({ phoneNumber })
      // if (!user) {
      //   return res.status(401).send({ error: 'Request Not Authorized.' })
      // }
  
      // Verify token with Keycloak
      // const checkKeycloak = await keycloak.isTokenValid(token)
      // if (!checkKeycloak) {
      //   return res.status(401).send({ error: 'Request Not Authorized.' })
      // }
  
      // req.user = user
      // req.admin = user.organization_admin
      next()
    } catch (e) {
      next(e)
    }
  }

  
module.exports = {adminAuth , userAuth}