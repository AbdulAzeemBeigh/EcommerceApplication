const express = require("express");
const Product = require("../controllers/productController");
const router = express.Router();

router
  .route("/products")
  .get(Product.getAllProducts)
  .post(Product.createProduct);

router
  .route("/products/:id")
  .get(Product.getProductById)
  .patch(Product.updateProduct)
  .delete(Product.deleteProduct);
module.exports = router;
