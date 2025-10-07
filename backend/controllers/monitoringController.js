// controllers/monitoringController.js
const db = require("../utils/db");

// Unified Monitoring Controller
exports.getMonitoring = (req, res) => {
  const { role, id } = req.user; // user object injected from route

  let sql = "";
  let params = [];

  switch (role) {
    case "student":
      // Student: classes they are enrolled in + reports (include classes without reports)
      sql = `
        SELECT 
          c.id AS class_id,
          c.class_name,
          c.schedule_time,
          c.venue,
          cr.name AS course_name,
          cr.code AS course_code,
          r.id AS report_id,
          r.week,
          r.lecture_date,
          r.topic,
          r.outcomes,
          r.recommendations,
          r.present_students
        FROM student_classes sc
        JOIN classes c ON sc.class_id = c.id
        JOIN courses cr ON c.course_id = cr.id
        LEFT JOIN reports r ON r.class_id = c.id AND r.student_id = ?
        WHERE sc.student_id = ?
        ORDER BY c.class_name ASC, r.week ASC
      `;
      params = [id, id];
      break;

    case "lecturer":
      // Lecturer: classes they teach + reports
      sql = `
        SELECT 
          c.id AS class_id,
          c.class_name,
          cr.name AS course_name,
          cr.code AS course_code,
          r.id AS report_id,
          r.week,
          r.lecture_date,
          r.topic,
          r.outcomes,
          r.recommendations,
          r.present_students
        FROM classes c
        JOIN courses cr ON c.course_id = cr.id
        LEFT JOIN reports r ON r.class_id = c.id
        WHERE c.lecturer_id = ?
        ORDER BY r.week ASC
      `;
      params = [id];
      break;

    case "prl":
      // PRL: reports with feedback they gave
      sql = `
        SELECT 
          c.id AS class_id,
          c.class_name,
          cr.name AS course_name,
          cr.code AS course_code,
          r.id AS report_id,
          r.week,
          r.lecture_date,
          r.topic,
          r.outcomes,
          r.recommendations,
          r.present_students,
          f.feedback_text AS prl_feedback
        FROM feedback f
        JOIN reports r ON f.report_id = r.id
        JOIN classes c ON r.class_id = c.id
        JOIN courses cr ON c.course_id = cr.id
        WHERE f.prl_id = ?
        ORDER BY r.week ASC
      `;
      params = [id];
      break;

    case "pl":
      // PL: all classes in the courses they supervise
      // Note: adjust if you have pl-course mapping table
      sql = `
        SELECT 
          c.id AS class_id,
          c.class_name,
          cr.name AS course_name,
          cr.code AS course_code,
          r.id AS report_id,
          r.week,
          r.lecture_date,
          r.topic,
          r.outcomes,
          r.recommendations,
          r.present_students
        FROM classes c
        JOIN courses cr ON c.course_id = cr.id
        LEFT JOIN reports r ON r.class_id = c.id
        ORDER BY cr.name, c.class_name, r.week ASC
      `;
      params = [];
      break;

    default:
      return res.status(400).json({ error: "Invalid role" });
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Monitoring DB error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.json({ data: results });
  });
};
