const model = require("../models/user")
const otpModel = require("../models/otp")
const bcrypt = require("bcrypt")
const sendEmail = require("../utils/sendEmail");
const otpGenerator = require('otp-generator');
const generateToken = require("../utils/generateToken");

const register=async(req,res)=>{
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.json({message: "Please provide all data"})
    
    const userExists = await model.findOne({ email });
    if (userExists){
        return res.status(203).json({message: "User already exists"})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new model({ username, email, password: hashedPassword });
    
    try{
        await newUser.save();
        const token = generateToken(res,{id: newUser._id, username, email, isAdmin: newUser.isAdmin})

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            token
        });
    }
    catch(e){
        res.status(400).json(e.message)
    }
}

const adminRegister=async(req,res)=>{
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.json({message: "Please provide all data"})
    
    const userExists = await model.findOne({ email });
    if (userExists){
        return res.status(203).json({message: "User already exists"})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new model({ username, email, password: hashedPassword });

    try{
        await newUser.save();

        await sendEmail(email, "New registration", `Dear user, \nYour profile credential are: \nUsername : ${username} \npassword : ${password}`);
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        });
    }
    catch(e){
        res.status(400).json(e.message)
    }
}

const login=async(req,res)=>{
    try{
        const { email, password } = req.body;
        if (!email || !password) return res.send("Please provide all data")
        const existingUser = await model.findOne({ email });
    
        if (existingUser) {
          const isPasswordValid = await bcrypt.compare( password, existingUser.password);
    
          if (isPasswordValid) {   
            const token = generateToken(res,{id: existingUser._id, username: existingUser.username, email, isAdmin: existingUser.isAdmin})
            res.status(201).json({
              _id: existingUser._id,
              username: existingUser.username,
              email: existingUser.email,
              isAdmin: existingUser.isAdmin,
              number: existingUser.number,
              address: existingUser.address,
              city: existingUser.city,
              state: existingUser.state,
              token,
            });
            return;
          }
          else return res.status(203).json({message: "Password is incorrect"})
        }
        else return res.status(203).json({message: "User not found"})
    }
    catch(e){
        return res.status(500).json({message: "Somthing went wrong"})
    }
}

const updateUser=async(req,res)=>{
    try{
        const user = await model.findById(req.params.id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.number = req.body.number || user.number;
            user.address = req.body.address || user.address;
            user.city = req.body.city || user.city;
            user.state = req.body.state || user.state;

            const updatedUser = await user.save();
        
            res.status(201).json({
              _id: updatedUser._id,
              username: updatedUser.username,
              email: updatedUser.email,
              isAdmin: updatedUser.isAdmin,
              address: updatedUser.address,
              city: updatedUser.city,
              state: updatedUser.state,
              number: updatedUser.number,
            });
        }
        else res.json({message: "user not found"})
    }
    catch(e){
        return res.status(500).json({message: "Somthing went wrong"})
    }
}

const updatePassword=async(req,res)=>{
    try{
        const email = req.query.email
        const password = req.query.password
        const user = await model.findOne({email});

        if (user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user.password = hashedPassword
            const updatedUser = await user.save();
        
            res.status(201).json({
              _id: updatedUser._id,
              username: updatedUser.username,
              email: updatedUser.email,
              isAdmin: updatedUser.isAdmin,
            });
        }
        else res.json({message: "user not found"})
    }
    catch(e){
        return res.json({message: "Somthing went wrong"})
    }
}

const removeUser=async(req,res)=>{
    try{
        const user = await model.findById(req.params.id);

        if(user){
            if(user.isAdmin){
                return res.json({message: "can not delete user"})
            }
            await model.deleteOne({ _id: user._id });
            res.status(201).json({ message: "User removed" });
        }
        else res.json({message: "user not found"})
    }
    catch(e){
        return res.status(500).json({message: "Somthing went wrong"})
    }
}
const getAllUsers=async(req,res)=>{
    try{
        const user = await model.find({}).select("-password")

        if(user){
            res.status(201).json(user)
        }
        else res.json({message: "users not found"})
    }
    catch(e){
        return res.status(500).json({message: "Somthing went wrong"})
    }
}

const generateOTP=async(req,res)=>{
    const {email} = req.params

    const user = await model.findOne({email})
    if(!user) return res.status(203).json({message: "User does not exist"});

    const otp = await otpGenerator.generate(6,{
            lowerCaseAlphabets: false, 
            upperCaseAlphabets: false, 
            specialChars: false
    })

    const otpDb = new otpModel({email,otp})
    await otpDb.save()

    await sendEmail(email, "OTP", `Dear user, \nYour otp for password update is ${otp}`);
    res.status(201).json({message: "OTP send to your registered email"})
}

const verifyOTP=async(req,res)=>{
    const email = req.query.email
    const otp = req.query.otp

    const codeExist = await otpModel.findOne({email, otp})
    console.log(codeExist)
    console.log(email,otp)

    if(codeExist){
        const otp_used = codeExist.otp_used
        console.log(otp_used)
        if(otp_used){
            return res.status(203).json({message: 'otp expired'})
        }
        else{
            codeExist.otp_used = true
            await codeExist.save()
            const token = generateToken(res,{msg: "otp verified"})
            return res.status(201).json({message: 'verify successfully', token})
        }

    }
    return res.status(202).json({message: "Invalid OTP"})
}

module.exports =  {
    login,
    register,
    updateUser,
    removeUser,
    getAllUsers,
    adminRegister,
    updatePassword,
    generateOTP,
    verifyOTP,
}