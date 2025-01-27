const express = require("express");
const bcrypt = require("bcrypt");

const bodyRequired = require("../middleware/bodyRequires");

const User = require("../model/user.model");
const { UserRegistrationSchema } = require("../validators/user");

const authRouter = express.Router();

const SALT_ROUNDS = 10;

/**
 * Handle User Registration
 *
 * @route POST /register
 * @middleware {Function} bodyRequired - Ensures that the request body is not empty.
 * @async
 * @param {Object} req.body - The request body containing registration details.
 * @param {string} req.body.name - The user's name.
 * @param {string} req.body.email - The user's email.
 * @param {string} req.body.password - The user's password.
 */
authRouter.post("/register", bodyRequired, async (req, res) => {
    const { value, error } = UserRegistrationSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }

    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "Email already registered",
        });
    }

    value.password = await bcrypt.hash(value.password, SALT_ROUNDS);

    try {
        const user = await User.create(value);
        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "DB Error",
        });
    }
});

module.exports = authRouter;
