// src/pages/Monitoring.js
import React from "react";
import StudentMonitoring from "./StudentMonitoring";
import LecturerMonitoring from "./LecturerMonitoring";
import PRLMonitoring from "./PrlMonitoring";
import PLMonitoring from "./PlMonitoring";

const Monitoring = ({ user }) => {
  if (!user?.role) {
    return <p className="p-4">User role not defined</p>;
  }

  switch (user.role.toLowerCase()) {
    case "student":
      return <StudentMonitoring user={user} />;
    case "lecturer":
      return <LecturerMonitoring user={user} />;
    case "prl":
      return <PRLMonitoring user={user} />;
    case "pl":
      return <PLMonitoring user={user} />;
    default:
      return <p className="p-4">Monitoring view not available for this role.</p>;
  }
};

export default Monitoring;
