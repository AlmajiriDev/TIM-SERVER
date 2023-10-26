const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { verifyEmailToken, verifyAccessToken } = require("../controllers/refreshToken");

router.post("/register", authController.signUpUser);
router.post("/login", authController.loginUser);
router.put("/verify-email/:emailToken", verifyEmailToken, authController.verifyUser);
router.put("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgetPassword", authController.forgotPassword);
router.put("/resetPassword/:emailToken", verifyEmailToken, authController.resetPassword);

module.exports = router;
