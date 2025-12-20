DROP TABLE `operation`;--> statement-breakpoint
DROP VIEW `vw_expense`;--> statement-breakpoint
DROP VIEW `vw_income`;--> statement-breakpoint
CREATE VIEW `vw_expense` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "category_id", "created_at", "updated_at" from "operation_two" where "operation_two"."is_income" = 0;--> statement-breakpoint
CREATE VIEW `vw_income` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "category_id", "created_at", "updated_at" from "operation_two" where "operation_two"."is_income" = 1;