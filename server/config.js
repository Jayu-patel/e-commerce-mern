const mongoose = require("mongoose")

let link = "mongodb+srv://JayuPatel:mernpassmongo@cluster1.hvuu6u9.mongodb.net/Izonnet-e-com"
const connectDB = async ()=>{
    try {
        // await mongoose.connect("mongodb://127.0.0.1:27017/e_com")
        await mongoose.connect(link);
        console.log(`Successfully connnected to mongoDB 👍`)
      } catch (error) {
        console.error(`ERROR: ${error.message}`)
        process.exit(1)
      }
}

module.exports = connectDB
