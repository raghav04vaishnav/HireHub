const { rateLimit } = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        message: "Too many login attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        message: "Too many signup attempts. Please try again after 1 hour."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    message: {
        message: "Too many password reset requests. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const verifyOtpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        message: "Too many OTP verification attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        message: "Too many password reset attempts. Try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const applyJobLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: {
        message: "Too many job applications. Please try again after 1 hour."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { loginLimiter, signupLimiter, forgotPasswordLimiter, verifyOtpLimiter, resetPasswordLimiter, applyJobLimiter };