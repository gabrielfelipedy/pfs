DROP VIEW `vw_total_expenses_by_daymonth`;--> statement-breakpoint
CREATE VIEW `vw_total_income_by_daymonth` AS select substr("date", 1, 10) as "date", sum("value") as "total_value" from "vw_income" where 
    substr("vw_income"."date", 1, 10) >= date('now', 'start of month')
    AND substr("vw_income"."date", 1, 10) <= date('now')
   group by substr("vw_income"."date", 1, 10) order by substr("vw_income"."date", 1, 10);--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_daymonth` AS select substr("date", 1, 10) as "date", sum("value") as "total_value" from "vw_expense" where 
    substr("vw_expense"."date", 1, 10) >= date('now', 'start of month')
    AND substr("vw_expense"."date", 1, 10) <= date('now')
   group by substr("vw_expense"."date", 1, 10) order by substr("vw_expense"."date", 1, 10);