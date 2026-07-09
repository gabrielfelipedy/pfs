DROP VIEW `vw_expense_with_category`;--> statement-breakpoint
DROP VIEW `vw_income_with_category`;--> statement-breakpoint
DROP VIEW `vw_operation_with_category`;--> statement-breakpoint
ALTER TABLE `operation` ADD COLUMN `start_date` integer;--> statement-breakpoint
ALTER TABLE `operation` ADD COLUMN `end_date` integer;--> statement-breakpoint
--> statement-breakpoint
UPDATE `operation` SET `start_date` = `date` WHERE `period_id` = 3;--> statement-breakpoint
CREATE VIEW `vw_operation_with_category` AS select "operation"."id", "operation"."name", "operation"."description", "operation"."value", "operation"."parcelas", "operation"."date", "operation"."start_date", "operation"."end_date", "operation"."is_paid", "operation"."is_income", "operation"."category_id", "operation"."period_id", "operation"."payment_method_id", "operation"."created_at", "operation"."updated_at", category.name as "category_name", period.name as "period_name", payment_method.name as "payment_method_name" from "operation" left join "category" on operation.category_id = category.id left join "payment_method" on operation.payment_method_id = payment_method.id left join "period" on operation.period_id = period.id;--> statement-breakpoint
CREATE VIEW `vw_expense_with_category` AS select "id", "name", "description", "value", "parcelas", "date", "start_date", "end_date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at", "category_name", "period_name", "payment_method_name" from "vw_operation_with_category" where "vw_operation_with_category"."is_income" = 0;--> statement-breakpoint
CREATE VIEW `vw_income_with_category` AS select "id", "name", "description", "value", "parcelas", "date", "start_date", "end_date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at", "category_name", "period_name", "payment_method_name" from "vw_operation_with_category" where "vw_operation_with_category"."is_income" = 1;
