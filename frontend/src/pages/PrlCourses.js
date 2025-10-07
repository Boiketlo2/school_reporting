// src/pages/PrlCourses.js
import React, { useEffect, useState } from "react";
import { fetchPrlCourses } from "../utils/api";

const PrlCourses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      if (!user || user.role !== "prl") return;

      try {
        const data = await fetchPrlCourses();
        setCourses(data || []);
      } catch (err) {
        console.error("Failed to load PRL courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user]);

  if (loading) return <div className="p-4">⏳ Loading courses...</div>;
  if (!courses.length) return <div className="p-4">No courses available.</div>;

  return (
    <div className="p-4">
      <h3>📚 PRL Courses & Lectures</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Course Code</th>
            <th>Stream</th>
            <th>Faculty</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.code || "N/A"}</td>
              <td>{course.stream_name || "N/A"}</td>
              <td>{course.faculty_name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrlCourses;
