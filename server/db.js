const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      isVerified BOOLEAN DEFAULT 0,
      otp TEXT,
      otpExpiry INTEGER,
      otpAttempts INTEGER DEFAULT 0,
      lastResend INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrate columns dynamically if database already exists
  db.run("ALTER TABLE users ADD COLUMN otpAttempts INTEGER DEFAULT 0", () => {});
  db.run("ALTER TABLE users ADD COLUMN lastResend INTEGER", () => {});

  console.log('Connected to SQLite database.');
});

module.exports = db;
