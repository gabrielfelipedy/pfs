DROP VIEW `vw_expense_limit_with_category`;--> statement-breakpoint
DROP VIEW `vw_expense_limit_balance`;--> statement-breakpoint
DROP VIEW `vw_credit_card_expenses`;--> statement-breakpoint
DROP VIEW `vw_expense`;--> statement-breakpoint
DROP VIEW `vw_expense_with_category`;--> statement-breakpoint
DROP VIEW `vw_income`;--> statement-breakpoint
DROP VIEW `vw_income_with_category`;--> statement-breakpoint
DROP VIEW `vw_operation_with_category`;--> statement-breakpoint
DROP VIEW IF EXISTS `vw_balance_evolution`;--> statement-breakpoint
DROP VIEW IF EXISTS `vw_payment_method_balance`;--> statement-breakpoint
DROP VIEW IF EXISTS `vw_expense_balance`;--> statement-breakpoint
DROP VIEW IF EXISTS `vw_general_balance`;--> statement-breakpoint
DROP VIEW IF EXISTS `vw_income_balance`;--> statement-breakpoint

CREATE TABLE `period` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
ALTER TABLE `expense_limit` ADD `period_id` integer REFERENCES period(id);--> statement-breakpoint
ALTER TABLE `expense_limit` DROP COLUMN `recursive`;--> statement-breakpoint
ALTER TABLE `operation` ADD `period_id` integer REFERENCES period(id);--> statement-breakpoint
ALTER TABLE `operation` DROP COLUMN `recursive`;--> statement-breakpoint

CREATE VIEW `vw_credit_card_expenses` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where ("operation"."payment_method_id" = 3 and 
    date("operation"."date", 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month')
    AND date("operation"."date", 'unixepoch', '-3 hours') < date('now', '-3 hours', '+1 month', 'start of month')
  );--> statement-breakpoint
CREATE VIEW `vw_expense` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."is_income" = 0;--> statement-breakpoint
CREATE VIEW `vw_expense_with_category` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "period_id", "category_id", "category_name", "period_name", "payment_method_id", "payment_method_name" from "vw_operation_with_category" where "vw_operation_with_category"."is_income" = 0;--> statement-breakpoint
CREATE VIEW `vw_income` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."is_income" = 1;--> statement-breakpoint
CREATE VIEW `vw_income_with_category` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "period_id", "category_id", "category_name", "period_name", "payment_method_id", "payment_method_name" from "vw_operation_with_category" where "vw_operation_with_category"."is_income" = 1;--> statement-breakpoint
CREATE VIEW `vw_operation_with_category` AS select "operation"."id", "operation"."name", "operation"."description", "operation"."value", "operation"."date", "operation"."is_paid", "operation"."is_income", "operation"."period_id", "operation"."category_id", category.name as "category_name", period.name as "period_name", "operation"."payment_method_id", payment_method.name as "payment_method_name" from "operation" left join "category" on operation.category_id = category.id left join "payment_method" on operation.payment_method_id = payment_method.id left join "period" on operation.period_id = period.id;