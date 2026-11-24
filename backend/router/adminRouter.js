const express = require("express");
const router = express.Router();
const { getDashboardStats, getAllUsers, getAllCompanies, getAllJobs, getAllApplications, deleteUser } = require("../controller/adminController");
const { protect, authorizeRole } = require("../middleware/auth");


router.get("/stats", protect, authorizeRole("admin"), getDashboardStats);
router.get("/users", protect, authorizeRole("admin"), getAllUsers);
router.get("/companies", protect, authorizeRole("admin"), getAllCompanies);
router.get("/jobs", protect, authorizeRole("admin"), getAllJobs);
router.get("/applications", protect, authorizeRole("admin"), getAllApplications);
router.delete("/users/:id", protect, authorizeRole("admin"), deleteUser);

module.exports = router;
