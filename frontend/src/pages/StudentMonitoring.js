// src/pages/StudentMonitoring.js
import React, { useEffect, useState } from "react";
import {
  fetchRoleMonitoring,
  postReport,
  fetchRoleReports,
  deleteReport,
} from "../utils/api";
import * as XLSX from "xlsx";

const StudentMonitoring = ({ user }) => {
  const [data, setData] = useState([]); // monitoring data (includes classes + reports)
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState("");

  const [newReport, setNewReport] = useState({
    class_id: "",
    week: "",
    lecture_date: "",
    topic: "",
    outcomes: "",
    recommendations: "",
    present_students: "",
  });

  // -------------------------
  // Load Monitoring + Reports
  // -------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchRoleMonitoring("student", user.id);
        setData(res.data || []);
        const reportsRes = await fetchRoleReports("student", user.id);
        setReports(reportsRes.data || []);
      } catch (err) {
        console.error("Error loading student monitoring:", err);
        setError("Failed to load monitoring data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  // -------------------------
  // Listen to global search filter
  // -------------------------
  useEffect(() => {
    const handleFilterChange = (e) => setFilterText(e.detail);
    window.addEventListener("global-filter-change", handleFilterChange);
    return () => window.removeEventListener("global-filter-change", handleFilterChange);
  }, []);

  // -------------------------
  // Submit New Report
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newReport, student_id: user.id };
      await postReport(payload);
      alert("✅ Report submitted successfully!");
      setNewReport({
        class_id: "",
        week: "",
        lecture_date: "",
        topic: "",
        outcomes: "",
        recommendations: "",
        present_students: "",
      });
      const updatedReports = await fetchRoleReports("student", user.id);
      setReports(updatedReports.data || []);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to submit report.");
    }
  };

  // -------------------------
  // Delete Report
  // -------------------------
  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await deleteReport(reportId);
      alert("🗑 Report deleted successfully!");
      setReports((prev) =>
        prev.filter((r) => r.report_id !== reportId && r.id !== reportId)
      );
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete report.");
    }
  };

  // -------------------------
  // Excel Export
  // -------------------------
  const exportToExcel = (dataToExport, filename) => {
    if (!dataToExport || dataToExport.length === 0) {
      alert("No data to export!");
      return;
    }

    const worksheetData = dataToExport.map((r) => ({
      Class: r.class_name || r.class_id,
      Week: r.week,
      Date: new Date(r.lecture_date).toLocaleDateString(),
      Topic: r.topic,
      Outcomes: r.outcomes,
      Recommendations: r.recommendations,
      "Present Students": r.present_students,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  // -------------------------
  // Filter Logic
  // -------------------------
  const lowerFilter = filterText.toLowerCase();
  const filteredReports = reports.filter(
    (r) =>
      r.topic?.toLowerCase().includes(lowerFilter) ||
      r.class_name?.toLowerCase().includes(lowerFilter) ||
      r.course_name?.toLowerCase().includes(lowerFilter)
  );

  const filteredClasses = data.filter(
    (d) =>
      d.class_name?.toLowerCase().includes(lowerFilter) ||
      d.course_name?.toLowerCase().includes(lowerFilter)
  );

  if (loading) return <div className="p-4">⏳ Loading student data...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">🎓 Student Monitoring</h2>

      {/* Card Selector */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        {["write", "view", "classes"].map((type) => (
          <div
            key={type}
            className={`card p-4 shadow-sm text-center ${
              activeCard === type ? "border-primary" : ""
            }`}
            style={{ width: "220px", cursor: "pointer" }}
            onClick={() => setActiveCard(activeCard === type ? null : type)}
          >
            <h5>
              {type === "write"
                ? "📝 Write New Report"
                : type === "view"
                ? "📑 View Reports"
                : "🏫 My Classes"}
            </h5>
          </div>
        ))}
      </div>

      {/* ---------------- WRITE NEW REPORT ---------------- */}
      {activeCard === "write" && (
        <div className="card p-4 shadow-sm mb-4">
          <h5 className="mb-3">📝 Write New Report</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label>Class</label>
              <select
                value={newReport.class_id}
                onChange={(e) =>
                  setNewReport({ ...newReport, class_id: e.target.value })
                }
                className="form-control"
                required
              >
                <option value="">Select Class</option>
                {filteredClasses.map((c) => (
                  <option key={c.class_id} value={c.class_id}>
                    {c.class_name} ({c.course_name})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label>Week</label>
              <input
                type="number"
                value={newReport.week}
                onChange={(e) =>
                  setNewReport({ ...newReport, week: e.target.value })
                }
                className="form-control"
                required
              />
            </div>

            <div className="mb-2">
              <label>Lecture Date</label>
              <input
                type="date"
                value={newReport.lecture_date}
                onChange={(e) =>
                  setNewReport({ ...newReport, lecture_date: e.target.value })
                }
                className="form-control"
                required
              />
            </div>

            <div className="mb-2">
              <label>Topic</label>
              <input
                type="text"
                value={newReport.topic}
                onChange={(e) =>
                  setNewReport({ ...newReport, topic: e.target.value })
                }
                className="form-control"
                required
              />
            </div>

            <div className="mb-2">
              <label>Outcomes</label>
              <textarea
                value={newReport.outcomes}
                onChange={(e) =>
                  setNewReport({ ...newReport, outcomes: e.target.value })
                }
                className="form-control"
                required
              />
            </div>

            <div className="mb-2">
              <label>Recommendations</label>
              <textarea
                value={newReport.recommendations}
                onChange={(e) =>
                  setNewReport({ ...newReport, recommendations: e.target.value })
                }
                className="form-control"
                required
              />
            </div>

            <div className="mb-2">
              <label>Present Students</label>
              <input
                type="number"
                value={newReport.present_students}
                onChange={(e) =>
                  setNewReport({ ...newReport, present_students: e.target.value })
                }
                className="form-control"
              />
            </div>

            <button className="btn btn-success mt-3" type="submit">
              Submit Report
            </button>
          </form>
        </div>
      )}

      {/* ---------------- VIEW REPORTS ---------------- */}
      {activeCard === "view" && (
        <div className="card p-4 shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>📑 My Reports</h5>
            <button
              className="btn btn-success btn-sm"
              onClick={() => exportToExcel(filteredReports, "Student_Reports")}
            >
              📥 Export to Excel
            </button>
          </div>

          {filteredReports.length === 0 ? (
            <p>No reports found.</p>
          ) : (
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Week</th>
                  <th>Date</th>
                  <th>Topic</th>
                  <th>Outcomes</th>
                  <th>Recommendations</th>
                  <th>Present Students</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((r) => (
                  <tr key={r.report_id || r.id}>
                    <td>{r.class_name || r.class_id}</td>
                    <td>{r.week}</td>
                    <td>{new Date(r.lecture_date).toLocaleDateString()}</td>
                    <td>{r.topic}</td>
                    <td>{r.outcomes}</td>
                    <td>{r.recommendations}</td>
                    <td>{r.present_students}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(r.report_id || r.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ---------------- CLASSES INFO ---------------- */}
      {activeCard === "classes" && (
        <div className="card p-4 shadow-sm mb-4">
          <h5>🏫 My Classes</h5>
          {filteredClasses.length === 0 ? (
            <p>No enrolled classes available.</p>
          ) : (
            <table className="table table-dark table-striped mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Class Name</th>
                  <th>Course Name</th>
                  <th>Course Code</th>
                  <th>Schedule Time</th>
                  <th>Venue</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((c) => (
                  <tr key={c.class_id}>
                    <td>{c.class_id}</td>
                    <td>{c.class_name}</td>
                    <td>{c.course_name}</td>
                    <td>{c.course_code}</td>
                    <td>{c.schedule_time}</td>
                    <td>{c.venue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentMonitoring;
