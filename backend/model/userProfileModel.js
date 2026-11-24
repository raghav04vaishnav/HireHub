const mongoose = require("mongoose")

const userProfileSchema = new mongoose.Schema({
    skills: [
        {
            type: String,
        },
    ],

    qualification: [
        {
            type: String,
        },
    ],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    experience: [
        {
            companyName: {
                type: String,
            },
            from: {
                type: Date,
            },
            to: {
                type: Date,
                default: null,
            },
        },
    ],

    About: {
        type: String,

    },

    address: {
        type: String,
    },
})

const userProfileModel = mongoose.model( "userProfile", userProfileSchema )

module.exports = userProfileModel;