const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const auth = require("../../middleware/auth");
const multer = require('multer');
const path = require('path');


const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// Multer storage config: save files to backend/uploads with timestamp prefix
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_');
    cb(null, `${Date.now()}_${name}${ext}`);
  }
});
const upload = multer({ storage });

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
// Add new announcement with optional image upload
router.post("/", auth, upload.single('image'), (req, res) => {
  const { title, content, start_date, end_date, is_active } = req.body;

  if (!title || !content || !start_date || !end_date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    "INSERT INTO announcements (title, content, start_date, end_date, is_active, image_path) VALUES (?, ?, ?, ?, ?, ?)",
    [title, content, start_date, end_date, is_active ?? 1, imagePath],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ 
        id: result.insertId, 
        title, 
        content, 
        start_date, 
        end_date, 
        is_active,
        image_path: imagePath,
        message: "Announcement created successfully" 
      });
    }
  );
});

// Update announcement
// Update announcement with optional image replace
router.put("/:id", auth, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, content, start_date, end_date, is_active } = req.body;

  if (!title || !content || !start_date || !end_date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  // If imagePath is provided (new file uploaded), include it in the update; otherwise keep existing
  const query = imagePath
    ? "UPDATE announcements SET title=?, content=?, start_date=?, end_date=?, is_active=?, image_path=? WHERE id=?"
    : "UPDATE announcements SET title=?, content=?, start_date=?, end_date=?, is_active=? WHERE id=?";

  const params = imagePath
    ? [title, content, start_date, end_date, is_active, imagePath, id]
    : [title, content, start_date, end_date, is_active, id];

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.json({ message: "Announcement updated successfully" });
  });
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