// createAdmin.js
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ptc_kiosk1"
});

const name = "Johntadeo Liscano"; 
const email = "admin@ptc.edu.ph"; 
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
