import React, { useEffect, useState } from "react";
import axios from "axios";

const Classes = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.role || !user?.id) {
      setLoading(false);
      setError("User info not available.");
      return;
    }

    const fetchClasses = async () => {
      try {
        let url = "/api/classes"; // default fallback

        if (user.role === "lecturer") {
          url = `/api/classes/lecturer/${user.id}`;
        } else if (user.role === "pl") {
          url = `/api/classes/pl/${user.id}`;
        } else if (user.role === "prl") {
          // PRL role doesn't have classes
          setClasses([]);
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000${url}`);
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

  if (loading) return <div className="p-4">Loading classes...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;
  if (classes.length === 0)
    return <div className="p-4">No classes available for your role.</div>;

  return (
    <div className="p-4">
      <h3>📚 Classes</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Course</th>
            <th>Code</th>
            <th>Lecturer</th>
            <th>Schedule</th>
            <th>Venue</th>
            <th>Students</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id}>
              <td>{cls.class_name}</td>
              <td>{cls.course_name || "-"}</td>
              <td>{cls.course_code || "-"}</td>
              <td>{cls.lecturer_name || "-"}</td>
              <td>{cls.schedule_time || "-"}</td>
              <td>{cls.venue || "-"}</td>
              <td>{cls.total_students || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Classes;
