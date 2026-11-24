const mongoose = require("mongoose");
const BlockedUser = require("../model/blockedUserModel");
const Company = require("../model/companyModel");
const User = require("../model/userModel");


const blockUser = async (req, res) => {
    try {
        if (req.user.role !== "company") {
            return res.status(403).json({
                message: "Only companies can block users",
            });
        }

        const { userId } = req.params;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID",
            });
        }

        const company = await Company.findOne({
            user: req.user.id,
        });

        if (!company) {
            return res.status(404).json({
                message: "Company profile not found",
            });
        }

        const user = await User.findById(userId);

        if (!user || user.role !== "user") {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const alreadyBlocked = await BlockedUser.findOne({
            companyId: company._id,
            userId,
        });

        if (alreadyBlocked) {
            return res.status(400).json({
                message: "User is already blocked",
            });
        }

        const blockedUser = await BlockedUser.create({
            companyId: company._id,
            userId,
        });

        res.status(201).json({
            message: "User blocked successfully",
            blockedUser,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


const unblockUser = async (req, res) => {
    try {
        if (req.user.role !== "company") {
            return res.status(403).json({
                message: "Only companies can unblock users",
            });
        }

        const { userId } = req.params;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID",
            });
        }

        const company = await Company.findOne({
            user: req.user.id,
        });

        if (!company) {
            return res.status(404).json({
                message: "Company profile not found",
            });
        }

        const blockedUser = await BlockedUser.findOneAndDelete({
            companyId: company._id,
            userId,
        });

        if (!blockedUser) {
            return res.status(404).json({
                message: "Blocked user not found",
            });
        }

        res.status(200).json({
            message: "User unblocked successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


const getBlockedUsers = async (req, res) => {
    try {
        if (req.user.role !== "company") {
            return res.status(403).json({
                message: "Only companies can view blocked users",
            });
        }

        const company = await Company.findOne({
            user: req.user.id,
        });

        if (!company) {
            return res.status(404).json({
                message: "Company profile not found",
            });
        }

        const blockedUsers = await BlockedUser.find({
            companyId: company._id,
        })
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Blocked users fetched successfully",
            totalBlockedUsers: blockedUsers.length,
            blockedUsers,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


module.exports = { blockUser, unblockUser, getBlockedUsers };