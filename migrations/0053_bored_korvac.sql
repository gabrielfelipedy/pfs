DROP VIEW `vw_total_expense_by_week`;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_week` AS select date(date, 'unixepoch', '-3 hours') as "day", CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    day >= date('now', '-6 days', 'weekday 0', 'start of day')
    AND day <= date('now', '+1 day', 'weekday 0', 'start of day')
  ;