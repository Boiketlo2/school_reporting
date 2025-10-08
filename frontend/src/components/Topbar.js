import React, { useState } from "react";

const Topbar = ({ user, onLogout, onSearch }) => {
  const [query, setQuery] = useState("");

  // Helper: Capitalize each word in role
  const formatRole = (role) => {
    if (!role) return "";
    return role
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // ✅ Emit global event so all pages can filter
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
    window.dispatchEvent(new CustomEvent("global-filter-change", { detail: value }));
  };

  return (
    <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
      {/* Left: Welcome message */}
      <h5 className="mb-0">
        Welcome, {user?.role ? `${formatRole(user.role)} ` : ""}
        {user?.name || "User"}
      </h5>

      {/* Center: Search Bar */}
      <div className="flex-grow-1 d-flex justify-content-center">
        <input
          type="text"
          className="form-control w-50 text-center"
          placeholder="Search..."
          value={query}
          onChange={handleSearchChange}
          style={{ maxWidth: "400px" }}
        />
      </div>

      {/* Right: Logout */}
      <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default Topbar;
