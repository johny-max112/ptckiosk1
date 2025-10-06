// routes/admin.js
const express = require("express");
const router = express.Router();
const { login } = require('../controllers/authController');

// POST /api/admin/login
router.post("/login", login);

module.exports = router;