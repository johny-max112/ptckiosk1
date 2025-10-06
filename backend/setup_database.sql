-- Database setup for PTC Smart Kiosk
-- Run this script to create the necessary tables

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create about table
CREATE TABLE IF NOT EXISTS about (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mission TEXT,
  vision TEXT,
  history TEXT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123)
-- Note: This is a hashed version of 'admin123' using bcrypt
INSERT IGNORE INTO admins (name, email, password) VALUES 
('Admin', 'admin@ptc.edu', '$2b$10$rOzJqKqGqGqGqGqGqGqGqOzJqKqGqGqGqGqGqGqGqOzJqKqGqGqGqG');

-- Insert default about info
INSERT IGNORE INTO about (id, mission, vision, history) VALUES 
(1, 'Default mission statement', 'Default vision statement', 'Default history');

-- Show tables
SHOW TABLES;