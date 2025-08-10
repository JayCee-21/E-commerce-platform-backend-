const Product = require('../Model/productModel')


// creating products by admin

const createProduct = async(req, res) => {
    
    const { productName, description, price, category, quantity, image } = req.body
    const user = req.user //admin user
 
     if(!productName || !description || !price || !category || !quantity ||!image  ) {
        return res.status(400).json({message: "Fields Required"})
     }

     //get path if image was uploaded
     
    const imagePath = req.body.image || ""

    try {
        const newProduct =  new Product({productName, description, price, category, quantity, image: imagePath})
        await newProduct.save()
        return res.status(200).json({message: "Product created successfully"})
    } catch (error) {
        res.status(500).json(error)
    }
}


// get all products by everyone
const getAllProducts = async(req, res) => {
    const {category} = req.query
    
    try {
        let products
        if(category) {
            products = await Product.find({category: new RegExp(category, "i")})
        } else {
            products = await Product.find()
        }
        return res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get one product by loggedin users

const getOneProduct = async(req, res) => {
    const {id} = req.params
    try {
        const product = await Product.findById(id)
        await product.save()
        return res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
}



//update product (admin only)

const updateProduct = async(req, res) => {
    const {id} = req.params
    const {productName, description, price, quantity, category, image} = req.body
    try {
        const updatedProduct = await Product.findById( id )
        if(!updatedProduct) {
            return res.status(400).json({message: "Product not found"})
        }

        //update only provided fields

        updatedProduct.productName = productName ?? updatedProduct.productName
        updatedProduct.description = description ?? updatedProduct.description
        updatedProduct.price = price ?? updatedProduct.price
        updatedProduct.category = category ?? updatedProduct.category
        updatedProduct.quantity = quantity ?? updatedProduct.quantity
        updatedProduct.image = image ?? updatedProduct.image
        

        await updatedProduct.save()
        return res.status(200). json(updatedProduct)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


// delete products (admin only)

const deleteProduct = async(req, res) => {
    const { id } = req.params

    try {
        const deletedProduct = await Product.findByIdAndDelete( id )
        if(!deletedProduct) {
            return res.status(404).json({message: "Product not found"})
        }
        res.status(200).json({message: "Product Deleted Successfully"})
    } catch (error) {
        res.status(500).json(error)
    }
}


module.exports = {
    createProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct
}