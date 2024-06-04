const User = require("../models/userModel");
const AppError = require("./AppError");
const { catchAsync } = require("./catchAsync");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new AppError("Please login to have access", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role:${req.user.role} is not allowed to have access to this resource`,
          403
        )
      );
    }
    next();
  };
};
