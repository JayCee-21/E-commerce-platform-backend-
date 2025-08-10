const router = require('express')
const { createUser, getAllUsers, getUserById } = require('../Controller/userController')
const {authMiddleware, adminCheck} = require('../Middleware/authMiddleware')
const userRouter = router()


userRouter
          .post('/user/register', createUser)
          .get('/users',authMiddleware, adminCheck, getAllUsers)
          .get('/user/:id',authMiddleware, adminCheck, getUserById)

module.exports = userRouter