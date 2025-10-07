require("dotenv").config();
const express = require("express");
const cors = require("cors");

// ------------------------
// Database (MySQL)
// ------------------------
const db = require("./utils/db");

// ------------------------
// Import Routes
// ------------------------
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const courseRoutes = require("./routes/courseRoutes");
const classRoutes = require("./routes/classRoutes");
const reportRoutes = require("./routes/reportRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const ratingRoutes = require("./routes/ratingRoutes");          // Ratings
const monitoringRoutes = require("./routes/monitoringRoutes");  // Monitoring
const streamRoutes = require("./routes/streamRoutes");          // ✅ Streams

// ------------------------
// Express App Setup
// ------------------------
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // built-in body parser

// ------------------------
// Test DB Connection on Startup
// ------------------------
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
    connection.release();
  }
});

// ------------------------
// Routes
// ------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/ratings", ratingRoutes);          // Ratings API
app.use("/api/monitoring", monitoringRoutes);   // Monitoring API
app.use("/api/streams", streamRoutes);          // ✅ Streams API

// ------------------------
// Root & Test Routes
// ------------------------
app.get("/", (req, res) => {
  res.json({ message: "✅ Faculty Reporting Backend is running!" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// ------------------------
// 404 Handler
// ------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ------------------------
// Global Error Handler
// ------------------------
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ------------------------
// Start Server
// ------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
