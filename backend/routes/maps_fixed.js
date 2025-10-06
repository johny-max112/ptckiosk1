const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Kiosk: Get Campus Maps with Campus Names
router.get("/", (req, res) => {
  const query = `
    SELECT 
      m.id,
      m.image_path,
      m.description,
      m.campus_id,
      c.name as campus_name,
      m.created_at
    FROM maps m
    LEFT JOIN campuses c ON m.campus_id = c.id
    ORDER BY m.created_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;