// src/pages/PrlRatings.js
import React, { useState, useEffect } from "react";
import { fetchRoleRatings, postRating } from "../utils/api";

const PrlRatings = ({ user }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const [newRating, setNewRating] = useState({
    report_id: "",
    score: "",
    comments: "",
  });

  // ------------------------
  // Load ratings
  // ------------------------
  useEffect(() => {
    if (!user?.id || !user?.role) return;

    const loadRatings = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchRoleRatings(user.role, user.id);
        const list = Array.isArray(data) ? data : data.data || [];
        setRatings(list);
      } catch (err) {
        console.error(err);
        setError("Failed to load ratings");
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, [user]);

  // ------------------------
  // Toggle Card
  // ------------------------
  const handleToggleCard = (type) => {
    setActiveCard(activeCard === type ? null : type);
  };

  // ------------------------
  // Submit New Rating
  // ------------------------
  const handleRatingSubmit = async (e) => {
    e.preventDefault();

    if (!newRating.report_id || newRating.score === "") {
      return alert("Please enter a report ID and score.");
    }

    try {
      await postRating({
        ...newRating,
        rater_id: user.id,
        rater_role: user.role,
      });

      // Reload ratings after submit
      const data = await fetchRoleRatings(user.role, user.id);
      const list = Array.isArray(data) ? data : data.data || [];
      setRatings(list);

      setNewRating({ report_id: "", score: "", comments: "" });
      alert("✅ Rating submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating.");
    }
  };

  // ------------------------
  // Loading & Error States
  // ------------------------
  if (loading) return <div className="p-4">⏳ Loading ratings...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;

  // ------------------------
  // Render
  // ------------------------
  return (
    <div className="p-4">
      <h2 className="mb-4">⭐ PRL Ratings</h2>

      {/* Cards */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        {["create", "view"].map((type) => (
          <div
            key={type}
            className={`card p-4 shadow-sm text-center ${activeCard === type ? "border-primary" : ""}`}
            style={{ width: "220px", cursor: "pointer" }}
            onClick={() => handleToggleCard(type)}
          >
            <h5>{type === "create" ? "➕ Write Rating" : "📚 View Ratings"}</h5>
          </div>
        ))}
      </div>

      {/* ---------------- Create Rating ---------------- */}
      {activeCard === "create" && (
        <div className="card p-4 shadow-sm mb-4">
          <h5>➕ Submit New Rating</h5>
          <form onSubmit={handleRatingSubmit}>
            <div className="mb-2">
              <label>Report ID</label>
              <input
                type="number"
                className="form-control"
                value={newRating.report_id}
                onChange={(e) => setNewRating({ ...newRating, report_id: e.target.value })}
                required
              />
            </div>

            <div className="mb-2">
              <label>Score</label>
              <input
                type="number"
                className="form-control"
                value={newRating.score}
                onChange={(e) => setNewRating({ ...newRating, score: e.target.value })}
                required
              />
            </div>

            <div className="mb-2">
              <label>Comments</label>
              <textarea
                className="form-control"
                rows="2"
                value={newRating.comments}
                onChange={(e) => setNewRating({ ...newRating, comments: e.target.value })}
              />
            </div>

            <button className="btn btn-success w-100" type="submit">
              Submit Rating
            </button>
          </form>
        </div>
      )}

      {/* ---------------- View Ratings ---------------- */}
      {activeCard === "view" && (
        <div className="card p-4 shadow-sm mb-4">
          <h5>📚 My Submitted Ratings</h5>
          {ratings.length === 0 ? (
            <p>No ratings submitted yet.</p>
          ) : (
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Course</th>
                  <th>Topic</th>
                  <th>Score</th>
                  <th>Comments</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((r) => (
                  <tr key={r.rating_id || r.id}>
                    <td>{r.report_id}</td>
                    <td>{r.courseName || "N/A"}</td>
                    <td>{r.topic || "N/A"}</td>
                    <td>{r.score}</td>
                    <td>{r.comments || "—"}</td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
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

export default PrlRatings;
