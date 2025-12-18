DROP VIEW `vw_total_expenses_by_daymonth`;--> statement-breakpoint
CREATE VIEW `vw_total_expenses_by_daymonth` AS select date("date") as "date", sum("value") as "total_value" from "vw_expense" where 
    "vw_expense"."date" >= date('now', 'start of month')
    AND "vw_expense"."date" <= date('now')
   group by date("vw_expense"."date") order by date("vw_expense"."date");