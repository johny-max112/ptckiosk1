const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const auth = require("../../middleware/auth");

// Get all announcements (admin view - includes inactive)
router.get("/", auth, (req, res) => {
  db.query(
    "SELECT * FROM announcements ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Add new announcement
router.post("/", auth, (req, res) => {
  const { title, content, start_date, end_date, is_active } = req.body;
  
  if (!title || !content || !start_date || !end_date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "INSERT INTO announcements (title, content, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?)",
    [title, content, start_date, end_date, is_active ?? 1],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ 
        id: result.insertId, 
        title, 
        content, 
        start_date, 
        end_date, 
        is_active,
        message: "Announcement created successfully" 
      });
    }
  );
});

// Update announcement
router.put("/:id", auth, (req, res) => {
  const { id } = req.params;
  const { title, content, start_date, end_date, is_active } = req.body;
  
  if (!title || !content || !start_date || !end_date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "UPDATE announcements SET title=?, content=?, start_date=?, end_date=?, is_active=? WHERE id=?",
    [title, content, start_date, end_date, is_active, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json({ message: "Announcement updated successfully" });
    }
  );
});

// Delete announcement
router.delete("/:id", auth, (req, res) => {
  const { id } = req.params;
  
  db.query("DELETE FROM announcements WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.json({ message: "Announcement deleted successfully" });
  });
});

module.exports = router;