const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../sendEmail");

const userSignup = async (req, res) => {
    try {
        const { email, password, name, phoneNumber } = req.body;

        if (!email || !password || !name || !phoneNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await userModel.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            name,
            email: normalizedEmail,
            password: hashPassword,
            role: "user",
            phoneNumber
        });

        return res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server authentication configuration error" });
        }

        const existingUser = await userModel.findOne({
            email: email.toLowerCase().trim()
        });

        if (!existingUser) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "5d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Send OTP to email
const forgetPw = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await userModel.findOne({ email: normalizedEmail });

        // Do not reveal whether an email is registered
        if (!user) {
            return res.status(200).json({
                message: "If this email is registered, an OTP has been sent."
            });
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        user.resetOtp = crypto.createHash("sha256").update(otp).digest("hex");
        user.resetOtpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        user.resetOtpVerified = false;

        await user.save();

        try {
            await sendEmail(
                normalizedEmail,
                "HireHub Password Reset OTP",
                `<div style="font-family:Arial,sans-serif">
                    <h2>HireHub Password Reset</h2>
                    <p>Your verification OTP is:</p>
                    <h1 style="letter-spacing:8px">${otp}</h1>
                    <p>This OTP is valid for 5 minutes.</p>
                    <p>Do not share this OTP with anyone.</p>
                </div>`
            );
        } catch (emailError) {
            user.resetOtp = null;
            user.resetOtpExpiry = null;
            user.resetOtpVerified = false;
            await user.save();

            return res.status(500).json({
                message: "Unable to send OTP. Please try again."
            });
        }

        return res.status(200).json({
            message: "If this email is registered, an OTP has been sent."
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Verify email OTP
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        if (!/^\d{6}$/.test(String(otp))) {
            return res.status(400).json({ message: "Enter a valid 6-digit OTP" });
        }

        const user = await userModel.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user || !user.resetOtp || !user.resetOtpExpiry) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        if (user.resetOtpExpiry.getTime() < Date.now()) {
            return res.status(400).json({
                message: "OTP has expired. Please request a new OTP."
            });
        }

        const hashedOtp = crypto.createHash("sha256").update(String(otp)).digest("hex");

        if (hashedOtp !== user.resetOtp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.resetOtpVerified = true;
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Reset password after OTP verification
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await userModel.findOne({
            email: email.toLowerCase().trim()
        });

        if (
            !user ||
            !user.resetOtpVerified ||
            !user.resetOtpExpiry ||
            user.resetOtpExpiry.getTime() < Date.now()
        ) {
            return res.status(401).json({
                message: "Please verify your OTP first"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        user.resetOtp = null;
        user.resetOtpExpiry = null;
        user.resetOtpVerified = false;

        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const getallusers = async (req, res) => {
    try {
        const users = await userModel.find({
            role: { $ne: "admin" }
        }).select("-password");

        return res.status(200).json({
            message: "Users fetched successfully",
            users
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


const createAdmin = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, setupKey } = req.body;

        if (!process.env.ADMIN_SETUP_KEY) {
            return res.status(500).json({ message: "Admin setup is not configured" });
        }

        if (!name || !email || !password || !phoneNumber || !setupKey) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (setupKey !== process.env.ADMIN_SETUP_KEY) {
            return res.status(401).json({ message: "Invalid setup key" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existingAdmin = await userModel.findOne({ role: "admin" });

        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await userModel.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await userModel.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            phoneNumber,
            role: "admin"
        });

        return res.status(201).json({
            message: "Admin created successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New password and confirm password do not match"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters"
            });
        }

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);

        if (isSamePassword) {
            return res.status(400).json({
                message: "New password must be different from current password"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { userSignup, userLogin, forgetPw, verifyOtp, resetPassword, getallusers, createAdmin, changePassword };
