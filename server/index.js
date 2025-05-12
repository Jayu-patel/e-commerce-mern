const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require('cookie-parser')
const connectDB = require("./config")
const createAdmin = require("./utils/createAdmin")

require('dotenv').config()

const port = process.env.PORT || 8000

app.use(cors({
    origin: "https://e-commerce-mern-frontend-six.vercel.app"
}))
app.use(express.json())
app.use(cookieParser())
const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoute")
const categoryRoutes = require("./routes/categoryRoute")
const tempUserRoute = require("./routes/tempUserRoute")
const orderRoute = require("./routes/orderRoute")
const stripeRoute = require('./routes/stripe');
const uploadRoute = require('./controllers/imageUpload');

connectDB()
createAdmin()

app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/tempUser", tempUserRoute)
app.use("/api/order", orderRoute)
app.use("/api/image", uploadRoute)
app.use("/api/stripe", stripeRoute)

app.use("/",(req,res)=>{
    res.send("server is running")
})
app.listen(port,()=>{console.log("server started...")})
