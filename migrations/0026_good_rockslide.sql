CREATE VIEW `vw_total_expense_by_day` AS select CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    substr("vw_expense"."date", 1, 10) >= date('now', 'start of day')
    AND substr("vw_expense"."date", 1, 10) <= date('now')
  ;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_daymonth` AS select substr("date", 1, 10) as "date", CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    substr("vw_expense"."date", 1, 10) >= date('now', 'start of month')
    AND substr("vw_expense"."date", 1, 10) <= date('now')
   group by substr("vw_expense"."date", 1, 10) order by substr("vw_expense"."date", 1, 10);--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_month` AS select CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    substr("vw_expense"."date", 1, 10) >= date('now', 'start of month')
    AND substr("vw_expense"."date", 1, 10) <= date('now')
  ;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_week` AS select CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    substr("vw_expense"."date", 1, 10) >= date('now', 'weekday 0', '-7 days')
    AND substr("vw_expense"."date", 1, 10) <= date('now')
  ;