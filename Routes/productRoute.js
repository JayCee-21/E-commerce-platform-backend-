const router = require('express')
const { createProduct, getAllProducts, getOneProduct, updateProduct, deleteProduct } = require('../Controller/productController')
const { authMiddleware, adminCheck } = require('../Middleware/authMiddleware')

const productRouter = router()


productRouter
            .post('/products/create',authMiddleware, adminCheck, createProduct)
            .get('/product/:id', getOneProduct)
            .get('/products', getAllProducts)
            .put('/update/product/:id', authMiddleware, adminCheck, updateProduct)
            .delete('/delete/product/:id', authMiddleware, adminCheck, deleteProduct)


module.exports = productRouter