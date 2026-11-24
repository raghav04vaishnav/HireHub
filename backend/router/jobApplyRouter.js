const express = require("express");
const router = express.Router();
const { getMyApplications, applyForJob, getCompanyApplicants, updateApplicantStatus, previewResume } = require("../controller/jobApplyController");
const { blockUser, unblockUser, getBlockedUsers } = require("../controller/blockedUserController");
const { protect, authorizeRole } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { applyJobLimiter } = require("../middleware/rateLimiter");


router.post( "/apply/:jobId", applyJobLimiter, protect, authorizeRole("user"), upload.single("resume"), applyForJob );

router.get( "/my-applications", protect, authorizeRole("user"), getMyApplications );

router.get( "/company-applicants", protect, authorizeRole("company"), getCompanyApplicants );

router.get( "/resume/:id", protect, authorizeRole("company"), previewResume );

router.put( "/status/:id", protect, authorizeRole("company"), updateApplicantStatus );

router.post( "/block-user/:userId", protect, authorizeRole("company"), blockUser );

router.delete( "/unblock-user/:userId", protect, authorizeRole("company"), unblockUser);

router.get( "/blocked-users", protect, authorizeRole("company"), getBlockedUsers );

module.exports = router;