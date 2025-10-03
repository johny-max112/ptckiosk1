// routes/admin.js
const express = require("express");
const router = express.Router();
const db = require("../config/db.js"); // your DB connection
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret_key"; // Change this in production

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.query("SELECT * FROM admins WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ error: "Admin not found" });

    const admin = results[0];

    // Compare password
    bcrypt.compare(password, admin.password, (err, match) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!match) return res.status(401).json({ error: "Invalid password" });

      // Generate JWT token
      const token = jwt.sign(
        { id: admin.id, email: admin.email, name: admin.name },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      res.json({
        success: true,
        token,
        admin: { name: admin.name, email: admin.email }
      });
    });
  });
});

module.exports = router;
