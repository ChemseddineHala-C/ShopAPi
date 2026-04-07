const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const allowOnly = require("../middleWare/roleMiddleware");
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  uploadProfilePic,
} = require("../controllers/userController");

router.get("/", protect, allowOnly("admin"), getAllUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUserById);
router.delete("/:id", protect, allowOnly("admin"), deleteUserById);
router.put("/profile/picture", protect, uploadProfilePic);

module.exports = router;
