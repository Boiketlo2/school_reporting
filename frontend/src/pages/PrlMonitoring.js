import React, { useEffect, useState } from "react";
import { fetchRoleMonitoring } from "../utils/api";

const PRLMonitoring = ({ user, searchQuery }) => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchRoleMonitoring("prl", user.id);
        const records = res.data || [];
        setData(records);
        setFiltered(records);
      } catch (err) {
        console.error("Error fetching PRL monitoring:", err);
        setData([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  // Filter when searchQuery changes
  useEffect(() => {
    if (!searchQuery) {
      setFiltered(data);
    } else {
      const q = searchQuery.toLowerCase();
      setFiltered(
        data.filter(
          (d) =>
            d.class_name?.toLowerCase().includes(q) ||
            d.course_name?.toLowerCase().includes(q) ||
            d.topic?.toLowerCase().includes(q) ||
            d.week?.toString().includes(q) ||
            d.prl_feedback?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, data]);

  if (loading) return <p className="p-4">⏳ Loading PRL monitoring...</p>;
  if (!filtered.length) return <p className="p-4">No monitoring data available yet.</p>;

  return (
    <div className="p-4">
      <h2 className="mb-3">📊 PRL Monitoring</h2>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Class</th>
            <th>Course</th>
            <th>Week</th>
            <th>Topic</th>
            <th>Attendance</th>
            <th>PRL Feedback</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => (
            <tr key={d.report_id}>
              <td>{d.class_name}</td>
              <td>{d.course_name}</td>
              <td>{d.week}</td>
              <td>{d.topic}</td>
              <td>{d.present_students}</td>
              <td>{d.prl_feedback || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PRLMonitoring;
