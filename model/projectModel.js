const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active",
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("project", projectSchema);