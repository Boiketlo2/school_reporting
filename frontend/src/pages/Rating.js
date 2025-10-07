// src/pages/Ratings.js
import React, { useEffect, useState } from "react";
import { fetchRoleRatings } from "../utils/api";

const Ratings = ({ user }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id || !user?.role) return;

    const loadRatings = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchRoleRatings(user.role, user.id);
        setRatings(data);
      } catch (err) {
        console.error("Error fetching ratings:", err);
        setError("Failed to load ratings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, [user]);

  if (loading) return <p className="p-4">Loading ratings...</p>;
  if (error) return <p className="p-4 text-danger">{error}</p>;
  if (!ratings.length) return <p className="p-4">No ratings available yet.</p>;

  return (
    <div className="p-4">
      <h2 className="mb-3">⭐ Your Ratings ({user.role.toUpperCase()})</h2>
      <table className="table table-striped">
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
            <tr key={r.id}>
              <td>{r.report_id}</td>
              <td>{r.courseName || "N/A"}</td>
              <td>{r.topic || "N/A"}</td>
              <td>{r.score}</td>
              <td>{r.comments || "N/A"}</td>
              <td>{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ratings;
