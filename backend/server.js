const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const companyRouter = require("./router/companyRouter");
const userRouter = require("./router/userRouter");
const jobRouter = require("./router/jobRouter");
const userProfileRouter = require("./router/userProfileRouter");
const companyProfileRouter = require("./router/companyProfileRouter");
const jobApplyRouter = require("./router/jobApplyRouter");
const adminRouter = require("./router/adminRouter");
const authRouter = require("./router/authRouter");
const notificationRouter = require("./router/notificationRouter")
const interviewRouter = require("./router/interviewRouter")

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/company", companyRouter);
app.use("/api/user", userRouter);
app.use("/api/job", jobRouter);
app.use("/api/job-apply", jobApplyRouter);
app.use("/api/user-profile", userProfileRouter);
app.use("/api/company-profile", companyProfileRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/interview", interviewRouter)
app.use("/api/admin", adminRouter);



app.get("/", (req, res) => {
    res.send("Job Portal Backend is running");
});

const port = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed:", err.message);
    });