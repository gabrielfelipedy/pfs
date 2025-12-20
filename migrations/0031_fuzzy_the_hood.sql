DROP VIEW `vw_total_expense_by_day`;--> statement-breakpoint
DROP VIEW `vw_total_expense_by_month`;--> statement-breakpoint
DROP VIEW `vw_total_expense_by_week`;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_day` AS select CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
     date("vw_expense"."date", 'unixepoch') >= date('now', 'start of day')
    AND date("vw_expense"."date", 'unixepoch') <= date('now')
  ;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_month` AS select CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    date("vw_expense"."date", 'unixepoch') >= date('now', 'start of month')
    AND date("vw_expense"."date", 'unixepoch') <= date('now')
  ;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_week` AS select CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    date("vw_expense"."date", 'unixepoch') >= date('now', 'weekday 0', '-7 days')
    AND date("vw_expense"."date", 'unixepoch') <= date('now')
  ;