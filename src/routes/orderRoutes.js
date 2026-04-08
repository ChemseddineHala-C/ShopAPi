const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderControllers");
const { protect } = require("../middleWare/authMiddleware");
const allowOnly = require("../middleWare/roleMiddleware");
const orderValidator = require("../validators/orderValidators");
const validateMiddleware = require("../middleWare/validateMiddleware");

router.post(
  "/",
  protect,
  allowOnly("customer"),
  orderValidator,
  validateMiddleware,
  createOrder,
);
router.get("/", protect, allowOnly("admin"), getAllOrders);
router.get("/my", protect, allowOnly("customer"), getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, allowOnly("admin"), updateOrderStatus);
router.delete("/:id", protect, allowOnly("customer"), cancelOrder);

module.exports = router;
