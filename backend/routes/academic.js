const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Kiosk: Get Academic Info
router.get("/", (req, res) => {
  db.query("SELECT * FROM academic ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;