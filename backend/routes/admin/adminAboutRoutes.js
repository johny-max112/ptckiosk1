const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const multer = require("multer");
const path = require("path");

// Multer setup (reuse uploads folder used by other routes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
});
const upload = multer({ storage });

// Admin GET: fetch about record (admin)
router.get("/", require("../../middleware/auth"), (req, res) => {
  db.query("SELECT * FROM about WHERE id=1", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const row = results[0] || { id: 1 };
    // parse former_admins JSON if present
    try {
      if (row.former_admins) row.former_admins = JSON.parse(row.former_admins);
    } catch (e) {
      row.former_admins = [];
    }
    res.json(row);
  });
});

/*
  POST/PUT: accept multipart/form-data with optional files:
  fields: inner_image, president_image, mission_image, vision_image
  array: former_admin_images (multiple files for former admins in same order as JSON entries)
  body: mission, vision, history, president_name, president_title, core_values, hymn_left, hymn_right, former_admins (JSON string)
*/
router.post("/", require("../../middleware/auth"), upload.fields([
  { name: 'inner_image', maxCount: 1 },
  { name: 'president_image', maxCount: 1 },
  { name: 'mission_image', maxCount: 1 },
  { name: 'vision_image', maxCount: 1 },
  { name: 'former_admin_images', maxCount: 20 }
]), (req, res) => {
  const body = req.body || {};
  const files = req.files || {};

  const inner_image = files.inner_image && files.inner_image[0] ? `/uploads/${files.inner_image[0].filename}` : (body.existing_inner_image || null);
  const president_image = files.president_image && files.president_image[0] ? `/uploads/${files.president_image[0].filename}` : (body.existing_president_image || null);
  const mission_image = files.mission_image && files.mission_image[0] ? `/uploads/${files.mission_image[0].filename}` : (body.existing_mission_image || null);
  const vision_image = files.vision_image && files.vision_image[0] ? `/uploads/${files.vision_image[0].filename}` : (body.existing_vision_image || null);

  // former_admins expected as JSON string array of {name,position,year}
  let formerAdmins = [];
  try { formerAdmins = body.former_admins ? JSON.parse(body.former_admins) : []; } catch (e) { formerAdmins = []; }
  // attach uploaded images to formerAdmins in order
  if (files.former_admin_images && files.former_admin_images.length) {
    for (let i = 0; i < files.former_admin_images.length && i < formerAdmins.length; i++) {
      formerAdmins[i].image = `/uploads/${files.former_admin_images[i].filename}`;
    }
  }

  const sql = `INSERT INTO about (id, mission, vision, history, inner_image, president_name, president_title, president_image, mission_image, vision_image, core_values, hymn_left, hymn_right, former_admins, last_updated)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE mission=VALUES(mission), vision=VALUES(vision), history=VALUES(history), inner_image=VALUES(inner_image), president_name=VALUES(president_name), president_title=VALUES(president_title), president_image=VALUES(president_image), mission_image=VALUES(mission_image), vision_image=VALUES(vision_image), core_values=VALUES(core_values), hymn_left=VALUES(hymn_left), hymn_right=VALUES(hymn_right), former_admins=VALUES(former_admins), last_updated=NOW()`;

  const params = [
    body.mission || null,
    body.vision || null,
    body.history || null,
    inner_image,
    body.president_name || null,
    body.president_title || null,
    president_image,
    mission_image,
    vision_image,
    body.core_values || null,
    body.hymn_left || null,
    body.hymn_right || null,
    JSON.stringify(formerAdmins || [])
  ];

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    // return the saved row so the admin UI can immediately reflect changes
    db.query("SELECT * FROM about WHERE id=1", (err2, results2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      const row2 = results2[0] || { id: 1 };
      try { if (row2.former_admins) row2.former_admins = JSON.parse(row2.former_admins); } catch (e) { row2.former_admins = []; }
      res.json(row2);
    });
  });
});

// same handler for PUT (update)
router.put("/", require("../../middleware/auth"), upload.fields([
  { name: 'inner_image', maxCount: 1 },
  { name: 'president_image', maxCount: 1 },
  { name: 'mission_image', maxCount: 1 },
  { name: 'vision_image', maxCount: 1 },
  { name: 'former_admin_images', maxCount: 20 }
]), (req, res) => {
  // reuse post implementation
  req.method = 'POST';
  return router.handle(req, res);
});

module.exports = router;