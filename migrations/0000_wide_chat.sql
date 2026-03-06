CREATE TABLE `category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`is_income` integer NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `expense_limit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`value` integer,
	`start_date` integer DEFAULT (CURRENT_TIMESTAMP),
	`end_date` integer DEFAULT (CURRENT_TIMESTAMP),
	`category_id` integer,
	`period_id` integer,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`period_id`) REFERENCES `period`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `operation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`value` integer DEFAULT 0 NOT NULL,
	`parcelas` integer DEFAULT 1 NOT NULL,
	`date` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`is_paid` integer DEFAULT false NOT NULL,
	`is_income` integer DEFAULT false NOT NULL,
	`category_id` integer,
	`period_id` integer,
	`payment_method_id` integer,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`period_id`) REFERENCES `period`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `payment_method` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `period` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE VIEW `vw_credit_card_expenses` AS select "id", "name", "description", "value", "parcelas", "date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where ("operation"."payment_method_id" = 3 and 
    date("operation"."date", 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month')
    AND date("operation"."date", 'unixepoch', '-3 hours') < date('now', '-3 hours', '+1 month', 'start of month')
  );--> statement-breakpoint
CREATE VIEW `vw_expense_limit_with_category` AS select "expense_limit"."id", "expense_limit"."name", "expense_limit"."description", "expense_limit"."value", "expense_limit"."start_date", "expense_limit"."end_date", "expense_limit"."category_id", category.name as "category_name", "expense_limit"."period_id", period.name as "period_name" from "expense_limit" left join "category" on expense_limit.category_id = category.id left join "period" on expense_limit.period_id = period.id;--> statement-breakpoint
CREATE VIEW `vw_expense_balance` AS select "category_id", "category_name", CAST(SUM(value) AS INTEGER) as "total" from "vw_expense_with_category" where date(date, 'unixepoch', '-3 hours') >= date('now', '-3 hours', 'start of month') AND date(date, 'unixepoch', '-3 hours') < date('now', '-3 hours' , '+1 month', 'start of month') group by "vw_expense_with_category"."category_id" order by "vw_expense_with_category"."category_id";--> statement-breakpoint
CREATE VIEW `vw_expense_limit_balance` AS select "vw_expense_limit_with_category"."id", "vw_expense_limit_with_category"."name", "vw_expense_limit_with_category"."value", "vw_expense_limit_with_category"."period_id", "vw_expense_limit_with_category"."start_date", "vw_expense_limit_with_category"."end_date", "vw_expense_limit_with_category"."category_id" as "category_id", "vw_expense_limit_with_category"."category_name" as "category_name", "vw_expense_limit_with_category"."period_name" as "period_name", "total" from "vw_expense_limit_with_category" left join "vw_expense_balance" on "vw_expense_limit_with_category"."category_id" = "vw_expense_balance"."category_id";--> statement-breakpoint
CREATE VIEW `vw_expense` AS select "id", "name", "description", "value", "parcelas", "date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."is_income" = 0;--> statement-breakpoint
CREATE VIEW `vw_expense_with_category` AS select "id", "name", "description", "value", "parcelas", "date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at", "category_name", "period_name", "payment_method_name" from "vw_operation_with_category" where "vw_operation_with_category"."is_income" = 0;--> statement-breakpoint
CREATE VIEW `vw_income` AS select "id", "name", "description", "value", "parcelas", "date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."is_income" = 1;--> statement-breakpoint
CREATE VIEW `vw_income_with_category` AS select "id", "name", "description", "value", "parcelas", "date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at", "category_name", "period_name", "payment_method_name" from "vw_operation_with_category" where "vw_operation_with_category"."is_income" = 1;--> statement-breakpoint
CREATE VIEW `vw_investment` AS select "id", "name", "description", "value", "parcelas", "date", "is_paid", "is_income", "category_id", "period_id", "payment_method_id", "created_at", "updated_at" from "operation" where "operation"."category_id" = 6;--> statement-breakpoint
CREATE VIEW `vw_operation_with_category` AS select "operation"."id", "operation"."name", "operation"."description", "operation"."value", "operation"."parcelas", "operation"."date", "operation"."is_paid", "operation"."is_income", "operation"."category_id", "operation"."period_id", "operation"."payment_method_id", "operation"."created_at", "operation"."updated_at", category.name as "category_name", period.name as "period_name", payment_method.name as "payment_method_name" from "operation" left join "category" on operation.category_id = category.id left join "payment_method" on operation.payment_method_id = payment_method.id left join "period" on operation.period_id = period.id;