const express = require("express");

const authRouter = require("./auth");

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
    res.json({
        api_version: 1,
    });
});

apiRouter.use("/auth", authRouter);

module.exports = apiRouter;
