const router = require('express')
const { loggingIn, loggingOut } = require('../Controller/authController')



const authRouter = router()

authRouter
         .post('/login', loggingIn)
         .post('/logout', loggingOut)



module.exports = authRouter         