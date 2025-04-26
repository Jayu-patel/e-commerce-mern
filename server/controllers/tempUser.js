const model = require("../models/tempUser")
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const register=async(req,res)=>{
    const {email} = req.body
    try{
        const user = new model({email})
        const token = jwt.sign({ id: user._id }, "secret-key123", { expiresIn: "1d" });

        const verificationLink = `http://localhost:8000/api/tempUser/verify/${token}`;
        await sendEmail(email, "Email Verification", `Click to verify: ${verificationLink}`)
        res.status(201).json({message: "email has been send to the user"})
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const verify=async(req,res)=>{
    const { token } = req.params;
    try{
        const decoded = jwt.verify(token, "secret-key123");
        const user = await model.findById(decoded.id)

        if(!user) return res.status(400).json({message: "verification failed"})
        else res.status(201).json({email, message: "Email verified successfully."})
    }
    catch (error) {
        res.status(500).json({ error: "Invalid or expired token." });
    }
}

module.exports = {
    register,
    verify,
}