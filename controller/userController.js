const { UserSchema, loginSchema, UserUpdateSchema } = require("../validation");
const User = require("../model/userModel");
const taskDb = require("../model/taskModel");
const projectDb = require("../model/projectModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.userRegister = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const { error } = UserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        } else {
            const exist = await User.findOne({ email });
            if (exist) {
                return res.status(400).json({
                    success: false,
                    message: "This email is already taken!"
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await User.create({
                email,
                password: hashedPassword,
                name
            });
            if (!result) {
                return res.status(400).json({
                    success: false,
                    message: "User is not Register",
                });
            }
            return res.status(200).json({
                success: true,
                message: "User is Register sucessfully",
                result: {
                    _id: result._id,
                    email: result.email,
                    name: result.name
                }
            });
        }
    } catch (err) {
        console.log("Error in userRegister:", err);
        return res.status(500).json({
            success: false,
            message: err.toString(),
        });
    }
};

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        let passCheck = bcrypt.compareSync(
            password,
            user.password
        );
        if (passCheck == false) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password.",
            });
        } else {
            let dataToken = {
                _id: user._id,
                isUser: user.isUser
            };
            let token = jwt.sign(dataToken, process.env.JWT_SECRET,
                {
                    expiresIn: "30d",
                }
            );
            return res.status(200).json({
                success: true,
                message: "User Login Successfully.....",
                result: {
                    _id: user._id,
                    email: user.email,
                    token,
                },
            });
        }

    } catch (err) {
        console.log("Error in userLogin:", err);
        return res.status(500).json({
            status: 0,
            message: err.toString(),
        });
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const result = await User.findById(req.user._id).lean().select("-password -isUser");
        if (!result) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "User Profile fetched successfully",
                result,
            });
        }
    } catch (error) {
        console.log("Error in getUserProfile:", error);

        return res.status(500).json({
            success: false,
            message: error.toString()
        })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { error } = UserUpdateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        } else {
            const updateFields = {};
            if (req.body.email) updateFields.email = req.body.email.trim();
            if (req.body.name) updateFields.name = req.body.name.trim();
            if (req.body.password) {
                updateFields.password = await bcrypt.hash(req.body.password, 10);
            }
            const result = await User.findByIdAndUpdate({ _id: req.user._id }, { $set: updateFields }, { new: true });
            if (!result) {
                return res.status(400).json({
                    success: false,
                    message: "User is not Register",
                });
            }
            return res.status(200).json({
                success: true,
                message: "User is Update profile sucessfully",
                result: {
                    email: result.email,
                    name: result.name
                }
            });
        }

    } catch (error) {
        console.log("Error in updateProfile:", error);

        return res.status(500).json({
            success: false,
            message: error.toString()
        })
    }
}

exports.deleteProfile = async (req, res) => {
    try {
        const result = await User.findById(req.user._id);
        if (!result) {
            return res.status(400).json({
                success: false,
                message: "User is not Register",
            });
        } else {
            await taskDb.deleteMany({ userId: req.user._id });
            await projectDb.deleteMany({ userId: req.user._id });
            await User.findByIdAndDelete({ _id: result._id });

            return res.status(200).json({
                success: false,
                message: "User is Delete profile sucessfully"
            });
        }
    } catch (error) {
        console.log("Error in deleteProfile:", error);
        return res.status(500).json({
            success: false,
            message: error.toString(),
        });
    }
}
