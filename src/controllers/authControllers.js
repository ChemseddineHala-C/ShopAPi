const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, address, phone } = req.body;

  const existingEmail = await User.findOne({ email: email });
  if (existingEmail) throw new AppError("Email already registred", 400);

  const hashedPassowrd = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name: name,
    email: email,
    passowrd: hashedpassword,
    role: role,
    phone: phone,
    address: address,
  });

  const token = createToken(newUser);

  res.status(201).json({
    message: "User registred successfully",
    token: token,
    user: {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      address: newUser.address,
      phone: newUser.phone,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const token = createToken(user);

  res.status(200).json({
    message: "Login successful",
    token: token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      phone: user.phone,
    },
  });
});

module.exports = { register, login };
