const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
  { name: 'history_image', maxCount: 1 },
  { name: 'president_image', maxCount: 1 },
  { name: 'mission_image', maxCount: 1 },
  { name: 'vision_image', maxCount: 1 },
  { name: 'former_admin_images', maxCount: 20 }
]), (req, res) => {
  const body = req.body || {};
  const files = req.files || {};

  // former_admins expected as JSON string array of {name,position,year}
  let formerAdmins = [];
  try { formerAdmins = body.former_admins ? JSON.parse(body.former_admins) : []; } catch (e) { formerAdmins = []; }
  // attach uploaded images to formerAdmins in order
  if (files.former_admin_images && files.former_admin_images.length) {
    for (let i = 0; i < files.former_admin_images.length && i < formerAdmins.length; i++) {
      formerAdmins[i].image = `/uploads/${files.former_admin_images[i].filename}`;
    }
  }

  // Build new uploaded paths (if any)
  const uploaded = {
    history_image: files.history_image && files.history_image[0] ? `/uploads/${files.history_image[0].filename}` : null,
    president_image: files.president_image && files.president_image[0] ? `/uploads/${files.president_image[0].filename}` : null,
    mission_image: files.mission_image && files.mission_image[0] ? `/uploads/${files.mission_image[0].filename}` : null,
    vision_image: files.vision_image && files.vision_image[0] ? `/uploads/${files.vision_image[0].filename}` : null
  };

  // Fetch existing row to preserve image columns when no new file provided
  db.query("SELECT * FROM about WHERE id=1", (selErr, selRows) => {
    if (selErr) return res.status(500).json({ error: selErr.message });
    const existing = selRows && selRows[0] ? selRows[0] : {};
    try { if (existing.former_admins) existing.former_admins = JSON.parse(existing.former_admins); } catch (e) { existing.former_admins = []; }

    // Development logging: show which fields were uploaded (helpful to diagnose uploads mapping)
    if (process.env.NODE_ENV !== 'production') {
      try {
        const received = {};
        Object.keys(files).forEach(k => {
          received[k] = files[k].map(f => f.filename);
        });
        console.log('[adminAbout] received files:', JSON.stringify(received));
      } catch (e) { console.log('[adminAbout] error logging files', e); }
    }

    // decide final image paths: prefer uploaded, then explicit existing from form, then DB existing value, else null
    // Respect explicit remove flags from the form (remove_* = '1')
    const history_image = uploaded.history_image || (body.remove_history_image ? null : (body.existing_history_image || existing.history_image || null));
    const president_image = uploaded.president_image || (body.remove_president_image ? null : (body.existing_president_image || existing.president_image || null));
    const mission_image = uploaded.mission_image || (body.remove_mission_image ? null : (body.existing_mission_image || existing.mission_image || null));
    const vision_image = uploaded.vision_image || (body.remove_vision_image ? null : (body.existing_vision_image || existing.vision_image || null));

    // cleanup: remove old files from uploads when they are replaced or explicitly removed
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    const unlinkIfExists = (p) => {
      if (!p) return;
      try {
        const fname = path.basename(p);
        const full = path.join(uploadsDir, fname);
        if (fs.existsSync(full)) fs.unlinkSync(full);
      } catch (e) {
        console.error('[adminAbout] failed to unlink', p, e && e.message ? e.message : e);
      }
    };

    // if a new upload replaced an existing file, delete the old file
    if (uploaded.history_image && existing.history_image && path.basename(uploaded.history_image) !== path.basename(existing.history_image)) {
      unlinkIfExists(existing.history_image);
    }
    if (body.remove_history_image && existing.history_image) {
      unlinkIfExists(existing.history_image);
    }

    if (uploaded.president_image && existing.president_image && path.basename(uploaded.president_image) !== path.basename(existing.president_image)) {
      unlinkIfExists(existing.president_image);
    }
    if (body.remove_president_image && existing.president_image) {
      unlinkIfExists(existing.president_image);
    }

    if (uploaded.mission_image && existing.mission_image && path.basename(uploaded.mission_image) !== path.basename(existing.mission_image)) {
      unlinkIfExists(existing.mission_image);
    }
    if (body.remove_mission_image && existing.mission_image) {
      unlinkIfExists(existing.mission_image);
    }

    if (uploaded.vision_image && existing.vision_image && path.basename(uploaded.vision_image) !== path.basename(existing.vision_image)) {
      unlinkIfExists(existing.vision_image);
    }
    if (body.remove_vision_image && existing.vision_image) {
      unlinkIfExists(existing.vision_image);
    }

    // former_admins: if the incoming JSON omits or sets image to null for an index that previously had an image, delete the old file
    try {
      const incomingFormer = formerAdmins || [];
      const existingFormer = existing.former_admins || [];
      for (let i = 0; i < existingFormer.length; i++) {
        const existingImg = existingFormer[i] && existingFormer[i].image;
        const incomingImg = incomingFormer[i] && incomingFormer[i].image;
        const removeFlag = body[`remove_former_admin_${i}`];
        // if incoming explicitly removed (flag) or incoming image is null/undefined and existing had an image
        if ((removeFlag === '1' || !incomingImg) && existingImg) {
          unlinkIfExists(existingImg);
        }
      }
    } catch (e) { /* ignore cleanup errors */ }

    // Prepare upsert: if row exists do UPDATE, else INSERT
    if (existing && existing.id) {
      const updSql = `UPDATE about SET mission = ?, vision = ?, history = ?, history_image = ?, president_name = ?, president_title = ?, president_image = ?, mission_image = ?, vision_image = ?, core_values = ?, hymn_left = ?, hymn_right = ?, former_admins = ?, last_updated = NOW() WHERE id = 1`;
      const updParams = [
        body.mission || null,
        body.vision || null,
        body.history || null,
        history_image,
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
      db.query(updSql, updParams, (uErr) => {
        if (uErr) return res.status(500).json({ error: uErr.message });
        db.query("SELECT * FROM about WHERE id=1", (err2, results2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          const row2 = results2[0] || { id: 1 };
          try { if (row2.former_admins) row2.former_admins = JSON.parse(row2.former_admins); } catch (e) { row2.former_admins = []; }
          res.json(row2);
        });
      });
    } else {
      const insSql = `INSERT INTO about (id, mission, vision, history, history_image, president_name, president_title, president_image, mission_image, vision_image, core_values, hymn_left, hymn_right, former_admins, last_updated)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
      const insParams = [
        body.mission || null,
        body.vision || null,
        body.history || null,
        history_image,
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
      db.query(insSql, insParams, (iErr) => {
        if (iErr) return res.status(500).json({ error: iErr.message });
        db.query("SELECT * FROM about WHERE id=1", (err2, results2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          const row2 = results2[0] || { id: 1 };
          try { if (row2.former_admins) row2.former_admins = JSON.parse(row2.former_admins); } catch (e) { row2.former_admins = []; }
          res.json(row2);
        });
      });
    }
  });
});

// same handler for PUT (update)
router.put("/", require("../../middleware/auth"), upload.fields([
  { name: 'history_image', maxCount: 1 },
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

// Development-only debug endpoint to inspect multipart field mapping
// POST /api/admin/about/debug-upload
// Use this to test which files are received for each field without modifying the DB
if (process.env.NODE_ENV !== 'production') {
  router.post('/debug-upload', upload.fields([
    { name: 'history_image', maxCount: 1 },
    { name: 'president_image', maxCount: 1 },
    { name: 'mission_image', maxCount: 1 },
    { name: 'vision_image', maxCount: 1 },
    { name: 'former_admin_images', maxCount: 20 }
  ]), (req, res) => {
    const files = req.files || {};
    const received = {};
    Object.keys(files).forEach(k => {
      received[k] = files[k].map(f => `/uploads/${f.filename}`);
    });
    return res.json({ received, body: req.body || {} });
  });
}