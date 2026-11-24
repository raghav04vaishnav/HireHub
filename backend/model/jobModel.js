const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        requirements: [
            {
                type: String,
            },
        ],

        skills: [
            {
                type: String,
            },
        ],

        qualification: {
            type: String,
            required: true,
        },

        experience: {
            type: String,
            required: true,
        },

        salary: {
            min: {
                type: Number,
                required: true,
                min: 0,
            },
            max: {
                type: Number,
                required: true,
                min: 0,
            },
        },

        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Contract"],
            required: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        vacancies: {
            type: Number,
            default: 1,
            min: 1,
        },

        lastDate: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["Active", "Closed"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
);

jobSchema.pre("validate", function () {
    if (
        this.salary &&
        this.salary.min != null &&
        this.salary.max != null &&
        this.salary.min > this.salary.max
    ) {
        this.invalidate("salary.max", "Maximum salary must be greater than minimum salary");
    }
});

const JobModel = mongoose.model("Job", jobSchema);

module.exports = JobModel;
