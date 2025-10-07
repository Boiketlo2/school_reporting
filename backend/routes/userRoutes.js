const express = require("express");
const router = express.Router();
const { getAll, getByRole, deleteUser,getLecturersByFaculty } = require("../controllers/userController");

router.get("/", getAll);
router.get("/role/:role", getByRole);
router.delete("/:id", deleteUser);
router.get("/faculty/:facultyId/lecturers", getLecturersByFaculty);

module.exports = router;
