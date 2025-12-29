ALTER TABLE `operation` ADD `payment_method_id` integer REFERENCES payment_method(id);--> statement-breakpoint
DROP VIEW `vw_expense`;--> statement-breakpoint
DROP VIEW `vw_income`;--> statement-breakpoint
CREATE VIEW `vw_expense` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "category_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."is_income" = 0;--> statement-breakpoint
CREATE VIEW `vw_income` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "category_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."is_income" = 1;--> statement-breakpoint
ALTER TABLE `expense_limit` DROP COLUMN `payment_method_id`;