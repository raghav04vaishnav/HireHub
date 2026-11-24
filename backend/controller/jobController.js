const mongoose = require("mongoose");
const Job = require("../model/jobModel");
const Company = require("../model/companyModel");
const JobApply = require("../model/jobApplyModel");


const createJob = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const company = await Company.findOne({
            user: req.user.id,
        }).session(session);

        if (!company) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "Company profile not found",
            });
        }

        const newJob = new Job({
            ...req.body,
            company: company._id,
        });

        await newJob.save({ session });

        const updatedCompany = await Company.findByIdAndUpdate(
            company._id,
            { $inc: { totalJobs: 1 } },
            { new: true, session }
        );

        if (!updatedCompany) {
            throw new Error("Company update failed");
        }

        await session.commitTransaction();

        const job = await Job.findById(newJob._id).populate(
            "company",
            "companyName industry website"
        );

        res.status(201).json({
            message: "Job created successfully",
            job,
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        res.status(500).json({
            message: error.message,
        });

    } finally {
        await session.endSession();
    }
};


const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.aggregate([
            {
                $lookup: {
                    from: "jobapplies",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "applications"
                }
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "companyDetails"
                }
            },
            {
                $unwind: {
                    path: "$companyDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    totalApplicants: {
                        $size: "$applications"
                    }
                }
            },
            {
                $project: {
                    applications: 0
                }
            }
        ]);

        res.status(200).json({
            message: "Jobs fetched successfully",
            totalJobs: jobs.length,
            jobs
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getCompanyJobs = async (req, res) => {
    try {
        const company = await Company.findOne({
            user: req.user.id,
        });

        if (!company) {
            return res.status(404).json({
                message: "Company profile not found",
            });
        }

        const jobs = await Job.find({
            company: company._id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Company jobs fetched successfully",
            totalJobs: jobs.length,
            jobs,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


const getOneJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("company", "companyName industry website");

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        res.status(200).json({
            message: "Job fetched successfully",
            job,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


const updateJob = async (req, res) => {
    try {
        const company = await Company.findOne({
            user: req.user.id,
        });

        if (!company) {
            return res.status(404).json({
                message: "Company profile not found",
            });
        }

        const job = await Job.findOneAndUpdate(
            {
                _id: req.params.id,
                company: company._id,
            },
            {
                ...req.body,
                company: company._id,
            },
            {
                new: true,
                runValidators: true,
            }
        ).populate("company", "companyName industry website");

        if (!job) {
            return res.status(404).json({
                message: "Job not found or unauthorized",
            });
        }

        res.status(200).json({
            message: "Job updated successfully",
            job,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


const deleteJob = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const company = await Company.findOne({
            user: req.user.id,
        }).session(session);

        if (!company) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "Company profile not found",
            });
        }

        const job = await Job.findOne({
            _id: req.params.id,
            company: company._id,
        }).session(session);

        if (!job) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "Job not found or unauthorized",
            });
        }

        await Job.deleteOne(
            { _id: job._id },
            { session }
        );

        await JobApply.deleteMany(
            { jobId: job._id },
            { session }
        );

        await Company.findByIdAndUpdate(
            company._id,
            { $inc: { totalJobs: -1 } },
            { session }
        );

        await session.commitTransaction();

        res.status(200).json({
            message: "Job and related applications deleted successfully",
            job,
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        res.status(500).json({
            message: error.message,
        });

    } finally {
        await session.endSession();
    }
};


module.exports = { createJob, getAllJobs, getCompanyJobs, getOneJob, updateJob, deleteJob };
