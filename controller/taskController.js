const { taskSchema, taskUpdateSchema } = require("../validation");

const taskDb = require("../model/taskModel");

exports.addTask = async (req, res) => {
    try {
        const { title, description, projectId, dueDate } = req.body;
        const { error } = taskSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        } else {
            const result = await taskDb.create({
                title,
                description,
                status: "todo",
                userId: req.user._id,
                dueDate,
                projectId
            });
            if (!result) {
                return res.status(400).json({
                    success: false,
                    message: "Task is not Add",
                });
            }
            return res.status(200).json({
                success: true,
                message: "User add Task sucessfully",
                result: {
                    _id: result._id,
                    title: result.title,
                    description: result.description,
                    userId: result.userId,
                    status: result.status,
                    createdAt: result.createdAt,
                    projectId: result.projectId
                }
            });
        }
    } catch (err) {
        console.log("Error in Project:", err);
        return res.status(500).json({
            success: false,
            message: err.toString(),
        });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { error } = taskUpdateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        } else {
            const updateFields = {};
            if (req.body.title) updateFields.title = req.body.title;
            if (req.body.description) updateFields.description = req.body.description;
            if (req.body.status) updateFields.status = req.body.status;
            if (req.body.dueDate) updateFields.dueDate = req.body.dueDate;
            if (req.body.projectId) updateFields.projectId = req.body.projectId;
            const result = await taskDb.findByIdAndUpdate({ _id: req.params.id }, { $set: updateFields }, { new: true });
            if (!result) {
                return res.status(400).json({
                    success: false,
                    message: "Task is not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Task is Update sucessfully",
                result: {
                    _id: result._id,
                    title: result.title,
                    description: result.description,
                    status: result.status,
                    dueDate: result.dueDate,
                    projectId: result.projectId

                }
            });
        }
    } catch (err) {
        console.log("Error in updateTask:", err);
        return res.status(500).json({
            success: false,
            message: err.toString(),
        });
    }
};

exports.getOneTask = async (req, res) => {
    try {
        const result = await taskDb.findById(req.params.id).populate([
            { path: 'userId', select: 'name email' },
            { path: 'projectId', select: 'title description status' }
        ]).lean();
        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Task is not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Task is fetched successfully",
            result,
        });
    } catch (err) {
        console.log("Error in Task:", err);
        return res.status(500).json({
            success: false,
            message: err.toString(),
        });
    }
};

exports.getAllOwnTask = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const searchQuery = (req.query.name || "");
        const filter = { userId: req.user._id };
        if (searchQuery) {
            filter.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { description: { $regex: searchQuery, $options: "i" } },
                { status: { $regex: searchQuery, $options: "i" } }
            ];
        }
        const [result, totalCount] = await Promise.all([
            taskDb
                .find(filter)
                .skip(skip)
                .limit(limit)
                .populate([
                    { path: 'userId', select: 'name email' },
                    { path: 'projectId', select: 'title description status' }
                ]).lean(),
            taskDb.countDocuments(filter)
        ]);
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task is not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Task is fetched successfully",
            result,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalItems: totalCount
        });

    } catch (err) {
        console.log("Error in getAllProject:", err);
        return res.status(500).json({
            success: false,
            message: err.toString()
        });
    }
};
exports.getTaskByProjectId = async (req, res) => {
    try {
        const result = await taskDb.find({ projectId: req.params.projectId }).lean();
        if (!result[0]) {
            return res.status(400).json({
                success: false,
                message: "Task is not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Task is fetched successfully",
            result,
        });
    } catch (err) {
        console.log("Error in getTaskByProjectId:", err);
        return res.status(500).json({
            success: false,
            message: err.toString(),
        });
    }
};

exports.findTaskByStatus = async (req, res) => {
    try {
        const result = await taskDb.find({ $and: [{ userId: req.user._id }, { status: req.query.status }] }).lean();
        if (!result[0]) {
            return res.status(400).json({
                success: false,
                message: "Task is not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Task is fetched successfully",
            result,
        });
    } catch (err) {
        console.log("Error in findTaskByStatus:", err);
        return res.status(500).json({
            success: false,
            message: err.toString(),
        });
    }
}

exports.allTask = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchQuery = req.query.name || "";
        const skip = (page - 1) * limit;
        const searchCondition = {
            $or: [
                { title: { $regex: searchQuery, $options: "i" } },
                { description: { $regex: searchQuery, $options: "i" } },
                { status: { $regex: searchQuery, $options: "i" } }
            ],
        };
        const result = await taskDb.find(searchCondition)
            .populate([
                { path: 'userId', select: 'name email' },
                { path: 'projectId', select: 'title description status' }
            ])
            .select("-updatedAt -__v")
            .skip(skip)
            .limit(limit)
            .lean();
        if (!result[0]) {
            return res.status(400).json({
                success: false,
                message: "Task is not found",
            });
        } else {
            const totalCount = await taskDb.countDocuments(searchCondition);
            return res.status(200).json({
                success: true,
                message: "Task is fetched successfully",
                result,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
            });
        }
    } catch (error) {
        console.log("Error in allTask:", error);

        return res.status(500).json({
            success: false,
            message: error.toString()
        })
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const result = await taskDb.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Task is not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Task is deleted successfully",
        });
    } catch (err) {
        console.log("Error in deleteTask:", err);
        return res.status(500).json({
            success: false,
            message: err.toString(),
        });
    }
};