-- Normalize legacy rows to the UTC-3 convention (day D stored as D 03:00 UTC).
-- Rows previously stored at/before 03:00 UTC (midnight, 01:00, 02:00) were
-- produced by timezone-dependent storage and display a day earlier than the
-- user entered. Shift them forward by 3 hours to the canonical representation.
UPDATE `operation` SET `date` = `date` + 3 * 3600 WHERE `date` IS NOT NULL AND (`date` % 86400) BETWEEN 0 AND 3 * 3600 - 1;--> statement-breakpoint
UPDATE `operation` SET `start_date` = `start_date` + 3 * 3600 WHERE `start_date` IS NOT NULL AND (`start_date` % 86400) BETWEEN 0 AND 3 * 3600 - 1;--> statement-breakpoint
UPDATE `operation` SET `end_date` = `end_date` + 3 * 3600 WHERE `end_date` IS NOT NULL AND (`end_date` % 86400) BETWEEN 0 AND 3 * 3600 - 1;--> statement-breakpoint
UPDATE `expense_limit` SET `start_date` = `start_date` + 3 * 3600 WHERE `start_date` IS NOT NULL AND (`start_date` % 86400) BETWEEN 0 AND 3 * 3600 - 1;--> statement-breakpoint
UPDATE `expense_limit` SET `end_date` = `end_date` + 3 * 3600 WHERE `end_date` IS NOT NULL AND (`end_date` % 86400) BETWEEN 0 AND 3 * 3600 - 1;
