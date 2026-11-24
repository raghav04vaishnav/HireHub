const mongoose = require("mongoose");

const blockedUserSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


blockedUserSchema.index(
    { companyId: 1, userId: 1 },
    { unique: true }
);

module.exports = mongoose.model("BlockedUser", blockedUserSchema);