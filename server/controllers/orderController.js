const Product = require('../models/product')
const Order = require('../models/order')

const createOrder = async(req,res)=>{
    try{
        const {orderItems, userId, address, city, state, zip, total} = req.body

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({message: "No order items"})
        }

        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((x) => x._id) },
        })

        const dbOrderItems = orderItems.map((itemFromClient) => {
            const matchingItemFromDB = itemsFromDB.find(
              (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
            );
      
            if (!matchingItemFromDB) {
              res.status(403).json(`Product not found: ${itemFromClient._id}`);
            }
      
            return {
              ...itemFromClient,
              product: itemFromClient._id,
              price: matchingItemFromDB.price,
              _id: undefined,
            };
        });

        const order = new Order({
            orderItems: dbOrderItems,
            user: userId,
            address,
            city,
            state,
            zip,
            total,
        })

        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
    catch(err){
        res.status(202).json({err: err.message})
    }
}

const createNewOrder = async(req,res)=>{
    try{
        const {orderItems, userId, address, city, state, zip, total} = req.body

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({message: "No order items"})
        }

        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((x) => x.product) },
        })

        const dbOrderItems = orderItems.map((itemFromClient) => {
            const matchingItemFromDB = itemsFromDB.find(
              (itemFromDB) => itemFromDB._id.toString() === itemFromClient.product
            );
      
            if (!matchingItemFromDB) {
              res.status(404).json(`Product not found: ${itemFromClient.product}`);
            }
      
            return {
              ...itemFromClient,
              product: itemFromClient.product,
              price: matchingItemFromDB.price,
              _id: undefined,
            };
        });

        const order = new Order({
            orderItems: dbOrderItems,
            user: userId,
            address,
            city,
            state,
            zip,
            total,
        })

        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
    catch(err){
        res.status(202).json({err: err.message})
    }
}

const getOrders=async(req,res)=>{
    try{
        // const order = await Order.find().populate("user", "id username")
        const order = await Order.find().populate("user", "username")
        res.json(order)
    }
    catch(err){
        res.status(202).json({err: err.message})
    }
}

const getOrdersById=async(req,res)=>{
    try{
        const orders = await Order.find({user: req.params.id})

        if(!orders){
            res.json({message: "order not found"})
        }
        else{
            res.status(201).json(orders)
        }
    }
    catch(err){
        res.status(202).json({err: err.message})
    }
}

const successPayment=async(req,res)=>{
    try{
        const id = req.params.id

        const order = await Order.findById(id)
        if(order){
            order.isPaid = true
            await order.save()
        }
        res.status(201).json({message: "Payment is verified"})
    }
    catch(err){
        res.status(202).json({err: err.message})
    }
}

const setPaymentId=async(req,res)=>{
    const id = req.params.id
    const {payId} = req.body

    const order = await Order.findById(id)
    if(order){
        order.payId = payId
        await order.save()
        return res.status(201).json({message: "order updated"})
    }
    else return res.json({message: "order not found"})
}

module.exports = {
    createOrder,
    createNewOrder,
    successPayment,
    setPaymentId,
    getOrdersById,
    getOrders
}