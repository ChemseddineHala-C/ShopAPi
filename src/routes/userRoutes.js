const express = require("express");
const router = express.Router();
const { protect } = require("../middleWare/authMiddleware");
const allowOnly = require("../middleWare/roleMiddleware");
const upload = require("../config/multerConfig");
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  uploadProfilePic,
} = require("../controllers/userControllers");

router.get("/", protect, allowOnly("admin"), getAllUsers);
router.get("/:id", protect, getUserById);
router.delete("/:id", protect, allowOnly("admin"), deleteUserById);
router.put(
  "/profile/picture",
  protect,
  upload.single("profilePic"),
  uploadProfilePic,
);
router.put("/:id", protect, updateUserById);

module.exports = router;
