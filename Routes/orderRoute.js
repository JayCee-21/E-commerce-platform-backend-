const router = require('express')
const { placeOrder, getOrders,getAllOrders,updateStatus, cancelOrder } = require('../Controller/orderController')
const { authMiddleware, adminCheck } = require('../Middleware/authMiddleware')

const orderRouter = router()

orderRouter
           .post('/order/create', authMiddleware, placeOrder)
           .get('/order', authMiddleware, getOrders)
           .get('/orders', authMiddleware, adminCheck, getAllOrders)
           .put('/order/status/:id', authMiddleware, adminCheck, updateStatus)
           .delete('/order/delete/:id', authMiddleware, cancelOrder)


module.exports = orderRouter
    