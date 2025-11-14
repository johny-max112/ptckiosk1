const express = require("express"); // Import ng Express at pag-setup ng router
const router = express.Router();
const db = require("../../config/db"); // Import to ng database connection

// Get  request dito para kunin ung about info
router.get("/", require("../../middleware/auth"), (req, res) => {

  db.query("SELECT * FROM about WHERE id=1", (err, results) => {
    // pag mar error sa code ito lalabas error 500
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      // pag walang laman ung table walang value lalavas empty yarn
      return res.json({ id: 1, mission: "", vision: "", history: "" });
    }
    res.json(results[0]);
  });
});


router.put("/", require("../../middleware/auth"), (req, res) => {
  const { mission, vision, history } = req.body;
  db.query(
    "UPDATE about SET mission=?, vision=?, history=?, last_updated=NOW() WHERE id=1",
    [mission, vision, history],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "About PTC updated successfully" });
    }
  );
});


router.post("/", require("../../middleware/auth"), (req, res) => {
  const { mission, vision, history } = req.body;
  db.query(
    "INSERT INTO about (id, mission, vision, history) VALUES (1, ?, ?, ?) ON DUPLICATE KEY UPDATE mission=?, vision=?, history=?, last_updated=NOW()",
    [mission, vision, history, mission, vision, history],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "About PTC created/updated successfully" });
    }
  );
});

module.exports = router;