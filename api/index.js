const express = require("express");

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
    res.json({
        api_version: 1,
    });
});

module.exports = apiRouter;
