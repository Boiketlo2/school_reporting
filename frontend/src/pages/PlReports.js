import React, { useEffect, useState } from "react";
import {
  fetchRoleReports,
  fetchFeedback,
  addFeedbackOrAnnouncement,
  deleteFeedbackOrAnnouncement,
} from "../utils/api";
import { FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const PlReports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCard, setActiveCard] = useState(null);

  // ------------------------
  // Load reports and announcements
  // ------------------------
  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const reportsData = await fetchRoleReports("pl", user.id);
        setReports(reportsData.data || reportsData || []);

        const feedbackData = await fetchFeedback();
        const plAnnouncements = feedbackData.filter((f) => f.pl_id);
        setAnnouncements(plAnnouncements);
      } catch (err) {
        console.error("Error loading PL reports or announcements:", err);
        setError(err.response?.data?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // ------------------------
  // Handle Card Toggle
  // ------------------------
  const handleToggleCard = (type) => {
    setActiveCard(activeCard === type ? null : type);
  };

  // ------------------------
  // Submit Announcement
  // ------------------------
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;

    try {
      const payload = {
        pl_id: user.id,
        feedback_text: newAnnouncement.trim(),
      };

      const res = await addFeedbackOrAnnouncement(payload);

      const newItem = {
        id: res.id || Date.now(),
        feedback_text: newAnnouncement.trim(),
        created_at: new Date().toISOString(),
        pl_name: user.name,
      };

      setAnnouncements([newItem, ...announcements]);
      setNewAnnouncement("");
    } catch (err) {
      console.error("Error posting announcement:", err);
      alert("Failed to post announcement. Please try again.");
    }
  };

  // ------------------------
  // Delete Announcement
  // ------------------------
  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    try {
      await deleteFeedbackOrAnnouncement(id);
      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting announcement:", err);
      alert("Failed to delete announcement.");
    }
  };

  // ------------------------
  // Export Reports to Excel
  // ------------------------
  const exportToExcel = () => {
    if (!reports.length) {
      alert("No reports to export!");
      return;
    }

    const dataToExport = reports.map((r) => ({
      Topic: r.topic,
      "Lecture Date": new Date(r.lecture_date).toLocaleDateString(),
      "Present Students": r.present_students,
      "PRL Feedback": r.prl_feedback || "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PL Reports");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `PLReports_${user.name || "PL"}.xlsx`);
  };

  // ------------------------
  // Render
  // ------------------------
  if (loading) return <div className="p-4">Loading reports...</div>;
  if (error) return <div className="alert alert-danger p-4">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">📋 Program Leader — Reports & Announcements</h2>

      {/* Card Buttons */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        {["viewReports", "announcements"].map((type) => (
          <div
            key={type}
            className={`card p-4 shadow-sm text-center ${
              activeCard === type ? "border-primary" : ""
            }`}
            style={{ width: "220px", cursor: "pointer" }}
            onClick={() => handleToggleCard(type)}
          >
            <h5>
              {type === "viewReports" ? "📄 View Reports" : "📢 Announcements"}
            </h5>
          </div>
        ))}
      </div>

      {/* ---------------- View Reports ---------------- */}
      {activeCard === "viewReports" && (
        <div className="card p-4 shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>📋 Reports Overview</h5>
            <button className="btn btn-outline-success btn-sm" onClick={exportToExcel}>
              ⬇️ Export to Excel
            </button>
          </div>

          {reports.length === 0 ? (
            <p>No reports available.</p>
          ) : (
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Date</th>
                  <th>Present Students</th>
                  <th>PRL Feedback</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.report_id}>
                    <td>{r.topic}</td>
                    <td>{new Date(r.lecture_date).toLocaleDateString()}</td>
                    <td>{r.present_students}</td>
                    <td>{r.prl_feedback || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ---------------- Announcements ---------------- */}
      {activeCard === "announcements" && (
        <div className="card p-4 shadow-sm mb-4">
          <h5>📢 Manage Announcements</h5>
          <form onSubmit={handleAnnouncementSubmit}>
            <textarea
              className="form-control mb-2"
              placeholder="Write a new announcement..."
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              rows={3}
            />
            <button className="btn btn-primary w-100" type="submit">
              Post Announcement
            </button>
          </form>

          <ul className="list-group mt-3">
            {announcements.length === 0 ? (
              <li className="list-group-item text-muted">No announcements yet.</li>
            ) : (
              announcements.map((a) => (
                <li
                  key={a.id}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div>
                    {a.feedback_text || a.text}
                    <br />
                    <small className="text-muted">
                      {a.pl_name ? `By ${a.pl_name}` : ""}
                      {" • "}
                      {new Date(a.created_at).toLocaleString()}
                    </small>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteAnnouncement(a.id)}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlReports;
