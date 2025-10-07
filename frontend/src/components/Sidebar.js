import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaBook, FaChalkboardTeacher, FaClipboardList, FaComments, FaUsers, FaUniversity, FaListAlt, FaStar } from "react-icons/fa";

const Sidebar = ({ role }) => {
  const menuItems = {
    student: [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "Monitoring", path: "/monitoring", icon: <FaClipboardList /> },
      { name: "Rating", path: "/rating", icon: <FaStar /> },
    ],
    lecturer: [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "Classes", path: "/classes", icon: <FaChalkboardTeacher /> },
      { name: "Reports", path: "/reports", icon: <FaClipboardList /> },
      { name: "Monitoring", path: "/monitoring", icon: <FaClipboardList /> },
      { name: "Rating", path: "/rating", icon: <FaStar /> },
    ],
    prl: [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "Courses & Lectures", path: "/courses", icon: <FaBook /> },
      { name: "Reports", path: "/reports", icon: <FaClipboardList /> },
      { name: "Feedback", path: "/feedback", icon: <FaComments /> },
      { name: "Monitoring", path: "/monitoring", icon: <FaClipboardList /> },
      { name: "Rating", path: "/rating", icon: <FaStar /> },
    ],
    pl: [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "Manage Courses", path: "/manage-courses", icon: <FaBook /> },
      { name: "Reports", path: "/reports", icon: <FaClipboardList /> },
      { name: "Monitoring", path: "/monitoring", icon: <FaClipboardList /> },
      { name: "Classes", path: "/classes", icon: <FaChalkboardTeacher /> },
      { name: "Rating", path: "/rating", icon: <FaStar /> },
    ],
    admin: [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "Users", path: "/users", icon: <FaUsers /> },
      { name: "Faculties", path: "/faculties", icon: <FaUniversity /> },
      { name: "Courses", path: "/courses", icon: <FaBook /> },
      { name: "Classes", path: "/classes", icon: <FaChalkboardTeacher /> },
      { name: "Reports", path: "/reports", icon: <FaClipboardList /> },
      { name: "Feedback", path: "/feedback", icon: <FaComments /> },
    ],
  };

  const links = menuItems[role] || [];

  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "220px", minHeight: "100vh" }}
    >
      <h4 className="mb-4">Reporting App</h4>
      <ul className="nav flex-column">
        {links.map((item, index) => (
          <li className="nav-item" key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 ${
                  isActive ? "active bg-primary text-white" : "text-white"
                }`
              }
              style={{ borderRadius: "6px", marginBottom: "5px" }}
            >
              {item.icon}
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
