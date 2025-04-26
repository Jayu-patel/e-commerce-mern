const express = require('express')
const router = express.Router();

const userController = require("../controllers/userController")

router.get("/getAllUsers", userController.getAllUsers)
router.get("/generateOtp/:email", userController.generateOTP)
router.get("/verifyOtp", userController.verifyOTP)

router.post("/login", userController.login)
router.post("/register",userController.register)
router.post("/adminRegister",userController.adminRegister)

router.put("/updateUser/:id",userController.updateUser)
router.put("/updatePass",userController.updatePassword)//

router.delete("/deleteUser/:id",userController.removeUser)

module.exports = router