const { object } = require("webidl-conversions");
const AppError = require("../utils/AppError.js");

function handleDBCastError(error) {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
}
function handleDBValidationError(error) {
  // const error = error.errors;
  const errorMessages = object.values(error);
  const message = errorMessages.map((err) => err.message).join(" ");
  return new AppError(message, 400);
}
function handleDBDuplicateError(error) {
  const name = object.keys(error.keyValue);
  const message = `Duplicate field name ${name}. Please provide the valid name`;
  return new AppError(`ERROR:${message}`, 400);
}
function sendDevError(err, res) {
  return res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack,
  });
}
function sendProdError(err, res) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(500).json({
      status: "ERROR",
      message: "Something went wrong...",
    });
  }
}

module.exports = (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "castError") {
      err = handleDBCastError(err);
    }
    if (err.code === 11000) {
      err = handleDBDuplicateError(err);
    }
    if (err.code === "validationError") {
      err = handleDBValidationError(err);
    }
    sendProdError(err, res);
  }
};
