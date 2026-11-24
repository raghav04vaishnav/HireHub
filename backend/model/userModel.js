const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: false
    },

    role: {
        type: String,
        enum: ["user", "admin", "company"],
        default: "user"
    },

    resetOtp: {
        type: String,
        default: null
    },

    resetOtpExpiry: {
        type: Date,
        default: null
    },

    resetOtpVerified: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
