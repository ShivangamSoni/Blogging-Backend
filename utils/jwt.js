const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

function generateAccessToken(payload) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "15d" });
}

function verifyRefreshToken(token) {
    let data, error;
    try {
        data = jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (err) {
        error = err;
    }

    return { error, data };
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
};
