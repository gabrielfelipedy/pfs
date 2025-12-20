DROP VIEW `vw_total_income_by_daymonth`;--> statement-breakpoint
CREATE VIEW `vw_total_income_by_daymonth` AS select date("date", 'unixepoch') as "date", CAST(SUM("value") AS INTEGER) as "total_value" from "vw_income" where 
    date("vw_income"."date", 'unixepoch') >= date('now', 'start of month')
    AND date("vw_income"."date", 'unixepoch') <= date('now')
   group by date("vw_income"."date", 'unixepoch') order by date("vw_income"."date", 'unixepoch');