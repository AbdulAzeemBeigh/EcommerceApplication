const express = require("express");
const Product = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../utils/auth");
const AppError = require("../utils/AppError");
const router = express.Router();

router
  .route("/products")
  .get(Product.getAllProducts)
  .post(isAuthenticatedUser, authorizeRoles("admin"), Product.createProduct);

router
  .route("/products/:id")
  .get(Product.getProductById)
  .patch(isAuthenticatedUser, authorizeRoles("admin"), Product.updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), Product.deleteProduct);
module.exports = router;
