// routes/admin/adminOfficeRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../../config/db"); // path to your db connection

// GET all offices (for admin view)
router.get("/", require("../../middleware/auth"), (req, res) => {
  db.query("SELECT * FROM offices ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("Fetch offices error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// POST: Add new office
router.post("/", require("../../middleware/auth"), (req, res) => {
  // removed `contact` - DB schema no longer contains this column
  const { name, description, office_hours, campus_id } = req.body;

  // campus_id is required if your table has it as NOT NULL
  if (!name || !campus_id) {
    return res.status(400).json({ error: "Name and campus_id are required" });
  }

  const query =
    "INSERT INTO offices (name, description, office_hours, campus_id, created_at) VALUES (?, ?, ?, ?, NOW())";

  db.query(query, [name, description, office_hours, campus_id], (err, result) => {
    if (err) {
      console.error("Save office error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: result.insertId, name, description, office_hours, campus_id });
  });
});

// PUT: Update existing office
router.put("/:id", require("../../middleware/auth"), (req, res) => {
  const { id } = req.params;
  // removed `contact` - DB schema no longer contains this column
  const { name, description, office_hours, campus_id } = req.body;

  const query =
    "UPDATE offices SET name=?, description=?, office_hours=?, campus_id=? WHERE id=?";

  db.query(query, [name, description, office_hours, campus_id, id], (err) => {
    if (err) {
      console.error("Update office error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Office updated successfully" });
  });
});

// DELETE: Remove office
router.delete("/:id", require("../../middleware/auth"), (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM offices WHERE id=?", [id], (err) => {
    if (err) {
      console.error("Delete office error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Office deleted successfully" });
  });
});

module.exports = router;
