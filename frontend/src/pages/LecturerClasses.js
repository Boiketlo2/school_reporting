import React, { useEffect, useState } from "react";
import axios from "axios";

const LecturerClasses = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const fetchClasses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/classes/lecturer/${user.id}`);
        setClasses(res.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user]);

  if (loading) return <p className="p-4">Loading your classes...</p>;
  if (error) return <p className="p-4 text-danger">{error}</p>;
  if (classes.length === 0) return <p className="p-4">You have no assigned classes yet.</p>;

  return (
    <div className="p-4">
      <h2 className="mb-3">📚 My Classes</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Course</th>
            <th>Course Code</th>
            <th>Schedule</th>
            <th>Venue</th>
            <th>Total Students</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LecturerClasses;
