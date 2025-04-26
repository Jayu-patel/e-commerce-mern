const express = require('express')
const router = express.Router();

const orderController = require("../controllers/orderController")

router.get("/get-order-by-id/:id", orderController.getOrdersById)//
router.get("/get-orders", orderController.getOrders)//

router.post("/createOrder", orderController.createOrder)//
router.post("/createNewOrder", orderController.createNewOrder)//

router.put("/success-payment/:id", orderController.successPayment)//
router.put("/setPaymentId/:id", orderController.setPaymentId)//

module.exports = router