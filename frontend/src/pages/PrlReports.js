import React, { useEffect, useState } from "react";
import { fetchRoleReports } from "../utils/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const PRLReports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ------------------------
  // Load reports
  // ------------------------
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadReports = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchRoleReports("prl", user.id);
        setReports(data.data || []); // ensure array
      } catch (err) {
        console.error("Error fetching PRL reports:", err);
        setError(err.response?.data?.message || "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [user]);

  // ------------------------
  // Export to Excel
  // ------------------------
  const exportToExcel = () => {
    if (!reports.length) {
      alert("No reports to export!");
      return;
    }

    const dataToExport = reports.map((r) => ({
      "Report ID": r.report_id,
      "Class ID": r.class_id,
      Week: r.week,
      "Lecture Date": new Date(r.lecture_date).toLocaleDateString(),
      Topic: r.topic,
      Outcomes: r.outcomes,
      Recommendations: r.recommendations,
      "Present Students": r.present_students,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PRL Reports");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `PRLReports_${user.name || "PRL"}.xlsx`);
  };

  if (loading) return <p className="p-4">Loading PRL reports...</p>;
  if (error) return <div className="alert alert-danger p-4">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">📑 PRL — Received Reports</h2>

      {/* ---------------- View Reports ---------------- */}
      <div className="card p-4 shadow-sm mb-4" style={{ width: "100%" }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5>📅 Received Reports</h5>
          <button className="btn btn-outline-success btn-sm" onClick={exportToExcel}>
            ⬇️ Export to Excel
          </button>
        </div>

        {!Array.isArray(reports) || reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          <table className="table table-striped mt-2">
            <thead>
              <tr>
                <th>ID</th>
                <th>Class ID</th>
                <th>Week</th>
                <th>Date</th>
                <th>Topic</th>
                <th>Outcomes</th>
                <th>Recommendations</th>
                <th>Present</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.report_id}>
                  <td>{r.report_id}</td>
                  <td>{r.class_id}</td>
                  <td>{r.week}</td>
                  <td>{new Date(r.lecture_date).toLocaleDateString()}</td>
                  <td>{r.topic}</td>
                  <td>{r.outcomes}</td>
                  <td>{r.recommendations}</td>
                  <td>{r.present_students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PRLReports;
