const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Kiosk: Get About PTC info
router.get("/", (req, res) => {
  db.query("SELECT * FROM about ORDER BY last_updated DESC LIMIT 1", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const row = results[0] || {};
    // parse former_admins JSON into array for frontend
    try {
      if (row.former_admins) row.former_admins = JSON.parse(row.former_admins);
    } catch (e) {
      row.former_admins = [];
    }
    res.json(row);
  });
});

module.exports = router;
