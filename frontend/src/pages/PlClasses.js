import React, { useEffect, useState } from "react";
import axios from "axios";

const PlClasses = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const fetchClasses = async () => {
      try {
        const res = await axios.get(`https://school-reporting.onrender.com/api/classes/pl/${user.id}`);
        setClasses(res.data);
      } catch (err) {
        console.error("Error fetching PL classes:", err);
        setError("Failed to load classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user]);

  const handleDelete = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      await axios.delete(`https://school-reporting.onrender.com/api/classes/${classId}`);
      setClasses(classes.filter((c) => c.id !== classId)); // update UI
    } catch (err) {
      console.error("Error deleting class:", err);
      alert("Failed to delete class. Please try again.");
    }
  };

  if (loading) return <p className="p-4">Loading your classes...</p>;
  if (error) return <p className="p-4 text-danger">{error}</p>;
  if (classes.length === 0) return <p className="p-4">You have no assigned classes yet.</p>;

  return (
    <div className="p-4">
      <h2 className="mb-3">📚 PL Classes</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Course</th>
            <th>Course Code</th>
            <th>Schedule</th>
            <th>Venue</th>
            <th>Total Students</th>
            <th>Actions</th> {/* new column */}
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id}>
              <td>{c.class_name}</td>
              <td>{c.course_name}</td>
              <td>{c.course_code}</td>
              <td>{c.schedule_time}</td>
              <td>{c.venue}</td>
              <td>{c.total_students}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlClasses;
