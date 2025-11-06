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
    if (err) return res.status(500).json({ error: err.message });
    console.log(`[GET /api/offices] returned ${Array.isArray(results) ? results.length : 0} rows`);
    // small sample log (avoid logging full result in production)
    if (Array.isArray(results) && results.length > 0) console.log("Sample office:", results[0]);
    res.json(results);
  });
});

module.exports = router;