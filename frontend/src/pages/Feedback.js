import React, { useEffect, useState } from "react";
import {
  fetchFeedback,
  addFeedbackOrAnnouncement,
  deleteFeedbackOrAnnouncement,
} from "../utils/api";

const Feedback = ({ user }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCard, setActiveCard] = useState(null);

  const [newFeedback, setNewFeedback] = useState({
    report_id: "",
    feedback_text: "",
  });

  // -----------------------
  // Load feedback
  // -----------------------
  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setLoading(true);
        const data = await fetchFeedback(user?.id, "prl");
        setFeedbackList(data);
      } catch (err) {
        console.error("❌ Error loading feedback:", err);
        setError("Failed to load feedback. Check backend or mapping.");
      } finally {
        setLoading(false);
      }
    };
    loadFeedback();
  }, [user]);

  // -----------------------
  // Submit feedback
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newFeedback.feedback_text.trim())
      return alert("Please enter feedback text.");

    try {
      const payload = {
        feedback_text: newFeedback.feedback_text,
        report_id: newFeedback.report_id || null,
        prl_id: user?.id,
        type: "feedback",
      };

      await addFeedbackOrAnnouncement(payload);
      setNewFeedback({ report_id: "", feedback_text: "" });
      const updated = await fetchFeedback(user?.id, "prl");
      setFeedbackList(updated);
      alert("✅ Feedback sent successfully!");
    } catch (err) {
      console.error("❌ Error submitting feedback:", err);
      alert("Failed to send feedback.");
    }
  };

  // -----------------------
  // Delete feedback
  // -----------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await deleteFeedbackOrAnnouncement(id);
      setFeedbackList((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("❌ Error deleting feedback:", err);
      alert("Failed to delete feedback.");
    }
  };

  if (loading) return <div className="p-4">Loading feedback...</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">🗒️ PRL Feedback Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* -------- Clickable Cards -------- */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        {["view", "write"].map((type) => (
          <div
            key={type}
            className={`card p-4 shadow-sm text-center ${
              activeCard === type ? "border-primary" : ""
            }`}
            style={{ width: "220px", cursor: "pointer" }}
            onClick={() => setActiveCard(activeCard === type ? null : type)}
          >
            <h5>
              {type === "view" ? "📄 View Feedback" : "✍️ Write Feedback"}
            </h5>
          </div>
        ))}
      </div>

      {/* -------- View Feedback -------- */}
      {activeCard === "view" && (
        <div className="card p-4 shadow-sm mb-4">
          <h5>📄 Available Feedback</h5>
          {!feedbackList.length ? (
            <p className="text-muted">No feedback available yet.</p>
          ) : (
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Feedback</th>
                  <th>Report ID</th>
                  <th>PL</th>
                  <th>PRL</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map((fb) => (
                  <tr key={fb.id}>
                    <td>{fb.id}</td>
                    <td>{fb.feedback_text}</td>
                    <td>{fb.report_id || "—"}</td>
                    <td>{fb.pl_name || "—"}</td>
                    <td>{fb.prl_name || "—"}</td>
                    <td>{new Date(fb.created_at).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(fb.id)}
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

      {/* -------- Write Feedback -------- */}
      {activeCard === "write" && (
        <div className="card p-4 shadow-sm mb-4">
          <h5>✍️ Write New Feedback</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label>Report ID (optional)</label>
              <input
                type="number"
                value={newFeedback.report_id}
                onChange={(e) =>
                  setNewFeedback({ ...newFeedback, report_id: e.target.value })
                }
                className="form-control"
                placeholder="e.g. 12"
              />
            </div>

            <div className="mb-3">
              <label>Feedback Text</label>
              <textarea
                className="form-control"
                rows="3"
                value={newFeedback.feedback_text}
                onChange={(e) =>
                  setNewFeedback({
                    ...newFeedback,
                    feedback_text: e.target.value,
                  })
                }
                placeholder="Write your feedback..."
              />
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Send Feedback
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Feedback;
