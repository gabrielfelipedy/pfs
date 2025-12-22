DROP VIEW `vw_balance_evolution`;--> statement-breakpoint
DROP VIEW `vw_total_expense_by_daymonth`;--> statement-breakpoint
DROP VIEW `vw_total_expense_by_month`;--> statement-breakpoint
DROP VIEW `vw_total_expense_by_week`;--> statement-breakpoint
DROP VIEW `vw_total_income_by_daymonth`;--> statement-breakpoint
DROP VIEW `vw_total_operation_by_daymonth`;--> statement-breakpoint
CREATE VIEW `vw_balance_evolution` AS with "expenses_by_daymonth" as (select date(date, 'unixepoch', '-3 hours') as "day", CAST(SUM(value) AS INTEGER) as "total_expense" from "vw_expense" where day >= date('now', '-3 hours', 'start of month') AND day < date('now', '-3 hours' , '+1 month', 'start of month') group by day) select "day", CAST((select "total_incomes" from "vw_general_balance" limit 1) - SUM("total_expense") OVER (ORDER BY "day" ASC) AS INTEGER) as "balance" from "expenses_by_daymonth" order by "day" asc;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_daymonth` AS select date("date", 'unixepoch', '-3 hours') as "date", CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    date("vw_expense"."date", 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month')
    AND date("vw_expense"."date", 'unixepoch', '-3 hours') < date('now', '-3 hours', '+1 month', 'start of month')
   group by date("vw_expense"."date", 'unixepoch', '-3 hours') order by date("vw_expense"."date", 'unixepoch', '-3 hours');--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_month` AS select CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    date("vw_expense"."date", 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month')
    AND date("vw_expense"."date", 'unixepoch', '-3 hours') < date('now', '-3 hours', '+1 month', 'start of month')
  ;--> statement-breakpoint
CREATE VIEW `vw_total_expense_by_week` AS select date(date, 'unixepoch', '-3 hours') as "day", CAST(SUM("value") AS INTEGER) as "total_value" from "vw_expense" where 
    day >= date('now', '-3 hours', 'weekday 0', '-7 days')
    AND day < date('now', '-3 hours', 'weekday 0')
  ;--> statement-breakpoint
CREATE VIEW `vw_total_income_by_daymonth` AS select date("date", 'unixepoch', '-3 hours') as "date", CAST(SUM("value") AS INTEGER) as "total_value" from "vw_income" where 
    date("vw_income"."date", 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month')
    AND date("vw_income"."date", 'unixepoch', '-3 hours') < date('now', '-3 hours', '+1 month', 'start of month')
   group by date("vw_income"."date", 'unixepoch', '-3 hours') order by date("vw_income"."date", 'unixepoch', '-3 hours');--> statement-breakpoint
CREATE VIEW `vw_total_operation_by_daymonth` AS with "expenses_by_daymonth" as (select date(date, 'unixepoch', '-3 hours') as "day", CAST(SUM(value) AS INTEGER) as "total_expense" from "vw_expense" where day >= date('now', '-3 hours', 'start of month') AND day < date('now', '-3 hours', '+1 month', 'start of month') group by day), "incomes_by_daymonth" as (select date(date, 'unixepoch', '-3 hours') as "day", CAST(SUM(value) AS INTEGER) as "total_income" from "vw_income" where day >= date('now', '-3 hours', 'start of month') AND day < date('now', '-3 hours', '+1 month', 'start of month') group by day) select COALESCE(expenses_by_daymonth.day, incomes_by_daymonth.day) as "day", IFNULL("total_income", 0) as "total_income", IFNULL("total_expense", 0) as "total_expense", (IFNULL("total_income", 0) - IFNULL("total_expense", 0)) as "balance" from "expenses_by_daymonth" full join "incomes_by_daymonth" on expenses_by_daymonth.day = incomes_by_daymonth.day order by day;