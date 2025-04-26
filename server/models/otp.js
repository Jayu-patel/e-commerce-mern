const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const schema = mongoose.Schema({
    otp: {type: Number, required: true},
    email: {type: String,  required: true},
    otp_used: {type: Boolean, required: true, default: false}
},
{timestamps: true}
)

module.exports = mongoose.model("Otp",schema)