const db = require("../utils/db");

// --------------------
// Add a generic report
// --------------------
exports.addReport = (req, res) => {
  const {
    class_id,
    lecturer_id,
    student_id,
    week,
    lecture_date,
    topic,
    outcomes,
    recommendations,
    present_students,
  } = req.body;

  // Validation
  if (!class_id || !week || !lecture_date || !topic) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `
    INSERT INTO reports
      (class_id, lecturer_id, student_id, week, lecture_date, topic, outcomes, recommendations, present_students)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      class_id,
      lecturer_id || null,
      student_id || null,
      week,
      lecture_date,
      topic,
      outcomes || "",
      recommendations || "",
      present_students || 0,
    ],
    (err, result) => {
      if (err) {
        console.error("DB Insert Error:", err);
        return res.status(500).json({
          success: false,
          message: "Database error while adding report",
          error: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Report submitted successfully",
        data: {
          report_id: result.insertId,
          class_id,
          lecturer_id: lecturer_id || null,
          student_id: student_id || null,
          week,
          lecture_date,
          topic,
          outcomes: outcomes || "",
          recommendations: recommendations || "",
          present_students: present_students || 0,
        },
      });
    }
  );
};

// --------------------
// Delete a report
// --------------------
exports.deleteReport = (req, res) => {
  const { reportId } = req.params;
  if (!reportId) return res.status(400).json({ message: "Missing report ID" });

  const sql = `DELETE FROM reports WHERE id = ?`;
  db.query(sql, [reportId], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "DB error", error: err.message });

    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });

    res.json({ success: true, message: "Report deleted successfully" });
  });
};

// --------------------
// Get reports by role
// --------------------
exports.getReportsByRole = (req, res) => {
  const { role, userId } = req.params;
  if (!role || !userId)
    return res.status(400).json({ message: "Missing role or userId" });

  let query = "";
  const params = [userId];

  switch (role.toLowerCase()) {
    case "student":
      query = `
        SELECT 
          r.id AS report_id,
          r.week,
          r.lecture_date,
          r.topic,
          r.outcomes,
          r.recommendations,
          r.present_students,
          c.id AS class_id,
          c.class_name,
          co.name AS course_name,
          co.code AS course_code,
          u.name AS lecturer_name
        FROM reports r
        JOIN classes c ON r.class_id = c.id
        JOIN courses co ON c.course_id = co.id
        LEFT JOIN users u ON r.lecturer_id = u.id
        WHERE r.student_id = ?
        ORDER BY r.lecture_date DESC
      `;
      break;

    case "lecturer":
      query = `
        SELECT 
          r.id AS report_id,
          r.week,
          r.lecture_date,
          r.topic,
          r.outcomes,
          r.recommendations,
          r.present_students,
          c.id AS class_id,
          c.class_name,
          co.name AS course_name,
          co.code AS course_code
        FROM reports r
        JOIN classes c ON r.class_id = c.id
        JOIN courses co ON c.course_id = co.id
        WHERE r.lecturer_id = ?
        ORDER BY r.lecture_date DESC
      `;
      break;

    case "prl":
      query = `
        SELECT 
          r.id AS report_id,
          r.week,
          r.lecture_date,
          r.topic,
          r.outcomes,
          r.recommendations,
          r.present_students,
          c.id AS class_id,
          c.class_name,
          co.name AS course_name,
          co.code AS course_code,
          u.name AS lecturer_name
        FROM reports r
        JOIN classes c ON r.class_id = c.id
        JOIN courses co ON c.course_id = co.id
        JOIN users u ON r.lecturer_id = u.id
        ORDER BY r.lecture_date DESC
      `;
      break;

    case "pl":
      query = `
        SELECT 
          r.id AS report_id,
          r.week,
          r.lecture_date,
          r.topic,
          r.outcomes,
          r.recommendations,
          r.present_students,
          c.id AS class_id,
          c.class_name,
          co.name AS course_name,
          co.code AS course_code,
          u.name AS lecturer_name,
          f.pl_id AS prl_id,
          f.feedback_text AS prl_feedback
        FROM reports r
        JOIN classes c ON r.class_id = c.id
        JOIN courses co ON c.course_id = co.id
        JOIN users u ON r.lecturer_id = u.id
        LEFT JOIN feedback f ON f.report_id = r.id AND f.type='feedback'
        WHERE co.faculty_id = (
          SELECT faculty_id FROM users WHERE id = ?
        )
        ORDER BY r.lecture_date DESC
      `;
      params[0] = userId;
      break;

    default:
      return res.status(400).json({ message: "Invalid role" });
  }

  db.query(query, params, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "DB error", error: err.message });

    res.json({ success: true, data: results });
  });
};

// --------------------
// Get PRL feedback for lecturer's reports
// --------------------
exports.getPrlFeedbackForLecturer = (req, res) => {
  const { lecturerId } = req.params;
  if (!lecturerId)
    return res.status(400).json({ message: "Missing lecturerId" });

  const query = `
    SELECT 
      f.id AS feedback_id,
      f.report_id,
      f.feedback_text,
      f.pl_id,
      r.topic,
      r.lecture_date,
      c.class_name
    FROM feedback f
    JOIN reports r ON f.report_id = r.id
    JOIN classes c ON r.class_id = c.id
    WHERE r.lecturer_id = ?
      AND f.type = 'feedback'
    ORDER BY r.lecture_date DESC
  `;

  db.query(query, [lecturerId], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "DB error", error: err.message });

    const feedback = results.map((f) => ({
      id: f.feedback_id,
      feedback_text: f.feedback_text,
      report: {
        report_id: f.report_id,
        topic: f.topic,
        lecture_date: f.lecture_date,
        class_name: f.class_name,
      },
      pl_id: f.pl_id,
    }));

    res.json({ success: true, data: feedback });
  });
};
