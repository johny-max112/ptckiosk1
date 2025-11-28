const express = require("express");
const router = express.Router();
const db = require("../config/db");



// Kiosk: Get Campus Maps
router.get("/", (req, res) => {
  const sql = "SELECT id, campus_id, campus_name, embed_map_link, embed_streetview_link, description_map, description_streetview, address, created_at FROM maps ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error('[GET /api/maps] Query error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ error: err.message || 'Database query failed' });
    }
    const count = Array.isArray(results) ? results.length : 0;
    console.log(`[GET /api/maps] returned ${count} rows`);
    if (count > 0) console.debug('[GET /api/maps] sample row', results[0]);
    res.json(results || []);
  });
});


module.exports = router;
