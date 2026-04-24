const Product = require("../models/productModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const getAllProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice } = req.query;

  const filter = {};
  if (category) filter.category = category;

  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const total = await Product.countDocuments(filter);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });
  res
    .status(200)
    .json({ total, page, pages: Math.ceil(total / limit), limit, products });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError("Product not found", 404);
  res.status(200).json(product);
});

const updateProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) throw new AppError("product not fount", 404);
  res.status(201).json(product);
});

const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new AppError("user not found", 404);
  res.status(204).json({ message: "Product deleted successfully" });
});

const uploadProductimg = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("Please Upload a file");

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { image: fileUrl },
    { new: true },
  );

  if (!product) throw new AppError("product not found", 404);

  res.status(200).json({
    message: "Product picture uploaded successfully",
    profilePic: fileUrl,
    product,
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  const newProduct = await Product.create({
    name: name,
    description: description,
    price: price,
    category: category,
    stock: stock,
  });

  res.status(201).json({
    message: "Product registred successfully",
    product: newProduct,
  });
});

module.exports = {
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  uploadProductimg,
  createProduct,
};
