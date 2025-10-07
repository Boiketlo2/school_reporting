const db = require("../utils/db");

// --------------------
// GET ratings for a specific role and user
// --------------------
exports.getRatingsByRole = (req, res) => {
  const { role, userId } = req.params;

  if (!role || !userId) {
    return res.status(400).json({ message: "Missing role or userId" });
  }

  let sql = `
    SELECT 
      r.id AS rating_id, 
      r.report_id, 
      r.rater_id, 
      r.rater_role, 
      r.score, 
      r.comments, 
      r.created_at,
      rep.topic, 
      rep.class_id, 
      rep.lecturer_id, 
      rep.student_id
    FROM ratings r
    JOIN reports rep ON r.report_id = rep.id
  `;
  const params = [userId];

  switch (role) {
    case "student":
      sql += ` WHERE r.rater_role = 'student' AND r.rater_id = ?`;
      break;

    case "lecturer":
      sql += ` WHERE rep.lecturer_id = ?`;
      break;

    case "prl":
      sql += `
        LEFT JOIN classes cl ON rep.class_id = cl.id
        LEFT JOIN courses co ON cl.course_id = co.id
        WHERE co.faculty_id = (
          SELECT faculty_id FROM users WHERE id = ?
        )
      `;
      break;

    case "pl":
      sql += `
        LEFT JOIN classes cl ON rep.class_id = cl.id
        LEFT JOIN courses co ON cl.course_id = co.id
        WHERE co.faculty_id = (
          SELECT faculty_id FROM users WHERE id = ?
        )
      `;
      break;

    default:
      return res.status(400).json({ message: "Invalid role" });
  }

  sql += ` ORDER BY r.created_at DESC`;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching ratings:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

// --------------------
// POST a new rating
// --------------------
exports.addRating = (req, res) => {
  const { report_id, rater_id, rater_role, score, comments } = req.body;

  if (!report_id || !rater_id || !rater_role || score == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Ensure rater_role is valid
  const validRoles = ["student", "lecturer", "prl", "pl"];
  if (!validRoles.includes(rater_role)) {
    return res.status(400).json({ message: "Invalid rater_role" });
  }

  const sql = `
    INSERT INTO ratings (report_id, rater_id, rater_role, score, comments)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [report_id, rater_id, rater_role, score, comments || ""], (err, result) => {
    if (err) {
      console.error("Error adding rating:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Rating added", id: result.insertId });
  });
};
