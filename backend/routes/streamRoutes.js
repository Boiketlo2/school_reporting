// routes/streamRoutes.js
const express = require("express");
const router = express.Router();
const { getAllStreams } = require("../controllers/streamController");

// ✅ GET /api/streams
router.get("/", getAllStreams);

module.exports = router;
