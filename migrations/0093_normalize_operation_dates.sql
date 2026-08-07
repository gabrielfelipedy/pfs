-- Normalize every operation date to the canonical UTC-3 convention: day D is
-- stored as D 03:00 UTC. Legacy rows kept a real time-of-day (imported rows,
-- rows created before the convention), which made the day-order depend on the
-- hidden time instead of `sort_order`. Snapping preserves each row's UTC-3
-- calendar day and makes `sort_order` the single within-day ordering key.
UPDATE `operation` SET `date` = strftime('%s', date(`date`, 'unixepoch', '-3 hours')) + 3 * 3600 WHERE `date` IS NOT NULL AND (`date` % 86400) != 10800;
