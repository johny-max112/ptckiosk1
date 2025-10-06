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
      o.contact,
      o.office_hours,
      o.campus_id,
      c.name as campus_name,
      o.created_at
    FROM offices o
    LEFT JOIN campuses c ON o.campus_id = c.id
    ORDER BY o.created_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;