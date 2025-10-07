const mysql = require("mysql2");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "school_reporting",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  connectionLimit: 10, // 🧠 optimize connection pooling
};

// Create connection pool
const db = mysql.createPool(dbConfig);

// Test connection with retry mechanism
function testConnection(retries = 5) {
  db.getConnection((err, connection) => {
    if (err) {
      console.error("❌ MySQL connection failed:", err.message);
      if (retries > 0) {
        console.log(`🔄 Retrying... (${retries} attempts left)`);
        setTimeout(() => testConnection(retries - 1), 3000);
      } else {
        console.error("🚨 Could not connect to MySQL after multiple attempts.");
      }
    } else {
      console.log("✅ MySQL connected successfully!");
      connection.release();
    }
  });
}

testConnection();

module.exports = db;
