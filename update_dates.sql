-- Updated sample data with current dates
-- Run this in phpMyAdmin to update your announcements with current dates

-- Update announcements with current dates
UPDATE announcements SET 
  start_date = CURDATE(),
  end_date = DATE_ADD(CURDATE(), INTERVAL 30 DAY)
WHERE id IN (1, 2);

-- Or insert new current announcements
INSERT INTO announcements (title, content, start_date, end_date, is_active) VALUES 
('Welcome to PTC!', 'Welcome to the new semester! Check out our updated programs and facilities.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 1),
('Library Services', 'Our library is now open with extended hours. Visit us for study materials and research assistance.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY), 1),
('Registration Open', 'Registration for next semester is now open. Visit the Registrar Office for more information.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 45 DAY), 1)
ON DUPLICATE KEY UPDATE 
  start_date = VALUES(start_date),
  end_date = VALUES(end_date);