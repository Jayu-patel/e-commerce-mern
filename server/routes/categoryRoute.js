const express = require('express')
const router = express.Router();

const categoryContoller = require("../controllers/categoryController")

router.get("/getCategory", categoryContoller.getAllCategory)

router.post("/addCategory", categoryContoller.addCategory)

router.put("/updateCategory", categoryContoller.updateCategory)

router.delete("/deleteCategory", categoryContoller.deleteCategory)

module.exports = router