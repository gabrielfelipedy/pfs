DROP VIEW `vw_total_expense_by_month`;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_month` AS select CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    date("vw_expense"."date", 'unixepoch', '-3 hours') >= date('now', 'start of month')
    AND date("vw_expense"."date", 'unixepoch', '-3 hours') <= date('now', 'start of month', '+1 month')
  ;