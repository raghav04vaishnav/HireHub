const express = require("express");
const router = express.Router();
const { getMyNotifications, markNotificationAsRead } = require("../controller/notificationController");
const { protect, authorizeRole } = require("../middleware/auth");


router.get( "/my-notifications", protect, authorizeRole("user", "company"), getMyNotifications );

router.put( "/read/:id", protect, authorizeRole("user", "company"), markNotificationAsRead );

module.exports = router;
