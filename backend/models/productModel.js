const { Timestamp } = require("bson");
const mongoose = require("mongoose");
const { type } = require("os");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter your description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      maxLength: [8, "price cannot exceed 8 characters"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please enter product category"],
    },
    stock: {
      type: String,
      required: [true, "Please enter product stock"],
      maxLength: [4, "stock cannot be exceed 4 characters"],
      default: 1,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
        },
      },
    ],
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
