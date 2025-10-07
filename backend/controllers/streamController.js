// controllers/streamController.js
const db = require("../utils/db");

// ✅ Get all streams
exports.getAllStreams = (req, res) => {
  const sql = `SELECT id, name FROM streams ORDER BY name ASC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
