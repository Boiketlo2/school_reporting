import React, { useEffect, useState } from "react";
import { fetchRoleMonitoring } from "../utils/api";

const PLMonitoring = ({ user, searchQuery }) => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchRoleMonitoring("pl", user.id);
        const records = res.data || [];
        setData(records);
        setFiltered(records);
      } catch (err) {
        console.error("Error fetching PL monitoring:", err);
        setData([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  // Filter data by search query
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
            d.course_code?.toLowerCase().includes(q) ||
            d.topic?.toLowerCase().includes(q) ||
            d.outcomes?.toLowerCase().includes(q) ||
            d.recommendations?.toLowerCase().includes(q) ||
            d.week?.toString().includes(q)
        )
      );
    }
  }, [searchQuery, data]);

  if (loading) return <p className="p-4">⏳ Loading PL monitoring...</p>;
  if (!filtered.length) return <p className="p-4">No monitoring data available yet.</p>;

  return (
    <div className="p-4">
      <h2 className="mb-3">📊 Program Leader (PL) Monitoring</h2>
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
          {filtered.map((d) => (
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

export default PLMonitoring;
