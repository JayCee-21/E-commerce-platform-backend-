const Order = require('../Model/orderModel')
const Cart = require('../Model/cartModel')
const sendMail = require('../utils/sendEmail')

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

                  //send mail
                  try {
                    const mailObj = {
                       mailFrom: `E-commerce App ${process.env.EMAIL_USER}`,
                       mailTo: req.user.gmail,
                       subject: 'Your Order Confirmation',
                       body: `Hi ${req.user.username}, your order with id ${order._id} has been placed successfully.
                       Total Amount: ${order.totalOrderPrice}.
                       Thank you for shopping with us!`
                    }
                    const info = await sendMail(mailObj)
                  } catch (error) {
                    console.log(error)
                  }
        res.status(200).json({message: "Order placed successfully", order})
    } catch (error) {
        res.status(500).json(error)
    }
}

//get all orders by users
const getOrders = async(req,res) => {
    const userId = req.user._id
    try {
        const order = await Order.find({userId}).populate("orderItems.productId")
        res.status(200).json(order)
    } catch (error) {
       res.status(500).json(error)       
    }
}

//view all orders by admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('orderItems.productId')
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
    const orderId = req.params.id

    try {
       //find the order
    const order = await Order.findById(orderId)
    if(!order) {
        return res.status(404).json({message: "Order not found"})
    }
    if(order.status !== 'pending')
        return res.status(400).json({message: "Only pending orders can be cancelled"})

    //delete order
     order.status = "cancelled"
     await order.save()

    await Order.findByIdAndDelete(orderId)


     //send mail
                  try {
                    const mailObj = {
                       mailFrom: `E-commerce App ${process.env.EMAIL_USER}`,
                       mailTo: req.user.gmail,
                       subject: 'Order Cancelled',
                       body: `Hi ${req.user.username}, your order with id ${order._id} has been cancelled.`
                    }
                    const info = await sendMail(mailObj)
                  } catch (error) {
                    console.log(error)
                  }
    res.status(200).json({message: "Order cancelled successfully"})     
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}


module.exports = {
    placeOrder, 
    getOrders,
    getAllOrders,
    updateStatus,
    cancelOrder
}