const db = require("../utils/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ====================
// Register user
// ====================
exports.register = async (req, res) => {
  const { name, email, student_number, password, role } = req.body;
  if (!name || !password || (!email && !student_number)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name, email, student_number, password, role) VALUES (?, ?, ?, ?, ?)";
    db.query(
      sql,
      [name, email || null, student_number || null, hashedPassword, role || "student"],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({
          message: "User registered successfully",
          userId: result.insertId,
        });
      }
    );
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Registration failed", error: err });
  }
};

// ====================
// Login user
// ====================
exports.login = (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Email/Student Number and Password are required" });
  }

  const sql = identifier.includes("@")
    ? "SELECT * FROM users WHERE email = ?"
    : "SELECT * FROM users WHERE student_number = ?";

  db.query(sql, [identifier], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      name: user.name,
      id: user.id,
      faculty_id: user.faculty_id || null, // ✅ include faculty_id if available
    });
  });
};

// ====================
// Get current logged-in user
// ====================
exports.getMe = (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const sql = "SELECT id, name, role, faculty_id FROM users WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]); // returns full user including faculty_id
  });
};
