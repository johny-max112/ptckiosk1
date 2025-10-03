const express = require("express");
const router = express.Router();
const db = require("../../config/db");

// Admin: Update About PTC
router.put("/", (req, res) => {
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

module.exports = router;
