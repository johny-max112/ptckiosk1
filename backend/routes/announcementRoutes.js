// routes/announcementRoutes.js
const express = require("express");
const db = require("../config/db.js");

const router = express.Router();

// Get all announcements (only active ones for kiosk)
router.get("/", (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  db.query(
    "SELECT * FROM announcements WHERE is_active = 1 AND start_date <= ? AND end_date >= ? ORDER BY created_at DESC",
    [today, today],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Add new announcement
router.post("/", (req, res) => {
  const { title, content, start_date, end_date, is_active } = req.body;
  db.query(
    "INSERT INTO announcements (title, content, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?)",
    [title, content, start_date, end_date, is_active ?? 1],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, title, content, start_date, end_date, is_active });
    }
  );
});

// Delete announcement
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM announcements WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Announcement deleted" });
  });
});

// Update announcement
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, content, start_date, end_date, is_active } = req.body;
  db.query(
    "UPDATE announcements SET title=?, content=?, start_date=?, end_date=?, is_active=? WHERE id=?",
    [title, content, start_date, end_date, is_active, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Announcement updated" });
    }
  );
});

module.exports = router;
