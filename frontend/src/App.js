// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "./layout/DashboardLayout";

// Dashboards
import StudentDashboard from "./pages/StudentDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import PrlDashboard from "./pages/PrlDashboard";
import PlDashboard from "./pages/PlDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Courses & Classes
import Courses from "./pages/Courses";
import PrlCourses from "./pages/PrlCourses";
import PlCourses from "./pages/PlCourses";
import LecturerClasses from "./pages/LecturerClasses";
import PlClasses from "./pages/PlClasses";
import ManageCourses from "./pages/ManageCourses";

// Feedback
import Feedback from "./pages/Feedback";

// Reports
import Reports from "./pages/Reports";
import LecturerReports from "./pages/LecturerReports";
import PrlReports from "./pages/PrlReports";
import PlReports from "./pages/PlReports";

// Individual Ratings
import StudentRating from "./pages/StudentRating";
import LecturerRating from "./pages/LecturerRating";
import PrlRating from "./pages/PrlRating";
import PlRating from "./pages/PlRating";

// Monitoring & Admin
import Monitoring from "./pages/Monitoring";
import Users from "./pages/Users";
import Faculties from "./pages/Faculties";

// --------------------
// Footer Component
// --------------------
const Footer = () => (
  <footer
    style={{
      backgroundColor: "#000",
      color: "#fff",
      textAlign: "center",
      padding: "15px 10px",
      borderTop: "3px solid #444",
      marginTop: "auto",
    }}
  >
    <p style={{ margin: 0 }}>
      &copy; {new Date().getFullYear()} School_Reporting. All rights reserved.
    </p>
  </footer>
);

function App() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Global Search State

  // Load user from localStorage and set axios auth header
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const id = localStorage.getItem("id");

    if (token && role && name && id) {
      const userObj = { token, role, name, id: parseInt(id, 10) };
      setUser(userObj);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
  };

  // Show login/register when not authenticated
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                onLogin={(u) => {
                  localStorage.setItem("token", u.token);
                  localStorage.setItem("role", u.role);
                  localStorage.setItem("name", u.name);
                  localStorage.setItem("id", u.id);
                  axios.defaults.headers.common["Authorization"] = `Bearer ${u.token}`;
                  setUser(u);
                }}
              />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* ✅ Pass global search to layout */}
        <DashboardLayout
          role={user.role}
          user={user}
          onLogout={handleLogout}
          searchValue={searchQuery}
          onSearch={setSearchQuery}
        >
          <Routes>
            {/* Dashboards */}
            <Route
              path="/dashboard"
              element={
                user.role === "student" ? (
                  <StudentDashboard user={user} searchQuery={searchQuery} />
                ) : user.role === "lecturer" ? (
                  <LecturerDashboard user={user} searchQuery={searchQuery} />
                ) : user.role === "prl" ? (
                  <PrlDashboard user={user} searchQuery={searchQuery} />
                ) : user.role === "pl" ? (
                  <PlDashboard user={user} searchQuery={searchQuery} />
                ) : (
                  <AdminDashboard user={user} searchQuery={searchQuery} />
                )
              }
            />

            {/* Individual Ratings */}
            {user.role === "student" && <Route path="/rating" element={<StudentRating user={user} searchQuery={searchQuery} />} />}
            {user.role === "lecturer" && <Route path="/rating" element={<LecturerRating user={user} searchQuery={searchQuery} />} />}
            {user.role === "prl" && <Route path="/rating" element={<PrlRating user={user} searchQuery={searchQuery} />} />}
            {user.role === "pl" && <Route path="/rating" element={<PlRating user={user} searchQuery={searchQuery} />} />}

            {/* Monitoring */}
            {["student", "lecturer", "prl", "pl"].includes(user.role) && (
              <Route path="/monitoring" element={<Monitoring user={user} searchQuery={searchQuery} />} />
            )}

            {/* Reports */}
            <Route
              path="/reports"
              element={
                user.role === "student" ? (
                  <Reports user={user} searchQuery={searchQuery} />
                ) : user.role === "lecturer" ? (
                  <LecturerReports user={user} searchQuery={searchQuery} />
                ) : user.role === "prl" ? (
                  <PrlReports user={user} searchQuery={searchQuery} />
                ) : user.role === "pl" ? (
                  <PlReports user={user} searchQuery={searchQuery} />
                ) : (
                  <p className="p-4">No reports available for your role.</p>
                )
              }
            />

            {/* Courses & Classes */}
            {user.role === "prl" && <Route path="/courses" element={<PrlCourses user={user} searchQuery={searchQuery} />} />}
            {user.role === "pl" && (
              <>
                <Route path="/manage-courses" element={<PlCourses user={user} searchQuery={searchQuery} />} />
                <Route path="/classes" element={<PlClasses user={user} searchQuery={searchQuery} />} />
              </>
            )}
            {user.role === "lecturer" && <Route path="/classes" element={<LecturerClasses user={user} searchQuery={searchQuery} />} />}
            {(user.role === "student" || user.role === "admin") && (
              <Route path="/courses" element={<Courses user={user} searchQuery={searchQuery} />} />
            )}

            {/* Feedback */}
            {(user.role === "student" || user.role === "prl") && <Route path="/feedback" element={<Feedback user={user} searchQuery={searchQuery} />} />}

            {/* Admin-only */}
            {user.role === "admin" && (
              <>
                <Route path="/users" element={<Users searchQuery={searchQuery} />} />
                <Route path="/faculties" element={<Faculties searchQuery={searchQuery} />} />
                <Route path="/manage-courses" element={<ManageCourses searchQuery={searchQuery} />} />
              </>
            )}

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </DashboardLayout>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
