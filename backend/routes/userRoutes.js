const express = require("express");
const user = require("../controllers/userController.js");
const { isAuthenticatedUser, authorizeRoles } = require("../utils/auth.js");
const router = express.Router();

router.route("/register").post(user.registerUser);
router.route("/login").post(user.login);
router.route("/password/forgot").post(user.forgotPassword);
router.route("/password/reset/:token").put(user.resetPassword);
router.route("/logout").get(user.logout);
router.route("/me").get(isAuthenticatedUser, user.getYourself);
router.route("password/update").put(isAuthenticatedUser, user.updatePassword);
router.route("/me/update").put(isAuthenticatedUser, user.updateProfile);
router.route("/user").get(user.getAllUsers);
router
  .route("/update/role/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), user.updateUserRole);
router
  .route("/admin/user/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), user.userDeleted);
router
  .route("/user/:id")
  .get(user.getUserById)
  .put(user.updateUser)
  .delete(user.deleteUser);

module.exports = router;
