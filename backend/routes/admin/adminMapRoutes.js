const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const multer = require("multer");
const path = require("path");

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all maps (no auth for testing)
router.get("/", (req, res) => {
  db.query("SELECT * FROM maps ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST new map with image upload (no auth for testing)
router.post("/", upload.single("image"), (req, res) => {
  const { campus_id = 1, campus_name = "", description = "", address = "", embed_html = null } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : "";
  console.log("Incoming form data:", req.body);
console.log("Uploaded file:", req.file);


  db.query(
    "INSERT INTO maps (campus_id, campus_name, image_path, embed_html, description, address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
    [campus_id, campus_name, image_path, embed_html, description, address],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: "Map added successfully" });
    }
  );
});

// PUT update map (no auth for testing)
router.put("/:id", (req, res) => {
  const { campus_name = "", image_path = "", embed_html = null, description = "", address = "" } = req.body;

  db.query(
    "UPDATE maps SET campus_name=?, image_path=?, embed_html=?, description=?, address=? WHERE id=?",
    [campus_name, image_path, embed_html, description, address, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Map updated successfully" });
    }
  );
});

// DELETE map (no auth for testing)
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM maps WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Map deleted successfully" });
  });
});

module.exports = router;
