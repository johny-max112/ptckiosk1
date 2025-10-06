// createAdmin.js
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ptc_kiosk1"
});

const name = process.env.ADMIN_NAME || "Johntadeo Liscano"; 
const email = process.env.ADMIN_EMAIL || "admin@ptc.edu.ph"; 
const password = "ptcadmin123"; 

const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;

  db.query(
    "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
    [name, email, hash],
    (err, results) => {
      if (err) throw err;
      console.log("Admin account created successfully!");
      process.exit();
    }
  );
});
