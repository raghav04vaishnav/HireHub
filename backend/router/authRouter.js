const express = require("express");
const router = express.Router();
const { userSignup, userLogin, resetPassword, forgetPw, verifyOtp, getallusers, createAdmin, changePassword } = require("../controller/userController");
const { protect, authorizeRole } = require("../middleware/auth");
const { signupLimiter, loginLimiter, forgotPasswordLimiter, resetPasswordLimiter } = require("../middleware/rateLimiter");


router.post("/signup", signupLimiter, userSignup);
router.post("/login", loginLimiter, userLogin);
router.post("/forget", forgotPasswordLimiter, forgetPw);
router.post("/verify-otp", resetPasswordLimiter, verifyOtp);
router.post("/reset", resetPasswordLimiter, resetPassword);
router.get("/getusers", protect, authorizeRole("admin"), getallusers);
router.post("/create-admin", createAdmin);
router.put("/change-password", protect, changePassword);

// Verify logged-in user
router.get("/me", protect, (req, res) => {
    res.status(200).json({ message: "User verified successfully", user: req.user });
});

module.exports = router;
