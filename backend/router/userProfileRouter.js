const express = require("express");
const router = express.Router();
const { protect, authorizeRole } = require("../middleware/auth");
const { createProfile, updateProfile, getOneProfile } = require("../controller/userProfileController");



router.post( "/create", protect, authorizeRole("user"), createProfile);

router.put( "/update", protect, authorizeRole("user"), updateProfile );

router.get( "/getone", protect, authorizeRole("user"), getOneProfile );

module.exports = router;
