const stripe = require("stripe")(process.env.STRIPE_SECRET)

const checkOut=async(req,res)=>{
    const {products} = req.body

    const items = products.map(product=>({
        price_data:{
            currency:"inr",
            product_data:{
                name: product.name,
                images: [product.image]
            },
            unit_amount: Math.round(product.price * 100)
        },
        quantity: product.quantity
    }))

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items,
        mode: "payment",
        success_url: `http://localhost:3000/payment-success`,
        cancel_url: `http://localhost:3000/payment-cancel`,
    })

    res.json({id: session.id})
}

const verifyPayment=async(req,res)=>{
    try{
        const id = req.params.id
        console.log(id)
        // const paymentIntent = await stripe.paymentIntents.retrieve(id);
        const paymentIntent =  await stripe.checkout.sessions.retrieve(id);
        res.status(201).json({ status: paymentIntent.payment_status });
    }
    catch(err){
        res.status(202).json({err: err.message})
    }
}

const getSession=async(req,res)=>{
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Session ID is required" });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(id);
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    checkOut,
    verifyPayment,
    getSession
}