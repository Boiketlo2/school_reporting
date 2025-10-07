import React from "react";

const LecturerDashboard = ({ user }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/images/coverpage.jpg')", // <-- your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "20px",
      }}
    >
      <div
        className="card shadow-sm p-4"
        style={{
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.85)", // slight transparency
        }}
      >
        <h3>👨🏽‍🏫 Lecturer Dashboard</h3>
        <p className="text-muted">
          Welcome {user?.name}, here you can manage your classes, reports, and monitoring.
        </p>
      </div>
    </div>
  );
};

export default LecturerDashboard;
