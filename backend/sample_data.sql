-- Sample data for PTC Kiosk Database
-- Run this after creating your tables

-- Insert sample campuses
INSERT INTO campuses (id, name, address) VALUES 
(1, 'Main Campus', '123 Education Street, City Center'),
(2, 'Branch Campus', '456 Learning Avenue, North District')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert sample about information
INSERT INTO about (id, mission, vision, history) VALUES 
(1, 
'To provide quality technical and vocational education that prepares students for successful careers in their chosen fields while contributing to national development.',
'To be the leading technical college in the region, recognized for excellence in technical education, innovation, and community service.',
'Founded in 1985, PTC has been at the forefront of technical education for over 35 years. Starting with just 3 programs and 50 students, we have grown to serve thousands of students across multiple campuses with diverse technical and vocational programs.'
)
ON DUPLICATE KEY UPDATE 
mission=VALUES(mission), 
vision=VALUES(vision), 
history=VALUES(history);

-- Insert sample academic information
INSERT INTO academic (title, content, created_at) VALUES 
('Computer Science Program', 'Our Computer Science program offers comprehensive training in programming, software development, database management, and web technologies. Students learn modern programming languages including Java, Python, and JavaScript.', NOW()),
('Electrical Technology', 'The Electrical Technology program provides hands-on training in electrical systems, motor controls, PLCs, and renewable energy systems. Graduates are prepared for careers as electricians and electrical technicians.', NOW()),
('Automotive Technology', 'Students in our Automotive Technology program learn engine repair, diagnostics, brake systems, and modern automotive electronics. The program includes both classroom instruction and practical workshop experience.', NOW()),
('Business Administration', 'Our Business Administration program covers accounting, marketing, management principles, and entrepreneurship. Students develop skills needed for business operations and leadership roles.', NOW())
ON DUPLICATE KEY UPDATE content=VALUES(content);

-- Insert sample offices
INSERT INTO offices (campus_id, name, description, contact, office_hours, created_at) VALUES 
(1, 'Registrar Office', 'Student records, enrollment, transcripts, and academic certificates', '(555) 123-4567', 'Mon-Fri 8:00 AM - 5:00 PM', NOW()),
(1, 'Student Affairs', 'Student services, counseling, scholarships, and student activities', '(555) 123-4568', 'Mon-Fri 8:00 AM - 6:00 PM', NOW()),
(1, 'Cashier Office', 'Tuition payments, fees, and financial transactions', '(555) 123-4569', 'Mon-Fri 8:00 AM - 4:00 PM', NOW()),
(1, 'Library', 'Books, research materials, computer access, and study areas', '(555) 123-4570', 'Mon-Fri 7:00 AM - 8:00 PM, Sat 8:00 AM - 5:00 PM', NOW()),
(2, 'Branch Registrar', 'Student records and enrollment for branch campus', '(555) 123-4571', 'Mon-Fri 8:00 AM - 5:00 PM', NOW()),
(2, 'Branch Student Services', 'Student support services for branch campus', '(555) 123-4572', 'Mon-Fri 8:00 AM - 5:00 PM', NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert sample maps (you'll need to replace these URLs with actual map images)
INSERT INTO maps (campus_id, image_path, description, created_at) VALUES 
(1, 'https://via.placeholder.com/800x600/3498db/ffffff?text=Main+Campus+Map', 'Main Campus layout showing all buildings, parking areas, and facilities', NOW()),
(2, 'https://via.placeholder.com/800x600/e74c3c/ffffff?text=Branch+Campus+Map', 'Branch Campus map with classroom buildings and student services', NOW())
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Insert sample announcements
INSERT INTO announcements (title, content, start_date, end_date, is_active, created_at) VALUES 
('Welcome New Students!', 'Welcome to the new academic year! Orientation for new students will be held on Monday, August 28th at 9:00 AM in the Main Auditorium.', '2024-08-25', '2024-09-05', 1, NOW()),
('Library Extended Hours', 'The library will have extended hours during finals week. Open until 10:00 PM Monday through Thursday.', '2024-12-01', '2024-12-15', 1, NOW()),
('Scholarship Applications Open', 'Applications for academic scholarships are now open. Deadline for submission is March 15th. Visit the Student Affairs office for more information.', '2024-02-01', '2024-03-15', 1, NOW())
ON DUPLICATE KEY UPDATE content=VALUES(content);

-- Create admin user (password: admin123)
INSERT INTO admins (name, email, password, created_at) VALUES 
('Administrator', 'admin@ptc.edu', '$2b$10$rOzJqKqGqGqGqGqGqGqGqOzJqKqGqGqGqGqGqGqGqOzJqKqGqGqGqG', NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

SELECT 'Sample data inserted successfully!' as message;