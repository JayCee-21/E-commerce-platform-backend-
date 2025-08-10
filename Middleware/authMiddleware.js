const jwt = require('jsonwebtoken')
const User = require('../Model/userModel')



//Middleware to verify token by admin
const authMiddleware = async (req, res, next) => {
    
    const token = req.cookies.token
    const jwtSecret = process.env.JWT_SECRET

    if(!token) {
        return res.status(401).json({message: "Not authorized"})
    }
    try {
         const secretToken = jwt.verify(token, jwtSecret)
         if(!secretToken) {
            return res.status(400).json({message: "Invalid Token"})
         }
          req.user = await User.findById(secretToken.userId).select("-password")
         if(!req.user) {
            return res.status(401).json({message: "Invalid Id"}, req.user)
         }

         next()
    } catch (error) {
        res.status(500).json(error)
    }
}

const adminCheck = async(req, res, next) => {
    const user = req.user

    //check if req.user exists and admin is true
    if(user && user.admin === true) {
        next()
    } else {
        res.status(403).json({message: "You are not authorized to access this route"})
    }
}

module.exports = {
    authMiddleware,
    adminCheck
}