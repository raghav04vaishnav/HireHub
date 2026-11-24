const InterviewSchedule = require("../model/InterviewScheduleModel");
const JobApply = require("../model/jobApplyModel");
const Company = require("../model/companyModel");
const Job = require("../model/jobModel");
const Notification = require("../model/notificationModel");
const sendEmail = require("../sendEmail");


const scheduleInterview = async (req, res) => {
    try {
        const { jobApplyId, interviewDate, interviewTime, jobDescription, interviewMode, meetLink, } = req.body;

        if (
            !jobApplyId ||
            !interviewDate ||
            !interviewTime ||
            !jobDescription ||
            !interviewMode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required details",
            });
        }

        if (!["online", "offline"].includes(interviewMode)) {
            return res.status(400).json({
                success: false,
                message: "Invalid interview mode",
            });
        }

        if (interviewMode === "online" && !meetLink?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Google Meet link is required",
            });
        }

        const company = await Company.findOne({
            user: req.user.id,
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        const application = await JobApply.findById(jobApplyId)
            .populate("userId")
            .populate({
                path: "jobId",
                populate: {
                    path: "company",
                },
            });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Job application not found",
            });
        }

        if (
            !application.jobId ||
            application.jobId.company._id.toString() !== company._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot schedule an interview for this application",
            });
        }

        if (application.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message: "Only approved applications can be scheduled",
            });
        }

        const existingInterview = await InterviewSchedule.findOne({
            jobApplyId,
        });

        if (existingInterview) {
            return res.status(400).json({
                success: false,
                message: "Interview already scheduled",
            });
        }

        const interview = await InterviewSchedule.create({
            jobApplyId,
            interviewDate,
            interviewTime,
            jobDescription,
            interviewMode,
            meetLink: interviewMode === "online" ? meetLink : "",
        });

        return res.status(201).json({
            success: true,
            message: "Interview scheduled successfully",
            interview,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getMyInterviews = async (req, res) => {
    try {
        const applications = await JobApply.find({
            userId: req.user.id,
        }).select("_id");

        const applicationIds = applications.map(
            (item) => item._id
        );

        const interviews = await InterviewSchedule.find({
            jobApplyId: { $in: applicationIds },
        })
            .populate({
                path: "jobApplyId",
                populate: [
                    { path: "jobId" },
                    { path: "userId", select: "name email" },
                ],
            })
            .sort({ interviewDate: 1 });

        return res.status(200).json({
            success: true,
            interviews,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getCompanyInterviews = async (req, res) => {
    try {
        const company = await Company.findOne({
            user: req.user.id,
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        const jobs = await Job.find({
            company: company._id,
        }).select("_id");

        const jobIds = jobs.map((job) => job._id);

        const applications = await JobApply.find({
            jobId: { $in: jobIds },
        }).select("_id");

        const applicationIds = applications.map(
            (item) => item._id
        );

        const interviews = await InterviewSchedule.find({
            jobApplyId: { $in: applicationIds },
        })
            .populate({
                path: "jobApplyId",
                populate: [
                    { path: "userId", select: "name email" },
                    { path: "jobId" },
                ],
            })
            .sort({ interviewDate: 1 });

        return res.status(200).json({
            success: true,
            interviews,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const updateInterviewResult = async (req, res) => {
    try {
        const { status, feedback } = req.body;
        const { id } = req.params;

        if (!["cleared", "not_cleared"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid interview status",
            });
        }

        const company = await Company.findOne({
            user: req.user.id,
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        const interview = await InterviewSchedule.findById(id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found",
            });
        }

        if (interview.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Interview result has already been submitted",
            });
        }

        const application = await JobApply.findById(interview.jobApplyId)
            .populate("userId")
            .populate({
                path: "jobId",
                populate: {
                    path: "company",
                },
            });

        if (
            !application ||
            !application.userId ||
            !application.jobId
        ) {
            return res.status(404).json({
                success: false,
                message: "Candidate or job not found",
            });
        }

        if (
            !application.jobId.company ||
            application.jobId.company._id.toString() !== company._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot update this interview result",
            });
        }

        interview.status = status;
        interview.feedback = feedback || "";
        interview.feedbackStatus = "completed";

        await interview.save();

        const user = application.userId;

        const notificationStatus =
            status === "cleared" ? "accepted" : "rejected";

        const message =
            status === "cleared"
                ? "Congratulations! You have been hired. Your interview was successful."
                : "Thank you for attending the interview. Unfortunately, you were not selected.";


        await Notification.create({
            userId: user._id,
            jobId: application.jobId._id,
            applicationid: application._id,
            title: "Interview Result",
            message,
            status: notificationStatus,
        });


        if (user.email) {
            try {
                await sendEmail(
                    user.email,
                    "HireHub - Interview Result",
                    message
                );
            } catch (emailError) {
                console.error("Interview result email error:", emailError);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Interview result updated successfully",
            interview,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { scheduleInterview, getMyInterviews, getCompanyInterviews, updateInterviewResult, };