const express = require("express");
const router = express.Router();
const db = require("../../config/db");

// Get all academic info
router.get("/", require("../../middleware/auth"), (req, res) => {
  db.query("SELECT * FROM academic", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add new academic info
router.post("/", require("../../middleware/auth"), (req, res) => {
  const { title, content } = req.body;
  db.query(
    "INSERT INTO academic (title, content, created_at) VALUES (?, ?, NOW())",
    [title, content],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: "Academic info added successfully" });
    }
  );
});

// Update academic info
router.put("/:id", require("../../middleware/auth"), (req, res) => {
  const { title, content } = req.body;
  db.query(
    "UPDATE academic SET title=?, content=? WHERE id=?",
    [title, content, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Academic info updated successfully" });
    }
  );
});

// Delete academic info
router.delete("/:id", require("../../middleware/auth"), (req, res) => {
  db.query("DELETE FROM academic WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Academic info deleted successfully" });
  });
});

module.exports = router;