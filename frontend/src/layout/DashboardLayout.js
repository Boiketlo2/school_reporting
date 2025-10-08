import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout = ({ children, role, user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log("Global search query:", query);
    // You can later use context or props to make this global if needed
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main content */}
      <div className="flex-grow-1">
        <Topbar user={user} onLogout={onLogout} onSearch={handleSearch} />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
