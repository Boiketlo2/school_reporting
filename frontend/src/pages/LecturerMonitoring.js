import React, { useEffect, useState } from "react";
import { fetchRoleMonitoring } from "../utils/api";

const LecturerMonitoring = ({ user }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchRoleMonitoring("lecturer", user.id);
        setData(res.data || []);
      } catch (err) {
        console.error("Error fetching lecturer monitoring:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  // 🔍 Listen for Topbar search
  useEffect(() => {
    const handleFilterChange = (e) => setFilterText(e.detail.toLowerCase());
    window.addEventListener("global-filter-change", handleFilterChange);
    return () => window.removeEventListener("global-filter-change", handleFilterChange);
  }, []);

  // 🔍 Filter results by search term
  const filteredData = data.filter(
    (d) =>
      d.class_name?.toLowerCase().includes(filterText) ||
      d.course_name?.toLowerCase().includes(filterText) ||
      d.course_code?.toLowerCase().includes(filterText) ||
      d.topic?.toLowerCase().includes(filterText) ||
      d.outcomes?.toLowerCase().includes(filterText) ||
      d.recommendations?.toLowerCase().includes(filterText)
  );

  if (loading) return <p className="p-4">⏳ Loading lecturer monitoring...</p>;
  if (!filteredData.length) return <p className="p-4">No monitoring data available yet.</p>;

  return (
    <div className="p-4">
      <h2 className="mb-3">📊 Lecturer Monitoring</h2>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Class</th>
            <th>Course</th>
            <th>Week</th>
            <th>Lecture Date</th>
            <th>Topic</th>
            <th>Outcomes</th>
            <th>Recommendations</th>
            <th>Present Students</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((d) => (
            <tr key={d.report_id}>
              <td>{d.class_name}</td>
              <td>
                {d.course_name} ({d.course_code})
              </td>
              <td>{d.week}</td>
              <td>{new Date(d.lecture_date).toLocaleDateString()}</td>
              <td>{d.topic}</td>
              <td>{d.outcomes}</td>
              <td>{d.recommendations}</td>
              <td>{d.present_students}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LecturerMonitoring;
