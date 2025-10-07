const express = require("express");
const router = express.Router();
const {
  getReportsByRole,
  addReport,
  deleteReport,
  getPrlFeedbackForLecturer,
} = require("../controllers/reportController");

// --------------------
// Routes
// --------------------

// ✅ Get reports by role and user ID
// Example: /api/reports/lecturer/4  or  /api/reports/student/7
router.get("/:role/:userId", getReportsByRole);

// ✅ Add a new report
// Supports both lecturers and students
// Lecturer payload includes lecturer_id
// Student payload includes student_id
router.post("/", addReport);

// ✅ Delete a report by ID
// Example: /api/reports/123
router.delete("/:reportId", deleteReport);

// ✅ Get PRL feedback for a specific lecturer
// Example: /api/reports/feedback/lecturer/4
router.get("/feedback/lecturer/:lecturerId", getPrlFeedbackForLecturer);

module.exports = router;
