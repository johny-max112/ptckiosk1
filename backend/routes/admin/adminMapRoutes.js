const express = require("express");
const router = express.Router();
const db = require("../../config/db");

// Get all maps
router.get("/", (req, res) => {
  db.query("SELECT * FROM maps", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add new map
router.post("/", (req, res) => {
  const { campus_id = 1, image_path, description } = req.body;
  db.query(
    "INSERT INTO maps (campus_id, image_path, description, created_at) VALUES (?, ?, ?, NOW())",
    [campus_id, image_path, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: "Map added successfully" });
    }
  );
});

// Update map
router.put("/:id", (req, res) => {
  const { image_path, description } = req.body;
  db.query(
    "UPDATE maps SET image_path=?, description=? WHERE id=?",
    [image_path, description, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Map updated successfully" });
    }
  );
});

// Delete map
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM maps WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Map deleted successfully" });
  });
});

module.exports = router;
