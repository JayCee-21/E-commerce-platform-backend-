const router = require('express')
const {addToCart, getCartItems, editCartItems, deleteCartItems} = require('../Controller/cartController')
const { authMiddleware } = require('../Middleware/authMiddleware')

const cartRouter = router()

cartRouter
         .post('/cart/add',authMiddleware, addToCart)
         .get('/carts',authMiddleware, getCartItems)
         .put('/cart/update/:productId',authMiddleware, editCartItems)
         .delete('/cart/delete/:productId',authMiddleware, deleteCartItems)



module.exports = cartRouter