const db = require("../utils/db");

// Get all classes (universal)
exports.getAll = (req, res) => {
  const sql = `
    SELECT cl.id, cl.class_name, cl.schedule_time, cl.venue, cl.total_students,
           c.name AS course_name, c.code AS course_code,
           u.name AS lecturer_name
    FROM classes cl
    LEFT JOIN courses c ON cl.course_id = c.id
    LEFT JOIN users u ON cl.lecturer_id = u.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Add class
exports.add = (req, res) => {
  const { class_name, course_id, lecturer_id, schedule_time, venue, total_students } = req.body;
  const sql = "INSERT INTO classes (class_name, course_id, lecturer_id, schedule_time, venue, total_students) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [class_name, course_id, lecturer_id, schedule_time, venue, total_students || 0], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Class added", id: result.insertId });
  });
};

// Delete class
exports.delete = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM classes WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Class deleted" });
  });
};

// --------------------
// Role-specific endpoints
// --------------------

// Lecturer classes
exports.getLecturerClasses = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT cl.id, cl.class_name, cl.schedule_time, cl.venue, cl.total_students,
           c.name AS course_name, c.code AS course_code, c.stream AS stream
    FROM classes cl
    LEFT JOIN courses c ON cl.course_id = c.id
    WHERE cl.lecturer_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// PL classes
exports.getPlClasses = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT cl.id, cl.class_name, cl.schedule_time, cl.venue, cl.total_students,
           c.name AS course_name, c.code AS course_code
    FROM classes cl
    LEFT JOIN courses c ON cl.course_id = c.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
