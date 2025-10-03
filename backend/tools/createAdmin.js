const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function create() {
  const email = 'admin@ptc.edu';
  const name = 'PTC Admin';
  const plain = 'ChangeMe123!'; // change immediately
  const hashed = await bcrypt.hash(plain, 10);
  const [r] = await pool.query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
  console.log('Created admin id:', r.insertId, 'email:', email, 'password:', plain);
  process.exit(0);
}
create().catch(console.error);