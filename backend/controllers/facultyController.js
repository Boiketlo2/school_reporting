const db = require("../utils/db");

// Get all faculties
exports.getAll = (req, res) => {
  db.query("SELECT * FROM faculties", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Add faculty
exports.add = (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO faculties (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Faculty added", id: result.insertId });
  });
};
