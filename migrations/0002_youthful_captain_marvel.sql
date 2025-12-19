PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_operation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`value` integer,
	`date` text DEFAULT (CURRENT_TIMESTAMP),
	`is_paid` integer,
	`is_income` integer,
	`category_id` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_operation`("id", "name", "description", "value", "date", "is_paid", "is_income", "category_id", "created_at", "updated_at") SELECT "id", "name", "description", "value", "date", "is_paid", "is_income", "category_id", "created_at", "updated_at" FROM `operation`;--> statement-breakpoint
DROP TABLE `operation`;--> statement-breakpoint
ALTER TABLE `__new_operation` RENAME TO `operation`;--> statement-breakpoint
PRAGMA foreign_keys=ON;