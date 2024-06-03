const { catchAsync } = require("../utils/catchAsync.js");
const AppError = require("../utils/AppError.js");
const Product = require("../models/productModel.js");
const apiFeatures = require("../utils/apiFeatures.js");

exports.createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    price,
    rating,
    images,
    category,
    stock,
    numOfReviews,
    reviews,
  } = req.body;
  const product = await Product.create({
    name,
    description,
    price,
    rating,
    images,
    category,
    stock,
    numOfReviews,
    reviews,
  });
  if (!product) {
    return next(new AppError("Product creation failed", 404));
  }
  res.status(200).json({ message: "Success", product });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const apiFeature = new apiFeatures(Product.find({}), req.query).search();
  const product = await apiFeature.query;
  if (!product) {
    return next(new AppError("No products found", 404));
  }
  res.status(200).json({ message: "Success", product });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("No products found at this id"));
  }
  res.status(200).json({ message: "Success", product });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new AppError("No products found at this id", 404));
  }
  res.status(200).json({ message: "Success", product });
});
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError("No product found at this id"));
  }
  res.status(200).json({ message: "Product Deleted" });
});
