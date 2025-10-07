// backend/routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllFeedback,
  addFeedback,
  deleteFeedback,
  getFeedbackByRole, // NEW
} = require("../controllers/feedbackController");

// --------------------------------
// Routes
// --------------------------------

// ✅ Get all feedback (admin use or general listing)
router.get("/", getAllFeedback);

// ✅ Get feedback or announcements based on role (e.g. ?role=pl or ?role=prl)
router.get("/role/:role", getFeedbackByRole);

// ✅ Add new feedback or announcement
router.post("/", addFeedback);

// ✅ Delete feedback or announcement
router.delete("/:id", deleteFeedback);

module.exports = router;
