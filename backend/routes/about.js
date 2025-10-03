const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Kiosk: Get About PTC info
router.get("/", (req, res) => {
  db.query("SELECT * FROM about ORDER BY last_updated DESC LIMIT 1", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

module.exports = router;
