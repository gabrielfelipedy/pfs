DROP VIEW `vw_total_expense_by_daymonth`;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_daymonth` AS select date("date", 'unixepoch') as "date", CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    date >= date('now', 'start of month')
    AND date <= date('now')
   group by date order by date;