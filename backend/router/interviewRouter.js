const express = require("express");
const router = express.Router();
const { scheduleInterview, getMyInterviews, getCompanyInterviews, updateInterviewResult, } = require("../controller/interviewController");
const { protect, authorizeRole } = require("../middleware/auth");


router.post( "/schedule", protect, authorizeRole("company"), scheduleInterview );

router.get( "/my-interviews", protect, authorizeRole("user"), getMyInterviews);

router.get( "/company-interviews", protect, authorizeRole("company"), getCompanyInterviews);

router.put( "/result/:id", protect, authorizeRole("company"), updateInterviewResult ); 

module.exports = router;
