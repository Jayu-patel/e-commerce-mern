const model = require("../models/category")

const addCategory=async(req,res)=>{
    try{
        const {name} = req.body
        if(name){
            const catExist = await model.findOne({name});

            if(catExist) return res.json({message: "category already exist"})

            const category = new model({name})
            await category.save()

            return res.status(201).json({message: "category added successfully"})
        }
        else res.json({message: "somthing went wrong"})
    }
    catch(error){
        res.json(error)
    }
}

const getAllCategory=async(req,res)=>{
    try{
        const category = await model.find({})

        if(category) res.status(201).json(category);
        else res.json({message: "category not found"})
    }
    catch(error){
        res.json(error)
    }
}

const updateCategory=async(req,res)=>{
    try{
        const {id} = req.params

        const category = await model.findById(id)

        if(category){
            category.name = req.body.name
            await category.save()
        }
        else res.json({message: "category not found"})
    }
    catch(error){
        res.json(error)
    }
}

const deleteCategory=async(req,res)=>{
    try{
        const data = await model.findByIdAndDelete(res.params.id)
        res.json(data)
    }
    catch(error){
        res.json(error)
    }
}

module.exports = {
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategory,
}