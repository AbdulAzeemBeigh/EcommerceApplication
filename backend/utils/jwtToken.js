// creating token and saving in cookie
const sendToken = async (user, statusCode, res) => {
  const token = user.getJWTToken();
  const options = {
    expiresIn: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ message: "Success", user, token });
};
module.exports = sendToken;
