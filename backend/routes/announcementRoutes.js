// REPLACE backend/routes/announcementRoutes.js with this:
const express = require("express");
const db = require("../config/db.js");

const router = express.Router();

// Get all announcements (only active ones for kiosk)
router.get("/", (req, res) => {
  // More flexible date filtering - show announcements that are:
  // 1. Active (is_active = 1)
  // 2. Either current OR recently ended (within 7 days)
  const query = `
    SELECT * FROM announcements 
    WHERE is_active = 1 
    AND (
      (start_date <= CURDATE() AND end_date >= CURDATE()) OR
      (end_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY))
    )
    ORDER BY created_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
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