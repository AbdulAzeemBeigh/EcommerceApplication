const express = require("express");
const errorHandler = require("./controllers/errorController.js");
const app = express();
const productRouter = require("./routes/productRoutes.js");
app.use(express.json());
app.use("/api", productRouter);
app.use(errorHandler);
module.exports = app;
