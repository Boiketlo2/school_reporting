// backend/routes/ratingRoutes.js
const express = require("express");
const router = express.Router();
const { getRatingsByRole, addRating } = require("../controllers/ratingsController");

// --------------------
// GET ratings for a specific role and user
// Example: /api/ratings/student/2
// Example: /api/ratings/lecturer/6
// --------------------
router.get("/:role/:userId", getRatingsByRole);

// --------------------
// POST a new rating
// Example: /api/ratings
// Body: { report_id, rater_id, rater_role, score, comments }
// --------------------
router.post("/", addRating);

module.exports = router;
