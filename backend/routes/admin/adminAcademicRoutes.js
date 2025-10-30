const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const auth = require("../../middleware/auth");

// Map friendly section names to actual table names (preferred new tables)
const tableMap = {
  requirements: "academic_requirements",
  programs: "academic_programs",
  scholarship: "academic_scholarship",
};

// Legacy mapping: if old `academic` table is used, map section keys to legacy section values
const legacySectionMap = {
  requirements: 'admission', // legacy used 'admission' in seed
  programs: 'programs',
  scholarship: 'scholarship'
};

function getTable(section) {
  return tableMap[section];
}

function tableExists(tableName) {
  return db
    .promise()
    .query("SHOW TABLES LIKE ?", [tableName])
    .then(([rows]) => Array.isArray(rows) && rows.length > 0)
    .catch((err) => {
      console.error('tableExists error:', err);
      return false;
    });
}

// List entries - default route (no section) returns programs
router.get('/', auth, async (req, res) => {
  const section = 'programs';
  const table = getTable(section);
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
    console.error('admin academic GET / error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

// List entries for a specific section
router.get('/:section', auth, async (req, res) => {
  const section = req.params.section;
  const table = getTable(section);
  if (!table) return res.status(400).json({ error: 'Invalid section' });

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
    console.error('admin academic GET /:section error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

// Add new entry to a section
// Add new entry to a section
router.post('/:section', auth, async (req, res) => {
  const section = req.params.section;
  const table = getTable(section);
  if (!table) return res.status(400).json({ error: 'Invalid section' });

  const { title, content } = req.body;
  try {
    const exists = await tableExists(table);
    if (exists) {
      const [result] = await db.promise().query(`INSERT INTO ${table} (title, content, created_at) VALUES (?, ?, NOW())`, [title, content]);
      return res.json({ id: result.insertId, message: 'Entry added successfully' });
    }
    // Fallback: insert into legacy academic table with section column
    const legacySection = legacySectionMap[section] || section;
    const [result] = await db.promise().query(`INSERT INTO academic (title, content, section, created_at) VALUES (?, ?, ?, NOW())`, [title, content, legacySection]);
    return res.json({ id: result.insertId, message: 'Entry added to legacy academic table' });
  } catch (err) {
    console.error('admin academic POST error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

// Update entry
// Update entry
router.put('/:section/:id', auth, async (req, res) => {
  const section = req.params.section;
  const table = getTable(section);
  if (!table) return res.status(400).json({ error: 'Invalid section' });

  const { title, content } = req.body;
  try {
    const exists = await tableExists(table);
    if (exists) {
      const [result] = await db.promise().query(`UPDATE ${table} SET title=?, content=? WHERE id=?`, [title, content, req.params.id]);
      if (result && result.affectedRows === 0) return res.status(404).json({ error: 'Entry not found' });
      return res.json({ message: 'Entry updated successfully' });
    }
    // Fallback to legacy academic table
    const [result] = await db.promise().query(`UPDATE academic SET title=?, content=? WHERE id=? AND section=?`, [title, content, req.params.id, legacySectionMap[section] || section]);
    if (result && result.affectedRows === 0) return res.status(404).json({ error: 'Entry not found' });
    return res.json({ message: 'Legacy academic entry updated successfully' });
  } catch (err) {
    console.error('admin academic PUT error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

// Delete entry
// Delete entry
router.delete('/:section/:id', auth, async (req, res) => {
  const section = req.params.section;
  const table = getTable(section);
  if (!table) return res.status(400).json({ error: 'Invalid section' });

  try {
    const exists = await tableExists(table);
    if (exists) {
      const [result] = await db.promise().query(`DELETE FROM ${table} WHERE id=?`, [req.params.id]);
      if (result && result.affectedRows === 0) return res.status(404).json({ error: 'Entry not found' });
      return res.json({ message: 'Entry deleted successfully' });
    }
    // Fallback to legacy academic table
    const [result] = await db.promise().query(`DELETE FROM academic WHERE id=? AND section=?`, [req.params.id, legacySectionMap[section] || section]);
    if (result && result.affectedRows === 0) return res.status(404).json({ error: 'Entry not found' });
    return res.json({ message: 'Legacy academic entry deleted successfully' });
  } catch (err) {
    console.error('admin academic DELETE error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

module.exports = router;