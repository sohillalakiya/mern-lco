const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number
})

const Productcart = mongoose.model("ProductCart", productCartSchema)

const orderSchema = new mongoose.Schema({
    products: [productCartSchema],
    transacation_id: {},
    amount: Number,
    status: {
        type: String,
        default: "",
        enum: ["Cancelled", "delivered", "Shipped", "Processing", "Received"]
    },
    address: String,
    update: Date,
    user: {
        type: ObjectId,
        ref: "userSchema"
    }
}, { timestamps: true });


const Order = mongoose.model("Order", orderSchema);

module.exports = { Productcart, Order }