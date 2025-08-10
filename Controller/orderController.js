const Order = require('../Model/orderModel')
const Cart = require('../Model/cartModel')

//making an order by the user
const placeOrder = async(req,res) => {
    const userId = req.user._id
    try {
        const cart = await Cart.findOne({userId}).populate("products.productId")
        if(!cart) {
            return res.status(400).json({message: "Cart is empty"})
        }
        
        //create order
        const order = new Order({
            userId,
            products: cart.products,
            totalOrderPrice: cart.totalCartPrice,
            status: "pending"
        })
        await order.save()
        res.status(200).json({message: "Order placed", order})
    } catch (error) {
        res.status(500).json(error)
    }
}

//get all orders by users
const getOrders = async(req,res) => {
    const userId = req.user._id
    try {
        const order = await Order.find({userId}).populate("orderItems.product")
        res.status(200).json(order)
    } catch (error) {
       res.status(500).json(error)       
    }
}

//view all orders by admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('products.productId')
        return res.status(200).json(orders)
    } catch (error) {
        res.status(500).json(error)
    }
}

//updating order status by admin
const updateStatus = async(req, res) => {
    const { id } = req.params
const { status } = req.body

try {
    const orderedItem = await Order.findById(id)
    if(!orderedItem) {
        return res.status(404).json({message: "Order not found"})
    }
    orderedItem.status = status
    await orderedItem.save()
    res.status(200).json({message: "Order status updated successfully", orderedItem})
} catch (error) {
    res.status(500).json(error)
}
}

//removing order by user
const cancelOrder = async ( req, res ) => {
    const userId = req.user._id
    const orderId = req.params.id

    try {
       //find the order
    const order = await Order.findOne({orderId, userId})
    if(!order) {
        return res.status(404).json({message: "Order not found"})
    }
    if(order.status !== 'Pending')
        return res.status(400).json({message: "Only pending orders can be cancelle"})

    //delete order
    await Order.findByIdAndDelete({orderId})
    res.status(200).json({message: "Order cancelled successfully"})     
    } catch (error) {
        res.status(500).json(error)
    }
}


module.exports = {
    placeOrder, 
    getOrders,
    getAllOrders,
    updateStatus,
    cancelOrder
}