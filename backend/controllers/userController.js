const db = require("../utils/db");

// -----------------------------
// Get all users
// -----------------------------
exports.getAll = (req, res) => {
  const sql = `
    SELECT id, name, email, student_number, role, created_at 
    FROM users
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// -----------------------------
// Get users by role
// -----------------------------
exports.getByRole = (req, res) => {
  const { role } = req.params;
  const sql = `
    SELECT id, name, email, student_number, role 
    FROM users 
    WHERE role = ?
  `;
  db.query(sql, [role], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// -----------------------------
// Delete a user
// -----------------------------
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM users WHERE id = ?`;
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "User deleted successfully" });
  });
};

// -----------------------------
// Get lecturers under a specific faculty
// -----------------------------
exports.getLecturersByFaculty = (req, res) => {
  const { facultyId } = req.params;

  const sql = `
    SELECT 
      id, 
      name, 
      email
    FROM users 
    WHERE role = 'lecturer' 
      AND faculty_id = ?
  `;

  db.query(sql, [facultyId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
