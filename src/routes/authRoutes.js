const express = require("express");
const router = express.Router();
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidators");
const validateMiddleware = require("../middleWare/validateMiddleware");
const { register, login, refresh, logout } = require("../controllers/authControllers");

router.post("/register", registerValidator, validateMiddleware, register);
router.post("/login", loginValidator, validateMiddleware, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
