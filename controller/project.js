
const { projectSchema, projectUpdateSchema } = require("../validation");

const projectDb = require("../model/projectModel");
const taskDb = require("../model/taskModel");

exports.userAddProject = async (req, res) => {
    try {
        const { title, description } = req.body;
        const { error } = projectSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        } else {
            const exist = await projectDb.findOne({ userId: req.user._id, title });
            if (exist) {
                return res.status(400).json({
                    success: false,
                    message: "This Project is already taken!"
                });
            }
            const result = await projectDb.create({
                title,
                description,
                status: "active",
                userId: req.user._id
            });
            if (!result) {
                return res.status(400).json({
                    success: false,
                    message: "Project is not Add",
                });
            }
            return res.status(200).json({
                success: true,
                message: "User add project sucessfully",
                result: {
                    _id: result._id,
                    title: result.title,
                    description: result.description,
                    userId: result.userId,
                    status: result.status,
                    createdAt: result.createdAt
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

exports.updateProject = async (req, res) => {
    try {
        const { error } = projectUpdateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        } else {
            const updateFields = {};
            if (req.body.title) updateFields.title = req.body.title.trim();
            if (req.body.description) updateFields.description = req.body.description.trim();
            if (req.body.status) updateFields.status = req.body.status.trim();
            const result = await projectDb.findByIdAndUpdate({ _id: req.params.id }, { $set: updateFields }, { new: true });
            if (!result) {
                return res.status(400).json({
                    success: false,
                    message: "Project is not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Project is Update sucessfully",
                result: {
                    _id: result._id,
                    title: result.title,
                    description: result.description,
                    status: result.status
                }
            });
        }
    } catch (err) {
        console.log("Error in updateProject:", err);
        return res.status(500).json({
            success: false,
            message: err.toString(),
        });
    }
};

exports.getAllOwnProject = async (req, res) => {
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
            projectDb
                .find(filter)
                .skip(skip)
                .limit(limit)
                .lean(),
            projectDb.countDocuments(filter)
        ]);
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Project is not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Project is fetched successfully",
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

exports.allProject = async (req, res) => {
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
        const result = await projectDb.find(searchCondition)
            .populate({ path: "userId", select: "name email" })
            .select("-updatedAt -__v")
            .skip(skip)
            .limit(limit)
            .lean();
        if (!result[0]) {
            return res.status(400).json({
                success: false,
                message: "Project is not found",
            });
        } else {
            const totalCount = await projectDb.countDocuments(searchCondition);
            return res.status(200).json({
                success: true,
                message: "Project is fetched successfully",
                result,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
            });
        }
    } catch (error) {
        console.log("Error in allProject:", error);

        return res.status(500).json({
            success: false,
            message: error.toString()
        })
    }
}

exports.getOneProject = async (req, res) => {
    try {
        const result = await projectDb.findById(req.params.id).populate({ path: "userId", select: "name email" }).lean();
        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Project is not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Project is fetched successfully",
            result,
        });
    } catch (err) {
        console.log("Error in getAllActiveProject:", err);
        return res.status(500).json({
            success: false,
            message: err.toString(),
        });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const result = await projectDb.findById(req.params.id);
        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Project is not found",
            });
        } else {
            await taskDb.deleteMany({ userId: req.user._id, projectId: req.params.id });
            await projectDb.findByIdAndDelete({ _id: result._id });
            return res.status(200).json({
                success: true,
                message: "Project is deleted successfully",
            });
        }
    } catch (err) {
        console.log("Error in deleteProject:", err);
        return res.status(500).json({
            success: false,
            message: err.toString(),
        });
    }
};
