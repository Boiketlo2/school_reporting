const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth"); // your JWT auth middleware

// ---------------------
// Public routes
// ---------------------
router.post("/register", register);
router.post("/login", login);

// ---------------------
// Protected route: get current user
// ---------------------
router.get("/me", authMiddleware, getMe);

module.exports = router;
