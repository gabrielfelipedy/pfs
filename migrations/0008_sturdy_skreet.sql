DROP VIEW `vw_total_expenses_by_daymonth`;--> statement-breakpoint
CREATE VIEW `vw_total_expenses_by_daymonth` AS select date("date") as "date", sum("value") as "total_value" from "vw_expense" where 
    "vw_expense"."date" >= date_trunc('month',  CURRENT_TIMESTAMP)
    AND "vw_expense"."date" <= CURRENT_TIMESTAMP
   group by date("vw_expense"."date") order by date("vw_expense"."date");