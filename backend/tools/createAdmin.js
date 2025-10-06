const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function create() {
  const email = process.env.ADMIN_EMAIL || 'admin@ptc.edu';
  const name = process.env.ADMIN_NAME || 'PTC Admin';
  const plain = process.env.ADMIN_PASSWORD || 'ChangeMe123!'; // change immediately
  const hashed = await bcrypt.hash(plain, 10);
  const [r] = await pool.query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
  console.log('Created admin id:', r.insertId, 'email:', email, 'password:', plain);
  process.exit(0);
}
create().catch(console.error);