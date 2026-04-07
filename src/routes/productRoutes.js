const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const allowOnly = require("../middleWare/roleMiddleware");
const upload = require("../config/multerConfig");
const {
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  uploadProductimg,
  createProduct,
} = require("../controllers/productControllers");
const productValidator = require("../validators/productValidators");
const validateMiddleware = require("../middleWare/validateMiddleware");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  protect,
  allowOnly("admin"),
  productValidator,
  validateMiddleware,
  createProduct,
);
router.put("/:id", protect, allowOnly("admin"), updateProductById);
router.delete("/:id", protect, allowOnly("admin"), deleteProductById);
router.put(
  "/:id/image",
  protect,
  allowOnly("admin"),
  upload.single("image"),
  uploadProductimg,
);

module.exports = router;
