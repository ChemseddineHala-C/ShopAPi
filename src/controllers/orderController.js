const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const createOrder = asyncHandler( async (req,res) => {
    const items = req.body;
    const totalPrice = items.reduce((item) => {
        const product = await Product.findBYId(item.productId);
        if (!product) throw new AppError("Product not found",404);

        if (product.stock < item.quantity) throw new AppError("Not enough stock",400);
        const totalPrice = item.quantity * product.price;


        const updateProduct = await Product.findByIdAndUpdate(
            item.id,
            {stock:{$inc: -item.quantity}},
            {new:true},
        );

        const newOrder = await Order.create({
            
        })


    },0);
})