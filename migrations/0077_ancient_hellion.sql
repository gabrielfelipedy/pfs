ALTER TABLE `expense_limit` ALTER COLUMN "recursive" TO "recursive" integer;--> statement-breakpoint
ALTER TABLE `operation` ADD `recursive` integer;--> statement-breakpoint
DROP VIEW `vw_total_expense_by_day`;--> statement-breakpoint
DROP VIEW `vw_total_expense_by_daymonth`;--> statement-breakpoint
DROP VIEW `vw_total_expense_by_month`;--> statement-breakpoint
DROP VIEW `vw_total_expense_by_week`;--> statement-breakpoint
DROP VIEW `vw_total_income_by_daymonth`;--> statement-breakpoint
DROP VIEW `vw_total_operation_by_daymonth`;--> statement-breakpoint
DROP VIEW `vw_credit_card_expenses`;--> statement-breakpoint
DROP VIEW `vw_expense`;--> statement-breakpoint
DROP VIEW `vw_expense_with_category`;--> statement-breakpoint
DROP VIEW `vw_income`;--> statement-breakpoint
DROP VIEW `vw_income_with_category`;--> statement-breakpoint
DROP VIEW `vw_operation_with_category`;--> statement-breakpoint
CREATE VIEW `vw_credit_card_expenses` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "recursive", "category_id", "payment_method_id", "created_at", "updated_at" from "operation" where ("operation"."payment_method_id" = 3 and 
    date("operation"."date", 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month')
    AND date("operation"."date", 'unixepoch', '-3 hours') < date('now', '-3 hours', '+1 month', 'start of month')
  );--> statement-breakpoint
CREATE VIEW `vw_expense` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "recursive", "category_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."is_income" = 0;--> statement-breakpoint
CREATE VIEW `vw_expense_with_category` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "recursive", "category_id", "category_name", "payment_method_id", "payment_method_name" from "vw_operation_with_category" where "vw_operation_with_category"."is_income" = 0;--> statement-breakpoint
CREATE VIEW `vw_income` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "recursive", "category_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."is_income" = 1;--> statement-breakpoint
CREATE VIEW `vw_income_with_category` AS select "id", "name", "description", "value", "date", "is_paid", "is_income", "recursive", "category_id", "category_name", "payment_method_id", "payment_method_name" from "vw_operation_with_category" where "vw_operation_with_category"."is_income" = 1;--> statement-breakpoint
CREATE VIEW `vw_operation_with_category` AS select "operation"."id", "operation"."name", "operation"."description", "operation"."value", "operation"."date", "operation"."is_paid", "operation"."is_income", "operation"."recursive", "operation"."category_id", category.name as "category_name", "operation"."payment_method_id", payment_method.name as "payment_method_name" from "operation" left join "category" on operation.category_id = category.id left join "payment_method" on operation.payment_method_id = payment_method.id;