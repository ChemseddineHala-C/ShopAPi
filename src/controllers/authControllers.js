const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES },
  );
};

const createRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingEmail = await User.findOne({ email: email });
  if (existingEmail) throw new AppError("Email already registered", 400);

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
    role: role,
  });

  const refreshToken = createRefreshToken(newUser);
  const accessToken = createAccessToken(newUser);

  await User.findByIdAndUpdate(newUser._id, { refreshToken: refreshToken });

  res.status(201).json({
    message: "User registred successfully",
    accessToken: accessToken,
    refreshToken: refreshToken,
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

  const accesstoken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken });

  res.status(200).json({
    message: "Login successful",
    accessToken: accesstoken,
    refreshToken: refreshToken,
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

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) throw new AppError("Refresh token is required", 401);

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== refreshToken)
    throw new AppError("Invalid refresh token", 401);

  const newaccessToken = createAccessToken(user);

  res.status(200).json({
    newaccessToken: newaccessToken,
  });
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError("Refresh token is required", 400);

  const user = await User.findOne({ refreshToken: refreshToken });
  if (!user) throw new AppError("Invalid refresh token", 401);

  await User.findByIdAndUpdate(user._id, { refreshToken: null });

  res.status(200).json({
    message: "Logout successful",
  });
});

module.exports = { register, login, refresh, logout };
