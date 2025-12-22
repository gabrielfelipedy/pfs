DROP VIEW `vw_total_expense_by_day`;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_day` AS select CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
     date("vw_expense"."date", 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of day')
    AND date("vw_expense"."date", 'unixepoch', '-3 hours') <= date('now', '-3 hours', '+1 day','start of day')
  ;