const express = require("express");
const router = express.Router();
const {
  getAll,
  add,
  delete: del,
  assignLecturer,
  getPrlCoursesWithStreamsAndFaculty, // <-- added PRL endpoint
} = require("../controllers/courseController");

// GET all courses (optionally filtered for PL)
router.get("/", getAll);          

// GET all courses for PRL (with faculty & stream info)
router.get("/prl/all", getPrlCoursesWithStreamsAndFaculty);

// POST add course
router.post("/", add);

// DELETE a course
router.delete("/:id", del);

// POST assign lecturer (create class)
router.post("/assign", assignLecturer);

module.exports = router;
