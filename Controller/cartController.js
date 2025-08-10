const Cart = require('../Model/cartModel')
const Product = require('../Model/productModel')

//Adding item to cart by users
const addToCart = async (req, res) => {
          const { productId, quantity } = req.body 
          const userId = req.user._id

          try {
          //check if product exists
             const product = await Product.findById(productId)
             if(!product) {
             return res.status(404).json({message: "Product not found"})
            }

            //create a new cart
        let cart = await Cart.findOne({userId})
        if(!cart) {
        cart = new Cart({
                userId, 
                products: [{productId, 
                quantity,
                price: product.price,
                totalItemPrice: product.price * quantity}]         
        })
        }

        //check if item has been added to cart
    const existingCartItem = cart.products.find(item => item.productId.toString() === productId)
    if (existingCartItem) {
        existingCartItem.quantity += quantity
        existingCartItem.totalItemPrice = existingCartItem.quantity * existingCartItem.price
    } else {
        cart.products.push({
            productId,
            quantity,
            price: product.price,
            totalItemPrice: product.price * quantity
        })
    }

        //update the totalCartPrice of the cart
        cart.totalCartPrice = cart.products.reduce((sum, item) => sum + item.totalItemPrice, 0)

        await cart.save()
        return res.status(200).json({message: "Successful", cart})


          } catch (error) {
           res.status(500).json({message: "Error adding to cart, something went wrong", errormessage}) 
          }
}

//view all cart items by users
const getCartItems = async(req, res) => {
    const userId = req.user._id

    try {
        const cartItems = await Cart.findOne({userId}).populate('products.productId')
        if(!cartItems) {
            return res.status(404).json({message: "Cart is empty"})
        }
        res.status(200).json(cartItems)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


//update cart items by users
const editCartItems = async(req,res) => {
    const {productId} = req.params
    const{type} = req.body
    const userId = req.user._id

    try {
        //get cart item 
        const cart = await Cart.findOne({userId})
        if(!cart) {
            return res.status(404).json({message: "Cart not found"})
        }


        //find product in cart
        const existingCartItem = cart.products.find((item) => item.productId.toString() === productId)
        if(!existingCartItem) {
            return res.status(404).json({message: "Product not found in cart"})
        }

        //increase or decrease quantity
        if(type === "increase") {
            existingCartItem.quantity += 1
        } else if (type === "decrease") {
            existingCartItem.quantity -= 1
        } else {
            res.status(400).json({message: 'type can either increase or decrease'})
            return
        }

        //update total price for the product
        existingCartItem.totalItemPrice = existingCartItem.quantity * existingCartItem.price
        //update total cart price
        cart.totalCartPrice = cart.products.reduce((sum, item) => sum + item.totalItemPrice, 0)

        await cart.save()
        res.status(200).json({message: "Cart updated successfully", cart})
    } catch (error) {
        res.status(500).json(error)
    }
}



//delete cart item
const deleteCartItems = async(req, res) => {
    const {userId} = req.user._id
    const { productId } =req.params
    try {
        const cart = await Cart.findOne(userId)
        if(!cart) {
            return res.status(404).json({message: "Cart not found"})
        }
        
        //filter out the product to be deleted
        cart.products = cart.products.filter(item => item.product.toString() !== productId)

        //update totalCartPrice
        cart.totalCartPrice = cart.products.reduce((sum, item) => sum + item.totalCartPrice, 0)
        res.status(202).json({message: "Item removed successfully"})
    } catch (error) {
     res.status(500).json(error)   
    }
}



module.exports = {
    addToCart,
    getCartItems,
    editCartItems,
    deleteCartItems
}