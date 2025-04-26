const express = require('express')
const router = express.Router();

const controllers = require("../controllers/stripeCheckOut")

router.get("/verify-payment/:id", controllers.verifyPayment)//
router.get("/get-session/:id", controllers.getSession)//

router.post("/check-out", controllers.checkOut)//

module.exports = router