DROP VIEW `vw_total_expense_by_daymonth`;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_daymonth` AS select date("date", 'unixepoch') as "date", CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    date("vw_expense"."date", 'unixepoch') >= date('now', 'start of month')
    AND date("vw_expense"."date", 'unixepoch') <= date('now')
   group by date("vw_expense"."date", 'unixepoch') order by date("vw_expense"."date", 'unixepoch');