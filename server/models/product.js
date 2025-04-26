const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const schema = mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    brand: {type: String, required: true},
    category: {type: ObjectId, ref: "Category",  required: true},
    image: {type: String, required: true},
    imageList: {
        type: [String]
    },
    quantity: {type: Number, required: true},
    countInStock: {type: Number, required: true},
    description: {type: String}
},
{timestamps: true}
)

module.exports = mongoose.model("Product",schema)