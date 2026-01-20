ALTER TABLE `operation` ALTER COLUMN "value" TO "value" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `operation` ADD `parcelas` integer DEFAULT 1;--> statement-breakpoint
DROP VIEW `vw_credit_card_expenses`;--> statement-breakpoint
DROP VIEW `vw_expense`;--> statement-breakpoint
DROP VIEW `vw_income`;--> statement-breakpoint
DROP VIEW `vw_investment`;--> statement-breakpoint
CREATE VIEW `vw_credit_card_expenses` AS select "id", "name", "description", "value", "parcelas", "date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where ("operation"."payment_method_id" = 3 and 
    date("operation"."date", 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month')
    AND date("operation"."date", 'unixepoch', '-3 hours') < date('now', '-3 hours', '+1 month', 'start of month')
  );--> statement-breakpoint
CREATE VIEW `vw_expense` AS select "id", "name", "description", "value", "parcelas", "date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."is_income" = 0;--> statement-breakpoint
CREATE VIEW `vw_income` AS select "id", "name", "description", "value", "parcelas", "date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."is_income" = 1;--> statement-breakpoint
CREATE VIEW `vw_investment` AS select "id", "name", "description", "value", "parcelas", "date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."category_id" = 6;