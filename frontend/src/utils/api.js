import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "https://school-reporting.onrender.com/api";

// --------------------
// Courses
// --------------------
export const fetchCourses = async () => {
  const res = await axios.get(`${API_BASE}/courses`);
  return res.data;
};

// ✅ Fetch all courses for PRL (with faculty & stream info)
export const fetchPrlCourses = async () => {
  const res = await axios.get(`${API_BASE}/courses/prl/all`);
  return res.data;
};

export const fetchPlCourses = async (plId) => {
  const res = await axios.get(`${API_BASE}/courses/pl/${plId}`);
  return res.data;
};

export const postCourse = async (courseData) => {
  const res = await axios.post(`${API_BASE}/courses`, courseData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const deleteCourse = async (courseId) => {
  const res = await axios.delete(`${API_BASE}/courses/${courseId}`);
  return res.data;
};

export const assignLecturer = async (data) => {
  const res = await axios.post(`${API_BASE}/courses/assign`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// --------------------
// Streams
// --------------------
export const fetchStreams = async () => {
  const res = await axios.get(`${API_BASE}/streams`);
  return res.data;
};

// --------------------
// Lecturers (for assigning)
// --------------------
export const fetchLecturersByFaculty = async (facultyId) => {
  const res = await axios.get(`${API_BASE}/users/faculty/${facultyId}/lecturers`);
  return res.data;
};

// --------------------
// Classes
// --------------------
export const fetchClasses = async () => {
  const res = await axios.get(`${API_BASE}/classes`);
  return res.data;
};

// ✅ Fetch only classes assigned to a lecturer
export const fetchLecturerClasses = async (lecturerId) => {
  const res = await axios.get(`${API_BASE}/classes/lecturer/${lecturerId}`);
  return res.data.map((cls) => ({
    id: cls.id,
    class_name: cls.class_name,
    course_id: cls.course_id,
  }));
};

// ✅ Ensures proper mapping for PRL feedback dropdown
export const fetchPrlClasses = async (prlId) => {
  const res = await axios.get(`${API_BASE}/classes/prl/${prlId}`);
  return res.data.map((cls) => ({
    id: cls.report_id || cls.id,
    lecturer_name: cls.lecturer_name || "N/A",
  }));
};

export const fetchPlClasses = async (plId) => {
  const res = await axios.get(`${API_BASE}/classes/pl/${plId}`);
  return res.data;
};

export const addClass = async (classData) => {
  const res = await axios.post(`${API_BASE}/classes`, classData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const deleteClass = async (classId) => {
  const res = await axios.delete(`${API_BASE}/classes/${classId}`);
  return res.data;
};

// --------------------
// Role-specific fetchers
// --------------------
export const fetchRoleRatings = (role, userId) =>
  axios.get(`${API_BASE}/ratings/${role}/${userId}`).then((r) => r.data);

export const fetchRoleMonitoring = (role, userId) =>
  axios.get(`${API_BASE}/monitoring/${role}/${userId}`).then((r) => r.data);

export const fetchRoleReports = (role, userId) =>
  axios.get(`${API_BASE}/reports/${role}/${userId}`).then((r) => r.data);

// --------------------
// Reports (Lecturer / PL / PRL)
// --------------------
export const postReport = async (reportData) => {
  try {
    const res = await axios.post(`${API_BASE}/reports`, reportData, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.data.success === false) {
      throw new Error(res.data.message || "Failed to submit report");
    }

    return res.data;
  } catch (err) {
    console.error("❌ Report submission error:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message || "Failed to submit report. Please try again."
    );
  }
};

export const deleteReport = async (reportId) => {
  try {
    const res = await axios.delete(`${API_BASE}/reports/${reportId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Report deletion error:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message || "Failed to delete report. Please try again."
    );
  }
};

// --------------------
// Ratings
// --------------------
export const postRating = async (payload) => {
  try {
    const res = await axios.post(`${API_BASE}/ratings`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Rating submission error:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message || "Failed to submit rating. Please try again."
    );
  }
};

// --------------------
// PRL Feedback for logged-in lecturer
// --------------------
export const fetchPrlFeedbackForLecturer = async (lecturerId) => {
  const res = await axios.get(`${API_BASE}/reports/feedback/lecturer/${lecturerId}`);
  return res.data;
};

// --------------------
// Feedback / Announcements
// --------------------
export const fetchFeedback = async (userId = null, role = null) => {
  const url = userId
    ? `${API_BASE}/feedback?userId=${userId}&role=${role}`
    : `${API_BASE}/feedback`;
  const res = await axios.get(url);
  return res.data;
};

export const addFeedbackOrAnnouncement = async (payload) => {
  const res = await axios.post(`${API_BASE}/feedback`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const deleteFeedbackOrAnnouncement = async (id) => {
  const res = await axios.delete(`${API_BASE}/feedback/${id}`);
  return res.data;
};
