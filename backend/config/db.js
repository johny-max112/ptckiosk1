const mysql = require('mysql2');
require('dotenv').config();

// Use a connection pool to avoid throwing on initial connect and to
// allow the app to continue and surface helpful errors instead of crashing.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ptc_kiosk3',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test a connection once at startup and log status — don't throw so the
// server remains running and can return clearer errors to the frontend.
pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection failed (pool):', err);
  } else {
    console.log('MySQL pool created — connection OK');
    connection.release();
  }
});

// Ensure optional `room` column exists in `offices` table so queries and
// admin inserts/updates that reference it do not fail on older schemas.
const dbName = process.env.DB_NAME || 'ptc_kiosk3';
pool.query(
  "SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'offices' AND COLUMN_NAME = 'room'",
  [dbName],
  (err, results) => {
    if (err) {
      console.error('Failed to check offices.room column existence:', err && err.stack ? err.stack : err);
      return;
    }
    try {
      const cnt = (results && results[0] && results[0].cnt) || 0;
      if (Number(cnt) === 0) {
        console.log('`room` column not found in `offices` — attempting to add column.');
        pool.query("ALTER TABLE offices ADD COLUMN room VARCHAR(128) DEFAULT NULL", (alterErr) => {
          if (alterErr) {
            console.error('Failed to add `room` column to `offices`:', alterErr && alterErr.stack ? alterErr.stack : alterErr);
          } else {
            console.log('Added `room` column to `offices` table.');
          }
        });
      } else {
        console.log('`room` column already present in `offices`.');
      }
    } catch (e) {
      console.error('Error while ensuring `room` column exists:', e && e.stack ? e.stack : e);
    }
  }
);

// Ensure optional `embed_html` column exists in `maps` table so kiosk embed
// iframe functionality does not fail on older schemas.
pool.query(
  "SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'maps' AND COLUMN_NAME = 'embed_html'",
  [dbName],
  (err, results) => {
    if (err) {
      console.error('Failed to check maps.embed_html column existence:', err && err.stack ? err.stack : err);
      return;
    }
    try {
      const cnt = (results && results[0] && results[0].cnt) || 0;
      if (Number(cnt) === 0) {
        console.log('`embed_html` column not found in `maps` — attempting to add column.');
        pool.query("ALTER TABLE maps ADD COLUMN embed_html TEXT DEFAULT NULL", (alterErr) => {
          if (alterErr) {
            console.error('Failed to add `embed_html` column to `maps`:', alterErr && alterErr.stack ? alterErr.stack : alterErr);
          } else {
            console.log('Added `embed_html` column to `maps` table.');
          }
        });
      } else {
        console.log('`embed_html` column already present in `maps`.');
      }
    } catch (e) {
      console.error('Error while ensuring `embed_html` column exists:', e && e.stack ? e.stack : e);
    }
  }
);

module.exports = pool;