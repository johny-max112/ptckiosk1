const express = require("express");
const router = express.Router();
const db = require("../../config/db");
// NOTE: image upload removed — maps now store embed links for map and streetview

// GET all maps (no auth for testing)
router.get("/", (req, res) => {
  db.query("SELECT * FROM maps ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST new map (accept embed links instead of image upload)
router.post("/", (req, res) => {
  const {
    campus_id = 1,
    campus_name = "",
    embed_map_link = null,
    description_map = "",
    embed_streetview_link = null,
    description_streetview = "",
    address = "",
  } = req.body;

  db.query(
    "INSERT INTO maps (campus_id, campus_name, embed_map_link, embed_streetview_link, description_map, description_streetview, address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
    [campus_id, campus_name, embed_map_link, embed_streetview_link, description_map, description_streetview, address],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: "Map added successfully" });
    }
  );
});

// PUT update map (accept embed links and descriptions)
router.put("/:id", (req, res) => {
  const {
    campus_name = "",
    embed_map_link = null,
    description_map = "",
    embed_streetview_link = null,
    description_streetview = "",
    address = "",
  } = req.body;

  db.query(
    "UPDATE maps SET campus_name=?, embed_map_link=?, description_map=?, embed_streetview_link=?, description_streetview=?, address=? WHERE id=?",
    [campus_name, embed_map_link, description_map, embed_streetview_link, description_streetview, address, req.params.id],
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
