const bcrypt = require('bcrypt');
const db = require('./config/db');

async function createAdmin() {
  try {
    const password = 'admin123'; // Change this to your desired password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO admins (name, email, password) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE password = VALUES(password)
    `;
    
    db.query(query, ['Admin', 'admin@ptc.edu', hashedPassword], (err, result) => {
      if (err) {
        console.error('Error creating admin:', err);
      } else {
        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@ptc.edu');
        console.log('Password: admin123');
        console.log('Please change the password after first login.');
      }
      process.exit();
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();