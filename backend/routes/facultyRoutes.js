const express = require("express");
const router = express.Router();
const { getAll, add } = require("../controllers/facultyController");

router.get("/", getAll);
router.post("/", add);

module.exports = router;
