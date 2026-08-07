ALTER TABLE `operation` ADD `sort_order` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
-- Backfill sort_order with id so the existing within-day order is preserved.
-- sort_order is only used as a tiebreaker for rows on the same day.
UPDATE `operation` SET `sort_order` = `id`;--> statement-breakpoint
DROP VIEW `vw_credit_card_expenses`;--> statement-breakpoint
DROP VIEW `vw_expense`;--> statement-breakpoint
DROP VIEW `vw_expense_with_category`;--> statement-breakpoint
DROP VIEW `vw_income`;--> statement-breakpoint
DROP VIEW `vw_income_with_category`;--> statement-breakpoint
DROP VIEW `vw_investment`;--> statement-breakpoint
DROP VIEW `vw_operation_with_category`;--> statement-breakpoint
CREATE VIEW `vw_credit_card_expenses` AS select "id", "name", "description", "value", "parcelas", "date", "sort_order", "start_date", "end_date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where ("operation"."payment_method_id" = 3 and 
    date("operation"."date", 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month')
    AND date("operation"."date", 'unixepoch', '-3 hours') < date('now', '-3 hours', '+1 month', 'start of month')
  );--> statement-breakpoint
CREATE VIEW `vw_expense` AS select "id", "name", "description", "value", "parcelas", "date", "sort_order", "start_date", "end_date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."is_income" = 0;--> statement-breakpoint
CREATE VIEW `vw_expense_with_category` AS select "id", "name", "description", "value", "parcelas", "date", "sort_order", "start_date", "end_date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at", "category_name", "period_name", "payment_method_name" from "vw_operation_with_category" where "vw_operation_with_category"."is_income" = 0;--> statement-breakpoint
CREATE VIEW `vw_income` AS select "id", "name", "description", "value", "parcelas", "date", "sort_order", "start_date", "end_date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."is_income" = 1;--> statement-breakpoint
CREATE VIEW `vw_income_with_category` AS select "id", "name", "description", "value", "parcelas", "date", "sort_order", "start_date", "end_date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at", "category_name", "period_name", "payment_method_name" from "vw_operation_with_category" where "vw_operation_with_category"."is_income" = 1;--> statement-breakpoint
CREATE VIEW `vw_investment` AS select "id", "name", "description", "value", "parcelas", "date", "sort_order", "start_date", "end_date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."category_id" = 6;--> statement-breakpoint
CREATE VIEW `vw_operation_with_category` AS select "operation"."id", "operation"."name", "operation"."description", "operation"."value", "operation"."parcelas", "operation"."date", "operation"."sort_order", "operation"."start_date", "operation"."end_date", "operation"."is_paid", "operation"."is_income", "operation"."category_id", "operation"."period_id", "operation"."payment_method_id", "operation"."created_at", "operation"."updated_at", category.name as "category_name", period.name as "period_name", payment_method.name as "payment_method_name" from "operation" left join "category" on operation.category_id = category.id left join "payment_method" on operation.payment_method_id = payment_method.id left join "period" on operation.period_id = period.id;