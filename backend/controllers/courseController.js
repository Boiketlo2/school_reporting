const db = require("../utils/db");

// ------------------------
// Get all courses (with faculty & stream info)
// ------------------------
exports.getAll = (req, res) => {
  const { role, userId } = req.query; // optional filtering for PL

  let sql = `
    SELECT 
      c.id, 
      c.name, 
      c.code, 
      f.name AS faculty_name, 
      s.name AS stream_name
    FROM courses c
    LEFT JOIN faculties f ON c.faculty_id = f.id
    LEFT JOIN streams s ON c.stream_id = s.id
  `;
  const params = [];

  // If PL is requesting, filter by their faculty
  if (role && role.toLowerCase() === "pl" && userId) {
    sql += `
      WHERE c.faculty_id = (
        SELECT faculty_id FROM users WHERE id = ?
      )
    `;
    params.push(userId);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ------------------------
// Get all courses for PRL with faculty & stream info
// ------------------------
exports.getPrlCoursesWithStreamsAndFaculty = (req, res) => {
  const sql = `
    SELECT 
      c.id, 
      c.name, 
      c.code, 
      f.name AS faculty_name, 
      s.name AS stream_name
    FROM courses c
    LEFT JOIN faculties f ON c.faculty_id = f.id
    LEFT JOIN streams s ON c.stream_id = s.id
    ORDER BY c.name ASC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ------------------------
// Add a new course
// ------------------------
exports.add = (req, res) => {
  const { name, code, faculty_id, stream_id } = req.body;

  const sql = `
    INSERT INTO courses (name, code, faculty_id, stream_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, code, faculty_id, stream_id || null], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ 
      message: "Course added", 
      id: result.insertId 
    });
  });
};

// ------------------------
// Delete a course
// ------------------------
exports.delete = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM courses WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Course deleted" });
  });
};

// ------------------------
// Assign a lecturer to a course (creates a class)
// ------------------------
exports.assignLecturer = (req, res) => {
  const { course_id, lecturer_id, class_name, schedule_time, venue, total_students } = req.body;

  if (!course_id || !lecturer_id || !class_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `
    INSERT INTO classes (course_id, lecturer_id, class_name, schedule_time, venue, total_students)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [course_id, lecturer_id, class_name, schedule_time || "", venue || "", total_students || 0], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ 
      message: "Lecturer assigned to course", 
      class_id: result.insertId 
    });
  });
};
