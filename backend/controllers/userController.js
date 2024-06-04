const { catchAsync } = require("../utils/catchAsync.js");
const AppError = require("../utils/AppError.js");
const User = require("../models/userModel.js");
const sendToken = require("../utils/jwtToken.js");

exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: "This is sample id", url: "This is sample url" },
    role,
  });
  if (!user) {
    return next(new AppError("User cannot be created", 404));
  }
  sendToken(user, 201, res);
});
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find({});
  if (!user) {
    return next(new AppError("No user can be found", 404));
  }
  res.status(200).json({ message: "Success", user });
});
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user can be found at this id", 404));
  }
  res.status(200).json({ message: "Success", user });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("no user found at this id", 404));
  }
  res.status(200).json({ message: "Success", user });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("no user found at this id", 404));
  }
  res.status(200).json({ message: "user deleted" });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please enter email or password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const isCorrectPassword = await user.comparePassword(password);
  if (!isCorrectPassword) {
    return next(new AppError("Incorrect email or password", 401));
  }
  sendToken(user, 201, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  // res.cookie("token", null, {
  //   expiresIn: new Date(Date.now()),
  //   httpOnly: true,
  // });
  res.clearCookie("token", {
    expiresIn: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).send("Logged Out");
  res.end();
});
