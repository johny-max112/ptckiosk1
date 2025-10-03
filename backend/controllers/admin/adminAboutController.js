// controllers/admin/adminAboutController.js
const db = require("../../config/db");

// Get About info
exports.getAbout = (req, res) => {
  db.query("SELECT * FROM about LIMIT 1", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0] || {});
  });
};

// Add About info
exports.createAbout = (req, res) => {
  const { title, content } = req.body;
  db.query("INSERT INTO about (title, content) VALUES (?, ?)", [title, content], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "About content created successfully", id: result.insertId });
  });
};

// Update About info
exports.updateAbout = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  db.query("UPDATE about SET title=?, content=? WHERE id=?", [title, content, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "About content updated successfully" });
  });
};
