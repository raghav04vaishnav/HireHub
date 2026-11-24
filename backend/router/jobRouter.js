const express = require("express");
const router = express.Router();
const { createJob, getAllJobs, getCompanyJobs, getOneJob, updateJob, deleteJob } = require("../controller/jobController");
const { protect, authorizeRole } = require("../middleware/auth");

// Public routes
router.get("/all", getAllJobs);

// Company routes
router.get("/my-jobs", protect, authorizeRole("company"), getCompanyJobs);
router.post("/create", protect, authorizeRole("company"), createJob);
router.put("/update/:id", protect, authorizeRole("company"), updateJob);
router.delete("/delete/:id", protect, authorizeRole("company"), deleteJob);

// Dynamic route
router.get("/:id", getOneJob);

module.exports = router;