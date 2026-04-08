const express = require("express");
const router = express.Router();
const { protect } = require("../middleWare/authMiddleware");
const allowOnly = require("../middleWare/roleMiddleware");
const reviewValidator = require("../validators/reviewValidators");
const validateMiddleware = require("../middleWare/validateMiddleware");
const {
  createReview,
  getReviewsByProduct,
  deleteReview,
} = require("../controllers/reviewControllers");

router.post(
  "/:productId",
  protect,
  allowOnly("customer"),
  reviewValidator,
  validateMiddleware,
  createReview,
);
router.get("/:productId", getReviewsByProduct);
router.delete("/:id", protect, deleteReview);

module.exports = router;
