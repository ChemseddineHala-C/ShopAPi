const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const Review = require("../models/reviewModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const createReview = asyncHandler(async (req, res) => {
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

  const reviews = await Review.find({ product: req.params.productId });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(req.params.productId, {
    avgRating: avg || 0,
  });

  res.status(201).json(newReview);
});

const getReviewsByProduct = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate(
    "user",
    "name",
  );
  res.status(200).json(reviews);
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError("Review not found", 404);

  if (review.user.toString() !== req.user.id && req.user.role !== "admin")
    throw new AppError("Not authorized", 403);

  await Review.findByIdAndDelete(req.params.id);

  // Recalculate avgRating
  const reviews = await Review.find({ product: review.product });
  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  await Product.findByIdAndUpdate(review.product, { avgRating: avg });

  res.status(200).json({ message: "Review deleted successfully" });
});

module.exports = { createReview, getReviewsByProduct, deleteReview };
