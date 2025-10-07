-- ====================================================
-- Faculty Reporting System - Clean Schema with Seeds
-- ====================================================

-- Drop and recreate database
DROP DATABASE IF EXISTS school_reporting;
CREATE DATABASE school_reporting;
USE school_reporting;

-- ====================
-- Users
-- ====================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE,
  student_number VARCHAR(50) UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','lecturer','prl','pl','admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================
-- Faculties
-- ====================
CREATE TABLE faculties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) UNIQUE
);

-- ====================
-- Streams (Programmes / Degree paths)
-- ====================
CREATE TABLE streams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  faculty_id INT,
  FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
);

-- ====================
-- Courses
-- ====================
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  code VARCHAR(50),
  faculty_id INT,
  stream_id INT,
  FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE SET NULL,
  FOREIGN KEY (stream_id) REFERENCES streams(id) ON DELETE SET NULL
);

-- ====================
-- Classes
-- ====================
CREATE TABLE classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT,
  lecturer_id INT,
  class_name VARCHAR(150),
  schedule_time VARCHAR(50),
  venue VARCHAR(150),
  total_students INT DEFAULT 0,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
  FOREIGN KEY (lecturer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ====================
-- Reports
-- ====================
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT,
  lecturer_id INT,
  week INT,
  lecture_date DATE,
  topic VARCHAR(255),
  outcomes TEXT,
  recommendations TEXT,
  present_students INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (lecturer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ====================
-- Feedback (PRL -> reports)
-- ====================
CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT,
  prl_id INT,
  feedback_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
  FOREIGN KEY (prl_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ====================
-- Ratings (Students, PRLs, PLs, Lecturers give ratings)
-- ====================
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT,
  rater_id INT,
  rater_role ENUM('student','lecturer','prl','pl'),
  score INT CHECK (score BETWEEN 1 AND 5),
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
  FOREIGN KEY (rater_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ====================
-- Seed Data
-- ====================

-- Faculties
INSERT INTO faculties (name) VALUES
('Faculty of Information and Communication Technology (FICT)'),
('Faculty of Business'),
('Faculty of Education'),
('Faculty of Engineering');

-- Streams (for FICT only for now)
INSERT INTO streams (name, faculty_id) VALUES
('Bachelor of Computer Science (Hons)', 1),
('Bachelor of Information Systems (Hons)', 1),
('Business Information Systems', 1),
('Information Systems Engineering', 1),
('Bachelor of Information Technology (Hons) - Communications & Networking', 1),
('Bachelor of Information Technology (Hons) - Computer Engineering', 1),
('Master of Computer Science', 1),
('Doctor of Philosophy (Computer Science)', 1);

-- Courses (sample courses for FICT)
INSERT INTO courses (name, code, faculty_id, stream_id) VALUES
('Programming Fundamentals', 'CSC101', 1, 1),
('Data Structures & Algorithms', 'CSC201', 1, 1),
('Database Systems', 'CSC210', 1, 1),
('Web Development', 'BIS120', 1, 2),
('Systems Analysis & Design', 'BIS220', 1, 2),
('Business Information Systems', 'BIS300', 1, 3),
('Software Engineering', 'ISE310', 1, 4),
('Computer Networks', 'BIT110', 1, 5),
('Operating Systems', 'BIT220', 1, 6),
('Research Methodology', 'MCS500', 1, 7),
('Advanced Topics in Computer Science', 'PHD800', 1, 8);

-- Seed Admin User (email login, password = admin123)
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@school.test',
        '$2a$10$KIXHk7yqzqv8t3f9cJcG0uQ9u1c3p3yDlP6P2a3JQK5Q3u0dVgkOe',
        'admin');
