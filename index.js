const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const apiRouter = require("./api");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRouter);

app.listen(3000, () => {
    mongoose
        .connect(process.env.DB_URL)
        .then(() => console.log("Connected to Database"))
        .catch(() => console.log("Error Connecting to DB"));

    console.log("Running on PORT 3000");
});
