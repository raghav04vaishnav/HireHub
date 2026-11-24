const UserProfile = require("../model/userProfileModel");


const createProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const existingProfile = await UserProfile.findOne({
            user: userId,
        });

        if (existingProfile) {
            return res.status(400).json({
                message: "Profile already exists",
            });
        }

        const { skills, qualification, experience, About, address } = req.body;

        const profile = await UserProfile.create({ skills, qualification, experience, About, address, user: userId, });

        res.status(201).json({
            message: "Profile created successfully",
            profile,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating profile",
            error: error.message,
        });
    }
};


const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const { skills, qualification, experience, About, address } = req.body;

        const profile = await UserProfile.findOneAndUpdate(
            { user: userId },
            { skills, qualification, experience, About, address }, { new: true, runValidators: true, });

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found. Please create your profile first.",
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            profile,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating profile",
            error: error.message,
        });
    }
};



const getOneProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await UserProfile.findOne({
            user: userId,
        }).populate("user", "name email");

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found",
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            profile,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching profile",
            error: error.message,
        });
    }
};


module.exports = { createProfile, updateProfile, getOneProfile };