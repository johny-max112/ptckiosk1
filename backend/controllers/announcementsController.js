const db = require('../config/db');

// Fetch announcements
exports.getAnnouncements = (req, res) => {
  db.query('SELECT * FROM announcements ORDER BY created_at DESC', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

// Add announcement
exports.addAnnouncement = (req, res) => {
  const { title, content } = req.body;
  db.query(
    'INSERT INTO announcements (title, content) VALUES (?, ?)', 
    [title, content], 
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Announcement added successfully' });
    }
  );
};

// Update announcement
exports.updateAnnouncement = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  db.query(
    'UPDATE announcements SET title=?, content=? WHERE id=?', 
    [title, content, id], 
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Announcement updated successfully' });
    }
  );
};

// Delete announcement
exports.deleteAnnouncement = (req, res) => {
  const { id } = req.params;
  db.query(
    'DELETE FROM announcements WHERE id=?', 
    [id], 
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Announcement deleted successfully' });
    }
  );
};