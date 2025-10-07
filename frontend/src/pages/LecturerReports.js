import React, { useEffect, useState } from "react";
import {
  fetchRoleReports,
  postReport,
  deleteReport,
  fetchPrlFeedbackForLecturer,
  fetchLecturerClasses,
} from "../utils/api";
import { FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const LecturerReports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [classes, setClasses] = useState([]);
  const [newReport, setNewReport] = useState({
    class_id: "",
    week: "",
    topic: "",
    lecture_date: "",
    present_students: "",
    outcomes: "",
    recommendations: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCard, setActiveCard] = useState(null);

  // ------------------------
  // Load reports, feedback, classes
  // ------------------------
  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        // 1️⃣ Reports
        const reportsData = await fetchRoleReports("lecturer", user.id);
        const myReports = Array.isArray(reportsData)
          ? reportsData
          : reportsData.data || [];
        setReports(myReports);

        // 2️⃣ PRL feedback
        const feedbackData = await fetchPrlFeedbackForLecturer(user.id);
        const feedbackArray = Array.isArray(feedbackData)
          ? feedbackData
          : feedbackData.data || [];

        const mappedFeedback = feedbackArray.map((f) => ({
          id: f.id || f.feedback_id,
          feedback_text: f.feedback_text,
          report: {
            report_id: f.report?.report_id || f.report_id,
            topic: f.report?.topic || "",
            lecture_date: f.report?.lecture_date || "",
            class_name: f.report?.class_name || "",
          },
          pl_id: f.pl_id,
          created_at: f.created_at || new Date().toISOString(),
        }));
        setFeedbackList(mappedFeedback);

        // 3️⃣ Classes
        const classesData = await fetchLecturerClasses(user.id);
        const classArray = Array.isArray(classesData)
          ? classesData
          : classesData.data || [];

        const mappedClasses = classArray.map((c, idx) => ({
          key: `${c.id}-${idx}`,
          id: c.id,
          class_name: c.class_name,
          course_id: c.course_id,
        }));
        setClasses(mappedClasses);
      } catch (err) {
        console.error("Error loading lecturer data:", err);
        setError("Failed to load reports, feedback, or classes.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // ------------------------
  // Toggle Card
  // ------------------------
  const handleToggleCard = (type) => {
    setActiveCard(activeCard === type ? null : type);
  };

  // ------------------------
  // Submit Report
  // ------------------------
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (
      !newReport.class_id ||
      !newReport.week ||
      !newReport.topic ||
      !newReport.lecture_date
    ) {
      return alert("Please fill in all required fields.");
    }

    try {
      const payload = { ...newReport, lecturer_id: user.id };
      await postReport(payload);

      const updatedReports = await fetchRoleReports("lecturer", user.id);
      setReports(
        Array.isArray(updatedReports)
          ? updatedReports
          : updatedReports.data || []
      );

      setNewReport({
        class_id: "",
        week: "",
        topic: "",
        lecture_date: "",
        present_students: "",
        outcomes: "",
        recommendations: "",
      });
      alert("✅ Report submitted successfully!");
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Failed to submit report.");
    }
  };

  // ------------------------
  // Delete Report
  // ------------------------
  const handleDeleteReport = async (id) => {
    if (!window.confirm("Delete this report?")) return;

    try {
      await deleteReport(id);
      setReports(reports.filter((r) => r.report_id !== id));
    } catch (err) {
      console.error("Error deleting report:", err);
      alert("Failed to delete report.");
    }
  };

  // ------------------------
  // Export Excel
  // ------------------------
  const exportToExcel = () => {
    if (reports.length === 0) {
      alert("No reports to export!");
      return;
    }

    const data = reports.map((r) => ({
      "Class Name": r.class_name || r.class_id,
      Week: r.week,
      Topic: r.topic,
      "Lecture Date": new Date(r.lecture_date).toLocaleDateString(),
      "Present Students": r.present_students,
      Outcomes: r.outcomes || "",
      Recommendations: r.recommendations || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lecturer Reports");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `LecturerReports_${user.name || "lecturer"}.xlsx`);
  };

  // ------------------------
  // Loading & Error States
  // ------------------------
  if (loading) return <div className="p-4">⏳ Loading lecturer data...</div>;
  if (error) return <div className="alert alert-danger p-4">{error}</div>;

  // ------------------------
  // Render
  // ------------------------
  return (
    <div className="p-4">
      <h2 className="mb-4">👨🏽‍🏫 Lecturer — Reports & Feedback</h2>

      {/* Cards */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        {["create", "view", "feedback"].map((type) => (
          <div
            key={type}
            className={`card p-4 shadow-sm text-center ${
              activeCard === type ? "border-primary" : ""
            }`}
            style={{ width: "220px", cursor: "pointer" }}
            onClick={() => handleToggleCard(type)}
          >
            <h5>
              {type === "create"
                ? "➕ Write Report"
                : type === "view"
                ? "📚 View Reports"
                : "💬 PRL Feedback"}
            </h5>
          </div>
        ))}
      </div>

      {/* ---------------- Create Report ---------------- */}
      {activeCard === "create" && (
        <div className="card p-4 shadow-sm mb-4">
          <h5>➕ Submit New Report</h5>
          <form onSubmit={handleReportSubmit}>
            <div className="mb-2">
              <label>Class</label>
              <select
                className="form-control"
                value={newReport.class_id}
                onChange={(e) =>
                  setNewReport({ ...newReport, class_id: e.target.value })
                }
                required
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.key} value={c.id}>
                    {c.class_name} ({c.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label>Week</label>
              <input
                type="number"
                className="form-control"
                value={newReport.week}
                onChange={(e) =>
                  setNewReport({ ...newReport, week: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-2">
              <label>Topic</label>
              <input
                type="text"
                className="form-control"
                value={newReport.topic}
                onChange={(e) =>
                  setNewReport({ ...newReport, topic: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-2">
              <label>Lecture Date</label>
              <input
                type="date"
                className="form-control"
                value={newReport.lecture_date}
                onChange={(e) =>
                  setNewReport({ ...newReport, lecture_date: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-2">
              <label>Present Students</label>
              <input
                type="number"
                className="form-control"
                value={newReport.present_students}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    present_students: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-2">
              <label>Outcomes</label>
              <textarea
                className="form-control"
                rows="2"
                value={newReport.outcomes}
                onChange={(e) =>
                  setNewReport({ ...newReport, outcomes: e.target.value })
                }
              />
            </div>

            <div className="mb-2">
              <label>Recommendations</label>
              <textarea
                className="form-control"
                rows="2"
                value={newReport.recommendations}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    recommendations: e.target.value,
                  })
                }
              />
            </div>

            <button className="btn btn-success w-100" type="submit">
              Submit Report
            </button>
          </form>
        </div>
      )}

      {/* ---------------- View Reports ---------------- */}
      {activeCard === "view" && (
        <div className="card p-4 shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5>📚 My Submitted Reports</h5>
            <button className="btn btn-outline-success btn-sm" onClick={exportToExcel}>
              ⬇️ Export to Excel
            </button>
          </div>

          {reports.length === 0 ? (
            <p>No reports submitted yet.</p>
          ) : (
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Week</th>
                  <th>Topic</th>
                  <th>Date</th>
                  <th>Present Students</th>
                  <th>Outcomes</th>
                  <th>Recommendations</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.report_id}>
                    <td>{r.class_name || r.class_id}</td>
                    <td>{r.week}</td>
                    <td>{r.topic}</td>
                    <td>{new Date(r.lecture_date).toLocaleDateString()}</td>
                    <td>{r.present_students}</td>
                    <td>{r.outcomes || "—"}</td>
                    <td>{r.recommendations || "—"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteReport(r.report_id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ---------------- PRL Feedback ---------------- */}
      {activeCard === "feedback" && (
        <div className="card p-4 shadow-sm mb-4">
          <h5>💬 PRL Feedback Received</h5>
          {feedbackList.length === 0 ? (
            <p className="text-muted">No feedback received yet.</p>
          ) : (
            <ul className="list-group">
              {feedbackList.map((f) => (
                <li key={f.id} className="list-group-item">
                  <strong>Report ID:</strong> {f.report.report_id || "—"} <br />
                  <strong>Topic:</strong> {f.report.topic || "—"} <br />
                  <strong>Feedback:</strong> {f.feedback_text} <br />
                  <small className="text-muted">
                    {new Date(
                      f.report.lecture_date || f.created_at
                    ).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default LecturerReports;
