const express = require('express')
const router = express.Router();

const productController = require("../controllers/productController")

router.get("/getAllProducts", productController.fetchProduct)
router.get("/getProduct/:id", productController.fetchProductById)

router.post("/addProduct", productController.addProduct)

router.put("/updateProduct/:id", productController.updateProduct)

router.delete("/deleteProduct/:id", productController.removeProduct)

module.exports = router