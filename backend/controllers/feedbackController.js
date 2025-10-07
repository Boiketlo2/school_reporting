const db = require("../utils/db");

// --------------------
// GET all feedback and announcements
// --------------------
exports.getAllFeedback = (req, res) => {
  const sql = `
    SELECT 
      f.id,
      f.feedback_text,
      f.created_at,
      f.report_id,
      f.prl_id,
      f.pl_id,
      r.id AS report_ref,
      prl.name AS prl_name,
      pl.name AS pl_name,
      l.name AS lecturer_name
    FROM feedback f
    LEFT JOIN reports r ON f.report_id = r.id
    LEFT JOIN users prl ON f.prl_id = prl.id
    LEFT JOIN users pl ON f.pl_id = pl.id
    LEFT JOIN users l ON r.lecturer_id = l.id
    ORDER BY f.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// --------------------
// GET feedback or announcements by role
// --------------------
exports.getFeedbackByRole = (req, res) => {
  const { role } = req.params;

  let sql;
  if (role === "pl") {
    // 🔹 Fetch all announcements made by PLs
    sql = `
      SELECT 
        f.id,
        f.feedback_text AS announcement_text,
        f.created_at,
        f.pl_id,
        u.name AS pl_name
      FROM feedback f
      LEFT JOIN users u ON f.pl_id = u.id
      WHERE f.pl_id IS NOT NULL
      ORDER BY f.created_at DESC
    `;
  } else if (role === "prl") {
    // 🔹 Fetch feedback from PRLs about reports
    sql = `
      SELECT 
        f.id,
        f.feedback_text,
        f.created_at,
        f.report_id,
        f.prl_id,
        u.name AS prl_name,
        r.topic,
        r.lecture_date
      FROM feedback f
      LEFT JOIN users u ON f.prl_id = u.id
      LEFT JOIN reports r ON f.report_id = r.id
      WHERE f.prl_id IS NOT NULL
      ORDER BY f.created_at DESC
    `;
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// --------------------
// ADD feedback (PRL) or announcement (PL)
// --------------------
exports.addFeedback = (req, res) => {
  const { report_id, prl_id, pl_id, feedback_text } = req.body;

  // 🔹 PRL Feedback
  if (report_id && prl_id && feedback_text) {
    const sql =
      "INSERT INTO feedback (report_id, prl_id, feedback_text) VALUES (?, ?, ?)";
    db.query(sql, [report_id, prl_id, feedback_text], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      return res
        .status(201)
        .json({ message: "Feedback added", id: result.insertId });
    });
  }
  // 🔹 PL Announcement
  else if (pl_id && feedback_text) {
    const sql = "INSERT INTO feedback (pl_id, feedback_text) VALUES (?, ?)";
    db.query(sql, [pl_id, feedback_text], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      return res
        .status(201)
        .json({ message: "Announcement added", id: result.insertId });
    });
  } else {
    return res.status(400).json({ message: "Missing required fields" });
  }
};

// --------------------
// DELETE feedback or announcement
// --------------------
exports.deleteFeedback = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM feedback WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Feedback/Announcement deleted" });
  });
};
