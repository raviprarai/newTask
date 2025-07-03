const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "project",
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ["todo", "in-progress", "done"],
            default: "todo"
        },
        dueDate: {
            type: Date,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("task", taskSchema);