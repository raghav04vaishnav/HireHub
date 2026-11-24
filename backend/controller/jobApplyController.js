const mongoose = require("mongoose");
const JobApply = require("../model/jobApplyModel");
const Job = require("../model/jobModel");
const Company = require("../model/companyModel");
const { uploadResume } = require("../cloudinary.js");
const sendEmail = require("../sendEmail");
const axios = require("axios");
const Notification = require("../model/notificationModel");
const BlockedUser = require("../model/blockedUserModel");


const getMyApplications = async (req, res) => {
    try {
        const applications = await JobApply.find({
            userId: req.user.id
        })
            .populate({
                path: "jobId",
                populate: {
                    path: "company",
                    select: "companyName industry website"
                }
            });

        res.status(200).json({
            message: "Applications fetched successfully",
            totalApplications: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { coverLetter } = req.body;

        if (req.user.role !== "user") {
            return res.status(403).json({
                message: "Only users can apply for jobs"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload your resume"
            });
        }

        const file = req.file;

        if (file.mimetype !== "application/pdf") {
            return res.status(400).json({
                message: "Only PDF files are allowed"
            });
        }

        if (file.size > 5 * 1024 * 1024) {
            return res.status(400).json({
                message: "Resume size must be less than 5 MB"
            });
        }

        const job = await Job.findById(jobId)
            .populate("company", "companyName");

        if (!job || job.status !== "Active") {
            return res.status(404).json({
                message: "Active job not found"
            });
        }

        const isBlocked = await BlockedUser.findOne({
            companyId: job.company._id,
            userId: req.user._id,
        });

        if (isBlocked) {
            return res.status(403).json({
                message: "You are blocked by this company. You cannot apply for its jobs.",
            });
        }

        const alreadyApplied = await JobApply.findOne({
            userId: req.user._id,
            jobId
        });

        if (alreadyApplied) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }

        const uploadResult = await uploadResume(file);

        const application = await JobApply.create({
            userId: req.user._id,
            jobId,
            resume: uploadResult.secure_url,
            coverLetter
        });

        try {
            await sendEmail(
                req.user.email,
                "Application Submitted Successfully - HireHub",
                `
                <h2>Hello ${req.user.name},</h2>
                <p>Your application has been submitted successfully.</p>
                <p><b>Job:</b> ${job.title}</p>
                <p><b>Company:</b> ${job.company?.companyName || "Company"}</p>
                <p>Your application status is currently Pending.</p>
                <p>We will notify you when the company updates your application status.</p>
                <br/>
                <p>Thank you for using HireHub!</p>
                `
            );
        } catch (emailError) {
            console.log("Application email error:", emailError.message);
        }

        res.status(201).json({
            message: "Job application submitted successfully",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getCompanyApplicants = async (req, res) => {
    try {
        const company = await Company.findOne({
            user: req.user.id
        });

        if (!company) {
            return res.status(404).json({
                message: "Company profile not found"
            });
        }

        const jobs = await Job.find({
            company: company._id
        }).select("_id title");

        const jobIds = jobs.map((job) => job._id);

        const applicants = await JobApply.find({
            jobId: { $in: jobIds }
        })
            .populate("userId", "name email")
            .populate("jobId", "title location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Applicants fetched successfully",
            totalApplicants: applicants.length,
            applicants
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const updateApplicantStatus = async (req, res) => {
    const session = await mongoose.startSession();

    let emailDetails = null;
    let updatedApplication = null;

    try {
        session.startTransaction();

        const { status } = req.body;

        const allowedStatus = [
            "pending",
            "shortlisted",
            "rejected",
            "accepted"
        ];

        if (!allowedStatus.includes(status)) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        const company = await Company.findOne({
            user: req.user.id
        }).session(session);

        if (!company) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "Company profile not found"
            });
        }

        const application = await JobApply.findById(req.params.id)
            .session(session)
            .populate("jobId")
            .populate("userId", "name email");

        if (
            !application ||
            !application.jobId ||
            application.jobId.company.toString() !== company._id.toString()
        ) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "Application not found"
            });
        }

        if (application.status === status) {
            await session.abortTransaction();

            return res.status(200).json({
                message: "Application already has this status",
                application
            });
        }

        application.status = status;
        await application.save({ session });

        if (["shortlisted", "accepted", "rejected"].includes(status)) {
            const notificationMessages = {
                shortlisted: {
                    title: "Application Shortlisted",
                    message: `Your application for ${application.jobId.title} has been shortlisted.`
                },
                accepted: {
                    title: "Application Accepted",
                    message: `Your application for ${application.jobId.title} has been accepted.`
                },
                rejected: {
                    title: "Application Rejected",
                    message: `Your application for ${application.jobId.title} has been rejected.`
                }
            };

            await Notification.create(
                [{
                    userId: application.userId._id,
                    jobId: application.jobId._id,
                    applicationid: application._id,
                    title: notificationMessages[status].title,
                    message: notificationMessages[status].message,
                    status
                }],
                { session }
            );
        }

        const emailMessages = {
            shortlisted: {
                subject: "Congratulations! You are Shortlisted - HireHub",
                message: "Congratulations! Your application has been shortlisted by the company."
            },
            rejected: {
                subject: "Application Status Update - HireHub",
                message: "Thank you for applying. Unfortunately, your application was not selected for this position."
            },
            accepted: {
                subject: "Congratulations! Your Application is Accepted - HireHub",
                message: "Congratulations! Your application has been accepted by the company."
            },
            pending: {
                subject: "Application Status Updated - HireHub",
                message: "Your application status has been changed to Pending."
            }
        };

        emailDetails = {
            email: application.userId.email,
            name: application.userId.name,
            jobTitle: application.jobId.title,
            status,
            ...emailMessages[status]
        };

        updatedApplication = application;

        await session.commitTransaction();

        try {
            await sendEmail(
                emailDetails.email,
                emailDetails.subject,
                `
                <h2>Hello ${emailDetails.name},</h2>
                <p>${emailDetails.message}</p>
                <p><b>Job:</b> ${emailDetails.jobTitle}</p>
                <p><b>New Status:</b> ${emailDetails.status.toUpperCase()}</p>
                <br/>
                <p>Thank you for using HireHub!</p>
                `
            );

        } catch (emailError) {
            console.log("Status email error:", emailError.message);
        }

        res.status(200).json({
            message: "Applicant status updated successfully",
            application: updatedApplication
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        res.status(500).json({
            message: error.message
        });

    } finally {
        await session.endSession();
    }
};


const previewResume = async (req, res) => {
    try {
        if (req.user.role !== "company") {
            return res.status(403).json({
                message: "Only companies can view applicant resumes"
            });
        }

        const company = await Company.findOne({
            user: req.user.id
        });

        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        const application = await JobApply.findById(req.params.id)
            .populate("jobId");

        if (!application || !application.jobId) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        if (
            application.jobId.company.toString() !== company._id.toString()
        ) {
            return res.status(403).json({
                message: "You are not allowed to view this resume"
            });
        }

        if (!application.resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        const pdfResponse = await axios.get(application.resume, {
            responseType: "stream"
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            'inline; filename="resume.pdf"'
        );
        res.setHeader("Cache-Control", "no-store");

        pdfResponse.data.pipe(res);

    } catch (error) {
        console.log("Resume preview error:", error.message);

        if (!res.headersSent) {
            res.status(500).json({
                message: "Unable to preview resume"
            });
        }
    }
};

module.exports = { getMyApplications, applyForJob, getCompanyApplicants, updateApplicantStatus, previewResume };