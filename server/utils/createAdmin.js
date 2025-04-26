const model = require("../models/user")
const bcrypt = require("bcrypt")


const createAdmin=async()=>{
    const adminExists = await model.exists({ isAdmin: true })


    if(!adminExists){

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin", salt);
        const admin = new model({
            username: "admin",
            email: "admin@gmail.com",
            password : hashedPassword,
            isAdmin: true
        })

        await admin.save()
    }
}

module.exports = createAdmin