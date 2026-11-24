const express = require("express");
const router = express.Router();

const { Signup, createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany, editProfile } = require("../controller/companyController");

const { signupLimiter } = require("../middleware/rateLimiter");
const { protect, authorizeRole } = require("../middleware/auth");

router.post("/signup", signupLimiter, Signup);

router.post("/create", protect, authorizeRole("admin"), createCompany);

router.get("/get", getCompanies);
router.get("/getsinglecompany/:id", getCompanyById);

router.put("/update/:id", protect, authorizeRole("admin"), updateCompany);

router.delete("/delete/:id", protect, authorizeRole("admin"), deleteCompany);

router.post("/editProfile", protect, authorizeRole("company"), editProfile);

module.exports = router;
