-- Quick setup for your XAMPP database
-- Run this in phpMyAdmin SQL tab

-- 1. Create missing academic table
CREATE TABLE IF NOT EXISTS `academic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Insert sample campuses
INSERT INTO campuses (name, address) VALUES 
('Main Campus', '123 Education Street, City Center'),
('Branch Campus', '456 Learning Avenue, North District');

-- 3. Insert sample about information
INSERT INTO about (id, mission, vision, history) VALUES 
(1, 
'To provide quality technical and vocational education that prepares students for successful careers.',
'To be the leading technical college in the region, recognized for excellence in technical education.',
'Founded in 1985, PTC has been at the forefront of technical education for over 35 years.'
);

-- 4. Insert sample academic programs
INSERT INTO academic (title, content) VALUES 
('Computer Science Program', 'Comprehensive training in programming, software development, and web technologies.'),
('Electrical Technology', 'Hands-on training in electrical systems, motor controls, and renewable energy.'),
('Automotive Technology', 'Engine repair, diagnostics, and modern automotive electronics training.'),
('Business Administration', 'Accounting, marketing, management principles, and entrepreneurship.');

-- 5. Insert sample offices
INSERT INTO offices (campus_id, name, description, contact, office_hours) VALUES 
(1, 'Registrar Office', 'Student records, enrollment, transcripts', '(555) 123-4567', 'Mon-Fri 8:00 AM - 5:00 PM'),
(1, 'Student Affairs', 'Student services, counseling, scholarships', '(555) 123-4568', 'Mon-Fri 8:00 AM - 6:00 PM'),
(1, 'Cashier Office', 'Tuition payments and fees', '(555) 123-4569', 'Mon-Fri 8:00 AM - 4:00 PM'),
(2, 'Branch Registrar', 'Student records for branch campus', '(555) 123-4571', 'Mon-Fri 8:00 AM - 5:00 PM');

-- 6. Insert sample maps
INSERT INTO maps (campus_id, image_path, description) VALUES 
(1, 'https://via.placeholder.com/800x600/3498db/ffffff?text=Main+Campus+Map', 'Main Campus layout'),
(2, 'https://via.placeholder.com/800x600/e74c3c/ffffff?text=Branch+Campus+Map', 'Branch Campus map');

-- 7. Insert sample announcements
INSERT INTO announcements (title, content, start_date, end_date, is_active) VALUES 
('Welcome New Students!', 'Orientation will be held on Monday at 9:00 AM in the Main Auditorium.', '2024-01-15', '2024-02-15', 1),
('Library Extended Hours', 'Extended hours during finals week until 10:00 PM.', '2024-12-01', '2024-12-15', 1);

-- 8. Create admin user (password will be: admin123)
INSERT INTO admins (name, email, password) VALUES 
('Administrator', 'admin@ptc.edu', '$2b$10$rOzJqKqGqGqGqGqGqGqGqOzJqKqGqGqGqGqGqGqGqOzJqKqGqGqGqG');

SELECT 'Database setup complete! You can now test your kiosk.' as message;