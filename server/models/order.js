const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema

const schema = mongoose.Schema({
    user: {type: ObjectId, required: true, ref: "User"},
    orderItems: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
            type: ObjectId,
            required: true,
            ref: "Product",
        }
    }],
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    payId: {
        type: String,
    },
    total: {
        type: Number,
    }
})

module.exports = mongoose.model("Order", schema);