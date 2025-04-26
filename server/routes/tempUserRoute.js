const express = require('express')
const router = express.Router();

const controller = require("../controllers/tempUser")

router.post("/register", controller.register)

router.get("/verify/:token", controller.verify)


module.exports = router