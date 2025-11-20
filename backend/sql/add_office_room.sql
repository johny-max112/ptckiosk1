-- Migration: add `room` column to `offices` (optional)
-- Run this in your XAMPP MySQL (phpMyAdmin or mysql CLI) if you want a separate `room` field

ALTER TABLE `offices`
  ADD COLUMN IF NOT EXISTS `room` VARCHAR(128) DEFAULT NULL AFTER `description`;

-- (Optional) If you previously inserted sample data and want to populate `room` for existing records, run statements like:
-- UPDATE `offices` SET `room` = '2nd floor, Room 201' WHERE id = 1;

COMMIT;