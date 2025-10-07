const express = require("express");
const router = express.Router();
const {
  getAll,
  add,
  delete: del,
  getLecturerClasses,
  getPlClasses,
} = require("../controllers/classController");

// Universal
router.get("/", getAll);
router.post("/", add);
router.delete("/:id", del);

// Role-specific
router.get("/lecturer/:id", getLecturerClasses);
router.get("/pl/:id", getPlClasses);

module.exports = router;
