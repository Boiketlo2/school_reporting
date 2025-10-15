const mysql = require("mysql2");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "school_reporting",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
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

// Keep the pool alive: ping every 5 minutes
setInterval(() => {
  db.query("SELECT 1", (err) => {
    if (err) console.warn("⚠️ MySQL ping failed:", err.message);
  });
}, 300000); // 5 minutes

// Global pool error handler
db.on("error", (err) => {
  console.error("❌ MySQL pool error:", err.code, err.message);
});

module.exports = db;
