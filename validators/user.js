const Joi = require("joi");

const UserRegistrationSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Name must be a String of Characters.",
        "string.empty": "Name is Required and cannot be empty.",
        "any.required": "Name is Required and cannot be empty.",
    }),
    email: Joi.string().required().email().messages({
        "string.base": "Email must be a String of Characters.",
        "string.email": "Email must be a valid email address.",
        "string.empty": "Email is Required and cannot be empty.",
        "any.required": "Email is Required and cannot be empty.",
    }),
    password: Joi.string()
        .min(8)
        .max(20)
        .pattern(new RegExp("(?=.*[A-Z])")) // At least one uppercase letter
        .pattern(new RegExp("(?=.*[a-z])")) // At least one lowercase letter
        .pattern(new RegExp("(?=.*\\d)")) // At least one digit
        .pattern(new RegExp("(?=.*[!@#$%^&*])")) // At least one special character
        .pattern(new RegExp("^[^\\s]+$")) // No spaces allowed
        .required()
        .messages({
            "string.base": "Password must be a String of Characters.",
            "string.empty": "Password is required and cannot be empty.",
            "string.min": "Password must be at least 8 characters long.",
            "string.max": "Password cannot exceed 20 characters.",
            "string.pattern.base":
                "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character (!@#$%^&*), and no spaces.",
            "any.required": "Password is required and cannot be empty.",
        }),
});

module.exports = { UserRegistrationSchema };
