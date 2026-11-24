const mongoose = require("mongoose");
const User = require("../model/userModel");
const Company = require("../model/companyModel");
const Job = require("../model/jobModel");
const JobApply = require("../model/jobApplyModel");

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalCompanies = await Company.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalApplications = await JobApply.countDocuments();

        res.status(200).json({
            success: true,
            stats: { totalUsers, totalCompanies, totalJobs, totalApplications }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find()
            .populate("user", "name email phoneNumber")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, companies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("company", "companyName industry website")
            .sort({ createdAt: -1 });

        const jobsWithApplicants = await Promise.all(
            jobs.map(async (job) => {
                const totalApplicants = await JobApply.countDocuments({
                    jobId: job._id
                });

                return { ...job.toObject(), totalApplicants };
            })
        );

        res.status(200).json({ success: true, jobs: jobsWithApplicants });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET ALL APPLICATIONS FOR ADMIN
const getAllApplications = async (req, res) => {
    try {
        const applications = await JobApply.find()
            .populate("userId", "name email phoneNumber")
            .populate({
                path: "jobId",
                select: "title company",
                populate: {
                    path: "company",
                    select: "companyName"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalApplications: applications.length,
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const user = await User.findOne({
            _id: req.params.id,
            role: "user"
        }).session(session);

        if (!user) {
            await session.abortTransaction();

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await JobApply.deleteMany(
            { userId: user._id },
            { session }
        );

        await User.deleteOne(
            { _id: user._id },
            { session }
        );

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        await session.endSession();
    }
};

module.exports = { getDashboardStats, getAllUsers, getAllCompanies, getAllJobs, getAllApplications, deleteUser };
