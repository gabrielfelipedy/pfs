ALTER TABLE `limits` RENAME TO `expense_limit`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expense_limit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`value` integer,
	`recursive` integer NOT NULL,
	`start_date` integer DEFAULT (CURRENT_TIMESTAMP),
	`end_date` integer DEFAULT (CURRENT_TIMESTAMP),
	`category_id` integer,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_expense_limit`("id", "name", "description", "value", "recursive", "start_date", "end_date", "category_id", "created_at", "updated_at") SELECT "id", "name", "description", "value", "recursive", "start_date", "end_date", "category_id", "created_at", "updated_at" FROM `expense_limit`;--> statement-breakpoint
DROP TABLE `expense_limit`;--> statement-breakpoint
ALTER TABLE `__new_expense_limit` RENAME TO `expense_limit`;--> statement-breakpoint
PRAGMA foreign_keys=ON;