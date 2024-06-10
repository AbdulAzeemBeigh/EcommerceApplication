const { catchAsync } = require("../utils/catchAsync.js");
const AppError = require("../utils/AppError.js");
const Product = require("../models/productModel.js");
const apiFeatures = require("../utils/apiFeatures.js");

exports.createProduct = catchAsync(async (req, res, next) => {
  // req.body.user = req.user.id;
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
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new apiFeatures(Product.find({}), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const product = await apiFeature.query;
  if (!product) {
    return next(new AppError("No products found", 404));
  }
  res.status(200).json({ message: "Success", product, productCount });
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
exports.createProductReview = catchAsync(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const reviews = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() == req.user._id) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(reviews);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.ratings =
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    }) / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).send("Success");
});
