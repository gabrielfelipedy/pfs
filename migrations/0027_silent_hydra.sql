CREATE VIEW `vw_general_balance` AS select CAST(vw_income_balance.total_sum AS INTEGER) as "total_incomes", CAST(vw_expense_balance.total_sum AS INTEGER) as "total_expenses", CAST(vw_income_balance.total_sum - vw_expense_balance.total_sum AS INTEGER) as "balance" from vw_income_balance full join vw_expense_balance on 1=1;--> statement-breakpoint
CREATE VIEW `vw_total_income_by_daymonth` AS select substr("date", 1, 10) as "date", CAST(SUM("value") AS INTEGER) as "total_value" from "vw_income" where 
    substr("vw_income"."date", 1, 10) >= date('now', 'start of month')
    AND substr("vw_income"."date", 1, 10) <= date('now')
   group by substr("vw_income"."date", 1, 10) order by substr("vw_income"."date", 1, 10);