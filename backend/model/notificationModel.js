const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        applicationid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobApply",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String, 
            enum: ["shortlisted", "accepted", "rejected"],
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Notification", notificationSchema)
