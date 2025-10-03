const db = require('../config/db');
const Announcement = {
  getAll: (callback) => {
    db.query("SELECT * FROM announcements ORDER BY created_at DESC", callback);
  },
  create: (text, callback) => {
    db.query(
      "INSERT INTO announcements (text) VALUES (?)",
      [text],
      callback
    );
  },
  update: (id, text, callback) => {
    db.query("UPDATE announcements SET text = ? WHERE id = ?", [text, id], callback);
  },
  delete: (id, callback) => {
    db.query("DELETE FROM announcements WHERE id = ?", [id], callback);
  },
};

module.exports = Announcement;