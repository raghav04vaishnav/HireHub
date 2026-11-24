const mongoose = require('mongoose')

const jobApplySchema = new mongoose.Schema({
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
    resume: {
        type: String,
        required: true,
    },
    coverLetter: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "shortlisted", "rejected", "accepted"],
        default: "pending",
    },
},
{
    timestamps: true,
}
)

module.exports = mongoose.model("JobApply", jobApplySchema)