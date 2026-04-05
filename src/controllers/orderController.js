const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const createOrder = asyncHandler( async (req,res) => {
    let totalPrice = 0;
    let items = [];
    for (const item of req.body.items){
        const product = await Product.findById(item.productId);
        if (!product) throw new AppError("Product not found",404);

        if (item.quantity > product.stock) throw new AppError("Not enough stock",400);

        totalPrice += item.quantity * product.price;


    }
})