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

// Ensure new embed/link columns exist in `maps` table so kiosk embed
// functionality does not fail on older schemas. Add columns if missing.
const mapColumnsToEnsure = [
  { name: 'embed_map_link', type: "VARCHAR(1024) DEFAULT NULL" },
  { name: 'embed_streetview_link', type: "VARCHAR(1024) DEFAULT NULL" },
  { name: 'description_map', type: "VARCHAR(255) DEFAULT NULL" },
  { name: 'description_streetview', type: "VARCHAR(255) DEFAULT NULL" },
];

mapColumnsToEnsure.forEach(col => {
  pool.query(
    "SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'maps' AND COLUMN_NAME = ?",
    [dbName, col.name],
    (err, results) => {
      if (err) {
        console.error(`Failed to check maps.${col.name} column existence:`, err && err.stack ? err.stack : err);
        return;
      }
      try {
        const cnt = (results && results[0] && results[0].cnt) || 0;
        if (Number(cnt) === 0) {
          console.log(`
            \
            \
            ${col.name} column not found in maps — attempting to add column.`);
          pool.query(`ALTER TABLE maps ADD COLUMN ${col.name} ${col.type}`, (alterErr) => {
            if (alterErr) {
              console.error(`Failed to add ${col.name} column to maps:`, alterErr && alterErr.stack ? alterErr.stack : alterErr);
            } else {
              console.log(`Added ${col.name} column to maps table.`);
            }
          });
        } else {
          console.log(`${col.name} column already present in maps.`);
        }
      } catch (e) {
        console.error(`Error while ensuring maps.${col.name} column exists:`, e && e.stack ? e.stack : e);
      }
    }
  );
});

module.exports = pool;