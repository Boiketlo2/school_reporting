import React, { useEffect, useState } from "react";
import { fetchCourses } from "../utils/api"; // ✅ updated import

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      const data = await fetchCourses();
      setCourses(data);
      setLoading(false);
    };
    loadCourses();
  }, []);

  if (loading) return <div className="p-4">Loading courses...</div>;
  if (!courses.length) return <div className="p-4">No courses available.</div>;

  return (
    <div className="p-4">
      <h3>Courses</h3>
      <ul className="list-group">
        {courses.map(course => (
          <li key={course.id} className="list-group-item">
            {course.name} ({course.stream}) - Faculty ID: {course.faculty_id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
