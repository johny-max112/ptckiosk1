const express = require("express");
const router = express.Router();
const db = require("../../config/db");

// Get about info
router.get("/", require("../../middleware/auth"), (req, res) => {
  db.query("SELECT * FROM about WHERE id=1", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      // Return default structure if no data exists
      return res.json({ id: 1, mission: "", vision: "", history: "" });
    }
    res.json(results[0]);
  });
});

// Admin: Update About PTC
router.put("/", require("../../middleware/auth"), (req, res) => {
  const { mission, vision, history } = req.body;
  db.query(
    "UPDATE about SET mission=?, vision=?, history=?, last_updated=NOW() WHERE id=1",
    [mission, vision, history],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "About PTC updated successfully" });
    }
  );
});

// Create about record if it doesn't exist
router.post("/", require("../../middleware/auth"), (req, res) => {
  const { mission, vision, history } = req.body;
  db.query(
    "INSERT INTO about (id, mission, vision, history) VALUES (1, ?, ?, ?) ON DUPLICATE KEY UPDATE mission=?, vision=?, history=?, last_updated=NOW()",
    [mission, vision, history, mission, vision, history],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "About PTC created/updated successfully" });
    }
  );
});

module.exports = router;