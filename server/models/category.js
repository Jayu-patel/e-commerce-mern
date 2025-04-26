const mongoose = require("mongoose")

const schema = mongoose.Schema({
    name :{
        type: String,
        require: true,
        unique: true,
    }
})

module.exports = mongoose.model("Category", schema);