const express = require("express");

const authRouter = require("./auth");
const userRouter = require("./user.js");

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
    res.json({
        api_version: 1,
    });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);

module.exports = apiRouter;
