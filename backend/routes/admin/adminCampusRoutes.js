const express = require("express");
const router = express.Router();
const db = require("../../config/db");

// GET all campuses for admin
router.get("/", (req, res) => {
  db.query("SELECT * FROM campuses ORDER BY name ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
