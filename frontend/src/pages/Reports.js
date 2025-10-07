// src/pages/Reports.js
import React from "react";
import StudentDashboard from "./StudentDashboard";
import LecturerReports from "./LecturerReports";
import PrlReports from "./PrlReports";
import PlReports from "./PlReports";

/**
 * Unified Reports page — dispatches to the role-specific view.
 * Note: Students' "reports" view lives inside StudentDashboard so we render that.
 */
const Reports = ({ user }) => {
  if (!user?.role) {
    return <p className="p-4 text-danger">No role assigned to user.</p>;
  }

  switch (user.role) {
    case "student":
      // Student reports are shown inside StudentDashboard
      return <StudentDashboard user={user} />;
    case "lecturer":
      return <LecturerReports user={user} />;
    case "prl":
      return <PrlReports user={user} />;
    case "pl":
      return <PlReports user={user} />;
    default:
      return <p className="p-4">No reports available for this role.</p>;
  }
};

export default Reports;
