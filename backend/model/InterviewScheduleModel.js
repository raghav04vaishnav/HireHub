const mongoose = require("mongoose");

const interviewScheduleSchema = new mongoose.Schema(
    {
        jobApplyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobApply",
            required: true,
            unique: true,
        },

        interviewDate: {
            type: Date,
            required: true,
        },

        interviewTime: {
            type: String,
            required: true,
        },

        jobDescription: {
            type: String,
            required: true,
        },

        interviewMode: {
            type: String,
            enum: ["online", "offline"],
            required: true,
        },

        meetLink: {
            type: String,
            default: "",
            validate: {
                validator: function (value) {
                    return this.interviewMode !== "online" || value.trim() !== "";
                },
                message: "Google Meet link is required for online interviews",
            },
        },

        feedback: {
            type: String,
            default: "",
        },

        feedbackStatus: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },

        status: {
            type: String,
            enum: ["pending", "cleared", "not_cleared"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model( "InterviewSchedule", interviewScheduleSchema );
