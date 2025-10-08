import React from "react";

const PrlDashboard = ({ user }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/images/coverpage.jpg')", // <-- replace with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "20px",
      }}
    >
      <div
        className="card shadow-sm p-5"
        style={{
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.85)", // semi-transparent
          color: "#333",
        }}
      >
        <h1>👋 Hello, {user?.name || "PRL"}!</h1>
        <p className="mt-3" style={{ fontSize: "1.2rem" }}>
          Welcome to your dashboard. Manage courses, reports, and feedback here.
        </p>
      </div>
    </div>
  );
};

export default PrlDashboard;
