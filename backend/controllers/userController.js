const { catchAsync } = require("../utils/catchAsync.js");
const AppError = require("../utils/AppError.js");
const User = require("../models/userModel.js");
const sendToken = require("../utils/jwtToken.js");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

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
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("user nor found", 404));
  }
  const resetToken = user.resetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}//${req.get(
    "host"
  )}/api/password/reset/${resetToken}`;
  const message = `Your password token is :-\n\n ${resetPasswordUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Forgor Password",
      message,
    });
    res.status(200).send(`Email send to user:${user.email} successfully`);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(error.message, 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("No user found", 404));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new AppError("Incorrect Password", 404));
  }
  user.password = req.body.password;
  await user.save();
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  sendToken(user, 200, res);
});

exports.getYourself = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("Loin in again", 404));
  }
  res.status(200).json({ message: "Success", user });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordCorrect = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect Password", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new AppError("Password does not match", 400));
  }
  user.password = req.body.newPassword;
  user.save();
  sendToken(user, 200, res);
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  //Profile picture
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ message: "Updated", user });
});

exports.updateUserRole = catchAsync(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ message: "Updated", user });
});

exports.userDeleted = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found at this id", 400));
  }
  res.status(200).send("Deleted");
});
