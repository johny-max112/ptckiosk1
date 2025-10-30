const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

const tableMap = {
  requirements: "academic_requirements",
  programs: "academic_programs",
  scholarship: "academic_scholarship",
};

const legacySectionMap = {
  requirements: 'admission',
  programs: 'programs',
  scholarship: 'scholarship'
};

function getTable(section) {
  return tableMap[section];
}

function tableExists(tableName) {
  // Use promise wrapper to avoid mixing callbacks and async/await
  return db.promise().query("SHOW TABLES LIKE ?", [tableName])
    .then(([rows]) => Array.isArray(rows) && rows.length > 0)
    .catch(() => false);
}

// Public GET endpoints for each section with legacy fallback
router.get("/:section", async (req, res) => {
  const section = req.params.section;
  const table = getTable(section);
  if (!table) return res.status(400).json({ error: "Invalid section" });

  try {
    const exists = await tableExists(table);
    if (exists) {
      const [rows] = await db.promise().query(`SELECT * FROM ${table} ORDER BY created_at DESC`);
      return res.json(rows);
    }

    const legacySection = legacySectionMap[section] || section;
    const [rows] = await db.promise().query(`SELECT * FROM academic WHERE section = ? ORDER BY created_at DESC`, [legacySection]);
    return res.json(rows);
  } catch (err) {
    console.error('academic GET error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

// Protected modify endpoints (require auth) with legacy fallback
router.post("/:section", auth, async (req, res) => {
  const section = req.params.section;
  const table = getTable(section);
  if (!table) return res.status(400).json({ error: "Invalid section" });

  const { title, content } = req.body;
  try {
    const exists = await tableExists(table);
    if (exists) {
      const [result] = await db.promise().query(`INSERT INTO ${table} (title, content, created_at) VALUES (?, ?, NOW())`, [title, content]);
      return res.json({ id: result.insertId, message: 'Entry added successfully' });
    }

    // Fallback insert into legacy academic table
    const legacySection = legacySectionMap[section] || section;
      const [result] = await db.promise().query(`INSERT INTO academic (title, content, section, created_at) VALUES (?, ?, ?, NOW())`, [title, content, legacySection]);
      return res.json({ id: result.insertId, message: 'Entry added to legacy academic table' });
  } catch (err) {
    console.error('academic POST error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

router.put("/:section/:id", auth, async (req, res) => {
  const section = req.params.section;
  const table = getTable(section);
  if (!table) return res.status(400).json({ error: "Invalid section" });

  const { title, content } = req.body;

    try {
      const exists = await tableExists(table);
      if (exists) {
        const [result] = await db.promise().query(`UPDATE ${table} SET title=?, content=? WHERE id=?`, [title, content, req.params.id]);
        if (result && result.affectedRows === 0) return res.status(404).json({ error: 'Entry not found' });
        return res.json({ message: 'Entry updated successfully' });
      }

      // Fallback to legacy academic table
      const legacySection = legacySectionMap[section] || section;
      const [result] = await db.promise().query(`UPDATE academic SET title=?, content=? WHERE id=? AND section=?`, [title, content, req.params.id, legacySection]);
      if (result && result.affectedRows === 0) return res.status(404).json({ error: 'Entry not found' });
      return res.json({ message: 'Legacy academic entry updated successfully' });
    } catch (err) {
      console.error('academic PUT error:', err);
      return res.status(500).json({ error: err.message || 'Unknown error' });
    }
});

router.delete("/:section/:id", auth, async (req, res) => {
  const section = req.params.section;
  const table = getTable(section);
  if (!table) return res.status(400).json({ error: "Invalid section" });

  try {
    const exists = await tableExists(table);
    if (exists) {
      const [result] = await db.promise().query(`DELETE FROM ${table} WHERE id=?`, [req.params.id]);
      if (result && result.affectedRows === 0) return res.status(404).json({ error: 'Entry not found' });
      return res.json({ message: 'Deleted' });
    }

    const legacySection = legacySectionMap[section] || section;
    const [result] = await db.promise().query(`DELETE FROM academic WHERE id=? AND section=?`, [req.params.id, legacySection]);
    if (result && result.affectedRows === 0) return res.status(404).json({ error: 'Entry not found' });
    return res.json({ message: 'Deleted legacy entry' });
  } catch (err) {
    console.error('academic DELETE error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

module.exports = router;