const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const bodyRequired = require("../middleware/bodyRequires");
const User = require("../model/user.model");
const {
    UserRegistrationSchema,
    UserLoginSchema,
} = require("../validators/user");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require("../utils/jwt");

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
    const {
        value: { name, email, password },
        error,
    } = UserRegistrationSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "Email already registered",
        });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    try {
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
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

/**
 * Handle User Login
 *
 * @route POST /login
 * @middleware {Function} bodyRequired - Ensures that the request body is not empty.
 * @async
 * @param {Object} req.body - The request body containing registration details.
 * @param {string} req.body.email - The user's email.
 * @param {string} req.body.password - The user's password.
 */
authRouter.post("/login", bodyRequired, async (req, res) => {
    const {
        value: { email, password },
        error,
    } = UserLoginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }

    const user = await User.findOne({ email });
    // For Security it's better to respond with Generic Errors
    // ref: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-and-error-messages
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid Email or Password",
        });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid Email or Password",
        });
    }

    const payload = { id: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return res.json({
        success: true,
        message: "User Logged In",
        accessToken,
    });
});

/**
 * Handle Token Refresh
 *
 * @route POST /refresh
 * @async
 * @param {string} req.cookies.refreshToken - The user's refresh token.
 */
authRouter.post("/refresh", async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "No refresh token provided",
        });
    }

    const { error, data } = verifyRefreshToken(refreshToken);
    if (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or Expired refresh token",
        });
    }

    const accessToken = generateAccessToken({ id: data.id, email: data.email });
    return res.status(200).json({
        success: true,
        message: "New Access Token Generated",
        accessToken,
    });
});

/**
 * Handle User Logout
 *
 * @route POST /logout
 * @async
 */
authRouter.post("/logout", async (req, res) => {
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    return res.status(200).json({
        success: true,
        message: "Logged Out Successfully",
    });
});

module.exports = authRouter;
