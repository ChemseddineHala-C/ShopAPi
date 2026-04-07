const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const Review = require("../models/reviewModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const createReview = asyncHanler(async (req, res) => {
  const order = await Order.findOne({
    user: req.user.id,
    status: "delivered",
    "items.product": req.params.productId,
  });

  if (!order) throw new AppError("Order not found", 404);

  const review = await Review.findOne({
    user: req.user.id,
    product: req.params.productId,
  });
  if (review) throw new AppError("You already reviewed this product", 400);

  const newReview = await Review.create({
    user: req.user.id,
    product: req.params.productId,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  const reviews = await Review.find({ product: productId });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(productId, { avgRating: avg || 0 });

  res.status(201).json(newReview);
});
