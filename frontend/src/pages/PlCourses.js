import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  fetchCourses,
  fetchStreams,
  fetchLecturersByFaculty,
  postCourse,
  assignLecturer,
  deleteCourse,
} from "../utils/api";

const PlCourses = () => {
  const [user, setUser] = useState(null); // full user object including faculty_id
  const [courses, setCourses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const [error, setError] = useState("");

  // Add course form
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    stream_id: "",
  });

  // Assign lecturer form
  const [assignData, setAssignData] = useState({
    course_id: "",
    lecturer_id: "",
    class_name: "",
    schedule_time: "",
    venue: "",
    total_students: "",
  });

  const API_BASE =
    process.env.REACT_APP_API_BASE || "https://school-reporting.onrender.com/api";

  // -------------------
  // Load user & initial data
  // -------------------
  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming token is stored in localStorage
        const userRes = await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        // Fetch courses and streams
        const [c, s] = await Promise.all([fetchCourses(), fetchStreams()]);
        setCourses(c);
        setStreams(s);

        // Fetch lecturers based on user.faculty_id
        if (userRes.data.faculty_id) {
          const l = await fetchLecturersByFaculty(userRes.data.faculty_id);
          setLecturers(Array.isArray(l) ? l : []);
          console.log("Lecturers loaded:", l);
        } else {
          console.warn("User has no faculty_id:", userRes.data);
        }
      } catch (err) {
        console.error("Data load error:", err);
        setError("Failed to load user, courses, streams, or lecturers.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndData();
  }, []);

  // -------------------
  // Add Course Handler
  // -------------------
  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await postCourse({ ...newCourse, faculty_id: user.faculty_id });
      setNewCourse({ name: "", code: "", stream_id: "" });
      const updated = await fetchCourses();
      setCourses(updated);
      alert("✅ Course added successfully");
    } catch (err) {
      console.error(err);
      setError("Failed to add course.");
    }
  };

  // -------------------
  // Assign Lecturer Handler
  // -------------------
  const handleAssignLecturer = async (e) => {
    e.preventDefault();
    try {
      await assignLecturer(assignData);
      setAssignData({
        course_id: "",
        lecturer_id: "",
        class_name: "",
        schedule_time: "",
        venue: "",
        total_students: "",
      });
      alert("✅ Lecturer assigned successfully");
    } catch (err) {
      console.error(err);
      setError("Failed to assign lecturer.");
    }
  };

  // -------------------
  // Delete Course
  // -------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(id);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete course.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">📘 Program Leader — Course Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Clickable Cards */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        {["add", "view", "assign"].map((type) => (
          <div
            key={type}
            className={`card p-4 shadow-sm text-center ${
              activeCard === type ? "border-primary" : ""
            }`}
            style={{ width: "220px", cursor: "pointer" }}
            onClick={() => setActiveCard(activeCard === type ? null : type)}
          >
            <h5>
              {type === "add"
                ? "➕ Add Course"
                : type === "view"
                ? "📚 View Courses"
                : "👩🏽‍🏫 Assign Lecturer"}
            </h5>
          </div>
        ))}
      </div>

      {/* ADD COURSE */}
      {activeCard === "add" && (
        <div className="card p-4 shadow-sm mb-4">
          <h5>➕ Add New Course</h5>
          <form onSubmit={handleAddCourse}>
            <div className="mb-2">
              <label>Course Name</label>
              <input
                type="text"
                value={newCourse.name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
                className="form-control"
              />
            </div>

            <div className="mb-2">
              <label>Course Code</label>
              <input
                type="text"
                value={newCourse.code}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, code: e.target.value })
                }
                className="form-control"
              />
            </div>

            <div className="mb-2">
              <label>Stream</label>
              <select
                value={newCourse.stream_id}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, stream_id: e.target.value })
                }
                className="form-control"
              >
                <option value="">Select Stream</option>
                {streams.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary mt-2" type="submit">
              Add Course
            </button>
          </form>
        </div>
      )}

      {/* VIEW COURSES */}
      {activeCard === "view" && (
        <div className="card p-4 shadow-sm mb-4">
          <h5>📚 Available Courses</h5>
          {courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Faculty</th>
                  <th>Stream</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.code}</td>
                    <td>{c.faculty_name}</td>
                    <td>{c.stream_name || "-"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(c.id)}
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

      {/* ASSIGN LECTURER */}
      {activeCard === "assign" && (
        <div className="card p-4 shadow-sm mb-4">
          <h5>👩🏽‍🏫 Assign Lecturer to Course</h5>
          <form onSubmit={handleAssignLecturer}>
            <div className="mb-2">
              <label>Course</label>
              <select
                value={assignData.course_id}
                onChange={(e) =>
                  setAssignData({ ...assignData, course_id: e.target.value })
                }
                className="form-control"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label>Lecturer</label>
              <select
                value={assignData.lecturer_id}
                onChange={(e) =>
                  setAssignData({
                    ...assignData,
                    lecturer_id: e.target.value,
                  })
                }
                className="form-control"
              >
                <option value="">Select Lecturer</option>
                {lecturers.length > 0 ? (
                  lecturers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.email})
                    </option>
                  ))
                ) : (
                  <option disabled>No lecturers available</option>
                )}
              </select>
            </div>

            <div className="mb-2">
              <label>Class Name</label>
              <input
                type="text"
                value={assignData.class_name}
                onChange={(e) =>
                  setAssignData({ ...assignData, class_name: e.target.value })
                }
                className="form-control"
              />
            </div>

            <div className="mb-2">
              <label>Schedule Time</label>
              <input
                type="text"
                value={assignData.schedule_time}
                onChange={(e) =>
                  setAssignData({
                    ...assignData,
                    schedule_time: e.target.value,
                  })
                }
                className="form-control"
              />
            </div>

            <div className="mb-2">
              <label>Venue</label>
              <input
                type="text"
                value={assignData.venue}
                onChange={(e) =>
                  setAssignData({ ...assignData, venue: e.target.value })
                }
                className="form-control"
              />
            </div>

            <div className="mb-2">
              <label>Total Students</label>
              <input
                type="number"
                value={assignData.total_students}
                onChange={(e) =>
                  setAssignData({
                    ...assignData,
                    total_students: e.target.value,
                  })
                }
                className="form-control"
              />
            </div>

            <button className="btn btn-success mt-2" type="submit">
              Assign Lecturer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlCourses;
