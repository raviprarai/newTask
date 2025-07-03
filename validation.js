const Joi = require("joi");

const UserSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.email": "Please enter a valid email address.",
            "string.empty": "Email is required.",
        }),

    password: Joi.string()
        .min(4)
        .max(30)
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 4 characters long.",
            "string.max": "Password must not exceed 30 characters.",
        }),

    name: Joi.string()
        .min(3)
        .max(20)
        .required()
        .messages({
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 3 characters long.",
            "string.max": "Name must not exceed 20 characters.",
        })
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.email": "Please enter a valid email address.",
            "string.empty": "Email is required.",
        }),

    password: Joi.string()
        .min(4)
        .max(30)
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 4 characters long.",
            "string.max": "Password must not exceed 30 characters.",
        })
});

const UserUpdateSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .optional()
        .messages({
            "string.email": "Please enter a valid email address."
        }),

    password: Joi.string()
        .min(4)
        .max(30)
        .optional()
        .messages({
            "string.min": "Password must be at least 4 characters long.",
            "string.max": "Password must not exceed 30 characters.",
        }),

    name: Joi.string()
        .min(3)
        .max(20)
        .optional()
        .messages({
            "string.min": "Name must be at least 3 characters long.",
            "string.max": "Name must not exceed 20 characters.",
        })
});

const projectSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.empty": "Title is required.",
            "string.min": "Title must be at least 3 characters long.",
            "string.max": "Title must not exceed 30 characters.",
        }),
    description: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.empty": "Description is required.",
            "string.min": "Description must be at least 3 characters long.",
            "string.max": "Description must not exceed 30 characters.",
        }),
    status: Joi.string().valid("active", "completed").optional().default("active")
})

const projectUpdateSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(30)
        .optional()
        .messages({
            "string.min": "Title must be at least 3 characters long.",
            "string.max": "Title must not exceed 30 characters.",
        }),
    description: Joi.string()
        .min(3)
        .max(30)
        .optional()
        .messages({
            "string.min": "Description must be at least 3 characters long.",
            "string.max": "Description must not exceed 30 characters.",
        }),
    status: Joi.string().valid("active", "completed").optional()
})

const taskSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.empty": "Title is required.",
            "string.min": "Title must be at least 3 characters long.",
            "string.max": "Title must not exceed 30 characters.",
        }),
    description: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.empty": "Description is required.",
            "string.min": "Description must be at least 3 characters long.",
            "string.max": "Description must not exceed 30 characters.",
        }),
    status: Joi.string().valid("todo", "in-progress", "done").optional().default("todo"),
    dueDate: Joi.date().required(),
    projectId: Joi.string().required()
})

const taskUpdateSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(30)
        .optional()
        .messages({
            "string.min": "Title must be at least 3 characters long.",
            "string.max": "Title must not exceed 30 characters.",
        }),
    description: Joi.string()
        .min(3)
        .max(30)
        .optional()
        .messages({
            "string.min": "Description must be at least 3 characters long.",
            "string.max": "Description must not exceed 30 characters.",
        }),
    status: Joi.string().valid("todo", "in-progress", "done").optional(),
    dueDate: Joi.date().optional(),
    projectId: Joi.string().optional()
})
module.exports = {
    UserSchema, loginSchema, UserUpdateSchema, projectSchema, projectUpdateSchema,taskSchema,taskUpdateSchema
};