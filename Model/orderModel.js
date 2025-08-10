const mongoose = require('mongoose')


const orderItems = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    quantity: {type: Number,required: true},
    price: {type: Number, required: true},
    totalItemPrice: { type: Number, required: true},
})

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    products: [orderItems],
    totalOrderPrice: { type: Number, required: true},
    status: {type: String, default: "Pending"}
}, {timestamps: true})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order