DROP VIEW `vw_total_expense_by_day`;--> statement-breakpoint
DROP VIEW `vw_total_expense_by_daymonth`;--> statement-breakpoint
DROP VIEW `vw_total_income_by_daymonth`;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_day` AS select CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
     date("vw_expense"."date", 'unixepoch', '-3 hours') >= date('now', 'start of day')
    AND date("vw_expense"."date", 'unixepoch', '-3 hours') <= date('now')
  ;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_daymonth` AS select date("date", 'unixepoch', '-3 hours') as "date", CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    date("vw_expense"."date", 'unixepoch', '-3 hours') >= date('now', 'start of month')
    AND date("vw_expense"."date", 'unixepoch', '-3 hours') <= date('now')
   group by date("vw_expense"."date", 'unixepoch', '-3 hours') order by date("vw_expense"."date", 'unixepoch', '-3 hours');--> statement-breakpoint
CREATE VIEW `vw_total_income_by_daymonth` AS select date("date", 'unixepoch', '-3 hours') as "date", CAST(SUM("value") AS INTEGER) as "total_value" from "vw_income" where 
    date("vw_income"."date", 'unixepoch', '-3 hours') >= date('now', 'start of month')
    AND date("vw_income"."date", 'unixepoch', '-3 hours') <= date('now')
   group by date("vw_income"."date", 'unixepoch', '-3 hours') order by date("vw_income"."date", 'unixepoch', '-3 hours');