const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Missing auth token' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production";
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = payload;
    next();
  });
};