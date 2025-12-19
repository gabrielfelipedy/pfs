ALTER TABLE `operation_two` RENAME TO `operation`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_operation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`value` integer,
	`date` integer DEFAULT (CURRENT_TIMESTAMP),
	`is_paid` integer,
	`is_income` integer,
	`category_id` integer,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_operation`("id", "name", "description", "value", "date", "is_paid", "is_income", "category_id", "created_at", "updated_at") SELECT "id", "name", "description", "value", "date", "is_paid", "is_income", "category_id", "created_at", "updated_at" FROM `operation`;--> statement-breakpoint
DROP TABLE `operation`;--> statement-breakpoint
ALTER TABLE `__new_operation` RENAME TO `operation`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP VIEW IF EXISTS `vw_expense`;--> statement-breakpoint
DROP VIEW IF EXISTS `vw_general_balance`;--> statement-breakpoint
DROP VIEW IF EXISTS `vw_income`;--> statement-breakpoint
DROP VIEW IF EXISTS `vw_total_expense_by_day`;--> statement-breakpoint
DROP VIEW IF EXISTS `vw_total_expense_by_daymonth`;--> statement-breakpoint
DROP VIEW IF EXISTS `vw_total_expense_by_month`;--> statement-breakpoint
DROP VIEW IF EXISTS `vw_total_expense_by_week`;--> statement-breakpoint
DROP VIEW IF EXISTS `vw_total_income_by_daymonth`;