import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Export JSON data to Excel
 * @param {Array} data - Array of objects
 * @param {string} fileName - File name (no extension)
 */
export const exportToExcel = (data, fileName = "report") => {
  if (!data || !data.length) {
    alert("No data available to export!");
    return;
  }

  // Convert to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Save file
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}.xlsx`);
};
