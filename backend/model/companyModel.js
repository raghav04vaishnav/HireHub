const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true
        },

        companyType: {
            type: String,
            required: true
        },

        registrationNumber: {
            type: String,
            required: true
        },

        establishedDate: {
            type: Date,
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        owner: {
            type: String,
            required: true,
            trim: true
        },

        mailingAddress: {
            streetAddress: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            state: {
                type: String,
                required: true
            },

            zipCode: {
                type: String,
                required: true
            },

            country: {
                type: String,
                required: true
            }
        },

        nominalCapital: {
            type: Number,
            default: 0,
            min: 0
        },

        industry: {
            type: String,
            required: true
        },

        website: {
            type: String,
            default: ""
        },

        totalJobs: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;