DROP VIEW `vw_total_expense_by_week`;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_week` AS select CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    date("vw_expense"."date", 'unixepoch', '-3 hours') >= date('now', 'weekday 0', '-7 days')
    AND date("vw_expense"."date", 'unixepoch', '-3 hours') <= date('now')
  ;