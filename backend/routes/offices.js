const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Kiosk: Get Offices with Campus Names
router.get("/", (req, res) => {
  const query = `
    SELECT 
      o.id,
      o.name,
      o.description,
      o.room,
      o.office_hours,
      o.campus_id,
      c.name as campus_name,
      c.address as campus_address,
      o.created_at
    FROM offices o
    LEFT JOIN campuses c ON o.campus_id = c.id
    ORDER BY c.name, o.name
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('[GET /api/offices] Query error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ error: err.message || 'Database query failed' });
    }
    const count = Array.isArray(results) ? results.length : 0;
    console.log(`[GET /api/offices] returned ${count} rows`);
    if (count > 0) console.debug('[GET /api/offices] sample row', results[0]);
    res.json(results || []);
  });
});

module.exports = router;