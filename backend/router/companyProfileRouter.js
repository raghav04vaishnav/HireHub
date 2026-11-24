const express = require("express");
const router = express.Router();
const { protect, authorizeRole } = require("../middleware/auth");
const { createCompanyProfile, updateCompanyProfile, getOneCompanyProfile, } = require("../controller/companyProfileController");


router.post( "/create", protect, authorizeRole("company"), createCompanyProfile );

router.put( "/edit-profile", protect, authorizeRole("company"), updateCompanyProfile);

router.get( "/getone", protect, authorizeRole("company"), getOneCompanyProfile );

module.exports = router;
