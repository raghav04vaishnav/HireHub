const express = require("express");
const router = express.Router();

const { userSignup, userLogin, forgetPw, verifyOtp, resetPassword, getallusers } = require("../controller/userController");

const { protect, authorizeRole } = require("../middleware/auth");

const { signupLimiter, loginLimiter, forgotPasswordLimiter, resetPasswordLimiter } = require("../middleware/rateLimiter");


router.post("/signup", signupLimiter, userSignup);
router.post("/login", loginLimiter, userLogin);

router.post("/forget", forgotPasswordLimiter, forgetPw);
router.post("/verify-otp", resetPasswordLimiter, verifyOtp);
router.post("/reset", resetPasswordLimiter, resetPassword);

router.get("/getusers", protect, authorizeRole("admin"), getallusers);


module.exports = router;