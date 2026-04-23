const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const createOrder = asyncHandler(async (req, res) => {
  const { items, address } = req.body;
  let temp = [];
  let totalPrice = 0;
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new AppError("Product not found", 404);

    if (item.quantity > product.stock)
      throw new AppError("Not enough stock", 400);

    totalPrice += item.quantity * product.price;

    const updateProduct = await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: -item.quantity } },
      { new: true },
    );
    if (!updateProduct) throw new AppError("Product not found", 404);

    temp.push({
      product: item.productId,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const newOrder = await Order.create({
    user: req.user.id,
    items: temp,
    totalPrice: totalPrice,
    address: address,
  });

  res.status(201).json(newOrder);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.status(200).json(orders);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  if (!orders) throw new AppError("Orders not found", 404);
  res.status(200).json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Order not found", 404);
  res.status(200).json(order);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );
  if (!order) throw new AppError("Order not found", 404);
  res.status(201).json(order);
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Order not found", 404);

  if (order.user.toString() !== req.user.id)
    throw new AppError("That's not your order", 403);

  if (order.status !== "pending") throw new AppError("You can't cancel", 400);

  for (const item of order.items) {
    const product = await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: item.quantity } },
      { new: true },
    );

    if (!product) throw new AppError("product not found", 404);
  }

  const updateOrder = await Order.findByIdAndUpdate(
    order._id,
    { status: "cancelled" },
    { new: true },
  );

  if (!updateOrder) throw new AppError("order not found", 404);
  res.status(200).json(updateOrder);
});

module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
