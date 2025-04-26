const model = require("../models/product")
const Category = require('../models/category')

const addProduct=async(req,res)=>{
    try{
        const {name, price, brand, category, image, quantity, countInStock, description, imageList} = req.body

        if(!name || !price || !brand || !category || !image || !quantity || !countInStock) return res.status(400).send("please provide all data")
        const product = new model({name,price, brand, category, image, quantity, countInStock, description, imageList})
        await product.save()

        res.status(201).json({message: "product added sucessfully"})
    }
    catch(e){
        res.status(500).send(e)
    }
}
const fetchProduct=async(req,res)=>{
    const {brand, category, search, minPrice, maxPrice} = req.query
    const queryObj = {}


    if(search){
        // queryObj.name = {$regex: search, $options: 'i'};
        // queryObj.brand = {$regex: search, $options: 'i'};

        const category = {name: {$regex: search, $options: 'i'}}
        const cat = await Category.find(category)

        if(cat.length > 0){
            // queryObj.category = cat[0]._id
            queryObj.$or = [
                {name: {$regex: search, $options: 'i'}},
                {brand: {$regex: search, $options: 'i'}},
                {category: cat[0]._id}
            ]
        }
        else{
            queryObj.$or = [
                {name: {$regex: search, $options: 'i'}},
                {brand: {$regex: search, $options: 'i'}},
            ]
        }

    } 
    if(brand) queryObj.brand = brand;
    if(category) queryObj.category = category;
    if(minPrice || maxPrice){
        queryObj.price = {};
        if(minPrice) queryObj.price.$gte = Number(minPrice)
        if(maxPrice) queryObj.price.$lte = Number(maxPrice)
    }
    try{
        const products = await model.find(queryObj).populate("category")

        if(products) return res.status(201).json(products)
        else res.json({message: "product not found"})

    }
    catch(e){
        res.status(500).send(e)
    }
}
const fetchProductById=async(req,res)=>{
    try{
        const {id} = req.params
        const product = await model.findById(id).populate("category")

        if(product) return res.status(201).json(product)
        else res.status(404).json({message: "product not found"})
    }
    catch(e){
        res.status(500).send(e)
    }
}

const updateProduct=async(req,res)=>{
    try{
        const {name, price, brand, category, image, quantity, countInStock} = req.body

        switch (true) {
            case !name:
              return res.json({ error: "Name is required" });
            case !brand:
              return res.json({ error: "Brand is required" });
            case !image:
              return res.json({ error: "Image is required" });
            case !price:
              return res.json({ error: "Price is required" });
            case !category:
              return res.json({ error: "Category is required" });
            case !quantity:
              return res.json({ error: "Quantity is required" });
            case !countInStock:
              return res.json({ error: "countInStock is required" });
          }

          const product = await model.findByIdAndUpdate(
            req.params.id,
            { ...req.body }
          )
          await product.save()
          res.json({message : "Product updated"});
    }
    catch(e){
        res.status(500).send(e)
    }
}

const removeProduct=async(req,res)=>{
    try{
        const product = await model.findByIdAndDelete(req.params.id);
        res.json(product);
    }
    catch(e){
        res.status(500).send(e)
    }
}

module.exports = {
    addProduct,
    fetchProduct,
    fetchProductById,
    updateProduct,
    removeProduct
}